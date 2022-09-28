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
