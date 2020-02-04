<template>
  <div>
    <h1 class="error">error page. sorry</h1>

    <button @click.prevent="goBack">go back</button>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
h1.errror {
  font-size: 5rem;
  color: red;
}
</style>
