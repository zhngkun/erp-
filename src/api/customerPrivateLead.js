import request from '@/utils/request'

export function getPrivateLeadList(params) {
  return request({
    url: '/basic/customer-private-leads',
    method: 'get',
    params,
  })
}

export function createPrivateLead(data) {
  return request({
    url: '/basic/customer-private-leads',
    method: 'post',
    data,
  })
}

export function updatePrivateLead(id, data) {
  return request({
    url: `/basic/customer-private-leads/${id}`,
    method: 'put',
    data,
  })
}

export function deletePrivateLead(id) {
  return request({
    url: `/basic/customer-private-leads/${id}`,
    method: 'delete',
  })
}

export function batchDeletePrivateLead(ids) {
  return request({
    url: '/basic/customer-private-leads/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchDealPrivateLead(ids) {
  return request({
    url: '/basic/customer-private-leads/batch-deal',
    method: 'post',
    data: { ids },
  })
}

export function batchReleasePrivateLead(ids) {
  return request({
    url: '/basic/customer-private-leads/batch-release',
    method: 'post',
    data: { ids },
  })
}
