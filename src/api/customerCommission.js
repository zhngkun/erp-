import request from '@/utils/request'

export function getCustomerCommissionSummary(params) {
  return request({
    url: '/basic/customer-commissions/summary',
    method: 'get',
    params,
  })
}

export function getCustomerCommissionSaleDetails(params) {
  return request({
    url: '/basic/customer-commissions/sale-details',
    method: 'get',
    params,
  })
}

export function getCustomerCommissionCustomerDetails(params) {
  return request({
    url: '/basic/customer-commissions/customer-details',
    method: 'get',
    params,
  })
}

export function getCustomerCommissionWithdrawDetails(params) {
  return request({
    url: '/basic/customer-commissions/withdraw-details',
    method: 'get',
    params,
  })
}
