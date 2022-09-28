<template>
  <div class="container mt-2">
    <h1>Vitrine</h1>
    <b-button variant="primary" class="mb-5" @click="cadastrarAnimal"
      >Cadastrar Animal</b-button
    >
    <div
      v-for="animal in animais"
      :key="animal.id"
      class="d-flex justify-content-center"
    >
      <b-card class="w-50 mb-2" :title="animal.nome">
        <b-card-text>Espécie: {{ animal.especie }}</b-card-text>
        <b-card-text>Sexo: {{ animal.sexo }}</b-card-text>
        <b-card-text>Idade: {{ animal.idade }}</b-card-text>
        <b-card-text>Raça: {{ animal.raca }}</b-card-text>
        <b-card-text>Observações: {{ animal.observacoes }}</b-card-text>

        <b-button variant="outline-primary" class="mr-2">Ver</b-button>
        <b-button
          variant="outline-primary"
          class="mr-2"
          @click="editar(animal.id)"
          >Editar
        </b-button>
        <b-button
          variant="outline-primary"
          class="mr-2"
          @click="deletar(animal, animal.id)"
          >Excluir
        </b-button>
        <b-button variant="success">Adotar</b-button>
      </b-card>
    </div>

    <b-modal ref="modalDeletar" hide-footer title="Deletar animal">
      <div class="d-block text-center">
        Deseja realmente excluir esse animal? {{ animalSelecionado.name }}
      </div>
      <div class="mt-3 d-flex justify-content-end">
        <b-button
          variant="outline-secondary"
          class="mr-2"
          @click="esconderModal"
        >
          Cancelar
        </b-button>
        <b-button variant="outline-danger" class="mr-2" @click="confirmaDelecao"
          >Confirmar</b-button
        >
      </div>
    </b-modal>
  </div>
</template>
<script>
import LocalStorageMixin from "@/mixins/localStorageMixin.js";
import ToastMixin from "@/mixins/toastMixin.js";
import axios from "axios";

export default {
  name: "Vitrine",

  mixins: [LocalStorageMixin, ToastMixin],

  data() {
    return {
      animais: [],
      animalSelecionado: [],
      estaAutenticado: this.getLocalStorage("Adopt_at")
    };
  },
  async created() {
    localStorage.setItem("testeCaio", "lala");

    try {
      let response = await axios.get("https://adoptapp.azurewebsites.net/pets");
      this.animais = response.data;
    } catch (err) {
      this.showToast("danger", "Erro!", err.message);
    }
  },
  methods: {
    cadastrarAnimal() {
      this.$router.push({ name: "FormAnimal" });
    },
    editar(index) {
      this.$router.push({ name: "FormAnimal", params: { index } });
    },
    deletar(animal, index) {
      this.animalSelecionado = animal;
      this.$refs.modalDeletar.show();
    },
    esconderModal() {
      this.$refs.modalDeletar.hide();
    },
    async confirmaDelecao() {
      let estaAutenticado = this.getLocalStorage("Adopt_at");

      if (estaAutenticado) {
        let headers = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Authorization",
          headers: {
            Authorization: "Bearer " + estaAutenticado
          }
        };
        await axios
          .delete(
            "https://adoptapp.azurewebsites.net/pet/" +
              this.animalSelecionado.id,
            headers
          )
          .then(res => console.log(res))
          .catch(err => console.log(err));

        await axios
          .get("https://adoptapp.azurewebsites.net/pets")
          .then(res => (this.animais = res.data))
          .catch(err => console.log(err));
        console.log(this.animais);
      }

      this.esconderModal();
    }
  }
};
</script>
