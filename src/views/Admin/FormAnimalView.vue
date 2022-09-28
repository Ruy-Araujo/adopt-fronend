<template>
  <div class="container mt-2">
    <b-form>
      <b-form-group label="Nome" laber-for="nomeAnimal">
        <b-form-input
          id="nomeAnimal"
          v-model.trim="nome.$model"
          type="text"
          placeholder="Ex: Rex"
          autocomplete="off"
          required
          :state="this.validaCampo(nome)"
          :disabled="this.methodSave === 'update'"
          aria-describedby="nomeFeedback"
        ></b-form-input>
        <b-form-invalid-feedback id="nomeFeedback"
          >Campo obrigatório com mínimo de 2
          caracteres.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group label="Idade" laber-for="idade">
        <b-form-input
          id="idade"
          v-model="idade.$model"
          type="number"
          placeholder="Ex: 1"
          autocomplete="off"
          required
          :state="this.validaCampo(idade)"
          aria-describedby="idadeFeedback"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Espécie" laber-for="especie">
        <b-form-input
          id="especie"
          v-model.trim="especie.$model"
          type="text"
          placeholder="Ex: Pastor alemão"
          autocomplete="off"
          required
          :state="this.validaCampo(especie)"
          aria-describedby="especieFeedback"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Raça" laber-for="raca">
        <b-form-input
          id="raca"
          v-model.trim="raca.$model"
          type="text"
          placeholder="Ex: Pastor alemão"
          autocomplete="off"
          required
          :state="this.validaCampo(raca)"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Sexo" laber-for="sexo">
        <b-form-input
          id="sexo"
          v-model.trim="sexo.$model"
          type="text"
          autocomplete="off"
          required
          :state="this.validaCampo(sexo)"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Observações" laber-for="observacoes">
        <b-form-input
          id="observacoes"
          v-model.trim="observacoes.$model"
          type="text"
          placeholder="Ex: Pastor alemão"
          autocomplete="off"
          required
          :state="this.validaCampo(observacoes)"
          aria-describedby="especieFeedback"
        ></b-form-input>
      </b-form-group>

      <b-button
        :variant="obtemValidador ? 'primary' : 'light'"
        @click="salvarAnimal"
        :disabled="!obtemValidador"
      >
        Salvar
      </b-button>
    </b-form>
  </div>
</template>

<script>
import ToastMixin from "@/mixins/toastMixin.js";
import LocalStorageMixin from "@/mixins/localStorageMixin.js";
import { required, minLength } from "vuelidate/lib/validators";
import axios from "axios";

export default {
  name: "FormAnimal",

  mixins: [ToastMixin, LocalStorageMixin],

  data() {
    return {
      form: {
        nome: "",
        idade: null,
        especie: "",
        raca: "",
        sexo: "",
        observacoes: ""
      },
      methodSave: "new"
    };
  },
  validations: {
    form: {
      nome: {
        required,
        minLength: minLength(2)
      },
      idade: {
        required
      },
      especie: {
        required
      },
      raca: {
        required
      },
      sexo: {
        required
      },
      observacoes: {
        required
      }
    }
  },
  computed: {
    nome() {
      return this.$v.form.nome;
    },
    idade() {
      return this.$v.form.idade;
    },
    especie() {
      return this.$v.form.especie;
    },
    raca() {
      return this.$v.form.raca;
    },
    sexo() {
      return this.$v.form.sexo;
    },
    observacoes() {
      return this.$v.form.observacoes;
    },
    obtemValidador() {
      return (
        this.validaCampo(this.nome) &&
        this.validaCampo(this.idade) &&
        this.validaCampo(this.especie) &&
        this.validaCampo(this.raca) &&
        this.validaCampo(this.sexo) &&
        this.validaCampo(this.observacoes)
      );
    }
  },
  methods: {
    validaCampo(campo) {
      if (this.methodSave === "new" && campo.$dirty === false) {
        return null;
      }
      return !campo.$error;
    },
    async salvarAnimal() {
      this.form.idade = +this.form.idade;
      // TODO: Arrumar todos os placeholders

      // TODO: Remover adotado dps q Ruy remover backend
      this.form.adotado = false;
      let estaAutenticado = this.getLocalStorage("Adopt_at");
      if (estaAutenticado) {
        let headers = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Authorization",
          headers: {
            Authorization: "Bearer " + estaAutenticado
          }
        };

        if (this.methodSave === "update") {
          await axios
            .patch(
              "https://adoptapp.azurewebsites.net/pet/" +
                this.$route.params.index,
              this.form,
              headers
            )
            .then(res => console.log(res))
            .catch(err => console.log(err));

          this.showToast(
            "success",
            "Sucesso!",
            "Animal atualizado com sucesso!"
          );
        } else if (this.methodSave === "new") {
          await axios
            .post(
              "https://adoptapp.azurewebsites.net/pet/register",
              this.form,
              headers
            )
            .then(response => console.log("r", response))
            .catch(error => console.log("e", error));

          this.showToast("success", "Sucesso!", "Animal criado com sucesso!");
        }
      } else {
        this.$router.push({ name: "Login" });
      }

      this.$router.push({ name: "Vitrine" });
    }
  },
  created() {
    // this.setLocalStorage(
    //   "Adopt_at",
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJjYUBlbWFpbC5jb20iLCJleHBpcnkiOjE2NjQ0MDg5NjcuNTE5NDMxOH0.nWa3GWPgtYAiyY7XGbxRE3p1bi9W8WapKYhoFLP8X4E",
    //   60
    // );
    // this.getLocalStorage("Adopt_at");
    // console.log(this.getLocalStorage("Adopt_at"));
    // TODO: Implementar nas telas que precisam de autenticação
    // let estaAutenticado = this.getLocalStorage("Adopt_at");
    // if (estaAutenticado) {
    //   this.$router.push({ name: "Login" });
    // }

    if (this.$route.params.index) {
      this.methodSave = "update";

      // TODO: Funciona, mas precisa ver a logica do back pq ta quebrando, ver com Ruy
      axios
        .get(
          "https://adoptapp.azurewebsites.net/pet/" + this.$route.params.index
        )
        .then(res => (this.form = res.data))
        .catch(err => console.log(err));
    }
  }
};
</script>
