import request from '@/utils/request'

export function getAddressList(params) {
  return request({
    url: '/basic/addresses',
    method: 'get',
    params,
  })
}

export function createAddress(data) {
  return request({
    url: '/basic/addresses',
    method: 'post',
    data,
  })
}

export function updateAddress(id, data) {
  return request({
    url: `/basic/addresses/${id}`,
    method: 'put',
    data,
  })
}

export function deleteAddress(id) {
  return request({
    url: `/basic/addresses/${id}`,
    method: 'delete',
  })
}

export function batchDeleteAddress(ids) {
  return request({
    url: '/basic/addresses/batch-delete',
    method: 'post',
    data: { ids },
  })
}
