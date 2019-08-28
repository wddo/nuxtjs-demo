import Vue from "vue";
import Vuex from "vuex";
import wtoggle from "./modules/wToggleComponent/wtoggle";

Vue.use(Vuex);

const createStore = () => {
  return new Vuex.Store({
    modules: {
      wtoggle
    }
  });
};

export default createStore;
