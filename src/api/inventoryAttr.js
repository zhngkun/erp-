import request from '@/utils/request'

export function getInventoryAttrList(params) {
  return request({
    url: '/basic/inventory-attrs',
    method: 'get',
    params,
  })
}

export function createInventoryAttr(data) {
  return request({
    url: '/basic/inventory-attrs',
    method: 'post',
    data,
  })
}

export function updateInventoryAttr(id, data) {
  return request({
    url: `/basic/inventory-attrs/${id}`,
    method: 'put',
    data,
  })
}

export function deleteInventoryAttr(id) {
  return request({
    url: `/basic/inventory-attrs/${id}`,
    method: 'delete',
  })
}

export function batchDeleteInventoryAttr(ids) {
  return request({
    url: '/basic/inventory-attrs/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateInventoryAttr(ids, data) {
  return request({
    url: '/basic/inventory-attrs/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
