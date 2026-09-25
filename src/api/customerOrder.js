import request from '@/utils/request'

export function getCustomerOrderList(params) {
  return request({
    url: '/basic/customer-orders',
    method: 'get',
    params,
  })
}

export function updateCustomerOrder(id, data) {
  return request({
    url: `/basic/customer-orders/${id}`,
    method: 'put',
    data,
  })
}

export function deleteCustomerOrder(id) {
  return request({
    url: `/basic/customer-orders/${id}`,
    method: 'delete',
  })
}

export function batchDeleteCustomerOrder(ids) {
  return request({
    url: '/basic/customer-orders/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateCustomerOrder(ids, data) {
  return request({
    url: '/basic/customer-orders/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
