<template>
  <div>
    <h1>my component</h1>
    <Child></Child>
  </div>
</template>

<script>
import Child from "../components/Child"
import Vue from "vue"

const focus = Vue.directive("focus")

export default {
  components: { Child },
  beforeCreate() {
    console.log(`beforeCreate : mycomponent`)
  },
  created() {
    console.log(`created : mycomponent`)
  },
  beforeMount() {
    console.log(`beforeMount : mycomponent`)
  },
  mounted() {
    console.log(`mounted : mycomponent`)
  },
  beforeUpdate() {
    console.log("beforeUpdate : mycomponent")
  },
  updated() {
    console.log("updated : mycomponent")
  }
}
</script>

<style scoped></style>
