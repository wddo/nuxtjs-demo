export const state = () => ({
  locales: ["en", "kr"],
  locale: "en"
});

export const mutations = {
  SET_LANG(state, locale) {
    console.log(state.locales);
    console.log(this.locale);
    if (state.locales.include(locale)) {
      state.locale = locale;
    }
  }
};
