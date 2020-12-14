<template>
  <v-form ref="form" v-model="valid" id="password-form">
    <v-container>
      <div class="text-h6">Change Password</div>
      <v-row >
        <v-col cols="12">
          <v-text-field
            label="Current password*"
            v-model="currentPassword"
            min="8"
            :append-icon="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="changePasswordVisibility"
            :type="showPassword ? 'text' : 'password'"
            :rules="passwordRules"
            counter
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            label="New Password"
            v-model="newPassword"
            min="8"
            :append-icon="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="changePasswordVisibility"
            :type="showPassword ? 'text' : 'password'"
            :rules="passwordRules"
            counter
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            label="Confirm New Password"
            v-model="confirmPassword"
            min="8"
            :append-icon="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="changePasswordVisibility"
            :type="showPassword ? 'text' : 'password'"
            :rules="passwordRules"
            counter
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <small>* indicates required field</small>
      <v-layout justify-space-between>
        <v-spacer></v-spacer>
        <v-btn
          @click="updatePassword"
          :class="{ 'blue darken-4 white--text': valid, disabled: !valid }"
          >Update Password</v-btn
        >
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: 'ChangePasswordForm',
  data() {
    return {
      valid: false,
      showPassword: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      passwordRules: [(v) => !!v || 'Password is required'],
    };
  },

  // TODO: fixare la redirect quando avremo fatto l'area impostazioni
  methods: {
    updatePassword() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch('api/users/UpdatePassword', {
            oldPassword: this.currentPassword,
            newPassword: this.newPassword,
            confirmPassword: this.confirmPassword,
          })
          .then((response) => {
            if (this.$route.path !== '/settings') this.$router.push('/settings');
          });
      }
    },
    changePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style></style>
