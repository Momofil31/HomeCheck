<template>
</template>

<script>

export default {
  name: 'ConfirmAccount',

  data() {
    return {};
  },

  methods: {
    confirmAccount() {
      var token = this.$route.query.token ? this.$route.query.token : '';
      this.$store.dispatch('api/users/ConfirmAccount', {token: token}).then((response) => {
        this.$router.push('/login');
      })
      .catch((response) => {
        this.$router.push('/login');
      });
    },
  },

  created() {
    this.confirmAccount();
  },

};
</script>
