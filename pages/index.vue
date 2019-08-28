<template>
  <section class="container">
    <w-toggle :options="{
      selector : '.tab_btns > li > a'
    }">
      <ul id="myid" class="tab_btns red" style="backround-color:#fff;" selected>
        <li>
          <a href="#">aa</a>
        </li>
        <li>
          <a href="#">bb</a>
        </li>
        <li>
          <a href="#">cc</a>
        </li>
        <li>
          <a href="#">dd</a>
        </li>
      </ul>
      <div class="tab_content">content1</div>
      <div class="tab_content">content2</div>
      <div class="tab_content">content3</div>
      <div class="tab_content">content4</div>
    </w-toggle>
  </section>
</template>

<script>
import WToggle from "~/components/WToggleComponent";

export default {
  name: "company",
  components: { WToggle },
  methods: {
    clickHandler() {
      console.log("clickHandler");
    }
  }
};
</script>

<style>
</style>

