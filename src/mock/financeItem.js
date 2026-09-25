import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/** Income 收入 / Expend 支出 / Reimburse 报销 */
export const FINANCE_ITEM_TYPES = [
  { value: 'Income', label: '收入' },
  { value: 'Expend', label: '支出' },
  { value: 'Reimburse', label: '报销' },
]

const seedList = [
  {
    id: 1,
    name: '销售收入',
    code: 'FI-INC-001',
    type: 'Income',
    subjectName: '主营业务收入',
    enabled: 1,
    sort: 10,
    remark: '产品销售回款',
    createdAt: '2026-09-18 09:20:11',
  },
  {
    id: 2,
    name: '其他收入',
    code: 'FI-INC-002',
    type: 'Income',
    subjectName: '其他业务收入',
    enabled: 1,
    sort: 20,
    remark: '',
    createdAt: '2026-09-18 09:21:05',
  },
  {
    id: 3,
    name: '采购支出',
    code: 'FI-EXP-001',
    type: 'Expend',
    subjectName: '原材料采购',
    enabled: 1,
    sort: 30,
    remark: '原材料与辅料采购',
    createdAt: '2026-09-17 14:10:22',
  },
  {
    id: 4,
    name: '运费',
    code: 'FI-EXP-002',
    type: 'Expend',
    subjectName: '销售费用-运费',
    enabled: 1,
    sort: 40,
    remark: '',
    createdAt: '2026-09-16 11:30:00',
  },
  {
    id: 5,
    name: '差旅报销',
    code: 'FI-RMB-001',
    type: 'Reimburse',
    subjectName: '管理费用-差旅',
    enabled: 1,
    sort: 50,
    remark: '员工差旅',
    createdAt: '2026-09-15 16:45:18',
  },
  {
    id: 6,
    name: '办公用品报销',
    code: 'FI-RMB-002',
    type: 'Reimburse',
    subjectName: '管理费用-办公',
    enabled: 0,
    sort: 60,
    remark: '临时停用',
    createdAt: '2026-09-10 08:55:18',
  },
]

let list = seedList.map((item) => ({ ...item }))
let nextId = list.length + 1

export async function mockGetFinanceItemList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    name = '',
    code = '',
    type = '',
    enabled = '',
  } = params
  let rows = [...list]
  if (name) rows = rows.filter((r) => r.name.includes(String(name).trim()))
  if (code) rows = rows.filter((r) => r.code.includes(String(code).trim()))
  if (type) rows = rows.filter((r) => r.type === type)
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

export async function mockCreateFinanceItem(payload) {
  await sleep()
  if (!payload?.name?.trim()) return fail('请输入名称')
  if (!payload?.type) return fail('请选择类型')
  if (payload.code && list.some((r) => r.code === payload.code.trim())) {
    return fail('编号已存在')
  }
  const row = {
    id: nextId++,
    name: payload.name.trim(),
    code: (payload.code || `FI-${Date.now().toString().slice(-6)}`).trim(),
    type: payload.type,
    subjectName: payload.subjectName || '',
    enabled: payload.enabled === 0 ? 0 : 1,
    sort: Number(payload.sort) || 0,
    remark: payload.remark || '',
    createdAt: formatDate(new Date()),
  }
  list.unshift(row)
  return ok({ ...row })
}

export async function mockUpdateFinanceItem(id, payload) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('收支项目不存在')
  if (payload.code) {
    const exists = list.some(
      (r) => r.code === payload.code.trim() && String(r.id) !== String(id),
    )
    if (exists) return fail('编号已存在')
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

export async function mockDeleteFinanceItem(id) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('收支项目不存在')
  list.splice(idx, 1)
  return ok(true)
}

export async function mockBatchDeleteFinanceItem(ids = []) {
  await sleep()
  if (!ids.length) return fail('请选择收支项目')
  const idSet = new Set(ids.map(String))
  list = list.filter((r) => !idSet.has(String(r.id)))
  return ok(true)
}

export async function mockBatchUpdateFinanceItem(ids = [], data = {}) {
  await sleep()
  if (!ids.length) return fail('请选择收支项目')
  const idSet = new Set(ids.map(String))
  list = list.map((r) => (idSet.has(String(r.id)) ? { ...r, ...data } : r))
  return ok(true)
}
