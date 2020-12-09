export default {
  namespaced: true,
  actions: {
    GetList(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/get', {
          endpoint: 'v2/categories',
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
    },

    GetOne(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/get', {
          endpoint: `v2/categories/${filters.id}`,
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
    },

    DeleteOne(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/delete', {
          endpoint: `v2/categories/${filters.id}`,
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
              const message = data.data.message !== undefined ? data.data.message : '';
              if (message !== '') {
                Instance.commit('layout/toast/setSnack', { message, color: 'green' });
              }
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
    },

    UpdateOne(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/put', {
          endpoint: `v2/categories/${filters.id}`,
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
              const message = data.data.message !== undefined ? data.data.message : '';
              if (message !== '') {
                Instance.commit('layout/toast/setSnack', { message, color: 'green' });
              }
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
    },

    CreateOne(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/post', {
          endpoint: 'v2/categories/',
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
              const message = data.data.message !== undefined ? data.data.message : '';
              if (message !== '') {
                Instance.commit('layout/toast/setSnack', { message, color: 'green' });
              }
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
    },
  },
  mutations: {},
};
