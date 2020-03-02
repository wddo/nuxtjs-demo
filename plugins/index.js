import Vue from "vue"
import vswiper from "~/plugins/vswiper"

const Plugin = {
  install(Vue, options) {
    Vue.directive("swiper", vswiper)
  }
}

Vue.use(Plugin)
