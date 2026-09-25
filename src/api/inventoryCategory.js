import request from '@/utils/request'

export function getInventoryCategoryList(params) {
  return request({
    url: '/basic/inventory-categories',
    method: 'get',
    params,
  })
}

export function createInventoryCategory(data) {
  return request({
    url: '/basic/inventory-categories',
    method: 'post',
    data,
  })
}

export function updateInventoryCategory(id, data) {
  return request({
    url: `/basic/inventory-categories/${id}`,
    method: 'put',
    data,
  })
}

export function deleteInventoryCategory(id) {
  return request({
    url: `/basic/inventory-categories/${id}`,
    method: 'delete',
  })
}

export function batchDeleteInventoryCategory(ids) {
  return request({
    url: '/basic/inventory-categories/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateInventoryCategory(ids, data) {
  return request({
    url: '/basic/inventory-categories/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
