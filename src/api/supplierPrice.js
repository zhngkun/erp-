import request from '@/utils/request'

export function getSupplierPriceList(params) {
  return request({
    url: '/basic/supplier-prices',
    method: 'get',
    params,
  })
}

export function createSupplierPrice(data) {
  return request({
    url: '/basic/supplier-prices',
    method: 'post',
    data,
  })
}

export function updateSupplierPrice(id, data) {
  return request({
    url: `/basic/supplier-prices/${id}`,
    method: 'put',
    data,
  })
}

export function deleteSupplierPrice(id) {
  return request({
    url: `/basic/supplier-prices/${id}`,
    method: 'delete',
  })
}

export function batchDeleteSupplierPrice(ids) {
  return request({
    url: '/basic/supplier-prices/batch-delete',
    method: 'post',
    data: { ids },
  })
}
