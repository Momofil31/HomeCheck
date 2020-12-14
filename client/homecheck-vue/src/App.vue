<template>
  
  <v-app>
    <div id="loader" v-show="isLoading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <Toast />

    <Navigation v-if="isLoggedIn || isSharing" />

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Navigation from '@/components/navigation/Navigation.vue';
import Toast from '@/components/Toast.vue';

export default {
  name: 'App',

  data: () => ({
    drawer: false,
  }),

  components: {
    Navigation,
    Toast,
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },

    isLoading() {
      return this.$store.getters['layout/isLoading'];
    },
    
    isSharing() {
      return this.$route.params.token;
    },
  },
  
  created() {
    document.title = "HomeCheck"
  }
};
</script>
