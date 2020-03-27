<template>
  <div class="bottomArea">
    &gt;&gt;
    <transition name="trace">
      <span id="trace" v-if="isShow">{{ msg }}</span>
    </transition>
  </div>
</template>

<script>
export default {
  name: "bottom",
  data() {
    return {
      msg: "",
      isShow: false
    }
  },
  beforeMount() {
    this.$eventBus.$on(this.EVENT.TRACE, this.trace)
  },
  methods: {
    trace(msg) {
      this.msg = msg
      this.isShow = true
    }
  }
}
</script>

<style scoped>
.bottomArea {
  position: absolute;
  bottom: 0;
  width: 100vw;
  background-color: #ccc;
  padding-bottom: 2rem;
}

#trace {
  display: inline-block;
  color: green;
  font-weight: bold;
  height: 20px;
}

.trace-enter-active {
  transition: transform 0.5s ease;
}
.trace-enter {
  transform: scale(2);
}
</style>
