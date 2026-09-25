import request from '@/utils/request'

export function getDictTypeList() {
  return request({
    url: '/basic/dict-types',
    method: 'get',
  })
}

export function getDictValueList(params) {
  return request({
    url: '/basic/dict-values',
    method: 'get',
    params,
  })
}

export function createDictValue(data) {
  return request({
    url: '/basic/dict-values',
    method: 'post',
    data,
  })
}

export function updateDictValue(id, data) {
  return request({
    url: `/basic/dict-values/${id}`,
    method: 'put',
    data,
  })
}

export function deleteDictValue(id) {
  return request({
    url: `/basic/dict-values/${id}`,
    method: 'delete',
  })
}

export function batchDeleteDictValue(ids) {
  return request({
    url: '/basic/dict-values/batch-delete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateDictValue(ids, data) {
  return request({
    url: '/basic/dict-values/batch-update',
    method: 'post',
    data: { ids, ...data },
  })
}
