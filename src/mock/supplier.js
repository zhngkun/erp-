import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/** categoryId 对齐供应商分类种子：1 原材料 / 2 外协 …；null 表示未分类 */
const seedSuppliers = [
  {
    id: 1,
    categoryId: 1,
    name: '测试供应商02',
    code: '656118',
    managerCount: 0,
    type: '企业',
    org: '总部',
    status: '已审核',
    email: 'supplier02@example.com',
    enabled: 1,
    openingPayable: 0,
    openingPayableBalance: 0,
    payableAmount: 12800,
    contact: '王强',
    phone: '13800002002',
    address: '江苏省苏州市工业园区星湖街100号',
    createdAt: '2026-09-22 10:18:05',
  },
  {
    id: 2,
    categoryId: 1,
    name: '测试供应商01',
    code: '192417',
    managerCount: 0,
    type: '企业',
    org: '总部',
    status: '已审核',
    email: 'supplier01@example.com',
    enabled: 1,
    openingPayable: 0,
    openingPayableBalance: 0,
    payableAmount: 0,
    contact: '李娜',
    phone: '13800002001',
    address: '江苏省苏州市相城区黄桥街道旺巷路12号',
    createdAt: '2026-09-22 10:15:40',
  },
  {
    id: 3,
    categoryId: 2,
    name: '精工外协厂',
    code: 'OUT-8801',
    managerCount: 2,
    type: '企业',
    org: '制造中心',
    status: '已审核',
    email: 'jgwx@example.com',
    enabled: 1,
    openingPayable: 5000,
    openingPayableBalance: 3200,
    payableAmount: 8600,
    contact: '赵磊',
    phone: '13900003003',
    address: '浙江省嘉兴市南湖区大桥镇工业路28号',
    createdAt: '2026-09-18 14:22:11',
  },
  {
    id: 4,
    categoryId: 3,
    name: '华美包材',
    code: 'PKG-3310',
    managerCount: 1,
    type: '企业',
    org: '供应链',
    status: '已审核',
    email: 'hmbc@example.com',
    enabled: 1,
    openingPayable: 1200,
    openingPayableBalance: 800,
    payableAmount: 2400,
    contact: '陈静',
    phone: '13700004004',
    address: '江苏省苏州市吴中区越溪街道北官渡路66号',
    createdAt: '2026-09-15 09:40:00',
  },
  {
    id: 5,
    categoryId: 5,
    name: '顺达物流',
    code: 'LOG-5520',
    managerCount: 3,
    type: '企业',
    org: '供应链',
    status: '已审核',
    email: 'sdwl@example.com',
    enabled: 1,
    openingPayable: 0,
    openingPayableBalance: 0,
    payableAmount: 15600,
    contact: '周杰',
    phone: '13600005005',
    address: '上海市嘉定区马陆镇工业区嘉戬公路88号',
    createdAt: '2026-09-12 16:05:33',
  },
  {
    id: 6,
    categoryId: 4,
    name: '德科设备',
    code: 'EQP-1108',
    managerCount: 1,
    type: '企业',
    org: '设备部',
    status: '草稿',
    email: 'dk@example.com',
    enabled: 0,
    openingPayable: 0,
    openingPayableBalance: 0,
    payableAmount: 0,
    contact: '吴芳',
    phone: '13500006006',
    address: '广东省东莞市松山湖科技产业园区工业北路3号',
    createdAt: '2026-09-08 11:11:11',
  },
  {
    id: 7,
    categoryId: 8,
    name: '质衡检测',
    code: 'QA-2201',
    managerCount: 2,
    type: '企业',
    org: '质量部',
    status: '已审核',
    email: 'zhjc@example.com',
    enabled: 1,
    openingPayable: 3000,
    openingPayableBalance: 1500,
    payableAmount: 4500,
    contact: '孙丽',
    phone: '13400007007',
    address: '江苏省南京市江宁区科学园天元东路188号',
    createdAt: '2026-09-05 08:30:22',
  },
  {
    id: 8,
    categoryId: 9,
    name: '云启软件',
    code: 'IT-9901',
    managerCount: 1,
    type: '企业',
    org: '信息中心',
    status: '已审核',
    email: 'yq@example.com',
    enabled: 1,
    openingPayable: 0,
    openingPayableBalance: 0,
    payableAmount: 98000,
    contact: '马超',
    phone: '13300008008',
    address: '浙江省杭州市西湖区文三路478号',
    createdAt: '2026-08-28 13:45:09',
  },
  {
    id: 9,
    categoryId: 6,
    name: '文具优选个商',
    code: 'OFF-0707',
    managerCount: 0,
    type: '个人',
    org: '行政部',
    status: '已审核',
    email: '',
    enabled: 1,
    openingPayable: 200,
    openingPayableBalance: 50,
    payableAmount: 680,
    contact: '何静',
    phone: '13200009009',
    address: '江苏省苏州市姑苏区观前街88号',
    createdAt: '2026-08-20 10:00:00',
  },
  {
    id: 10,
    categoryId: 10,
    name: '临时采购商',
    code: 'TMP-0001',
    managerCount: 0,
    type: '企业',
    org: '总部',
    status: '停用',
    email: 'tmp@example.com',
    enabled: 0,
    openingPayable: 0,
    openingPayableBalance: 0,
    payableAmount: 0,
    contact: '临时',
    phone: '13100001010',
    address: '',
    createdAt: '2026-07-01 17:40:12',
  },
  {
    id: 11,
    categoryId: 11,
    name: '精密模具厂',
    code: 'MOLD-4412',
    managerCount: 2,
    type: '企业',
    org: '制造中心',
    status: '已审核',
    email: 'jmmuju@example.com',
    enabled: 1,
    openingPayable: 18000,
    openingPayableBalance: 12000,
    payableAmount: 26500,
    contact: '郑凯',
    phone: '13000001111',
    address: '广东省深圳市宝安区沙井街道和一工业区',
    createdAt: '2026-09-01 09:09:09',
  },
  {
    id: 12,
    categoryId: 12,
    name: '安华危化品',
    code: 'HAZ-6618',
    managerCount: 1,
    type: '企业',
    org: '安环部',
    status: '已审核',
    email: 'ahwh@example.com',
    enabled: 1,
    openingPayable: 8000,
    openingPayableBalance: 8000,
    payableAmount: 8000,
    contact: '徐明',
    phone: '15900001212',
    address: '江苏省苏州市吴江区汾湖高新区芦墟大道200号',
    createdAt: '2026-08-15 15:20:30',
  },
]

function enrichSupplierFields(row, index) {
  const paid = Math.max(0, Number(row.payableAmount || 0) - Number(row.openingPayableBalance || 0))
  const extras = [
    {
      fax: '0512-66660001',
      taxNo: '91320500MA1SUPP001',
      taxRate: 13,
      discountProportion: 0,
      openBank: '建行苏州分行',
      accountNo: '6227001001001001001',
      acceptanceNo: '',
      supplySafety: 'A级',
      remark: '战略供应商',
      lastPaymentTime: '2026-09-20 14:00:00',
      verifyData: '张伟 / 2026-09-10',
      sort: 10,
      prepaidBalance: 1500,
    },
    {
      fax: '',
      taxNo: '',
      taxRate: 13,
      discountProportion: 2,
      openBank: '',
      accountNo: '',
      acceptanceNo: 'CD-202609',
      supplySafety: 'B级',
      remark: '',
      lastPaymentTime: '2026-09-15 11:30:00',
      verifyData: '李娜 / 2026-09-12',
      sort: 20,
      prepaidBalance: 0,
    },
  ]
  const e = extras[index % extras.length]
  return {
    paidAmount: paid,
    endingPayable: Number(row.openingPayableBalance || 0),
    prepaidBalance: 0,
    fax: '',
    taxNo: '',
    taxRate: null,
    discountProportion: null,
    openBank: '',
    accountNo: '',
    acceptanceNo: '',
    supplySafety: '',
    remark: '',
    lastPaymentTime: '',
    verifyData: '',
    sort: index + 1,
    ...e,
    ...row,
    paidAmount: row.paidAmount ?? e.paidAmount ?? paid,
    endingPayable: row.endingPayable ?? e.endingPayable ?? Number(row.openingPayableBalance || 0),
    prepaidBalance: row.prepaidBalance ?? e.prepaidBalance ?? 0,
  }
}

let suppliers = seedSuppliers.map((item, index) => enrichSupplierFields({ ...item }, index))
let nextId = seedSuppliers.length + 1

export async function mockGetSupplierList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    categoryId = '',
    name = '',
    code = '',
    type = '',
    status = '',
    enabled = '',
    filterZeroPayable = '',
  } = params

  let filtered = [...suppliers]

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
  if (type) {
    filtered = filtered.filter((item) => item.type === type)
  }
  if (status) {
    filtered = filtered.filter((item) => item.status === status)
  }
  if (enabled !== '' && enabled !== null && enabled !== undefined) {
    filtered = filtered.filter((item) => item.enabled === Number(enabled))
  }
  // 1 = 过滤掉应付金额为 0 的记录
  if (Number(filterZeroPayable) === 1) {
    filtered = filtered.filter((item) => Number(item.payableAmount) !== 0)
  }

  const total = filtered.length
  const start = (Number(page) - 1) * Number(pageSize)
  const list = filtered.slice(start, start + Number(pageSize))

  return ok({ list, total, page: Number(page), pageSize: Number(pageSize) })
}

export async function mockCreateSupplier(payload) {
  await sleep()
  if (!payload?.name || !payload?.code) {
    return fail('供应商名称和编码不能为空')
  }
  if (suppliers.some((item) => item.code === payload.code)) {
    return fail('供应商编码已存在')
  }
  const row = {
    id: nextId++,
    categoryId: payload.categoryId ?? null,
    name: payload.name,
    code: payload.code,
    managerCount: payload.managerCount ?? 0,
    type: payload.type || '企业',
    org: payload.org || '',
    status: payload.status || '草稿',
    email: payload.email || '',
    enabled: payload.enabled ?? 1,
    openingPayable: payload.openingPayable ?? 0,
    openingPayableBalance: payload.openingPayableBalance ?? 0,
    payableAmount: payload.payableAmount ?? 0,
    paidAmount: payload.paidAmount ?? 0,
    endingPayable: payload.endingPayable ?? 0,
    prepaidBalance: payload.prepaidBalance ?? 0,
    fax: payload.fax || '',
    taxNo: payload.taxNo || '',
    taxRate: payload.taxRate ?? null,
    discountProportion: payload.discountProportion ?? null,
    openBank: payload.openBank || '',
    accountNo: payload.accountNo || '',
    acceptanceNo: payload.acceptanceNo || '',
    supplySafety: payload.supplySafety || '',
    remark: payload.remark || '',
    lastPaymentTime: payload.lastPaymentTime || '',
    verifyData: payload.verifyData || '',
    sort: payload.sort ?? 0,
    contact: payload.contact || '',
    phone: payload.phone || '',
    address: payload.address || '',
    createdAt: formatDate(new Date()),
  }
  suppliers.unshift(row)
  return ok(row, '创建成功')
}

export async function mockUpdateSupplier(id, payload) {
  await sleep()
  const index = suppliers.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('供应商不存在')
  if (
    payload?.code &&
    suppliers.some(
      (item) => item.code === payload.code && item.id !== Number(id),
    )
  ) {
    return fail('供应商编码已存在')
  }
  suppliers[index] = {
    ...suppliers[index],
    ...payload,
    id: suppliers[index].id,
  }
  return ok(suppliers[index], '更新成功')
}

export async function mockDeleteSupplier(id) {
  await sleep()
  const index = suppliers.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('供应商不存在')
  suppliers.splice(index, 1)
  return ok(true, '删除成功')
}

export async function mockBatchDeleteSupplier(ids = []) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要删除的供应商')
  suppliers = suppliers.filter((item) => !idSet.has(item.id))
  return ok(true, '批量删除成功')
}

export async function mockBatchUpdateSupplier(ids = [], payload = {}) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要操作的供应商')
  suppliers = suppliers.map((item) =>
    idSet.has(item.id) ? { ...item, ...payload } : item,
  )
  return ok(true, '批量更新成功')
}
