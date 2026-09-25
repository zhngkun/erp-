import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const seedList = [
  {
    id: 1,
    name: '西门子',
    code: 'BR-SIEMENS',
    enabled: 1,
    sort: 10,
    org: '总部',
    createdAt: '2026-09-20 09:20:11',
  },
  {
    id: 2,
    name: '施耐德',
    code: 'BR-SCHNEIDER',
    enabled: 1,
    sort: 20,
    org: '总部',
    createdAt: '2026-09-20 09:21:05',
  },
  {
    id: 3,
    name: '三菱',
    code: 'BR-MITSUBISHI',
    enabled: 1,
    sort: 30,
    org: '制造中心',
    createdAt: '2026-09-18 14:10:22',
  },
  {
    id: 4,
    name: '欧姆龙',
    code: 'BR-OMRON',
    enabled: 1,
    sort: 40,
    org: '总部',
    createdAt: '2026-09-15 11:30:00',
  },
  {
    id: 5,
    name: '自有品牌',
    code: 'BR-OWN',
    enabled: 1,
    sort: 5,
    org: '总部',
    createdAt: '2026-09-12 16:45:18',
  },
  {
    id: 6,
    name: '杂牌/无品牌',
    code: 'BR-NONE',
    enabled: 0,
    sort: 999,
    org: '总部',
    createdAt: '2026-08-28 09:01:19',
  },
]

let list = seedList.map((item) => ({ ...item }))
let nextId = list.length + 1

export async function mockGetInventoryBrandList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    name = '',
    code = '',
    enabled = '',
  } = params
  let rows = [...list]
  if (name) rows = rows.filter((r) => r.name.includes(String(name).trim()))
  if (code) rows = rows.filter((r) => r.code.includes(String(code).trim()))
  if (enabled !== '' && enabled != null) {
    rows = rows.filter((r) => r.enabled === Number(enabled))
  }
  rows.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
  const total = rows.length
  const start = (Number(page) - 1) * Number(pageSize)
  return ok({
    list: rows.slice(start, start + Number(pageSize)),
    total,
    page: Number(page),
    pageSize: Number(pageSize),
  })
}

export async function mockCreateInventoryBrand(payload) {
  await sleep()
  if (!payload?.name?.trim()) return fail('请输入品牌名称')
  if (!payload?.code?.trim()) return fail('请输入品牌编号')
  if (list.some((r) => r.code === payload.code.trim())) return fail('品牌编号已存在')
  const row = {
    id: nextId++,
    name: payload.name.trim(),
    code: payload.code.trim(),
    enabled: payload.enabled === 0 ? 0 : 1,
    sort: Number(payload.sort) || 0,
    org: payload.org || '总部',
    createdAt: formatDate(new Date()),
  }
  list.unshift(row)
  return ok({ ...row })
}

export async function mockUpdateInventoryBrand(id, payload) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('品牌不存在')
  if (payload.code) {
    const exists = list.some(
      (r) => r.code === payload.code.trim() && String(r.id) !== String(id),
    )
    if (exists) return fail('品牌编号已存在')
  }
  list[idx] = {
    ...list[idx],
    ...payload,
    id: list[idx].id,
    name: payload.name != null ? String(payload.name).trim() : list[idx].name,
    code: payload.code != null ? String(payload.code).trim() : list[idx].code,
  }
  return ok({ ...list[idx] })
}

export async function mockDeleteInventoryBrand(id) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('品牌不存在')
  list.splice(idx, 1)
  return ok(true)
}

export async function mockBatchDeleteInventoryBrand(ids = []) {
  await sleep()
  if (!ids.length) return fail('请选择品牌')
  const idSet = new Set(ids.map(String))
  list = list.filter((r) => !idSet.has(String(r.id)))
  return ok(true)
}

export async function mockBatchUpdateInventoryBrand(ids = [], data = {}) {
  await sleep()
  if (!ids.length) return fail('请选择品牌')
  const idSet = new Set(ids.map(String))
  list = list.map((r) => (idSet.has(String(r.id)) ? { ...r, ...data } : r))
  return ok(true)
}
