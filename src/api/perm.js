import request from '@/utils/request'

export function fetchPermList(params) {
  return request({
    url: '/calvin-server/api/v1/perm/list',
    method: 'GET',
    params
  })
}

export function fetchPermInfo() {
  return request({
    url: '/calvin-server/api/v1/perm/info',
    method: 'GET'
  })
}

export function postPermCreate(data) {
  return request({
    url: '/calvin-server/api/v1/perm/create',
    method: 'POST',
    data
  })
}

export function updatePerm(data) {
  return request({
    url: '/calvin-server/api/v1/perm/update',
    method: 'POST',
    data
  })
}

export function removePerm(data) {
  return request({
    url: '/calvin-server/api/v1/perm/remove',
    method: 'POST',
    data
  })
}