export default {
  loading: { color: "cyan" },
  router: {
    middleware: "i18n"
  },
  plugins: ["~/plugins/i18n"],
  generate: {
    routes: ["/", "/about", "/kr", "/kr/about"]
  }
};
