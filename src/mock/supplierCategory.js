import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const seedCategories = [
  {
    id: 1,
    name: '原材料供应商',
    code: 'SC-RAW',
    enabled: 1,
    sort: 10,
    remark: '钢材、塑料、电子元器件等',
    createdAt: '2026-09-20 09:15:22',
  },
  {
    id: 2,
    name: '外协加工',
    code: 'SC-OUT',
    enabled: 1,
    sort: 20,
    remark: '机加工、表面处理、热处理',
    createdAt: '2026-09-20 09:16:40',
  },
  {
    id: 3,
    name: '包材供应商',
    code: 'SC-PKG',
    enabled: 1,
    sort: 30,
    remark: '纸箱、标签、托盘、泡沫',
    createdAt: '2026-09-18 14:08:11',
  },
  {
    id: 4,
    name: '设备供应商',
    code: 'SC-EQP',
    enabled: 1,
    sort: 40,
    remark: '生产设备、工装夹具',
    createdAt: '2026-09-15 11:22:05',
  },
  {
    id: 5,
    name: '物流服务',
    code: 'SC-LOG',
    enabled: 1,
    sort: 50,
    remark: '干线运输、仓配一体',
    createdAt: '2026-09-12 16:40:33',
  },
  {
    id: 6,
    name: '办公耗材',
    code: 'SC-OFF',
    enabled: 1,
    sort: 60,
    remark: '文具、打印耗材',
    createdAt: '2026-09-10 08:55:18',
  },
  {
    id: 7,
    name: '劳务外包',
    code: 'SC-LAB',
    enabled: 1,
    sort: 70,
    remark: '临时用工、项目外包',
    createdAt: '2026-09-08 13:12:47',
  },
  {
    id: 8,
    name: '检测认证',
    code: 'SC-QA',
    enabled: 1,
    sort: 80,
    remark: '第三方检测、体系认证',
    createdAt: '2026-09-05 10:30:00',
  },
  {
    id: 9,
    name: 'IT 服务',
    code: 'SC-IT',
    enabled: 1,
    sort: 90,
    remark: '软件、运维、云服务',
    createdAt: '2026-08-28 09:01:19',
  },
  {
    id: 10,
    name: '临时供应商',
    code: 'SC-TMP',
    enabled: 0,
    sort: 999,
    remark: '一次性采购，已停用',
    createdAt: '2026-07-15 17:45:02',
  },
  {
    id: 11,
    name: '模具供应商',
    code: 'SC-MOLD',
    enabled: 1,
    sort: 35,
    remark: '注塑模具、冲压模具',
    createdAt: '2026-09-01 11:11:11',
  },
  {
    id: 12,
    name: '危化品供应商',
    code: 'SC-HAZ',
    enabled: 1,
    sort: 45,
    remark: '需资质备案',
    createdAt: '2026-08-20 15:20:30',
  },
]

let categories = seedCategories.map((item) => ({ ...item }))
let nextId = seedCategories.length + 1

export async function mockGetSupplierCategoryList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    name = '',
    code = '',
    enabled = '',
  } = params

  let filtered = [...categories]

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

export async function mockCreateSupplierCategory(payload) {
  await sleep()
  if (!payload?.name || !payload?.code) {
    return fail('分类名称和编码不能为空')
  }
  if (categories.some((item) => item.code === payload.code)) {
    return fail('分类编码已存在')
  }
  const row = {
    id: nextId++,
    name: payload.name,
    code: payload.code,
    enabled: payload.enabled ?? 1,
    sort: payload.sort ?? 0,
    remark: payload.remark || '',
    createdAt: formatDate(new Date()),
  }
  categories.unshift(row)
  return ok(row, '创建成功')
}

export async function mockUpdateSupplierCategory(id, payload) {
  await sleep()
  const index = categories.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('分类不存在')
  if (
    payload?.code &&
    categories.some(
      (item) => item.code === payload.code && item.id !== Number(id),
    )
  ) {
    return fail('分类编码已存在')
  }
  categories[index] = {
    ...categories[index],
    ...payload,
    id: categories[index].id,
  }
  return ok(categories[index], '更新成功')
}

export async function mockDeleteSupplierCategory(id) {
  await sleep()
  const index = categories.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('分类不存在')
  categories.splice(index, 1)
  return ok(true, '删除成功')
}

export async function mockBatchDeleteSupplierCategory(ids = []) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要删除的分类')
  categories = categories.filter((item) => !idSet.has(item.id))
  return ok(true, '批量删除成功')
}

export async function mockBatchUpdateSupplierCategory(ids = [], payload = {}) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要操作的分类')
  categories = categories.map((item) =>
    idSet.has(item.id) ? { ...item, ...payload } : item,
  )
  return ok(true, '批量更新成功')
}
