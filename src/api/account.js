import request from '@/utils/request'

export function fetchAccountList(params) {
  return request({
    url: '/calvin-server/api/v1/account/list',
    method: 'GET',
    params
  })
}

export function fetchAccountInfo() {
  return request({
    url: '/calvin-server/api/v1/account/info',
    method: 'GET'
  })
}

export function postAccountCreate(data) {
  return request({
    url: '/calvin-server/api/v1/account/create',
    method: 'POST',
    data
  })
}

export function updateAccount(data) {
  return request({
    url: '/calvin-server/api/v1/account/update',
    method: 'POST',
    data
  })
}

export function postLogin(data) {
  return request({
    url: '/calvin-server/api/v1/account/login',
    method: 'POST',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/calvin-server/api/v1/account/password',
    method: 'POST',
    data
  })
}

export function removeAccount(data) {
  return request({
    url: '/calvin-server/api/v1/account/remove',
    method: 'POST',
    data
  })
}