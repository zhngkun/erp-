import request from '@/utils/request'

export function createCashBillApi(billKey) {
  const base = `/cash/bills/${billKey}`
  return {
    getList(params) {
      return request({ url: base, method: 'get', params })
    },
    create(data) {
      return request({ url: base, method: 'post', data })
    },
    update(id, data) {
      return request({ url: `${base}/${id}`, method: 'put', data })
    },
    remove(id) {
      return request({ url: `${base}/${id}`, method: 'delete' })
    },
    batchDelete(ids) {
      return request({
        url: `${base}/batch-delete`,
        method: 'post',
        data: { ids },
      })
    },
    batchUpdate(ids, data) {
      return request({
        url: `${base}/batch-update`,
        method: 'post',
        data: { ids, ...data },
      })
    },
  }
}

export function getCashPaymentMethodList(params) {
  return request({ url: '/cash/payment-methods', method: 'get', params })
}

export function createCashPaymentMethod(data) {
  return request({ url: '/cash/payment-methods', method: 'post', data })
}

export function updateCashPaymentMethod(id, data) {
  return request({ url: `/cash/payment-methods/${id}`, method: 'put', data })
}

export function deleteCashPaymentMethod(id) {
  return request({ url: `/cash/payment-methods/${id}`, method: 'delete' })
}

export function batchDeleteCashPaymentMethod(ids) {
  return request({
    url: '/cash/payment-methods/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateCashPaymentMethod(ids, data) {
  return request({
    url: '/cash/payment-methods/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
