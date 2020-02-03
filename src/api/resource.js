import request from '@/utils/request'

export function fetchResourceList(params) {
  return request({
    url: '/calvin-server/api/v1/cms/resource/list',
    method: 'GET',
    params
  })
}

export function fetchFolderExist(params) {
  return request({
    url: '/calvin-server/api/v1/cms/resource/folder/exist',
    method: 'GET',
    params
  })
}

export function postFolderCreate(data) {
  return request({
    url: '/calvin-server/api/v1/cms/resource/folder/create',
    method: 'POST',
    data
  })
}

export function postResourceRename(data) {
  return request({
    url: '/calvin-server/api/v1/cms/resource/rename',
    method: 'POST',
    data
  })
}

export function removeResource(data) {
  return request({
    url: '/calvin-server/api/v1/cms/resource/remove',
    method: 'POST',
    data
  })
}