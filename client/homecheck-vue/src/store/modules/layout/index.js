import toast from './Toasts';

export default {
  namespaced: true,
  modules: {
    toast,
  },
  state: {
    loadingContent: false,
  },
  mutations: {
    UpdateLoadingStatus(state, loading) {
      loading = !!loading;
      state.loadingContent = loading;
    },
  },

  getters: {
    isLoading(state) {
      return state.loadingContent;
    },
  },
};
