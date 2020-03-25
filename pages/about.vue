<template>
  <div class="sub_container">
    <div><button @click.prevent="goBack">go back</button></div>
    <h1>about</h1>
    <ul>
      <li><router-link to="/"> go index </router-link></li>
      <li><router-link to="/about/child"> go about child </router-link></li>
      <li><router-link to="/empty"> go empty </router-link></li>
    </ul>
    <hr />
    <button @click.prevent="toggleClick">toggle</button>
    <div class="toggle" v-show="showToggle">
      toggle me!
    </div>

    <nuxt-child />
  </div>
</template>

<script>
export default {
  data() {
    return {
      showToggle: true
    };
  },
  methods: {
    toggleClick() {
      this.showToggle = !this.showToggle;
    }
  },
  created() {
    console.log("created /about");
  },
  mounted() {
    console.log("mounted /about");
  }
};
</script>

<style scoped>
  div.toggle {
    background-color: yellowgreen;
    width: 100px;
    height: 100px;
  }
</style>
