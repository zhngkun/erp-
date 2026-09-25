import request from '@/utils/request'

export function getSupplierCategoryList(params) {
  return request({
    url: '/basic/supplier-categories',
    method: 'get',
    params,
  })
}

export function createSupplierCategory(data) {
  return request({
    url: '/basic/supplier-categories',
    method: 'post',
    data,
  })
}

export function updateSupplierCategory(id, data) {
  return request({
    url: `/basic/supplier-categories/${id}`,
    method: 'put',
    data,
  })
}

export function deleteSupplierCategory(id) {
  return request({
    url: `/basic/supplier-categories/${id}`,
    method: 'delete',
  })
}

export function batchDeleteSupplierCategory(ids) {
  return request({
    url: '/basic/supplier-categories/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateSupplierCategory(ids, data) {
  return request({
    url: '/basic/supplier-categories/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
