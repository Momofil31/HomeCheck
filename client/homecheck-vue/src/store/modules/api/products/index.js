import util from '../util';

export default {
  namespaced: true,
  actions: {
    GetList(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/get', {
          endpoint: 'v2/products',
          data: filters,
        })
          .then((data) => util.dispatchSuccess(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },

    GetOne(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/get', {
          endpoint: `v2/products/${filters.id}`,
          data: filters,
        })
          .then((data) => util.dispatchSuccess(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },

    DeleteOne(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/delete', {
          endpoint: `v2/products/${filters.id}`,
          data: filters,
        })
          .then((data) => util.dispatchSuccessWithMessage(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },

    UpdateOne(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/put', {
          endpoint: `v2/products/${filters.id}`,
          data: filters.product,
        })
          .then((data) => util.dispatchSuccessWithMessage(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },

    CreateOne(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/post', {
          endpoint: 'v2/products/',
          data: filters,
        })
          .then((data) => util.dispatchSuccessWithMessage(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },
  },
  mutations: {},
};
