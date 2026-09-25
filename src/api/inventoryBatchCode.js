import request from '@/utils/request'

export function getInventoryBatchCodeSettings() {
  return request({
    url: '/basic/inventory-batch-code/settings',
    method: 'get',
  })
}

export function saveInventoryBatchCodeSettings(data) {
  return request({
    url: '/basic/inventory-batch-code/settings',
    method: 'put',
    data,
  })
}

export function previewInventoryBatchCodes(data) {
  return request({
    url: '/basic/inventory-batch-code/preview',
    method: 'post',
    data,
  })
}
