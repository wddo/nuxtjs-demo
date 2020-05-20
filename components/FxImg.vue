<template>
  <img :src="imgPath" :data-src="imgDataPath" :title="this.title" />
</template>

<script>
export default {
  name: 'FxImg',
  data() {
    return {
    }
  },
  props: {
    src: {
      type: String,
      default: '/img/none.gif'
    },
    dataSrc: {
      type: String,
      default: ''
    },
    title : {
      type: String,
      default: ''
    }
  },
  methods: {
  },
  computed: {
    imgPath() {
      if (this.src.length && this.src.match(/^[\/|\.|\~]|http(|s)\:\/\//i) === null) {
        return 'https://image.hanatour.com/usr/cms/resize/500_0/' + this.src
      } else {
        return _.defaultTo(this.src, '')
      }
    },
    imgDataPath() {
      if (this.src.length && this.dataSrc.match(/^[\/|\.|\~]|http(|s)\:\/\//i) === null) {
        return 'https://image.hanatour.com/usr/cms/resize/500_0/' + this.dataSrc
      } else {
        return _.defaultTo(this.dataSrc, '')
      }
    }
  }
}
</script>

<style scoped>
 img {
   object-fit: cover;
 }
</style>
