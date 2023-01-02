import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/statistics",
      name: "statistics",
      component: () => import("../views/StatisticsView.vue"),
    },
    {
      path: "/start",
      name: "Start",
      component: () => import("../views/StartGameView.vue"),
    },
    {
      path: "/play",
      name: "Play",
      component: () => import("../views/MainGameView.vue")
    },
    {
      path: "/tutorial",
      name: "Tutorial",
      component: () => import("../views/TutorialView.vue")
    },
    {
      path: "/settings",
      name: "Settings",
      component: () => import("../views/Settingsview.vue")
    }
  ],
});

export default router;
