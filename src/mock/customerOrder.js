import { fail, ok, sleep } from './config'

/** 客户门户来源销售订单（P8 无独立客户订单页，按门户下单能力复刻） */
const seedList = [
  {
    id: 1,
    billCode: 'CO-20260922001',
    billDate: '2026-09-22',
    customerName: '测试客户01',
    customerCode: '192418',
    leaderName: '张伟',
    status: '待审核',
    amount: 12800,
    qty: 4,
    source: '客户门户',
    remark: 'H5 下单',
    createdAt: '2026-09-22 10:18:05',
  },
  {
    id: 2,
    billCode: 'CO-20260921002',
    billDate: '2026-09-21',
    customerName: '苏州精密传动有限公司',
    customerCode: 'CUST-2001',
    leaderName: '王强',
    status: '已审核',
    amount: 56000,
    qty: 10,
    source: '客户门户',
    remark: '',
    createdAt: '2026-09-21 14:20:33',
  },
  {
    id: 3,
    billCode: 'CO-20260920003',
    billDate: '2026-09-20',
    customerName: '上海华东机电经销处',
    customerCode: 'CUST-2002',
    leaderName: '陈浩',
    status: '已审核',
    amount: 8600,
    qty: 2,
    source: '客户门户',
    remark: '加急',
    createdAt: '2026-09-20 16:40:01',
  },
  {
    id: 4,
    billCode: 'CO-20260918004',
    billDate: '2026-09-18',
    customerName: '德科集团采购中心',
    customerCode: 'CUST-2004',
    leaderName: '刘洋',
    status: '已保存',
    amount: 128000,
    qty: 20,
    source: '客户门户',
    remark: '年框首单',
    createdAt: '2026-09-18 17:12:44',
  },
  {
    id: 5,
    billCode: 'CO-20260916005',
    billDate: '2026-09-16',
    customerName: '云仓优选旗舰店',
    customerCode: 'CUST-2006',
    leaderName: '周杰',
    status: '已审核',
    amount: 3200,
    qty: 16,
    source: '客户门户',
    remark: '',
    createdAt: '2026-09-16 11:08:09',
  },
  {
    id: 6,
    billCode: 'CO-20260915006',
    billDate: '2026-09-15',
    customerName: 'Pacific Trade Co.',
    customerCode: 'CUST-2005',
    leaderName: 'John Chen',
    status: '审核拒绝',
    amount: 9800,
    qty: 5,
    source: '客户门户',
    remark: '价格需重报',
    createdAt: '2026-09-15 09:33:27',
  },
  {
    id: 7,
    billCode: 'CO-20260912007',
    billDate: '2026-09-12',
    customerName: '宁波贴牌工贸',
    customerCode: 'CUST-2003',
    leaderName: '王强',
    status: '待审核',
    amount: 18600,
    qty: 8,
    source: '客户门户',
    remark: '',
    createdAt: '2026-09-12 15:01:55',
  },
  {
    id: 8,
    billCode: 'CO-20260910008',
    billDate: '2026-09-10',
    customerName: '测试客户02',
    customerCode: '993774',
    leaderName: '李娜',
    status: '已取消',
    amount: 1500,
    qty: 1,
    source: '客户门户',
    remark: '客户取消',
    createdAt: '2026-09-10 10:22:16',
  },
]

let list = seedList.map((item) => ({ ...item }))

export async function mockGetCustomerOrderList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    billCode = '',
    customerName = '',
    status = '',
    leaderName = '',
    startDate = '',
    endDate = '',
  } = params

  let rows = [...list]
  if (billCode) {
    rows = rows.filter((r) => r.billCode.includes(String(billCode).trim()))
  }
  if (customerName) {
    rows = rows.filter((r) => r.customerName.includes(String(customerName).trim()))
  }
  if (status) rows = rows.filter((r) => r.status === status)
  if (leaderName) {
    rows = rows.filter((r) => r.leaderName.includes(String(leaderName).trim()))
  }
  if (startDate) rows = rows.filter((r) => r.billDate >= startDate)
  if (endDate) rows = rows.filter((r) => r.billDate <= endDate)

  const total = rows.length
  const start = (Number(page) - 1) * Number(pageSize)
  return ok({
    list: rows.slice(start, start + Number(pageSize)),
    total,
    page: Number(page),
    pageSize: Number(pageSize),
  })
}

export async function mockUpdateCustomerOrder(id, payload) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('单据不存在')
  list[idx] = { ...list[idx], ...payload, id: list[idx].id }
  return ok({ ...list[idx] })
}

export async function mockDeleteCustomerOrder(id) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('单据不存在')
  if (!['已保存', '待审核', '审核拒绝'].includes(list[idx].status)) {
    return fail('当前状态不可删除')
  }
  list.splice(idx, 1)
  return ok(true)
}

export async function mockBatchDeleteCustomerOrder(ids = []) {
  await sleep()
  if (!ids.length) return fail('请选择单据')
  const idSet = new Set(ids.map(String))
  const blocked = list.filter(
    (r) =>
      idSet.has(String(r.id)) &&
      !['已保存', '待审核', '审核拒绝'].includes(r.status),
  )
  if (blocked.length) return fail('存在不可删除的已审核/已取消单据')
  list = list.filter((r) => !idSet.has(String(r.id)))
  return ok(true)
}

export async function mockBatchUpdateCustomerOrder(ids = [], data = {}) {
  await sleep()
  if (!ids.length) return fail('请选择单据')
  const idSet = new Set(ids.map(String))
  list = list.map((r) => (idSet.has(String(r.id)) ? { ...r, ...data } : r))
  return ok(true)
}
