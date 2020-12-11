import util from '../util';

export default {
  namespaced: true,
  actions: {
    Login(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/post', {
          endpoint: 'v2/users/login',
          data: filters,
        })
          .then((data) => util.dispatchSuccess(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },
    Register(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/post', {
          endpoint: 'v2/users/register',
          data: filters,
        })
          .then((data) => util.dispatchSuccessWithMessage(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },
    ConfirmAccount(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/get', {
          endpoint: `v2/users/confirm/${filters.token}`,
          data: [],
        })
          .then((data) => util.dispatchSuccessWithMessage(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
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
          .then((data) => util.dispatchSuccessWithMessage(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },
    UpdatePassword(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/put', {
          endpoint: 'v2/users/password',
          data: filters,
        })
          .then((data) => util.dispatchSuccessWithMessage(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },
  },
  mutations: {},
};
