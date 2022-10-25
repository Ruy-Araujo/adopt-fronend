<template>
  <div class="container mt-2">
    <h1>Vitrine de Animais</h1>
    <div class="subtitulo">
      <h6>
        Aqui temos uma vitrine de animais de espécies e raça diferentes para
        você poder dar um lar aconchegante a eles. Basta clicar em "Adotar",
        preencher o formulário e entraremos em contato com você caso seja
        aprovado!
      </h6>
    </div>

    <b-button
      v-if="this.estaAutenticado"
      variant="primary"
      class="mb-5"
      @click="cadastrarAnimal"
      >Cadastrar Animal</b-button
    >
    <div v-if="this.animais.length">
      <div
        v-for="animal in animais"
        :key="animal.id"
        class="d-flex justify-content-center"
      >
        <b-card
          class="w-50 mb-2"
          :title="animal.nome"
          :img-src="animal.foto_url"
        >
          <b-card-text>Espécie: {{ animal.especie }}</b-card-text>
          <b-card-text>Sexo: {{ animal.sexo }}</b-card-text>
          <b-card-text>Idade: {{ animal.idade }}</b-card-text>
          <b-card-text>Raça: {{ animal.raca }}</b-card-text>
          <b-card-text>Observações: {{ animal.observacoes }}</b-card-text>

          <b-button
            v-if="estaAutenticado"
            variant="outline-primary"
            class="mr-2"
            @click="editar(animal.id)"
            >Editar
          </b-button>
          <b-button
            v-if="estaAutenticado"
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
          <b-button
            variant="outline-danger"
            class="mr-2"
            @click="confirmaDelecao"
            >Confirmar</b-button
          >
        </div>
      </b-modal>
    </div>

    <div v-else>
      <br /><br />
      <h2>Ainda não temos animais disponíveis para adoção.</h2>
      <br />
      <h2>Aguarde...</h2>
    </div>
  </div>
</template>
<script>
import ToastMixin from "@/mixins/toastMixin.js";
import AutenticacaoMixin from "@/mixins/autenticacaoMixin.vue";
import axios from "axios";

export default {
  name: "Vitrine",

  mixins: [ToastMixin, AutenticacaoMixin],

  data() {
    return {
      animais: [],
      animalSelecionado: [],
      estaAutenticado: ""
    };
  },
  async created() {
    this.estaAutenticado = this.obtemToken();
    try {
      let response = await axios.get("https://adoptapp.azurewebsites.net/pets");
      this.animais = response.data.content;
    } catch (err) {
      this.showToast("danger", "Erro!", err.response.data.detail.message);
    }
  },
  methods: {
    cadastrarAnimal() {
      this.$router.push({ name: "FormAnimal" });
    },
    editar(index) {
      this.estaAutenticado = this.obtemToken();
      if (this.estaAutenticado) {
        this.$router.push({ name: "FormAnimal", params: { index } });
      } else {
        this.showToast(
          "danger",
          "Error!",
          "Você não está autenticado, faça login novamente!"
        );
        this.$router.push({ name: "Login" });
      }
    },
    deletar(animal, index) {
      this.animalSelecionado = animal;
      this.$refs.modalDeletar.show();
    },
    esconderModal() {
      this.$refs.modalDeletar.hide();
    },
    async confirmaDelecao() {
      this.estaAutenticado = this.obtemToken();

      if (this.estaAutenticado) {
        let headers = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Authorization",
          headers: {
            Authorization: "Bearer " + this.estaAutenticado
          }
        };
        try {
          await axios.delete(
            "https://adoptapp.azurewebsites.net/pet/" +
              this.animalSelecionado.id,
            headers
          );
          this.showToast("success", "Sucesso!", "Animal deletado com sucesso!");

          let response = await axios.get(
            "https://adoptapp.azurewebsites.net/pets"
          );
          this.animais = response.data.content;
        } catch (err) {
          this.showToast("danger", "Erro!", err.response.data.detail.message);
        }
      } else {
        this.showToast(
          "danger",
          "Error!",
          "Você não está autenticado, faça login novamente!"
        );
        this.$router.push({ name: "Login" });
      }

      this.esconderModal();
    }
  }
};
</script>
<style>
.subtitulo {
  display: flex;
  align-content: center;
  justify-content: center;
  margin-bottom: 20px;
}

.subtitulo > h6 {
  max-width: 50%;
}
</style>
