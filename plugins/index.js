import Vue from 'vue'
import { eventBus, EVENT } from '~/plugins/events/eventBus'
import vswiper from '~/plugins/directives/vswiper'
import _ from 'lodash'

Vue.prototype.$eventBus = eventBus
Vue.prototype.EVENT = EVENT

Vue.directive('swiper', vswiper)

Vue.prototype.$fx = {
  swiper: {
    /**
     * 재정의
     * 'update' 초기화 시 대상이 :hidden 인 경우 not(:hidden) 로 변경될 때 실행
     * 'reset' swiper 삭제 후 처음부터 정의
     * @param {VueComponent} target - 대상(.swiper-contaienr element | this), container 옵션있으면 활용 안함
     * @param {Object} options - 아래 나열한 옵션 외 swiper parameters
     * @property {Element} options.container - selector 찾을 부모 element | 첫번째 인자 target (기본값)
     * @property {String} options.selector - .swiper-container 추가 selector
     * @property {String} options.eventName - 'reset' (기본값) | 'update' (단순 크기, slides 변경)
     */
    reset: function(target, options) {
      if (_.isNil(target)) return

      const opts = _.merge(
        {},
        {
          container: _.get(target, '$el', target),
          selector: '',
          eventName: 'reset'
        },
        options
      )

      // update 상태에서 Observer 지원하면 실행 안함
      if (opts.eventName === 'update' && isObserverSupport()) return

      const container = _.get(opts.container, '$el', opts.container) // refs 일수도 있으니 체크

      if (_.isNil(_.result(container, 'classList'))) return // 내용이 dom 이 아니면 정지

      const swipers =
        _.indexOf(_.result(container, 'classList'), 'swiper-container') >= 0 // 자신이 swiper-container 면
          ? [container] // 자식을 배열로
          : container.querySelectorAll(`.swiper-container${opts.selector}`) // 아니면 자식에서 찾기

      let elm
      let swiperIns
      _.map(swipers, item => {
        elm = _.get(item, '__vue__.$el', item)

        swiperIns = elm.swiper

        if (swiperIns) {
          // swiperIns.options = _.merge({}, swiperIns.options, opts)
          if (_.isNil(_.result(swiperIns, 'options'))) swiperIns.options = opts // vSwiper2 에서 활용 용도로 옵션 저장

          swiperIns.el.dispatchEvent(new CustomEvent(opts.eventName))
        }
      })
    },

    /**
     * 갤러리 전용 재정의
     * @param {VueComponent} target  - $refs 참조 대상 (this)
     * @param {Object} options
     * @property {Element} options.all - 갤러리 top, thumbs 모두 리셋 할지 유무
     */
    resetGallery(target, options) {
      const resetThumbs = _.defaultTo(_.get(options, 'all'), true)

      if (target.$refs.swiperTop && target.$refs.swiperThumbs) {
        if (resetThumbs) $nuxt.$fx.swiper.reset(target.$refs.swiperThumbs)
        $nuxt.$fx.swiper.reset(target.$refs.swiperTop, {
          thumbs: { swiper: target.$refs.swiperThumbs.swiper }
        })

        // thumbs에 top정보 정의
        if (target.$refs.swiperThumbs.swiper) {
          _.set(
            target.$refs.swiperThumbs.swiper,
            'top.swiper',
            target.$refs.swiperTop.swiper
          )

          if (target.$refs.swiperThumbs.swiper.params.loop !== true) target.$refs.swiperThumbs.swiper.slideTo(0, 0)
        }

        if (target.$refs.swiperTop.swiper.lazy) target.$refs.swiperTop.swiper.lazy.load()
        if (target.$refs.swiperThumbs.swiper.lazy) target.$refs.swiperThumbs.swiper.lazy.load()
      }
    }
  }
}

function isObserverSupport() {
  return 'MutationObserver' in window || 'WebkitMutationObserver' in window
}
