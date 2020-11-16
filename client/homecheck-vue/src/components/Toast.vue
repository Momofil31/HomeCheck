<template>
  <v-snackbar v-model="show" :top="top" :color="color">
    {{message}}
    <template v-slot:action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="show = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      top: true,
      message: '',
      color: '',
      timeout: 5000,
    };
  },
  created() {
    this.$store.watch(
      (state) => state.layout.toast.snack,
      () => {
        const { message } = this.$store.state.layout.toast.snack;
        if (message) {
          this.show = true;
          this.message = message;

          this.color = this.$store.state.layout.toast.snack.color;
          this.$store.commit('layout/toast/setSnack', {});
        }
      },
    );
  },
};
</script>
