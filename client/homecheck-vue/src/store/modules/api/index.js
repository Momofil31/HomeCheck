import users from './users';
import categories from './categories';

import axios from 'axios'

export default {
  namespaced: true,
  modules: {
    users,
    categories
  },
  actions: {
    get: function(context, request) {
      let Instance = this;
      return new Promise(function(resolve, reject) {
        try {
          var config = {};
          if(Instance.getters.isLoggedIn){
            var token = localStorage.getItem("token");
            config = {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Headers': true
              }
            };
          }
          
          axios.get(window.$apiBaseUrl + request.endpoint, config)
            .then(function(response){
            resolve(response.data)
          }).catch(function(error){
            if(error.response)
              reject(error.response.data)
            reject({})
          });
        } catch (exception) {
          console.log(exception)
          reject('error in api get function');
        }
      }) 
    },
    post: function(context, request) {
      let Instance = this;
      return new Promise(function(resolve, reject) {
        try {
          
          var config = {};
          if(Instance.getters.isLoggedIn){
            var token = localStorage.getItem("token");
            config = {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Headers': true
              }
            };
          }
          
          axios.post(window.$apiBaseUrl + request.endpoint, request.data, config)
            .then(function(response){
            resolve(response.data)
          }).catch(function(error){
            if(error.response)
              reject(error.response.data)
            reject({})
          });
        } catch (exception) {
          reject('error in api post function');
        }
      }) 
    },
    put: function(context, request) {
      let Instance = this;
      return new Promise(function(resolve, reject) {
        try {
          
          var config = {};
          if(Instance.getters.isLoggedIn){
            var token = localStorage.getItem("token");
            config = {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Headers': true
              }
            };
          }
          
          axios.put(window.$apiBaseUrl + request.endpoint, request.data, config)
            .then(function(response){
            resolve(response.data)
          }).catch(function(error){
            if(error.response)
              reject(error.response.data)
            reject({})
          });
        } catch (exception) {
          reject('error in api post function');
        }
      }) 
    },
    delete: function(context, request) {
      let Instance = this;
      return new Promise(function(resolve, reject) {
        try {
          
          var config = {};
          if(Instance.getters.isLoggedIn){
            var token = localStorage.getItem("token");
            config = {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Headers': true
              }
            };
          }
          
          axios.delete(window.$apiBaseUrl + request.endpoint, config)
            .then(function(response){
            resolve(response.data)
          }).catch(function(error){
            if(error.response)
              reject(error.response.data)
            reject({})
          });
        } catch (exception) {
          reject('error in api delete function');
        }
      }) 
    },
  }
}