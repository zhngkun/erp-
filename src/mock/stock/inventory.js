import { fail, ok, sleep } from '../config'
import { paginate } from './_helpers'

const totalSeed = [
  {
    id: 1,
    materialName: '铝合金型材 6063',
    spec: '40×40×2.0',
    cover: '',
    code: 'SKU-6063-4040',
    categoryName: '型材',
    brandName: '朋来',
    recommendSupplierName: '苏州精密传动',
    numberTotal: 1280,
    showNumberTotal: 1280,
    inTransitNumber: 40,
    purchasePrice: 26.5,
    averagePrice: 28.5,
    costPriceTotal: 36480,
    lastInstockPrice: 28.5,
    lastOutstockTime: '2026-09-24 16:20:00',
    remark: '',
  },
  {
    id: 2,
    materialName: '不锈钢板 304',
    spec: '1.2mm×1220×2440',
    cover: '',
    code: 'SKU-SS304-12',
    categoryName: '板材',
    brandName: '宝钢',
    recommendSupplierName: '华东五金批发',
    numberTotal: 86,
    showNumberTotal: 86,
    inTransitNumber: 12,
    purchasePrice: 180,
    averagePrice: 186,
    costPriceTotal: 15996,
    lastInstockPrice: 186,
    lastOutstockTime: '2026-09-22 11:05:00',
    remark: '常用规格',
  },
  {
    id: 3,
    materialName: 'M8 内六角螺丝',
    spec: 'M8×25',
    cover: '',
    code: 'SKU-SCR-M825',
    categoryName: '紧固件',
    brandName: '标准件',
    recommendSupplierName: '标准件城',
    numberTotal: 12500,
    showNumberTotal: 12500,
    inTransitNumber: 0,
    purchasePrice: 0.15,
    averagePrice: 0.18,
    costPriceTotal: 2250,
    lastInstockPrice: 0.18,
    lastOutstockTime: '2026-09-25 09:12:00',
    remark: '',
  },
  {
    id: 4,
    materialName: '伺服电机 750W',
    spec: '750W/220V',
    cover: '',
    code: 'SKU-SVO-750',
    categoryName: '电气',
    brandName: '汇川',
    recommendSupplierName: '德科集团',
    numberTotal: 18,
    showNumberTotal: 18,
    inTransitNumber: 2,
    purchasePrice: 1180,
    averagePrice: 1280,
    costPriceTotal: 23040,
    lastInstockPrice: 1280,
    lastOutstockTime: '2026-09-20 14:40:00',
    remark: '启用序列号',
  },
  {
    id: 5,
    materialName: '包装纸箱 60×40×40',
    spec: '三层瓦楞',
    cover: '',
    code: 'SKU-BOX-6040',
    categoryName: '耗材',
    brandName: '通用',
    recommendSupplierName: '包装之家',
    numberTotal: 420,
    showNumberTotal: 420,
    inTransitNumber: 100,
    purchasePrice: 3.2,
    averagePrice: 3.5,
    costPriceTotal: 1470,
    lastInstockPrice: 3.5,
    lastOutstockTime: '2026-09-23 17:00:00',
    remark: '',
  },
]

const stockSeed = [
  {
    id: 11,
    materialName: '铝合金型材 6063',
    spec: '40×40×2.0',
    cover: '',
    code: 'SKU-6063-4040',
    categoryName: '型材',
    brandName: '朋来',
    stockName: '原材料仓',
    numberTotal: 800,
    showNumberTotal: 800,
    inTransitNumber: 40,
    purchasePrice: 26.5,
    averagePrice: 28.5,
    costPriceTotal: 22800,
    lastInstockPrice: 28.5,
    lastOutstockTime: '2026-09-24 16:20:00',
    remark: '',
  },
  {
    id: 12,
    materialName: '铝合金型材 6063',
    spec: '40×40×2.0',
    cover: '',
    code: 'SKU-6063-4040',
    categoryName: '型材',
    brandName: '朋来',
    stockName: '半成品仓',
    numberTotal: 480,
    showNumberTotal: 480,
    inTransitNumber: 0,
    purchasePrice: 26.5,
    averagePrice: 28.5,
    costPriceTotal: 13680,
    lastInstockPrice: 28.5,
    lastOutstockTime: '2026-09-21 10:00:00',
    remark: '',
  },
  {
    id: 13,
    materialName: '伺服电机 750W',
    spec: '750W/220V',
    cover: '',
    code: 'SKU-SVO-750',
    categoryName: '电气',
    brandName: '汇川',
    stockName: '成品仓',
    numberTotal: 18,
    showNumberTotal: 18,
    inTransitNumber: 2,
    purchasePrice: 1180,
    averagePrice: 1280,
    costPriceTotal: 23040,
    lastInstockPrice: 1280,
    lastOutstockTime: '2026-09-20 14:40:00',
    remark: '',
  },
]

const locationSeed = [
  {
    id: 21,
    materialName: '铝合金型材 6063',
    spec: '40×40×2.0',
    cover: '',
    code: 'SKU-6063-4040',
    categoryName: '型材',
    brandName: '朋来',
    stockName: '原材料仓',
    locationName: 'A-01-01',
    numberTotal: 500,
    showNumberTotal: 500,
    purchasePrice: 26.5,
    averagePrice: 28.5,
    costPriceTotal: 14250,
    lastInstockPrice: 28.5,
    lastInstockPriceTotal: 14250,
    remark: '',
  },
  {
    id: 22,
    materialName: '铝合金型材 6063',
    spec: '40×40×2.0',
    cover: '',
    code: 'SKU-6063-4040',
    categoryName: '型材',
    brandName: '朋来',
    stockName: '原材料仓',
    locationName: 'A-02-03',
    numberTotal: 300,
    showNumberTotal: 300,
    purchasePrice: 26.5,
    averagePrice: 28.5,
    costPriceTotal: 8550,
    lastInstockPrice: 28.5,
    lastInstockPriceTotal: 8550,
    remark: '',
  },
  {
    id: 23,
    materialName: 'M8 内六角螺丝',
    spec: 'M8×25',
    cover: '',
    code: 'SKU-SCR-M825',
    categoryName: '紧固件',
    brandName: '标准件',
    stockName: '耗材仓',
    locationName: 'C-01-05',
    numberTotal: 12500,
    showNumberTotal: 12500,
    purchasePrice: 0.15,
    averagePrice: 0.18,
    costPriceTotal: 2250,
    lastInstockPrice: 0.18,
    lastInstockPriceTotal: 2250,
    remark: '',
  },
]

function filterInventory(rows, params = {}) {
  let next = [...rows]
  const { materialName = '', code = '', stockName = '', locationName = '' } =
    params
  if (materialName) {
    next = next.filter((r) =>
      String(r.materialName).includes(String(materialName).trim()),
    )
  }
  if (code) {
    next = next.filter((r) => String(r.code).includes(String(code).trim()))
  }
  if (stockName) {
    next = next.filter((r) =>
      String(r.stockName || '').includes(String(stockName).trim()),
    )
  }
  if (locationName) {
    next = next.filter((r) =>
      String(r.locationName || '').includes(String(locationName).trim()),
    )
  }
  return next
}

export async function mockGetStockInventoryList(params = {}) {
  await sleep()
  const { tab = 'total', page = 1, pageSize = 10 } = params
  const source =
    tab === 'stock' ? stockSeed : tab === 'location' ? locationSeed : totalSeed
  const rows = filterInventory(source, params)
  return ok(paginate(rows, page, pageSize))
}

const flowSeed = [
  {
    id: 1,
    materialName: '铝合金型材 6063',
    spec: '40×40×2.0',
    code: 'SKU-6063-4040',
    stockName: '原材料仓',
    locationName: 'A-01-01',
    billType: '其他入库',
    billCode: 'OI-20260925001',
    personName: '王强',
    personCode: 'U1001',
    billOperateType: '审核',
    changeType: '入库',
    beforeNumber: 1260,
    number: 20,
    afterNumber: 1280,
    unitName: '米',
    beforePrice: 28.5,
    afterPrice: 28.5,
    beforePriceTotal: 35910,
    afterPriceTotal: 36480,
    serialNumber: '',
    batchNumber: 'BN202609',
    createAdminName: '系统',
    createdAt: '2026-09-25 10:25:00',
  },
  {
    id: 2,
    materialName: 'M8 内六角螺丝',
    spec: 'M8×25',
    code: 'SKU-SCR-M825',
    stockName: '耗材仓',
    locationName: 'C-01-05',
    billType: '其他出库',
    billCode: 'OO-20260923002',
    personName: '张伟',
    personCode: 'U1002',
    billOperateType: '审核',
    changeType: '出库',
    beforeNumber: 13000,
    number: -500,
    afterNumber: 12500,
    unitName: '个',
    beforePrice: 0.18,
    afterPrice: 0.18,
    beforePriceTotal: 2340,
    afterPriceTotal: 2250,
    serialNumber: '',
    batchNumber: '',
    createAdminName: '系统',
    createdAt: '2026-09-23 11:22:00',
  },
  {
    id: 3,
    materialName: '伺服电机 750W',
    spec: '750W/220V',
    code: 'SKU-SVO-750',
    stockName: '成品仓',
    locationName: 'F-03-01',
    billType: '库存调拨',
    billCode: 'TF-20260921002',
    personName: '陈浩',
    personCode: 'U1003',
    billOperateType: '审核',
    changeType: '出库',
    beforeNumber: 20,
    number: -2,
    afterNumber: 18,
    unitName: '台',
    beforePrice: 1280,
    afterPrice: 1280,
    beforePriceTotal: 25600,
    afterPriceTotal: 23040,
    serialNumber: 'SN202609001',
    batchNumber: 'BN202609',
    createAdminName: '系统',
    createdAt: '2026-09-21 14:15:00',
  },
  {
    id: 4,
    materialName: '不锈钢板 304',
    spec: '1.2mm×1220×2440',
    code: 'SKU-SS304-12',
    stockName: '原材料仓',
    locationName: 'B-02-03',
    billType: '库存盘点',
    billCode: 'CK-20260925001',
    personName: '刘洋',
    personCode: 'U1004',
    billOperateType: '审核',
    changeType: '盘亏',
    beforeNumber: 88,
    number: -2,
    afterNumber: 86,
    unitName: '张',
    beforePrice: 186,
    afterPrice: 186,
    beforePriceTotal: 16368,
    afterPriceTotal: 15996,
    serialNumber: '',
    batchNumber: '',
    createAdminName: '系统',
    createdAt: '2026-09-25 18:05:00',
  },
]

export async function mockGetStockFlowList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    materialName = '',
    billCode = '',
    changeType = '',
    stockName = '',
  } = params
  let rows = [...flowSeed]
  if (materialName) {
    rows = rows.filter((r) =>
      r.materialName.includes(String(materialName).trim()),
    )
  }
  if (billCode) {
    rows = rows.filter((r) => r.billCode.includes(String(billCode).trim()))
  }
  if (changeType) rows = rows.filter((r) => r.changeType === changeType)
  if (stockName) {
    rows = rows.filter((r) => r.stockName.includes(String(stockName).trim()))
  }
  return ok(paginate(rows, page, pageSize))
}

let lockList = [
  {
    id: 1,
    materialName: '铝合金型材 6063',
    spec: '40×40×2.0',
    cover: '',
    code: 'SKU-6063-4040',
    categoryName: '型材',
    brandName: '朋来',
    numberTotal: 1280,
    available: 1200,
    lockNumberTotal: 80,
    lockRecord: '销售订单 SO-20260922001 锁定 80',
  },
  {
    id: 2,
    materialName: '伺服电机 750W',
    spec: '750W/220V',
    cover: '',
    code: 'SKU-SVO-750',
    categoryName: '电气',
    brandName: '汇川',
    numberTotal: 18,
    available: 14,
    lockNumberTotal: 4,
    lockRecord: '生产工单 MO-20260920001 锁定 4',
  },
  {
    id: 3,
    materialName: '不锈钢板 304',
    spec: '1.2mm×1220×2440',
    cover: '',
    code: 'SKU-SS304-12',
    categoryName: '板材',
    brandName: '宝钢',
    numberTotal: 86,
    available: 86,
    lockNumberTotal: 0,
    lockRecord: '—',
  },
]

export async function mockGetStockLockList(params = {}) {
  await sleep()
  const { page = 1, pageSize = 10, materialName = '', code = '' } = params
  let rows = [...lockList]
  if (materialName) {
    rows = rows.filter((r) =>
      r.materialName.includes(String(materialName).trim()),
    )
  }
  if (code) rows = rows.filter((r) => r.code.includes(String(code).trim()))
  return ok(paginate(rows, page, pageSize))
}

export async function mockUnlockStock(id) {
  await sleep()
  const idx = lockList.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('记录不存在')
  if (!lockList[idx].lockNumberTotal) return fail('当前无锁定数量')
  lockList[idx] = {
    ...lockList[idx],
    available: lockList[idx].numberTotal,
    lockNumberTotal: 0,
    lockRecord: '已全部释放',
  }
  return ok({ ...lockList[idx] })
}
