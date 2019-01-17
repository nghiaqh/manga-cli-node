const axios = require('axios')
const flatten = require('lodash/flatten')

function request(method, url, data = {}, params = {}) {
  return axios({
    url: url,
    baseURL: 'http://localhost:8181/api/',
    method: method,
    data,
    params
  }).catch(thrown => {
    console.error(thrown.stack)
  })
}

async function patchOrCreate(data, contentType, whereProp) {
  const response = await request('get', `/${contentType}`, {}, {
    filter: {
      where: {
        [whereProp]: data[whereProp]
      },
      limit: 1
    }
  })

  if (response.status === 200 && response.data.length) {
    // console.log(response.status, response.data, response.request.path)
    const newData = Object.assign({}, {
      id: response.data[0].id
    }, data)
    await patch(contentType, newData)
    return newData
  } else {
    const r = await request('post', `/${contentType}`, data)
    return r.data
  }
}

async function patch(contentType, data) {
  const response = await request('patch', `/${contentType}/${data.id}`, data)
  return response.data
}

async function patchOrCreateWithCache(contents, contentType, whereProp, cache) {
  let existing = []
  let toBeCreated = []

  contents.forEach(item => {
    const cachedContents = cache[contentType].filter(cached => cached[whereProp] === item[whereProp])

    if (!cachedContents.length) {
      toBeCreated.push(item)
    } else {
      existing.push(cachedContents[0])
    }
  })

  for (const item of toBeCreated) {
    const data = await patchOrCreate(item, contentType, whereProp)
    const newItem = Array.isArray(data) ? flatten(data) : data
    existing = existing.concat(newItem)
    cache[contentType] = cache[contentType].concat(newItem)
  }

  return existing
}

module.exports = {
  patchOrCreateWithCache,
  patch,
  patchOrCreate
}
