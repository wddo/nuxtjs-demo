<template>
  <w-group class="w_toggle_buttons" :click="clickHandler">
    <slot />
  </w-group>
</template>

<script>
import WGroup from "../WGroup";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "w-toggle-buttons",
  components: { WGroup },
  computed: {
    ...mapGetters("wtoggle", {
      opts: "options"
    })
  },
  mounted() {
    const buttonElements = this.$el.querySelectorAll(this.opts.selector);

    buttonElements.forEach((current, index) => {
      current.dataset.idx = index;
    });

    this.setButtons({ buttonElements });
  },
  methods: {
    clickHandler(e) {
      const target = e.target;
      if (e.target.tagName.toLowerCase() === "a") {
        const idx = target.dataset.idx;

        this.setIndex(idx);
      }
    },
    ...mapActions("wtoggle", ["setButtons", "setIndex"])
  }
};
</script>

<style scpoed>
.w_toggle_buttons {
  padding-left: 0;
  width: 500px;
  height: 70px;
}

li {
  list-style: none;
  float: left;
  height: 70px;
  background-color: #ac3559;
  margin: 2px;
}
li.on {
  margin-top: -5px;
}
li:hover {
  background-color: #d54d76;
}
li a {
  line-height: 70px;
  text-align: center;
  display: inline-block;
  width: 100px;
  height: 70px;
  color: white;
}
li a:link {
  text-decoration: none;
}
li a:visited {
  text-decoration: none;
}
</style>
