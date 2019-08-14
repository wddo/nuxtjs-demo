<template>
  <div class="swiper-container" :attrs="attrs">
    <div class="swiper-wrapper">
      <slot />
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
import _ from "lodash";

const getChildrenTagContent = children => {
  return children.filter(function(node) {
    return node.tag;
  });
};

export default {
  head() {
    return {
      link: [
        {
          rel: "stylesheet",
          href: "/css/swiper.min.css"
        }
      ]
    };
  },
  data() {
    return {
      defaults: {
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
          delay: 3500,
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
    };
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    attrs() {
      return this.$attrs;
    }
  },
  mounted() {
    let opts = !this.options.freeMode
      ? { ...this.defaults }
      : _.extend({}, this.defaults, this.freeDefaults);

    _.set(
      opts,
      "loop",
      getChildrenTagContent(this.$slots.default).length > 1 && !opts.freeMode
    );

    opts = _.defaultsDeep(this.options, opts);

    if (!_.isNaN(opts.slidesPerView) && _.isUndefined(opts.loopedSlides))
      _.set(opts, "loopedSlides", _.ceil(opts.slidesPerView));

    console.log(opts);

    new Swiper(this.$el, opts);
  }
};
</script>

<style >
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