import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/** warehouseId 对齐仓库管理种子：1 成品仓 / 2 半成品仓 / 3 原材料仓 … */
const seedLocations = [
  {
    id: 1,
    warehouseId: 1,
    name: 'A-01-01',
    code: 'FG-A0101',
    enabled: 1,
    sort: 10,
    remark: '成品拣货区一层',
    createdAt: '2026-09-20 09:12:05',
  },
  {
    id: 2,
    warehouseId: 1,
    name: 'A-01-02',
    code: 'FG-A0102',
    enabled: 1,
    sort: 20,
    remark: '成品拣货区一层',
    createdAt: '2026-09-20 09:13:18',
  },
  {
    id: 3,
    warehouseId: 1,
    name: 'A-02-01',
    code: 'FG-A0201',
    enabled: 1,
    sort: 30,
    remark: '成品整托存储',
    createdAt: '2026-09-18 14:22:40',
  },
  {
    id: 4,
    warehouseId: 1,
    name: 'B-01-01',
    code: 'FG-B0101',
    enabled: 1,
    sort: 40,
    remark: '待发货暂存',
    createdAt: '2026-09-15 11:05:33',
  },
  {
    id: 5,
    warehouseId: 1,
    name: 'B-01-02',
    code: 'FG-B0102',
    enabled: 0,
    sort: 50,
    remark: '检修停用',
    createdAt: '2026-09-10 16:40:12',
  },
  {
    id: 6,
    warehouseId: 2,
    name: 'SF-01-01',
    code: 'SF-0101',
    enabled: 1,
    sort: 10,
    remark: '半成品周转货位',
    createdAt: '2026-09-22 08:30:00',
  },
  {
    id: 7,
    warehouseId: 2,
    name: 'SF-01-02',
    code: 'SF-0102',
    enabled: 1,
    sort: 20,
    remark: '半成品周转货位',
    createdAt: '2026-09-22 08:31:15',
  },
  {
    id: 8,
    warehouseId: 2,
    name: 'SF-02-01',
    code: 'SF-0201',
    enabled: 1,
    sort: 30,
    remark: '工序缓存区',
    createdAt: '2026-09-19 13:18:44',
  },
  {
    id: 9,
    warehouseId: 2,
    name: 'SF-03-01',
    code: 'SF-0301',
    enabled: 1,
    sort: 40,
    remark: '',
    createdAt: '2026-09-12 10:00:21',
  },
  {
    id: 10,
    warehouseId: 3,
    name: 'RM-A-01',
    code: 'RM-A01',
    enabled: 1,
    sort: 10,
    remark: '原材料收货区',
    createdAt: '2026-09-21 09:45:08',
  },
  {
    id: 11,
    warehouseId: 3,
    name: 'RM-A-02',
    code: 'RM-A02',
    enabled: 1,
    sort: 20,
    remark: '原材料收货区',
    createdAt: '2026-09-21 09:46:30',
  },
  {
    id: 12,
    warehouseId: 3,
    name: 'RM-B-01',
    code: 'RM-B01',
    enabled: 1,
    sort: 30,
    remark: '大宗原料托盘位',
    createdAt: '2026-09-16 15:20:55',
  },
  {
    id: 13,
    warehouseId: 3,
    name: 'RM-C-01',
    code: 'RM-C01',
    enabled: 1,
    sort: 40,
    remark: '小件料架',
    createdAt: '2026-09-08 11:11:11',
  },
  {
    id: 14,
    warehouseId: 3,
    name: 'RM-C-02',
    code: 'RM-C02',
    enabled: 0,
    sort: 50,
    remark: '待清理',
    createdAt: '2026-08-28 17:05:02',
  },
  {
    id: 15,
    warehouseId: 4,
    name: 'SC-01',
    code: 'SC-01',
    enabled: 1,
    sort: 10,
    remark: '废品隔离货位',
    createdAt: '2026-09-05 10:10:10',
  },
  {
    id: 16,
    warehouseId: 5,
    name: 'LB1-01',
    code: 'LB1-01',
    enabled: 1,
    sort: 10,
    remark: '一线线边货位',
    createdAt: '2026-09-14 12:00:00',
  },
  {
    id: 17,
    warehouseId: 5,
    name: 'LB1-02',
    code: 'LB1-02',
    enabled: 1,
    sort: 20,
    remark: '一线线边货位',
    createdAt: '2026-09-14 12:01:20',
  },
  {
    id: 18,
    warehouseId: 8,
    name: 'SP-01-01',
    code: 'SP-0101',
    enabled: 1,
    sort: 10,
    remark: '备件货架一层',
    createdAt: '2026-09-01 09:00:00',
  },
]

let locations = seedLocations.map((item) => ({ ...item }))
let nextId = seedLocations.length + 1

export async function mockGetLocationList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    warehouseId = '',
    name = '',
    code = '',
    enabled = '',
  } = params

  let filtered = [...locations]

  if (warehouseId !== '' && warehouseId !== null && warehouseId !== undefined) {
    filtered = filtered.filter(
      (item) => item.warehouseId === Number(warehouseId),
    )
  }
  if (name) {
    filtered = filtered.filter((item) =>
      item.name.includes(String(name).trim()),
    )
  }
  if (code) {
    filtered = filtered.filter((item) =>
      item.code.includes(String(code).trim()),
    )
  }
  if (enabled !== '' && enabled !== null && enabled !== undefined) {
    filtered = filtered.filter((item) => item.enabled === Number(enabled))
  }

  const total = filtered.length
  const start = (Number(page) - 1) * Number(pageSize)
  const list = filtered.slice(start, start + Number(pageSize))

  return ok({ list, total, page: Number(page), pageSize: Number(pageSize) })
}

export async function mockCreateLocation(payload) {
  await sleep()
  if (!payload?.name || !payload?.code) {
    return fail('货位名称和编码不能为空')
  }
  if (payload?.warehouseId == null || payload?.warehouseId === '') {
    return fail('请选择所属仓库')
  }
  if (locations.some((item) => item.code === payload.code)) {
    return fail('货位编码已存在')
  }
  const row = {
    id: nextId++,
    warehouseId: Number(payload.warehouseId),
    name: payload.name,
    code: payload.code,
    enabled: payload.enabled ?? 1,
    sort: payload.sort ?? 0,
    remark: payload.remark || '',
    createdAt: formatDate(new Date()),
  }
  locations.unshift(row)
  return ok(row, '创建成功')
}

export async function mockUpdateLocation(id, payload) {
  await sleep()
  const index = locations.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('货位不存在')
  if (
    payload?.code &&
    locations.some(
      (item) => item.code === payload.code && item.id !== Number(id),
    )
  ) {
    return fail('货位编码已存在')
  }
  locations[index] = {
    ...locations[index],
    ...payload,
    id: locations[index].id,
    warehouseId:
      payload?.warehouseId != null
        ? Number(payload.warehouseId)
        : locations[index].warehouseId,
  }
  return ok(locations[index], '更新成功')
}

export async function mockDeleteLocation(id) {
  await sleep()
  const index = locations.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('货位不存在')
  locations.splice(index, 1)
  return ok(true, '删除成功')
}

export async function mockBatchDeleteLocation(ids = []) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要删除的货位')
  locations = locations.filter((item) => !idSet.has(item.id))
  return ok(true, '批量删除成功')
}

export async function mockBatchUpdateLocation(ids = [], payload = {}) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要操作的货位')
  locations = locations.map((item) =>
    idSet.has(item.id) ? { ...item, ...payload } : item,
  )
  return ok(true, '批量更新成功')
}
