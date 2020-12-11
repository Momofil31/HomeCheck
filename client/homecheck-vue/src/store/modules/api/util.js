exports.dispatchSuccess = (data, Instance, resolve) => {
  if (data.error) {
    Instance.commit('layout/UpdateLoadingStatus', false);
    const message = data.error.description !== undefined ? data.error.description : 'Generic Error';
    Instance.commit('layout/toast/setSnack', { message, color: 'red' });
    // reject(message)
  } else {
    Instance.commit('layout/UpdateLoadingStatus', false);
    resolve({
      result: data.data,
    });
  }
};

exports.dispatchSuccessWithMessage = (data, Instance, resolve) => {
  if (data.error) {
    Instance.commit('layout/UpdateLoadingStatus', false);
    const message = data.error.description !== undefined ? data.error.description : 'Generic Error';
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
};

exports.dispatchError = (data, Instance) => {
  Instance.commit('layout/UpdateLoadingStatus', false);
  const message = data.error ? data.error.description : 'Generic Error';
  Instance.commit('layout/toast/setSnack', { message, color: 'red' });
  // reject(message)
};
