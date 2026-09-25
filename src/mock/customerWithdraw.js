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
    customerName: '苏州精密传动有限公司',
    customerCode: 'CUST-2001',
    leaderName: '王强',
    leaderPhone: '13900002001',
    status: '申请中',
    amount: 2000,
    withdrawType: '银行卡',
    bankName: '6222 **** **** 1001',
    paymentCode: '',
    verifyTime: '',
    verifyRemark: '',
    payStatus: '未打款',
    payTime: '',
    payRemark: '',
    remark: '',
    createdAt: '2026-09-22 10:18:05',
  },
  {
    id: 2,
    customerName: '上海华东机电经销处',
    customerCode: 'CUST-2002',
    leaderName: '陈浩',
    leaderPhone: '13700002002',
    status: '审核通过',
    amount: 800,
    withdrawType: '支付宝',
    bankName: '',
    paymentCode: 'https://via.placeholder.com/80',
    verifyTime: '2026-09-21 11:00:00',
    verifyRemark: '资料齐全',
    payStatus: '未打款',
    payTime: '',
    payRemark: '',
    remark: '',
    createdAt: '2026-09-21 09:12:40',
  },
  {
    id: 3,
    customerName: '德科集团采购中心',
    customerCode: 'CUST-2004',
    leaderName: '刘洋',
    leaderPhone: '13600002004',
    status: '审核通过',
    amount: 5000,
    withdrawType: '微信',
    bankName: '',
    paymentCode: 'https://via.placeholder.com/80',
    verifyTime: '2026-09-20 15:22:00',
    verifyRemark: '',
    payStatus: '已打款',
    payTime: '2026-09-20 16:10:00',
    payRemark: '已转账',
    remark: '',
    createdAt: '2026-09-20 14:05:11',
  },
  {
    id: 4,
    customerName: '云仓优选旗舰店',
    customerCode: 'CUST-2006',
    leaderName: '周杰',
    leaderPhone: '13500002006',
    status: '审核拒绝',
    amount: 460,
    withdrawType: '银行卡',
    bankName: '6222 **** **** 6688',
    paymentCode: '',
    verifyTime: '2026-09-18 10:00:00',
    verifyRemark: '账户信息不符',
    payStatus: '未打款',
    payTime: '',
    payRemark: '',
    remark: '',
    createdAt: '2026-09-18 08:40:00',
  },
  {
    id: 5,
    customerName: '测试客户01',
    customerCode: '192418',
    leaderName: '张伟',
    leaderPhone: '13800001101',
    status: '申请中',
    amount: 1200,
    withdrawType: '微信',
    bankName: '',
    paymentCode: 'https://via.placeholder.com/80',
    verifyTime: '',
    verifyRemark: '',
    payStatus: '未打款',
    payTime: '',
    payRemark: '',
    remark: '首笔提现',
    createdAt: '2026-09-16 13:27:19',
  },
  {
    id: 6,
    customerName: '宁波贴牌工贸',
    customerCode: 'CUST-2003',
    leaderName: '王强',
    leaderPhone: '13300002003',
    status: '已取消',
    amount: 300,
    withdrawType: '支付宝',
    bankName: '',
    paymentCode: '',
    verifyTime: '',
    verifyRemark: '',
    payStatus: '未打款',
    payTime: '',
    payRemark: '',
    remark: '申请人取消',
    createdAt: '2026-09-12 09:01:00',
  },
  {
    id: 7,
    customerName: 'Pacific Trade Co.',
    customerCode: 'CUST-2005',
    leaderName: 'John Chen',
    leaderPhone: '+1-415-555-0105',
    status: '审核通过',
    amount: 1500,
    withdrawType: '银行卡',
    bankName: '6222 **** **** 8899',
    paymentCode: '',
    verifyTime: '2026-09-10 12:00:00',
    verifyRemark: 'OK',
    payStatus: '已打款',
    payTime: '2026-09-10 14:30:00',
    payRemark: '跨境结汇',
    remark: '',
    createdAt: '2026-09-10 08:55:01',
  },
]

let list = seedList.map((item) => ({ ...item }))

export async function mockGetCustomerWithdrawList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    customerName = '',
    leaderName = '',
    leaderPhone = '',
    status = '',
    withdrawType = '',
    payStatus = '',
  } = params

  let rows = [...list]
  if (customerName) {
    rows = rows.filter((r) => r.customerName.includes(String(customerName).trim()))
  }
  if (leaderName) {
    rows = rows.filter((r) => r.leaderName.includes(String(leaderName).trim()))
  }
  if (leaderPhone) {
    rows = rows.filter((r) => r.leaderPhone.includes(String(leaderPhone).trim()))
  }
  if (status) rows = rows.filter((r) => r.status === status)
  if (withdrawType) rows = rows.filter((r) => r.withdrawType === withdrawType)
  if (payStatus) rows = rows.filter((r) => r.payStatus === payStatus)

  const total = rows.length
  const start = (Number(page) - 1) * Number(pageSize)
  return ok({
    list: rows.slice(start, start + Number(pageSize)),
    total,
    page: Number(page),
    pageSize: Number(pageSize),
  })
}

export async function mockUpdateCustomerWithdraw(id, payload) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('记录不存在')
  const next = { ...list[idx], ...payload, id: list[idx].id }
  if (payload.status === '审核通过' && !next.verifyTime) {
    next.verifyTime = formatDate(new Date())
  }
  if (payload.payStatus === '已打款' && !next.payTime) {
    next.payTime = formatDate(new Date())
  }
  list[idx] = next
  return ok({ ...list[idx] })
}

export async function mockBatchUpdateCustomerWithdraw(ids = [], data = {}) {
  await sleep()
  if (!ids.length) return fail('请选择记录')
  const idSet = new Set(ids.map(String))
  const now = formatDate(new Date())
  list = list.map((r) => {
    if (!idSet.has(String(r.id))) return r
    const next = { ...r, ...data }
    if (data.status === '审核通过' && !next.verifyTime) next.verifyTime = now
    if (data.payStatus === '已打款' && !next.payTime) next.payTime = now
    return next
  })
  return ok(true)
}
