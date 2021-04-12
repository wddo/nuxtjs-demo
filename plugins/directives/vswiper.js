/**
 * [bug report] //기본 상태(non data binding), 바인딩 상태(exChange > data binding > componentUpdated)
 *  -fix- next 방향으로 이동시 loop 안되는 문제 (loopAdditionalSlides를 slidePerView 수만큼 지정해서 해결)
 *  -fix- loop:false 에서 true로 변경되면 복사된 이전 slide 남아있는 경우 (_.debounce 로 딜레이 줘서 데이터 변경 후 update 타도록 수정)
 *  -fix- loop:false 에서 true로 변경되면 navigation의 disabled 클래스 변경 안되는 문제 (componentUpdated > update 루트에서 swiper.navigation.destroy()로 해결)
 *  -fix- loop:false 에서 true로 변경되면 슬라이더가 첫번째가 아닌 문제
 *        (componentUpdated에 el.swiper.params.loop !== _.get(swiperOptions, 'loop') 추가하여 resetSwiper 타도록 하여 해결)
 *  -fix- 위와 동일한 상태에서 바인딩 상태가 되면 resetSwiper 타면 next시 prev갔다 next되는 문제
 *        (추가한 el.swiper.params.loop !== _.get(swiperOptions, 'loop') 제거하고 update 루트에서 slideTo로 해결)
 *  -fix- 1/1 아닌 상태에서 slide 변경 시 페이징 초기화 되지 않음.. 오히려 이게 자연스러운 상태 (초기화를 원한다면 slide 변경 후 this.$fx.swiper.reset 실행)
 *
 *  observer off!!
 *  -fix- dispaly:none 일때 slide 갯수 update 시 페이징 안박힘 (inserted 에 onChange(el.swiper, 'init') 추가로 해결)
 *
 *  observer re on!!
 *    ie10 지원 보다 observer off로 잃는 잇점이 더 많아 다시 observer 지원
 *    단, display 에 대한 1페이징 초기화 필요 시 resetSwiper 필요
 *
 */

const CHANGE_EVENTS = [
  'slideChangeTransitionStart',
  'transitionStart',
  'sliderMove',
  'transitionEnd'
]

export default {
  bind(el, binding, vnode) {
    console.log('!!!!! bind', _.join(el.classList, ', '))

    el.addEventListener('update', function(e) {
      const swiper = e.target.swiper
      if (!_.isNil(swiper)) swiper.update()
    })

    el.addEventListener('reset', function(e) {
      const swiper = e.target.swiper

      if (!_.isNil(swiper)) {
        const el = _.get(swiper, 'directiveData.el')
        const binding = _.get(swiper, 'directiveData.binding')
        const vnode = _.get(swiper, 'directiveData.vnode')

        if (_.isNil(el) || _.isNil(binding) || _.isNil(vnode)) return

        binding.value = _.merge({}, binding.value, swiper.options)
        delete swiper.options

        resetSwiper(el, binding, vnode)

        onChange(el.swiper, 'reset')
      }
    })
  },
  inserted(el, binding, vnode) {
    console.log('!!!!! inserted', _.join(el.classList, ', '))

    resetSwiper(el, binding, vnode)

    // onChange(el.swiper, 'init') // observer: true로 필요 없어짐
  },
  componentUpdated(el, binding, vnode) {
    console.log('!!!!! componentUpdated', _.join(el.classList, ', ')/* , binding, vnode */)

    if (el.swiper) {
      const swiper = el.swiper
      const swiperOptions = _.merge({}, getDefaultOptions(el, vnode), binding.value)
      const isGallery = _.indexOf(el.classList, 'gallery-top') >= 0 || _.indexOf(el.classList, 'gallery-thumbs') >= 0

      _.debounce(function () {
      // wrapper가 없거나 || update시 최초 loop와 다르면 마지막 slide가 활성화된 상태가 되므로 resetSwiper 호출 (update 측에서 slideTo로 해결)
        if (swiper.$wrapperEl.length === 0/* || el.swiper.params.loop !== _.get(swiperOptions, 'loop')*/) {
          console.log('@@@@@ reset')
          resetSwiper(el, binding, vnode)

          // onChange(swiper, 'init') // resetSwiper > initSwiper 내에서 호출하므로 중복호출이라 삭제
        } else {
          console.log('@@@@@ update')
          if (swiper.navigation && !swiper.params.loop) swiper.navigation.destroy() // 네비 상태 삭제
          if (swiper.params.loop) swiper.loopDestroy() // 복제 slide 삭제

          // 초기 options 받아 instance의 params와 병합하여 하여 initSwiper > importantOptions 의해 변경된 options 복구
          _.merge(swiper.params, importantOptions(el, swiperOptions, vnode))

          if (swiper.pagination) swiper.pagination.init() // 페이징 초기화

          if (swiper.navigation) { // 네비게이션 초기화
            swiper.navigation.init()
            swiper.navigation.update()
          }
          if (swiper.thumbs) {
            swiper.thumbs.update()
          }
          if (swiper.params.loop) swiper.loopCreate() // 복제 slide 생성

          swiper.update() // updateSize(), updateSlides(), updateProgress(), updateSlidesClasses()

          swiper.directiveData = {el, binding, vnode} // directive 데이터 재저장

          afterModifySwiper(swiper) // 레이아웃 재정의

          onChange(swiper, 'init')

          initGallery(el)
          fixObjectfit(el)

          if (swiper.realIndex !== _.get(swiper, 'pageInfo.idx')) { // realIndex속성과 실제idx가 다르면 내부 loopCreate()로 인한 paging 어그러진것으로 판단
            const idx = swiper.params.initialSlide + (swiper.params.loop) ? swiper.loopedSlides : 0

            swiper.slideTo(idx, 0) // 맨앞으로 초기화
          }
        }
      }, 100, {leading: isGallery})() // loopCreate 시점이 너무 빨라 이전 slide 가 복제되는 이슈로 인하여 100ms 딜레이
    }
  },
  unbind(el, binding, vnode) {
    console.log('!!!!! unbind / ', _.join(el.classList, ', '))

    deleteSwiper(el, binding, vnode)
  }
}

function findDataOfChildren(target, path, current) {
  let returnValue

  if (!_.isNil(_.get(target, path))) {
    returnValue = {handler: _.get(target, path), element: current}
  } else if (!_.isNil(_.get(target, 'child._vnode.' + path))) { // root element 의 @click 대응
    returnValue = {handler: _.get(target, 'child._vnode.' + path), element: current}
  } else {
    let children = _.get(target, 'children')
    let cur_children = _.get(current, 'children')

    if (_.isNil(children)) children = _.get(target, 'componentInstance._vnode.children') // swiper-slide가 컴포넌트 안에 존재할 경우

    _.forEach(_.filter(children, item => {
      return item.tag !== undefined
    }), (item, idx) => {
      const resultObj = findDataOfChildren(item, path, _.nth(cur_children, idx))

      if (!_.isNil(resultObj)) {
        returnValue = resultObj
        return false
      }
    })
  }

  return returnValue
}

function getDefaultOptions(el, vnode) {
  return {
    roundLengths: true,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    on: {
      /* observerUpdate: function(e) {
        if (e.type === 'attributes' && _.indexOf(e.target.classList, 'page-enter-active') >= 0) {
          console.log('observerUpdate reset')
          this.el.dispatchEvent(new CustomEvent('reset')) // history back 대응
        }

        if (e.type === 'childList' && _.indexOf(e.target.classList, 'swiper-container') >= 0) {
          console.log('observerUpdate onChange(init)')
          if (!_.isNil(_.result(e.target, 'swiper'))) onChange(e.target.swiper, 'init') // init 대신
        }
      }, */
      click: function(e) {
        // @click 대응
        console.log(e)
        if (_.indexOf(_.result(this, 'clickedSlide.classList'), 'swiper-slide-duplicate') >= 0) {
          const slide = this.clickedSlide
          const clickIdx = parseInt(slide.getAttribute('data-swiper-slide-index'))

          if (_.isNil(clickIdx) || _.isNil(slide)) return

          const wrapper = _.filter(_.get(this, 'directiveData.vnode.children'), item => _.indexOf(_.split(_.get(item, 'data.staticClass'), ' '), this.params.wrapperClass) !== -1)
          const realSlide = _.nth(_.get(wrapper, '[0].children'), clickIdx)
          const childInfo = findDataOfChildren(realSlide, 'data.on.click.fns', slide)
          const clickFn = _.get(childInfo, 'handler')
          const matchElement = _.get(childInfo, 'element')

          if (!_.isNil(clickFn) && !_.isNil(matchElement) && matchElement.contains(e.target)) {
            let evt

            if (e.type === 'mouseup') {
              evt = e
            } else if (e.type === 'touchend') {
              evt = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
              })
            }

            if (evt) clickFn(evt)
          }
        }
      }
    }
  }
}

// swiper 삭제
function deleteSwiper(el, binding, vnode, isCleanStyle) {
  const swiper = el.swiper

  if (_.isNil(swiper)) return

  const _isCleanStyle = _.defaultTo(isCleanStyle, true)

  if (swiper.params.exChange) delete swiper.params.exChange
  if (swiper.params.init) swiper.destroy(false, _isCleanStyle)

  // lazy 클래스 삭제
  if (_isCleanStyle && _.get(swiper.params, 'lazy.enabled')) {
    const $lazyElements = swiper.slides.find('.' + swiper.params.lazy.elementClass)

    $lazyElements.removeClass(swiper.params.lazy.loadedClass)
    $lazyElements.removeClass(swiper.params.lazy.loadingClass)
  }
}

// swiper 초기화
function initSwiper(el, binding, vnode) {
  let swiperOptions = _.merge({}, getDefaultOptions(el, vnode), binding.value)

  const opts = _.merge({}, swiperOptions, importantOptions(el, swiperOptions, vnode))

  const swiper = new Swiper(el, opts)
  swiper.defaultOptions = swiperOptions // componentUpdated 활용할 기본 options
  swiper.directiveData = {el, binding, vnode} // directive 데이터 저장

  if (!_.isNil(swiper)) afterModifySwiper(swiper)

  initGallery(el)
  fixObjectfit(el)

  onChange(swiper, 'init') // init 대신
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

  if (_.indexOf(el.classList, 'gallery-top') >= 0) { // 갤러리 상단
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
  const slideLength = getSlideLength(el)
  const slidePerView = options.slidesPerView || 1
  const isOneSlide = slidePerView !== 'auto' && slideLength <= slidePerView // 초기화 되기전 slide 갯수 1개 이거나
  const isProgressBar = _.get(options, 'pagination.type') === 'progressbar' // progressbar는 1/1 이면 저항 유지
  // const isCalendar = _.indexOf(el.classList, 'calendar_wrap') >= 0 //달력에 autoplay가 필요한지 모르겠음

  let returnObject = {
    resistanceRatio : isOneSlide && !isProgressBar ? 0 : _.result(options, 'resistanceRatio', 0.85), // slide가 1개일때 터치 반응 않하도록 설정 // simulateTouch는 초기 1회용이므로 update 에 대응 못하여 사용하면 안됨
    // loop : !(!isCalendar && isOneSlide),
    // autoplay: (!isCalendar && isOneSlide) ? false : options.autoplay
    loop : isOneSlide ? false : options.loop,
    autoplay: isOneSlide ? false : options.autoplay
  }

  // loop:true 에 slidePerView 가 1 이상인 경우 정방향으로 루핑 안되는 문제있어 해당 조건일 경우 loopAdditionalSlides: 1 로 해결
  if (returnObject.loop === true && slidePerView > 1 && options.loopAdditionalSlides === undefined) {
    _.set(returnObject, 'loopAdditionalSlides', 1)
  }

  // autoplay가 설정되어 있으면 disableOnInteraction 무조건 false 처리(스와이프 시 autoplay 정지하지 않는 옵션)
  if (returnObject.autoplay === true || !_.isNaN(parseInt(_.get(returnObject, 'autoplay.delay')))) {
    _.set(returnObject, 'autoplay.disableOnInteraction', false) // autoplay가 true 경우도 {} 화되면 true 로 인정
  }

  // console.log('@@@@@ importantOptions() / isOneSlide', isOneSlide, returnObject)

  return returnObject
}

// 추가 swiper layout 로직
function afterModifySwiper(swiper) {
  const container = swiper.el
  const slideLength = getSlideLength(swiper.el)
  const slidePerView = swiper.params.slidesPerView
  const isOneSlide = (slidePerView !== 'auto' && slideLength <= slidePerView) // 실제 .swiper-slide 가 보여지는 갯수보다 같거나 작으면
  const isProgressBar = _.get(swiper.params, 'pagination.type') === 'progressbar' // progressbar는 1/1 라도 노출을 위해
  const isCalendar = _.indexOf(swiper.el.classList, 'calendar_wrap') >= 0

  // console.log('@@@@@ afterModifySwiper() / slides.length', swiper.slides.length, 'getSlideLength', slideLength)

  if (!isCalendar) {
    const pagination = swiper.pagination.el
    const contoller = container.querySelector('.control') // swiper-container 내 .control 묶음
    const total = container.querySelector('.total')       // swiper-container 내 .total (fraction형 element)
    const isVisible = isOneSlide ? 'hidden' : 'visible'   // 페이징이나 컨트롤러 숨기거나 보이기

    if (!_.isNil(pagination) && !isProgressBar) pagination.style.visibility = isVisible
    if (!_.isNil(total) && !isProgressBar) total.style.visibility = isVisible
    if (!_.isNil(contoller)) {
      contoller.style.visibility = isVisible

      // 재생 & 정지 버튼 로직
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

  if (!_.isNil(activeSlideElm) && swiper.params.loop) {
    const idxAttr = parseInt(activeSlideElm.getAttribute('data-swiper-slide-index'))
    if (!_.isNaN(idxAttr)) idx = idxAttr
  } else {
    idx = swiper.realIndex
  }

  // }
  return {idx, max}
}

function onChange(swiper, type) {
  // console.log('onChange : ', type)
  const container = swiper.el

  // 복제 slide @click.prevent 대응
  if (type === 'init') {
    _.forEach(swiper.slides, item => {
      if (_.indexOf(item.classList, 'swiper-slide-duplicate') >= 0) {
        const link = item.getAttribute('href')
        if (!_.isNil(link) && (link === '#' || link === '#none')) {
          // item.style.borderColor = 'blue'
          item.addEventListener('click', function(e) {
            e.preventDefault()
          })
	      } else {
          _.forEach(item.querySelectorAll('a[href="#"], a[href="#none"]'), a => {
            // a.style.backgroundColor = 'blue'
            a.addEventListener('click', function(e) {
              e.preventDefault()
            })
          })
        }
      }
    })
  }

  const pageInfo = getPageInfo(swiper)
  swiper.pageInfo = pageInfo // pageInfo swiper 인스턴트에 저장하여 활용

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

function isObserverSupport() {
  return 'MutationObserver' in window || 'WebkitMutationObserver' in window
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
