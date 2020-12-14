<template>
  <v-container>
    <div class="text-h6">Share your food storage!</div>

    <v-text-field
      id="txtSharingToken"
      label="Sharing Link"
      append-icon="mdi-content-copy"
      type="text"
      :readonly="true"
      @click:append="copyInClipboard"
      v-model="sharingLink"
    >
    </v-text-field>
    <v-btn class="mr-4 primary" @click="createToken">Get link</v-btn>
    <v-btn class="mr-4 error" @click="deleteToken">Delete link</v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'Share',

  data() {
    return {
      sharingLink: '',
    };
  },

  methods: {
    getToken() {
      this.$store.dispatch('api/sharing/GetSharingToken', {}).then((response) => {
        this.sharingLink = `${document.location.origin}/sharing/${response.result.sharingLinks.token}`;
      });
    },
    deleteToken() {
      this.$store.dispatch('api/sharing/DeleteSharingToken', {}).then(() => {
        this.sharingLink = '';
      });
    },
    createToken() {
      this.$store.dispatch('api/sharing/CreateSharingToken', {}).then((response) => {
        this.sharingLink = `${document.location.origin}/sharing/${response.result.sharingLinks.token}`;
      });
    },
    copyInClipboard() {
      document.getElementById('txtSharingToken').focus();
      document.getElementById('txtSharingToken').select();

      if (document.execCommand('copy')) {
        this.$store.commit('layout/toast/setSnack', { message: 'Copied!', color: 'green' });
      }
    },
  },

  mounted() {
    this.getToken();
  },
};
</script>
