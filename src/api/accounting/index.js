import request from '@/utils/request'

export function createAccountingApi(recordKey) {
  const base = `/accounting/records/${recordKey}`
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
