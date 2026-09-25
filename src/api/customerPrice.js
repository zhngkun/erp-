import request from '@/utils/request'

export function getCustomerPriceList(params) {
  return request({
    url: '/basic/customer-prices',
    method: 'get',
    params,
  })
}

export function createCustomerPrice(data) {
  return request({
    url: '/basic/customer-prices',
    method: 'post',
    data,
  })
}

export function updateCustomerPrice(id, data) {
  return request({
    url: `/basic/customer-prices/${id}`,
    method: 'put',
    data,
  })
}

export function deleteCustomerPrice(id) {
  return request({
    url: `/basic/customer-prices/${id}`,
    method: 'delete',
  })
}

export function batchDeleteCustomerPrice(ids) {
  return request({
    url: '/basic/customer-prices/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateCustomerPrice(ids, data) {
  return request({
    url: '/basic/customer-prices/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
