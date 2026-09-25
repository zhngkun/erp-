import { fail, ok, sleep } from './config'
import {
  collectCategoryIds,
  getInventoryCategoryFlat,
} from './inventoryCategory'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export const BUSINESS_TYPES = [
  { value: 'sale', label: '销售' },
  { value: 'purchase', label: '采购' },
  { value: 'production', label: '生产' },
  { value: 'outsource', label: '委外' },
  { value: 'consumables', label: '耗材' },
  { value: 'stock', label: '库存' },
]

const seedList = [
  {
    id: 1,
    name: '冷轧钢板 Q235',
    cover: '',
    mnemonicCode: 'LZGBQ235',
    categoryId: 8,
    categoryName: '金属材料',
    brandId: 5,
    brandName: '自有品牌',
    types: ['purchase', 'stock'],
    unitName: '千克',
    enabled: 1,
    enableSerialNumber: 0,
    enableBatchNumber: 1,
    supplyCycle: 7,
    productionCycle: 0,
    remark: '常用板材',
    sort: 10,
    org: '总部',
    createdAt: '2026-09-20 09:20:11',
  },
  {
    id: 2,
    name: '铝合金型材 6063',
    cover: '',
    mnemonicCode: 'LHJXC6063',
    categoryId: 8,
    categoryName: '金属材料',
    brandId: 5,
    brandName: '自有品牌',
    types: ['purchase', 'stock'],
    unitName: '米',
    enabled: 1,
    enableSerialNumber: 0,
    enableBatchNumber: 1,
    supplyCycle: 10,
    productionCycle: 0,
    remark: '',
    sort: 20,
    org: '总部',
    createdAt: '2026-09-19 11:10:00',
  },
  {
    id: 3,
    name: '机加壳体A',
    cover: '',
    mnemonicCode: 'JJKTA',
    categoryId: 11,
    categoryName: '机加件',
    brandId: 5,
    brandName: '自有品牌',
    types: ['production', 'stock'],
    unitName: '个',
    enabled: 1,
    enableSerialNumber: 1,
    enableBatchNumber: 0,
    supplyCycle: 0,
    productionCycle: 3,
    remark: '机加自制',
    sort: 30,
    org: '制造中心',
    createdAt: '2026-09-18 14:10:22',
  },
  {
    id: 4,
    name: '智能控制器 V2',
    cover: '',
    mnemonicCode: 'ZNKZQV2',
    categoryId: 12,
    categoryName: '整机',
    brandId: 1,
    brandName: '西门子',
    types: ['sale', 'production', 'stock'],
    unitName: '台',
    enabled: 1,
    enableSerialNumber: 1,
    enableBatchNumber: 1,
    supplyCycle: 0,
    productionCycle: 5,
    remark: '主销产品',
    sort: 5,
    org: '总部',
    createdAt: '2026-09-15 11:30:00',
  },
  {
    id: 5,
    name: '贴片电阻 0805',
    cover: '',
    mnemonicCode: 'TPDZ0805',
    categoryId: 10,
    categoryName: '被动元件',
    brandId: 4,
    brandName: '欧姆龙',
    types: ['purchase', 'consumables', 'stock'],
    unitName: '个',
    enabled: 1,
    enableSerialNumber: 0,
    enableBatchNumber: 0,
    supplyCycle: 5,
    productionCycle: 0,
    remark: '',
    sort: 40,
    org: '供应链',
    createdAt: '2026-09-12 16:45:18',
  },
  {
    id: 6,
    name: '五层纸箱',
    cover: '',
    mnemonicCode: 'WCZX',
    categoryId: 6,
    categoryName: '包装材料',
    brandId: 6,
    brandName: '杂牌/无品牌',
    types: ['purchase', 'consumables'],
    unitName: '个',
    enabled: 1,
    enableSerialNumber: 0,
    enableBatchNumber: 0,
    supplyCycle: 3,
    productionCycle: 0,
    remark: '外箱',
    sort: 50,
    org: '供应链',
    createdAt: '2026-09-10 08:55:18',
  },
  {
    id: 7,
    name: '委外喷涂件',
    cover: '',
    mnemonicCode: 'WWPTJ',
    categoryId: 11,
    categoryName: '机加件',
    brandId: 5,
    brandName: '自有品牌',
    types: ['outsource', 'stock'],
    unitName: '件',
    enabled: 0,
    enableSerialNumber: 0,
    enableBatchNumber: 1,
    supplyCycle: 14,
    productionCycle: 0,
    remark: '停用待评估',
    sort: 60,
    org: '制造中心',
    createdAt: '2026-08-28 09:01:19',
  },
]

let list = seedList.map((item) => ({ ...item, types: [...item.types] }))
let nextId = list.length + 1

export async function mockGetInventoryList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    name = '',
    mnemonicCode = '',
    categoryId = '',
    brandId = '',
    enabled = '',
    remark = '',
    type = '',
  } = params
  let rows = [...list]
  if (name) rows = rows.filter((r) => r.name.includes(String(name).trim()))
  if (mnemonicCode) {
    rows = rows.filter((r) =>
      r.mnemonicCode.includes(String(mnemonicCode).trim().toUpperCase()),
    )
  }
  if (categoryId !== '' && categoryId != null) {
    const ids = collectCategoryIds(categoryId, getInventoryCategoryFlat()).map(String)
    rows = rows.filter((r) => ids.includes(String(r.categoryId)))
  }
  if (brandId !== '' && brandId != null) {
    rows = rows.filter((r) => String(r.brandId) === String(brandId))
  }
  if (enabled !== '' && enabled != null) {
    rows = rows.filter((r) => r.enabled === Number(enabled))
  }
  if (remark) rows = rows.filter((r) => (r.remark || '').includes(String(remark).trim()))
  if (type) {
    rows = rows.filter((r) => (r.types || []).includes(String(type)))
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

export async function mockCreateInventory(payload) {
  await sleep()
  if (!payload?.name?.trim()) return fail('请输入存货名称')
  const row = {
    id: nextId++,
    name: payload.name.trim(),
    cover: payload.cover || '',
    mnemonicCode: (payload.mnemonicCode || '').trim().toUpperCase(),
    categoryId: payload.categoryId || null,
    categoryName: payload.categoryName || '',
    brandId: payload.brandId || null,
    brandName: payload.brandName || '',
    types: Array.isArray(payload.types) ? payload.types : [],
    unitName: payload.unitName || '个',
    enabled: payload.enabled === 0 ? 0 : 1,
    enableSerialNumber: payload.enableSerialNumber === 1 ? 1 : 0,
    enableBatchNumber: payload.enableBatchNumber === 1 ? 1 : 0,
    supplyCycle: Number(payload.supplyCycle) || 0,
    productionCycle: Number(payload.productionCycle) || 0,
    remark: payload.remark || '',
    sort: Number(payload.sort) || 0,
    org: payload.org || '总部',
    createdAt: formatDate(new Date()),
  }
  list.unshift(row)
  return ok({ ...row })
}

export async function mockUpdateInventory(id, payload) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('存货不存在')
  list[idx] = {
    ...list[idx],
    ...payload,
    id: list[idx].id,
    name: payload.name != null ? String(payload.name).trim() : list[idx].name,
    mnemonicCode:
      payload.mnemonicCode != null
        ? String(payload.mnemonicCode).trim().toUpperCase()
        : list[idx].mnemonicCode,
    types: Array.isArray(payload.types) ? payload.types : list[idx].types,
  }
  return ok({ ...list[idx] })
}

export async function mockDeleteInventory(id) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('存货不存在')
  list.splice(idx, 1)
  return ok(true)
}

export async function mockBatchDeleteInventory(ids = []) {
  await sleep()
  if (!ids.length) return fail('请选择存货')
  const idSet = new Set(ids.map(String))
  list = list.filter((r) => !idSet.has(String(r.id)))
  return ok(true)
}

export async function mockBatchUpdateInventory(ids = [], data = {}) {
  await sleep()
  if (!ids.length) return fail('请选择存货')
  const idSet = new Set(ids.map(String))
  list = list.map((r) => (idSet.has(String(r.id)) ? { ...r, ...data } : r))
  return ok(true)
}
