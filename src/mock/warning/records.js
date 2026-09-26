import { ok, sleep } from '../config'

const now = '2026-09-26 10:00:00'

const stores = {
  stock: [
    {
      id: 1,
      materialName: '轴承 6205',
      code: 'RM-BRG-6205',
      stockName: '原材料仓',
      warningType: '低库存',
      currentNumber: 12,
      safeNumber: 50,
      diffNumber: -38,
      level: '高',
      updatedAt: now,
    },
    {
      id: 2,
      materialName: '主轴箱体',
      code: 'FG-SP-01',
      stockName: '成品仓',
      warningType: '高库存',
      currentNumber: 220,
      safeNumber: 80,
      diffNumber: 140,
      level: '中',
      updatedAt: now,
    },
  ],
  purchase: [
    {
      id: 1,
      billCode: 'PO-20260910001',
      supplierName: '华东五金批发',
      warningType: '交期逾期',
      arrivalDate: '2026-09-20',
      overdueDays: 6,
      level: '高',
      updatedAt: now,
    },
  ],
  sales: [
    {
      id: 1,
      billCode: 'SO-20260908003',
      customerName: '德科集团采购中心',
      warningType: '交期预警',
      deliveryDate: '2026-09-28',
      overdueDays: 0,
      level: '中',
      updatedAt: now,
    },
  ],
  production: [
    {
      id: 1,
      billCode: 'MO-20260910002',
      materialName: '液压站底板',
      warningType: '工序超时',
      planEndDate: '2026-09-22',
      overdueDays: 4,
      level: '高',
      updatedAt: now,
    },
  ],
  cash: [
    {
      id: 1,
      billCode: 'AR-20260820001',
      partnerName: 'ACME工业',
      warningType: '收款逾期',
      expireDate: '2026-09-15',
      amount: 28600,
      overdueDays: 11,
      level: '高',
      updatedAt: now,
    },
  ],
}

export async function getWarningList(key, params = {}) {
  await sleep()
  let rows = [...(stores[key] || [])]
  const kw = String(params.keyword || '').trim()
  if (kw) rows = rows.filter((r) => JSON.stringify(r).includes(kw))
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 10
  const start = (page - 1) * pageSize
  return ok({
    list: rows.slice(start, start + pageSize),
    total: rows.length,
    page,
    pageSize,
  })
}
