import request from '@/utils/request'

export function getOpportunityEvalList(params) {
  return request({
    url: '/basic/customer-opportunity-evals',
    method: 'get',
    params,
  })
}

export function updateOpportunityEval(id, data) {
  return request({
    url: `/basic/customer-opportunity-evals/${id}`,
    method: 'put',
    data,
  })
}

export function deleteOpportunityEval(id) {
  return request({
    url: `/basic/customer-opportunity-evals/${id}`,
    method: 'delete',
  })
}

export function batchDeleteOpportunityEval(ids) {
  return request({
    url: '/basic/customer-opportunity-evals/batch-delete',
    method: 'post',
    data: { ids },
  })
}
