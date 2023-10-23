import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";
import store from "./store";

const app = createApp(App);
app.use(store);
app.use(router);
app.mount("#app");
