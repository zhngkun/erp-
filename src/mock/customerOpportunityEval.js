import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const seedList = [
  {
    id: 1,
    billCode: 'OA-20260922001',
    billDate: '2026-09-22',
    sourceBillType: '销售机会',
    sourceBillCode: 'SO-20260922001',
    customerName: '苏州精密传动有限公司',
    customerCode: 'PRIV-2001',
    status: '待评估',
    creator: '张伟',
    dept: '销售一部',
    remark: '产线改造技术可行性',
    createdAt: '2026-09-22 10:05:18',
  },
  {
    id: 2,
    billCode: 'OA-20260921002',
    billDate: '2026-09-21',
    sourceBillType: '销售机会',
    sourceBillCode: 'SO-20260921002',
    customerName: '上海华东机电经销处',
    customerCode: 'PRIV-2002',
    status: '技术评估中',
    creator: '李娜',
    dept: '销售二部',
    remark: '交期与产能评估',
    createdAt: '2026-09-21 14:20:33',
  },
  {
    id: 3,
    billCode: 'OA-20260920003',
    billDate: '2026-09-20',
    sourceBillType: '销售机会',
    sourceBillCode: 'SO-20260920003',
    customerName: '德科集团采购中心',
    customerCode: 'PRIV-2004',
    status: '工期评估中',
    creator: '赵敏',
    dept: '大客户部',
    remark: '战略年框工期测算',
    createdAt: '2026-09-20 16:40:01',
  },
  {
    id: 4,
    billCode: 'OA-20260918004',
    billDate: '2026-09-18',
    sourceBillType: '销售机会',
    sourceBillCode: 'SO-20260918004',
    customerName: 'Pacific Trade Co.',
    customerCode: 'PRIV-2005',
    status: '评估完成',
    creator: '陈浩',
    dept: '外贸部',
    remark: 'FOB 方案已确认可行',
    createdAt: '2026-09-18 17:12:44',
  },
  {
    id: 5,
    billCode: 'OA-20260916005',
    billDate: '2026-09-16',
    sourceBillType: '销售机会',
    sourceBillCode: 'SO-20260916005',
    customerName: '云仓优选旗舰店',
    customerCode: 'PRIV-2006',
    status: '评估完成',
    creator: '刘洋',
    dept: '电商组',
    remark: '已转销售订单',
    createdAt: '2026-09-16 11:08:09',
  },
  {
    id: 6,
    billCode: 'OA-20260915006',
    billDate: '2026-09-15',
    sourceBillType: '销售机会',
    sourceBillCode: 'SO-20260912007',
    customerName: '宁波贴牌工贸',
    customerCode: 'PRIV-2003',
    status: '待评估',
    creator: '王强',
    dept: '销售二部',
    remark: 'OEM 打样评估',
    createdAt: '2026-09-15 09:33:27',
  },
  {
    id: 7,
    billCode: 'OA-20260912007',
    billDate: '2026-09-12',
    sourceBillType: '销售机会',
    sourceBillCode: 'SO-20260910008',
    customerName: '某高新区管委会设备科',
    customerCode: 'PRIV-2009',
    status: '技术评估中',
    creator: '王强',
    dept: '大客户部',
    remark: '招投标技术应答',
    createdAt: '2026-09-12 15:01:55',
  },
  {
    id: 8,
    billCode: 'OA-20260910008',
    billDate: '2026-09-10',
    sourceBillType: '销售机会',
    sourceBillCode: 'SO-20260915006',
    customerName: '无锡智控设备厂',
    customerCode: 'PRIV-2007',
    status: '工期评估中',
    creator: '张伟',
    dept: '销售一部',
    remark: '',
    createdAt: '2026-09-10 10:22:16',
  },
]

let list = seedList.map((item) => ({ ...item }))
let seq = list.length + 1

function clone(row) {
  return { ...row }
}

export async function mockGetOpportunityEvalList(params = {}) {
  await sleep()
  const {
    billCode = '',
    customerName = '',
    status = '',
    creator = '',
    remark = '',
    startDate = '',
    endDate = '',
    page = 1,
    pageSize = 10,
  } = params

  let rows = list.map(clone)
  if (billCode) {
    rows = rows.filter((r) => r.billCode.includes(String(billCode).trim()))
  }
  if (customerName) {
    rows = rows.filter((r) => r.customerName.includes(String(customerName).trim()))
  }
  if (status) {
    rows = rows.filter((r) => r.status === status)
  }
  if (creator) {
    rows = rows.filter((r) => r.creator.includes(String(creator).trim()))
  }
  if (remark) {
    rows = rows.filter((r) => (r.remark || '').includes(String(remark).trim()))
  }
  if (startDate) {
    rows = rows.filter((r) => r.billDate >= startDate)
  }
  if (endDate) {
    rows = rows.filter((r) => r.billDate <= endDate)
  }

  const total = rows.length
  const start = (Number(page) - 1) * Number(pageSize)
  const end = start + Number(pageSize)
  return ok({
    list: rows.slice(start, end),
    total,
    page: Number(page),
    pageSize: Number(pageSize),
  })
}

export async function mockUpdateOpportunityEval(id, data) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('单据不存在')
  if (list[idx].status === '评估完成') {
    return fail('评估完成的单据不可编辑')
  }
  list[idx] = {
    ...list[idx],
    billDate: data.billDate ?? list[idx].billDate,
    customerName: data.customerName ?? list[idx].customerName,
    customerCode: data.customerCode ?? list[idx].customerCode,
    status: data.status ?? list[idx].status,
    dept: data.dept ?? list[idx].dept,
    remark: data.remark ?? list[idx].remark,
  }
  return ok(clone(list[idx]))
}

export async function mockDeleteOpportunityEval(id) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('单据不存在')
  list.splice(idx, 1)
  return ok(true)
}

export async function mockBatchDeleteOpportunityEval(ids = []) {
  await sleep()
  if (!ids.length) return fail('请选择单据')
  const idSet = new Set(ids.map(String))
  list = list.filter((r) => !idSet.has(String(r.id)))
  return ok(true)
}

/** 供销售机会下推时追加评估单（可选） */
export function mockAppendOpportunityEval(payload) {
  const now = new Date()
  const row = {
    id: seq++,
    billCode: `OA-${formatDate(now).slice(0, 10).replace(/-/g, '')}${String(seq).padStart(3, '0')}`,
    billDate: formatDate(now).slice(0, 10),
    sourceBillType: '销售机会',
    sourceBillCode: payload.sourceBillCode || '',
    customerName: payload.customerName || '',
    customerCode: payload.customerCode || '',
    status: '待评估',
    creator: payload.creator || '当前用户',
    dept: payload.dept || '销售一部',
    remark: payload.remark || '',
    createdAt: formatDate(now),
  }
  list.unshift(row)
  return clone(row)
}
