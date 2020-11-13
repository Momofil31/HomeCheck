<template>
  <div id="login">
    <v-card>
      <v-card-text class="pt-4">
        <v-form ref="form"
          v-model="valid">

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
          <v-layout justify-space-between>
            <v-btn @click="login" :class=" { 'blue darken-4 white--text' : valid, disabled: !valid }">Login</v-btn>
          </v-layout>
        </v-form>
      </v-card-text>  
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
        passwordRules: [
          (v) => !!v || 'Password is required',
        ],
        email: '',
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
      }
    },

    methods: {
      login: function(){
        if(this.$refs.form.validate()){
          this.$store.dispatch("api/users/Login", {
            email: this.email,
            password: this.password
          }).then((response) => {

            this.$store.dispatch("login", response.result).then((response) => {
              this.$router.push("/")
            });
          });
        }
      },
      
      changePasswordVisibility: function(){
        this.showPassword = !this.showPassword;
      }
    },

  };
</script>