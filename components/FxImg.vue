<template>
  <div :style="`background-color: ${color}`">
    <span>{{txt}}</span>
  </div>
</template>

<script>
export default {
  name: 'FxImg',
  props: {
    txt : {
      type: String,
      default: 'empty'
    },
    color : {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
