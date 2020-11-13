<template>
  <v-app>
    <Navigation />

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
    
  export default {
    name: 'App',

    components: {
      Navigation
    },

    data: () => ({
      //
    }),
  };
</script>
