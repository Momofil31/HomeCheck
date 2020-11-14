export default {
  namespaced: true,
  actions: {
    GetList: function(context, filters) {
      this.commit('layout/UpdateLoadingStatus', true);
      let Instance = this
      return new Promise(function(resolve,reject)  {
        Instance.dispatch('api/get', {
          endpoint: "v1/categories",
          data: filters
        }).then(function(data) {

          if(data.error){
            Instance.commit('layout/UpdateLoadingStatus', false)
            let message = (data.error.message !== undefined) ? data.error.message: "Generic Error"
            Instance.commit('layout/toast/setSnack', {message: message, color: "red"})
            //reject(message)
          }else{
            Instance.commit('layout/UpdateLoadingStatus', false)
            resolve({
              result: data.data
            })
          }          
        }).catch(function(data) {
          Instance.commit('layout/UpdateLoadingStatus', false)
          let message = data.error ? data.error.message: "Generic Error"
          Instance.commit('layout/toast/setSnack', {message: message, color: "red"})
          //reject(message)
        });
      })
    },
  },
  mutations: {
  }
}