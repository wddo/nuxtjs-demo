const CHANGE_EVENT = [
  "slideChangeTransitionStart",
  "transitionStart",
  "sliderMove",
  "transitionEnd"
]

export default {
  bind: function(el, binding, vnode) {
    initSwiper(el, binding, vnode)
  },
  componentUpdated: function(el, binding, vnode) {
    resetSwiper(el, binding, vnode)
  }
}

function getDefaultObject(vnode) {
  return {
    loop: true,
    spaceBetween: 10,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    on: {
      observerUpdate: function(e) {
        if (
          e.type === "childList" &&
          e.target.classList.contains("swiper-wrapper")
        ) {
          const sipwer = e.target.parentElement.swiper
          //resetSwiper(sipwer.el, { value: sipwer.params })
        }
      },
      click: function(e) {
        if (
          _.indexOf(this.clickedSlide.classList, "swiper-slide-duplicate") >= 0
        ) {
          const clickIdx = this.clickedSlide.dataset.swiperSlideIndex
          const realSlides = _.result(vnode, "children[0].children")

          _.forEach(realSlides, item => {
            if (!_.isNil(_.get(item, "data.on.click.fns"))) {
              var evt = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window
              })
              item.data.on.click.fns(evt)
            }
          })
        }
      }
    }
  }
}

if (process.client) {
  //https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent
  ;(function(window) {
    try {
      new MouseEvent("test")
      return false // No need to polyfill
    } catch (e) {
      // Need to polyfill - fall through
    }

    // Polyfills DOM4 MouseEvent
    var MouseEventPolyfill = function(eventType, params) {
      params = params || { bubbles: false, cancelable: false }
      var mouseEvent = document.createEvent("MouseEvent")
      mouseEvent.initMouseEvent(
        eventType,
        params.bubbles,
        params.cancelable,
        window,
        0,
        params.screenX || 0,
        params.screenY || 0,
        params.clientX || 0,
        params.clientY || 0,
        params.ctrlKey || false,
        params.altKey || false,
        params.shiftKey || false,
        params.metaKey || false,
        params.button || 0,
        params.relatedTarget || null
      )

      return mouseEvent
    }

    MouseEventPolyfill.prototype = Event.prototype

    window.MouseEvent = MouseEventPolyfill
  })(window)
}

function deleteSwiper(el) {
  if (!_.isNil(_.get(el, "swiper"))) {
    const swiper = el.swiper
    swiper.destroy(false, true)
  }
}

function initSwiper(el, binding, vnode) {
  const opts = _.merge({}, getDefaultObject(vnode), binding.value)
  new Swiper(el, opts)
}

function resetSwiper(el, binding, vnode) {
  deleteSwiper(el)
  initSwiper(el, binding, vnode)
  initeEvent(el, vnode)
}

function initeEvent(el, vnode) {
  const swiper = el.swiper
  const vOnObj = _.result(vnode, "data.on", {})

  //v-on 대응
  _.forEach(vOnObj, (fns, eventName) => {
    swiper.on(eventName, fns)
  })

  //change Evnet
  _.forEach(CHANGE_EVENT, eventName => {
    swiper.on(
      eventName,
      function() {
        onChange(this.swiper, this.type)
      }.bind({ swiper, type: eventName })
    )
  })

  /*const slideVnodes = _.result(vnode, "children[0].children", {})
  _.forEach(slideVnodes, slide => {
    swiper.on("click", _.get(slide, "data.on.click"))
  })*/
}

function onChange(swiper, type) {
  //console.log("change" /*, type, swiper*/)
}
