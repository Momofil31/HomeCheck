import util from '../util';

export default {
  namespaced: true,
  actions: {
    GetSharingToken(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve) => {
        Instance.dispatch('api/get', {
          endpoint: 'v2/sharing-links/token',
          data: filters,
        })
          .then((data) => util.dispatchSuccess(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },

    DeleteSharingToken(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve) => {
        Instance.dispatch('api/delete', {
          endpoint: 'v2/sharing-links/token',
          data: filters,
        })
          .then((data) => util.dispatchSuccessWithMessage(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },

    CreateSharingToken(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve) => {
        Instance.dispatch('api/post', {
          endpoint: 'v2/sharing-links/token',
          data: filters,
        })
          .then((data) => util.dispatchSuccessWithMessage(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },

    GetGroups(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve) => {
        Instance.dispatch('api/get', {
          endpoint: `v2/sharing-links/${filters.token}/groups`,
          data: filters,
        })
          .then((data) => util.dispatchSuccess(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },

    GetProducts(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve) => {
        Instance.dispatch('api/get', {
          endpoint: `v2/sharing-links/${filters.token}/products`,
          data: filters,
        })
          .then((data) => util.dispatchSuccess(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },

    GetProduct(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve) => {
        Instance.dispatch('api/get', {
          endpoint: `v2/sharing-links/${filters.token}/products/${filters.productId}`,
          data: [],
        })
          .then((data) => util.dispatchSuccess(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },
  },
  mutations: {},
};
