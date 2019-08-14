<template>
  <section class="container">
    <swiper-template :options="{autoplay:false, slidesPerView:1.1, spaceBetween: 10}">
      <div class="swiper-slide">slide1</div>
      <div class="swiper-slide">slide2</div>
      <div class="swiper-slide">slide3</div>
      <div class="swiper-slide">slide4</div>
    </swiper-template>
    <br />
    <swiper-template
      :options="{autoplay:false, slidesPerView:1.1, spaceBetween: 10, pagination: {type: 'fraction'}}"
    >
      <div class="swiper-slide">slide1</div>
      <div class="swiper-slide">slide2</div>
      <div class="swiper-slide">slide3</div>
      <div class="swiper-slide">slide4</div>
    </swiper-template>
    <br />
    <swiper-template :options="{freeMode: true}">
      <div class="swiper-slide">slide1</div>
      <div class="swiper-slide">slide2</div>
      <div class="swiper-slide">slide3</div>
      <div class="swiper-slide">slide4</div>
    </swiper-template>
  </section>
</template>

<script>
import SwiperTemplate from "~/components/SwiperTemplate.vue";

export default {
  components: {
    SwiperTemplate
  }
};
</script>

<style>
.swiper-slide {
  height: 150px;
}
</style>

