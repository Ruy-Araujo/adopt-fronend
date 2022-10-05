<template>
  <div></div>
</template>

<script>
import AutenticacaoMixin from "@/mixins/autenticacaoMixin.vue";
import ToastMixin from "@/mixins/toastMixin.js";

export default {
  name: "Deslogar",

  mixins: [AutenticacaoMixin, ToastMixin],

  created() {
    this.defineToken("", 0);
    setTimeout(function() {}, 3000);
    this.$emit("autenticacao", this.obtemToken());
    this.$router.push({ name: "Login" });
    this.showToast("success", "Sucesso!", "Você foi deslogado com sucesso!");
  }
};
</script>
