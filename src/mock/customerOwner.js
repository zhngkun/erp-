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
    customerName: '测试客户01',
    customerCode: '192418',
    leader: '张伟',
    phone: '13800001101',
    enabled: 1,
    email: 'zhangwei@example.com',
    sex: '男',
    status: '已审核',
    sourceType: '系统添加',
    isSeeGeneralLedger: 1,
    isCommissionManage: 1,
    isMySubordinate: 0,
    isCustomerAccount: 1,
    isCheckCompanyOrder: 0,
    deptName: '销售一部',
    adminName: '张伟',
    commissionAvailable: 1200,
    commissionWithdrawing: 0,
    commissionWithdrawn: 800,
    commissionTotal: 2000,
    remark: '',
    createdAt: '2026-09-22 10:18:05',
  },
  {
    id: 2,
    customerName: '测试客户02',
    customerCode: '993774',
    leader: '李娜',
    phone: '13800001102',
    enabled: 1,
    email: 'lina@example.com',
    sex: '女',
    status: '已保存',
    sourceType: '系统添加',
    isSeeGeneralLedger: 0,
    isCommissionManage: 0,
    isMySubordinate: 0,
    isCustomerAccount: 0,
    isCheckCompanyOrder: 0,
    deptName: '销售二部',
    adminName: '李娜',
    commissionAvailable: 0,
    commissionWithdrawing: 0,
    commissionWithdrawn: 0,
    commissionTotal: 0,
    remark: '待审核开通门户',
    createdAt: '2026-09-22 10:20:11',
  },
  {
    id: 3,
    customerName: '苏州精密传动有限公司',
    customerCode: 'CUST-2001',
    leader: '王强',
    phone: '13900002001',
    enabled: 1,
    email: 'wq@szjd.com',
    sex: '男',
    status: '已审核',
    sourceType: '系统添加',
    isSeeGeneralLedger: 1,
    isCommissionManage: 1,
    isMySubordinate: 1,
    isCustomerAccount: 1,
    isCheckCompanyOrder: 1,
    deptName: '销售一部',
    adminName: '王强',
    commissionAvailable: 8600,
    commissionWithdrawing: 2000,
    commissionWithdrawn: 15000,
    commissionTotal: 25600,
    remark: '主负责人',
    createdAt: '2026-09-20 09:30:12',
  },
  {
    id: 4,
    customerName: '苏州精密传动有限公司',
    customerCode: 'CUST-2001',
    leader: '赵敏',
    phone: '13900002011',
    enabled: 1,
    email: 'zm@szjd.com',
    sex: '女',
    status: '已审核',
    sourceType: '邀请注册',
    isSeeGeneralLedger: 1,
    isCommissionManage: 0,
    isMySubordinate: 0,
    isCustomerAccount: 1,
    isCheckCompanyOrder: 0,
    deptName: '大客户部',
    adminName: '赵敏',
    commissionAvailable: 500,
    commissionWithdrawing: 0,
    commissionWithdrawn: 1200,
    commissionTotal: 1700,
    remark: '协同负责人',
    createdAt: '2026-09-18 14:22:05',
  },
  {
    id: 5,
    customerName: '上海华东机电经销处',
    customerCode: 'CUST-2002',
    leader: '陈浩',
    phone: '13700002002',
    enabled: 1,
    email: 'chenhao@hdjd.com',
    sex: '男',
    status: '已审核',
    sourceType: '系统添加',
    isSeeGeneralLedger: 1,
    isCommissionManage: 1,
    isMySubordinate: 0,
    isCustomerAccount: 1,
    isCheckCompanyOrder: 0,
    deptName: '销售二部',
    adminName: '陈浩',
    commissionAvailable: 3200,
    commissionWithdrawing: 800,
    commissionWithdrawn: 5600,
    commissionTotal: 9600,
    remark: '',
    createdAt: '2026-09-15 11:08:40',
  },
  {
    id: 6,
    customerName: '德科集团采购中心',
    customerCode: 'CUST-2004',
    leader: '刘洋',
    phone: '13600002004',
    enabled: 1,
    email: 'liuyang@deke.com',
    sex: '男',
    status: '已审核',
    sourceType: '系统添加',
    isSeeGeneralLedger: 1,
    isCommissionManage: 1,
    isMySubordinate: 1,
    isCustomerAccount: 1,
    isCheckCompanyOrder: 1,
    deptName: '大客户部',
    adminName: '刘洋',
    commissionAvailable: 28000,
    commissionWithdrawing: 5000,
    commissionWithdrawn: 42000,
    commissionTotal: 75000,
    remark: '战略客户接口人',
    createdAt: '2026-09-12 16:40:11',
  },
  {
    id: 7,
    customerName: 'Pacific Trade Co.',
    customerCode: 'CUST-2005',
    leader: 'John Chen',
    phone: '+1-415-555-0105',
    enabled: 1,
    email: 'john@pacific-trade.com',
    sex: '男',
    status: '已保存',
    sourceType: '邀请注册',
    isSeeGeneralLedger: 0,
    isCommissionManage: 1,
    isMySubordinate: 0,
    isCustomerAccount: 0,
    isCheckCompanyOrder: 0,
    deptName: '外贸部',
    adminName: '陈浩',
    commissionAvailable: 0,
    commissionWithdrawing: 0,
    commissionWithdrawn: 0,
    commissionTotal: 0,
    remark: '待开通账单权限',
    createdAt: '2026-09-10 10:15:33',
  },
  {
    id: 8,
    customerName: '云仓优选旗舰店',
    customerCode: 'CUST-2006',
    leader: '周杰',
    phone: '13500002006',
    enabled: 0,
    email: 'zj@ycyx.com',
    sex: '男',
    status: '已审核',
    sourceType: '邀请注册',
    isSeeGeneralLedger: 0,
    isCommissionManage: 1,
    isMySubordinate: 0,
    isCustomerAccount: 1,
    isCheckCompanyOrder: 0,
    deptName: '电商组',
    adminName: '周杰',
    commissionAvailable: 460,
    commissionWithdrawing: 0,
    commissionWithdrawn: 2100,
    commissionTotal: 2560,
    remark: '已停用登录',
    createdAt: '2026-09-08 13:27:19',
  },
]

let list = seedList.map((item) => ({ ...item }))

export async function mockGetCustomerOwnerList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    customerName = '',
    leader = '',
    phone = '',
    status = '',
    sourceType = '',
    enabled = '',
  } = params

  let rows = [...list]
  if (customerName) {
    rows = rows.filter((r) => r.customerName.includes(String(customerName).trim()))
  }
  if (leader) {
    rows = rows.filter((r) => r.leader.includes(String(leader).trim()))
  }
  if (phone) {
    rows = rows.filter((r) => r.phone.includes(String(phone).trim()))
  }
  if (status) rows = rows.filter((r) => r.status === status)
  if (sourceType) rows = rows.filter((r) => r.sourceType === sourceType)
  if (enabled !== '' && enabled !== null && enabled !== undefined) {
    rows = rows.filter((r) => r.enabled === Number(enabled))
  }

  const total = rows.length
  const start = (Number(page) - 1) * Number(pageSize)
  return ok({
    list: rows.slice(start, start + Number(pageSize)),
    total,
    page: Number(page),
    pageSize: Number(pageSize),
  })
}

export async function mockUpdateCustomerOwner(id, payload) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('记录不存在')
  list[idx] = { ...list[idx], ...payload, id: list[idx].id }
  return ok({ ...list[idx] })
}

export async function mockDeleteCustomerOwner(id) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('记录不存在')
  list.splice(idx, 1)
  return ok(true)
}

export async function mockBatchDeleteCustomerOwner(ids = []) {
  await sleep()
  if (!ids.length) return fail('请选择记录')
  const idSet = new Set(ids.map(String))
  list = list.filter((r) => !idSet.has(String(r.id)))
  return ok(true)
}

export async function mockBatchUpdateCustomerOwner(ids = [], data = {}) {
  await sleep()
  if (!ids.length) return fail('请选择记录')
  const idSet = new Set(ids.map(String))
  list = list.map((r) => (idSet.has(String(r.id)) ? { ...r, ...data } : r))
  return ok(true)
}

export async function mockResetCustomerOwnerPassword(id) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('记录不存在')
  return ok({ resetAt: formatDate(new Date()) })
}
