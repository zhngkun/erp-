import request from '@/utils/request'

export function getWarningList(warningKey, params) {
  return request({
    url: `/warning/records/${warningKey}`,
    method: 'get',
    params,
  })
}
