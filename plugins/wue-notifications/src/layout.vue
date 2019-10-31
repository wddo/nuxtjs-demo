<template>
  <div class="notificatinos_wrap">
    <div v-for="(t, i) in list" :key="i">{{ t }}</div>
  </div>
</template>

<script>
import Vue from "vue";
import { events } from "./events";
import defaults from "./defaults";

export default {
  name: "wnotifications",
  data() {
    return {
      list: [],
      opts: {}
    };
  },
  mounted() {
    events.$on("init", this.init);
    events.$on("open", this.open);
  },
  methods: {
    init(options) {
      Vue.set(this, "opts", Object.assign({}, defaults, options));
    },
    open(options) {
      this.list.push(options.text);
    }
  }
};
</script>

<style scoped>
.notifications_wrap {
  padding: 10px;
  border: 1px solid black;
  border-radius: 1rem;
}

.notifications_wrap div {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
