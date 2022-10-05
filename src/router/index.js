import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Vitrine",
    component: () => import("../views/VitrineView.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Auth/LoginView.vue")
  },
  {
    path: "/deslogar",
    name: "Deslogar",
    component: () => import("../views/Auth/DeslogarView.vue")
  },
  {
    path: "/cadastro",
    name: "Cadastro",
    component: () => import("../views/Auth/CadastroView.vue")
  },
  {
    path: "/form-animal",
    name: "FormAnimal",
    component: () => import("../views/Admin/FormAnimalView.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach((to, from, next) => {
  if (
    (to.name === "Deslogar" ||
      to.name === "Cadastro" ||
      to.name === "FormAnimal") &&
    !localStorage.getItem("Adopt_at")
  ) {
    next({ name: "Login", params: { validation: true } });
  } else {
    next();
  }
});

export default router;
