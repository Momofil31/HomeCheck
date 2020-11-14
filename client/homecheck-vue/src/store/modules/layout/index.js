import toast from './Toasts'

export default {
  namespaced: true,
  modules: {
    toast
  },
  state: {
    loadingContent: false,
  },
  mutations: {
    UpdateLoadingStatus: function(state, loading) {
      loading = loading ? true : false;
      state.loadingContent = loading;
    }
  },
  
  getters: {
    isLoading: function(state){
      return state.loadingContent
    }
  }
}