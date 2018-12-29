const axios = require("axios");
const cancelToken = axios.CancelToken;

function postData (url, data = {}) {
  return axios({
    url: url,
    baseURL: 'http://localhost:1337/',
    method: 'post',
    data,
    auth: {
      username: 'admin',
      password: 'it1dev'
    },
    cancelToken
  }).catch(thrown => {
    if (axios.isCancel(thrown)) {
      console.log('Request canceled', thrown.message);
    } else {
      console.error();
    }
  });
}

function createArtist (data) {
  return postData('/artists', data)
    .then(response => response);
}

function createSeries (data) {
  return postData('/series', data)
    .then(response => response.data.id);
}

function createVolume (data) {
  return postData('/volumes', data)
    .then(response => response.data.id);
}

function createChapter (data) {
  return postData('/chapters', data)
    .then(response => response.data.id);
}

function createImage (data) {
  return postData('/images', data)
    .then(response => response.data.id);
}

module.exports = {
  createArtist,
  createSeries,
  createVolume,
  createChapter,
  createImage
}