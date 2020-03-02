<template>
  <div class="swiper-container" v-bind="$attrs">
    <div class="swiper-wrapper">
      <slot />
    </div>
    <slot name="pagination"></slot>
  </div>
</template>

<script>
import Swiper from "swiper"

const getChildrenTagContent = children => {
  return _.filter(children, function(node) {
    return node.tag
  })
}

export default {
  data() {
    return {
      defaults: {
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        on: {
          init: e => this.onChange(e, "init"),
          slideChange: e => this.onChange(e, "slideChange"),
          sliderMove: e => this.onChange(e, "sliderMove"),
          transitionStart: e => this.onChange(e, "transitionStart"),
          transitionEnd: e => this.onChange(e, "transitionEnd"),
          observerUpdate: e => {
            //console.log("observerUpdate", e)

            //history back 대응
            if (
              e.type === "attributes" &&
              _.indexOf(e.target.classList, "page-enter-active") >= 0
            ) {
              console.log("!!!!! reset")

              this.$swiper.reset(this.$el)
            }
          }
        },
        pagination: {
          el: ".swiper-pagination",
          type: "bullets"
        },
        preloadImages: false,
        watchSlidesVisibility: true,
        lazy: {
          loadPrevNext: true
        },
        autoplay: {
          delay: 1500,
          disableOnInteraction: false
        }
      },
      freeDefaults: {
        slidesPerView: "auto",
        spaceBetween: 0,
        freeMode: true,
        roundLengths: true,
        autoplay: false
      }
    }
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    attrs() {
      return this.$attrs
    }
  },
  methods: {
    onChange(e, type) {
      const swiper = this.$el.swiper
      const idx = swiper.realIndex
    }
  },
  mounted() {
    let opts =
      _.result(this, "options.freeMode") !== true
        ? { ...this.defaults }
        : _.extend({}, this.defaults, this.freeDefaults)

    _.set(
      opts,
      "loop",
      getChildrenTagContent(this.$slots.default).length > 1 && !opts.freeMode
    )

    opts = _.defaultsDeep(this.options, opts)

    if (!_.isNaN(opts.slidesPerView) && _.isUndefined(opts.loopedSlides))
      _.set(opts, "loopedSlides", _.ceil(opts.slidesPerView))

    new Swiper(this.$el, opts)
  }
}
</script>

<style>
.swiper-container {
  width: 100%;
  height: 100%;
}
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #f00;
}
</style>
