import { fail, ok, sleep } from '../config'
import { nowStr, paginate } from '../stock/_helpers'

const seedList = [
  {
    id: 1,
    name: '现金',
    code: 'CASH',
    paytypeType: '现金',
    subjectName: '库存现金',
    currencyName: '人民币',
    startBalance: 20000,
    income: 8500,
    expenditure: 3200,
    balance: 25300,
    priority: 1,
    enable: 1,
    remark: '备用金',
    createdAt: '2026-01-08 10:00:00',
  },
  {
    id: 2,
    name: '工商银行',
    code: 'ICBC',
    paytypeType: '银行',
    subjectName: '银行存款-工行',
    currencyName: '人民币',
    startBalance: 500000,
    income: 128600,
    expenditure: 86400,
    balance: 542200,
    priority: 2,
    enable: 1,
    remark: '基本户',
    createdAt: '2026-01-08 10:05:00',
  },
  {
    id: 3,
    name: '支付宝',
    code: 'ALIPAY',
    paytypeType: '第三方',
    subjectName: '其他货币资金',
    currencyName: '人民币',
    startBalance: 15000,
    income: 22600,
    expenditure: 9800,
    balance: 27800,
    priority: 3,
    enable: 1,
    remark: '',
    createdAt: '2026-02-12 14:20:00',
  },
  {
    id: 4,
    name: '微信',
    code: 'WECHAT',
    paytypeType: '第三方',
    subjectName: '其他货币资金',
    currencyName: '人民币',
    startBalance: 8000,
    income: 15600,
    expenditure: 4200,
    balance: 19400,
    priority: 4,
    enable: 1,
    remark: '',
    createdAt: '2026-02-12 14:22:00',
  },
  {
    id: 5,
    name: '建设银行(停用)',
    code: 'CCB',
    paytypeType: '银行',
    subjectName: '银行存款-建行',
    currencyName: '人民币',
    startBalance: 0,
    income: 0,
    expenditure: 0,
    balance: 0,
    priority: 99,
    enable: 0,
    remark: '已销户',
    createdAt: '2025-11-01 09:00:00',
  },
]

let list = seedList.map((i) => ({ ...i }))
let seq = Math.max(...list.map((i) => i.id)) + 1

export async function mockGetCashPaymentMethodList(params = {}) {
  await sleep()
  const { page = 1, pageSize = 10, name = '', code = '', enable = '' } = params
  let rows = [...list]
  if (name) rows = rows.filter((r) => r.name.includes(String(name).trim()))
  if (code) rows = rows.filter((r) => r.code.includes(String(code).trim()))
  if (enable !== '' && enable != null) {
    rows = rows.filter((r) => String(r.enable) === String(enable))
  }
  return ok(paginate(rows, page, pageSize))
}

export async function mockCreateCashPaymentMethod(payload = {}) {
  await sleep()
  const row = {
    startBalance: 0,
    income: 0,
    expenditure: 0,
    balance: Number(payload.startBalance || 0),
    priority: 10,
    enable: 1,
    remark: '',
    currencyName: '人民币',
    ...payload,
    id: seq++,
    createdAt: nowStr(),
  }
  list.unshift(row)
  return ok({ ...row })
}

export async function mockUpdateCashPaymentMethod(id, payload = {}) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('支付方式不存在')
  list[idx] = { ...list[idx], ...payload, id: list[idx].id }
  return ok({ ...list[idx] })
}

export async function mockDeleteCashPaymentMethod(id) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('支付方式不存在')
  list.splice(idx, 1)
  return ok(true)
}

export async function mockBatchDeleteCashPaymentMethod(ids = []) {
  await sleep()
  if (!ids.length) return fail('请选择数据')
  const idSet = new Set(ids.map(String))
  list = list.filter((r) => !idSet.has(String(r.id)))
  return ok(true)
}

export async function mockBatchUpdateCashPaymentMethod(ids = [], data = {}) {
  await sleep()
  if (!ids.length) return fail('请选择数据')
  const idSet = new Set(ids.map(String))
  list = list.map((r) => (idSet.has(String(r.id)) ? { ...r, ...data } : r))
  return ok(true)
}
