<template>
  <div>
    <h1>gallery</h1>
    <div class="gallery_container">
      <div class="navigation" v-if="type === 'pc'">
        <a href="#" class="prev" @click.prevent="naviHandler($event)">&lt;</a>
        <a href="#" class="next" @click.prevent="naviHandler($event)">&gt;</a>
      </div>
      <div
        class="swiper-container swiper-top"
        ref="swiperTop"
        v-swiper="type === 'pc' ? swiperTopPcOptions : swiperTopOptions"
      >
        <div class="swiper-wrapper">
          <a href="#" class="swiper-slide" v-for="(item, idx) in list" :key="idx">
            <img :src="item.src" />
          </a>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <div class="navigation thumbs" v-if="type === 'pc'">
        <a href="#" class="prev" @click.prevent="thumbNaviHandler($event)">&lt;</a>
        <a href="#" class="next" @click.prevent="thumbNaviHandler($event)">&gt;</a>
      </div>
      <div
        :class="['swiper-container', 'swiper-thumbs', type]"
        ref="swiperThumbs"
        v-swiper="type === 'pc' ? swiperThumbsPcOptions : swiperThumbsOptions"
      >
        <div class="swiper-wrapper">
          <a href="#" class="swiper-slide" v-for="(item, idx) in list" :key="idx">
            <img :src="item.src" />
          </a>
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
      type: "pc",
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
    },
    naviHandler(e) {
      const target = e.currentTarget
      const topSwiper = this.$refs.swiperTop.swiper
      const thumbsSwiper = topSwiper.thumbs.swiper

      if (!topSwiper || !thumbsSwiper) return

      if (_.indexOf(target.classList, "prev") >= 0) {
        topSwiper.slidePrev()
      } else {
        topSwiper.slideNext()
      }
      thumbsSwiper.slideTo(topSwiper.realIndex)
    },
    thumbNaviHandler(e) {
      const target = e.currentTarget
      const topSwiper = this.$refs.swiperTop.swiper
      const thumbsSwiper = topSwiper.thumbs.swiper

      if (!topSwiper || !thumbsSwiper) return

      const currentIdx = thumbsSwiper.realIndex
      const totalIdx = thumbsSwiper.slides.length - 1
      const groupNum = thumbsSwiper.params.slidesPerGroup

      let goIdx
      let n = groupNum
      if (_.indexOf(target.classList, "prev") >= 0) {
        const toIdx = currentIdx //prev 때는 realIndex 가 목적지 idx
        const isMiddle = toIdx % totalIdx > 0 && toIdx > groupNum //배수가 아니고 첫 페이지보다 크면
        goIdx = Math.max(0, !isMiddle ? toIdx - groupNum : toIdx)

        while (n--) {
          topSwiper.slidePrev()
        }
      } else {
        goIdx = Math.min(totalIdx, currentIdx + groupNum)

        while (n--) {
          topSwiper.slideNext()
        }
      }

      thumbsSwiper.slideTo(goIdx)
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
  left: 0;
  z-index: 10;
  height: 50vh;
  width: 100%;
  display: flex;
  padding: 0 10px;
}

.navigation a {
  width: 50%;
  height: 100%;
  position: relative;
  flex: 1 1 auto;
  text-align: center;
  font-size: 10rem;
  line-height: 45vh;
  opacity: 0.4;
}

.navigation.thumbs {
  height: 40px;
}

.navigation.thumbs a {
  font-size: 2rem;
  line-height: 2rem;
}

.swiper-top {
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

.swiper-top .swiper-slide {
  display: inline-block;
  background-color: gray;
}

.swiper-thumbs {
  height: 50px;
  margin-top: 40px;
}

.swiper-thumbs .swiper-slide {
  display: inline-block;
  background-color: pink;
}

.swiper-thumbs.pc .swiper-slide {
  width: 85.75px;
  margin-right: 4px;
}

.swiper-thumbs.pc .swiper-slide:nth-last-child(1) {
  margin-right: 0;
}

.swiper-thumbs .swiper-slide.swiper-slide-thumb-active:after {
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
</style>
