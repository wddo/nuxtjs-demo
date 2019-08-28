<script>
import WToggleButtons from "./WToggleComponent/WToggleButtons";
import WToggleContent from "./WToggleComponent/WToggleContent";
import utils from "~/components/mixins/utils";
import { mapActions } from "vuex";

let buttons, contents;

export default {
  name: "w-toggle",
  props: ["options"],
  mixins: [utils],
  created() {
    console.log("::created");
    const elements = this.getChildrenTagContent(this.$slots.default);

    if (elements.length) [buttons, ...contents] = elements;

    this.setOptions(this.options);
  },
  mounted() {
    console.log("::mounted");
  },
  methods: {
    ...mapActions("wtoggle", ["setOptions"])
  },
  render(h) {
    console.log("::render");
    return h(
      "div",
      {
        class: "w_toggle_wrap"
      },
      [
        h(WToggleButtons, [buttons]),
        ...contents.map((elm, idx) => {
          return h(
            WToggleContent,
            {
              key: idx
            },
            [elm]
          );
        })
      ]
    );
  }
};
</script>

<style scoped>
</style>
