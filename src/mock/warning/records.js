import { fail, ok, sleep } from '../config'

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

let rules = [
  {
    id: 1,
    name: '原材料低库存',
    module: 'stock',
    warningType: '低库存',
    threshold: 50,
    level: '高',
    enable: 1,
    remark: '当前库存低于安全库存',
  },
  {
    id: 2,
    name: '采购交期逾期',
    module: 'purchase',
    warningType: '交期逾期',
    threshold: 1,
    level: '高',
    enable: 1,
    remark: '超过交货日未入库',
  },
  {
    id: 3,
    name: '销售交期预警',
    module: 'sales',
    warningType: '交期预警',
    threshold: 3,
    level: '中',
    enable: 1,
    remark: '交货前 N 天提醒',
  },
]
let ruleSeq = 4

function paginate(rows, params = {}) {
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

export async function getWarningList(key, params = {}) {
  await sleep()
  let rows = [...(stores[key] || [])]
  const kw = String(params.keyword || '').trim()
  if (kw) rows = rows.filter((r) => JSON.stringify(r).includes(kw))
  return paginate(rows, params)
}

export async function getWarningRuleList(params = {}) {
  await sleep()
  let rows = [...rules]
  if (params.name) {
    rows = rows.filter((r) => String(r.name).includes(String(params.name).trim()))
  }
  if (params.module) {
    rows = rows.filter((r) => r.module === params.module)
  }
  return paginate(rows, params)
}

export async function createWarningRule(payload = {}) {
  await sleep()
  if (!payload.name) return fail('规则名称必填')
  const row = { id: ruleSeq++, enable: 1, level: '中', threshold: 0, ...payload }
  rules.unshift(row)
  return ok(row)
}

export async function updateWarningRule(id, payload = {}) {
  await sleep()
  const idx = rules.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('规则不存在')
  rules[idx] = { ...rules[idx], ...payload }
  return ok(rules[idx])
}

export async function removeWarningRule(id) {
  await sleep()
  rules = rules.filter((r) => String(r.id) !== String(id))
  return ok(true)
}

/** 按启用规则生成一条示例预警（mock） */
export async function generateWarnings() {
  await sleep()
  const enabled = rules.filter((r) => r.enable)
  let created = 0
  const stamp = new Date().toISOString().slice(0, 19).replace('T', ' ')
  for (const rule of enabled) {
    const list = stores[rule.module]
    if (!list) continue
    const exists = list.some((r) => r.warningType === rule.warningType && r._fromRule === rule.id)
    if (exists) continue
    const id = Math.max(0, ...list.map((r) => r.id)) + 1
    if (rule.module === 'stock') {
      list.unshift({
        id,
        materialName: `规则生成-${rule.name}`,
        code: `AUTO-${rule.id}`,
        stockName: '原材料仓',
        warningType: rule.warningType,
        currentNumber: Math.max(0, rule.threshold - 10),
        safeNumber: rule.threshold,
        diffNumber: -10,
        level: rule.level,
        updatedAt: stamp,
        _fromRule: rule.id,
      })
    } else if (rule.module === 'cash') {
      list.unshift({
        id,
        billCode: `AUTO-${Date.now().toString().slice(-6)}`,
        partnerName: '规则生成单位',
        warningType: rule.warningType,
        expireDate: stamp.slice(0, 10),
        amount: 1000,
        overdueDays: rule.threshold,
        level: rule.level,
        updatedAt: stamp,
        _fromRule: rule.id,
      })
    } else {
      list.unshift({
        id,
        billCode: `AUTO-${Date.now().toString().slice(-6)}`,
        supplierName: rule.module === 'purchase' ? '规则生成供应商' : undefined,
        customerName: rule.module === 'sales' ? '规则生成客户' : undefined,
        materialName: rule.module === 'production' ? '规则生成物料' : undefined,
        warningType: rule.warningType,
        arrivalDate: stamp.slice(0, 10),
        deliveryDate: stamp.slice(0, 10),
        planEndDate: stamp.slice(0, 10),
        overdueDays: rule.threshold,
        level: rule.level,
        updatedAt: stamp,
        _fromRule: rule.id,
      })
    }
    created++
  }
  return ok({ created })
}
