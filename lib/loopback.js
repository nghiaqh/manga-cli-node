const axios = require('axios')

function request (method, url, data = {}, params = {}) {
  return axios({
    url: url,
    baseURL: 'http://localhost:3000/',
    method: method,
    data,
    params
  }).catch(thrown => {
    console.error(thrown.stack)
  })
}

async function createArtist (data) {
  const response = await request('get', '/artists', {}, {
    filter: {
      where: {
        name: data.name
      },
      limit: 1
    }
  })

  if (response.status === 200 && response.data.length) {
    // console.log(response.status, response.data, response.request.path)
    return response.data
  } else {
    const r = await request('post', '/artists', data)
    return r.data
  }
}

async function updateArtist (data) {
  const response = await request('patch', '/artists', data, {
    filter: {
      where: {
        id: data.id
      },
      limit: 1
    }
  })

  return response.data
}

function createSeries (data) {
  return request('post', '/series', data)
    .then(response => response.data.id)
}

function createOneshot (data) {
  return request('post', '/oneshots', data)
    .then(response => response.data)
}

function createVolume (data) {
  return request('post', '/volumes', data)
    .then(response => response.data)
}

function createChapter (data) {
  return request('post', '/chapters', data)
    .then(response => response.data)
}

function createImage (data) {
  return request('post', '/images', data)
    .then(response => response.data)
}

module.exports = {
  createArtist,
  updateArtist,
  createSeries,
  createOneshot,
  createVolume,
  createChapter,
  createImage
}
