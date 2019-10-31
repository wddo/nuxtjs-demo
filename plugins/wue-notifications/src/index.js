import layout from "./layout.vue";
import { events } from "./events";

const clsName = "notifications";
const notifications = {
  install(Vue, options) {
    if (this.installed) return;

    Vue.component(`w-${clsName}`, layout); //add <wnotifications>

    events.$emit("init", options); //init

    const cls = (payload => {
      events.$emit("open", payload);
    }).bind(this);

    Vue.prototype[`$w${clsName}`] = cls; //Vue instance
    Vue[`$w${clsName}`] = cls; //global

    this.installed = true;
  }
};

export default notifications;
