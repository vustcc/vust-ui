import { createApp } from "vue";
import App from "./App.vue";
import GlassLab from "./GlassLab.vue";
import "@vustcc/tokens/index.css";
import "@vustcc/vue/style.css";
import "./index.css";

createApp(
  new URLSearchParams(location.search).has("glass") ? GlassLab : App,
).mount("#app");
