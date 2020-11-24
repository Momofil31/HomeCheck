<template>
  <v-navigation-drawer app v-model="drawer" :mini-variant.sync="mini" permanent>
    <v-list-item class="px-4">
      <v-list-item-icon>
        <v-icon>mdi-check</v-icon>
      </v-list-item-icon>

      <v-list-item-title>HomeCheck</v-list-item-title>

      <v-btn icon @click.stop="mini = !mini">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>

    <v-list dense>
      <NavigationItem
        v-for="item in items"
        :key="item.title"
        :action="item.action"
        :icon="item.icon"
        :title="item.title"
      />
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import NavigationItem from '@/components/navigation/NavigationItem.vue';

export default {
  name: 'Navigation',

  components: {
    NavigationItem,
  },

  data: () => ({
    drawer: true,
    items: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', action: '/' },
      { title: 'Products', icon: 'mdi-cart', action: '/products' },
      { title: 'Categories', icon: 'mdi-store', action: '/categories' },
      { title: 'Share', icon: 'mdi-share', action: '/share' },
      { title: 'Logout', icon: 'mdi-exit-to-app', action: '/logout' },
    ],
    mini: true,
  }),
};
</script>
