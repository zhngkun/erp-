import request from '@/utils/request'

export function getInventoryList(params) {
  return request({
    url: '/basic/inventories',
    method: 'get',
    params,
  })
}

export function createInventory(data) {
  return request({
    url: '/basic/inventories',
    method: 'post',
    data,
  })
}

export function updateInventory(id, data) {
  return request({
    url: `/basic/inventories/${id}`,
    method: 'put',
    data,
  })
}

export function deleteInventory(id) {
  return request({
    url: `/basic/inventories/${id}`,
    method: 'delete',
  })
}

export function batchDeleteInventory(ids) {
  return request({
    url: '/basic/inventories/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateInventory(ids, data) {
  return request({
    url: '/basic/inventories/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
