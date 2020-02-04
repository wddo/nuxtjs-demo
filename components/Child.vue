<template>
  <div>
    <div>
      <h2 :style="myStyle">child</h2>
      <button @click="btnHandler">{{ this.msg }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Child",
  data() {
    return {
      myStyle: {
        marginTop: "10px"
      },
      msg: "im button"
    }
  },
  methods: {
    btnHandler() {
      this.msg = "you button"
    }
  },
  beforeCreate() {
    console.log(`beforeCreate : child`)
  },
  created() {
    console.log(`created : child`)
    //console.log("msg : ", this.msg);
  },
  beforeMount() {
    console.log(`beforeMount : child`)
    //console.log("el : ", this.$el);
  },
  mounted() {
    console.log(`mounted : child`)
  },
  beforeUpdate() {
    console.log("beforeUpdate : child /" /* , this.msg */)
  },
  updated() {
    console.log("updated : child /" /* , this.msg */)
  }
}
</script>

<style scoped></style>
