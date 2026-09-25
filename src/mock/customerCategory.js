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
    name: '经销商',
    code: 'CC-DIST',
    enabled: 1,
    sort: 10,
    remark: '区域经销、渠道分销',
    createdAt: '2026-09-20 09:20:11',
  },
  {
    id: 2,
    name: '终端客户',
    code: 'CC-END',
    enabled: 1,
    sort: 20,
    remark: '直接采购使用方',
    createdAt: '2026-09-20 09:21:05',
  },
  {
    id: 3,
    name: 'OEM 客户',
    code: 'CC-OEM',
    enabled: 1,
    sort: 30,
    remark: '代工贴牌合作',
    createdAt: '2026-09-18 14:10:22',
  },
  {
    id: 4,
    name: '外贸客户',
    code: 'CC-EXP',
    enabled: 1,
    sort: 40,
    remark: '海外出口订单',
    createdAt: '2026-09-15 11:30:00',
  },
  {
    id: 5,
    name: '战略大客户',
    code: 'CC-VIP',
    enabled: 1,
    sort: 5,
    remark: '重点维护、专属商务',
    createdAt: '2026-09-12 16:45:18',
  },
  {
    id: 6,
    name: '电商客户',
    code: 'CC-EC',
    enabled: 1,
    sort: 50,
    remark: '线上平台订单',
    createdAt: '2026-09-10 08:55:18',
  },
  {
    id: 7,
    name: '政府/事业单位',
    code: 'CC-GOV',
    enabled: 1,
    sort: 60,
    remark: '招投标类',
    createdAt: '2026-09-08 13:12:47',
  },
  {
    id: 8,
    name: '关联公司',
    code: 'CC-REL',
    enabled: 1,
    sort: 70,
    remark: '集团内部往来',
    createdAt: '2026-09-05 10:30:00',
  },
  {
    id: 9,
    name: '潜在客户',
    code: 'CC-LEAD',
    enabled: 1,
    sort: 80,
    remark: '线索转化中',
    createdAt: '2026-08-28 09:01:19',
  },
  {
    id: 10,
    name: '临时客户',
    code: 'CC-TMP',
    enabled: 0,
    sort: 999,
    remark: '一次性成交，已停用',
    createdAt: '2026-07-15 17:45:02',
  },
  {
    id: 11,
    name: '样机客户',
    code: 'CC-SAMPLE',
    enabled: 1,
    sort: 45,
    remark: '打样、试用',
    createdAt: '2026-09-01 11:11:11',
  },
  {
    id: 12,
    name: '售后服务客户',
    code: 'CC-AFTER',
    enabled: 1,
    sort: 55,
    remark: '仅售后维修往来',
    createdAt: '2026-08-20 15:20:30',
  },
]

let categories = seedCategories.map((item) => ({ ...item }))
let nextId = seedCategories.length + 1

export async function mockGetCustomerCategoryList(params = {}) {
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

export async function mockCreateCustomerCategory(payload) {
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

export async function mockUpdateCustomerCategory(id, payload) {
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

export async function mockDeleteCustomerCategory(id) {
  await sleep()
  const index = categories.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('分类不存在')
  categories.splice(index, 1)
  return ok(true, '删除成功')
}

export async function mockBatchDeleteCustomerCategory(ids = []) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要删除的分类')
  categories = categories.filter((item) => !idSet.has(item.id))
  return ok(true, '批量删除成功')
}

export async function mockBatchUpdateCustomerCategory(ids = [], payload = {}) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要操作的分类')
  categories = categories.map((item) =>
    idSet.has(item.id) ? { ...item, ...payload } : item,
  )
  return ok(true, '批量更新成功')
}
