import request from '@/utils/request'

export function createPurchaseBillApi(billKey) {
  const base = `/purchase/bills/${billKey}`
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

export function getPurchaseFollowUpList(params) {
  return request({ url: '/purchase/follow-ups', method: 'get', params })
}
