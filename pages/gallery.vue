<template>
  <div>
    <h1>gallery</h1>
    <div :class="['gallery_container', type]">
      <div
        class="swiper-container gallery-top"
        ref="swiperTop"
        v-swiper="type === 'pc' ? swiperTopPcOptions : swiperTopOptions"
      >
        <div class="swiper-wrapper">
          <a href="#" class="swiper-slide" v-for="(item, idx) in list" :key="idx">
            <img :src="item.src" />
          </a>
        </div>
        <div class="swiper-pagination"></div>
        <div class="navigation" v-if="type === 'pc'">
          <a href="#" class="prev">&lt;</a>
          <a href="#" class="next">&gt;</a>
        </div>
      </div>
      <div
        class="swiper-container gallery-thumbs"
        ref="swiperThumbs"
        v-swiper="type === 'pc' ? swiperThumbsPcOptions : swiperThumbsOptions"
      >
        <div class="swiper-wrapper">
          <a href="#" class="swiper-slide" v-for="(item, idx) in list" :key="idx">
            <img :src="item.src" />
          </a>
        </div>

        <div class="navigation thumbs" v-if="type === 'pc'">
          <a href="#" class="prev">&lt;</a>
          <a href="#" class="next">&gt;</a>
        </div>
      </div>
    </div>
    <div class="category">
      <ul>
        <li><a href="#" @click="categoryHandler('all')">all</a></li>
        <li><a href="#" @click="categoryHandler('room')">room</a></li>
        <li><a href="#" @click="categoryHandler('outdoor')">outdoor</a></li>
      </ul>
    </div>
  </div>
</template>
vbas
<script>
export default {
  data() {
    return {
      type: process.client && typeof window.ontouchstart !== 'undefined' ? 'mobile' : 'pc',
      list: [],
      oriList: [
        { name: "slide1", src: "http://image5.hanatour.com/mst_info_image/6/P001353616_M.jpg" },
        { name: "slide2", src: "http://image1.hanatour.com/_images/main/md/banner_298.jpg" },
        { name: "slide3", src: "http://image5.hanatour.com/mst_info_image/6/P001353616_M.jpg" },
        { name: "slide4", src: "http://image1.hanatour.com/_images/main/md/banner_298.jpg" },
        { name: "slide5", src: "http://image5.hanatour.com/mst_info_image/6/P001353616_M.jpg" },
        { name: "slide6", src: "http://image1.hanatour.com/_images/main/md/banner_298.jpg" },
        { name: "slide7", src: "http://image5.hanatour.com/mst_info_image/6/P001353616_M.jpg" },
        { name: "slide8", src: "http://image1.hanatour.com/_images/main/md/banner_298.jpg" },
        { name: "slide9", src: "http://image5.hanatour.com/mst_info_image/6/P001353616_M.jpg" },
        { name: "slide10", src: "http://image1.hanatour.com/_images/main/md/banner_298.jpg" }
      ],
      swiperTopOptions: {
        effect: "fade",
        loop: true,
        loopedSlides: 5
      },
      swiperThumbsOptions: {
        spaceBetween: 4,
        slidesPerView: 4,
        loop: true,
        freeMode: true,
        loopedSlides: 5,
        watchSlidesVisibility: true,
        watchSlidesProgress: true
      },
      /** type === pc */
      swiperTopPcOptions: {
        effect: "fade"
      },
      swiperThumbsPcOptions: {
        slidesPerView: "auto",
        slidesPerGroup: 4,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 20,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        slideToClickedSlide: true
      }
    }
  },
  mounted() {
    console.log("!!!!! mounted")

    this.list = _.take(this.oriList, this.oriList.length)

    this.$nextTick(() => {
      this.$fx.swiper.resetGallery(this)
    })
  },
  methods: {
    categoryHandler(val) {
      switch (val) {
        case "all":
          this.list = _.take(this.oriList, this.oriList.length)
          break
        case "room":
          this.list = _.take(this.oriList, 4)
          break
        case "outdoor":
          this.list = _.takeRight(this.oriList, 6)
          break
        default:
      }

      this.$nextTick(() => {
        this.$fx.swiper.resetGallery(this)
      })
    }
  }
}
</script>

<style scoped>
.gallery_container {
  padding-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  overflow: hidden;
}

.navigation {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  height: 50vh;
  width: 100%;
  display: flex;
  font-family: serif;
  font-weight: bold;
}

.navigation a {
  width: 50%;
  height: 100%;
  position: relative;
  flex: 1 1 auto;
  text-align: left;
  font-size: 10rem;
  line-height: 50vh;
  opacity: 0;
}
.navigation a:last-child {
  text-align: right;
}
.navigation a:hover {
  opacity: 0.4;
}

.navigation.thumbs {
  padding: 0;
  height: 50px;
}

.navigation.thumbs a {
  font-size: 2rem;
  line-height: 2rem;
  z-index: 1;
}

.gallery-top {
  height: 50vh;
}

.swiper-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 0;
}

[data-object-fit="cover"] {
  object-fit: cover;
}

.gallery-top .swiper-slide {
  display: inline-block;
  background-color: gray;
}

.gallery-thumbs {
  height: 50px;
  margin-top: 40px;
}

.gallery-thumbs .swiper-slide {
  display: inline-block;
  background-color: pink;
}

.gallery-thumbs .swiper-slide.swiper-slide-thumb-active:after {
  content: "";
  position: absolute;
  display: inline-block;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid red;
}

.category {
  margin-top: 10px;
}

.category ul {
  display: flex;
}

.category ul li {
  flex: 1 1 auto;
  background-color: yellowgreen;
  border-radius: 5px;
  margin-left: 10px;
  text-align: center;
  height: 30px;
  line-height: 30px;
}

.category ul li:last-child {
  margin-right: 10px;
}

.category ul li a {
  display: inline-block;
  width: 100%;
}

.pc {
  width: 485px;
}

.pc .gallery-thumbs .swiper-slide {
  width: 85.75px;
  margin-right: 4px;
}

.pc .gallery-thumbs .swiper-slide:nth-last-child(1) {
  margin-right: 0;
}

.pc .gallery-thumbs .navigation.thumbs {
  display: block;
}

.pc .gallery-thumbs .navigation.thumbs a {
  position: absolute;
  flex: none;
  display: block;
  width: 20px;
  height: 50px;
  background-color: #fff;
  opacity: 1;
  line-height: 50px;
}

.pc .gallery-thumbs .navigation.thumbs a:last-child {
  right: 0;
}

</style>
