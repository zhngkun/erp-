import request from '@/utils/request'

export function loginApi(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}

export function getUserList(params) {
  return request({
    url: '/system/users',
    method: 'get',
    params,
  })
}

export function createUser(data) {
  return request({
    url: '/system/users',
    method: 'post',
    data,
  })
}

export function updateUser(id, data) {
  return request({
    url: `/system/users/${id}`,
    method: 'put',
    data,
  })
}

export function deleteUser(id) {
  return request({
    url: `/system/users/${id}`,
    method: 'delete',
  })
}
