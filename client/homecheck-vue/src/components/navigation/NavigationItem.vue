<template>
  <v-list-item @click="itemClicked">
    <v-list-item-icon>
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title>{{ title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>

export default {
  name: 'NavigationItem',

  components: {

  },

  props: {
    action: '',
    icon: '',
    title: '',
  },

  methods: {
    itemClicked() {
      if (this.$route.path !== this.action) this.$router.push(this.action);
    },
  },
};
</script>
