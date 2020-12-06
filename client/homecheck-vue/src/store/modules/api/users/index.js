export default {
  namespaced: true,
  actions: {
    Login(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/post', {
          endpoint: 'v1/users/login',
          data: filters,
        })
          .then((data) => {
            if (data.error) {
              Instance.commit('layout/UpdateLoadingStatus', false);
              const message =
                data.error.message !== undefined ? data.error.message : 'Generic Error';
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
    Register(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/post', {
          endpoint: 'v1/users/register',
          data: filters,
        })
          .then((data) => {
            if (data.error) {
              Instance.commit('layout/UpdateLoadingStatus', false);
              const message =
                data.error.message !== undefined ? data.error.message : 'Generic Error';
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
    ResetPassword(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/post', {
          endpoint: 'v2/users/passwordReset',
          data: filters,
        })
          .then((data) => {
            if (data.error) {
              Instance.commit('layout/UpdateLoadingStatus', false);
              const message =
                data.error.message !== undefined ? data.error.message : 'Generic Error';
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
