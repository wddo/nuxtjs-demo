<template>
  <div class="wrap">
    <div :class="this.htmlClass">
      <!--mounted 에선 첫로드때 바뀜, 이후 updated 에서 바뀜-->
      <nuxt />
    </div>
  </div>
</template>

<script>
function aaa() {
  return true
}

export default {
  data() {
    return {
      is: false
    }
  },
  head() {
    return {
      bodyAttrs: {
        class: this.htmlClass //created, mounted 에선 첫로드때 안바뀜, 이후 updated 에서 바뀜
      }
    }
  },
  created() {
    console.log("!!!!!  layout: created")

    //this.changeIs() //호출 시 mounted()에 의한 wrap 아래 클래스도 반영 안됨
  },
  mounted() {
    console.log("!!!!! layout: mounted")

    this.changeIs()
  },
  updated() {
    console.log("!!!!! layout: updated")
  },
  computed: {
    isis() {
      return this.is
    },
    htmlClass() {
      let arr = ["mobile"]

      if (this.isis) arr.push("ribbon")

      console.log(arr)

      return arr.join(" ")
    }
  },
  methods: {
    checking() {
      if (process.client) {
        return true
      }
    },
    changeIs() {
      const check = this.checking()

      if (check) {
        this.is = true
      } else {
        this.is = false
      }

      console.log("this.is", this.is)
    }
  }
}
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
