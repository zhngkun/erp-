import { fail, ok, sleep } from '../config'

export const BILL_STATUSES = [
  '已保存',
  '待审核',
  '已审核',
  '审核拒绝',
  '已取消',
]

export const DELETABLE_STATUSES = ['已保存', '待审核', '审核拒绝']

export function nowStr() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

export function todayStr() {
  return nowStr().slice(0, 10)
}

export function makeBillCode(prefix, id) {
  const d = todayStr().replace(/-/g, '')
  return `${prefix}-${d}${String(id).padStart(3, '0')}`
}

export function paginate(rows, page = 1, pageSize = 10) {
  const p = Number(page) || 1
  const size = Number(pageSize) || 10
  const start = (p - 1) * size
  return {
    list: rows.slice(start, start + size),
    total: rows.length,
    page: p,
    pageSize: size,
  }
}

export function filterByDate(rows, startDate, endDate, field = 'billDate') {
  let next = rows
  if (startDate) next = next.filter((r) => r[field] >= startDate)
  if (endDate) next = next.filter((r) => r[field] <= endDate)
  return next
}

/** 通用单据 mock CRUD */
export function createBillMockStore({ prefix, seedList, filterFn }) {
  let list = seedList.map((item) => ({ ...item }))
  let seq = Math.max(0, ...list.map((r) => r.id)) + 1

  async function getList(params = {}) {
    await sleep()
    const {
      page = 1,
      pageSize = 10,
      billCode = '',
      status = '',
      startDate = '',
      endDate = '',
      keyword = '',
    } = params
    let rows = [...list]
    if (billCode) {
      rows = rows.filter((r) =>
        String(r.billCode || '').includes(String(billCode).trim()),
      )
    }
    if (status) rows = rows.filter((r) => r.status === status)
    rows = filterByDate(rows, startDate, endDate)
    if (filterFn) rows = filterFn(rows, params)
    if (keyword) {
      const kw = String(keyword).trim()
      rows = rows.filter((r) => JSON.stringify(r).includes(kw))
    }
    return ok(paginate(rows, page, pageSize))
  }

  async function create(payload = {}) {
    await sleep()
    const id = seq++
    const row = {
      ...payload,
      id,
      billCode: payload.billCode || makeBillCode(prefix, id),
      billDate: payload.billDate || todayStr(),
      status: payload.status || '已保存',
      createAdminName: payload.createAdminName || '管理员',
      createdAt: nowStr(),
      itemList: payload.itemList || [],
      numberTotal: payload.numberTotal ?? sumQty(payload.itemList),
      itemSummary:
        payload.itemSummary ||
        (payload.itemList || [])
          .map((i) => i.materialName)
          .filter(Boolean)
          .join('、'),
    }
    list.unshift(row)
    return ok({ ...row })
  }

  async function update(id, payload = {}) {
    await sleep()
    const idx = list.findIndex((r) => String(r.id) === String(id))
    if (idx < 0) return fail('单据不存在')
    const next = {
      ...list[idx],
      ...payload,
      id: list[idx].id,
      billCode: list[idx].billCode,
    }
    if (payload.itemList) {
      next.numberTotal = sumQty(payload.itemList)
    }
    list[idx] = next
    return ok({ ...list[idx] })
  }

  async function remove(id) {
    await sleep()
    const idx = list.findIndex((r) => String(r.id) === String(id))
    if (idx < 0) return fail('单据不存在')
    if (!DELETABLE_STATUSES.includes(list[idx].status)) {
      return fail('当前状态不可删除')
    }
    list.splice(idx, 1)
    return ok(true)
  }

  async function batchDelete(ids = []) {
    await sleep()
    if (!ids.length) return fail('请选择单据')
    const idSet = new Set(ids.map(String))
    const blocked = list.filter(
      (r) => idSet.has(String(r.id)) && !DELETABLE_STATUSES.includes(r.status),
    )
    if (blocked.length) return fail('存在不可删除的单据')
    list = list.filter((r) => !idSet.has(String(r.id)))
    return ok(true)
  }

  async function batchUpdate(ids = [], data = {}) {
    await sleep()
    if (!ids.length) return fail('请选择单据')
    const idSet = new Set(ids.map(String))
    list = list.map((r) => (idSet.has(String(r.id)) ? { ...r, ...data } : r))
    return ok(true)
  }

  return { getList, create, update, remove, batchDelete, batchUpdate }
}

function sumQty(items = []) {
  return (items || []).reduce((s, it) => s + Number(it.number || it.qty || 0), 0)
}

export function itemLine(partial = {}) {
  return {
    materialName: '铝合金型材 6063',
    spec: '40×40×2.0',
    code: 'SKU-6063-4040',
    cover: '',
    number: 10,
    unitName: '米',
    stockName: '原材料仓',
    locationName: 'A-01-01',
    costPrice: 28.5,
    salePrice: 36,
    serialNumber: '',
    batchNumber: '',
    remark: '',
    ...partial,
  }
}
