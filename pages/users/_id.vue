<template>
  <div>id page</div>
</template>


<script>
export default {
  validate({ params }) {
    return /\d+$/.test(params.id);
  }
};
</script>