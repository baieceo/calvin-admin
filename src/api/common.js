import request from '@/utils/request'

export function fetchCommonEnums(params) {
  return request({
    url: '/calvin-server/api/v1/common/enums',
    method: 'GET',
    params
  })
}

export function postUpload(data) {
	return request({
		url: '/calvin-server/api/v1/upload',
		headers: { 'Content-Type': 'multipart/form-data' },
		method: 'POST',
		data
	})
}