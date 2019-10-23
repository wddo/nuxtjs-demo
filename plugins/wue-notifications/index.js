import WNotificatinos from "./WNotifications.vue";
import { events } from "./events";

const notification = {
  install(Vue, options) {
    if (this.installed) return;

    Vue.component("wnotifications", WNotificatinos);

    events.$emit("init", options);

    const notifications = (options => {
      events.$emit("open", options);
    }).bind(this);

    Vue.prototype["$wnotifications"] = notifications; //instance
    Vue["wnotifications"] = notifications; //static

    this.installed = true;
  }
};

export default notification;
