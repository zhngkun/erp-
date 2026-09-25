import request from '@/utils/request'

export function getStockInventoryList(params) {
  return request({ url: '/stock/inventories', method: 'get', params })
}

export function getStockFlowList(params) {
  return request({ url: '/stock/flows', method: 'get', params })
}

export function getStockLockList(params) {
  return request({ url: '/stock/locks', method: 'get', params })
}

export function unlockStock(id) {
  return request({ url: `/stock/locks/${id}/unlock`, method: 'post' })
}

export function createStockBillApi(billKey) {
  const base = `/stock/bills/${billKey}`
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
