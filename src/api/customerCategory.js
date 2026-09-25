import request from '@/utils/request'

export function getCustomerCategoryList(params) {
  return request({
    url: '/basic/customer-categories',
    method: 'get',
    params,
  })
}

export function createCustomerCategory(data) {
  return request({
    url: '/basic/customer-categories',
    method: 'post',
    data,
  })
}

export function updateCustomerCategory(id, data) {
  return request({
    url: `/basic/customer-categories/${id}`,
    method: 'put',
    data,
  })
}

export function deleteCustomerCategory(id) {
  return request({
    url: `/basic/customer-categories/${id}`,
    method: 'delete',
  })
}

export function batchDeleteCustomerCategory(ids) {
  return request({
    url: '/basic/customer-categories/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateCustomerCategory(ids, data) {
  return request({
    url: '/basic/customer-categories/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
