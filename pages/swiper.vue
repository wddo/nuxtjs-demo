<template>
  <div class="panels">
    <h1>swiper test</h1>
    <div>
      <button class="tabBtn" @click="clickHandler(1)">show 1</button>
      <button class="tabBtn" @click="clickHandler(2)">show 2</button>
      <button class="tabBtn" @click="clickHandler(0)">toggle : {{ this.toggle }}</button>
      <button class="tabBtn" @click="addSlide(1)">add slide 1</button>
      <button class="tabBtn" @click="addSlide(5)">add slide 5</button>
    </div>
    <ul class="tabs">
      <li class="on"><a href="#" class="btn" data-idx="0">tab 1</a></li>
      <li><a href="#" class="btn" data-idx="1">tab 2</a></li>
    </ul>
    <div class="panel selected">
      <div v-if="isShowNum === 1 || (toggle && !isShowNum)">
        <h3>swiper 1</h3>
        <div v-swiper="swiperOptions" @slideChangeTransitionStart="onSlideChangeTransitionStart" class="swiper-container myswiper1">
          <div class="swiper-wrapper">
            <a href="#" class="swiper-slide" @click.prevent="slideClick('/sub')" v-for="(item, idx) in list" :key="idx">
              {{ item.name }}
            </a>
          </div>
          <div class="swiper-pagination"></div>
          <div class="control">
            <button class="prevBtn">prev</button>
            <span class="total"></span>
            <button class="nextBtn">next</button>
          </div>
        </div>
      </div>
    </div>
    <div>swiepr binding : {{ num + 1 }}</div>
    <div class="panel selected">
      <div v-if="isShowNum === 2 || (toggle && !isShowNum)">
        <h3>swiper 2</h3>
        <div v-swiper="swiperOptions2" class="swiper-container myswiper2">
          <div class="swiper-wrapper">
            <a href="#" class="swiper-slide" @click.prevent="slideClick('/sub')" v-for="(item, idx) in list" :key="idx">{{ item.name }}</a>
          </div>
          <div class="swiper-pagination"></div>
          <div class="control">
            <button class="prevBtn">prev</button>
            <span class="total"></span>
            <button class="nextBtn">next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      num: 0,
      isShowNum: 1,
      toggle: true,
      list: [{ name: 'no item' }],
      msg: '',
      swiperOptions: {
        loop: true,
        spaceBetween: 10,
        pagination: {
          el: '.myswiper1 .swiper-pagination',
          type: 'progressbar'
        },
        navigation: {
          nextEl: '.myswiper1 .nextBtn',
          prevEl: '.myswiper1 .prevBtn'
        },
        on: {
          slideChangeTransitionStart: function() {
            console.log('slideChangeTransitionStart 11111')
          }
        },
        exChange: (swiper, type, { idx, max }) => {
          this.num = idx
        }
      },
      swiperOptions2: {
        loop: true,
        spaceBetween: 10,
        pagination: {
          el: '.myswiper2 .swiper-pagination',
          type: 'fraction'
        },
        /* autoplay: {
          delay : 4000
        }, */
        navigation: {
          nextEl: '.myswiper2 .nextBtn',
          prevEl: '.myswiper2 .prevBtn'
        },
        on: {
          transitionStart: function() {
            console.log('transitionStart')
          }
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
    }, 1000)

    // not Vue click handler
    _.forEach(document.querySelectorAll('.btn'), item => {
      item.addEventListener('click', function (e) {
        console.log(e)

        const target = e.currentTarget
        const parent = target.parentElement.parentElement
        const id = parseInt(target.getAttribute('data-idx'))
        let activateContent

        _.forEach(parent.querySelectorAll('li'), (item, idx) => {
          if (idx === id) {
            item.classList.add('on')
          } else {
            item.classList.remove('on')
          }
        })

        _.forEach(document.querySelectorAll('.panel'), (item, idx) => {
          if (idx === id) {
            item.classList.add('selected')
            activateContent = item
          } else {
            item.classList.remove('selected')
          }
        })

        e.preventDefault()
      })
    })
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

.control {
  position: absolute;
  width: 100%;
  bottom: 30px;
  z-index: 20;
  text-align: center;
}
.control button {
  cursor: pointer;
}

.tabs li {
  float :left;
  margin: 5px 5px 0px;
  padding: 3px;
  background-color: gray;
}
.tabs li.on {
  background-color: darkorange
}

.tabs {
  overflow: hidden;
}

.panel {
  display: none;
}

.panel.selected {
  display: block;
}
</style>
