import Vue from "vue";
import Swiper from "swiper";
import _ from "lodash";

Vue.prototype.$swiper = {
  reset(el) {
    if (!_.isNil(_.result(el, "swiper"))) {
      let swiper = el.swiper;
      const params = swiper.params;
      const target = swiper.el;

      console.log("destroy!!!", params);
      swiper.destroy(false, true);

      //params.loop = true;

      console.log("new Swiper()");
      swiper = new Swiper(target, params);
    }
  }
};

export default (context, inject) => {
  inject("_", _);
};
