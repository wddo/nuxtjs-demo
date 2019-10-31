<template>
  <div>
    <button @click="openNotice">Tip!</button>
    <w-notifications group="foo" />
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
      Vue.$wnotifications({
        text: Math.random(10)
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
