<script>
import LocalStorageMixin from "@/mixins/localStorageMixin.js";

export default {
  mixins: [LocalStorageMixin],
  data() {
    return {
      token: ""
    };
  },
  methods: {
    obtemToken() {
      return this.getLocalStorage("Adopt_at");
    },
    defineToken(token, minutos) {
      this.setLocalStorage("Adopt_at", token, minutos);
      return this.obtemToken();
    }
  }
};
</script>
