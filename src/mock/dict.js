import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/** 字典类型（左侧树） */
const seedTypes = [
  { id: 1, code: 'customer_industry', name: '行业分类', sort: 10 },
  { id: 2, code: 'customer_value_assessment', name: '价值评估等级', sort: 20 },
  { id: 3, code: 'sale_order_contract_category', name: '销售合同分类', sort: 30 },
  { id: 4, code: 'stock_loss_reason', name: '库存损耗原因', sort: 40 },
  { id: 5, code: 'maintenance_category', name: '维修分类', sort: 50 },
  { id: 6, code: 'knives_scrap_reason', name: '刀检具报废原因', sort: 60 },
  { id: 7, code: 'knives_material_quality', name: '刀检具材质', sort: 70 },
]

const seedValues = [
  { id: 1, pid: 1, name: '制造业', enabled: 1, sort: 1, remark: '' },
  { id: 2, pid: 1, name: '批发零售', enabled: 1, sort: 2, remark: '' },
  { id: 3, pid: 1, name: '信息技术', enabled: 1, sort: 3, remark: '' },
  { id: 4, pid: 1, name: '建筑业', enabled: 0, sort: 4, remark: '停用' },
  { id: 5, pid: 2, name: 'A级', enabled: 1, sort: 1, remark: '高价值' },
  { id: 6, pid: 2, name: 'B级', enabled: 1, sort: 2, remark: '' },
  { id: 7, pid: 2, name: 'C级', enabled: 1, sort: 3, remark: '' },
  { id: 8, pid: 3, name: '标准合同', enabled: 1, sort: 1, remark: '' },
  { id: 9, pid: 3, name: '框架协议', enabled: 1, sort: 2, remark: '' },
  { id: 10, pid: 4, name: '盘亏', enabled: 1, sort: 1, remark: '' },
  { id: 11, pid: 4, name: '报废', enabled: 1, sort: 2, remark: '' },
  { id: 12, pid: 4, name: '损坏', enabled: 1, sort: 3, remark: '' },
  { id: 13, pid: 5, name: '质保维修', enabled: 1, sort: 1, remark: '' },
  { id: 14, pid: 5, name: '付费维修', enabled: 1, sort: 2, remark: '' },
  { id: 15, pid: 6, name: '磨损超限', enabled: 1, sort: 1, remark: '' },
  { id: 16, pid: 6, name: '断裂', enabled: 1, sort: 2, remark: '' },
  { id: 17, pid: 7, name: '硬质合金', enabled: 1, sort: 1, remark: '' },
  { id: 18, pid: 7, name: '高速钢', enabled: 1, sort: 2, remark: '' },
]

let types = seedTypes.map((t) => ({ ...t }))
let values = seedValues.map((v) => ({
  ...v,
  createdAt: '2026-09-15 10:00:00',
}))
let nextValueId = Math.max(...values.map((v) => v.id)) + 1

export async function mockGetDictTypeList() {
  await sleep()
  const rows = [...types].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
  return ok({
    list: rows.map((t) => ({
      id: t.id,
      label: t.name,
      name: t.name,
      code: t.code,
      dictType: t.code,
    })),
    total: rows.length,
  })
}

export async function mockGetDictValueList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    pid = '',
    name = '',
    enabled = '',
  } = params
  if (pid === '' || pid == null || Number(pid) === 0) {
    return ok({ list: [], total: 0, page: Number(page), pageSize: Number(pageSize) })
  }
  let rows = values.filter((r) => String(r.pid) === String(pid))
  if (name) rows = rows.filter((r) => r.name.includes(String(name).trim()))
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

export async function mockCreateDictValue(payload) {
  await sleep()
  if (!payload?.pid) return fail('请先选择字典')
  if (!payload?.name?.trim()) return fail('请输入字典值')
  const row = {
    id: nextValueId++,
    pid: Number(payload.pid),
    name: payload.name.trim(),
    enabled: payload.enabled === 0 ? 0 : 1,
    sort: Number(payload.sort) || 0,
    remark: payload.remark || '',
    createdAt: formatDate(new Date()),
  }
  values.unshift(row)
  return ok({ ...row })
}

export async function mockUpdateDictValue(id, payload) {
  await sleep()
  const idx = values.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('字典值不存在')
  values[idx] = {
    ...values[idx],
    ...payload,
    id: values[idx].id,
    pid: values[idx].pid,
    name: payload.name != null ? String(payload.name).trim() : values[idx].name,
  }
  return ok({ ...values[idx] })
}

export async function mockDeleteDictValue(id) {
  await sleep()
  const idx = values.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('字典值不存在')
  values.splice(idx, 1)
  return ok(true)
}

export async function mockBatchDeleteDictValue(ids = []) {
  await sleep()
  if (!ids.length) return fail('请选择字典值')
  const idSet = new Set(ids.map(String))
  values = values.filter((r) => !idSet.has(String(r.id)))
  return ok(true)
}

export async function mockBatchUpdateDictValue(ids = [], data = {}) {
  await sleep()
  if (!ids.length) return fail('请选择字典值')
  const idSet = new Set(ids.map(String))
  values = values.map((r) => (idSet.has(String(r.id)) ? { ...r, ...data } : r))
  return ok(true)
}
