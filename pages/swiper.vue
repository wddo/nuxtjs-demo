<template>
  <div>
    <h1>swiper test</h1>
    <div>
      <button class="tabBtn" @click="clickHandler(1)">tab1</button>
      <button class="tabBtn" @click="clickHandler(2)">tab2</button>
    </div>
    <div>
      swiper 1
      <div v-swiper class="swiper-container myswiper1" v-show="isShow === 1">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, idx) in list" :key="idx">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div>
      swiper 2
      <div v-swiper class="swiper-container myswiper2" v-show="isShow === 2">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, idx) in list" :key="idx">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: 0,
      list: []
    }
  },
  mounted() {
    setTimeout(() => {
      this.list = [{ name: "item1" }, { name: "item2" }, { name: "item3" }, { name: "item4" }]

      this.isShow = 1
    }, 2000)

    setTimeout(() => {
      this.isShow = 2 //observeParents 테스트
    }, 3000)

    setTimeout(() => {
      this.list.unshift({ name: "item0" })
    }, 4000)
  },
  methods: {
    clickHandler(n) {
      this.isShow = n
    }
  }
}
</script>

<style scoped>
.myswiper1 {
  height: 200px;
}
.myswiper1 .swiper-slide {
  padding: 10px;
  background-color: #ccc;
  border: 1px solid red;
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
