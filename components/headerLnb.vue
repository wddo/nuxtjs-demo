<template>
  <div>
    <ul id="lnb">
      <li><router-link to="swiper">menu1</router-link></li>
      <li><router-link to="gallery">menu2</router-link></li>
    </ul>
    <div id="sub">sub</div>
  </div>
</template>

<script>
export default {
  name: 'headerLnb'
}
</script>

<style src="../static/css/header.css"></style>
