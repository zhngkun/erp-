import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const seedGroups = [
  { id: 1, name: '重量单位', enabled: 1, sort: 10, createdAt: '2026-09-10 09:00:00' },
  { id: 2, name: '长度单位', enabled: 1, sort: 20, createdAt: '2026-09-10 09:05:00' },
  { id: 3, name: '数量单位', enabled: 1, sort: 30, createdAt: '2026-09-10 09:10:00' },
  { id: 4, name: '包装单位', enabled: 1, sort: 40, createdAt: '2026-09-12 11:20:00' },
]

const seedUnits = [
  { id: 1, groupId: 1, name: '千克', proportion: 1, isMain: 1, enabled: 1, sort: 1 },
  { id: 2, groupId: 1, name: '克', proportion: 0.001, isMain: 0, enabled: 1, sort: 2 },
  { id: 3, groupId: 1, name: '吨', proportion: 1000, isMain: 0, enabled: 1, sort: 3 },
  { id: 4, groupId: 2, name: '米', proportion: 1, isMain: 1, enabled: 1, sort: 1 },
  { id: 5, groupId: 2, name: '厘米', proportion: 0.01, isMain: 0, enabled: 1, sort: 2 },
  { id: 6, groupId: 2, name: '毫米', proportion: 0.001, isMain: 0, enabled: 1, sort: 3 },
  { id: 7, groupId: 3, name: '个', proportion: 1, isMain: 1, enabled: 1, sort: 1 },
  { id: 8, groupId: 3, name: '打', proportion: 12, isMain: 0, enabled: 1, sort: 2 },
  { id: 9, groupId: 4, name: '箱', proportion: 1, isMain: 1, enabled: 1, sort: 1 },
  { id: 10, groupId: 4, name: '盒', proportion: 0.1, isMain: 0, enabled: 1, sort: 2 },
  { id: 11, groupId: 4, name: '件', proportion: 0.01, isMain: 0, enabled: 0, sort: 3 },
]

let groups = seedGroups.map((g) => ({ ...g }))
let units = seedUnits.map((u) => ({ ...u }))
let nextGroupId = groups.length + 1
let nextUnitId = units.length + 1

function buildResult(unit, groupUnits) {
  const main = groupUnits.find((u) => u.isMain === 1 && u.enabled === 1) || groupUnits[0]
  if (!main) return ''
  if (unit.isMain === 1) return `1 ${unit.name} = 1 ${unit.name}`
  const p = Number(unit.proportion) || 0
  return `1 ${unit.name} = ${p} ${main.name}`
}

export async function mockGetInventoryUnitGroupList(params = {}) {
  await sleep()
  const { name = '' } = params
  let rows = [...groups]
  if (name) rows = rows.filter((r) => r.name.includes(String(name).trim()))
  rows.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
  return ok({ list: rows, total: rows.length })
}

export async function mockCreateInventoryUnitGroup(payload) {
  await sleep()
  if (!payload?.name?.trim()) return fail('请输入单位组名称')
  const row = {
    id: nextGroupId++,
    name: payload.name.trim(),
    enabled: payload.enabled === 0 ? 0 : 1,
    sort: Number(payload.sort) || 0,
    createdAt: formatDate(new Date()),
  }
  groups.unshift(row)
  return ok({ ...row })
}

export async function mockUpdateInventoryUnitGroup(id, payload) {
  await sleep()
  const idx = groups.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('单位组不存在')
  groups[idx] = {
    ...groups[idx],
    ...payload,
    id: groups[idx].id,
    name: payload.name != null ? String(payload.name).trim() : groups[idx].name,
  }
  return ok({ ...groups[idx] })
}

export async function mockDeleteInventoryUnitGroup(id) {
  await sleep()
  const idx = groups.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('单位组不存在')
  const hasUnits = units.some((u) => String(u.groupId) === String(id))
  if (hasUnits) return fail('单位组下仍有子单位，无法删除')
  groups.splice(idx, 1)
  return ok(true)
}

export async function mockGetInventoryUnitList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    groupId = '',
    name = '',
    enabled = '',
  } = params
  let rows = [...units]
  if (groupId !== '' && groupId != null) {
    rows = rows.filter((r) => String(r.groupId) === String(groupId))
  }
  if (name) rows = rows.filter((r) => r.name.includes(String(name).trim()))
  if (enabled !== '' && enabled != null) {
    rows = rows.filter((r) => r.enabled === Number(enabled))
  }
  rows.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
  const groupUnitsMap = {}
  units.forEach((u) => {
    const key = String(u.groupId)
    if (!groupUnitsMap[key]) groupUnitsMap[key] = []
    groupUnitsMap[key].push(u)
  })
  const mapped = rows.map((r) => ({
    ...r,
    result: buildResult(r, groupUnitsMap[String(r.groupId)] || []),
  }))
  const total = mapped.length
  const start = (Number(page) - 1) * Number(pageSize)
  return ok({
    list: mapped.slice(start, start + Number(pageSize)),
    total,
    page: Number(page),
    pageSize: Number(pageSize),
  })
}

export async function mockCreateInventoryUnit(payload) {
  await sleep()
  if (!payload?.groupId) return fail('请选择单位组')
  if (!payload?.name?.trim()) return fail('请输入单位名称')
  const groupUnits = units.filter((u) => String(u.groupId) === String(payload.groupId))
  const isMain = payload.isMain === 1 ? 1 : 0
  if (isMain) {
    units = units.map((u) =>
      String(u.groupId) === String(payload.groupId) ? { ...u, isMain: 0 } : u,
    )
  } else if (!groupUnits.some((u) => u.isMain === 1)) {
    // 组内尚无主单位时，首个自动为主
  }
  const row = {
    id: nextUnitId++,
    groupId: Number(payload.groupId),
    name: payload.name.trim(),
    proportion: Number(payload.proportion) || 1,
    isMain: isMain || (groupUnits.length === 0 ? 1 : 0),
    enabled: payload.enabled === 0 ? 0 : 1,
    sort: Number(payload.sort) || 0,
  }
  units.unshift(row)
  return ok({ ...row })
}

export async function mockUpdateInventoryUnit(id, payload) {
  await sleep()
  const idx = units.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('单位不存在')
  const current = units[idx]
  if (payload.isMain === 1) {
    units = units.map((u) =>
      String(u.groupId) === String(current.groupId) ? { ...u, isMain: 0 } : u,
    )
  }
  units[idx] = {
    ...units[idx],
    ...payload,
    id: current.id,
    groupId: current.groupId,
    name: payload.name != null ? String(payload.name).trim() : current.name,
  }
  return ok({ ...units[idx] })
}

export async function mockDeleteInventoryUnit(id) {
  await sleep()
  const idx = units.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('单位不存在')
  units.splice(idx, 1)
  return ok(true)
}

export async function mockBatchDeleteInventoryUnit(ids = []) {
  await sleep()
  if (!ids.length) return fail('请选择单位')
  const idSet = new Set(ids.map(String))
  units = units.filter((r) => !idSet.has(String(r.id)))
  return ok(true)
}

export async function mockBatchUpdateInventoryUnit(ids = [], data = {}) {
  await sleep()
  if (!ids.length) return fail('请选择单位')
  const idSet = new Set(ids.map(String))
  units = units.map((r) => (idSet.has(String(r.id)) ? { ...r, ...data } : r))
  return ok(true)
}
