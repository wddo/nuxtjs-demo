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
  name: 'bottom',
  data() {
    return {
      msg: '',
      isShow: false
    }
  },
  beforeMount() {
    this.$eventBus.$on(this.EVENT.TRACE, this.trace)
  },
  methods: {
    trace(msg) {
      this.isShow = false
      this.msg = msg

      this.$nextTick(function () {
        this.isShow = true
      })
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
  font-weight: bold;
  height: 20px;
}

.trace-enter-active {
  transition: transform 0.5s, color 0.5s;
  transition-timing-function: cubic-bezier(.75, 0, .25, 1.55);
  color: green;
}
.trace-enter {
  transform: scale(2);
  color: red;
}
</style>
