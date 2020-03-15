<template>
  <div>
    <h1>swiper test</h1>
    <div>
      <button class="tabBtn" @click="clickHandler(1)">show 1</button>
      <button class="tabBtn" @click="clickHandler(2)">show 2</button>
      <button class="tabBtn" @click="clickHandler(0)">toggle : {{ this.toggle }}</button>
    </div>
    <div v-show="isShowNum === 1 || (toggle && !isShowNum)">
      <h3>swiper 1</h3>
      <div v-swiper="swiperOptions" @transitionEnd="onTransitionEnd" class="swiper-container myswiper1">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowNum: 1,
      toggle: true,
      list: [],
      msg: "",
      swiperOptions: {
        pagination: {
          el: ".swiper-pagination",
          type: "fraction"
        },
        on: {
          transitionEnd: function() {
            console.log("transitionEnd 11111")
          }
        }
      },
      swiperOptions2: {
        pagination: {
          el: ".swiper-pagination",
          type: "fraction"
        }
      }
    }
  },
  created() {
    console.log("!!!!! created")
  },
  mounted() {
    console.log("!!!!! mounted")
    setTimeout(() => {
      this.list = [{ name: "item1" }, { name: "item2" }, { name: "item3" }, { name: "item4" }]

      this.isShowNum = 1
      this.$eventBus.$emit(this.EVENT.TRACE, "add item")
    }, 500)

    /*
    setTimeout(() => {
      this.list.unshift({ name: "item new" })
      this.msg = "new item"
    }, 3000)
    */
  },
  methods: {
    clickHandler(n) {
      this.isShowNum = n

      if (!n) this.toggle = !this.toggle
    },
    onTransitionEnd() {
      console.log("transitionEnd 22222")
    },
    slideClick(link) {
      if (link) this.$router.push(link)
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
