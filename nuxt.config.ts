const config: any = {
  /*
   ** Headers of the page
   */
  head: {
    title: "nuxtjs-demo",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      {
        src:
          "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.core.js"
      }
    ]
  },
  css: ["~assets/style.css"],
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#3B8070" },
  /*
   ** Build configuration
   */
  router: {
    extendRoutes(router: any, resolve: any) {
      router.push({
        name: "error404",
        path: "*",
        component: resolve(__dirname, "pages/error.vue")
      })
    }
  },
  plugins: [
    {
      src: "~plugins/global.js"
    }
  ],
  buildModules: ["@nuxt/typescript-build"],
  build: {
    /*  vendor: ['external_library'], */
    /*
     ** Run ESLint on save
     */
    extend(config: any, { isDev, isClient }: any) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        })
      }

      config.resolve.alias["vue$"] = "vue/dist/vue.esm.js"
    }
  }
}

export default config
