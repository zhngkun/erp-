import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/** categoryId 对齐客户分类种子：1 经销商 / 2 终端客户 …；null 表示未分类 */
const seedCustomers = [
  {
    id: 1,
    categoryId: null,
    name: '测试客户02',
    code: '993774',
    leaderNum: 0,
    customerType: '企业',
    org: '',
    sourceType: '系统添加',
    email: '',
    enabled: 1,
    openingReceivable: 0,
    openingReceivableBalance: 0,
    receivableAmount: 0,
    receivedAmount: 0,
    endingReceivable: 0,
    contact: '张三',
    phone: '13800001002',
    address: '江苏省苏州市工业园区星湖街200号',
    lastPickupDate: '2026-09-20',
    remark: '',
    createdAt: '2026-09-22 10:18:05',
  },
  {
    id: 2,
    categoryId: null,
    name: '测试客户01',
    code: '192418',
    leaderNum: 0,
    customerType: '企业',
    org: '',
    sourceType: '系统添加',
    email: '',
    enabled: 1,
    openingReceivable: 0,
    openingReceivableBalance: 0,
    receivableAmount: 0,
    receivedAmount: 0,
    endingReceivable: 0,
    contact: '李四',
    phone: '13800001001',
    address: '江苏省苏州市相城区黄桥街道旺巷路8号',
    lastPickupDate: '2026-09-18',
    remark: '',
    createdAt: '2026-09-22 10:15:40',
  },
  {
    id: 3,
    categoryId: 1,
    name: '苏州精密传动有限公司',
    code: 'CUST-2001',
    leaderNum: 2,
    customerType: '企业',
    org: '总部',
    sourceType: '系统添加',
    email: 'contact@szjd.com',
    enabled: 1,
    openingReceivable: 50000,
    openingReceivableBalance: 32000,
    receivableAmount: 128000,
    receivedAmount: 96000,
    endingReceivable: 32000,
    contact: '王强',
    phone: '13900002001',
    address: '江苏省苏州市吴中区越溪街道北官渡路66号',
    lastPickupDate: '2026-09-21',
    remark: '产线改造重点客户',
    createdAt: '2026-09-20 09:30:12',
  },
  {
    id: 4,
    categoryId: 2,
    name: '上海华东机电经销处',
    code: 'CUST-2002',
    leaderNum: 1,
    customerType: '企业',
    org: '华东区',
    sourceType: '系统添加',
    email: 'hdjd@example.com',
    enabled: 1,
    openingReceivable: 12000,
    openingReceivableBalance: 8000,
    receivableAmount: 56000,
    receivedAmount: 48000,
    endingReceivable: 8000,
    contact: '李娜',
    phone: '13700002002',
    address: '上海市嘉定区马陆镇嘉戬公路88号',
    lastPickupDate: '2026-09-10',
    remark: '季度备货',
    createdAt: '2026-09-18 11:08:40',
  },
  {
    id: 5,
    categoryId: 5,
    name: '德科集团采购中心',
    code: 'CUST-2004',
    leaderNum: 3,
    customerType: '企业',
    org: '大客户部',
    sourceType: '系统添加',
    email: 'purchase@deke.com',
    enabled: 1,
    openingReceivable: 200000,
    openingReceivableBalance: 180000,
    receivableAmount: 860000,
    receivedAmount: 680000,
    endingReceivable: 180000,
    contact: '赵敏',
    phone: '13600002004',
    address: '浙江省杭州市滨江区网商路599号',
    lastPickupDate: '2026-09-22',
    remark: '战略年框',
    createdAt: '2026-09-15 14:22:05',
  },
  {
    id: 6,
    categoryId: 4,
    name: 'Pacific Trade Co.',
    code: 'CUST-2005',
    leaderNum: 1,
    customerType: '企业',
    org: '外贸部',
    sourceType: '邀请注册',
    email: 'buyer@pacific-trade.com',
    enabled: 1,
    openingReceivable: 0,
    openingReceivableBalance: 0,
    receivableAmount: 230000,
    receivedAmount: 100000,
    endingReceivable: 130000,
    contact: 'John Chen',
    phone: '+1-415-555-0105',
    address: 'San Francisco, CA',
    lastPickupDate: '2026-08-28',
    remark: 'FOB 询价客户',
    createdAt: '2026-09-12 16:40:11',
  },
  {
    id: 7,
    categoryId: 6,
    name: '云仓优选旗舰店',
    code: 'CUST-2006',
    leaderNum: 1,
    customerType: '个人',
    org: '电商组',
    sourceType: '邀请注册',
    email: 'ycyx@shop.com',
    enabled: 1,
    openingReceivable: 0,
    openingReceivableBalance: 0,
    receivableAmount: 32000,
    receivedAmount: 32000,
    endingReceivable: 0,
    contact: '刘洋',
    phone: '13500002006',
    address: '广州市天河区科韵路16号',
    lastPickupDate: '2026-09-16',
    remark: '线上旗舰',
    createdAt: '2026-09-10 10:15:33',
  },
  {
    id: 8,
    categoryId: 3,
    name: '宁波贴牌工贸',
    code: 'CUST-2003',
    leaderNum: 2,
    customerType: '企业',
    org: '销售二部',
    sourceType: '系统添加',
    email: 'oem@nbtrade.com',
    enabled: 1,
    openingReceivable: 8000,
    openingReceivableBalance: 5000,
    receivableAmount: 98000,
    receivedAmount: 93000,
    endingReceivable: 5000,
    contact: '王强',
    phone: '13300002003',
    address: '浙江省宁波市鄞州区中河街道',
    lastPickupDate: '2026-07-01',
    remark: 'OEM 打样',
    createdAt: '2026-09-08 13:27:19',
  },
  {
    id: 9,
    categoryId: 7,
    name: '某高新区管委会设备科',
    code: 'CUST-2009',
    leaderNum: 1,
    customerType: '企业',
    org: '大客户部',
    sourceType: '系统添加',
    email: '',
    enabled: 1,
    openingReceivable: 0,
    openingReceivableBalance: 0,
    receivableAmount: 450000,
    receivedAmount: 0,
    endingReceivable: 450000,
    contact: '办事员',
    phone: '0512-88880009',
    address: '苏州市高新区狮山路8号',
    lastPickupDate: '',
    remark: '招投标项目',
    createdAt: '2026-09-05 08:55:01',
  },
  {
    id: 10,
    categoryId: 9,
    name: '无锡智控设备厂',
    code: 'CUST-2007',
    leaderNum: 0,
    customerType: '企业',
    org: '销售一部',
    sourceType: '系统添加',
    email: 'wxzk@example.com',
    enabled: 0,
    openingReceivable: 0,
    openingReceivableBalance: 0,
    receivableAmount: 0,
    receivedAmount: 0,
    endingReceivable: 0,
    contact: '陈浩',
    phone: '13200002007',
    address: '江苏省无锡市新吴区梅村街道',
    lastPickupDate: '2026-06-15',
    remark: '潜在转正中',
    createdAt: '2026-08-28 09:01:00',
  },
]

/** 补齐与线上列表对齐的扩展字段默认值 */
function enrichCustomerFields(row, index) {
  const extras = [
    {
      prepaidBalance: 2000,
      paymentMethod: '月结',
      paymentPeriodDays: 30,
      fax: '0512-88880001',
      taxNo: '91320500MA1XXXXX01',
      taxRate: 13,
      discountProportion: 0,
      openBank: '工行苏州分行',
      accountNo: '6222021001001001001',
      minAmount: 5000,
      daysOfWarn: 30,
      district: '江苏省·苏州市·工业园区',
      industry: '机械制造',
      valueAssessment: '高价值',
      lastReceiptTime: '2026-09-21 15:20:00',
    },
    {
      prepaidBalance: 0,
      paymentMethod: '现结',
      paymentPeriodDays: 0,
      fax: '',
      taxNo: '',
      taxRate: 13,
      discountProportion: 5,
      openBank: '',
      accountNo: '',
      minAmount: 3000,
      daysOfWarn: 15,
      district: '江苏省·苏州市·相城区',
      industry: '贸易',
      valueAssessment: '普通',
      lastReceiptTime: '2026-09-18 09:10:00',
    },
  ]
  const e = extras[index % extras.length]
  return {
    prepaidBalance: 0,
    paymentMethod: '',
    paymentPeriodDays: null,
    fax: '',
    taxNo: '',
    taxRate: null,
    discountProportion: null,
    openBank: '',
    accountNo: '',
    minAmount: null,
    daysOfWarn: null,
    district: '',
    industry: '',
    valueAssessment: '',
    lastReceiptTime: '',
    ...e,
    ...row,
  }
}

let customers = seedCustomers.map((item, index) => enrichCustomerFields({ ...item }, index))
let nextId = seedCustomers.length + 1

const CATEGORY_NAME = {
  1: '经销商',
  2: '终端客户',
  3: 'OEM 客户',
  4: '外贸客户',
  5: '战略大客户',
  6: '电商客户',
  7: '政府/事业单位',
  8: '关联公司',
  9: '潜在客户',
  10: '临时客户',
}

function withCategoryName(row) {
  return {
    ...row,
    categoryName:
      row.categoryId == null ? '' : CATEGORY_NAME[row.categoryId] || '',
  }
}

function daysSince(dateStr) {
  if (!dateStr) return Number.POSITIVE_INFINITY
  const t = new Date(`${dateStr}T00:00:00`).getTime()
  if (Number.isNaN(t)) return Number.POSITIVE_INFINITY
  return Math.floor((Date.now() - t) / 86400000)
}

export async function mockGetCustomerList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    categoryId = '',
    name = '',
    code = '',
    customerType = '',
    sourceType = '',
    enabled = '',
    filterZeroReceivable = '',
    warnPickupDays = '',
  } = params

  let filtered = customers.map(withCategoryName)

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
  if (customerType) {
    filtered = filtered.filter((item) => item.customerType === customerType)
  }
  if (sourceType) {
    filtered = filtered.filter((item) => item.sourceType === sourceType)
  }
  if (enabled !== '' && enabled !== null && enabled !== undefined) {
    filtered = filtered.filter((item) => item.enabled === Number(enabled))
  }
  if (Number(filterZeroReceivable) === 1) {
    filtered = filtered.filter((item) => Number(item.receivableAmount) !== 0)
  }
  const warnDays = Number(warnPickupDays)
  if (warnDays > 0) {
    filtered = filtered.filter((item) => daysSince(item.lastPickupDate) >= warnDays)
  }

  const total = filtered.length
  const start = (Number(page) - 1) * Number(pageSize)
  const list = filtered.slice(start, start + Number(pageSize))

  return ok({ list, total, page: Number(page), pageSize: Number(pageSize) })
}

export async function mockCreateCustomer(payload) {
  await sleep()
  if (!payload?.name?.trim()) return fail('请输入客户名称')
  if (!payload?.code?.trim()) return fail('请输入客户编号')
  if (customers.some((item) => item.code === payload.code.trim())) {
    return fail('客户编号已存在')
  }
  const now = formatDate(new Date())
  const row = {
    id: nextId++,
    categoryId: payload.categoryId ?? null,
    name: payload.name.trim(),
    code: payload.code.trim(),
    leaderNum: Number(payload.leaderNum) || 0,
    customerType: payload.customerType || '企业',
    org: payload.org || '',
    sourceType: payload.sourceType || '系统添加',
    email: payload.email || '',
    enabled: payload.enabled === 0 ? 0 : 1,
    openingReceivable: Number(payload.openingReceivable) || 0,
    openingReceivableBalance: Number(payload.openingReceivableBalance) || 0,
    receivableAmount: Number(payload.receivableAmount) || 0,
    receivedAmount: Number(payload.receivedAmount) || 0,
    endingReceivable: Number(payload.endingReceivable) || 0,
    prepaidBalance: Number(payload.prepaidBalance) || 0,
    paymentMethod: payload.paymentMethod || '',
    paymentPeriodDays: payload.paymentPeriodDays ?? null,
    fax: payload.fax || '',
    taxNo: payload.taxNo || '',
    taxRate: payload.taxRate ?? null,
    discountProportion: payload.discountProportion ?? null,
    openBank: payload.openBank || '',
    accountNo: payload.accountNo || '',
    minAmount: payload.minAmount ?? null,
    daysOfWarn: payload.daysOfWarn ?? null,
    district: payload.district || '',
    industry: payload.industry || '',
    valueAssessment: payload.valueAssessment || '',
    contact: payload.contact || '',
    phone: payload.phone || '',
    address: payload.address || '',
    lastPickupDate: payload.lastPickupDate || '',
    lastReceiptTime: payload.lastReceiptTime || '',
    remark: payload.remark || '',
    createdAt: now,
  }
  customers.unshift(row)
  return ok(withCategoryName(row))
}

export async function mockUpdateCustomer(id, payload) {
  await sleep()
  const idx = customers.findIndex((item) => String(item.id) === String(id))
  if (idx < 0) return fail('客户不存在')
  if (payload.code) {
    const exists = customers.some(
      (item) => item.code === payload.code.trim() && String(item.id) !== String(id),
    )
    if (exists) return fail('客户编号已存在')
  }
  customers[idx] = {
    ...customers[idx],
    ...payload,
    id: customers[idx].id,
    name: payload.name != null ? String(payload.name).trim() : customers[idx].name,
    code: payload.code != null ? String(payload.code).trim() : customers[idx].code,
  }
  return ok(withCategoryName(customers[idx]))
}

export async function mockDeleteCustomer(id) {
  await sleep()
  const idx = customers.findIndex((item) => String(item.id) === String(id))
  if (idx < 0) return fail('客户不存在')
  customers.splice(idx, 1)
  return ok(true)
}

export async function mockBatchDeleteCustomer(ids = []) {
  await sleep()
  if (!ids.length) return fail('请选择客户')
  const idSet = new Set(ids.map(String))
  customers = customers.filter((item) => !idSet.has(String(item.id)))
  return ok(true)
}

export async function mockBatchUpdateCustomer(ids = [], data = {}) {
  await sleep()
  if (!ids.length) return fail('请选择客户')
  const idSet = new Set(ids.map(String))
  customers = customers.map((item) => {
    if (!idSet.has(String(item.id))) return item
    return { ...item, ...data }
  })
  return ok(true)
}
