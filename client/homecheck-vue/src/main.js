import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import './styles/all.less';

Vue.config.productionTip = false;

window.$apiBaseUrl = 'https://homecheck-api.herokuapp.com/';

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
