<script>
export default {
  data() {
    return {
      msg: "company",
      arr: ["1", "2", "3", "4"]
    }
  },
  created() {
    console.log("created")
  },
  render(h) {
    //dom에 바인딩 되어있는 data 변경 시 실행 주의
    console.log("render")
    return h("div", [
      this.msg,
      h(
        "button",
        {
          on: {
            click: this.clickHandler
          }
        },
        ["toggle"]
      ),
      h("div", this.arr)
    ])
  },
  mounted() {
    console.log("mounted")
  },
  updated() {
    console.log("updated")
  },
  methods: {
    clickHandler() {
      this.msg = "change company"
      this.$nextTick(() => {
        console.log("nextTick 1")
      })
      setTimeout(() => {
        this.arr = ["a", "b", "c", "d"]
        this.$nextTick(() => {
          console.log("nextTick 2")
        })
      }, 1000)
    }
  }
}
</script>
