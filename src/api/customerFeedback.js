import request from '@/utils/request'

export function getCustomerFeedbackList(params) {
  return request({
    url: '/basic/customer-feedbacks',
    method: 'get',
    params,
  })
}

export function updateCustomerFeedback(id, data) {
  return request({
    url: `/basic/customer-feedbacks/${id}`,
    method: 'put',
    data,
  })
}
