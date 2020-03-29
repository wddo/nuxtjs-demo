const CHANGE_EVENTS = [
  'slideChangeTransitionStart',
  'transitionStart',
  'sliderMove',
  'transitionEnd'
]

export default {
  bind(el, binding, vnode) {
    initSwiper(el, binding, vnode)
    initEvent(el, vnode)

    console.log('!!!!! bind', _.join(el.classList, ', '))

    el.addEventListener('update', function(e) {
      const swiper = e.target.swiper
      if (!_.isNil(swiper)) swiper.update()
    })

    el.addEventListener('reset', function(e) {
      const swiper = e.target.swiper

      if (!_.isNil(swiper)) {
        binding.value = _.merge({}, binding.value, swiper.options)
        delete swiper.options

        resetSwiper(el, binding, vnode)
      }
    })
  },
  componentUpdated(el, binding, vnode, oldVnode) {
    resetSwiper(el, binding, vnode)

    console.log('!!!!! componentUpdated', _.join(el.classList, ', ')/* , binding, vnode */)

    /* if (el.swiper) {
      el.swiper.update()
      if (el.swiper.pagination) el.swiper.pagination.init()
    } */
  },
  unbind: function(el, binding, vnode) {
    deleteSwiper(el, binding, vnode)
  }
}

function getDefaultOptions(el, vnode) {
  return {
    roundLengths: true,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    on: {
      observerUpdate: function(e) {
        if (e.type === 'attributes' && _.indexOf(e.target.classList, 'page-enter-active') >= 0) {
          this.el.dispatchEvent(new CustomEvent('reset')) // history back 대응
        }

        if (e.type === 'childList' && _.indexOf(e.target.classList, 'swiper-container') >= 0) {
          if (!_.isNil(_.result(e.target, 'swiper'))) onChange(e.target.swiper, 'init') // init 대신
        }
      },
      click: function(e) {
        // @click 대응
        if (_.indexOf( _.result(this, 'clickedSlide.classList'), 'swiper-slide-duplicate') >= 0) {
          const slide = this.clickedSlide
          const clickIdx = slide.dataset.swiperSlideIndex
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
}

// swiper 삭제
function deleteSwiper(el, binding, vnode) {
  const swiper = el.swiper

  if (_.isNil(swiper)) return

  if (swiper.params.exChange) delete swiper.params.exChange
  if (swiper.params.init) swiper.destroy(false, true)
}

// swiper 초기화
function initSwiper(el, binding, vnode) {
  let swiperOptions = _.merge({},
    getDefaultOptions(el, vnode),
    binding.value)

  _.merge(swiperOptions, importantOptions(el, swiperOptions, vnode))

  const swiper = new Swiper(el, swiperOptions)

  if (!_.isNil(swiper)) afterModifySwiper(swiper)

  initGallery(el)
  fixObjectfit(el)
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
function importantOptions(el, options, vnode) {
  const slideLength = el.querySelectorAll('.swiper-slide').length
  const slidePerView = options.slidesPerView
  const isOneSlide = slidePerView !== 'auto' && slideLength <= slidePerView // 초기화 되기전 slide 갯수 1개 이거나
  // const isCalendar = _.indexOf(el.classList, 'calendar_wrap') >= 0 //달력에 autoplay가 필요한지 모르겠음

  let returnObject = {
    resistanceRatio : isOneSlide ? 0 : _.result(options, 'resistanceRatio', 0.85), // slide가 1개일때 터치 반응 않하도록 설정
    // loop : !(!isCalendar && isOneSlide),
    // autoplay: (!isCalendar && isOneSlide) ? false : options.autoplay
    loop : isOneSlide ? false : options.loop,
    autoplay: isOneSlide ? false : options.autoplay
  }

  // autoplay가 설정되어 있으면 disableOnInteraction 무조건 false 처리(스와이프 시 autoplay 정지하지 않는 옵션)
  if (returnObject.autoplay === true || !_.isNaN(parseInt(_.get(returnObject, 'autoplay.delay')))) {
    _.set(returnObject, 'autoplay.disableOnInteraction', false) // autoplay가 true 경우도 {} 화되면 true 로 인정
  }

  return returnObject
}

// 추가 swiper layout 로직
function afterModifySwiper(swiper, device) {
  const container = swiper.el
  const slideLength = swiper.slides.length
  const slidePerView = swiper.params.slidesPerView
  const isOneSlide = (!swiper.params.loop && // loop:false 시 (loop:true 면 기본 swiper.slides 3개)
                      (slidePerView !== 'auto' && slideLength <= slidePerView)) // 실제 .swiper-slide 가 보여지는 갯수보다 같거나 작으면
  const isCalendar = _.indexOf(swiper.el.classList, 'calendar_wrap') >= 0

  if (!_.isNil(_.result(swiper, 'pagination.el')) && !isCalendar) {
    const pageElm = swiper.pagination.el
    // const isContoller = _.indexOf(pageElm.parentElement.classList, 'control') >= 0  //부모가 .control 묶음이면
    const isContoller = !_.isNil(container.querySelector('.control')) // swiper-container 내 .control 묶음있으면 (모바일 대응)
    // const pagination = isContoller ? pageElm.parentElement : pageElm //대상을 부모로 //아니면 자신
    const pagination = isContoller ? container.querySelector('.control') : pageElm // .control //아니면 자신

    pagination.style.visibility = isOneSlide ? 'hidden' : 'visible' // 페이징이나 컨트롤러 숨기거나 보이기
    if (!_.isNil(container.querySelector('.total'))) container.querySelector('.total').style.visibility = pagination.style.visibility

    if (isContoller) { // 재생 & 정지 버튼 로직
      // const playBtn = pageElm.parentElement.querySelector('.btn_cntrl')
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

function onChange(swiper, type) {
  const container = swiper.el
  const pagination = swiper.pagination
  const pageElm = pagination.el
  let max
  let idx

  // 복제 slide @click.prevnet 대응
  if (type === 'init') {
    _.forEach(swiper.slides, item => {
      if (_.indexOf(item.classList, 'swiper-slide-duplicate') >= 0) {
        const link = item.getAttribute('href')
        if (!_.isNil(link) && link === '#') {
          item.addEventListener('click', function(e) {
            e.preventDefault()
          })
	      }
      }
    })
  }

  if (!_.isNil(_.result(pagination, 'el'))) {
    if (_.indexOf(pageElm.classList, 'swiper-pagination-bullets') >= 0) {
      max = pagination.bullets.length || 1
      idx = _.findIndex(pagination.bullets, (item, idx) => _.indexOf(item.classList, 'swiper-pagination-bullet-active') >= 0) || 0
    } else {
      max = _.filter(swiper.slides, (item, idx) => _.indexOf(item.classList, 'swiper-slide-duplicate') < 0).length || 1
      idx = 0

      const activeSlideElm = _(_.filter(swiper.slides, (item, idx) => _.indexOf(item.classList, 'swiper-slide-active') >= 0)).chain().head().valueOf()

      if (!_.isNil(activeSlideElm)) {
        const idxAttr = parseInt(activeSlideElm.getAttribute('data-swiper-slide-index')) || swiper.realIndex
        if (!_.isNaN(idxAttr)) idx = idxAttr
      }
    }

    // .total 부분 페이징
    const totalElm = container.querySelector('.total')
    if (!_.isNil(totalElm)) {
      const suffix = _.indexOf(totalElm.classList, 'space') >= 0 ? ' / ' : '/'
      totalElm.innerHTML = '<span>' + (idx + 1) + '</span>' + suffix + '<span>' + max + '</span>'
    }

    // type fraction 는 조작없이 동작하여 제외
    if (_.indexOf(pageElm.classList, 'swiper-pagination-fraction') >= 0) {}

    // const isContoller = _.indexOf(pageElm.parentElement.classList, 'control') >= 0  //부모가 .control 묶음이면
    const isContoller = !_.isNil(container.querySelector('.control')) // swiper-container 내 .control 묶음있으면 (모바일 대응)
    if (isContoller) {
      const playBtn = container.querySelector('.control .btn_cntrl')

      // observerUpdate에 의한 재초기화 시 autoplay 설정되어 있다면 play
      if (type === 'init' && _.get(swiper, 'params.autoplay') === true || !_.isNaN(parseInt(_.get(swiper, 'params.autoplay.delay')))) {
        swiper.autoplay.start()
      }

      if (!_.isNil(playBtn) && _.indexOf(playBtn.classList, 'stop') >= 0) {
        // 플레이버튼이 stop 상태면 재생하지 않음 (autoplay.disableOnInteraction: false에 대한 동기화)
        swiper.autoplay.stop()
      }
    }
  }

  if (swiper.params.exChange && type !== 'init') swiper.params.exChange(swiper, type, {idx, max})
}

// object-fit IE 대응
function fixObjectfit(el) {
  $nuxt.$nextTick(function() {
    if (!process.client || _.isNil(_.result(document, 'documentElement.style')))
      return

    if ('objectFit' in document.documentElement.style === false) {
      Array.prototype.forEach.call(
        el.querySelectorAll('.swiper-slide img'),
        function(image) {
          // data-object-fit 초기화
          if (image.src.indexOf('data:') === 0) {
            image.src = image.style.backgroundImage.replace(
              /^url|[\("|'\"|')]/g,
              ''
            )
            image.style.background = ''
          }

          // data-object-fit 정의
          image.style.background = `url("${image.src}") no-repeat 50% / cover`
          image.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${image.width}' height='${image.height}'%3E%3C/svg%3E`
        }
      )
    }
  })
}
