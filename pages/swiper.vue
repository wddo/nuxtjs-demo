<template>
  <div>
    <h1>swiper test</h1>
    <div>
      <button class="tabBtn" @click="clickHandler(1)">show 1</button>
      <button class="tabBtn" @click="clickHandler(2)">show 2</button>
      <button class="tabBtn" @click="clickHandler(0)">toggle : {{ this.toggle }}</button>
      <button class="tabBtn" @click="addSlide(1)">add slide 1</button>
      <button class="tabBtn" @click="addSlide(5)">add slide 5</button>
    </div>
    <div v-show="isShowNum === 1 || (toggle && !isShowNum)">
      <h3>swiper 1</h3>
      <div v-swiper="swiperOptions" @slideChangeTransitionStart="onSlideChangeTransitionStart" class="swiper-container myswiper1">
        <div class="swiper-wrapper">
          <a href="#" class="swiper-slide" @click.prevent="slideClick('/sub')" v-for="(item, idx) in list" :key="idx">
            {{ item.name }}
          </a>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
    <div v-show="isShowNum === 2 || (toggle && !isShowNum)">
      <h3>swiper 2</h3>
      <div v-swiper="swiperOptions2" class="swiper-container myswiper2">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, idx) in list" :key="idx">{{ item.name }}</div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
    <div>swiepr2 binding : {{ num + 1 }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      num: 0,
      isShowNum: 2,
      toggle: true,
      list: [],
      msg: '',
      swiperOptions: {
        loop: false,
        spaceBetween: 10,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        on: {
          slideChangeTransitionStart: function() {
            console.log('slideChangeTransitionStart 11111')
          }
        }
      },
      swiperOptions2: {
        loop: true,
        spaceBetween: 10,
        pagination: {
          el: '.swiper-pagination'
        },
        autoplay: {
          delay : 5000
        },
        on: {
          transitionStart: function() {
            console.log('transitionStart')
          }
        },
        exChange: (swiper, type, { idx, max }) => {
          this.num = idx
        }
      }
    }
  },
  created() {
    if (process.client) console.log('!!!!! swiper.vue / created')
  },
  mounted() {
    this.$fx.swiper.reset(this) // 테이터 붙기 전 리셋 테스트

    console.log('!!!!! swiper.vue / mounted')
    this.$eventBus.$emit(this.EVENT.TRACE, 'loading...')
    setTimeout(() => {
      this.list = [{ name: 'item1' }, { name: 'item2' }, { name: 'item3' }, { name: 'item4' }]

      this.isShowNum = 0
      console.log('add item')
      this.$eventBus.$emit(this.EVENT.TRACE, 'add item')
    }, 2000)
  },
  methods: {
    clickHandler(n) {
      this.isShowNum = n

      if (!n) this.toggle = !this.toggle
    },
    onSlideChangeTransitionStart() {
      console.log('slideChangeTransitionStart 22222')
    },
    slideClick(link) {
      if (link) this.$router.push(link)
    },
    addSlide(n) {
      this.list = []
      console.log('new add item', n)
      let i = n
      while(i--) {
        this.list.push({ name: 'new item' + (n - i)  })
      }
    }
  }
}
</script>

<style scoped>
.myswiper1 {
  height: 200px;
}
.myswiper1 .swiper-slide {
  background-color: #ccc;
  border: 1px solid red;
}
.myswiper1 .swiper-slide a {
  display: inline-block;
  padding: 10px;
  width: 100%;
  height: 100%;
}

.myswiper2 {
  height: 200px;
}
.myswiper2 .swiper-slide {
  padding: 10px;
  background-color: yellowgreen;
  border: 1px solid red;
}
</style>
