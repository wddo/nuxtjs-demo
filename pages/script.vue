<template>
  <div>
    <div v-html="vHtml"></div> <!--이스케이프 형태로 변형 되므로 스크립트 호출 안됨, process.client를 풀면 ssr에서 호출됨-->
    <script id="dynamicScript"></script>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        htmlSource : ''
      }
    },
    computed: {
      vHtml: function () {
        return process.client ? '<script>console.log("a")<\/script><script>console.log("b")<\/script><span> text<\/span>' : ''
      }
    },
    created() {
      console.log('created')
    },
    mounted() {
      console.log('mounted')

      const ds = document.querySelector('#dynamicScript');
      ds.insertAdjacentHTML('afterbegin', 'console.log("test")')
    },
    updated() {
      console.log('updated')
    }
  }
</script>

<style scoped>

</style>
