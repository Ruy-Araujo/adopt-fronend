<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-nav>
          <b-nav-item
            :to="{ name: 'Vitrine' }"
            :active="getRouteName === 'Vitrine'"
            >Vitrine</b-nav-item
          >
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="estaAutenticadoApp" :to="{ name: 'Deslogar' }"
            >Deslogar</b-nav-item
          >
          <b-nav-item
            v-else
            :to="{ name: 'Login' }"
            :active="getRouteName === 'Login'"
            >Login</b-nav-item
          >
        </b-navbar-nav>
      </b-navbar>
    </div>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import LocalStorageMixin from "@/mixins/localStorageMixin.js";
// TODO: Arrumar botão de logar e deslogar

export default {
  name: "App",
  data() {
    return {
      estaAutenticadoApp: Boolean(this.getLocalStorage("Adopt_at"))
    };
  },

  computed: {
    getRouteName() {
      return this.$route.name;
    }
  },

  mixins: [LocalStorageMixin],

  method: {
    getRouteName() {
      return this.$route.name;
    }
  },

  created() {
    this.localStorageExpires();
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f2f2f2;
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 1.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave {
  opacity: 0;
}
</style>
