import request from '@/utils/request'

export function getWarehouseList(params) {
  return request({
    url: '/basic/warehouses',
    method: 'get',
    params,
  })
}

export function createWarehouse(data) {
  return request({
    url: '/basic/warehouses',
    method: 'post',
    data,
  })
}

export function updateWarehouse(id, data) {
  return request({
    url: `/basic/warehouses/${id}`,
    method: 'put',
    data,
  })
}

export function deleteWarehouse(id) {
  return request({
    url: `/basic/warehouses/${id}`,
    method: 'delete',
  })
}

export function batchDeleteWarehouse(ids) {
  return request({
    url: '/basic/warehouses/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateWarehouse(ids, data) {
  return request({
    url: '/basic/warehouses/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
