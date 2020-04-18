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

      console.log('reset : ', !_.isNil(swiper))

      if (!_.isNil(swiper)) {
        const el = _.get(swiper, 'directiveData.el')
        const binding = _.get(swiper, 'directiveData.binding')
        const vnode = _.get(swiper, 'directiveData.vnode')

        if (_.isNil(el) || _.isNil(binding) || _.isNil(vnode)) return

        binding.value = _.merge({}, binding.value, swiper.options)
        delete swiper.options

        resetSwiper(el, binding, vnode)
      }
    })
  },
  inserted(el, binding, vnode) {
    console.log('!!!!! inserted', _.join(el.classList, ', '))

    resetSwiper(el, binding, vnode)
  },
  componentUpdated(el, binding, vnode) {
    console.log('!!!!! componentUpdated', _.join(el.classList, ', ')/* , binding, vnode */)

    if (el.swiper) {
      const swiper = el.swiper

      // wrapper가 없거나 || update시 최초 loop와 다르면 마지막 slide가 활성화된 상태가 되므로 resetSwiper 호출
      if (swiper.$wrapperEl.length === 0 || el.swiper.params.loop !== _.get(el.swiper, 'defaultOptions.loop')) {
        resetSwiper(el, binding, vnode)
      } else {
        if (swiper.params.loop) swiper.loopDestroy() // 복제 slide 삭제

        // 초기 options 받아 instance의 params와 병합하여 하여 initSwiper > importantOptions 의해 변경된 options 복구
        _.merge(swiper.params, importantOptions(el, swiper.defaultOptions, vnode))

        if (swiper.pagination) swiper.pagination.init() // 페이징 초기화

        if (swiper.navigation) { // 네비게이션 초기화
          if ((_.get(swiper.navigation, '$nextEl.length') === 0 || _.get(swiper.navigation, '$prevEl.length') === 0)) {
            swiper.navigation.init()
          } else {
            swiper.navigation.update()
          }
        }

        if (swiper.params.loop) swiper.loopCreate() // 복제 slide 생성

        swiper.update() // updateSize(), updateSlides(), updateProgress(), updateSlidesClasses()

        afterModifySwiper(swiper) // 레이아웃 재정의

        onChange(swiper, 'init')

        initGallery(el)
        fixObjectfit(el)

        if (swiper.realIndex !== _.get(swiper, 'pageInfo.idx')) { // realIndex속성과 실제idx가 다르면 내부 loopCreate()로 인한 paging 어그러진것으로 판단
          const idx = swiper.params.initialSlide + (swiper.params.loop) ? swiper.loopedSlides : 0
          swiper.slideTo(idx, 0) // 맨앞으로 초기화
        }
      }
    }
  },
  unbind(el, binding, vnode) {
    console.log('!!!!! unbind / ', _.join(el.classList, ', '))

    deleteSwiper(el, binding, vnode)
  }
}

function findDataOfChildren(target, path) {
  let returnValue

  if (!_.isNil(_.get(target, path))) {
    returnValue = _.get(target, path)
  } else {
    const children = _.get(target, 'children')

    _.forEach(children, item => {
      const result = findDataOfChildren(item, path)

      if (!_.isNil(result)) {
        returnValue = result
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
      observerUpdate: function(e) {
        if (e.type === 'attributes' && _.indexOf(e.target.classList, 'page-enter-active') >= 0) {
          console.log('observerUpdate reset')
          this.el.dispatchEvent(new CustomEvent('reset')) // history back 대응
        }

        if (e.type === 'childList' && _.indexOf(e.target.classList, 'swiper-container') >= 0) {
          console.log('observerUpdate onChange(init)')
          if (!_.isNil(_.result(e.target, 'swiper'))) onChange(e.target.swiper, 'init') // init 대신
        }
      },
      click: function(e) {
        // @click 대응
        if (_.indexOf( _.result(this, 'clickedSlide.classList'), 'swiper-slide-duplicate') >= 0) {
          const slide = this.clickedSlide
          const clickIdx = parseInt(slide.getAttribute('data-swiper-slide-index'))

          if (_.isNil(clickIdx) || _.isNil(slide)) return

          const realSlide = _.nth(_.get(this, 'directiveData.vnode.children[0].children'), clickIdx)
          const clickFn = findDataOfChildren(realSlide, 'data.on.click.fns')

          if (!_.isNil(clickFn)) {
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
  console.log('!!!!! deleteSwiper / ', _.join(el.classList, ', '))
  const swiper = el.swiper

  if (_.isNil(swiper)) return

  if (swiper.params.exChange) delete swiper.params.exChange
  if (swiper.params.init) swiper.destroy(false, _.defaultTo(isCleanStyle, true))
}

// swiper 초기화
function initSwiper(el, binding, vnode) {
  let swiperOptions = _.merge({},
    getDefaultOptions(el, vnode),
    binding.value)

  const opts = _.merge({}, swiperOptions, importantOptions(el, swiperOptions, vnode))

  const swiper = new Swiper(el, opts)
  swiper.defaultOptions = swiperOptions // componentUpdated 활용할 기본 options
  swiper.directiveData = {el, binding, vnode} // directive 데이터 저장

  if (!_.isNil(swiper)) afterModifySwiper(swiper)

  initGallery(el)
  fixObjectfit(el)

  if (!isObserverSupport()) onChange(swiper, 'init') // init 대신
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
    resistanceRatio : isOneSlide && !isProgressBar ? 0 : _.result(options, 'resistanceRatio', 0.85), // slide가 1개일때 터치 반응 않하도록 설정 // simulateTouch는 초기 1회용으므로 update 에 대응 못하여 사용하면 안됨
    // loop : !(!isCalendar && isOneSlide),
    // autoplay: (!isCalendar && isOneSlide) ? false : options.autoplay
    loop : isOneSlide ? false : options.loop,
    autoplay: isOneSlide ? false : options.autoplay
  }

  // autoplay가 설정되어 있으면 disableOnInteraction 무조건 false 처리(스와이프 시 autoplay 정지하지 않는 옵션)
  if (returnObject.autoplay === true || !_.isNaN(parseInt(_.get(returnObject, 'autoplay.delay')))) {
    _.set(returnObject, 'autoplay.disableOnInteraction', false) // autoplay가 true 경우도 {} 화되면 true 로 인정
  }

  console.log('@@@@@ importantOptions() / isOneSlide', isOneSlide, returnObject)

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

  console.log('@@@@@ afterModifySwiper() / slides.length', swiper.slides.length, 'getSlideLength', slideLength)

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
  console.log('onChange : ', type)
  const container = swiper.el

  // 복제 slide @click.prevent 대응
  if (type === 'init') {
    _.forEach(swiper.slides, item => {
      if (_.indexOf(item.classList, 'swiper-slide-duplicate') >= 0) {
        const link = item.getAttribute('href')
        if (!_.isNil(link) && link === '#') {
          // item.style.backgroundColor = 'blue'
          item.addEventListener('click', function(e) {
            e.preventDefault()
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
