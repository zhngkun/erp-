import { createBillMockStore, todayStr } from '../stock/_helpers'

function feeItem(partial = {}) {
  return {
    feeName: '办公费',
    amount: 1000,
    remark: '',
    materialName: '',
    number: 1,
    salePrice: 0,
    costPrice: 0,
    sourceBillType: '',
    sourceBillCode: '',
    ...partial,
  }
}

function bill(partial) {
  const items = partial.itemList || [feeItem()]
  const amount = items.reduce((s, i) => s + Number(i.amount || 0), 0)
  return {
    billDate: todayStr(),
    status: '待审核',
    createAdminName: '张伟',
    createdAt: `${todayStr()} 10:20:00`,
    remark: '',
    verifyData: '',
    auditName: '',
    numberTotal: items.length,
    amount: Number(amount.toFixed(2)),
    amountTotal: Number(amount.toFixed(2)),
    itemList: items,
    itemSummary: items
      .map((i) => i.feeName || i.materialName || i.sourceBillCode)
      .filter(Boolean)
      .join('、'),
    ...partial,
  }
}

function filterBy(keys) {
  return (rows, p) => {
    let next = rows
    for (const key of keys) {
      if (p[key]) {
        next = next.filter((r) =>
          String(r[key] || '').includes(String(p[key]).trim()),
        )
      }
    }
    return next
  }
}

export const billStores = {
  expense: createBillMockStore({
    prefix: 'CE',
    seedList: [
      bill({
        id: 1,
        billCode: 'CE-20260925001',
        personType: '供应商',
        personName: '华东五金批发',
        paytypeName: '工商银行',
        isPay: '是',
        itemList: [feeItem({ feeName: '运输费', amount: 860 })],
        amount: 860,
        amountTotal: 860,
      }),
      bill({
        id: 2,
        billCode: 'CE-20260918002',
        billDate: '2026-09-18',
        status: '已审核',
        personType: '其他',
        personName: '物业公司',
        paytypeName: '现金',
        isPay: '是',
        verifyData: '王强 / 2026-09-18 15:00',
        auditName: '王强',
        itemList: [feeItem({ feeName: '水电费', amount: 1260 })],
        amount: 1260,
        amountTotal: 1260,
      }),
    ],
    filterFn: filterBy(['personName']),
  }),

  payable: createBillMockStore({
    prefix: 'AP',
    seedList: [
      bill({
        id: 1,
        billCode: 'AP-20260925001',
        supplierName: '苏州精密传动有限公司',
        sourceBillCode: 'PI-20260925001',
        amount: 8678.4,
        paidAmount: 0,
        unpaidAmount: 8678.4,
        reconciliationStatus: '未对账',
        itemList: [feeItem({ feeName: '采购应付', amount: 8678.4 })],
      }),
      bill({
        id: 2,
        billCode: 'AP-20260918002',
        billDate: '2026-09-18',
        status: '已审核',
        supplierName: '华东五金批发',
        sourceBillCode: 'PI-20260918002',
        amount: 8407.2,
        paidAmount: 8407.2,
        unpaidAmount: 0,
        reconciliationStatus: '已对账',
        verifyData: '刘洋 / 2026-09-18 17:20',
        itemList: [feeItem({ feeName: '采购应付', amount: 8407.2 })],
      }),
    ],
    filterFn: filterBy(['supplierName']),
  }),

  payment: createBillMockStore({
    prefix: 'CP',
    seedList: [
      bill({
        id: 1,
        billCode: 'CP-20260925001',
        paymentPersonType: '供应商',
        supplierName: '苏州精密传动有限公司',
        supplierCode: 'SUP-1001',
        payType: '货款',
        paytypeName: '工商银行',
        isTodaySettlement: '否',
        currencyName: '人民币',
        currencyExchangeRate: 1,
        operateDeptName: '采购部',
        operateAdminName: '张伟',
        amountTotal: 5000,
        payAmount: 5000,
        amountTotalLocal: 5000,
        payAmountLocal: 5000,
        reconciliationStatus: '未对账',
        contractNo: 'CT-PO-001',
        itemList: [feeItem({ feeName: '货款', amount: 5000 })],
      }),
      bill({
        id: 2,
        billCode: 'CP-20260918002',
        billDate: '2026-09-18',
        status: '已审核',
        paymentPersonType: '供应商',
        supplierName: '华东五金批发',
        supplierCode: 'SUP-1002',
        payType: '货款',
        paytypeName: '支付宝',
        isTodaySettlement: '是',
        currencyName: '人民币',
        currencyExchangeRate: 1,
        operateDeptName: '财务部',
        operateAdminName: '王强',
        amountTotal: 8407.2,
        payAmount: 8407.2,
        amountTotalLocal: 8407.2,
        payAmountLocal: 8407.2,
        reconciliationStatus: '已对账',
        verifyData: '刘洋 / 2026-09-18 17:40',
        itemList: [feeItem({ feeName: '货款', amount: 8407.2 })],
      }),
    ],
    filterFn: filterBy(['supplierName']),
  }),

  income: createBillMockStore({
    prefix: 'CI',
    seedList: [
      bill({
        id: 1,
        billCode: 'CI-20260925001',
        personType: '客户',
        personName: '测试客户01',
        paytypeName: '微信',
        isPay: '是',
        itemList: [feeItem({ feeName: '服务费收入', amount: 3200 })],
        amount: 3200,
        amountTotal: 3200,
      }),
      bill({
        id: 2,
        billCode: 'CI-20260912002',
        billDate: '2026-09-12',
        status: '已审核',
        personType: '其他',
        personName: '利息收入',
        paytypeName: '工商银行',
        isPay: '是',
        verifyData: '李娜 / 2026-09-12 09:30',
        itemList: [feeItem({ feeName: '利息', amount: 186.5 })],
        amount: 186.5,
        amountTotal: 186.5,
      }),
    ],
    filterFn: filterBy(['personName']),
  }),

  receivable: createBillMockStore({
    prefix: 'AR',
    seedList: [
      bill({
        id: 1,
        billCode: 'AR-20260925001',
        customerName: '测试客户01',
        sourceBillCode: 'SX-20260925001',
        amount: 2486,
        receivedAmount: 0,
        unreceivedAmount: 2486,
        reconciliationStatus: '未对账',
        itemList: [feeItem({ feeName: '销售应收', amount: 2486 })],
      }),
      bill({
        id: 2,
        billCode: 'AR-20260915002',
        billDate: '2026-09-15',
        status: '已审核',
        customerName: '德科集团采购中心',
        sourceBillCode: 'SX-20260915002',
        amount: 7593.6,
        receivedAmount: 7593.6,
        unreceivedAmount: 0,
        reconciliationStatus: '已对账',
        verifyData: '周杰 / 2026-09-15 16:00',
        itemList: [feeItem({ feeName: '销售应收', amount: 7593.6 })],
      }),
    ],
    filterFn: filterBy(['customerName']),
  }),

  receipt: createBillMockStore({
    prefix: 'CR',
    seedList: [
      bill({
        id: 1,
        billCode: 'CR-20260925001',
        customerName: '测试客户01',
        customerCode: '192418',
        payType: '货款',
        paytypeName: '微信',
        isTodaySettlement: '否',
        currencyName: '人民币',
        currencyExchangeRate: 1,
        amountTotal: 2486,
        payAmount: 2000,
        amountTotalLocal: 2486,
        payAmountLocal: 2000,
        reconciliationStatus: '未对账',
        operateDeptName: '销售部',
        itemList: [feeItem({ feeName: '货款', amount: 2000 })],
      }),
      bill({
        id: 2,
        billCode: 'CR-20260915002',
        billDate: '2026-09-15',
        status: '已审核',
        customerName: '德科集团采购中心',
        customerCode: 'CUST-2004',
        payType: '货款',
        paytypeName: '工商银行',
        isTodaySettlement: '是',
        currencyName: '人民币',
        currencyExchangeRate: 1,
        amountTotal: 7593.6,
        payAmount: 7593.6,
        amountTotalLocal: 7593.6,
        payAmountLocal: 7593.6,
        reconciliationStatus: '已对账',
        operateDeptName: '财务部',
        contractNo: 'CT-SO-004',
        verifyData: '周杰 / 2026-09-15 16:20',
        itemList: [feeItem({ feeName: '货款', amount: 7593.6 })],
      }),
    ],
    filterFn: filterBy(['customerName']),
  }),

  transfer: createBillMockStore({
    prefix: 'CT',
    seedList: [
      bill({
        id: 1,
        billCode: 'CT-20260925001',
        sourcePaytypeName: '工商银行',
        toPaytypeName: '支付宝',
        amount: 10000,
        sourceServiceFee: 0,
        toServiceFee: 0,
        toAmount: 10000,
        itemList: [feeItem({ feeName: '资金调拨', amount: 10000 })],
      }),
      bill({
        id: 2,
        billCode: 'CT-20260910002',
        billDate: '2026-09-10',
        status: '已审核',
        sourcePaytypeName: '现金',
        toPaytypeName: '工商银行',
        amount: 5000,
        sourceServiceFee: 0,
        toServiceFee: 0,
        toAmount: 5000,
        verifyData: '王强 / 2026-09-10 11:00',
        itemList: [feeItem({ feeName: '存现', amount: 5000 })],
      }),
    ],
  }),

  fee: createBillMockStore({
    prefix: 'CF',
    seedList: [
      bill({
        id: 1,
        billCode: 'CF-20260925001',
        sourceBillCode: 'SO-20260925001',
        sourceBillType: '销售订单',
        personType: '客户',
        personName: '测试客户01',
        paytypeName: '现金',
        isPay: '否',
        itemList: [feeItem({ feeName: '快递费', amount: 45 })],
        amount: 45,
        amountTotal: 45,
      }),
      bill({
        id: 2,
        billCode: 'CF-20260916002',
        billDate: '2026-09-16',
        status: '已审核',
        sourceBillCode: 'PO-20260922002',
        sourceBillType: '采购订单',
        personType: '供应商',
        personName: '德科集团',
        paytypeName: '工商银行',
        isPay: '是',
        verifyData: '陈浩 / 2026-09-16 14:00',
        itemList: [feeItem({ feeName: '运费', amount: 320 })],
        amount: 320,
        amountTotal: 320,
      }),
    ],
    filterFn: filterBy(['personName']),
  }),

  reimburse: createBillMockStore({
    prefix: 'BX',
    seedList: [
      bill({
        id: 1,
        billCode: 'BX-20260925001',
        operateAdminName: '李娜',
        operateDeptName: '销售部',
        itemList: [
          feeItem({ feeName: '差旅费', amount: 680 }),
          feeItem({ feeName: '餐饮费', amount: 210 }),
        ],
        amount: 890,
        amountTotal: 890,
      }),
      bill({
        id: 2,
        billCode: 'BX-20260908002',
        billDate: '2026-09-08',
        status: '已审核',
        operateAdminName: '周杰',
        operateDeptName: '技术部',
        verifyData: '张伟 / 2026-09-08 17:00',
        itemList: [feeItem({ feeName: '交通费', amount: 156 })],
        amount: 156,
        amountTotal: 156,
      }),
    ],
    filterFn: filterBy(['operateAdminName']),
  }),

  outputInvoice: createBillMockStore({
    prefix: 'OI',
    seedList: [
      bill({
        id: 1,
        billCode: 'OI-20260925001',
        customerName: '德科集团采购中心',
        sourceBillCode: 'SX-20260915002',
        invoiceType: '增值税专用发票',
        invoiceNumber: '044002509250001',
        taxNo: '91310000MA1KXXXX1X',
        taxPriceTotal: 7593.6,
        amountTotal: 7593.6,
        itemList: [
          feeItem({
            materialName: '伺服电机 750W',
            feeName: '伺服电机 750W',
            number: 4,
            salePrice: 1680,
            amount: 7593.6,
          }),
        ],
      }),
    ],
    filterFn: filterBy(['customerName']),
  }),

  inputInvoice: createBillMockStore({
    prefix: 'II',
    seedList: [
      bill({
        id: 1,
        billCode: 'II-20260925001',
        supplierName: '苏州精密传动有限公司',
        sourceBillCode: 'PI-20260925001',
        invoiceType: '增值税专用发票',
        invoiceNumber: '310002509250088',
        taxNo: '91320500MA1KYYYY2Y',
        taxPriceTotal: 8678.4,
        amountTotal: 8678.4,
        itemList: [
          feeItem({
            materialName: '伺服电机 750W',
            feeName: '伺服电机 750W',
            number: 6,
            costPrice: 1280,
            amount: 8678.4,
          }),
        ],
      }),
    ],
    filterFn: filterBy(['supplierName']),
  }),

  customerReconcile: createBillMockStore({
    prefix: 'CS',
    seedList: [
      bill({
        id: 1,
        billCode: 'CS-20260925001',
        customerName: '测试客户01',
        amount: 2486,
        discountAmount: 0,
        amountTotal: 2486,
        itemList: [
          feeItem({
            sourceBillType: '销售出库',
            sourceBillCode: 'SX-20260925001',
            feeName: '销售出库',
            amount: 2486,
          }),
        ],
      }),
      bill({
        id: 2,
        billCode: 'CS-20260915002',
        billDate: '2026-09-15',
        status: '已审核',
        customerName: '德科集团采购中心',
        amount: 7593.6,
        discountAmount: 93.6,
        amountTotal: 7500,
        verifyData: '周杰 / 2026-09-15 18:00',
        itemList: [
          feeItem({
            sourceBillType: '销售出库',
            sourceBillCode: 'SX-20260915002',
            feeName: '销售出库',
            amount: 7593.6,
          }),
        ],
      }),
    ],
    filterFn: filterBy(['customerName']),
  }),

  supplierReconcile: createBillMockStore({
    prefix: 'SS',
    seedList: [
      bill({
        id: 1,
        billCode: 'SS-20260925001',
        supplierName: '苏州精密传动有限公司',
        amount: 8678.4,
        discountAmount: 0,
        amountTotal: 8678.4,
        itemList: [
          feeItem({
            sourceBillType: '采购入库',
            sourceBillCode: 'PI-20260925001',
            feeName: '采购入库',
            amount: 8678.4,
          }),
        ],
      }),
    ],
    filterFn: filterBy(['supplierName']),
  }),
}

export function getCashBillStore(key) {
  const store = billStores[key]
  if (!store) throw new Error(`未知往来现金单据类型: ${key}`)
  return store
}
