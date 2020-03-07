<template>
  <div>
    <h1>swiper test</h1>
    <h2>msg : {{ msg }}</h2>
    <div>
      <button class="tabBtn" @click="clickHandler(1)">tab1</button>
      <button class="tabBtn" @click="clickHandler(2)">tab2</button>
    </div>
    <div>
      swiper 1
      <div
        v-swiper="swiperOptions"
        @transitionEnd="onTransitionEnd"
        class="swiper-container myswiper1"
        v-show="isShowNum === 1"
      >
        <div class="swiper-wrapper">
          <a href="#" class="swiper-slide" @click.prevent="slideClick('/sub')" v-for="(item, idx) in list" :key="idx">
            {{ item.name }}
          </a>
        </div>
      </div>
    </div>
    <!--div>
      swiper 2
      <div v-swiper class="swiper-container myswiper2" v-show="isShowNum === 2">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, idx) in list" :key="idx">{{ item.name }}</div>
        </div>
      </div>
    </div-->
    <router-link to="sub">sub</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowNum: 1,
      list: [],
      msg: "",
      swiperOptions: {
        on: {
          transitionEnd: function() {
            console.log("transitionEnd 11111")
          }
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
      this.list = [{ name: "item1" }, { name: "item2" }]

      this.isShowNum = 1
      this.msg = "add item"
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
