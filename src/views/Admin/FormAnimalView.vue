<template>
  <div class="container mt-2">
    <h2>Preencha as informações do animal que será colocado para adoção.</h2>

    <br />
    <br />

    <b-form>
      <b-form-group label="Nome" laber-for="nomeAnimal">
        <b-form-input
          id="nomeAnimal"
          v-model.trim="nome.$model"
          type="text"
          placeholder="Rex"
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
          placeholder="2"
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
          placeholder="Cachorro"
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
          placeholder="Pug"
          autocomplete="off"
          required
          :state="this.validaCampo(raca)"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Sexo" laber-for="sexo">
        <b-form-select
          v-model="sexo.$model"
          :options="optionsSexo"
        ></b-form-select>
      </b-form-group>

      <b-form-group label="Observações" laber-for="observacoes">
        <b-form-input
          id="observacoes"
          v-model.trim="observacoes.$model"
          type="text"
          placeholder="Observações do animal"
          autocomplete="off"
          required
          :state="this.validaCampo(observacoes)"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        v-if="this.methodSave === 'new'"
        label="Foto"
        laber-for="foto"
      >
        <b-form-file
          id="foto"
          accept="image/*"
          v-model="foto.$model"
          placeholder="Adicione uma foto do animal."
          required
          :state="Boolean(form.foto)"
        ></b-form-file>
        <div class="mt-3" v-if="form.foto">
          Selected file: {{ form.foto.name }}
        </div>
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
import AutenticacaoMixin from "@/mixins/autenticacaoMixin.vue";
import { required, minLength } from "vuelidate/lib/validators";
import axios from "axios";

export default {
  name: "FormAnimal",

  mixins: [ToastMixin, AutenticacaoMixin],

  data() {
    return {
      form: {
        nome: "",
        idade: null,
        especie: "",
        raca: "",
        sexo: null,
        observacoes: "",
        foto: null
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
      },
      foto: {
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
    foto() {
      return this.$v.form.foto;
    },
    obtemValidador() {
      return (
        this.validaCampo(this.nome) &&
        this.validaCampo(this.idade) &&
        this.validaCampo(this.especie) &&
        this.validaCampo(this.raca) &&
        this.validaCampo(this.sexo) &&
        this.validaCampo(this.observacoes) &&
        this.validaCampo(this.foto)
      );
    },
    optionsSexo() {
      let options = [];

      if (!this.form.sexo) {
        options.push({ value: null, text: "Selecione o sexo do animal" });
      }
      options.push({ value: "Macho", text: "Macho" });
      options.push({ value: "Fêmea", text: "Fêmea" });

      return options;
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

      if (this.obtemToken()) {
        let headers = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Authorization",
          headers: {
            Authorization: "Bearer " + this.obtemToken()
          }
        };

        if (this.methodSave === "update") {
          try {
            await axios.patch(
              "https://adoptapp.azurewebsites.net/pet/" +
                this.$route.params.index,
              this.form,
              headers
            );

            this.showToast(
              "success",
              "Sucesso!",
              "Animal atualizado com sucesso!"
            );
            this.$router.push({ name: "Vitrine" });
          } catch (err) {
            this.showToast("danger", "Erro!", err.response.data.detail.message);
          }
        } else if (this.methodSave === "new") {
          const formData = new FormData();
          formData.append("nome", this.form.nome);
          formData.append("idade", this.form.idade);
          formData.append("especie", this.form.especie);
          formData.append("raca", this.form.raca);
          formData.append("sexo", this.form.sexo);
          formData.append("observacoes", this.form.observacoes);
          formData.append("foto", this.form.foto);

          try {
            await axios.post(
              "https://adoptapp.azurewebsites.net/pet/register",
              formData,
              headers
            );
            this.showToast("success", "Sucesso!", "Animal criado com sucesso!");
            this.$router.push({ name: "Vitrine" });
          } catch (err) {
            this.showToast("danger", "Erro!", err.response.data.detail.message);
          }
        }
      } else {
        this.showToast(
          "danger",
          "Error!",
          "Você não está autenticado, faça login novamente!"
        );
        this.$router.push({ name: "Login" });
      }
    }
  },
  async created() {
    if (this.$route.params.index) {
      this.methodSave = "update";

      // TODO: Validação de File apenas com imagem
      // TODO: Remover campo de Foto no update
      try {
        let animal = await axios.get(
          "https://adoptapp.azurewebsites.net/pet/" + this.$route.params.index
        );
        this.form = animal.data.content;
        console.log(animal.data.content);
      } catch (err) {
        this.showToast("danger", "Erro!", err.response.data.detail.message);
        this.$router.push({ name: "Vitrine" });
      }
    }
  }
};
</script>
