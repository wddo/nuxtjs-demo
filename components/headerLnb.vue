<template>
  <div>
    <ul>
      <li><router-link to="swiper">swiper</router-link></li>
      <li><router-link to="gallery">gallery</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'headerLnb'
}
</script>

<style scoped>
ul {
  display: flex;
  flex-flow: row nowrap;
}
ul li {
  flex: 1 1 auto;
  line-height: 40px;
  height: 100%;
  border: 1px solid #333;
  margin: 2px;
  background-color: skyblue;
  text-align: center;
}
ul li a {
  display: inline-block;
  width: 100%;
  height: 100%;
  color: #007acc;
  font-weight: bold;
}
</style>
