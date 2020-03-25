<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
export default {
  data() {
    return {
      cssLinks: []
    };
  },
  head() {
    return {
      link: this.cssLinks
    };
  },
  updated() {
    console.log('updated !layout')
  },
  mounted() {
    console.log('mounted !layout')

    this.changePath();
  },
  methods: {
    addCSS(path) {
      let cssName;
      switch (this.$route.path) {
         case "/about":
          cssName = "sub";
          break;
        default:
          cssName = "main";
      }

      if (_.isNil(_.find(this.cssLinks, item => {return item.href === `/css/${cssName}.css`})) ) {
        this.cssLinks.push({ 'rel': "stylesheet", 'href': `/css/${cssName}.css` })
        this.cssLinks = _.takeRight(this.cssLinks, 10)
        this.$meta().refresh()
      }

      _.forEach(this.cssLinks, (item, idx) => {
        console.log(idx, item.href)
      })
    },
    changePath () {
      this.addCSS();
    }
  },
  watch: {
    '$route.path': 'changePath'
  }
};
</script>

<style>
.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
