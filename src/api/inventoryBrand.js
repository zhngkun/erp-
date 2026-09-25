import request from '@/utils/request'

export function getInventoryBrandList(params) {
  return request({
    url: '/basic/inventory-brands',
    method: 'get',
    params,
  })
}

export function createInventoryBrand(data) {
  return request({
    url: '/basic/inventory-brands',
    method: 'post',
    data,
  })
}

export function updateInventoryBrand(id, data) {
  return request({
    url: `/basic/inventory-brands/${id}`,
    method: 'put',
    data,
  })
}

export function deleteInventoryBrand(id) {
  return request({
    url: `/basic/inventory-brands/${id}`,
    method: 'delete',
  })
}

export function batchDeleteInventoryBrand(ids) {
  return request({
    url: '/basic/inventory-brands/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateInventoryBrand(ids, data) {
  return request({
    url: '/basic/inventory-brands/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
