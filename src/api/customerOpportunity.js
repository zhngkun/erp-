import request from '@/utils/request'

export function getOpportunityList(params) {
  return request({
    url: '/basic/customer-opportunities',
    method: 'get',
    params,
  })
}

export function createOpportunity(data) {
  return request({
    url: '/basic/customer-opportunities',
    method: 'post',
    data,
  })
}

export function updateOpportunity(id, data) {
  return request({
    url: `/basic/customer-opportunities/${id}`,
    method: 'put',
    data,
  })
}

export function deleteOpportunity(id) {
  return request({
    url: `/basic/customer-opportunities/${id}`,
    method: 'delete',
  })
}

export function batchDeleteOpportunity(ids) {
  return request({
    url: '/basic/customer-opportunities/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function pushOpportunity(ids, target) {
  return request({
    url: '/basic/customer-opportunities/push',
    method: 'post',
    data: { ids, target },
  })
}
