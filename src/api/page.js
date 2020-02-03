import request from '@/utils/request'

export function postPageCreate(data) {
  return request({
    url: '/calvin-server/api/v1/cms/page/create',
    method: 'POST',
    data
  })
}

export function fetchPageList(params) {
  return request({
    url: '/calvin-server/api/v1/cms/page/list',
    method: 'GET',
    params
  })
}

export function fetchPage(params) {
  return request({
    url: '/calvin-server/api/v1/cms/page',
    method: 'GET',
    params
  })
}

export function updatePage(data) {
  return request({
    url: '/calvin-server/api/v1/cms/page/update',
    method: 'POST',
    data
  })
}

export function removePage(data) {
  return request({
    url: '/calvin-server/api/v1/cms/page/remove',
    method: 'POST',
    data
  })
}