import request from '@/utils/request'

// export function getList(params) {
//   return request({
//     url: '/table/list',
//     method: 'post',
//     params
//   })
// }

// restFul格式的find/{id}
export function find(url) {
  return request({
    url: url,
    method: 'get'
  })
}

export function getList(url, params) {
  return request({
    url: url,
    method: 'post',
    params
  })
}

export function findList(url, entity) {
  return request({
    url: url,
    method: 'post',
    data: entity
  })
}

export function findPage(url, entity, page) {
  return request({
    url: url,
    method: 'post',
    data: { entity: entity, page: page }
  })
}

export function update(url, data) {
  return request({
    url: url,
    method: 'post',
    data: data
  })
}

export function insert(url, data) {
  return request({
    url: url,
    method: 'post',
    data: data
  })
}

export function deleteById(url) {
  return request({
    url: url,
    method: 'get'
  })
}

export function findById(url, id) {
  return request({
    url: url,
    method: 'get',
    params: { id }
  })
}

// restFul格式的enable/{id}
export function enable(url) {
  return request({
    url: url,
    method: 'get'
  })
}

// restFul格式的disable/{id}
export function disable(url) {
  return request({
    url: url,
    method: 'get'
  })
}
