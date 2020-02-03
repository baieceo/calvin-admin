import request from '@/utils/request'

export function fetchApplyList(params) {
  return request({
    url: '/calvin-server/api/v1/apply/list',
    method: 'GET',
    params
  })
}

export function fetchApplyInfo(params) {
  return request({
    url: '/calvin-server/api/v1/apply/info',
    method: 'GET',
    params
  })
}

export function updateApply(data) {
  return request({
    url: '/calvin-server/api/v1/apply/update',
    method: 'POST',
    data
  })
}

export function removeApply(data) {
  return request({
    url: '/calvin-server/api/v1/apply/remove',
    method: 'POST',
    data
  })
}