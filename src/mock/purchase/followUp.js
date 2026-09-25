import { ok, sleep } from '../config'
import { paginate } from '../stock/_helpers'

const seedList = [
  {
    id: 1,
    billCode: 'PO-20260925001',
    billDate: '2026-09-25',
    materialName: '铝合金型材 6063',
    spec: '40×40×2.0',
    code: 'SKU-6063-4040',
    unitName: '米',
    number: 200,
    instockNumber: 0,
    inTransitNumber: 200,
    costPrice: 28.5,
    taxRate: 13,
    taxCostPrice: 32.21,
    costPriceTotal: 5700,
    taxCostPriceTotal: 6442,
    purchaseDate: '2026-09-25',
    supplierName: '苏州精密传动有限公司',
    status: '已审核',
    arrivalDate: '2026-10-08',
    overdueDays: 0,
    createAdminName: '张伟',
    createdAt: '2026-09-25 10:20:00',
    remark: '首批到货待跟催',
  },
  {
    id: 2,
    billCode: 'PO-20260922002',
    billDate: '2026-09-22',
    materialName: '伺服电机 750W',
    spec: '750W/220V',
    code: 'SKU-SVO-750',
    unitName: '台',
    number: 6,
    instockNumber: 3,
    inTransitNumber: 3,
    costPrice: 1280,
    taxRate: 13,
    taxCostPrice: 1446.4,
    costPriceTotal: 7680,
    taxCostPriceTotal: 8678.4,
    purchaseDate: '2026-09-22',
    supplierName: '德科集团',
    status: '已审核',
    arrivalDate: '2026-09-30',
    overdueDays: 0,
    createAdminName: '刘洋',
    createdAt: '2026-09-22 16:40:00',
    remark: '已部分入库',
  },
  {
    id: 3,
    billCode: 'PO-20260910003',
    billDate: '2026-09-10',
    materialName: '不锈钢板 304',
    spec: '1.2mm×1220×2440',
    code: 'SKU-SS304-12',
    unitName: '张',
    number: 40,
    instockNumber: 40,
    inTransitNumber: 0,
    costPrice: 186,
    taxRate: 13,
    taxCostPrice: 210.18,
    costPriceTotal: 7440,
    taxCostPriceTotal: 8407.2,
    purchaseDate: '2026-09-10',
    supplierName: '华东五金批发',
    status: '已完结',
    arrivalDate: '2026-09-18',
    overdueDays: 0,
    createAdminName: '张伟',
    createdAt: '2026-09-10 14:00:00',
    remark: '',
  },
  {
    id: 4,
    billCode: 'PO-20260828004',
    billDate: '2026-08-28',
    materialName: 'M8 内六角螺丝',
    spec: 'M8×25',
    code: 'SKU-SCR-M825',
    unitName: '个',
    number: 5000,
    instockNumber: 0,
    inTransitNumber: 5000,
    costPrice: 0.18,
    taxRate: 13,
    taxCostPrice: 0.2,
    costPriceTotal: 900,
    taxCostPriceTotal: 1000,
    purchaseDate: '2026-08-28',
    supplierName: '标准件城',
    status: '已审核',
    arrivalDate: '2026-09-10',
    overdueDays: 15,
    createAdminName: '王强',
    createdAt: '2026-08-28 09:30:00',
    remark: '已超期，需催货',
  },
]

export async function mockGetPurchaseFollowUpList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    billCode = '',
    materialName = '',
    supplierName = '',
    status = '',
  } = params
  let rows = [...seedList]
  if (billCode) {
    rows = rows.filter((r) => r.billCode.includes(String(billCode).trim()))
  }
  if (materialName) {
    rows = rows.filter((r) =>
      r.materialName.includes(String(materialName).trim()),
    )
  }
  if (supplierName) {
    rows = rows.filter((r) =>
      r.supplierName.includes(String(supplierName).trim()),
    )
  }
  if (status) rows = rows.filter((r) => r.status === status)
  return ok(paginate(rows, page, pageSize))
}
