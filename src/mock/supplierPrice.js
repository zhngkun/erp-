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
    scope: '指定供应商',
    supplierName: '测试供应商01',
    supplierCode: '192417',
    supplierCategory: '原材料供应商',
    inventoryScope: '指定存货',
    inventoryCategory: '原材料',
    inventoryName: '冷轧钢板 Q235',
    spec: '2.0×1250×C',
    cover: '',
    inventoryCode: 'RM-ST-0001',
    priceType: '含税采购价',
    purchasePrice: 4850.0,
    adjustRatio: 100,
    status: '启用',
    unit: '吨',
    taxRate: 13,
    enabled: 1,
    remark: '月结价',
    createdAt: '2026-09-20 10:12:05',
  },
  {
    id: 2,
    scope: '指定供应商',
    supplierName: '测试供应商01',
    supplierCode: '192417',
    supplierCategory: '原材料供应商',
    inventoryScope: '指定存货',
    inventoryCategory: '原材料',
    inventoryName: '铝合金型材 6063',
    spec: '40×40×2.0',
    cover: '',
    inventoryCode: 'RM-AL-0012',
    priceType: '含税采购价',
    purchasePrice: 22.8,
    adjustRatio: 100,
    status: '启用',
    unit: 'kg',
    taxRate: 13,
    enabled: 1,
    remark: '',
    createdAt: '2026-09-20 10:15:40',
  },
  {
    id: 3,
    scope: '指定供应商',
    supplierName: '测试供应商02',
    supplierCode: '656118',
    supplierCategory: '原材料供应商',
    inventoryScope: '指定存货',
    inventoryCategory: '电子元器件',
    inventoryName: '贴片电阻 0805',
    spec: '10KΩ ±1%',
    cover: '',
    inventoryCode: 'RM-EL-0805',
    priceType: '未税采购价',
    purchasePrice: 0.012,
    adjustRatio: 100,
    status: '启用',
    unit: '个',
    taxRate: 13,
    enabled: 1,
    remark: '整盘起订',
    createdAt: '2026-09-18 14:22:11',
  },
  {
    id: 4,
    scope: '指定供应商',
    supplierName: '精工外协厂',
    supplierCode: 'OUT-8801',
    supplierCategory: '外协加工',
    inventoryScope: '指定存货',
    inventoryCategory: '半成品',
    inventoryName: '机加壳体A',
    spec: 'CNC精加工',
    cover: '',
    inventoryCode: 'SF-HS-A01',
    priceType: '含税采购价',
    purchasePrice: 68.5,
    adjustRatio: 100,
    status: '启用',
    unit: '件',
    taxRate: 13,
    enabled: 1,
    remark: '含表面处理',
    createdAt: '2026-09-15 09:40:00',
  },
  {
    id: 5,
    scope: '指定供应商',
    supplierName: '华美包材',
    supplierCode: 'PKG-3310',
    supplierCategory: '包材供应商',
    inventoryScope: '指定存货',
    inventoryCategory: '包材',
    inventoryName: '五层纸箱',
    spec: '400×300×250',
    cover: '',
    inventoryCode: 'PK-BX-0403',
    priceType: '含税采购价',
    purchasePrice: 3.6,
    adjustRatio: 100,
    status: '启用',
    unit: '个',
    taxRate: 13,
    enabled: 1,
    remark: '',
    createdAt: '2026-09-12 16:05:33',
  },
  {
    id: 6,
    scope: '全部供应商',
    supplierName: '',
    supplierCode: '',
    supplierCategory: '',
    inventoryScope: '指定存货分类',
    inventoryCategory: '办公耗材',
    inventoryName: '',
    spec: '',
    cover: '',
    inventoryCode: '',
    priceType: '含税采购价',
    purchasePrice: 0,
    adjustRatio: 100,
    status: '停用',
    unit: '',
    taxRate: 13,
    enabled: 0,
    remark: '分类级默认价，待完善',
    createdAt: '2026-09-08 11:11:11',
  },
  {
    id: 7,
    scope: '指定供应商',
    supplierName: '质衡检测',
    supplierCode: 'QA-2201',
    supplierCategory: '检测认证',
    inventoryScope: '指定存货',
    inventoryCategory: '服务',
    inventoryName: '来料全检服务',
    spec: '按批次',
    cover: '',
    inventoryCode: 'SV-QC-001',
    priceType: '含税采购价',
    purchasePrice: 800,
    adjustRatio: 100,
    status: '启用',
    unit: '次',
    taxRate: 6,
    enabled: 1,
    remark: '',
    createdAt: '2026-09-05 08:30:22',
  },
  {
    id: 8,
    scope: '指定供应商',
    supplierName: '精密模具厂',
    supplierCode: 'MOLD-4412',
    supplierCategory: '模具供应商',
    inventoryScope: '指定存货',
    inventoryCategory: '模具',
    inventoryName: '注塑模具-端盖',
    spec: '1出2',
    cover: '',
    inventoryCode: 'MD-ZG-002',
    priceType: '含税采购价',
    purchasePrice: 28000,
    adjustRatio: 100,
    status: '启用',
    unit: '套',
    taxRate: 13,
    enabled: 1,
    remark: '含试模3次',
    createdAt: '2026-09-01 09:09:09',
  },
  {
    id: 9,
    scope: '指定供应商',
    supplierName: '顺达物流',
    supplierCode: 'LOG-5520',
    supplierCategory: '物流服务',
    inventoryScope: '指定存货',
    inventoryCategory: '服务',
    inventoryName: '城际干线运输',
    spec: '3吨车',
    cover: '',
    inventoryCode: 'SV-LG-003',
    priceType: '未税采购价',
    purchasePrice: 1200,
    adjustRatio: 100,
    status: '启用',
    unit: '趟',
    taxRate: 9,
    enabled: 1,
    remark: '',
    createdAt: '2026-08-28 13:45:09',
  },
  {
    id: 10,
    scope: '指定供应商',
    supplierName: '安华危化品',
    supplierCode: 'HAZ-6618',
    supplierCategory: '危化品供应商',
    inventoryScope: '指定存货',
    inventoryCategory: '危化品',
    inventoryName: '工业酒精',
    spec: '99.5% 200L',
    cover: '',
    inventoryCode: 'HZ-AL-200',
    priceType: '含税采购价',
    purchasePrice: 1680,
    adjustRatio: 100,
    status: '启用',
    unit: '桶',
    taxRate: 13,
    enabled: 1,
    remark: '需危化资质',
    createdAt: '2026-08-15 15:20:30',
  },
  {
    id: 11,
    scope: '指定供应商',
    supplierName: '云启软件',
    supplierCode: 'IT-9901',
    supplierCategory: 'IT 服务',
    inventoryScope: '指定存货',
    inventoryCategory: '服务',
    inventoryName: 'ERP运维年费',
    spec: '标准版',
    cover: '',
    inventoryCode: 'SV-IT-ERP',
    priceType: '含税采购价',
    purchasePrice: 36000,
    adjustRatio: 100,
    status: '启用',
    unit: '年',
    taxRate: 6,
    enabled: 1,
    remark: '',
    createdAt: '2026-08-10 10:00:00',
  },
  {
    id: 12,
    scope: '指定供应商',
    supplierName: '测试供应商02',
    supplierCode: '656118',
    supplierCategory: '原材料供应商',
    inventoryScope: '指定存货',
    inventoryCategory: '原材料',
    inventoryName: '螺丝 M4×12',
    spec: '不锈钢',
    cover: '',
    inventoryCode: 'RM-SC-M4',
    priceType: '含税采购价',
    purchasePrice: 0.08,
    adjustRatio: 100,
    status: '停用',
    unit: '个',
    taxRate: 13,
    enabled: 0,
    remark: '停用旧价',
    createdAt: '2026-07-20 17:40:12',
  },
]

let prices = seedPrices.map((item) => ({ ...item }))
let nextId = seedPrices.length + 1

export async function mockGetSupplierPriceList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    supplierName = '',
    supplierCode = '',
    inventoryName = '',
    inventoryCode = '',
    priceType = '',
    scope = '',
  } = params

  let filtered = [...prices]

  if (scope) {
    filtered = filtered.filter((item) => item.scope === scope)
  }
  if (supplierName) {
    filtered = filtered.filter((item) =>
      item.supplierName.includes(String(supplierName).trim()),
    )
  }
  if (supplierCode) {
    filtered = filtered.filter((item) =>
      item.supplierCode.includes(String(supplierCode).trim()),
    )
  }
  if (inventoryName) {
    filtered = filtered.filter((item) =>
      item.inventoryName.includes(String(inventoryName).trim()),
    )
  }
  if (inventoryCode) {
    filtered = filtered.filter((item) =>
      item.inventoryCode.includes(String(inventoryCode).trim()),
    )
  }
  if (priceType) {
    filtered = filtered.filter((item) => item.priceType === priceType)
  }

  const total = filtered.length
  const start = (Number(page) - 1) * Number(pageSize)
  const list = filtered.slice(start, start + Number(pageSize))

  return ok({ list, total, page: Number(page), pageSize: Number(pageSize) })
}

export async function mockCreateSupplierPrice(payload) {
  await sleep()
  if (!payload?.priceType) {
    return fail('请选择价格类型')
  }
  if (payload.purchasePrice == null || payload.purchasePrice === '') {
    return fail('请输入采购价')
  }
  const row = {
    id: nextId++,
    scope: payload.scope || '指定供应商',
    supplierName: payload.supplierName || '',
    supplierCode: payload.supplierCode || '',
    supplierCategory: payload.supplierCategory || '',
    inventoryScope: payload.inventoryScope || '指定存货',
    inventoryCategory: payload.inventoryCategory || '',
    inventoryName: payload.inventoryName || '',
    spec: payload.spec || '',
    cover: payload.cover || '',
    inventoryCode: payload.inventoryCode || '',
    priceType: payload.priceType,
    purchasePrice: Number(payload.purchasePrice) || 0,
    adjustRatio: payload.adjustRatio ?? 100,
    status: payload.status || '启用',
    unit: payload.unit || '',
    taxRate: payload.taxRate ?? 13,
    enabled: payload.enabled ?? 1,
    remark: payload.remark || '',
    createdAt: formatDate(new Date()),
  }
  prices.unshift(row)
  return ok(row, '创建成功')
}

export async function mockUpdateSupplierPrice(id, payload) {
  await sleep()
  const index = prices.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('价格记录不存在')
  prices[index] = {
    ...prices[index],
    ...payload,
    id: prices[index].id,
    purchasePrice:
      payload?.purchasePrice != null
        ? Number(payload.purchasePrice)
        : prices[index].purchasePrice,
  }
  return ok(prices[index], '更新成功')
}

export async function mockDeleteSupplierPrice(id) {
  await sleep()
  const index = prices.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('价格记录不存在')
  prices.splice(index, 1)
  return ok(true, '删除成功')
}

export async function mockBatchDeleteSupplierPrice(ids = []) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要删除的记录')
  prices = prices.filter((item) => !idSet.has(item.id))
  return ok(true, '批量删除成功')
}
