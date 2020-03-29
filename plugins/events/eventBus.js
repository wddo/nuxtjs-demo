import Vue from 'vue'

export const EVENT = {
  TRACE: 'trace'
}

Vue.EventBus = null

export const eventBus = (() => {
  if (!Vue.EventBus) Vue.EventBus = new Vue()

  return Vue.EventBus
})()
