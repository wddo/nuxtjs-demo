<template>
  <div>
    <h1>gallery</h1>
    <div class="gallery_container">
      <div class="swiper-container swiper-top" ref="swiperTop" v-swiper="swiperTopOptions">
        <div class="swiper-wrapper">
          <a href="#" class="swiper-slide" v-for="(item, idx) in list" :key="idx">
            {{ item.name }}
          </a>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <div class="swiper-container swiper-thumbs" ref="swiperThumbs" v-swiper="swiperThumbsOptions">
        <div class="swiper-wrapper">
          <a href="#" class="swiper-slide" v-for="(item, idx) in list" :key="idx">
            {{ item.name }}
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
      list: [],
      oriList: [
        { name: "slide1" },
        { name: "slide2" },
        { name: "slide3" },
        { name: "slide4" },
        { name: "slide5" },
        { name: "slide6" },
        { name: "slide7" },
        { name: "slide8" },
        { name: "slide9" },
        { name: "slide10" }
      ],
      swiperTopOptions: {
        pagination: {
          el: ".swiper-pagination",
          type: "fraction"
        },
        loopedSlides: 5
      },
      swiperThumbsOptions: {
        slidesPerView: 4,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        loopedSlides: 5
      }
    }
  },
  mounted() {
    console.log("!!!!! mounted")
    this.list = _.take(this.oriList, this.oriList.length)

    this.$nextTick(() => {
      this.$fx.swiper.reset(this.$refs.swiperTop, { thumbs: { swiper: this.$refs.swiperThumbs.swiper } })
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
        this.$fx.swiper.reset(this.$refs.swiperTop, { thumbs: { swiper: this.$refs.swiperThumbs.swiper } })
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
}

.swiper-top {
  height: 50vh;
}

.swiper-top .swiper-slide {
  display: inline-block;
  background-color: gray;
}

.swiper-thumbs {
  height: 50px;
  margin-top: 10px;
}

.swiper-thumbs .swiper-slide {
  display: inline-block;
  background-color: pink;
}

.swiper-thumbs .swiper-slide.swiper-slide-thumb-active {
  background-color: red;
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
