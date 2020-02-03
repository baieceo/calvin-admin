import request from '@/utils/request'

export function postTypeCreate(data) {
  return request({
    url: '/calvin-server/api/v1/cms/type/create',
    method: 'POST',
    data
  })
}

export function updateType(data) {
  return request({
    url: '/calvin-server/api/v1/cms/type/update',
    method: 'POST',
    data
  })
}

export function fetchTypeList(params) {
  return request({
    url: '/calvin-server/api/v1/cms/type/list',
    method: 'GET',
    params
  })
}

export function fetchType(params) {
  return request({
    url: '/calvin-server/api/v1/cms/type',
    method: 'GET',
    params
  })
}

export function fetchPathExist(params) {
  return request({
    url: '/calvin-server/api/v1/cms/type/path/exist',
    method: 'GET',
    params
  })
}

export function removeType(data) {
  return request({
    url: '/calvin-server/api/v1/cms/type/remove',
    method: 'POST',
    data
  })
}