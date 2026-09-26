import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const seedPrices = [
  {
    id: 1,
    scope: '指定客户',
    customerName: '测试客户01',
    customerCode: '192418',
    categoryName: '',
    materialScope: '指定物料',
    materialCategory: '成品',
    materialName: '精密传动模组 A1',
    spec: '标准型',
    cover: '',
    materialCode: 'FG-TM-A1',
    customerMaterialName: '传动模组-客A',
    customerMaterialCode: 'C-TM-A1',
    priceType: '价格',
    salePrice: 1280.0,
    adjustRatio: 100,
    status: '已审核',
    remark: '年度协议价',
    createdAt: '2026-09-20 10:12:05',
  },
  {
    id: 2,
    scope: '指定客户',
    customerName: '测试客户02',
    customerCode: '993774',
    categoryName: '',
    materialScope: '指定物料',
    materialCategory: '成品',
    materialName: '精密传动模组 B2',
    spec: '加长型',
    cover: '',
    materialCode: 'FG-TM-B2',
    customerMaterialName: '传动模组-客B',
    customerMaterialCode: 'C-TM-B2',
    priceType: '价格',
    salePrice: 1560.0,
    adjustRatio: 100,
    status: '已保存',
    remark: '',
    createdAt: '2026-09-20 10:15:40',
  },
  {
    id: 3,
    scope: '指定客户',
    customerName: '苏州精密传动有限公司',
    customerCode: 'CUST-2001',
    categoryName: '经销商',
    materialScope: '指定物料',
    materialCategory: '原材料',
    materialName: '冷轧钢板 Q235',
    spec: '2.0×1250×C',
    cover: '',
    materialCode: 'RM-ST-0001',
    priceType: '价格',
    salePrice: 5200.0,
    adjustRatio: 100,
    status: '待审核',
    remark: '战略客户加价',
    createdAt: '2026-09-18 14:22:11',
  },
  {
    id: 4,
    scope: '客户分类',
    customerName: '',
    customerCode: '',
    categoryName: '外贸客户',
    materialScope: '物料分类',
    materialCategory: '成品',
    materialName: '',
    spec: '',
    cover: '',
    materialCode: '',
    priceType: '比例',
    salePrice: 0,
    adjustRatio: 108,
    status: '已审核',
    remark: '外贸统一上浮 8%',
    createdAt: '2026-09-15 09:40:00',
  },
  {
    id: 5,
    scope: '所有客户',
    customerName: '',
    customerCode: '',
    categoryName: '',
    materialScope: '所有物料',
    materialCategory: '',
    materialName: '',
    spec: '',
    cover: '',
    materialCode: '',
    priceType: '比例',
    salePrice: 0,
    adjustRatio: 100,
    status: '已审核',
    remark: '默认基准',
    createdAt: '2026-09-12 16:05:33',
  },
  {
    id: 6,
    scope: '指定客户',
    customerName: '德科集团采购中心',
    customerCode: 'CUST-2004',
    categoryName: '战略大客户',
    materialScope: '指定物料',
    materialCategory: '成品',
    materialName: '智能控制系统套件',
    spec: '标准版',
    cover: '',
    materialCode: 'FG-CTRL-01',
    priceType: '价格',
    salePrice: 26800.0,
    adjustRatio: 95,
    status: '审核拒绝',
    remark: '折扣方案需重报',
    createdAt: '2026-09-10 11:20:18',
  },
  {
    id: 7,
    scope: '指定客户',
    customerName: '上海华东机电经销处',
    customerCode: 'CUST-2002',
    categoryName: '终端客户',
    materialScope: '指定物料',
    materialCategory: '半成品',
    materialName: '机加壳体A',
    spec: 'CNC精加工',
    cover: '',
    materialCode: 'SF-HS-A01',
    priceType: '价格',
    salePrice: 88.5,
    adjustRatio: 100,
    status: '待审核',
    remark: '',
    createdAt: '2026-09-08 13:27:19',
  },
  {
    id: 8,
    scope: '未分类客户',
    customerName: '',
    customerCode: '',
    categoryName: '',
    materialScope: '指定物料',
    materialCategory: '辅料',
    materialName: '包装纸箱',
    spec: '60×40×40',
    cover: '',
    materialCode: 'PKG-BX-01',
    priceType: '价格',
    salePrice: 3.2,
    adjustRatio: 100,
    status: '已保存',
    remark: '',
    createdAt: '2026-09-05 08:55:01',
  },
  {
    id: 9,
    scope: '指定客户',
    customerName: 'Pacific Trade Co.',
    customerCode: 'CUST-2005',
    categoryName: '外贸客户',
    materialScope: '指定物料',
    materialCategory: '成品',
    materialName: '出口专用模组',
    spec: 'FOB',
    cover: '',
    materialCode: 'FG-EXP-01',
    priceType: '价格',
    salePrice: 980.0,
    adjustRatio: 100,
    status: '已审核',
    remark: 'USD 折算参考',
    createdAt: '2026-09-01 09:09:09',
  },
  {
    id: 10,
    scope: '指定客户',
    customerName: '云仓优选旗舰店',
    customerCode: 'CUST-2006',
    categoryName: '电商客户',
    materialScope: '物料分类',
    materialCategory: '成品',
    materialName: '',
    spec: '',
    cover: '',
    materialCode: '',
    priceType: '比例',
    salePrice: 0,
    adjustRatio: 92,
    status: '已审核',
    remark: '电商渠道折扣',
    createdAt: '2026-08-28 09:01:00',
  },
]

let prices = seedPrices.map((item) => ({ ...item }))
let nextId = seedPrices.length + 1

export async function mockGetCustomerPriceList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    scope = '',
    customerName = '',
    customerCode = '',
    materialName = '',
    materialCode = '',
    priceType = '',
    status = '',
  } = params

  let filtered = [...prices]
  if (scope) filtered = filtered.filter((item) => item.scope === scope)
  if (customerName) {
    filtered = filtered.filter((item) =>
      (item.customerName || '').includes(String(customerName).trim()),
    )
  }
  if (customerCode) {
    filtered = filtered.filter((item) =>
      (item.customerCode || '').includes(String(customerCode).trim()),
    )
  }
  if (materialName) {
    filtered = filtered.filter((item) =>
      (item.materialName || '').includes(String(materialName).trim()),
    )
  }
  if (materialCode) {
    filtered = filtered.filter((item) =>
      (item.materialCode || '').includes(String(materialCode).trim()),
    )
  }
  if (priceType) filtered = filtered.filter((item) => item.priceType === priceType)
  if (status) filtered = filtered.filter((item) => item.status === status)

  const total = filtered.length
  const start = (Number(page) - 1) * Number(pageSize)
  const list = filtered.slice(start, start + Number(pageSize))
  return ok({ list, total, page: Number(page), pageSize: Number(pageSize) })
}

export async function mockCreateCustomerPrice(payload) {
  await sleep()
  if (!payload?.scope) return fail('请选择作用范围')
  if (!payload?.priceType) return fail('请选择价格类型')
  const now = formatDate(new Date())
  const row = {
    id: nextId++,
    scope: payload.scope,
    customerName: payload.customerName || '',
    customerCode: payload.customerCode || '',
    categoryName: payload.categoryName || '',
    materialScope: payload.materialScope || '指定物料',
    materialCategory: payload.materialCategory || '',
    materialName: payload.materialName || '',
    spec: payload.spec || '',
    cover: payload.cover || '',
    materialCode: payload.materialCode || '',
    customerMaterialName: payload.customerMaterialName || '',
    customerMaterialCode: payload.customerMaterialCode || '',
    priceType: payload.priceType,
    salePrice: Number(payload.salePrice) || 0,
    adjustRatio: Number(payload.adjustRatio) || 100,
    status: payload.status || '已保存',
    remark: payload.remark || '',
    createdAt: now,
  }
  prices.unshift(row)
  return ok({ ...row })
}

export async function mockUpdateCustomerPrice(id, payload) {
  await sleep()
  const idx = prices.findIndex((item) => String(item.id) === String(id))
  if (idx < 0) return fail('记录不存在')
  const keys = Object.keys(payload || {})
  const statusOnly = keys.length === 1 && keys[0] === 'status'
  if (!statusOnly && !['已保存', '审核拒绝'].includes(prices[idx].status)) {
    return fail('当前状态不可编辑')
  }
  prices[idx] = { ...prices[idx], ...payload, id: prices[idx].id }
  return ok({ ...prices[idx] })
}

export async function mockDeleteCustomerPrice(id) {
  await sleep()
  const idx = prices.findIndex((item) => String(item.id) === String(id))
  if (idx < 0) return fail('记录不存在')
  if (!['已保存', '审核拒绝', '待审核'].includes(prices[idx].status)) {
    return fail('当前状态不可删除')
  }
  prices.splice(idx, 1)
  return ok(true)
}

export async function mockBatchDeleteCustomerPrice(ids = []) {
  await sleep()
  if (!ids.length) return fail('请选择记录')
  const idSet = new Set(ids.map(String))
  const blocked = prices.filter(
    (item) =>
      idSet.has(String(item.id)) &&
      !['已保存', '审核拒绝', '待审核'].includes(item.status),
  )
  if (blocked.length) return fail('存在不可删除的已审核记录')
  prices = prices.filter((item) => !idSet.has(String(item.id)))
  return ok(true)
}

export async function mockBatchUpdateCustomerPrice(ids = [], data = {}) {
  await sleep()
  if (!ids.length) return fail('请选择记录')
  const idSet = new Set(ids.map(String))
  prices = prices.map((item) => {
    if (!idSet.has(String(item.id))) return item
    return { ...item, ...data }
  })
  return ok(true)
}
