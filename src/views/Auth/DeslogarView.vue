<template>
  <div></div>
</template>

<script>
import LocalStorageMixin from "@/mixins/localStorageMixin.js";
import ToastMixin from "@/mixins/toastMixin.js";

export default {
  name: "Deslogar",

  mixins: [LocalStorageMixin, ToastMixin],

  created() {
    this.setLocalStorage("Adopt_at", "", 0);
    this.$router.push({ name: "Login" });
    this.showToast("success", "Sucesso!", "Você foi deslogado com sucesso!");
  }
};
</script>
