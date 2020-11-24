<template>
  <div id="register">
    <v-card>
      <v-card-title>
        <h3>Register</h3>
      </v-card-title>
      <v-card-text class="pt-4">
        <v-form ref="form" v-model="valid">
          <v-text-field
            label="Enter your first name"
            v-model="firstname"
            :rules="firstnameRules"
            prepend-inner-icon="mdi-account"
            required
            autofocus
          ></v-text-field>
          <v-text-field
            label="Enter your last name"
            v-model="lastname"
            :rules="lastnameRules"
            prepend-inner-icon="mdi-account"
            required
          ></v-text-field>
          <v-text-field
            label="Enter your e-mail address"
            v-model="email"
            :rules="emailRules"
            prepend-inner-icon="mdi-email"
            required
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
          <v-text-field
            label="Confirm your password"
            v-model="passwordConfirm"
            min="8"
            prepend-inner-icon="mdi-lock"
            :append-icon="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="changePasswordVisibility"
            :type="showPassword ? 'text' : 'password'"
            :rules="passwordConfirmRules"
            counter
            required
          ></v-text-field>
          <v-layout justify-space-between>
            <v-spacer></v-spacer>
            <v-btn
              @click="register"
              :class="{ 'blue darken-4 white--text': valid, disabled: !valid }"
              >Register</v-btn
            >
          </v-layout>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <div>
          <span>Already have an account? </span>
          <v-btn @click="sendToLogin" class="blue darken-4 white--text" x-small>Login</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Register',

  data() {
    return {
      valid: false,
      showPassword: false,
      firstname: '',
      firstnameRules: [
        (v) => !!v || 'First name is required',
        (v) => /^[a-zA-Z ]*$/.test(v) || 'First name must be valid',
      ],
      lastname: '',
      lastnameRules: [
        (v) => !!v || 'Last name is required',
        (v) => /^[a-zA-Z ]*$/.test(v) || 'Last name must be valid',
      ],
      password: '',
      passwordRules: [(v) => !!v || 'Password is required'],
      passwordConfirm: '',
      passwordConfirmRules: [
        (v) => !!v || 'Password is required',
        (v) => v === this.password || "Passwords don't match",
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
      ],
    };
  },

  methods: {
    register() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch('api/users/Register', {
            email: this.email,
            password: this.password,
            firstname: this.firstname,
            lastname: this.lastname,
          })
          .then((response) => {
            this.$router.push('/login');
          });
      }
    },

    changePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    sendToLogin() {
      if (this.$route.path !== '/login') this.$router.push('/login');
    },
  },
};
</script>
