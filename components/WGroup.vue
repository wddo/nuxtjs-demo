<script>
export default {
  name: "w-group",
  data() {
    return {
      errorMessage: "No element in slot"
    };
  },
  props: {
    click: {
      type: Function,
      default: () => {}
    }
  },
  render(h) {
    const slotDefault = this.$slots.default;

    return slotDefault.length > 0
      ? h(
          slotDefault[0].tag,
          {
            class: slotDefault[0].data.staticClass,
            style: slotDefault[0].data.staticStyle,
            attrs: slotDefault[0].data.attrs,
            on: {
              click: this.click
            }
          },
          slotDefault[0].children
        )
      : h("div", this.errorMessage);
  }
};
</script>

<style>
</style>