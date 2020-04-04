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
    <div v-if="isShowNum === 1 || (toggle && !isShowNum)">
      <h3>swiper 1</h3>
      <div v-swiper="swiperOptions" @slideChangeTransitionStart="onSlideChangeTransitionStart" class="swiper-container myswiper1">
        <div class="swiper-wrapper">
          <a href="#" class="swiper-slide" @click.prevent="slideClick('/sub')" v-for="(item, idx) in list" :key="idx">
            {{ item.name }}
          </a>
        </div>
        <div class="swiper-pagination"></div>
        <div class="controller" v-if="list.length > 0">
          <button class="prevBtn">prev</button>
          <button class="nextBtn">next</button>
        </div>
      </div>
    </div>
    <div v-if="isShowNum === 2 || (toggle && !isShowNum)">
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
      isShowNum: 3,
      toggle: true,
      list: [],
      msg: '',
      swiperOptions: {
        loop: false,
        spaceBetween: 10,
        pagination: {
          el: '.myswiper1 .swiper-pagination',
          type: 'fraction'
        },
        navigation: {
          nextEl: '.myswiper1 .nextBtn',
          prevEl: '.myswiper1 .prevBtn'
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
          el: '.myswiper2 .swiper-pagination'
        },
        autoplay: {
          delay : 4000
        },
        navigation: {
          nextEl: '.myswiper2 .nextBtn',
          prevEl: '.myswiper2 .prevBtn'
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

      console.log('add item')
      this.$eventBus.$emit(this.EVENT.TRACE, 'add item')

      this.isShowNum = 0

      this.$nextTick(() => {
        // this.$fx.swiper.reset(this)
      })
    }, 1000)
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
.myswiper1 .controller {
  position: absolute;
  width: 100%;
  bottom: 10px;
  z-index: 20;
  text-align: center;
}
.myswiper1 .controller button {
  cursor: pointer;
}

.myswiper1 .controller button:nth-child(1) {
  margin-right: 20px
}
.myswiper1 .controller button:nth-child(2) {
  margin-left: 20px
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
