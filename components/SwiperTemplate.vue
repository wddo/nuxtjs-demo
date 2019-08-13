<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <slot />
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";

export default {
  head: {
    link: [
      {
        rel: "stylesheet",
        src: "/css/swiper.min.css"
      }
    ]
  },
  data() {
    return {};
  },
  mounted() {
    new Swiper(".swiper-container", {});
  }
};
</script>

<style >
.swiper-container {
  width: 100%;
  height: 100%;
}
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #f00;
}
</style>