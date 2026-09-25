import request from '@/utils/request'

export function getInventoryUnitGroupList(params) {
  return request({
    url: '/basic/inventory-unit-groups',
    method: 'get',
    params,
  })
}

export function createInventoryUnitGroup(data) {
  return request({
    url: '/basic/inventory-unit-groups',
    method: 'post',
    data,
  })
}

export function updateInventoryUnitGroup(id, data) {
  return request({
    url: `/basic/inventory-unit-groups/${id}`,
    method: 'put',
    data,
  })
}

export function deleteInventoryUnitGroup(id) {
  return request({
    url: `/basic/inventory-unit-groups/${id}`,
    method: 'delete',
  })
}

export function getInventoryUnitList(params) {
  return request({
    url: '/basic/inventory-units',
    method: 'get',
    params,
  })
}

export function createInventoryUnit(data) {
  return request({
    url: '/basic/inventory-units',
    method: 'post',
    data,
  })
}

export function updateInventoryUnit(id, data) {
  return request({
    url: `/basic/inventory-units/${id}`,
    method: 'put',
    data,
  })
}

export function deleteInventoryUnit(id) {
  return request({
    url: `/basic/inventory-units/${id}`,
    method: 'delete',
  })
}

export function batchDeleteInventoryUnit(ids) {
  return request({
    url: '/basic/inventory-units/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateInventoryUnit(ids, data) {
  return request({
    url: '/basic/inventory-units/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
