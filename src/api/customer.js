import request from '@/utils/request'

export function getCustomerList(params) {
  return request({
    url: '/basic/customers',
    method: 'get',
    params,
  })
}

export function createCustomer(data) {
  return request({
    url: '/basic/customers',
    method: 'post',
    data,
  })
}

export function updateCustomer(id, data) {
  return request({
    url: `/basic/customers/${id}`,
    method: 'put',
    data,
  })
}

export function deleteCustomer(id) {
  return request({
    url: `/basic/customers/${id}`,
    method: 'delete',
  })
}

export function batchDeleteCustomer(ids) {
  return request({
    url: '/basic/customers/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateCustomer(ids, data) {
  return request({
    url: '/basic/customers/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
