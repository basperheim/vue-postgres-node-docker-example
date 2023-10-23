import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./components/Home/HomePage.vue";
import AboutPage from "./components/About/AboutPage.vue";

// https://router.vuejs.org/guide/essentials/named-routes.html
const routes = [
  {
    path: "/",
    name: "Home Page",
    component: HomePage,
  },
  {
    path: "/about",
    name: "About Page",
    component: AboutPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
