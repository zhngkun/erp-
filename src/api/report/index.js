import request from '@/utils/request'

export function createReportApi(recordKey) {
  const base = `/report/records/${recordKey}`
  return {
    getList(params) {
      return request({ url: base, method: 'get', params })
    },
  }
}
