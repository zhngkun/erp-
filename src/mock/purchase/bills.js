import { createBillMockStore, itemLine, todayStr } from '../stock/_helpers'

function bill(partial) {
  const items = partial.itemList || [itemLine({ costPrice: 28.5, taxRate: 13 })]
  const numberTotal = items.reduce((s, i) => s + Number(i.number || 0), 0)
  return {
    billDate: todayStr(),
    status: '待审核',
    createAdminName: '张伟',
    createdAt: `${todayStr()} 10:20:00`,
    remark: '',
    verifyData: '',
    contractNo: '',
    numberTotal,
    itemList: items,
    itemSummary: items.map((i) => i.materialName).join('、'),
    ...partial,
  }
}

const materials = [
  itemLine({
    materialName: '铝合金型材 6063',
    code: 'SKU-6063-4040',
    number: 200,
    costPrice: 28.5,
    taxRate: 13,
    taxCostPrice: 32.21,
  }),
  itemLine({
    materialName: '不锈钢板 304',
    spec: '1.2mm×1220×2440',
    code: 'SKU-SS304-12',
    number: 40,
    unitName: '张',
    stockName: '原材料仓',
    locationName: 'B-02-03',
    costPrice: 186,
    taxRate: 13,
    taxCostPrice: 210.18,
  }),
  itemLine({
    materialName: '伺服电机 750W',
    spec: '750W/220V',
    code: 'SKU-SVO-750',
    number: 6,
    unitName: '台',
    stockName: '成品仓',
    locationName: 'F-03-01',
    costPrice: 1280,
    taxRate: 13,
    taxCostPrice: 1446.4,
  }),
]

function sampleItems(n = 2) {
  return materials.slice(0, n).map((m) => ({ ...m }))
}

function withAmount(items, field = 'amountTotal') {
  const amount = items.reduce(
    (s, i) =>
      s +
      Number(i.number || 0) *
        Number(i.taxCostPrice || i.costPrice || 0),
    0,
  )
  return { [field]: Number(amount.toFixed(2)), costPriceTotal: Number(amount.toFixed(2)) }
}

function supplierFilter(rows, p) {
  if (p.supplierName) {
    return rows.filter((r) =>
      String(r.supplierName || '').includes(String(p.supplierName).trim()),
    )
  }
  return rows
}

export const billStores = {
  plan: createBillMockStore({
    prefix: 'PP',
    seedList: [
      bill({
        id: 1,
        billCode: 'PP-20260925001',
        planType: 'MRP计划',
        contractNo: 'CT-2026-001',
        itemList: sampleItems(2),
      }),
      bill({
        id: 2,
        billCode: 'PP-20260918002',
        billDate: '2026-09-18',
        status: '已审核',
        planType: '手工计划',
        verifyData: '王强 / 2026-09-18 15:00',
        itemList: [materials[2]],
      }),
    ],
    filterFn: (rows, p) => {
      if (p.planType) {
        return rows.filter((r) =>
          String(r.planType || '').includes(String(p.planType).trim()),
        )
      }
      return rows
    },
  }),

  requisition: createBillMockStore({
    prefix: 'PR',
    seedList: [
      bill({
        id: 1,
        billCode: 'PR-20260925001',
        requisitionAdminName: '李娜',
        requisitionDeptName: '生产一部',
        supplierName: '苏州精密传动有限公司',
        demandDate: '2026-10-05',
        itemList: sampleItems(2),
      }),
      bill({
        id: 2,
        billCode: 'PR-20260920002',
        billDate: '2026-09-20',
        status: '已审核',
        requisitionAdminName: '陈浩',
        requisitionDeptName: '仓储部',
        supplierName: '华东五金批发',
        demandDate: '2026-09-28',
        verifyData: '张伟 / 2026-09-20 11:20',
        itemList: [materials[1]],
      }),
    ],
    filterFn: (rows, p) => {
      let next = supplierFilter(rows, p)
      if (p.requisitionAdminName) {
        next = next.filter((r) =>
          String(r.requisitionAdminName || '').includes(
            String(p.requisitionAdminName).trim(),
          ),
        )
      }
      return next
    },
  }),

  order: createBillMockStore({
    prefix: 'PO',
    seedList: [
      bill({
        id: 1,
        billCode: 'PO-20260925001',
        supplierName: '苏州精密传动有限公司',
        supplierCode: 'SUP-1001',
        arrivalDate: '2026-10-08',
        settleStatus: '未结算',
        invoiceStatus: '未开票',
        contractNo: 'CT-PO-001',
        itemList: sampleItems(2),
        ...withAmount(sampleItems(2)),
      }),
      bill({
        id: 2,
        billCode: 'PO-20260922002',
        billDate: '2026-09-22',
        status: '已审核',
        supplierName: '德科集团',
        supplierCode: 'SUP-1004',
        arrivalDate: '2026-09-30',
        settleStatus: '部分结算',
        invoiceStatus: '部分开票',
        verifyData: '刘洋 / 2026-09-22 16:40',
        itemList: [materials[2]],
        ...withAmount([materials[2]]),
      }),
      bill({
        id: 3,
        billCode: 'PO-20260910003',
        billDate: '2026-09-10',
        status: '已完结',
        supplierName: '华东五金批发',
        supplierCode: 'SUP-1002',
        arrivalDate: '2026-09-18',
        settleStatus: '已结算',
        invoiceStatus: '已开票',
        verifyData: '张伟 / 2026-09-10 14:00',
        itemList: [materials[1]],
        ...withAmount([materials[1]]),
      }),
    ],
    filterFn: supplierFilter,
  }),

  inbound: createBillMockStore({
    prefix: 'PI',
    seedList: [
      bill({
        id: 1,
        billCode: 'PI-20260925001',
        sourceBillCode: 'PO-20260922002',
        sourceBillType: '采购订单',
        supplierName: '德科集团',
        settleStatus: '未结算',
        itemList: [
          {
            ...materials[2],
            number: 3,
            stockName: '成品仓',
            locationName: 'F-03-01',
          },
        ],
        ...withAmount([{ ...materials[2], number: 3 }]),
      }),
      bill({
        id: 2,
        billCode: 'PI-20260918002',
        billDate: '2026-09-18',
        status: '已审核',
        sourceBillCode: 'PO-20260910003',
        sourceBillType: '采购订单',
        supplierName: '华东五金批发',
        settleStatus: '已结算',
        verifyData: '王强 / 2026-09-18 17:10',
        itemList: [
          {
            ...materials[1],
            stockName: '原材料仓',
            locationName: 'B-02-03',
          },
        ],
        ...withAmount([materials[1]]),
      }),
    ],
    filterFn: supplierFilter,
  }),

  returnExchange: createBillMockStore({
    prefix: 'PX',
    seedList: [
      bill({
        id: 1,
        billCode: 'PX-20260925001',
        refundType: '退货',
        sourceBillCode: 'PI-20260918002',
        sourceBillType: '采购入库',
        supplierName: '华东五金批发',
        instockStatus: '未入库',
        outstockStatus: '待出库',
        itemList: [
          { ...materials[1], number: 2, refundNumber: 2 },
        ],
        ...withAmount([{ ...materials[1], number: 2 }]),
      }),
      bill({
        id: 2,
        billCode: 'PX-20260915002',
        billDate: '2026-09-15',
        status: '已审核',
        refundType: '换货',
        sourceBillCode: 'PI-20260918002',
        sourceBillType: '采购入库',
        supplierName: '华东五金批发',
        instockStatus: '待入库',
        outstockStatus: '已出库',
        verifyData: '陈浩 / 2026-09-15 11:00',
        itemList: [
          { ...materials[1], number: 1, refundNumber: 1 },
        ],
        ...withAmount([{ ...materials[1], number: 1 }]),
      }),
    ],
    filterFn: (rows, p) => {
      let next = supplierFilter(rows, p)
      if (p.refundType) {
        next = next.filter((r) =>
          String(r.refundType || '').includes(String(p.refundType).trim()),
        )
      }
      return next
    },
  }),

  returnOut: createBillMockStore({
    prefix: 'RO',
    seedList: [
      bill({
        id: 1,
        billCode: 'RO-20260925001',
        refundType: '退货',
        sourceBillCode: 'PX-20260925001',
        sourceBillType: '采购退换',
        supplierName: '华东五金批发',
        itemList: [
          {
            ...materials[1],
            number: 2,
            stockName: '原材料仓',
            locationName: 'B-02-03',
          },
        ],
        ...withAmount([{ ...materials[1], number: 2 }]),
      }),
    ],
    filterFn: supplierFilter,
  }),

  exchangeIn: createBillMockStore({
    prefix: 'EI',
    seedList: [
      bill({
        id: 1,
        billCode: 'EI-20260925001',
        sourceBillCode: 'PX-20260915002',
        sourceBillType: '采购退换',
        supplierName: '华东五金批发',
        itemList: [
          {
            ...materials[1],
            number: 1,
            stockName: '原材料仓',
            locationName: 'B-02-03',
          },
        ],
        ...withAmount([{ ...materials[1], number: 1 }]),
      }),
    ],
    filterFn: supplierFilter,
  }),
}

export function getPurchaseBillStore(key) {
  const store = billStores[key]
  if (!store) throw new Error(`未知采购单据类型: ${key}`)
  return store
}
