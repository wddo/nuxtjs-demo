<template>
  <div>
    <h2>About</h2>
    <div class="about_list">
      <ul>
        <li>
          <a href="#" @click.prevent="tabClick">toggle</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  layout: "hnt",
  methods: {
    tabClick(e) {
      if (!this.$store.getters.agrees) e.stopPropagation();
    }
  }
};
</script>

<style>
.about_list ul li {
  display: block;
  float: left;
  background-color: gray;
  padding: 10px;
  border: 1px solid darkgray;
}
</style>