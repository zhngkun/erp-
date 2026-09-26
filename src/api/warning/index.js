import request from '@/utils/request'

export function getWarningList(warningKey, params) {
  return request({
    url: `/warning/records/${warningKey}`,
    method: 'get',
    params,
  })
}

export function getWarningRuleList(params) {
  return request({ url: '/warning/rules', method: 'get', params })
}

export function createWarningRule(data) {
  return request({ url: '/warning/rules', method: 'post', data })
}

export function updateWarningRule(id, data) {
  return request({ url: `/warning/rules/${id}`, method: 'put', data })
}

export function removeWarningRule(id) {
  return request({ url: `/warning/rules/${id}`, method: 'delete' })
}

export function generateWarnings() {
  return request({ url: '/warning/rules/generate', method: 'post' })
}
