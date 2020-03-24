<template>
  <div>
    <div>
      <h2>Child</h2>
      <button @click="btnHandler">{{ this.msg }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Child",
  data() {
    return {
      msg: "im button"
    }
  },
  methods: {
    btnHandler() {
      this.msg = "you button"
    }
  },
  beforeCreate() {
    console.log("beforeCreate /mycomponent > child")
  },
  created() {
    console.log("created /mycomponent > child")
  },
  beforeMount() {
    console.log("beforeMount /mycomponent > child")
  },
  mounted() {
    console.log("mounted /mycomponent > child")
  },
  beforeUpdate() {
    console.log("beforeUpdate /mycomponent > child" /* , this.msg */)
  },
  updated() {
    console.log("updated /mycomponent > child" /* , this.msg */)
  }
}
</script>

<style scoped></style>
