<template>
  <div id="login">
    <v-card>
      <v-card-title>
        <h3>Login</h3>
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
          <v-text-field
            label="Enter your password"
            v-model="password"
            min="8"
            prepend-inner-icon="mdi-lock"
            :append-icon="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="changePasswordVisibility"
            :type="showPassword ? 'text' : 'password'"
            :rules="passwordRules"
            counter
            required
          ></v-text-field>
          <v-layout justify-space-between>
            <v-spacer></v-spacer>
            <v-btn @click="login" :class="{ 'blue darken-4 white--text': valid, disabled: !valid }"
              >Login</v-btn
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
  name: 'Login',

  data() {
    return {
      valid: false,
      showPassword: false,
      password: '',
      passwordRules: [(v) => !!v || 'Password is required'],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
      ],
    };
  },

  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch('api/users/Login', {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            this.$store.dispatch('login', response.result).then((response) => {
              this.$router.push('/');
            });
          });
      }
    },

    changePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    sendToRegister() {
      if (this.$route.path !== '/register') this.$router.push('/register');
    },
  },
};
</script>
