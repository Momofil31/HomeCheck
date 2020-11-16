import Vue from 'vue';
import Vuex from 'vuex';
import api from './modules/api';
import layout from './modules/layout';

Vue.use(Vuex);

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

export default new Vuex.Store({
  state: {
    isLoggedIn: !!localStorage.getItem('token'),
  },
  mutations: {
    [LOGIN](state) {
      state.isLoggedIn = true;
    },
    [LOGOUT](state) {
      state.isLoggedIn = false;
    },
  },
  actions: {
    login({ commit }, data) {
      return new Promise((resolve) => {
        setTimeout(() => {
          localStorage.setItem('token', data.token);
          commit(LOGIN);
          resolve();
        }, 1000);
      });
    },
    logout({ commit }) {
      localStorage.removeItem('token');
      commit(LOGOUT);
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
  },
  modules: {
    api,
    layout,
  },
});
