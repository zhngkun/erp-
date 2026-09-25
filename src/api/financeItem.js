import request from '@/utils/request'

export function getFinanceItemList(params) {
  return request({
    url: '/basic/finance-items',
    method: 'get',
    params,
  })
}

export function createFinanceItem(data) {
  return request({
    url: '/basic/finance-items',
    method: 'post',
    data,
  })
}

export function updateFinanceItem(id, data) {
  return request({
    url: `/basic/finance-items/${id}`,
    method: 'put',
    data,
  })
}

export function deleteFinanceItem(id) {
  return request({
    url: `/basic/finance-items/${id}`,
    method: 'delete',
  })
}

export function batchDeleteFinanceItem(ids) {
  return request({
    url: '/basic/finance-items/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateFinanceItem(ids, data) {
  return request({
    url: '/basic/finance-items/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
