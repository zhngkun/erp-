import request from '@/utils/request'

export function getSkuList(params) {
  return request({ url: '/basic/sku', method: 'get', params })
}

export function createSku(data) {
  return request({ url: '/basic/sku', method: 'post', data })
}

export function updateSku(id, data) {
  return request({ url: `/basic/sku/${id}`, method: 'put', data })
}

export function removeSku(id) {
  return request({ url: `/basic/sku/${id}`, method: 'delete' })
}
