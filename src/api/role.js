import request from '@/utils/request'

export function fetchRoleList(params) {
  return request({
    url: '/calvin-server/api/v1/role/list',
    method: 'GET',
    params
  })
}

export function fetchRoleInfo(params) {
  return request({
    url: '/calvin-server/api/v1/role/info',
    method: 'GET',
    params
  })
}

export function postRoleCreate(data) {
  return request({
    url: '/calvin-server/api/v1/role/create',
    method: 'POST',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/calvin-server/api/v1/role/update',
    method: 'POST',
    data
  })
}

export function removeRole(data) {
  return request({
    url: '/calvin-server/api/v1/role/remove',
    method: 'POST',
    data
  })
}