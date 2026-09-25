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
    name: '颜色',
    value: '红色;绿色;蓝色;黑色;白色',
    enabled: 1,
    sort: 10,
    createdAt: '2026-09-20 09:20:11',
  },
  {
    id: 2,
    name: '规格',
    value: 'S;M;L;XL',
    enabled: 1,
    sort: 20,
    createdAt: '2026-09-20 09:21:05',
  },
  {
    id: 3,
    name: '材质',
    value: '不锈钢;铝合金;塑料;橡胶',
    enabled: 1,
    sort: 30,
    createdAt: '2026-09-18 14:10:22',
  },
  {
    id: 4,
    name: '电压',
    value: '12V;24V;36V;220V',
    enabled: 1,
    sort: 40,
    createdAt: '2026-09-15 11:30:00',
  },
  {
    id: 5,
    name: '表面处理',
    value: '喷塑;镀锌;抛光;阳极氧化',
    enabled: 0,
    sort: 50,
    createdAt: '2026-09-12 16:45:18',
  },
]

let list = seedList.map((item) => ({ ...item }))
let nextId = list.length + 1

export async function mockGetInventoryAttrList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    name = '',
    value = '',
    enabled = '',
  } = params
  let rows = [...list]
  if (name) rows = rows.filter((r) => r.name.includes(String(name).trim()))
  if (value) rows = rows.filter((r) => r.value.includes(String(value).trim()))
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

export async function mockCreateInventoryAttr(payload) {
  await sleep()
  if (!payload?.name?.trim()) return fail('请输入属性名')
  if (!payload?.value?.trim()) return fail('请输入属性值')
  const row = {
    id: nextId++,
    name: payload.name.trim(),
    value: payload.value.trim(),
    enabled: payload.enabled === 0 ? 0 : 1,
    sort: Number(payload.sort) || 0,
    createdAt: formatDate(new Date()),
  }
  list.unshift(row)
  return ok({ ...row })
}

export async function mockUpdateInventoryAttr(id, payload) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('属性不存在')
  list[idx] = {
    ...list[idx],
    ...payload,
    id: list[idx].id,
    name: payload.name != null ? String(payload.name).trim() : list[idx].name,
    value: payload.value != null ? String(payload.value).trim() : list[idx].value,
  }
  return ok({ ...list[idx] })
}

export async function mockDeleteInventoryAttr(id) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('属性不存在')
  list.splice(idx, 1)
  return ok(true)
}

export async function mockBatchDeleteInventoryAttr(ids = []) {
  await sleep()
  if (!ids.length) return fail('请选择属性')
  const idSet = new Set(ids.map(String))
  list = list.filter((r) => !idSet.has(String(r.id)))
  return ok(true)
}

export async function mockBatchUpdateInventoryAttr(ids = [], data = {}) {
  await sleep()
  if (!ids.length) return fail('请选择属性')
  const idSet = new Set(ids.map(String))
  list = list.map((r) => (idSet.has(String(r.id)) ? { ...r, ...data } : r))
  return ok(true)
}
