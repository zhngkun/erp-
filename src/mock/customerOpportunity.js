import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function formatDay(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

const seedList = [
  {
    id: 1,
    billCode: 'SO-20260922001',
    billDate: '2026-09-22',
    customerName: '苏州精密传动有限公司',
    customerCode: 'PRIV-2001',
    status: '跟进中',
    creator: '张伟',
    dept: '销售一部',
    amount: 128000,
    remark: '产线改造项目',
    createdAt: '2026-09-22 09:30:12',
  },
  {
    id: 2,
    billCode: 'SO-20260921002',
    billDate: '2026-09-21',
    customerName: '上海华东机电经销处',
    customerCode: 'PRIV-2002',
    status: '已报价',
    creator: '李娜',
    dept: '销售二部',
    amount: 56000,
    remark: '季度备货',
    createdAt: '2026-09-21 11:08:40',
  },
  {
    id: 3,
    billCode: 'SO-20260920003',
    billDate: '2026-09-20',
    customerName: '德科集团采购中心',
    customerCode: 'PRIV-2004',
    status: '谈判中',
    creator: '赵敏',
    dept: '大客户部',
    amount: 860000,
    remark: '战略年框',
    createdAt: '2026-09-20 14:22:05',
  },
  {
    id: 4,
    billCode: 'SO-20260918004',
    billDate: '2026-09-18',
    customerName: 'Pacific Trade Co.',
    customerCode: 'PRIV-2005',
    status: '跟进中',
    creator: '陈浩',
    dept: '外贸部',
    amount: 230000,
    remark: 'FOB 询价',
    createdAt: '2026-09-18 16:40:11',
  },
  {
    id: 5,
    billCode: 'SO-20260916005',
    billDate: '2026-09-16',
    customerName: '云仓优选旗舰店',
    customerCode: 'PRIV-2006',
    status: '赢单',
    creator: '刘洋',
    dept: '电商组',
    amount: 32000,
    remark: '已转销售订单',
    createdAt: '2026-09-16 10:15:33',
  },
  {
    id: 6,
    billCode: 'SO-20260915006',
    billDate: '2026-09-15',
    customerName: '无锡智控设备厂',
    customerCode: 'PRIV-2007',
    status: '草稿',
    creator: '张伟',
    dept: '销售一部',
    amount: 0,
    remark: '',
    createdAt: '2026-09-15 09:01:00',
  },
  {
    id: 7,
    billCode: 'SO-20260912007',
    billDate: '2026-09-12',
    customerName: '宁波贴牌工贸',
    customerCode: 'PRIV-2003',
    status: '已报价',
    creator: '王强',
    dept: '销售二部',
    amount: 98000,
    remark: 'OEM 第三轮打样',
    createdAt: '2026-09-12 13:27:19',
  },
  {
    id: 8,
    billCode: 'SO-20260910008',
    billDate: '2026-09-10',
    customerName: '某高新区管委会设备科',
    customerCode: 'PRIV-2009',
    status: '谈判中',
    creator: '王强',
    dept: '大客户部',
    amount: 450000,
    remark: '招投标项目',
    createdAt: '2026-09-10 08:55:01',
  },
  {
    id: 9,
    billCode: 'SO-20260908009',
    billDate: '2026-09-08',
    customerName: '样机客户-周工',
    customerCode: 'PRIV-2008',
    status: '输单',
    creator: '李娜',
    dept: '销售一部',
    amount: 12000,
    remark: '预算不足终止',
    createdAt: '2026-09-08 17:40:12',
  },
  {
    id: 10,
    billCode: 'SO-20260905010',
    billDate: '2026-09-05',
    customerName: '潜客-南通新材料',
    customerCode: 'PRIV-2011',
    status: '跟进中',
    creator: '陈浩',
    dept: '销售二部',
    amount: 76000,
    remark: '',
    createdAt: '2026-09-05 11:11:11',
  },
  {
    id: 11,
    billCode: 'SO-20260901011',
    billDate: '2026-09-01',
    customerName: '苏州智造科技有限公司',
    customerCode: 'LEAD-1001',
    status: '已报价',
    creator: '张伟',
    dept: '销售一部',
    amount: 210000,
    remark: '公海转化',
    createdAt: '2026-09-01 09:09:09',
  },
  {
    id: 12,
    billCode: 'SO-20260828012',
    billDate: '2026-08-28',
    customerName: '关联公司-朋来贸易',
    customerCode: 'PRIV-2012',
    status: '赢单',
    creator: '刘洋',
    dept: '销售一部',
    amount: 54000,
    remark: '内部结算',
    createdAt: '2026-08-28 10:00:00',
  },
]

let list = seedList.map((item) => ({ ...item }))
let nextId = seedList.length + 1
let billSeq = 13

export async function mockGetOpportunityList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    billCode = '',
    customerName = '',
    status = '',
    creator = '',
    startDate = '',
    endDate = '',
  } = params

  let filtered = [...list]

  if (billCode) {
    filtered = filtered.filter((item) =>
      item.billCode.includes(String(billCode).trim()),
    )
  }
  if (customerName) {
    filtered = filtered.filter((item) =>
      item.customerName.includes(String(customerName).trim()),
    )
  }
  if (status) {
    filtered = filtered.filter((item) => item.status === status)
  }
  if (creator) {
    filtered = filtered.filter((item) =>
      item.creator.includes(String(creator).trim()),
    )
  }
  if (startDate) {
    filtered = filtered.filter((item) => item.billDate >= startDate)
  }
  if (endDate) {
    filtered = filtered.filter((item) => item.billDate <= endDate)
  }

  const total = filtered.length
  const start = (Number(page) - 1) * Number(pageSize)
  const pageList = filtered.slice(start, start + Number(pageSize))

  return ok({
    list: pageList,
    total,
    page: Number(page),
    pageSize: Number(pageSize),
  })
}

export async function mockCreateOpportunity(payload) {
  await sleep()
  if (!payload?.customerName) return fail('请填写客户')
  const today = formatDay(new Date())
  const row = {
    id: nextId++,
    billCode:
      payload.billCode ||
      `SO-${today.replace(/-/g, '')}${String(billSeq++).padStart(3, '0')}`,
    billDate: payload.billDate || today,
    customerName: payload.customerName,
    customerCode: payload.customerCode || '',
    status: payload.status || '草稿',
    creator: payload.creator || '当前用户',
    dept: payload.dept || '销售一部',
    amount: Number(payload.amount) || 0,
    remark: payload.remark || '',
    createdAt: formatDate(new Date()),
  }
  list.unshift(row)
  return ok(row, '创建成功')
}

export async function mockUpdateOpportunity(id, payload) {
  await sleep()
  const index = list.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('销售机会不存在')
  list[index] = {
    ...list[index],
    ...payload,
    id: list[index].id,
    billCode: list[index].billCode,
    amount:
      payload?.amount != null ? Number(payload.amount) : list[index].amount,
  }
  return ok(list[index], '更新成功')
}

export async function mockDeleteOpportunity(id) {
  await sleep()
  const index = list.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('销售机会不存在')
  list.splice(index, 1)
  return ok(true, '删除成功')
}

export async function mockBatchDeleteOpportunity(ids = []) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要删除的单据')
  list = list.filter((item) => !idSet.has(item.id))
  return ok(true, '批量删除成功')
}

export async function mockPushOpportunity(ids = [], target = '') {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要下推的单据')
  if (!target) return fail('请选择下推目标')
  const map = {
    eval: '机会评估',
    order: '销售订单',
  }
  return ok(true, `已下推至${map[target] || target}`)
}
