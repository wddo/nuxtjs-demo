<template>
  <div>
    <v-overlay :value="isShow">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isShow: false
      }
    },

    mounted() {
      this.$eventBus.$on('loading-start', () => {
        this.isShow = true
      })

      this.$eventBus.$on('loading-stop', () => {
        this.isShow = false
      })
    }
  }
</script>

<style scoped>

</style>
