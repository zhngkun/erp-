import { createBillMockStore, todayStr } from '../stock/_helpers'

function base(partial = {}) {
  return {
    billDate: todayStr(),
    status: '已审核',
    createdAt: `${todayStr()} 10:00:00`,
    updatedAt: `${todayStr()} 10:00:00`,
    ...partial,
  }
}

function filterBy(keys) {
  return (rows, p) => {
    let next = rows
    for (const key of keys) {
      if (p[key] !== undefined && p[key] !== null && p[key] !== '') {
        next = next.filter((r) =>
          String(r[key] ?? '').includes(String(p[key]).trim()),
        )
      }
    }
    return next
  }
}

export const reportStores = {
  stockStatistics: createBillMockStore({
    prefix: 'STK',
    seedList: [
      base({
        id: 1,
        billCode: 'STK-001',
        stockName: '原料仓',
        materialName: '铝合金型材',
        spec: '6061-T6',
        code: 'RM-ALU-001',
        categoryName: '原材料',
        brandName: '华铝',
        numberTotal: 1280,
        showNumberTotal: 1280,
        averagePrice: 42.5,
        costPriceTotal: 54400,
        lastInstockPrice: 43.2,
        beginStockNumber: 1000,
        durationInstockNumber: 500,
        durationOutstockNumber: 220,
        endStockNumber: 1280,
      }),
      base({
        id: 2,
        billCode: 'STK-002',
        stockName: '成品仓',
        materialName: '伺服电机总成',
        spec: '1.5KW',
        code: 'FG-SV-015',
        categoryName: '成品',
        brandName: '自研',
        numberTotal: 86,
        showNumberTotal: 86,
        averagePrice: 2180,
        costPriceTotal: 187480,
        lastInstockPrice: 2200,
        beginStockNumber: 60,
        durationInstockNumber: 40,
        durationOutstockNumber: 14,
        endStockNumber: 86,
      }),
    ],
    filterFn: filterBy(['materialName', 'code', 'stockName']),
  }),

  purchaseStatistics: createBillMockStore({
    prefix: 'PS',
    seedList: [
      base({
        id: 1,
        billCode: 'PS-001',
        materialName: '铝合金型材',
        code: 'RM-ALU-001',
        spec: '6061-T6',
        purchaseNumber: 500,
        unitName: 'kg',
        currencyName: '人民币',
        purchasePriceTotal: 21600,
        refundNumber: 20,
        refundPriceTotal: 864,
        actualPriceTotal: 20736,
        taxActualPriceTotal: 23431.68,
      }),
      base({
        id: 2,
        billCode: 'PS-002',
        materialName: '轴承 6205',
        code: 'RM-BRG-205',
        spec: 'P5',
        purchaseNumber: 2000,
        unitName: '个',
        currencyName: '人民币',
        purchasePriceTotal: 16000,
        refundNumber: 0,
        refundPriceTotal: 0,
        actualPriceTotal: 16000,
        taxActualPriceTotal: 18080,
      }),
    ],
    filterFn: filterBy(['materialName', 'code']),
  }),

  saleStatistics: createBillMockStore({
    prefix: 'SS',
    seedList: [
      base({
        id: 1,
        billCode: 'SS-001',
        materialName: '伺服电机总成',
        code: 'FG-SV-015',
        spec: '1.5KW',
        saleNumber: 24,
        unitName: '台',
        currencyName: '人民币',
        salePriceTotal: 72000,
        saleCostPriceTotal: 52320,
        refundNumber: 1,
        refundPriceTotal: 3000,
        refundCostPriceTotal: 2180,
        actualPriceTotal: 69000,
        profit: 18860,
        profitMargin: 27.33,
        taxActualPriceTotal: 77970,
        taxProfit: 21311.8,
        taxProfitMargin: 27.33,
      }),
      base({
        id: 2,
        billCode: 'SS-002',
        materialName: '控制柜总成',
        code: 'FG-CTL-01',
        spec: '标准型',
        saleNumber: 12,
        unitName: '台',
        currencyName: '人民币',
        salePriceTotal: 96000,
        saleCostPriceTotal: 62400,
        refundNumber: 0,
        refundPriceTotal: 0,
        refundCostPriceTotal: 0,
        actualPriceTotal: 96000,
        profit: 33600,
        profitMargin: 35,
        taxActualPriceTotal: 108480,
        taxProfit: 37968,
        taxProfitMargin: 35,
      }),
    ],
    filterFn: filterBy(['materialName', 'code']),
  }),

  ledger: createBillMockStore({
    prefix: 'LG',
    seedList: [
      base({
        id: 1,
        billCode: 'LG-001',
        customerName: '华东智造有限公司',
        startBalanceLocal: 128000,
        receiptAmountLocal: 256000,
        receivedAmountLocal: 198000,
        endBalanceLocal: 186000,
      }),
      base({
        id: 2,
        billCode: 'LG-002',
        customerName: '南方精工股份',
        startBalanceLocal: 45000,
        receiptAmountLocal: 88000,
        receivedAmountLocal: 88000,
        endBalanceLocal: 45000,
      }),
      base({
        id: 3,
        billCode: 'LG-003',
        customerName: '北辰自动化',
        startBalanceLocal: 0,
        receiptAmountLocal: 32000,
        receivedAmountLocal: 12000,
        endBalanceLocal: 20000,
      }),
    ],
    filterFn: filterBy(['customerName']),
  }),

  production: createBillMockStore({
    prefix: 'PR',
    seedList: [
      base({
        id: 1,
        billCode: 'GX-20260922001',
        productionOrderCode: 'MO-20260915001',
        inspectionBillCode: 'JY-20260922001',
        contractNo: 'HT-2026-088',
        procedureName: '精加工',
        deptName: '机加车间',
        createAdminName: '李工',
        materialName: '伺服电机总成',
        spec: '1.5KW',
        code: 'FG-SV-015',
        number: 20,
        qualifiedNumber: 19,
        unqualifiedNumber: 1,
        inspectionNumber: 20,
        inspectionQualifiedNumber: 19,
        inspectionUnqualifiedNumber: 1,
        inspectionQualifiedProportion: 95,
        unqualifiedHandleMethod: '返工',
        unitName: '台',
        processingMethod: '自制',
        salaryType: '计件',
        actualWorkTime: 16.5,
        sumOutStockNumber: 40,
        sumReturnInStockNumber: 2,
      }),
      base({
        id: 2,
        billCode: 'GX-20260920002',
        billDate: '2026-09-20',
        productionOrderCode: 'MO-20260910002',
        inspectionBillCode: '',
        contractNo: 'HT-2026-076',
        procedureName: '装配',
        deptName: '装配车间',
        createAdminName: '王芳',
        materialName: '控制柜总成',
        spec: '标准型',
        code: 'FG-CTL-01',
        number: 12,
        qualifiedNumber: 12,
        unqualifiedNumber: 0,
        inspectionNumber: 12,
        inspectionQualifiedNumber: 12,
        inspectionUnqualifiedNumber: 0,
        inspectionQualifiedProportion: 100,
        unqualifiedHandleMethod: '',
        unitName: '台',
        processingMethod: '自制',
        salaryType: '计时',
        actualWorkTime: 24,
        sumOutStockNumber: 36,
        sumReturnInStockNumber: 0,
      }),
    ],
    filterFn: filterBy(['productionOrderCode', 'materialName', 'procedureName']),
  }),

  boardSales: createBillMockStore({
    prefix: 'BS',
    seedList: [
      base({
        id: 1,
        billCode: 'SO-20260918001',
        contractNo: 'HT-2026-088',
        customerName: '华东智造有限公司',
        customerCode: 'C-10086',
        status: '已审核',
        materialName: '伺服电机总成',
        spec: '1.5KW',
        currencyName: '人民币',
        itemNumber: 24,
        itemOutstockNumber: 18,
        unOutstockNumber: 6,
      }),
      base({
        id: 2,
        billCode: 'SO-20260920002',
        billDate: '2026-09-20',
        contractNo: 'HT-2026-090',
        customerName: '北辰自动化',
        customerCode: 'C-10092',
        status: '待审核',
        materialName: '控制柜总成',
        spec: '标准型',
        currencyName: '人民币',
        itemNumber: 8,
        itemOutstockNumber: 0,
        unOutstockNumber: 8,
      }),
    ],
    filterFn: filterBy(['customerName', 'materialName']),
  }),

  boardPurchase: createBillMockStore({
    prefix: 'BP',
    seedList: [
      base({
        id: 1,
        billCode: 'PO-20260916001',
        contractNo: 'CG-2026-055',
        supplierName: '华铝材料',
        status: '已审核',
        materialName: '铝合金型材',
        spec: '6061-T6',
        currencyName: '人民币',
        itemNumber: 500,
      }),
      base({
        id: 2,
        billCode: 'PO-20260921002',
        billDate: '2026-09-21',
        contractNo: 'CG-2026-061',
        supplierName: '精工轴承厂',
        status: '待审核',
        materialName: '轴承 6205',
        spec: 'P5',
        currencyName: '人民币',
        itemNumber: 2000,
      }),
    ],
    filterFn: filterBy(['supplierName', 'materialName']),
  }),

  boardFinance: createBillMockStore({
    prefix: 'BF',
    seedList: [
      base({
        id: 1,
        billCode: 'BF-001',
        boardType: '收款看板',
        period: '2026-09',
        amount: 386500,
        billCount: 28,
        status: '已完成',
      }),
      base({
        id: 2,
        billCode: 'BF-002',
        boardType: '付款看板',
        period: '2026-09',
        amount: 214800,
        billCount: 19,
        status: '进行中',
      }),
    ],
    filterFn: filterBy(['boardType', 'period']),
  }),

  boardStock: createBillMockStore({
    prefix: 'BST',
    seedList: [
      base({
        id: 1,
        billCode: 'BST-001',
        stockName: '原料仓',
        locationName: 'A-01-02',
        materialName: '铝合金型材',
        spec: '6061-T6',
        code: 'RM-ALU-001',
        numberTotal: 1280,
      }),
      base({
        id: 2,
        billCode: 'BST-002',
        stockName: '成品仓',
        locationName: 'C-03-01',
        materialName: '伺服电机总成',
        spec: '1.5KW',
        code: 'FG-SV-015',
        numberTotal: 86,
      }),
    ],
    filterFn: filterBy(['stockName', 'materialName', 'code']),
  }),

  boardProduction: createBillMockStore({
    prefix: 'BPD',
    seedList: [
      base({
        id: 1,
        billCode: 'MO-20260915001',
        businessType: '标准生产',
        contractNo: 'HT-2026-088',
        materialName: '伺服电机总成',
        spec: '1.5KW',
        number: 24,
        reportNumber: 20,
        qualifiedNumber: 19,
        instockNumber: 12,
        completeStatus: '未完工',
        status: '未完工',
      }),
      base({
        id: 2,
        billCode: 'MO-20260910002',
        billDate: '2026-09-10',
        businessType: '返工生产',
        contractNo: 'HT-2026-076',
        materialName: '控制柜总成',
        spec: '标准型',
        number: 12,
        reportNumber: 12,
        qualifiedNumber: 12,
        instockNumber: 12,
        completeStatus: '已完工',
        status: '已完工',
      }),
    ],
    filterFn: (rows, p) => {
      let next = filterBy(['materialName'])(rows, p)
      if (p.completeStatus) {
        next = next.filter((r) => r.completeStatus === p.completeStatus)
      }
      return next
    },
  }),

  boardSurvey: createBillMockStore({
    prefix: 'SV',
    seedList: [
      base({
        id: 1,
        billCode: 'SV-001',
        name: '客户满意度调研 Q3',
        ownerName: '周敏',
        deptName: '市场部',
        progress: '收集中',
        completeRate: 68,
        status: '进行中',
      }),
      base({
        id: 2,
        billCode: 'SV-002',
        name: '供应商交期专项调查',
        ownerName: '陈强',
        deptName: '采购部',
        progress: '已汇总',
        completeRate: 100,
        status: '已完成',
      }),
    ],
    filterFn: filterBy(['name', 'ownerName']),
  }),

  boardOps: createBillMockStore({
    prefix: 'OPS',
    seedList: [
      base({
        id: 1,
        billCode: 'OPS-001',
        metricName: '本月经营概览',
        saleAmount: 1286500,
        purchaseAmount: 864200,
        momRate: 8.6,
      }),
      base({
        id: 2,
        billCode: 'OPS-002',
        metricName: '本周经营概览',
        saleAmount: 286400,
        purchaseAmount: 198500,
        momRate: -2.1,
      }),
      base({
        id: 3,
        billCode: 'OPS-003',
        metricName: '今日经营概览',
        saleAmount: 42500,
        purchaseAmount: 31800,
        momRate: 1.4,
      }),
    ],
    filterFn: filterBy(['metricName']),
  }),
}

export function getReportStore(key) {
  const store = reportStores[key]
  if (!store) throw new Error(`未知报表 store: ${key}`)
  return store
}
