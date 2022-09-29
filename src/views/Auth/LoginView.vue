<template>
  <b-col class="login d-flex justify-content-center align-items-center">
    <div class="login-box">
      <h2 class="text-center mb-5 title-login">Faça o login</h2>
      <b-form>
        <b-form-group label="E-mail" label-for="email">
          <b-form-input
            id="email"
            type="email"
            placeholder="joaosilva@email.com"
            autocomplete="off"
            v-model="form.email"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Senha" label-for="senha">
          <b-form-input
            id="senha"
            type="password"
            placeholder="Digite sua senha"
            v-model="form.senha"
          ></b-form-input>
        </b-form-group>

        <b-button submit type="button" variant="primary" block @click="login">
          <i class="fas fa-sign-in-alt"></i> Entrar
        </b-button>
      </b-form>
    </div>
  </b-col>
</template>

<script>
import ToastMixin from "@/mixins/toastMixin.js";
import LocalStorageMixin from "@/mixins/localStorageMixin.js";
import axios from "axios";

export default {
  name: "Login",

  mixins: [ToastMixin, LocalStorageMixin],
  // TODO: Usar design prévio para outras páginas se der - (Parcial feito)
  data() {
    return {
      form: {
        email: "",
        senha: ""
      }
    };
  },

  methods: {
    async login() {
      let headers = {
        "Access-Control-Allow-Origin": "*"
      };

      try {
        let response = await axios.post(
          "https://adoptapp.azurewebsites.net/login",
          this.form,
          headers
        );
        this.setLocalStorage(
          "Adopt_at",
          response.data.access_token,
          response.data.expires
        );
        this.showToast("success", "Sucesso!", "Você está logado!");

        this.$router.push({ name: "Vitrine" });
      } catch (err) {
        this.showToast("danger", "Erro!", err.response.data.detail.error);
      }
    }
  },
  created() {
    let estaAutenticado = this.getLocalStorage("Adopt_at");

    if (estaAutenticado) {
      this.$router.push({ name: "Vitrine" });
    }
  }
};
</script>

<style>
.login {
  height: 90vh;
}

.login-box {
  min-width: 30%;
}

.title-login {
  font-weight: bold;
}
</style>
