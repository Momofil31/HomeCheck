import axios from 'axios';
import users from './users';
import categories from './categories';
import products from './products';
import groups from './groups';
import sharing from './sharing';

export default {
  namespaced: true,
  modules: {
    users,
    categories,
    products,
    groups,
    sharing,
  },
  actions: {
    get(context, request) {
      const Instance = this;
      return new Promise((resolve, reject) => {
        try {
          let config = {};
          if (Instance.getters.isLoggedIn) {
            const token = localStorage.getItem('token');
            config = {
              headers: {
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Headers': true,
              },
            };
          }

          config.params = request.data;

          axios
            .get(window.$apiBaseUrl + request.endpoint, config)
            .then((response) => {
              resolve(response.data);
            })
            .catch((error) => {
              if (error.response) reject(error.response.data);
              reject({});
            });
        } catch (exception) {
          console.log(exception);
          reject('error in api get function');
        }
      });
    },
    post(context, request) {
      const Instance = this;
      return new Promise((resolve, reject) => {
        try {
          let config = {};
          if (Instance.getters.isLoggedIn) {
            const token = localStorage.getItem('token');
            config = {
              headers: {
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Headers': true,
              },
            };
          }

          axios
            .post(window.$apiBaseUrl + request.endpoint, request.data, config)
            .then((response) => {
              resolve(response.data);
            })
            .catch((error) => {
              if (error.response) reject(error.response.data);
              reject({});
            });
        } catch (exception) {
          reject('error in api post function');
        }
      });
    },
    put(context, request) {
      const Instance = this;
      return new Promise((resolve, reject) => {
        try {
          let config = {};
          if (Instance.getters.isLoggedIn) {
            const token = localStorage.getItem('token');
            config = {
              headers: {
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Headers': true,
              },
            };
          }

          axios
            .put(window.$apiBaseUrl + request.endpoint, request.data, config)
            .then((response) => {
              resolve(response.data);
            })
            .catch((error) => {
              if (error.response) reject(error.response.data);
              reject({});
            });
        } catch (exception) {
          reject('error in api put function');
        }
      });
    },

    patch(context, request) {
      const Instance = this;
      return new Promise((resolve, reject) => {
        try {
          let config = {};
          if (Instance.getters.isLoggedIn) {
            const token = localStorage.getItem('token');
            config = {
              headers: {
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Headers': true,
              },
            };
          }

          axios
            .patch(window.$apiBaseUrl + request.endpoint, request.data, config)
            .then((response) => {
              resolve(response.data);
            })
            .catch((error) => {
              if (error.response) reject(error.response.data);
              reject({});
            });
        } catch (exception) {
          reject('error in api patch function');
        }
      });
    },
    delete(context, request) {
      const Instance = this;
      return new Promise((resolve, reject) => {
        try {
          let config = {};
          if (Instance.getters.isLoggedIn) {
            const token = localStorage.getItem('token');
            config = {
              headers: {
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Headers': true,
              },
            };
          }

          axios
            .delete(window.$apiBaseUrl + request.endpoint, config)
            .then((response) => {
              resolve(response.data);
            })
            .catch((error) => {
              if (error.response) reject(error.response.data);
              reject({});
            });
        } catch (exception) {
          reject('error in api delete function');
        }
      });
    },
  },
};
