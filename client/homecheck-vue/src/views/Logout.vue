<template>
</template>

<script>

  export default {
    name: 'Logout',

    data() {
      return {}
    },

    methods: {
      logout() {
        this.$store.dispatch('logout').then((response) => {
          this.$router.push('/login');
        });
      }
    },
    
    created() {
      this.logout();
    }

  };
</script>