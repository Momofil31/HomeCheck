<template>
  <v-app>
    
    <div id="loader" v-show="isLoading">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
    
    <Toast />
    <Navigation v-if="isLoggedIn"/>

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

  import Navigation from "@/components/navigation/Navigation.vue";
  import Toast from "@/components/Toast.vue";
    
  export default {
    name: 'App',

    components: {
      Navigation,
      Toast
    },

    computed: {
      isLoggedIn() {
        return this.$store.getters.isLoggedIn;
      },
      
      isLoading() {
        return this.$store.getters['layout/isLoading'];
      }
    }
  };
</script>
