<template>
  <!-- <div :style="`background-color: ${color}`">
    <span>{{txt}}</span>
  </div> -->
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
    /* txt : {
      type: String,
      default: 'empty'
    },
    color : {
      type: String,
      default: ''
    } */
    src: {
      type: String,
      default: ''
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
      if (_.indexOf(this.src, 'http') !== 0) {
        return 'https://image.hanatour.com/usr/cms/resize/500_0/' + this.src
      } else {
        return _.defaultTo(this.src, '')
      }
    },
    imgDataPath() {
      if (_.indexOf(this.dataSrc, 'http') !== 0) {
        return 'https://image.hanatour.com/usr/cms/resize/500_0/' + this.dataSrc
      } else {
        return _.defaultTo(this.dataSrc, '')
      }
    }
  }
}
</script>

<style scoped>

</style>
