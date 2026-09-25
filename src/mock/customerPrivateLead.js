import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const seedLeads = [
  {
    id: 1,
    categoryId: 2,
    name: '苏州精密传动有限公司',
    code: 'PRIV-2001',
    email: 'biz@szjd.example.com',
    fax: '0512-66882001',
    adminAddress: '江苏省 / 苏州市 / 相城区',
    detailAddress: '黄桥街道旺巷路66号',
    remark: '跟进中，下周样品确认',
    owner: '张伟',
    sort: 10,
    createdAt: '2026-09-22 09:20:11',
  },
  {
    id: 2,
    categoryId: 1,
    name: '上海华东机电经销处',
    code: 'PRIV-2002',
    email: 'hd@dealer.example.com',
    fax: '021-58882002',
    adminAddress: '上海市 / 闵行区',
    detailAddress: '莘庄工业区春东路88号',
    remark: '已报价，待合同',
    owner: '李娜',
    sort: 20,
    createdAt: '2026-09-21 11:05:40',
  },
  {
    id: 3,
    categoryId: 3,
    name: '宁波贴牌工贸',
    code: 'PRIV-2003',
    email: 'oem@nb.example.com',
    fax: '',
    adminAddress: '浙江省 / 宁波市 / 鄞州区',
    detailAddress: '中河街道创新路12号',
    remark: 'OEM 打样第三轮',
    owner: '王强',
    sort: 30,
    createdAt: '2026-09-20 15:33:08',
  },
  {
    id: 4,
    categoryId: 5,
    name: '德科集团采购中心',
    code: 'PRIV-2004',
    email: 'cg@deke.example.com',
    fax: '0769-88882004',
    adminAddress: '广东省 / 东莞市 / 松山湖',
    detailAddress: '科技产业园工业北路3号',
    remark: '战略客户，重点跟进',
    owner: '赵敏',
    sort: 5,
    createdAt: '2026-09-18 10:12:00',
  },
  {
    id: 5,
    categoryId: 4,
    name: 'Pacific Trade Co.',
    code: 'PRIV-2005',
    email: 'po@pacific.example.com',
    fax: '',
    adminAddress: '海外 / 新加坡',
    detailAddress: 'Marina Bay Financial Centre',
    remark: '英文报价已发',
    owner: '陈浩',
    sort: 40,
    createdAt: '2026-09-16 14:45:22',
  },
  {
    id: 6,
    categoryId: 6,
    name: '云仓优选旗舰店',
    code: 'PRIV-2006',
    email: 'yc@shop.example.com',
    fax: '',
    adminAddress: '浙江省 / 杭州市 / 余杭区',
    detailAddress: '仓前街道文一西路969号',
    remark: '电商补货节奏沟通中',
    owner: '刘洋',
    sort: 50,
    createdAt: '2026-09-14 08:30:15',
  },
  {
    id: 7,
    categoryId: 2,
    name: '无锡智控设备厂',
    code: 'PRIV-2007',
    email: 'wxzk@example.com',
    fax: '0510-88882007',
    adminAddress: '江苏省 / 无锡市 / 新吴区',
    detailAddress: '长江南路35号',
    remark: '',
    owner: '张伟',
    sort: 60,
    createdAt: '2026-09-12 16:18:44',
  },
  {
    id: 8,
    categoryId: 11,
    name: '样机客户-周工',
    code: 'PRIV-2008',
    email: 'zhou@trial.example.com',
    fax: '',
    adminAddress: '江苏省 / 常州市 / 武进区',
    detailAddress: '湖塘镇人民中路168号',
    remark: '试用反馈较好',
    owner: '李娜',
    sort: 70,
    createdAt: '2026-09-10 09:55:01',
  },
  {
    id: 9,
    categoryId: 7,
    name: '某高新区管委会设备科',
    code: 'PRIV-2009',
    email: 'equip@park.example.com',
    fax: '0512-66662009',
    adminAddress: '江苏省 / 苏州市 / 工业园区',
    detailAddress: '现代大道999号',
    remark: '招标准备材料中',
    owner: '王强',
    sort: 80,
    createdAt: '2026-09-08 13:20:30',
  },
  {
    id: 10,
    categoryId: 12,
    name: '售后返修-宏达机电',
    code: 'PRIV-2010',
    email: 'hdjx@example.com',
    fax: '0519-88882010',
    adminAddress: '江苏省 / 常州市 / 天宁区',
    detailAddress: '雕庄街道青洋北路88号',
    remark: '售后转销售机会评估',
    owner: '赵敏',
    sort: 90,
    createdAt: '2026-09-05 11:11:11',
  },
  {
    id: 11,
    categoryId: 9,
    name: '潜客-南通新材料',
    code: 'PRIV-2011',
    email: 'nt@mat.example.com',
    fax: '',
    adminAddress: '江苏省 / 南通市 / 崇川区',
    detailAddress: '人民中路128号',
    remark: '本周电话回访',
    owner: '陈浩',
    sort: 100,
    createdAt: '2026-09-01 17:40:12',
  },
  {
    id: 12,
    categoryId: 8,
    name: '关联公司-朋来贸易',
    code: 'PRIV-2012',
    email: 'trade@ponlay.example.com',
    fax: '',
    adminAddress: '河南省 / 郑州市 / 金水区',
    detailAddress: '农业东路商务内环路',
    remark: '内部往来线索',
    owner: '刘洋',
    sort: 110,
    createdAt: '2026-08-28 10:00:00',
  },
]

let leads = seedLeads.map((item) => ({ ...item }))
let nextId = seedLeads.length + 1

export async function mockGetPrivateLeadList(params = {}) {
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

export async function mockCreatePrivateLead(payload) {
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
    owner: payload.owner || '当前用户',
    sort: payload.sort ?? 0,
    createdAt: formatDate(new Date()),
  }
  leads.unshift(row)
  return ok(row, '创建成功')
}

export async function mockUpdatePrivateLead(id, payload) {
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

export async function mockDeletePrivateLead(id) {
  await sleep()
  const index = leads.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('线索不存在')
  leads.splice(index, 1)
  return ok(true, '删除成功')
}

export async function mockBatchDeletePrivateLead(ids = []) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要删除的线索')
  leads = leads.filter((item) => !idSet.has(item.id))
  return ok(true, '批量删除成功')
}

export async function mockBatchDealPrivateLead(ids = []) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要成交的线索')
  leads = leads.filter((item) => !idSet.has(item.id))
  return ok(true, '已标记成交并转出私海')
}

export async function mockBatchReleasePrivateLead(ids = []) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要释放的线索')
  leads = leads.filter((item) => !idSet.has(item.id))
  return ok(true, '已释放回公海')
}
