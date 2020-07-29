import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$env = {
  serverURI : '//127.0.0.1:3000'
}

Vue.prototype.$eventBus = new Vue()
Vue.prototype.$http = axios
