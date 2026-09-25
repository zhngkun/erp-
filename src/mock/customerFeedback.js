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
    feedbackType: '功能问题',
    status: '已提交',
    content: '门户下单后无法查看物流进度',
    imgs: [],
    acceptanceTime: '',
    handleTime: '',
    handleRemark: '',
    createdAt: '2026-09-22 10:18:05',
  },
  {
    id: 2,
    customerName: '上海华东机电经销处',
    customerCode: 'CUST-2002',
    leaderName: '陈浩',
    leaderPhone: '13700002002',
    feedbackType: '账号问题',
    status: '处理中',
    content: '负责人登录提示密码错误，已重置仍无法登录',
    imgs: ['https://via.placeholder.com/80'],
    acceptanceTime: '2026-09-21 11:20:00',
    handleTime: '',
    handleRemark: '',
    createdAt: '2026-09-21 09:12:40',
  },
  {
    id: 3,
    customerName: '德科集团采购中心',
    customerCode: 'CUST-2004',
    leaderName: '刘洋',
    leaderPhone: '13600002004',
    feedbackType: '操作问题',
    status: '已完成',
    content: '佣金提现入口找不到',
    imgs: [],
    acceptanceTime: '2026-09-20 10:00:00',
    handleTime: '2026-09-20 15:30:00',
    handleRemark: '已指引菜单路径并补充帮助文档',
    createdAt: '2026-09-20 08:40:11',
  },
  {
    id: 4,
    customerName: '云仓优选旗舰店',
    customerCode: 'CUST-2006',
    leaderName: '周杰',
    leaderPhone: '13500002006',
    feedbackType: 'Bug反馈',
    status: '已提交',
    content: 'H5 推荐码页面二维码偶尔不显示',
    imgs: ['https://via.placeholder.com/80', 'https://via.placeholder.com/80?2'],
    acceptanceTime: '',
    handleTime: '',
    handleRemark: '',
    createdAt: '2026-09-18 16:05:33',
  },
  {
    id: 5,
    customerName: '测试客户01',
    customerCode: '192418',
    leaderName: '张伟',
    leaderPhone: '13800001101',
    feedbackType: '其他',
    status: '已取消',
    content: '误提交，请忽略',
    imgs: [],
    acceptanceTime: '',
    handleTime: '',
    handleRemark: '',
    createdAt: '2026-09-16 13:27:19',
  },
  {
    id: 6,
    customerName: '宁波贴牌工贸',
    customerCode: 'CUST-2003',
    leaderName: '王强',
    leaderPhone: '13300002003',
    feedbackType: '功能问题',
    status: '处理中',
    content: '希望支持批量导出对账单',
    imgs: [],
    acceptanceTime: '2026-09-15 09:00:00',
    handleTime: '',
    handleRemark: '',
    createdAt: '2026-09-15 08:01:00',
  },
  {
    id: 7,
    customerName: 'Pacific Trade Co.',
    customerCode: 'CUST-2005',
    leaderName: 'John Chen',
    leaderPhone: '+1-415-555-0105',
    feedbackType: '操作问题',
    status: '已完成',
    content: '英文界面部分文案缺失',
    imgs: [],
    acceptanceTime: '2026-09-12 10:00:00',
    handleTime: '2026-09-12 18:20:00',
    handleRemark: '已补充英文文案并发布',
    createdAt: '2026-09-12 09:09:09',
  },
]

let list = seedList.map((item) => ({ ...item, imgs: [...(item.imgs || [])] }))

export async function mockGetCustomerFeedbackList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    customerName = '',
    leaderName = '',
    leaderPhone = '',
    feedbackType = '',
    status = '',
    content = '',
  } = params

  let rows = list.map((item) => ({ ...item, imgs: [...(item.imgs || [])] }))
  if (customerName) {
    rows = rows.filter((r) => r.customerName.includes(String(customerName).trim()))
  }
  if (leaderName) {
    rows = rows.filter((r) => r.leaderName.includes(String(leaderName).trim()))
  }
  if (leaderPhone) {
    rows = rows.filter((r) => r.leaderPhone.includes(String(leaderPhone).trim()))
  }
  if (feedbackType) rows = rows.filter((r) => r.feedbackType === feedbackType)
  if (status) rows = rows.filter((r) => r.status === status)
  if (content) {
    rows = rows.filter((r) => (r.content || '').includes(String(content).trim()))
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

export async function mockUpdateCustomerFeedback(id, payload) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('记录不存在')
  const now = formatDate(new Date())
  const next = { ...list[idx], ...payload, id: list[idx].id }
  if (payload.status === '处理中' && !next.acceptanceTime) {
    next.acceptanceTime = now
  }
  if (payload.status === '已完成' && !next.handleTime) {
    next.handleTime = now
  }
  list[idx] = next
  return ok({ ...list[idx], imgs: [...(list[idx].imgs || [])] })
}
