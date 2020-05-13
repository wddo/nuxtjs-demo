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
            <img :data-src="item.src" class="swiper-lazy" />
            <div class="swiper-lazy-preloader"></div>
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
            <img :data-src="item.src" class="swiper-lazy" />
            <div class="swiper-lazy-preloader"></div>
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

<script>
export default {
  data() {
    return {
      type: process.client && typeof window.ontouchstart !== 'undefined' ? 'mobile' : 'pc',
      list: [],
      maxlen: 0,
      oriList: [
        // room
        { name: 'slide1', src: 'https://image.hanatour.com/usr/cms/resize/500_0/2020/03/27/180000/9c56e672-cfdc-471a-8d38-381bbd5bfe3a.jpg' },
        { name: 'slide2', src: 'https://image.hanatour.com/usr/cms/resize/500_0/2020/03/27/180000/8062b6db-e120-45c5-8535-1499bdcb2a47.jpg' },
        { name: 'slide3', src: 'https://image.hanatour.com/usr/cms/resize/500_0/2020/03/27/180000/ad66f2fd-3366-404a-96c9-0ba50bd2ccba.jpg' },
        { name: 'slide4', src: 'https://image.hanatour.com/usr/cms/resize/500_0/2020/03/27/180000/3040a988-56ec-473b-8ea2-0fe31c28c14c.jpg' },
        { name: 'slide5', src: 'https://image.hanatour.com/usr/cms/resize/500_0/2020/03/27/180000/7b4bc236-8d63-4163-baf9-aad40de161b7.jpg' },
        { name: 'slide6', src: 'https://image.hanatour.com/usr/cms/resize/500_0/2020/03/27/180000/cf007c55-4918-4b3f-b8a2-3b3513f091a5.jpg' },

        // outdoor
        { name: 'slide7', src: 'https://image.hanatour.com/usr/cms/resize/500_0/2020/03/27/180000/398d4f95-bd26-4275-a140-d766ef39eb0d.jpg' },
        { name: 'slide8', src: 'https://image.hanatour.com/usr/cms/resize/500_0/2020/03/27/180000/0c0c4c66-e64b-4ccb-9942-a066a7696465.jpg' },
        { name: 'slide9', src: 'https://image.hanatour.com/usr/cms/resize/500_0/2020/03/27/180000/49c23f6a-a50f-4702-9a17-38853c2c23cc.jpg' },
        { name: 'slide10', src: 'https://image.hanatour.com/usr/cms/resize/500_0/2020/03/27/180000/adde59b6-714f-4d0a-bb54-7acb7c1bac9b.jpg' },
        { name: 'slide11', src: 'https://image.hanatour.com/usr/cms/resize/500_0/2020/03/27/180000/804d35d3-7048-4820-a4e1-71448124cedf.jpg' },
        { name: 'slide12', src: 'https://image.hanatour.com/usr/cms/resize/400_0/2020/03/26/720000/93384b6a-36b1-4f43-871f-5c2418cf1999.jpg' }
      ],
      swiperTopOptions: {
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        speed: 0,
        loop: true,
        lazy: true,
        preloadImages: false
      },
      swiperThumbsOptions: {
        spaceBetween: 4,
        slidesPerView: 4,
        loop: true,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        lazy: true,
        preloadImages: false
      },
      /** type === pc */
      swiperTopPcOptions: {
        effect: 'fade',
        lazy: true,
        preloadImages: false
      },
      swiperThumbsPcOptions: {
        slidesPerView: 'auto',
        slidesPerGroup: 5,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 20,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
        lazy: true,
        preloadImages: false
      }
    }
  },
  mounted() {
    console.log('!!!!! mounted')
    this.maxlen = this.oriList.length
    this.list = _.take(this.oriList, this.maxlen)

    this.$nextTick(() => {
      this.$fx.swiper.resetGallery(this)
    })
  },
  methods: {
    categoryHandler(val) {
      switch (val) {
        case 'all':
          this.list = _.take(this.oriList, this.maxlen)
          break
        case 'room':
          this.list = _.take(this.oriList, 6)
          break
        case 'outdoor':
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
  display: -ms-flexbox;
  font-family: serif;
  font-weight: bold;
}

.navigation a {
  width: 50%;
  height: 100%;
  position: relative;
  flex: 1 1 auto;
  -ms-flex: 1 1 auto;
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
  z-index: auto;
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
