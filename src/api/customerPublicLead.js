import request from '@/utils/request'

export function getPublicLeadList(params) {
  return request({
    url: '/basic/customer-public-leads',
    method: 'get',
    params,
  })
}

export function createPublicLead(data) {
  return request({
    url: '/basic/customer-public-leads',
    method: 'post',
    data,
  })
}

export function updatePublicLead(id, data) {
  return request({
    url: `/basic/customer-public-leads/${id}`,
    method: 'put',
    data,
  })
}

export function deletePublicLead(id) {
  return request({
    url: `/basic/customer-public-leads/${id}`,
    method: 'delete',
  })
}

export function batchDeletePublicLead(ids) {
  return request({
    url: '/basic/customer-public-leads/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchClaimPublicLead(ids) {
  return request({
    url: '/basic/customer-public-leads/batch-claim',
    method: 'post',
    data: { ids },
  })
}

export function batchAssignPublicLead(ids, data) {
  return request({
    url: '/basic/customer-public-leads/batch-assign',
    method: 'post',
    data: { ids, ...data },
  })
}
