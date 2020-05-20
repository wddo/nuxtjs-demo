<template>
  <div class="swiper-slide">
    <div>
      <fx-img :title="item.name" />
      <a href="#" @click.prevent="slideClick('/sub')">
        <span>{{item.name}}</span>
      </a>
    </div>
  </div>
</template>

<script>
import FxImg from '~/components/FxImg'

export default {
  components: {FxImg},
  props: {
    item : {
      type : Object,
      defaults : {name: '', color: ''}
    }
  },
  methods: {
    slideClick(link) {
      if (link) this.$router.push(link)
    },
  }
}
</script>

<style scoped>
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.swiper-slide {
  background-color: #ccc;
  border: 1px solid red;
}

.swiper-slide a {
  display: inline-block;
  padding: 10px;
  width: 100%;
  height: 100%;
}

.swiper-slide img {
  position: absolute;
}

.swiper-slide span {
  border: 1px solid gray
}
</style>
