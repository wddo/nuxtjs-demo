<template>
  <div>
    <button @click="openNotice">Tip!</button>
    <wnotifications group="foo" />
  </div>
</template>

<script>
import Vue from "vue";

export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    openNotice() {
      this.$wnotifications({
        text: Math.random(10),
        group: "foo"
      });

      /* Vue.wnotifications({
        group: "foo"
      }); */
    }
  }
};
</script>

<style scoped>
div,
button {
  padding: 10px;
}
</style>
