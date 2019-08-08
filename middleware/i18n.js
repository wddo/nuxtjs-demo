export default ({ isHMR, app, store, route, params, error, redirect }) => {
  const defaultLocale = app.i18n.fallbackLocale;

  if (isHMR) {
    return;
  }

  const locale = params.lang || defaultLocale;

  //state.locales 에 등록된게 없으면 에러
  if (!store.state.locales.includes(locale)) {
    return error({ message: "This page could not be found.", statusCode: 404 });
  }

  //locale 셋팅
  store.commit("SET_LANG", locale);
  app.i18n.locale = store.state.locale;

  //디폴트 언어(en)와 현재 언어와 같고 /en/ 이나 /en 로 접근했다면 / 로 변경
  if (
    locale === defaultLocale &&
    route.fullPath.indexOf("/" + defaultLocale) === 0
  ) {
    const toReplace =
      "^/" +
      defaultLocale +
      (route.fullPath.indexOf("/" + defaultLocale + "/") === 0 ? "/" : "");
    const re = new RegExp(toReplace);

    return redirect(route.fullPath.replace(re, "/"));
  }
};
