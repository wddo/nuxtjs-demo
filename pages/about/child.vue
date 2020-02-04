<template>
  <div class="child_wrap">
    my child component!
  </div>
</template>

<script>
import store from "~/store" // 부모것과 공유 되지 않는다 ㅠ

export default {
  mixins: [store],
  mounted() {
    console.log(this.msg)
    this.msg = "child"
    console.log(this.msg)
  }
}
</script>

<style scoped>
.child_wrap {
  background-color: green;
  height: 1000px;
}
</style>
