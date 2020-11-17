export default {
  namespaced: true,
  actions: {
    GetList(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/get', {
          endpoint: 'v1/groups',
          data: filters,
        })
          .then((data) => {
            if (data.error) {
              Instance.commit('layout/UpdateLoadingStatus', false);
              const message = data.error.message !== undefined ? data.error.message : 'Generic Error';
              Instance.commit('layout/toast/setSnack', { message, color: 'red' });
              // reject(message)
            } else {
              Instance.commit('layout/UpdateLoadingStatus', false);
              resolve({
                result: data.data,
              });
            }
          })
          .catch((data) => {
            Instance.commit('layout/UpdateLoadingStatus', false);
            const message = data.error ? data.error.message : 'Generic Error';
            Instance.commit('layout/toast/setSnack', { message, color: 'red' });
            // reject(message)
          });
      });
    }
  },
  mutations: {},
};
