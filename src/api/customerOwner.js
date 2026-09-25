import request from '@/utils/request'

export function getCustomerOwnerList(params) {
  return request({
    url: '/basic/customer-owners',
    method: 'get',
    params,
  })
}

export function updateCustomerOwner(id, data) {
  return request({
    url: `/basic/customer-owners/${id}`,
    method: 'put',
    data,
  })
}

export function deleteCustomerOwner(id) {
  return request({
    url: `/basic/customer-owners/${id}`,
    method: 'delete',
  })
}

export function batchDeleteCustomerOwner(ids) {
  return request({
    url: '/basic/customer-owners/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateCustomerOwner(ids, data) {
  return request({
    url: '/basic/customer-owners/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
