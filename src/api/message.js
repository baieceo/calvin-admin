import request from '@/utils/request'

export function fetchMessageList(params) {
  return request({
    url: '/calvin-server/api/v1/message/list',
    method: 'GET',
    params
  })
}

export function fetchMessageInfo(params) {
  return request({
    url: '/calvin-server/api/v1/message/info',
    method: 'GET',
    params
  })
}

export function updateMessage(data) {
  return request({
    url: '/calvin-server/api/v1/message/update',
    method: 'POST',
    data
  })
}

export function removeMessage(data) {
  return request({
    url: '/calvin-server/api/v1/message/remove',
    method: 'POST',
    data
  })
}