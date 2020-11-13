export default {
    namespaced: true,
    modules: {
    },
    actions: {
        get: function(context, request) {
            return new Promise(function(resolve, reject) {
                try {
                    jQuery.ajax({
                        method: "GET",
                        data: request.data,
                        url: process.env.API_BASE_URL + request.endpoint,
                        error: function($xhr) {
                          reject($xhr.responseJSON)
                        },
                        success: function(data) {
                          resolve(data)
                        }
                    })
                } catch (exception) {
                    reject("error in api get function");
                }
            }) 
        },
        post: function(context, request) {
            return new Promise(function(resolve, reject) {
                try {
                    jQuery.ajax({
                        method: "POST",
                        data: request.data,
                        url: process.env.API_BASE_URL + request.endpoint,
                        error: function($xhr) {
                          reject($xhr.responseJSON)
                        },
                        success: function(data) {
                          resolve(data)
                        }
                    });
                } catch (exception) {
                    reject("error in api post function");
                }
            }) 
        },
        put: function(context, request) {
            return new Promise(function(resolve, reject) {
                try {
                    jQuery.ajax({
                        method: "PUT",
                        data: request.data,
                        url: process.env.API_BASE_URL + request.endpoint,
                        error: function($xhr) {
                          reject($xhr.responseJSON)
                        },
                        success: function(data) {
                          resolve(data)
                        }
                    });
                } catch (exception) {
                    reject("error in api post function");
                }
            }) 
        },
        delete: function(context, request) {
            return new Promise(function(resolve, reject) {
                try {
                    jQuery.ajax({
                        method: "DELETE",
                        data: request.data,
                        url: process.env.API_BASE_URL + request.endpoint,
                        error: function($xhr) {
                          reject($xhr.responseJSON)
                        },
                        success: function(data) {
                          resolve(data)
                        }
                    });
                } catch (exception) {
                    reject("error in api delete function");
                }
            }) 
        },
        postFiles: function(context, request){
            return new Promise(function (resolve, reject) {
                try {
                    jQuery.ajax({
                        method: "POST",
                        data: request.data,
                        contentType: false, 
                        processData: false,
                        url: process.env.API_BASE_URL + request.endpoint,
                        error: function($xhr) {
                          reject($xhr.responseJSON)
                        },
                        success: function(data) {
                          resolve(data)
                        }
                    });
                } catch (exception) {
                    reject("error in api post function");
                }
            }) 
        }
    }
}