<template>
  <div id="landing">
    <div class="intro"
        :style="{ backgroundImage: `url(${backgroundUrl})` }">
      <h1>HomeCheck</h1>
      <div class="description">
        <p>Manage better with HomeCheck</p>
        <v-btn @click="sendToLogin" class="black darken-4 white--text start-btn">Start Now</v-btn>
        <v-img :src="laptopUrl" class="laptop-img"></v-img>
      </div>
    </div>
    <div class="functions">
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="4">
            <div class="function">
              <v-icon class="icon" large>mdi-view-dashboard</v-icon>
              <br>
              <span class="title">Organize your products</span>
              <p class="description">
                With HomeCheck you can organize your products as would you normally in your house. Divide your items in 3 major groups: Fridge, Freezer and Pantry.
              </p>
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="function">
              <v-icon class="icon" large>mdi-wrench</v-icon>
              <br>
              <span class="title">Customize</span>
              <p class="description">
                With HomeCheck you can customize your product with your categories.
              </p>
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="function">
              <v-icon class="icon" large>mdi-account-group</v-icon>
              <br>
              <span class="title">Share your products</span>
              <p class="description">
                With HomeCheck you can share your organition with your roommates, even if they have not an account.
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
  
import backgroundUrl from "@/assets/background.svg";
import laptopUrl from "@/assets/laptop.png";
  
export default {
  name: 'Landing',
  

  data() {
    return {
      backgroundUrl,
      laptopUrl,
    };
  },

  methods: {
     sendToLogin() {
      if (this.$route.path !== '/login') this.$router.push('/login');
    },
  },
};
</script>
