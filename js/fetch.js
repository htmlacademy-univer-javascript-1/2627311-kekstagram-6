const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const Urls = {
  GET: `${SERVER_URL}/data`,
  POST: `${SERVER_URL}/`,
};

const sendRequest = (onSuccess, onError, method, body) => {
  fetch(Urls[method], {
    method: method,
    body: body
  })
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
    })
    .catch((error) => {
      onError(error);
    });
};

const loadData = (onSuccess, onError, method = 'GET') => sendRequest(onSuccess, onError, method);

const uploadData = (onSuccess, onError, method = 'POST', body) => sendRequest(onSuccess, onError, method, body);

export {loadData, uploadData};
