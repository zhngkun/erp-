import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const seedWarehouses = [
  {
    id: 1,
    name: '成品仓',
    code: '092878',
    isWaste: 0,
    manager: '张伟',
    phone: '13800001001',
    address: '江苏省苏州市工业园区星湖街328号A栋',
    enabled: 1,
    sort: 10,
    remark: '成品出货主仓',
    createdAt: '2026-09-24 10:25:02',
  },
  {
    id: 2,
    name: '半成品仓',
    code: '213390',
    isWaste: 0,
    manager: '李娜',
    phone: '13800001002',
    address: '江苏省苏州市工业园区星湖街328号B栋',
    enabled: 1,
    sort: 20,
    remark: '工序周转仓',
    createdAt: '2026-09-24 10:24:41',
  },
  {
    id: 3,
    name: '原材料仓',
    code: '616081',
    isWaste: 0,
    manager: '王强',
    phone: '13800001003',
    address: '江苏省苏州市相城区黄桥街道旺巷路88号',
    enabled: 1,
    sort: 30,
    remark: '采购入库主仓',
    createdAt: '2026-09-24 10:24:28',
  },
  {
    id: 4,
    name: '废品仓',
    code: '774201',
    isWaste: 1,
    manager: '赵敏',
    phone: '13800001004',
    address: '江苏省苏州市相城区黄桥街道旺巷路90号',
    enabled: 1,
    sort: 40,
    remark: '质检不合格隔离',
    createdAt: '2026-09-20 09:12:15',
  },
  {
    id: 5,
    name: '线边仓-一线',
    code: '881102',
    isWaste: 0,
    manager: '陈浩',
    phone: '13800001005',
    address: '江苏省苏州市吴中区越溪街道北官渡路12号车间1',
    enabled: 1,
    sort: 50,
    remark: '产线领退料',
    createdAt: '2026-09-18 14:33:08',
  },
  {
    id: 6,
    name: '线边仓-二线',
    code: '881203',
    isWaste: 0,
    manager: '刘洋',
    phone: '13800001006',
    address: '江苏省苏州市吴中区越溪街道北官渡路12号车间2',
    enabled: 1,
    sort: 60,
    remark: '',
    createdAt: '2026-09-18 14:35:22',
  },
  {
    id: 7,
    name: '外协仓',
    code: '905511',
    isWaste: 0,
    manager: '周杰',
    phone: '13900002001',
    address: '浙江省嘉兴市南湖区大桥镇工业路66号',
    enabled: 1,
    sort: 70,
    remark: '委外加工暂存',
    createdAt: '2026-09-15 11:08:44',
  },
  {
    id: 8,
    name: '备件仓',
    code: '332198',
    isWaste: 0,
    manager: '吴芳',
    phone: '13700003008',
    address: '江苏省苏州市工业园区星湖街328号C栋地下一层',
    enabled: 1,
    sort: 80,
    remark: '设备备件与耗材',
    createdAt: '2026-09-12 16:20:01',
  },
  {
    id: 9,
    name: '样品仓',
    code: '441067',
    isWaste: 0,
    manager: '孙丽',
    phone: '13600004009',
    address: '江苏省苏州市工业园区星湖街328号展厅旁',
    enabled: 1,
    sort: 90,
    remark: '客户样品与打样',
    createdAt: '2026-09-10 08:45:30',
  },
  {
    id: 10,
    name: '退货仓',
    code: '556720',
    isWaste: 0,
    manager: '郑凯',
    phone: '13500005010',
    address: '江苏省苏州市相城区黄桥街道旺巷路92号',
    enabled: 1,
    sort: 100,
    remark: '销售退货待检',
    createdAt: '2026-09-08 13:17:55',
  },
  {
    id: 11,
    name: '华北中转仓',
    code: '610001',
    isWaste: 0,
    manager: '马超',
    phone: '13300006011',
    address: '天津市武清区京滨工业园经二路18号',
    enabled: 1,
    sort: 110,
    remark: '华北区域发货',
    createdAt: '2026-08-28 10:02:18',
  },
  {
    id: 12,
    name: '华南中转仓',
    code: '610002',
    isWaste: 0,
    manager: '黄磊',
    phone: '13200007012',
    address: '广东省东莞市松山湖科技产业园区工业北路9号',
    enabled: 1,
    sort: 120,
    remark: '华南区域发货',
    createdAt: '2026-08-28 10:05:41',
  },
  {
    id: 13,
    name: '危险品仓',
    code: '990011',
    isWaste: 0,
    manager: '徐明',
    phone: '13100008013',
    address: '江苏省苏州市吴江区汾湖高新区芦墟大道888号',
    enabled: 1,
    sort: 130,
    remark: '危化品专仓，双人双锁',
    createdAt: '2026-08-20 09:30:00',
  },
  {
    id: 14,
    name: '临时仓-扩建',
    code: 'TMP014',
    isWaste: 0,
    manager: '何静',
    phone: '13000009014',
    address: '江苏省苏州市工业园区斜塘镇物流园D区',
    enabled: 0,
    sort: 999,
    remark: '临时租用，已停用',
    createdAt: '2026-07-01 17:40:12',
  },
  {
    id: 15,
    name: '报废待处理仓',
    code: 'SCR015',
    isWaste: 1,
    manager: '赵敏',
    phone: '13800001004',
    address: '江苏省苏州市相城区黄桥街道旺巷路90号后院',
    enabled: 1,
    sort: 45,
    remark: '待报废销毁',
    createdAt: '2026-08-05 15:22:09',
  },
  {
    id: 16,
    name: '包材仓',
    code: 'BC016',
    isWaste: 0,
    manager: '林峰',
    phone: '15900001116',
    address: '江苏省苏州市相城区黄桥街道旺巷路88号2号库',
    enabled: 1,
    sort: 35,
    remark: '纸箱、标签、托盘',
    createdAt: '2026-09-01 11:11:11',
  },
  {
    id: 17,
    name: '冷链仓',
    code: 'CL017',
    isWaste: 0,
    manager: '罗倩',
    phone: '15800001217',
    address: '江苏省苏州市工业园区生物纳米园冷库A区',
    enabled: 1,
    sort: 140,
    remark: '2~8℃存储',
    createdAt: '2026-07-18 08:08:08',
  },
  {
    id: 18,
    name: 'VMI供应商仓',
    code: 'VMI018',
    isWaste: 0,
    manager: '王强',
    phone: '13800001003',
    address: '江苏省苏州市相城区黄桥街道旺巷路88号VMI区',
    enabled: 1,
    sort: 150,
    remark: '供应商寄售库存',
    createdAt: '2026-06-30 19:00:00',
  },
]

let warehouses = seedWarehouses.map((item) => ({ ...item }))
let nextId = seedWarehouses.length + 1

export async function mockGetWarehouseList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    name = '',
    code = '',
    isWaste = '',
    enabled = '',
  } = params

  let filtered = [...warehouses]

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
  if (isWaste !== '' && isWaste !== null && isWaste !== undefined) {
    filtered = filtered.filter((item) => item.isWaste === Number(isWaste))
  }
  if (enabled !== '' && enabled !== null && enabled !== undefined) {
    filtered = filtered.filter((item) => item.enabled === Number(enabled))
  }

  const total = filtered.length
  const start = (Number(page) - 1) * Number(pageSize)
  const list = filtered.slice(start, start + Number(pageSize))

  return ok({ list, total, page: Number(page), pageSize: Number(pageSize) })
}

export async function mockCreateWarehouse(payload) {
  await sleep()
  if (!payload?.name || !payload?.code) {
    return fail('仓库名称和编码不能为空')
  }
  if (warehouses.some((item) => item.code === payload.code)) {
    return fail('仓库编码已存在')
  }
  const row = {
    id: nextId++,
    name: payload.name,
    code: payload.code,
    isWaste: payload.isWaste ?? 0,
    manager: payload.manager || '',
    phone: payload.phone || '',
    address: payload.address || '',
    enabled: payload.enabled ?? 1,
    sort: payload.sort ?? 0,
    remark: payload.remark || '',
    createdAt: formatDate(new Date()),
  }
  warehouses.unshift(row)
  return ok(row, '创建成功')
}

export async function mockUpdateWarehouse(id, payload) {
  await sleep()
  const index = warehouses.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('仓库不存在')
  if (
    payload?.code &&
    warehouses.some(
      (item) => item.code === payload.code && item.id !== Number(id),
    )
  ) {
    return fail('仓库编码已存在')
  }
  warehouses[index] = { ...warehouses[index], ...payload, id: warehouses[index].id }
  return ok(warehouses[index], '更新成功')
}

export async function mockDeleteWarehouse(id) {
  await sleep()
  const index = warehouses.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('仓库不存在')
  warehouses.splice(index, 1)
  return ok(true, '删除成功')
}

export async function mockBatchDeleteWarehouse(ids = []) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要删除的仓库')
  warehouses = warehouses.filter((item) => !idSet.has(item.id))
  return ok(true, '批量删除成功')
}

export async function mockBatchUpdateWarehouse(ids = [], payload = {}) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要操作的仓库')
  warehouses = warehouses.map((item) =>
    idSet.has(item.id) ? { ...item, ...payload } : item,
  )
  return ok(true, '批量更新成功')
}
