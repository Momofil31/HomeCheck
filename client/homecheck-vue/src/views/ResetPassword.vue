<template>
  <div id="login">
    <v-card>
      <v-card-title>
        <h3>Forgot password</h3>
      </v-card-title>
      <v-card-text class="pt-4">
        <v-form ref="form" v-model="valid">
          <v-text-field
            label="Enter your e-mail address"
            v-model="email"
            :rules="emailRules"
            prepend-inner-icon="mdi-email"
            required
            autofocus
          ></v-text-field>
          <v-layout justify-space-between>
            <v-spacer></v-spacer>
            <v-btn
              @click="resetPassword"
              :class="{ 'blue darken-4 white--text': valid, disabled: !valid }"
              >Send me a new password</v-btn
            >
          </v-layout>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <div>
          <span>Don't have an account? </span>
          <v-btn @click="sendToRegister" class="blue darken-4 white--text" x-small>Register</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ResetPassword',
  data() {
    return {
      valid: false,
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
      ],
    };
  },
  methods: {
    resetPassword() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch('api/users/ResetPassword', {
            email: this.email,
          })
          .then((response) => {
            this.$router.push('/login');
          });
      }
    },

    sendToRegister() {
      if (this.$route.path !== '/register') this.$router.push('/register');
    },
  },
};
</script>

<style></style>
