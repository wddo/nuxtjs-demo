<template>
  <!-- <div :style="`background-color: ${color}`">
    <span>{{txt}}</span>
  </div> -->
  <img :src="realSrc" :title="this.title" />
</template>

<script>
export default {
  name: 'FxImg',
  props: {
    src: {
      type: String,
      default: ''
    },
    title : {
      type: String,
      default: ''
    },
    /* txt : {
      type: String,
      default: 'empty'
    },
    color : {
      type: String,
      default: ''
    } */
  },
  methods: {
    checkDataSrc(target) {
      let count = 0
      return new Promise((resolve, reject) => {
        let timeId = setInterval(() => {
          if (_.isNil(target.$el.getAttribute('data-src'))) {
            clearInterval(timeId)
            resolve(target.$el.getAttribute('src'))
          }

          count += 1

          if (count > 10) {
            clearInterval(timeId)
            reject()
          }
        }, 1000)
      })
    },
    async fullSrc(_src) {
      if (this.$attrs['data-src']) {
        const dataSrc = await this.checkDataSrc(this)

        console.log('xxxx complete')
        _src = dataSrc
      }

      const result = 'https://image.hanatour.com/usr/cms/resize/500_0/' + _src

      console.log('xxxx', result)

      return result
    }
  },
  computed: {
    realSrc() {
      const imgPath = this.src
      console.log('xxxx call realSrc', imgPath)

      return this.fullSrc(imgPath)
    }
  }
}
</script>

<style scoped>

</style>
