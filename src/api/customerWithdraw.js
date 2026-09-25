import request from '@/utils/request'

export function getCustomerWithdrawList(params) {
  return request({
    url: '/basic/customer-withdrawals',
    method: 'get',
    params,
  })
}

export function updateCustomerWithdraw(id, data) {
  return request({
    url: `/basic/customer-withdrawals/${id}`,
    method: 'put',
    data,
  })
}

export function batchUpdateCustomerWithdraw(ids, data) {
  return request({
    url: '/basic/customer-withdrawals/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
