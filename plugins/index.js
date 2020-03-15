import Vue from "vue"
import { eventBus, EVENT } from "~/plugins/events/eventBus"
import vswiper from "~/plugins/directives/vswiper"
import _ from "lodash"

Vue.prototype.$eventBus = eventBus
Vue.prototype.EVENT = EVENT

Vue.directive("swiper", vswiper)

Vue.prototype.$fx = {
  swiper: {
    reset: function(target, options) {
      if (_.isNil(target)) return

      const opts = _.merge(
        {},
        {
          container: _.get(target, "$el", target),
          selector: "",
          eventName: "reset"
        },
        options
      )

      const container = _.get(opts.container, "$el", opts.container)
      const swipers =
        _.indexOf(_.result(container, "classList"), "swiper-container") >= 0
          ? [container]
          : container.querySelectorAll(".swiper-container" + opts.selector)

      _.map(swipers, item => {
        if (item.swiper) {
          item.swiper.options = _.merge({}, item.swiper.options, opts)
          item.swiper.$el.trigger(opts.eventName)
          //item.dispatchEvent(new Event(opts.eventName))
        }
      })
    }
  }
}
