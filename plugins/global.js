import Vue from "vue"

Vue.mixin({
  mounted() {
    //console.log("!!!!! mounted", this.$vnode);
  },
  updated() {
    //console.log("!!!!! updated", this.$vnode);
  },
  methods: {
    goBack() {
      history.back()
    }
  }
})

Vue.directive("focus", {
  bind(el, binding, vnode, componentUpdated) {
    console.log("directive / bind : el", el)
    /*     console.log("bind : binding", binding);
    console.log("bind : vnode", vnode);
    console.log("bind : componentUpdated", componentUpdated); */
  },
  inserted(el, binding, vnode, componentUpdated) {
    el.style.padding = "10px"
    el.style.backgroundColor = "red"

    console.log("directive / inserted : el", el)
    /*     console.log("inserted : binding", binding);
    console.log("inserted : vnode", vnode);
    console.log("inserted : componentUpdated", componentUpdated); */
  },
  update(el, binding, vnode, componentUpdated) {
    console.log("directive / update : el", el)
    /*     console.log("updated : binding", binding);
    console.log("updated : vnode", vnode);
    console.log("updated : componentUpdated", componentUpdated); */
  },
  componentUpdated(el, binding, vnode, componentUpdated) {
    console.log("directive / componentUpdated : el", el)
    /*     console.log("componentUpdated : binding", binding);
    console.log("componentUpdated : vnode", vnode);
    console.log("componentUpdated : componentUpdated", componentUpdated); */
  },
  unbind(el, binding, vnode, componentUpdated) {
    console.log("directive / unbind : el", el)
    /*     console.log("unbind : binding", binding);
    console.log("unbind : vnode", vnode);
    console.log("unbind : componentUpdated", componentUpdated); */
  }
})

Vue.prototype.$fx = {
  resetSwiper(target) {
    const vfocusBtns = target.querySelectorAll(".v-focus")
    vfocusBtns.forEach(item => {
      //iif (item.__vue__) tem.__vue__.click()
      if (item.__vue__) item.__vue__.$el.dispatchEvent(new Event("reset"))
    })
  }
}
