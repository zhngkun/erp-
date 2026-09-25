import request from '@/utils/request'

export function getSupplierList(params) {
  return request({
    url: '/basic/suppliers',
    method: 'get',
    params,
  })
}

export function createSupplier(data) {
  return request({
    url: '/basic/suppliers',
    method: 'post',
    data,
  })
}

export function updateSupplier(id, data) {
  return request({
    url: `/basic/suppliers/${id}`,
    method: 'put',
    data,
  })
}

export function deleteSupplier(id) {
  return request({
    url: `/basic/suppliers/${id}`,
    method: 'delete',
  })
}

export function batchDeleteSupplier(ids) {
  return request({
    url: '/basic/suppliers/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateSupplier(ids, data) {
  return request({
    url: '/basic/suppliers/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
