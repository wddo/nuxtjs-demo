<template>
  <w-group class="w_toggle_content">
    <slot />
  </w-group>
</template>

<script>
import WGroup from "../WGroup";

export default {
  name: "w-toggle-content",
  components: { WGroup }
};
</script>

<style>
.w_toggle_content {
  width: 500px;
  height: 400px;
  float: left;
  position: absolute;
  background-color: cadetblue;
}
</style>
