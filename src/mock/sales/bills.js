import { createBillMockStore, itemLine, todayStr } from '../stock/_helpers'

function bill(partial) {
  const items = partial.itemList || [
    itemLine({ salePrice: 36, taxRate: 13, taxSalePrice: 40.68 }),
  ]
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
    number: 100,
    salePrice: 36,
    taxRate: 13,
    taxSalePrice: 40.68,
  }),
  itemLine({
    materialName: '不锈钢板 304',
    spec: '1.2mm×1220×2440',
    code: 'SKU-SS304-12',
    number: 20,
    unitName: '张',
    stockName: '成品仓',
    locationName: 'F-01-02',
    salePrice: 220,
    taxRate: 13,
    taxSalePrice: 248.6,
  }),
  itemLine({
    materialName: '伺服电机 750W',
    spec: '750W/220V',
    code: 'SKU-SVO-750',
    number: 4,
    unitName: '台',
    stockName: '成品仓',
    locationName: 'F-03-01',
    salePrice: 1680,
    taxRate: 13,
    taxSalePrice: 1898.4,
  }),
]

function sampleItems(n = 2) {
  return materials.slice(0, n).map((m) => ({ ...m }))
}

function withAmount(items) {
  const amount = items.reduce(
    (s, i) =>
      s +
      Number(i.number || 0) * Number(i.taxSalePrice || i.salePrice || 0),
    0,
  )
  const val = Number(amount.toFixed(2))
  return {
    amountTotal: val,
    salePriceTotal: val,
    materialPriceTotal: val,
    feeAmountTotal: 0,
    discountAmount: 0,
    amountTotalLocal: val,
  }
}

function customerFilter(rows, p) {
  let next = rows
  if (p.customerName) {
    next = next.filter((r) =>
      String(r.customerName || '').includes(String(p.customerName).trim()),
    )
  }
  if (p.salesmanName) {
    next = next.filter((r) =>
      String(r.salesmanName || '').includes(String(p.salesmanName).trim()),
    )
  }
  if (p.refundType) {
    next = next.filter((r) =>
      String(r.refundType || '').includes(String(p.refundType).trim()),
    )
  }
  return next
}

export const billStores = {
  quote: createBillMockStore({
    prefix: 'SQ',
    seedList: [
      bill({
        id: 1,
        billCode: 'SQ-20260925001',
        customerName: '测试客户01',
        customerCode: '192418',
        contractNo: 'QT-2026-001',
        itemList: sampleItems(2),
        ...withAmount(sampleItems(2)),
      }),
      bill({
        id: 2,
        billCode: 'SQ-20260918002',
        billDate: '2026-09-18',
        status: '已审核',
        customerName: '苏州精密传动有限公司',
        customerCode: 'CUST-2001',
        verifyData: '王强 / 2026-09-18 15:20',
        itemList: [materials[2]],
        ...withAmount([materials[2]]),
      }),
    ],
    filterFn: customerFilter,
  }),

  order: createBillMockStore({
    prefix: 'SO',
    seedList: [
      bill({
        id: 1,
        billCode: 'SO-20260925001',
        customerName: '测试客户01',
        customerCode: '192418',
        salesmanName: '李娜',
        currencyName: '人民币',
        currencyExchangeRate: 1,
        deliveryDate: '2026-10-10',
        lockStock: '否',
        settleStatus: '未结算',
        invoiceStatus: '未开票',
        contractNo: 'CT-SO-001',
        itemList: sampleItems(2),
        ...withAmount(sampleItems(2)),
      }),
      bill({
        id: 2,
        billCode: 'SO-20260920002',
        billDate: '2026-09-20',
        status: '已审核',
        customerName: '云仓优选旗舰店',
        customerCode: 'CUST-2006',
        salesmanName: '周杰',
        currencyName: '人民币',
        currencyExchangeRate: 1,
        deliveryDate: '2026-09-28',
        lockStock: '是',
        settleStatus: '部分结算',
        invoiceStatus: '部分开票',
        verifyData: '张伟 / 2026-09-20 11:00',
        itemList: [materials[1]],
        ...withAmount([materials[1]]),
      }),
      bill({
        id: 3,
        billCode: 'SO-20260908003',
        billDate: '2026-09-08',
        status: '已完结',
        customerName: '德科集团采购中心',
        customerCode: 'CUST-2004',
        salesmanName: '刘洋',
        currencyName: '人民币',
        currencyExchangeRate: 1,
        deliveryDate: '2026-09-15',
        lockStock: '否',
        settleStatus: '已结算',
        invoiceStatus: '已开票',
        verifyData: '陈浩 / 2026-09-08 16:30',
        itemList: [materials[2]],
        ...withAmount([materials[2]]),
      }),
    ],
    filterFn: customerFilter,
  }),

  outbound: createBillMockStore({
    prefix: 'SX',
    seedList: [
      bill({
        id: 1,
        billCode: 'SX-20260925001',
        sourceBillCode: 'SO-20260920002',
        sourceBillType: '销售订单',
        customerName: '云仓优选旗舰店',
        customerCode: 'CUST-2006',
        salesmanName: '周杰',
        financeStatus: '未收款',
        invoiceStatus: '未开票',
        currencyName: '人民币',
        currencyExchangeRate: 1,
        numberTotal: 10,
        salePriceTotal: 12800,
        taxSalePriceTotal: 14464,
        discountAmount: 0,
        amountTotal: 14464,
        costPriceTotal: 9000,
        amountTotalLocal: 14464,
        settledAmount: 0,
        unsettledAmount: 14464,
        payExpireDate: '2026-10-25',
        payWarnDays: 7,
        contractNo: 'HT-2026-100',
        externalOrderNo: 'SO-EXT-2001',
        isSendCommission: 1,
        commissionOne: 500,
        commissionOneLeaderName: '张伟',
        commissionTwo: 200,
        commissionTwoLeaderName: '李娜',
        commissionTotal: 700,
        printCount: 0,
        itemList: [
          {
            ...materials[1],
            number: 10,
            stockName: '成品仓',
            locationName: 'F-01-02',
          },
        ],
        ...withAmount([{ ...materials[1], number: 10 }]),
      }),
      bill({
        id: 2,
        billCode: 'SX-20260915002',
        billDate: '2026-09-15',
        status: '已审核',
        sourceBillCode: 'SO-20260908003',
        sourceBillType: '销售订单',
        customerName: '德科集团采购中心',
        customerCode: 'CUST-2004',
        salesmanName: '刘洋',
        financeStatus: '已收款',
        invoiceStatus: '已开票',
        currencyName: '人民币',
        currencyExchangeRate: 1,
        numberTotal: 1,
        salePriceTotal: 8600,
        taxSalePriceTotal: 9718,
        discountAmount: 200,
        amountTotal: 9518,
        costPriceTotal: 6200,
        amountTotalLocal: 9518,
        settledAmount: 9518,
        unsettledAmount: 0,
        payExpireDate: '2026-09-30',
        payWarnDays: 3,
        contractNo: 'HT-2026-076',
        externalOrderNo: '',
        isSendCommission: 0,
        commissionOne: 0,
        commissionOneLeaderName: '',
        commissionTwo: 0,
        commissionTwoLeaderName: '',
        commissionTotal: 0,
        printCount: 2,
        verifyData: '张伟 / 2026-09-15 14:20',
        itemList: [
          {
            ...materials[2],
            stockName: '成品仓',
            locationName: 'F-03-01',
          },
        ],
        ...withAmount([materials[2]]),
      }),
    ],
    filterFn: customerFilter,
  }),

  shipment: createBillMockStore({
    prefix: 'SP',
    seedList: [
      bill({
        id: 1,
        billCode: 'SP-20260925001',
        sourceBillCode: 'SO-20260925001',
        sourceBillType: '销售订单',
        customerName: '测试客户01',
        customerCode: '192418',
        deliveryAdminName: '配送员甲',
        deliveryDate: '2026-09-26',
        arriveDate: '',
        receiptStatus: '未收款',
        itemList: sampleItems(1),
        ...withAmount(sampleItems(1)),
      }),
      bill({
        id: 2,
        billCode: 'SP-20260916002',
        billDate: '2026-09-16',
        status: '已审核',
        sourceBillCode: 'SX-20260915002',
        sourceBillType: '销售出库',
        customerName: '德科集团采购中心',
        customerCode: 'CUST-2004',
        deliveryAdminName: '配送员乙',
        deliveryDate: '2026-09-16',
        arriveDate: '2026-09-17',
        receiptStatus: '已收款',
        verifyData: '周杰 / 2026-09-16 18:00',
        itemList: [materials[2]],
        ...withAmount([materials[2]]),
      }),
    ],
    filterFn: customerFilter,
  }),

  afterSale: createBillMockStore({
    prefix: 'SM',
    seedList: [
      bill({
        id: 1,
        billCode: 'SM-20260925001',
        sourceBillCode: 'SX-20260915002',
        sourceBillType: '销售出库',
        customerName: '德科集团采购中心',
        customerCode: 'CUST-2004',
        responsibleAdminName: '王强',
        processStatus: '处理中',
        itemList: [
          { ...materials[2], number: 1, salePrice: 200, taxSalePrice: 200 },
        ],
        amountTotal: 200,
      }),
      bill({
        id: 2,
        billCode: 'SM-20260912002',
        billDate: '2026-09-12',
        status: '已审核',
        sourceBillCode: 'SO-20260908003',
        customerName: '测试客户01',
        customerCode: '192418',
        responsibleAdminName: '李娜',
        processStatus: '已完成',
        verifyData: '张伟 / 2026-09-12 10:40',
        itemList: [
          { ...materials[0], number: 2, salePrice: 50, taxSalePrice: 50 },
        ],
        amountTotal: 100,
      }),
    ],
    filterFn: customerFilter,
  }),

  returnExchange: createBillMockStore({
    prefix: 'SR',
    seedList: [
      bill({
        id: 1,
        billCode: 'SR-20260925001',
        refundType: '退货',
        sourceBillCode: 'SX-20260925001',
        sourceBillType: '销售出库',
        customerName: '云仓优选旗舰店',
        customerCode: 'CUST-2006',
        instockStatus: '待入库',
        outstockStatus: '无需出库',
        itemList: [{ ...materials[1], number: 2, refundNumber: 2 }],
        ...withAmount([{ ...materials[1], number: 2 }]),
      }),
      bill({
        id: 2,
        billCode: 'SR-20260914002',
        billDate: '2026-09-14',
        status: '已审核',
        refundType: '换货',
        sourceBillCode: 'SX-20260915002',
        sourceBillType: '销售出库',
        customerName: '德科集团采购中心',
        customerCode: 'CUST-2004',
        instockStatus: '已入库',
        outstockStatus: '待出库',
        verifyData: '陈浩 / 2026-09-14 13:10',
        itemList: [{ ...materials[2], number: 1, refundNumber: 1 }],
        ...withAmount([{ ...materials[2], number: 1 }]),
      }),
    ],
    filterFn: customerFilter,
  }),

  returnIn: createBillMockStore({
    prefix: 'RI',
    seedList: [
      bill({
        id: 1,
        billCode: 'RI-20260925001',
        refundType: '退货',
        sourceBillCode: 'SR-20260925001',
        sourceBillType: '销售退换',
        customerName: '云仓优选旗舰店',
        customerCode: 'CUST-2006',
        itemList: [
          {
            ...materials[1],
            number: 2,
            stockName: '成品仓',
            locationName: 'F-01-02',
          },
        ],
        ...withAmount([{ ...materials[1], number: 2 }]),
      }),
    ],
    filterFn: customerFilter,
  }),

  exchangeOut: createBillMockStore({
    prefix: 'EO',
    seedList: [
      bill({
        id: 1,
        billCode: 'EO-20260925001',
        sourceBillCode: 'SR-20260914002',
        sourceBillType: '销售退换',
        customerName: '德科集团采购中心',
        customerCode: 'CUST-2004',
        itemList: [
          {
            ...materials[2],
            number: 1,
            stockName: '成品仓',
            locationName: 'F-03-01',
          },
        ],
        ...withAmount([{ ...materials[2], number: 1 }]),
      }),
    ],
    filterFn: customerFilter,
  }),

  boxSticker: createBillMockStore({
    prefix: 'BX',
    seedList: [
      bill({
        id: 1,
        billCode: 'BX-20260925001',
        sourceBillCode: 'SO-20260920002',
        sourceBillType: '销售订单',
        customerName: '云仓优选旗舰店',
        customerCode: 'CUST-2006',
        packageNumber: 5,
        itemList: [{ ...materials[1], number: 50 }],
        ...withAmount([{ ...materials[1], number: 50 }]),
      }),
    ],
    filterFn: customerFilter,
  }),

  orderChange: createBillMockStore({
    prefix: 'SC',
    seedList: [
      bill({
        id: 1,
        billCode: 'SC-20260925001',
        sourceBillCode: 'SO-20260920002',
        sourceBillType: '销售订单',
        customerName: '云仓优选旗舰店',
        customerCode: 'CUST-2006',
        changeReason: '客户追加数量',
        itemList: [{ ...materials[1], number: 12 }],
        ...withAmount([{ ...materials[1], number: 12 }]),
      }),
    ],
    filterFn: customerFilter,
  }),
}

export function getSalesBillStore(key) {
  const store = billStores[key]
  if (!store) throw new Error(`未知销售单据类型: ${key}`)
  return store
}
