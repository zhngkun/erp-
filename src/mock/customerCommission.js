import { ok, sleep } from './config'

const summary = {
  commissionOne: 12680.5,
  commissionTwo: 4320.0,
  commissionTotal: 17000.5,
  commissionAvailable: 8600.0,
  commissionWithdrawing: 2000.0,
  commissionWithdrawn: 23400.0,
  commissionTotalCustomer: 34000.0,
  applyTotal: 15400.0,
  payTotal: 12900.0,
  unpayTotal: 2500.0,
  applyCancelTotal: 300.0,
  applyPassTotal: 15400.0,
  applyRefuseTotal: 460.0,
}

const saleDetailSeed = [
  {
    id: 1,
    billCode: 'SO-20260922001',
    billDate: '2026-09-22',
    customerName: '苏州精密传动有限公司',
    leaderName: '王强',
    leaderPhone: '13900002001',
    status: '已审核',
    commissionOne: 1280.5,
    commissionOneLeaderName: '王强',
    commissionTwo: 320.0,
    commissionTwoLeaderName: '张伟',
    commissionTotal: 1600.5,
  },
  {
    id: 2,
    billCode: 'SO-20260921002',
    billDate: '2026-09-21',
    customerName: '上海华东机电经销处',
    leaderName: '陈浩',
    leaderPhone: '13700002002',
    status: '已审核',
    commissionOne: 860.0,
    commissionOneLeaderName: '陈浩',
    commissionTwo: 0,
    commissionTwoLeaderName: '',
    commissionTotal: 860.0,
  },
  {
    id: 3,
    billCode: 'SO-20260920003',
    billDate: '2026-09-20',
    customerName: '德科集团采购中心',
    leaderName: '刘洋',
    leaderPhone: '13600002004',
    status: '已审核',
    commissionOne: 5600.0,
    commissionOneLeaderName: '刘洋',
    commissionTwo: 1400.0,
    commissionTwoLeaderName: '赵敏',
    commissionTotal: 7000.0,
  },
  {
    id: 4,
    billCode: 'SO-20260918004',
    billDate: '2026-09-18',
    customerName: '云仓优选旗舰店',
    leaderName: '周杰',
    leaderPhone: '13500002006',
    status: '已审核',
    commissionOne: 320.0,
    commissionOneLeaderName: '周杰',
    commissionTwo: 80.0,
    commissionTwoLeaderName: '张伟',
    commissionTotal: 400.0,
  },
  {
    id: 5,
    billCode: 'SO-20260915005',
    billDate: '2026-09-15',
    customerName: '宁波贴牌工贸',
    leaderName: '王强',
    leaderPhone: '13300002003',
    status: '待审核',
    commissionOne: 980.0,
    commissionOneLeaderName: '王强',
    commissionTwo: 245.0,
    commissionTwoLeaderName: '李娜',
    commissionTotal: 1225.0,
  },
]

const customerDetailSeed = [
  {
    id: 1,
    customerName: '苏州精密传动有限公司',
    leader: '王强',
    phone: '13900002001',
    deptName: '销售一部',
    adminName: '王强',
    commissionAvailable: 3200,
    commissionWithdrawing: 800,
    commissionWithdrawn: 5600,
    commissionTotal: 9600,
    remark: '',
  },
  {
    id: 2,
    customerName: '德科集团采购中心',
    leader: '刘洋',
    phone: '13600002004',
    deptName: '大客户部',
    adminName: '刘洋',
    commissionAvailable: 2800,
    commissionWithdrawing: 500,
    commissionWithdrawn: 12000,
    commissionTotal: 15300,
    remark: '战略客户',
  },
  {
    id: 3,
    customerName: '上海华东机电经销处',
    leader: '陈浩',
    phone: '13700002002',
    deptName: '销售二部',
    adminName: '陈浩',
    commissionAvailable: 1600,
    commissionWithdrawing: 400,
    commissionWithdrawn: 3200,
    commissionTotal: 5200,
    remark: '',
  },
  {
    id: 4,
    customerName: '云仓优选旗舰店',
    leader: '周杰',
    phone: '13500002006',
    deptName: '电商组',
    adminName: '周杰',
    commissionAvailable: 1000,
    commissionWithdrawing: 300,
    commissionWithdrawn: 2600,
    commissionTotal: 3900,
    remark: '',
  },
]

const withdrawDetailSeed = [
  {
    id: 1,
    customerName: '苏州精密传动有限公司',
    leaderName: '王强',
    leaderPhone: '13900002001',
    status: '审核通过',
    amount: 2000,
    payStatus: '已打款',
    createdAt: '2026-09-20 10:18:05',
  },
  {
    id: 2,
    customerName: '德科集团采购中心',
    leaderName: '刘洋',
    leaderPhone: '13600002004',
    status: '审核通过',
    amount: 5000,
    payStatus: '已打款',
    createdAt: '2026-09-18 14:05:11',
  },
  {
    id: 3,
    customerName: '上海华东机电经销处',
    leaderName: '陈浩',
    leaderPhone: '13700002002',
    status: '审核通过',
    amount: 800,
    payStatus: '未打款',
    createdAt: '2026-09-21 09:12:40',
  },
  {
    id: 4,
    customerName: '测试客户01',
    leaderName: '张伟',
    leaderPhone: '13800001101',
    status: '申请中',
    amount: 1200,
    payStatus: '未打款',
    createdAt: '2026-09-16 13:27:19',
  },
  {
    id: 5,
    customerName: '云仓优选旗舰店',
    leaderName: '周杰',
    leaderPhone: '13500002006',
    status: '审核拒绝',
    amount: 460,
    payStatus: '未打款',
    createdAt: '2026-09-18 08:40:00',
  },
  {
    id: 6,
    customerName: '宁波贴牌工贸',
    leaderName: '王强',
    leaderPhone: '13300002003',
    status: '已取消',
    amount: 300,
    payStatus: '未打款',
    createdAt: '2026-09-12 09:01:00',
  },
]

export async function mockGetCustomerCommissionSummary(params = {}) {
  await sleep()
  const { startDate = '', endDate = '' } = params
  return ok({
    ...summary,
    startDate: startDate || '',
    endDate: endDate || '',
  })
}

function paginate(rows, page, pageSize) {
  const total = rows.length
  const start = (Number(page) - 1) * Number(pageSize)
  return {
    list: rows.slice(start, start + Number(pageSize)),
    total,
    page: Number(page),
    pageSize: Number(pageSize),
  }
}

export async function mockGetCustomerCommissionSaleDetails(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    billCode = '',
    customerName = '',
    status = '',
  } = params
  let rows = [...saleDetailSeed]
  if (billCode) {
    rows = rows.filter((r) => r.billCode.includes(String(billCode).trim()))
  }
  if (customerName) {
    rows = rows.filter((r) => r.customerName.includes(String(customerName).trim()))
  }
  if (status) rows = rows.filter((r) => r.status === status)
  return ok(paginate(rows, page, pageSize))
}

export async function mockGetCustomerCommissionCustomerDetails(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    customerName = '',
    leader = '',
  } = params
  let rows = [...customerDetailSeed]
  if (customerName) {
    rows = rows.filter((r) => r.customerName.includes(String(customerName).trim()))
  }
  if (leader) {
    rows = rows.filter((r) => r.leader.includes(String(leader).trim()))
  }
  return ok(paginate(rows, page, pageSize))
}

export async function mockGetCustomerCommissionWithdrawDetails(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    customerName = '',
    leaderName = '',
    status = '',
    payStatus = '',
    metric = '',
  } = params
  let rows = [...withdrawDetailSeed]
  if (metric === 'payTotal') {
    rows = rows.filter((r) => r.payStatus === '已打款')
  } else if (metric === 'unpayTotal') {
    rows = rows.filter((r) => r.status === '审核通过' && r.payStatus === '未打款')
  } else if (metric === 'applyCancelTotal') {
    rows = rows.filter((r) => r.status === '已取消')
  } else if (metric === 'applyPassTotal') {
    rows = rows.filter((r) => r.status === '审核通过')
  } else if (metric === 'applyRefuseTotal') {
    rows = rows.filter((r) => r.status === '审核拒绝')
  }
  if (customerName) {
    rows = rows.filter((r) => r.customerName.includes(String(customerName).trim()))
  }
  if (leaderName) {
    rows = rows.filter((r) => r.leaderName.includes(String(leaderName).trim()))
  }
  if (status) rows = rows.filter((r) => r.status === status)
  if (payStatus) rows = rows.filter((r) => r.payStatus === payStatus)
  return ok(paginate(rows, page, pageSize))
}
