<template>
  <div class="container mt-2">
    <b-form>
      <b-form-group label="Primeiro nome" laber-for="primeiroNome">
        <b-form-input
          id="primeiroNome"
          v-model.trim="primeiroNome.$model"
          type="text"
          placeholder="João"
          autocomplete="off"
          required
          :state="this.validaCampo(primeiroNome)"
          aria-describedby="primeiroNomeFeedback"
        ></b-form-input>
        <b-form-invalid-feedback id="primeiroNomeFeedback"
          >O primeiro nome precisa ter mais de 2
          caracteres.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group label="Último nome" laber-for="ultimoNome">
        <b-form-input
          id="ultimoNome"
          v-model.trim="ultimoNome.$model"
          type="text"
          placeholder="João"
          autocomplete="off"
          required
          :state="this.validaCampo(ultimoNome)"
          aria-describedby="ultimoNomeFeedback"
        ></b-form-input>
        <b-form-invalid-feedback id="ultimoNomeFeedback"
          >O último nome precisa ter mais de 2
          caracteres.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group label="Email" laber-for="email">
        <b-form-input
          id="email"
          v-model.trim="email.$model"
          type="email"
          placeholder="João"
          autocomplete="off"
          required
          :state="this.validaCampo(email)"
          aria-describedby="emailFeedback"
        ></b-form-input>
        <b-form-invalid-feedback id="emailFeedback"
          >Coloque um email válido.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group label="Senha" laber-for="senha">
        <b-form-input
          id="senha"
          v-model.trim="senha.$model"
          type="password"
          placeholder="João"
          autocomplete="off"
          required
          :state="this.validaCampo(senha)"
          aria-describedby="senhaFeedback"
        ></b-form-input>
        <b-form-invalid-feedback id="senhaFeedback"
          >Sua senha deve ter pelo menos 8 caracteres.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-button
        :variant="obtemValidador ? 'primary' : 'light'"
        @click="salvarUsuario"
        :disabled="!obtemValidador"
      >
        Salvar
      </b-button>
    </b-form>
  </div>
</template>

<script>
import { required, minLength, email } from "vuelidate/lib/validators";
import axios from "axios";

export default {
  name: "Cadastro",
  data() {
    return {
      form: {
        primeiro_nome: "",
        ultimo_nome: "",
        email: "",
        senha: ""
      }
    };
  },
  validations: {
    form: {
      primeiro_nome: {
        required,
        minLength: minLength(2)
      },
      ultimo_nome: {
        required,
        minLength: minLength(2)
      },
      email: {
        required,
        email
      },
      senha: {
        required,
        minLength: minLength(8)
      }
    }
  },
  computed: {
    primeiroNome() {
      return this.$v.form.primeiro_nome;
    },
    ultimoNome() {
      return this.$v.form.ultimo_nome;
    },
    email() {
      return this.$v.form.email;
    },
    senha() {
      return this.$v.form.senha;
    },
    obtemValidador() {
      return (
        this.validaCampo(this.primeiroNome) &&
        this.validaCampo(this.ultimoNome) &&
        this.validaCampo(this.email) &&
        this.validaCampo(this.senha)
      );
    }
  },
  methods: {
    validaCampo(campo) {
      if (campo.$dirty === false) {
        return null;
      }
      return !campo.$error;
    },
    async salvarUsuario() {
      console.log("Salvo!");
      let headers = {
        "Access-Control-Allow-Origin": "*"
      };

      try {
        await axios.post(
          "https://adoptapp.azurewebsites.net/user/register",
          this.form,
          headers
        );
        this.$router.push({ name: "Login" });
      } catch (err) {
        this.showToast("danger", "Erro!", err.message);
      }
    }
  }
};
</script>
