import users from './users';

import axios from 'axios'

export default {
  namespaced: true,
  modules: {
    users
  },
  actions: {
    get: function(context, request) {
      return new Promise(function(resolve, reject) {
        try {
          axios.get(window.$apiBaseUrl + request.endpoint, request.data)
            .then(function(response){
            resolve(response.data)
          }).catch(function(response){
            reject(response.data)
          });
        } catch (exception) {
          reject('error in api get function');
        }
      }) 
    },
    post: function(context, request) {
      return new Promise(function(resolve, reject) {
        try {
          axios.post(window.$apiBaseUrl + request.endpoint, request.data)
            .then(function(response){
            resolve(response.data)
          }).catch(function(response){
            reject(response.data)
          });
        } catch (exception) {
          reject('error in api post function');
        }
      }) 
    },
    put: function(context, request) {
      return new Promise(function(resolve, reject) {
        try {
          axios.put(window.$apiBaseUrl + request.endpoint, request.data)
            .then(function(response){
            resolve(response.data)
          }).catch(function(response){
            reject(response.data)
          });
        } catch (exception) {
          reject('error in api post function');
        }
      }) 
    },
    delete: function(context, request) {
      return new Promise(function(resolve, reject) {
        try {
          axios.delete(window.$apiBaseUrl + request.endpoint, request.data)
            .then(function(response){
            resolve(response.data)
          }).catch(function(response){
            reject(response.data)
          });
        } catch (exception) {
          reject('error in api delete function');
        }
      }) 
    },
    postFiles: function(context, request){
      return new Promise(function (resolve, reject) {
        try {
          jQuery.ajax({
            method: 'POST',
            data: request.data,
            contentType: false, 
            processData: false,
            url: window.$apiBaseUrl + request.endpoint,
            error: function($xhr) {
              reject($xhr.responseJSON)
            },
            success: function(data) {
              resolve(data)
            }
          });
        } catch (exception) {
          reject('error in api post function');
        }
      }) 
    }
  }
}