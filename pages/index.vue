<template>
  <section class="container">
    <h2>state : {{ status }}</h2>
    <!--swiper-template
      :options="{ autoplay: true, slidesPerView: 1.1, spaceBetween: 10 }"
      key="1"
    >
      <div class="swiper-slide">slide1</div>
      <div class="swiper-slide">slide2</div>
      <div class="swiper-slide">slide3</div>
      <div class="swiper-slide">slide4</div>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper-template>
    <br /--->
    <swiper-template
      ref="ajaxSwiper"
      :options="{
        slidesPerView: 1.1,
        spaceBetween: 10,
        pagination: { type: 'fraction' }
      }"
      key="2"
    >
      <div class="swiper-slide" v-for="(item, idx) in list" :key="idx">
        {{ item.name }}
      </div>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper-template>
    <!--br />
    <swiper-template :options="{ freeMode: true }" key="3">
      <div class="swiper-slide">slide1</div>
      <div class="swiper-slide">slide2</div>
      <div class="swiper-slide">slide3</div>
      <div class="swiper-slide">slide4</div>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper-template-->
    <router-link to="./sub">go sub</router-link>
  </section>
</template>

<script>
import SwiperTemplate from "~/components/SwiperTemplate.vue"

export default {
  components: {
    SwiperTemplate
  },
  data() {
    return {
      status: "...",
      list: [{ name: "slide0" }]
    }
  },
  mounted() {
    console.log("mounted")
    setTimeout(() => {
      this.list = [
        { name: "slide1" },
        { name: "slide2" },
        { name: "slide3" },
        { name: "slide4" }
      ]
      console.log("add list")
      this.status = "add"

      setTimeout(() => {
        console.log("this.$swiper.reset")
        this.status = "reset"
        this.$swiper.reset(this.$refs.ajaxSwiper.$el)
      }, 1000)
    }, 2000)
  }
}
</script>

<style>
.swiper-slide {
  height: 150px;
}
.container {
  background-color: #ccc;
}
</style>
