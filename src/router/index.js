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

export default new VueRouter({
  mode: "history",
  routes
});

// TODO: Implementar validação de login para rotas que precisam de login
// router.beforeEach((to, from, next) => {
//   if (
//     to.name !== "login" &&
//     to.name !== "register" &&
//     !localStorage.getItem("authUser")
//   ) {
//     next({ name: "login" });
//   } else {
//     next();
//   }
// });
