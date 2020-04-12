<template>
  <header-lnb></header-lnb>
</template>

<script>
import headerLnb from '~/components/headerLnb'

export default {
  components: {headerLnb},
  mounted() {
    if (process.client) {
      if (typeof window.top.call !== 'undefined' && typeof this.$el.parentElement !== 'undefined') {
        window.top.call(this.$el.parentElement.innerHTML)
      }
    }
  }
}
</script>

<style scoped>

</style>
