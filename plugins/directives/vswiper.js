const CHANGE_EVENT = [
  "slideChangeTransitionStart",
  "transitionStart",
  "sliderMove",
  "transitionEnd"
]

export default {
  bind: function(el, binding, vnode) {
    console.log("!!!!! bind")
    resetSwiper(el, binding, vnode)

    el.addEventListener("update", function(e) {
      const swiper = e.target.swiper
      if (!_.isNil(swiper)) swiper.update()
    })

    el.addEventListener("reset", function(e) {
      const swiper = e.target.swiper

      if (!_.isNil(swiper)) {
        binding.value = _.merge({}, binding.value, swiper.options)
        delete swiper.options

        resetSwiper(el, binding, vnode)
      }
    })
  },
  componentUpdated: function(el, binding, vnode) {
    console.log("!!!!! componentUpdated")
    resetSwiper(el, binding, vnode)
  },
  unbind: function(el, binding, vnode) {
    deleteSwiper(el, binding, vnode)
  }
}

function getDefaultObject(vnode) {
  return {
    roundLengths: true,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    on: {
      observerUpdate: function(e) {
        //history back 대응
        if (
          e.type === "attributes" &&
          _.indexOf(e.target.classList, "page-enter-active") >= 0
        ) {
          e.target.dispatchEvent(new CustomEvent("reset"))
        }

        if (
          e.type === "childList" &&
          _.indexOf(e.target.classList, "swiper-container") >= 0
        ) {
          if (!_.isNil(_.result(e.target, "swiper")))
            onChange(e.target.swiper, "init") //init 대신
        }
      },
      click: function(e) {
        if (
          _.indexOf(
            _.result(this, "clickedSlide.classList"),
            "swiper-slide-duplicate"
          ) >= 0
        ) {
          const slide = this.clickedSlide
          const clickIdx = slide.dataset.swiperSlideIndex
          const realSlide = _.head(
            _.at(_.result(vnode, "children[0].children"), clickIdx)
          )

          if (!_.isNil(_.get(realSlide, "data.on.click.fns"))) {
            let evt

            if (e.type === "mouseup") {
              evt = e
            } else if (e.type === "touchend") {
              evt = new MouseEvent("click", {
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

function deleteSwiper(el, binding, vnode) {
  if (!_.isNil(_.get(el, "swiper"))) {
    const swiper = el.swiper
    if (swiper.params.init) swiper.destroy(false, true)
  }
}

function initSwiper(el, binding, vnode) {
  const opts = _.merge({}, getDefaultObject(vnode), binding.value)
  const swiper = new Swiper(el, opts)

  //object-fit IE 대응
  $nuxt.$nextTick(function() {
    if (!process.client || _.isNil(_.result(document, "documentElement.style")))
      return

    if ("objectFit" in document.documentElement.style === false) {
      Array.prototype.forEach.call(
        el.querySelectorAll(".swiper-slide img"),
        function(image) {
          //data-object-fit 초기화
          if (image.src.indexOf("data:") === 0) {
            image.src = image.style.backgroundImage.replace(
              /^url|[\("|'\"|')]/g,
              ""
            )
            image.style.background = ""
          }

          //data-object-fit 정의
          image.style.background = `url("${image.src}") no-repeat 50% / cover`
          image.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${image.width}' height='${image.height}'%3E%3C/svg%3E`
        }
      )
    }
  })
}

function resetSwiper(el, binding, vnode) {
  deleteSwiper(el, binding, vnode)
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
}

function onChange(swiper, type) {
  if (type === "init") {
    _.forEach(swiper.slides, item => {
      if (_.indexOf(item.classList, "swiper-slide-duplicate") >= 0) {
        const link = item.getAttribute("href")
        if (!_.isNil(link) && link === "#")
          item.addEventListener("click", function(e) {
            e.preventDefault()
          })
      }
    })
  }
}
