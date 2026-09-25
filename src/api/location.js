import request from '@/utils/request'

export function getLocationList(params) {
  return request({
    url: '/basic/locations',
    method: 'get',
    params,
  })
}

export function createLocation(data) {
  return request({
    url: '/basic/locations',
    method: 'post',
    data,
  })
}

export function updateLocation(id, data) {
  return request({
    url: `/basic/locations/${id}`,
    method: 'put',
    data,
  })
}

export function deleteLocation(id) {
  return request({
    url: `/basic/locations/${id}`,
    method: 'delete',
  })
}

export function batchDeleteLocation(ids) {
  return request({
    url: '/basic/locations/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateLocation(ids, data) {
  return request({
    url: '/basic/locations/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
