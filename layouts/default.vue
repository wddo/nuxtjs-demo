<template>
  <div id="app">
    <v-app id="inspire">
      <navigation />

      <Loading />

      <v-main>
        <nuxt />
      </v-main>

      <footer2 />
    </v-app>
  </div>
</template>

<script>
import Navigation from '~/components/Navigation'
import Footer2 from '~/components/Footer2'
import Loading from '~/components/Loading'

export default {
  data() {
    return {

    }
  },
  components: {
    Navigation,
    Footer2,
    Loading,
  }
}
</script>
