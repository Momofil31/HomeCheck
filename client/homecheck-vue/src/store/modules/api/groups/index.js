import util from '../util';

export default {
  namespaced: true,
  actions: {
    GetList(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      const Instance = this;
      return new Promise((resolve, reject) => {
        Instance.dispatch('api/get', {
          endpoint: 'v2/groups',
          data: filters,
        })
          .then((data) => util.dispatchSuccess(data, Instance, resolve))
          .catch((data) => util.dispatchError(data, Instance));
      });
    },
  },
  mutations: {},
};
