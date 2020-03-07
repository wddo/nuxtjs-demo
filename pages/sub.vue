<template>
  <div>
    <h1>sub</h1>
    <router-link to="swiper">swiper</router-link>
  </div>
</template>

<script>
export default {
  created() {
    console.log("sub created")
  },
  mounted() {
    console.log("sub mounted")
  }
}
</script>

<style scoped></style>
