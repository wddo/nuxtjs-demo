<template>
  <div class="header">
    <input
      type="checkbox"
      id="mycheck"
      v-model="agrees"
      true-value="true"
      false-value="false"
      value
      @change="onChange"
    />
    <label name="mycheck">{{agrees}}</label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      agrees: false
    };
  },
  mounted() {
    this.agrees = this.$store.getters.agrees;
  },
  methods: {
    onChange(e) {
      this.agrees = e.target.checked;

      this.$store.commit("agrees", this.agrees);
    }
  }
};
</script>


<style>
</style>