import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/** categoryId 对齐客户分类种子 */
const seedLeads = [
  {
    id: 1,
    categoryId: 9,
    name: '苏州智造科技有限公司',
    code: 'LEAD-1001',
    email: 'contact@szzm.example.com',
    fax: '0512-88881001',
    adminAddress: '江苏省 / 苏州市 / 工业园区',
    detailAddress: '星湖街328号创意产业园A座',
    remark: '展会获取，关注自动化产线',
    sort: 10,
    createdAt: '2026-09-22 10:15:20',
  },
  {
    id: 2,
    categoryId: 9,
    name: '杭州云启贸易',
    code: 'LEAD-1002',
    email: 'biz@hzqy.example.com',
    fax: '',
    adminAddress: '浙江省 / 杭州市 / 西湖区',
    detailAddress: '文三路478号华星时代广场',
    remark: '官网留资',
    sort: 20,
    createdAt: '2026-09-21 14:32:08',
  },
  {
    id: 3,
    categoryId: 1,
    name: '华东经销商-未转化',
    code: 'LEAD-1003',
    email: 'east@dist.example.com',
    fax: '021-66662003',
    adminAddress: '上海市 / 浦东新区',
    detailAddress: '张江高科技园区祖冲之路2288号',
    remark: '意向经销华东区域',
    sort: 30,
    createdAt: '2026-09-20 09:08:44',
  },
  {
    id: 4,
    categoryId: 4,
    name: 'Global Parts Ltd',
    code: 'LEAD-1004',
    email: 'sales@globalparts.example.com',
    fax: '+1-408-555-0104',
    adminAddress: '海外 / 美国 / 加州',
    detailAddress: 'San Jose, CA',
    remark: '询盘 OEM 配套件',
    sort: 40,
    createdAt: '2026-09-18 16:40:11',
  },
  {
    id: 5,
    categoryId: 2,
    name: '南京精密设备厂',
    code: 'LEAD-1005',
    email: 'nj@precision.example.com',
    fax: '025-83331005',
    adminAddress: '江苏省 / 南京市 / 江宁区',
    detailAddress: '科学园天元东路188号',
    remark: '',
    sort: 50,
    createdAt: '2026-09-15 11:22:33',
  },
  {
    id: 6,
    categoryId: 6,
    name: '橙果电商供应链',
    code: 'LEAD-1006',
    email: 'cg@ecom.example.com',
    fax: '',
    adminAddress: '广东省 / 广州市 / 天河区',
    detailAddress: '珠江新城华强路1号',
    remark: '线上渠道补货需求',
    sort: 60,
    createdAt: '2026-09-12 08:55:01',
  },
  {
    id: 7,
    categoryId: 3,
    name: '昆山模塑贴牌部',
    code: 'LEAD-1007',
    email: 'oem@ksms.example.com',
    fax: '0512-57771007',
    adminAddress: '江苏省 / 苏州市 / 昆山市',
    detailAddress: '开发区前进东路888号',
    remark: '打样询价中',
    sort: 70,
    createdAt: '2026-09-10 13:18:50',
  },
  {
    id: 8,
    categoryId: 7,
    name: '某市市政采购中心',
    code: 'LEAD-1008',
    email: 'cgzx@gov.example.com',
    fax: '0512-66661008',
    adminAddress: '江苏省 / 苏州市 / 姑苏区',
    detailAddress: '三香路998号',
    remark: '待招标公告',
    sort: 80,
    createdAt: '2026-09-08 10:00:00',
  },
  {
    id: 9,
    categoryId: 9,
    name: '无锡新材料研究所',
    code: 'LEAD-1009',
    email: 'wx@lab.example.com',
    fax: '',
    adminAddress: '江苏省 / 无锡市 / 滨湖区',
    detailAddress: '菱湖大道200号大学科技园',
    remark: '科研样件',
    sort: 90,
    createdAt: '2026-09-05 15:27:19',
  },
  {
    id: 10,
    categoryId: 11,
    name: '样机试用-陈工',
    code: 'LEAD-1010',
    email: 'chen@trial.example.com',
    fax: '',
    adminAddress: '浙江省 / 宁波市 / 鄞州区',
    detailAddress: '中河街道创新路66号',
    remark: '个人试用线索',
    sort: 100,
    createdAt: '2026-09-01 09:09:09',
  },
  {
    id: 11,
    categoryId: 5,
    name: '战略意向-德科集团',
    code: 'LEAD-1011',
    email: 'bd@deke.example.com',
    fax: '0769-88881111',
    adminAddress: '广东省 / 东莞市 / 松山湖',
    detailAddress: '科技产业园区工业北路3号',
    remark: '年框意向，待商务跟进',
    sort: 5,
    createdAt: '2026-08-28 17:45:02',
  },
  {
    id: 12,
    categoryId: 9,
    name: '常州智能装备有限公司',
    code: 'LEAD-1012',
    email: 'cz@smart.example.com',
    fax: '0519-88881212',
    adminAddress: '江苏省 / 常州市 / 新北区',
    detailAddress: '黄河西路168号',
    remark: '',
    sort: 110,
    createdAt: '2026-08-20 11:11:11',
  },
]

let leads = seedLeads.map((item) => ({ ...item }))
let nextId = seedLeads.length + 1

export async function mockGetPublicLeadList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    categoryId = '',
    name = '',
    code = '',
  } = params

  let filtered = [...leads]

  if (categoryId !== '' && categoryId !== null && categoryId !== undefined) {
    filtered = filtered.filter(
      (item) => item.categoryId === Number(categoryId),
    )
  }
  if (name) {
    filtered = filtered.filter((item) =>
      item.name.includes(String(name).trim()),
    )
  }
  if (code) {
    filtered = filtered.filter((item) =>
      item.code.includes(String(code).trim()),
    )
  }

  const total = filtered.length
  const start = (Number(page) - 1) * Number(pageSize)
  const list = filtered.slice(start, start + Number(pageSize))

  return ok({ list, total, page: Number(page), pageSize: Number(pageSize) })
}

export async function mockCreatePublicLead(payload) {
  await sleep()
  if (!payload?.name || !payload?.code) {
    return fail('客户名称和编码不能为空')
  }
  if (leads.some((item) => item.code === payload.code)) {
    return fail('客户编码已存在')
  }
  const row = {
    id: nextId++,
    categoryId: payload.categoryId ?? null,
    name: payload.name,
    code: payload.code,
    email: payload.email || '',
    fax: payload.fax || '',
    adminAddress: payload.adminAddress || '',
    detailAddress: payload.detailAddress || '',
    remark: payload.remark || '',
    sort: payload.sort ?? 0,
    createdAt: formatDate(new Date()),
  }
  leads.unshift(row)
  return ok(row, '创建成功')
}

export async function mockUpdatePublicLead(id, payload) {
  await sleep()
  const index = leads.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('线索不存在')
  if (
    payload?.code &&
    leads.some((item) => item.code === payload.code && item.id !== Number(id))
  ) {
    return fail('客户编码已存在')
  }
  leads[index] = { ...leads[index], ...payload, id: leads[index].id }
  return ok(leads[index], '更新成功')
}

export async function mockDeletePublicLead(id) {
  await sleep()
  const index = leads.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('线索不存在')
  leads.splice(index, 1)
  return ok(true, '删除成功')
}

export async function mockBatchDeletePublicLead(ids = []) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要删除的线索')
  leads = leads.filter((item) => !idSet.has(item.id))
  return ok(true, '批量删除成功')
}

export async function mockBatchClaimPublicLead(ids = []) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要领取的线索')
  // 领取后移出公海（模拟转入私海）
  leads = leads.filter((item) => !idSet.has(item.id))
  return ok(true, '批量领取成功，已转入私海')
}

export async function mockBatchAssignPublicLead(ids = [], payload = {}) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要分配的线索')
  if (!payload?.assignee) return fail('请指定负责人')
  leads = leads.filter((item) => !idSet.has(item.id))
  return ok(true, `已分配给 ${payload.assignee}`)
}
