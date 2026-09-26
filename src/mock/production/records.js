import { createBillMockStore, todayStr } from '../stock/_helpers'

function base(partial = {}) {
  return {
    billDate: todayStr(),
    status: '待审核',
    createAdminName: '张伟',
    createdAt: `${todayStr()} 10:20:00`,
    remark: '',
    auditName: '',
    verifyData: '',
    numberTotal: 10,
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

export const productionStores = {
  independentDemand: createBillMockStore({
    prefix: 'ID',
    seedList: [
      base({
        id: 1,
        billCode: 'ID-20260925001',
        materialInfo: '主轴箱体 x10',
        isMrpOperation: '已运算',
        isTransferPurchase: '部分下推',
        isTransferProduction: '未下推',
        isTransferOutsource: '未下推',
        numberTotal: 10,
        contractNo: 'HT-2026-100',
      }),
      base({
        id: 2,
        billCode: 'ID-20260912002',
        billDate: '2026-09-12',
        materialInfo: '液压阀组 x20',
        isMrpOperation: '未运算',
        isTransferPurchase: '未下推',
        isTransferProduction: '未下推',
        isTransferOutsource: '未下推',
        numberTotal: 20,
        contractNo: 'HT-2026-088',
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['contractNo', 'materialInfo']),
  }),

  equipment: createBillMockStore({
    prefix: 'EQ',
    seedList: [
      base({
        id: 1,
        billCode: 'EQ-001',
        name: '立式加工中心-01',
        code: 'EQ-VMC-01',
        supplierName: '苏州精机设备',
        lampCode: 'ANDON-01',
        pulseOutputsNumber: 1,
        workTime: '08:00-17:00',
        runSpeed: 120,
        enable: 1,
        price: 580000,
        productionNumber: 320,
        reportNumber: 300,
        expectedCompletionTime: '2026-09-28 18:00',
        maintenanceCycle: 90,
        maintenanceWarnDay: 7,
        lastMaintenanceTime: '2026-07-01 10:00',
        nextMaintenanceTime: '2026-09-29 10:00',
        priority: 1,
        status: '已审核',
      }),
      base({
        id: 2,
        billCode: 'EQ-002',
        name: '焊接工作站-02',
        code: 'EQ-WELD-02',
        supplierName: '华东焊机',
        lampCode: 'ANDON-02',
        pulseOutputsNumber: 2,
        workTime: '08:00-20:00',
        runSpeed: 80,
        enable: 1,
        price: 120000,
        productionNumber: 150,
        reportNumber: 140,
        expectedCompletionTime: '',
        maintenanceCycle: 60,
        maintenanceWarnDay: 5,
        lastMaintenanceTime: '2026-08-15 09:00',
        nextMaintenanceTime: '2026-10-14 09:00',
        priority: 2,
        status: '待审核',
      }),
    ],
    filterFn: filterBy(['name', 'code', 'supplierName']),
  }),

  inHouse: createBillMockStore({
    prefix: 'MO',
    seedList: [
      base({
        id: 1,
        billCode: 'MO-20260925001',
        sourceBillCode: 'ID-20260925001',
        materialInfo: '主轴箱体 x10',
        completeStatus: '生产中',
        isUrgent: 1,
        responsibleDeptName: '机加车间',
        responsibleAdminName: '李工',
        businessType: '标准生产',
        advanceStartDate: '2026-09-25',
        advanceEndDate: '2026-10-05',
        equipmentName: '立式加工中心-01',
        numberTotal: 10,
        reportNumberTotal: 4,
        waitGetTotal: 6,
        contractNo: 'HT-2026-100',
        createDeptName: '生产部',
      }),
      base({
        id: 2,
        billCode: 'MO-20260910002',
        billDate: '2026-09-10',
        sourceBillCode: 'MPS-20260910002',
        materialInfo: '液压站底板 x5',
        completeStatus: '已完工',
        isUrgent: 0,
        responsibleDeptName: '装配车间',
        responsibleAdminName: '王工',
        businessType: '普通生产',
        advanceStartDate: '2026-09-10',
        advanceEndDate: '2026-09-20',
        equipmentName: '焊接工作站-02',
        numberTotal: 5,
        reportNumberTotal: 5,
        waitGetTotal: 0,
        contractNo: 'HT-2026-076',
        createDeptName: '生产部',
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['contractNo', 'materialInfo', 'equipmentName']),
  }),

  outsource: createBillMockStore({
    prefix: 'OS',
    seedList: [
      base({
        id: 1,
        billCode: 'OS-20260925001',
        sourceBillType: '独立需求',
        sourceBillCode: 'ID-20260925001',
        materialInfo: '热处理工序件 x8',
        supplierDeliveryStatus: '部分发货',
        supplierName: '苏州热处理厂',
        supplierCode: 'S-HT-001',
        numberTotal: 8,
        currencyName: '人民币',
        currencyExchangeRate: 1,
        machiningPriceTotal: 4800,
        taxMachiningPriceTotal: 5424,
        discountAmount: 0,
        amountTotal: 5424,
        amountTotalLocal: 5424,
        arrivalDate: '2026-10-08',
        arrivalWarnDays: 3,
        overdueDays: 0,
        contractNo: 'HT-2026-100',
      }),
      base({
        id: 2,
        billCode: 'OS-20260908002',
        billDate: '2026-09-08',
        sourceBillType: '生产订单',
        sourceBillCode: 'MO-20260910002',
        materialInfo: '表面处理件 x12',
        supplierDeliveryStatus: '已发货',
        supplierName: '华东表面处理',
        supplierCode: 'S-SF-008',
        numberTotal: 12,
        currencyName: '人民币',
        currencyExchangeRate: 1,
        machiningPriceTotal: 3600,
        taxMachiningPriceTotal: 4068,
        discountAmount: 200,
        amountTotal: 3868,
        amountTotalLocal: 3868,
        arrivalDate: '2026-09-18',
        arrivalWarnDays: 2,
        overdueDays: 0,
        contractNo: 'HT-2026-076',
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['supplierName', 'contractNo', 'materialInfo']),
  }),

  scrapReason: createBillMockStore({
    prefix: 'SCR',
    seedList: [
      base({
        id: 1,
        billCode: 'SCR-001',
        name: '尺寸超差',
        code: 'SCR-DIM',
        priority: 1,
        enable: 1,
        status: '已审核',
      }),
      base({
        id: 2,
        billCode: 'SCR-002',
        name: '表面划伤',
        code: 'SCR-SUR',
        priority: 2,
        enable: 1,
        status: '已审核',
      }),
      base({
        id: 3,
        billCode: 'SCR-003',
        name: '材料缺陷(停用)',
        code: 'SCR-MAT',
        priority: 99,
        enable: 0,
        status: '待审核',
      }),
    ],
    filterFn: filterBy(['name', 'code']),
  }),

  fgQc: createBillMockStore({
    prefix: 'FQC',
    seedList: [
      base({
        id: 1,
        billCode: 'FQC-20260925001',
        sourceBillType: '生产订单',
        sourceBillCode: 'MO-20260925001',
        numberTotal: 4,
        contractNo: 'HT-2026-100',
      }),
      base({
        id: 2,
        billCode: 'FQC-20260918002',
        billDate: '2026-09-18',
        sourceBillType: '委外订单',
        sourceBillCode: 'OS-20260908002',
        numberTotal: 12,
        contractNo: 'HT-2026-076',
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['contractNo', 'sourceBillCode']),
  }),

  consignIn: createBillMockStore({
    prefix: 'EI',
    seedList: [
      base({
        id: 1,
        billCode: 'EI-20260925001',
        materialInfo: '客户来料-箱体毛坯 x30',
        sourceBillType: '销售订单',
        sourceBillCode: 'SO-20260920001',
        customerName: 'ACME工业',
        numberTotal: 30,
      }),
      base({
        id: 2,
        billCode: 'EI-20260910002',
        billDate: '2026-09-10',
        materialInfo: '客户来料-阀体 x15',
        sourceBillType: '销售订单',
        sourceBillCode: 'SO-20260905008',
        customerName: '华东液压',
        numberTotal: 15,
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['customerName', 'materialInfo']),
  }),

  consignReturn: createBillMockStore({
    prefix: 'ER',
    seedList: [
      base({
        id: 1,
        billCode: 'ER-20260925001',
        materialInfo: '客户来料退回-箱体毛坯 x2',
        customerName: 'ACME工业',
        numberTotal: 2,
      }),
      base({
        id: 2,
        billCode: 'ER-20260912002',
        billDate: '2026-09-12',
        materialInfo: '客户来料退回-阀体 x1',
        customerName: '华东液压',
        numberTotal: 1,
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['customerName', 'materialInfo']),
  }),

  disassembleIn: createBillMockStore({
    prefix: 'WI',
    seedList: [
      base({
        id: 1,
        billCode: 'WI-20260925001',
        sourceBillType: '生产订单',
        sourceBillCode: 'MO-20260925001',
        materialInfo: '边角料-铸铁 x50kg',
        contractNo: 'HT-2026-100',
        numberTotal: 50,
        costPriceTotal: 250,
      }),
      base({
        id: 2,
        billCode: 'WI-20260915002',
        billDate: '2026-09-15',
        sourceBillType: '生产订单',
        sourceBillCode: 'MO-20260910002',
        materialInfo: '废焊丝 x8kg',
        contractNo: 'HT-2026-076',
        numberTotal: 8,
        costPriceTotal: 96,
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['contractNo', 'materialInfo', 'sourceBillCode']),
  }),
}

export function getProductionStore(key) {
  const store = productionStores[key]
  if (!store) throw new Error(`未知生产模块: ${key}`)
  return store
}
