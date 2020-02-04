<template>
  <div>
    <div><button @click.prevent="goBack">go back</button></div>
    <h1>about</h1>
    <ul>
      <li><router-link to="/"> go index </router-link></li>
      <li><router-link to="/aaa"> go aaa </router-link></li>
    </ul>
    <hr />

    {{ this.msg }}

    <hr />
    <button @click.prevent="toggleClick">toggle</button>
    <div class="toggle" v-show="showToggle">
      toggle me!
    </div>

    <nuxt-child />
  </div>
</template>

<script>
import store from "~/store"

export default {
  mixins: [store],
  data() {
    return {
      msg: "",
      showToggle: true
    }
  },
  methods: {
    toggleClick() {
      this.showToggle = !this.showToggle
    }
  },
  layout: "dark",
  head() {
    return {
      title: "소개11111",
      script: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      console.log(this.msg)
      this.msg = "about"
      console.log(this.msg)
    }, 2000)
  }
}
</script>

<style scoped>
div.toggle {
  background-color: yellowgreen;
  width: 100px;
  height: 100px;
}
</style>
