/**
 * v-swiper2
 *  - http://idangero.us/swiper 용 directive
 *  - 자체적으로 v-swiper directive 제공하나, 좀 더 간편한 사용을 위해 v-swiper2 로 customizing
 */
import _ from 'lodash'
import directiveUtil from './directiveUtil'

const CHANGE_EVENTS = [
  'slideChangeTransitionStart',
  'transitionStart',
  'sliderMove',
  'transitionEnd'
]

export default {
  bind(el, binding, vnode) {
    if (el.className.indexOf('swiper-container') === -1) el.classList.add('swiper-container')
    if (el.className.indexOf('v-swiper2') === -1) el.classList.add('v-swiper2')

    initSwiper(el, binding, vnode)
    initEvent(el, vnode)

    /* if (_.indexOf(el.classList, 'pager') >= 0 && _.indexOf(el.classList, 'col3') === -1) {
      console.log('@@@@@ bind', el.swiper.slides)
    }  */

    el.addEventListener('update', function (e) {
      const swiper = e.target.swiper
      if (!_.isNil(swiper)) swiper.update()
    })

    el.addEventListener('reset', function (e) {
      const swiper = e.target.swiper

      if (!_.isNil(swiper)) {
        binding.value = _.merge({}, binding.value, swiper.options)
        delete swiper.options

        resetSwiper(el, binding, vnode)
      }
    })
  },

  componentUpdated(el, binding, vnode) {
    // resetSwiper(el, binding, vnode)

    /* if (_.indexOf(el.classList, 'pager') >= 0 && _.indexOf(el.classList, 'col3') === -1) {
      console.log('@@@@@ componentUpdated', el)
    } */

    if (el.swiper) {
      const swiper = el.swiper
      const device = !directiveUtil.isMobile(vnode) ? 'pc' : 'mobile'

      if (swiper.params.loop) el.swiper.loopDestroy() // 복제 slide 삭제

      // 초기 options 받아 instance의 params와 병합하여 하여 initSwiper > importantOptions 의해 변경된 options 복구
      _.merge(swiper.params, importantOptions(el, device, swiper.defaultOptions, vnode))

      if (swiper.pagination) el.swiper.pagination.init()  // 페이징 초기화
      if (swiper.params.loop) el.swiper.loopCreate()      // 복제 slide 생성

      swiper.update() // updateSize(), updateSlides(), updateProgress(), updateSlidesClasses()

      afterModifySwiper(swiper) // 레이아웃 재정의
      initGallery(el)

      if (swiper.realIndex !== getPageInfo(swiper).idx) { // realIndex속성과 실제idx가 다르면 내부 loopCreate()로 인한 paging 어그러진것으로 판단
        const idx = swiper.params.initialSlide + (swiper.params.loop) ? swiper.loopedSlides : 0
        swiper.slideTo(idx, 0) // 맨앞으로 초기화
      }
    }

    // 동영상 (youtube, vimeo 등) Play 중 이동하는 경우
    // player handling 하기 어려워.. v-if 통해 destroy 처리로 대신
    // 이때, activeIndex 를 유지하기 위한 처리 필요
    if (_.result(el, 'swiper.params.keepActiveIndexOnUpdate') === true) {
      const activeIndex = swiper.activeIndex
      if (activeIndex < swiper.slides.length) swiper.slideTo(activeIndex, 0)
    }
  },

  unbind(el, binding, vnode) {
    deleteSwiper(el, binding, vnode)
  }
}

function getDefaultOptions(el, device, vnode) {
  let options
  let $el = $(el)

  const defaultOptions = {
    roundLengths : true,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    // touchStartForcePreventDefault: true, //기본 preventDefault 적용
    on: {
      observerUpdate: function (e) {
        if (e.type === 'attributes' && _.indexOf(e.target.classList, 'page-enter-active') >= 0) {
          this.el.dispatchEvent(new CustomEvent('reset')) // history back 대응 (#editablePageContents 화면은 각자 mounted 에서 대응)
        }

        if (e.type === 'childList' && _.indexOf(e.target.classList, 'swiper-container') >= 0) {
          if (!_.isNil(_.result(e.target, 'swiper'))) onChange(e.target.swiper, 'init') // init 대신
        }
      },
      click : function (e) {
        // HC326 20.03.02 @click 대응
        if (_.indexOf(_.result(this, 'clickedSlide.classList'), 'swiper-slide-duplicate') >= 0) {
          const slide = this.clickedSlide
          const clickIdx =  slide.dataset.swiperSlideIndex
          const realSlide = _.head(_.at(_.result(vnode, 'children[0].children'), clickIdx))

          // 자식에 a 가 있으면 진행 안함
          if (_.isNil(slide) || slide.querySelectorAll('a').length > 0) return

          if (!_.isNil(_.get(realSlide, 'data.on.click.fns'))) {
            let evt

            if (e.type === 'mouseup') {
              evt = e
            } else if (e.type === 'touchend') {
              evt = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
              })
            }

            if (evt) realSlide.data.on.click.fns(evt)
          }
        }
      }
    }
  }

  switch (device) {
    case 'pc' :
    // rolling_wrap : 탑영역 인기검색어 TOP10 (HOT ~)
      if ($el.hasClass('notice_list') || $el.hasClass('rolling_wrap') || $el.hasClass('vertical')) {
        options = {direction: 'vertical', slidesPerView: 1, loop: true, autoplay: {delay: 2500}}

      } else if ($el.hasClass('gallery-top')) {
        options = {
          effect: 'fade',
          pagination: {
            el: $el.find('.total').eq(0),
            type: 'fraction'
          }
        }

      } else if ($el.hasClass('gallery-thumbs')) {
        options = {
          slidesPerView: 'auto',
          slidesPerGroup: $el.hasClass('room_photo') ? 9 : 5,
          // 5 허니문 갤러리(CHPC0PKG0039P201)
          // 9 호텔상세(CHPC0HTL0200M200 > CHPC0HTL0204S200), 골프장정보(CHPC0PKG0302P200) 갤러리 스와이퍼
          watchSlidesVisibility: true,
          watchSlidesProgress: true
        }

      } else if ($el.hasClass('award_list') || $el.hasClass('js_tabs type2')) {
        if ($el.hasClass('js_tabs type2 schdSw')) {
        // 2019.10.02 - 패키지일정표 일차별 스와이퍼 전용
          if ($el.find('.swiper-slide').length > 10) {
            $el.addClass('overflow')

            options = {slidesPerView: 11, loop: false, navigation: {
              nextEl: $el.find('.next').eq(0),
              prevEl: $el.find('.prev').eq(0)
            }}
          } else {
            options = {slidesPerView: 10, loop: false, navigation: {
              nextEl: $el.find('.btn_next').eq(0),
              prevEl: $el.find('.btn_prev').eq(0)
            }}
          }
        } else {
          if ($el.hasClass('js_tabs type2') && $el.find('.swiper-slide').length > 10) {
            $el.addClass('overflow')

            options = {slidesPerView: 11, loop: true, navigation: {
              nextEl: $el.find('.next').eq(0),
              prevEl: $el.find('.prev').eq(0)
            }}
          } else if (!$el.hasClass('js_tabs type2') && !$el.find('.swiper-slide').length < 10) {
            options = {slidesPerView: 4, loop: true, navigation: {
              nextEl: $el.find('.btn_next').eq(0),
              prevEl: $el.find('.btn_prev').eq(0)
            }}
          }
        }
      } else {
      // col3 => 3 반환, col[n] 의미는 화면에 보이는 갯수
        let col = _.defaultTo($el.attr('class').match(/col\d(?=\s)|col\d$/i), 1)
        if (_.isArray(col)) col = parseInt(col[0].substr(-1))

        if ($el.hasClass('page') && $el.hasClass('prevNext') && $el.hasClass('pager')) {
          if ($el.hasClass('control')) {
            options = {slidesPerView: 1, spaceBetween: 0, autoplay: {delay: 1700},
              pagination: {
                el: $el.find('.swiper-pagination').eq(0),
                clickable: true
              },
              navigation: {
                nextEl: $el.find('.next').eq(0),
                prevEl: $el.find('.prev').eq(0)
              },
              centeredSlides: true
            }
          }
        } else if ($el.hasClass('page') && $el.hasClass('prevNext')) {
          options = {slidesPerView: 1, spaceBetween: 60, loop: true,
            pagination: {
              el: $el.find('.swiper-pagination').eq(0),
              clickable: true
            },
            navigation: {
              nextEl: $el.find('.next').eq(0),
              prevEl: $el.find('.prev').eq(0)
            }
          }
        } else if ($el.hasClass('prevNext') && $el.hasClass('pager')) {
          if (col === 3 && $el.hasClass('control')) {
            options = {slidesPerView: col, spaceBetween: 0, loop: true, autoplay: {delay: 1700},
              pagination: {
                el: $el.find('.total').eq(0),
                type: 'fraction'
              },
              navigation: {
                nextEl: $el.find('.next').eq(0),
                prevEl: $el.find('.prev').eq(0)
              }
            }

          } else {
            options = {slidesPerView: 1, spaceBetween: 0, loop: true,
              pagination: {
                el: $el.find('.total').eq(0),
                type: 'fraction'
              },
              navigation: {
                nextEl: $el.find('.next').eq(0),
                prevEl: $el.find('.prev').eq(0)
              }
            }

            // main 퀵서치 오른쪽 스와이프 (CHPC0MAN0001S201), 각 서브메인 비주얼
            if ($el.hasClass('control')) options.autoplay = {delay: 4000}
          }
        } else if ($el.hasClass('page')) {
        // 기획전 mkt/fet/PL????????
        // 호텔 메인 3개 묶음 1개씩 이동 배너(CHPC0AIR0001S203)

          options = {
            slidesPerView: col,
            slidesPerGroup: 1,
            spaceBetween: (col > 1) ? 25 : 10,
            // noLoop 항공메인에만 들어감, col:2 는 CHPC0AIR0001S204 디자인 변경 전이며 prevNext 추가되며 여기서 배제
            loop: !((col === 4 || col === 2) && $el.hasClass('noLoop')),
            pagination: {
              el: $el.find('.swiper-pagination').eq(0),
              clickable: true
            }
          }

          // roundLengths: true 시 소수점 없어지며 loop 되지 않는 문제 해결
          if (options.loop && options.slidesPerView > 1) options.normalizeSlideIndex = false

        } else if ($el.hasClass('prevNext')) {
          options = {slidesPerView: col, spaceBetween: (col > 1) ? 24 : 10, loop: true, navigation: {
            nextEl: $el.find('.next').eq(0),
            prevEl: $el.find('.prev').eq(0)
          }}
        } else {}
      }

      break
    case 'mobile' :
      if ($el.hasClass('js_spinner')) {
      // 전시 시작일 팝업(CHPC0PKG0018M100 > CHPC0PKG0017P100)
        options = {direction: 'vertical', slidesPerView: 3, centeredSlides: true}

      } else if ($el.hasClass('fraction')) {
        options = {slidesPerView: 1, spaceBetween: 12, loop: true, pagination: {
          el: $el.find('.swiper-pagination').eq(0),
          type: 'fraction'
        }}

      } else if ($el.hasClass('cir')) {
        options = {slidesPerView: 3, centeredSlides: true, loop: true, pagination: {
          el: $el.find('.swiper-pagination').eq(0),
          clickable: true
        }}

      } else if ($el.hasClass('bar')) {
      // 패키지메인 테마여행 Pick(CHPC0MAN0001S102), 항공메인(CHPC0COP0001M100)
        options = {slidesPerView: 1, spaceBetween: 0, loop: false, centeredSlides: true, pagination: {
          el: $el.find('.swiper-pagination').eq(0),
          type: 'progressbar'
        }}

      } else if ($el.hasClass('nospace')) {
        options = {slidesPerView: 1, spaceBetween: 10, loop: true, pagination: {
          el: $el.find('.swiper-pagination').eq(0)
        }}
      } else if ($el.hasClass('gallery-top')) {
        options = {
          effect: 'fade',
          spaceBetween: 4,
          loop: true,
          loopedSlides: 5
        }
      } else if ($el.hasClass('gallery-thumbs')) {
        options = {
          spaceBetween: 4,
          slidesPerView: 4,
          loop: true,
          freeMode: true,
          loopedSlides: 5,
          watchSlidesVisibility: true,
          watchSlidesProgress: true
        }
      } else if ($el.hasClass('nopaging')) {
      // 호텔메인 최근검색(CHPC0HTL0001S107)
        options = {slidesPerView: 1, spaceBetween: 12, loop: false}

      } else if ($el.hasClass('vertical')) {
        options = {direction: 'vertical', loop: true, autoplay: {delay: 2500}}

      } else if ($el.hasClass('control')) {
        if ($el.hasClass('main')) {
          options = {slidesPerView: 1, loop: true, autoplay: {delay: 1700}, pagination: {
            el: $el.find('.swiper-pagination').eq(0),
            type: 'fraction'
          }}
        } else {
          options = {slidesPerView: 1, spaceBetween: 10, loop: true, autoplay: {delay: 1700}, pagination: {
            el: $el.find('.swiper-pagination').eq(0),
            clickable: true
          }}
        }
      } else if ($el.hasClass('calendar_wrap')) {
        options = {slidesPerView: 1, spaceBetween: 10, loop: true, navigation: {
          nextEl: $el.find('.next').eq(0),
          prevEl: $el.find('.prev').eq(0)
        }}

      } else {
        options = {slidesPerView: 1, spaceBetween: 10, loop: true, pagination: {
          el: $el.find('.swiper-pagination').eq(0)
        }}
      }

      break
    default :
  } // end switch

  return _.merge({}, options, defaultOptions)
}

// swiper 삭제
function deleteSwiper(el, binding, vnode) {
  const swiper = el.swiper

  if (_.isNil(swiper)) return

  if (swiper.params.exChange) delete swiper.params.exChange
  if (swiper.params.init) swiper.destroy(false, true)

  const instanceName = directiveUtil.getInstanceName(el, binding, vnode)
  if (instanceName) delete vnode.context[instanceName]

  // Swiper 에 control 이 있는 경우 (stop/play) 처리 - 이벤트 off 처리
  // if ($(el).hasClass('control')) $(el).find('.control .btn_cntrl').off('click') //20.03.04 HC326 파괴되고 생성 안될일은 없기에 주석처리
}

// swiper 초기화
function initSwiper(el, binding, vnode) {
  const instanceName = directiveUtil.getInstanceName(el, binding, vnode)
  // const isMobile = _.get(window.$nuxt.$store.state, 'device.type', 'pc') === 'mobile'
  const device = !directiveUtil.isMobile(vnode) ? 'pc' : 'mobile'

  let swiperOptions = _.merge({},
    getDefaultOptions(el, device, vnode),
    binding.value)

  const opts = _.merge({}, swiperOptions, importantOptions(el, device, swiperOptions, vnode))

  const swiper = new Swiper(el, opts)
  $(el).data('swiper', swiper)

  swiper.defaultOptions = swiperOptions // componentUpdated 활용할 기본 options

  if (instanceName) vnode.context[instanceName] = swiper // v-swiper가 위치한 컴포넌트에 binding.arg 네임으로 swiper 인스턴트 참조하도록 정의
  if (!_.isNil(swiper)) afterModifySwiper(swiper, device) // HC326 20.03.03

  initGallery(el)
}

// swiper 재생성
function resetSwiper(el, binding, vnode) {
  deleteSwiper(el, binding, vnode)
  initSwiper(el, binding, vnode)
  initEvent(el, vnode)
}

// 갤러리 형태 공통
function initGallery(el) {
  const swiper = el.swiper

  if (_.isNil(swiper)) return

  let galleryTopSwiper
  if (_.indexOf(el.classList, 'gallery-top') >= 0) { // 갤러리 상단
    galleryTopSwiper = swiper
    swiper.$el.find('.prev, .next').off('click').on('click', function (e) { // dom7
      const target = e.currentTarget
      const topSwiper = target.closest('.swiper-container').swiper
      const thumbsSwiper = topSwiper.thumbs.swiper

      if (!topSwiper || !thumbsSwiper) return

      if (_.indexOf(target.classList, 'prev') >= 0) {
        topSwiper.slidePrev()
      } else {
        topSwiper.slideNext()
      }

      thumbsSwiper.slideTo(topSwiper.realIndex)

      e.preventDefault()
    })
  } else if (_.indexOf(el.classList, 'gallery-thumbs') >= 0) { // 갤러리 섭네일
    swiper.$el.find('.prev, .next').off('click').on('click', function (e) { // dom7
      const target = e.currentTarget
      const thumbsSwiper = target.closest('.swiper-container').swiper
      const topSwiper = thumbsSwiper.top.swiper

      if (!topSwiper || !thumbsSwiper) return

      const currentIdx = thumbsSwiper.realIndex || 0
      const totalIdx = thumbsSwiper.slides.length - 1
      const groupNum = thumbsSwiper.params.slidesPerGroup

      let goIdx
      let n = groupNum
      if (_.indexOf(target.classList, 'prev') >= 0) {
        const toIdx = currentIdx // prev 때는 realIndex가 목적지 idx
        const isMiddle = toIdx % totalIdx > 0 && toIdx > groupNum // 배수가 아니고 첫 페이지보다 크면
        goIdx = Math.max(0, !isMiddle ? toIdx - groupNum : toIdx)

        while (n--) {
          topSwiper.slidePrev()
        }
      } else {
        goIdx = Math.min(totalIdx, currentIdx + groupNum)

        while (n--) {
          topSwiper.slideNext()
        }
      }

      thumbsSwiper.slideTo(goIdx)

      e.preventDefault()
    })
  }
}

// 초기화 전 optons 가공용
function importantOptions(el, device, options, vnode) {
  const slideLength = getSlideLength(el)
  const slidePerView = options.slidesPerView || 1
  const isOneSlide = slidePerView !== 'auto' && slideLength <= slidePerView // 초기화 되기전 slide 갯수 1개 이거나
  // const isCalendar = _.indexOf(el.classList, 'calendar_wrap') >= 0 //달력에 autoplay가 필요한지 모르겠음

  let returnObject = {
    resistanceRatio : isOneSlide ? 0 : _.result(options, 'resistanceRatio', 0.85), // slide가 1개일때 터치 반응 않하도록 설정
    // loop : !(!isCalendar && isOneSlide),
    // autoplay: (!isCalendar && isOneSlide) ? false : options.autoplay
    loop : isOneSlide ? false : options.loop,
    autoplay: isOneSlide ? false : options.autoplay
  }

  /* if (_.indexOf(el.classList, 'pager') >= 0 && _.indexOf(el.classList, 'col3') === -1) {
    console.log(el)
  } */

  // autoplay가 설정되어 있으면 disableOnInteraction 무조건 false 처리(스와이프 시 autoplay 정지하지 않는 옵션)
  if (returnObject.autoplay === true || !_.isNaN(parseInt(_.get(returnObject, 'autoplay.delay')))) {
    _.set(returnObject, 'autoplay.disableOnInteraction', false) // autoplay가 true 경우도 {} 화되면 true 로 인정
  }

  return returnObject
}

// 추가 swiper layout 로직
function afterModifySwiper(swiper, device) {
  const container = swiper.el
  const slideLength = getSlideLength(swiper.el)
  const slidePerView = swiper.params.slidesPerView
  const isOneSlide = ((slidePerView !== 'auto' && slideLength <= slidePerView)) // 실제 .swiper-slide 가 보여지는 갯수보다 같거나 작으면
  const isCalendar = _.indexOf(swiper.el.classList, 'calendar_wrap') >= 0

  if (!_.isNil(_.result(swiper, 'pagination.el')) && !isCalendar) {
    const pageElm = swiper.pagination.el
    const isContoller = !_.isNil(container.querySelector('.control')) // swiper-container 내 .control 묶음있으면 (모바일 대응)
    const pagination = isContoller ? container.querySelector('.control') : pageElm // .control //아니면 자신

    pagination.style.visibility = isOneSlide ? 'hidden' : 'visible' // 페이징이나 컨트롤러 숨기거나 보이기
    if (!_.isNil(container.querySelector('.total'))) container.querySelector('.total').style.visibility = pagination.style.visibility

    if (isContoller) { // 재생 & 정지 버튼 로직
      const playBtn = container.querySelector('.control .btn_cntrl')
      const prevBtn = _.result(swiper, 'navigation.prevEl')
      const nextBtn = _.result(swiper, 'navigation.nextEl')

      if (!_.isNil(playBtn)) {
        playBtn.removeEventListener('click', palyBtnHandler)
        playBtn.addEventListener('click', palyBtnHandler)
      }

      if (!_.isNil(prevBtn) && !_.isNil(nextBtn)) {
        prevBtn.removeEventListener('click', prevNextBtnHandler)
        prevBtn.addEventListener('click', prevNextBtnHandler)
        nextBtn.removeEventListener('click', prevNextBtnHandler)
        nextBtn.addEventListener('click', prevNextBtnHandler)
      }
    }
  }
  /* swiper.el.style.pointerEvents = isOneSlide ? 'none' : ''
  swiper.wrapperEl.style.pointerEvents = isOneSlide ? 'none' : ''
  _.forEach(swiper.slides, item => item.style.pointerEvents = isOneSlide ? 'none' : '') */

  switch(device) {
    case 'pc' :
    // .swiper-slide 속에 a 태그 없으면 커서 pointer 로
      _(_.filter(swiper.slides, item => _.isNil(item.querySelector('a')))).valueOf().map(item => {
        item.style.cursor = 'pointer'
      })

      break
    case 'mobile' :
    //
      break
    default :
  }
}

// 네비게이션 클릭 이벤트 (onChange 에서 paly/stop 판단해서 정지)
function prevNextBtnHandler(e) {
  const target = e.currentTarget
  const container = target.closest('.swiper-container')
  const playBtn = !_.isNil(container) ? container.querySelector('.btn_cntrl') : null

  if (_.isNil(playBtn)) return

  // playBtn.classList.add('stop')
}

// 재생 & 정지 버튼 로직 ( 이전 / 다음 버튼에 클릭 시 재생버튼 컨트롤을 각페이지에서 처리한 경우가 있음.. 예] 메인 )
function palyBtnHandler(e) {
  const target = e.currentTarget
  const container = target.closest('.swiper-container')

  if (_.isNil(container)) return

  const swiper = container.swiper

  if (swiper.autoplay.running) { // 재생중이면
    target.classList.add('stop')
    swiper.autoplay.stop()
  } else {
    target.classList.remove('stop')
    swiper.autoplay.start()
  }

  e.preventDefault()
}

// envet 추가 등록
function initEvent(el, vnode) {
  // v-on 대응
  if (_.isPlainObject(_.result(vnode, 'data.on'))) {
    _.forOwn(vnode.data.on, function (val, key, obj) {
      el.swiper.on(key, val)
    })
  }

  // onChange 호출할 이벤트 추가 등록
  _.forEach(CHANGE_EVENTS, function (eventName) {
    el.swiper.on(eventName, function () {
      onChange(this, eventName)
    })
  })
}

// 복제 제외한 슬라이드 갯수 반환
function getSlideLength(el) {
  return _.filter(el.querySelectorAll('.swiper-slide'), item => _.indexOf(item.classList, 'swiper-slide-duplicate') < 0).length
}

// 페이징 정보 반환
function getPageInfo(swiper) {
  let idx = 0

  // if (_.indexOf(_.get(swiper.pagination, 'el.classList'), 'swiper-pagination-bullets') >= 0) {
  // max = swiper.pagination.bullets.length || 1
  // idx = _.findIndex(swiper.pagination.bullets, (item, idx) => _.indexOf(item.classList, 'swiper-pagination-bullet-active') >= 0) || 0
  // } else {
  const max = getSlideLength(swiper.el) || 1

  const activeSlideElm = _(_.filter(swiper.slides, item => _.indexOf(item.classList, 'swiper-slide-active') >= 0)).chain().head().valueOf()

  if (!_.isNil(activeSlideElm)) {
    const idxAttr = parseInt(activeSlideElm.getAttribute('data-swiper-slide-index'))
    if (!_.isNaN(idxAttr)) idx = idxAttr
  }
  // }
  return {idx, max}
}

function onChange(swiper, type) {
  const container = swiper.el

  // 복제 slide @click.prevnet 대응
  if (type === 'init') {
    _.forEach(swiper.slides, item => {
      if (_.indexOf(item.classList, 'swiper-slide-duplicate') >= 0) {
        const link = item.getAttribute('href')
        if (!_.isNil(link) && link === '#') {
          item.addEventListener('click', function (e) {
            e.preventDefault()
          })
        }
      }
    })
  }

  const pageInfo = getPageInfo(swiper)

  // .total 부분 페이징
  const totalElm = container.querySelector('.total')
  if (!_.isNil(totalElm)) {
    const suffix = _.indexOf(totalElm.classList, 'space') >= 0 ? ' / ' : '/'
    totalElm.innerHTML = '<span>' + (pageInfo.idx + 1) + '</span>' + suffix + '<span>' + pageInfo.max + '</span>'
  }

  // observerUpdate에 의한 재초기화 시 autoplay 설정되어 있다면 play
  if (type === 'init' && _.get(swiper, 'defaultOptions.autoplay') === true || !_.isNaN(parseInt(_.get(swiper, 'defaultOptions.autoplay.delay')))) {
    swiper.autoplay.start()
  }

  // const isContoller = _.indexOf(pageElm.parentElement.classList, 'control') >= 0  //부모가 .control 묶음이면
  const isContoller = !_.isNil(container.querySelector('.control')) // swiper-container 내 .control 묶음있으면 (모바일 대응)
  if (isContoller) {
    const playBtn = container.querySelector('.control .btn_cntrl')

    if (!_.isNil(playBtn) && _.indexOf(playBtn.classList, 'stop') >= 0) {
      // 플레이버튼이 stop 상태면 재생하지 않음 (autoplay.disableOnInteraction: false에 대한 동기화)
      swiper.autoplay.stop()
    }
  }

  if (swiper.params.exChange && type !== 'init') swiper.params.exChange(swiper, type, pageInfo)
}
