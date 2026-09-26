import request from '@/utils/request'

export function getCustomerMaterialList(params) {
  return request({ url: '/basic/customer-material', method: 'get', params })
}

export function createCustomerMaterial(data) {
  return request({ url: '/basic/customer-material', method: 'post', data })
}

export function updateCustomerMaterial(id, data) {
  return request({ url: `/basic/customer-material/${id}`, method: 'put', data })
}

export function removeCustomerMaterial(id) {
  return request({ url: `/basic/customer-material/${id}`, method: 'delete' })
}
