<template
  ><div :class="{'sidebar-open': !mini}">
    <v-app-bar app color="primary" dark>
      <v-spacer></v-spacer>
      <v-btn @click="logoutClicked" v-if="isLoggedIn">
        <v-icon>logout</v-icon>
        Logout
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      app
      v-model="sidebarMenu"
      :mini-variant.sync="mini"
      :permanent="sidebarMenu"
    >
      <v-list color="primary" dark elevation="4">
        <v-list-item color>
          <v-list-item-icon @click="toggleMini = !toggleMini">
            <v-icon>mdi-check</v-icon>
          </v-list-item-icon>

          <v-list-item-title><h3>HomeCheck</h3></v-list-item-title>

          <v-btn icon @click="toggleMini = !toggleMini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>

      <v-list dense v-if="!isSharing || isLoggedIn">
        <NavigationItem
          v-for="item in items"
          :key="item.title"
          :action="item.action"
          :icon="item.icon"
          :title="item.title"
        />
      </v-list>
      <template v-else>
        <NavigationItem
          icon="mdi-cart"
          title="Products">
        </NavigationItem>
        <NavigationItem
          action="/login"
          icon="mdi-login"
          title="Login">
        </NavigationItem>
      </template>
      
    </v-navigation-drawer>
  </div>
</template>
<script>
import NavigationItem from '@/components/navigation/NavigationItem.vue';

export default {
  name: 'Navigation',

  components: {
    NavigationItem,
  },

  data: () => ({
    sidebarMenu: true,
    toggleMini: false,
    items: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', action: '/dashboard' },
      { title: 'Products', icon: 'mdi-cart', action: '/products' },
      { title: 'Categories', icon: 'mdi-store', action: '/categories' },
      { title: 'Share', icon: 'mdi-share', action: '/share' },
      { title: 'Settings', icon: 'settings', action: '/settings' },
    ],
  }),
  computed: {
    mini() {
      return this.$vuetify.breakpoint.smAndDown || this.toggleMini;
    },
    
    isSharing() {
      return this.$route.params.token;
    },
    
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  methods: {
    logoutClicked() {
      if (this.$route.path !== '/logout') this.$router.push('/logout');
    },
  },
};
</script>
