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
