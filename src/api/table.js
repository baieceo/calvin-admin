import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/account/list',
    method: 'get',
    params
  })
}
