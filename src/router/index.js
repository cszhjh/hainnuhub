import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const routes = [
  {
    path: "/",
    name: "layout",
    redirect: "/forum/0",
    component: () => import("@/views/Layout"),
    children: [
      {
        path: "forum/:labelId",
        name: "labelForum",
        component: () => import("@/views/forum/Forum"),
        meta: {
          keepAlive: true
        }
      },
      {
        path: "post/:forumId",
        name: "article",
        component: () => import("@/views/article/Article")
      },
      {
        path: "newPost",
        name: "newPost",
        component: () => import("@/views/forum/components/ForumEditPost")
      },
      {
        path: "editPost/:forumId",
        name: "editPost",
        component: () => import("@/views/forum/components/ForumEditPost")
      },
      {
        path: "user/:userId",
        name: "user",
        component: () => import("@/views/user/User"),
        meta: {
          keepAlive: true
        }
      },
      {
        path: "/user/message/:type",
        name: "message",
        component: () => import("@/views/message/Message")
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not found",
    component: () => import("@/views/NotFound.vue")
  }
];

const router = createRouter({
  routes,
  history: createWebHistory()
});

router.beforeResolve((to, from, next) => {
  const status = store.getters["user/getLoginState"];
  if ((to.name === "newPost" || to.name === "editPost") && !status) {
    ElMessage.error("你还没有登录，请先登录");
    next("/");
  } else {
    next();
  }
});

export default router;
