import { createBillMockStore, todayStr } from '../stock/_helpers'

function base(partial = {}) {
  return {
    billDate: todayStr(),
    status: '待审核',
    createAdminName: '张伟',
    createdAt: `${todayStr()} 10:20:00`,
    remark: '',
    verifyData: '',
    auditName: '',
    deptName: '计划部',
    responsibleAdminName: '李计划',
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

export const planStores = {
  mps: createBillMockStore({
    prefix: 'MPS',
    seedList: [
      base({
        id: 1,
        billCode: 'MPS-20260925001',
        planName: '9月主轴箱体主计划',
        planStartDate: '2026-09-25',
        planEndDate: '2026-10-15',
        numberTotal: 20,
      }),
      base({
        id: 2,
        billCode: 'MPS-20260910002',
        billDate: '2026-09-10',
        planName: '液压站月度计划',
        planStartDate: '2026-09-10',
        planEndDate: '2026-09-30',
        numberTotal: 8,
        status: '已审核',
        verifyData: '赵审 / 2026-09-11 09:30',
      }),
    ],
    filterFn: filterBy(['planName']),
  }),

  mrpScheme: createBillMockStore({
    prefix: 'MRPS',
    seedList: [
      base({
        id: 1,
        billCode: 'MRPS-001',
        name: '标准MRP方案',
        mergeRule: '按物料合并',
        planPriority: '交期优先',
        isSpecifyStock: 0,
        stockNames: '',
        isDefault: 1,
        isConsiderInventory: 1,
        isConsiderInventoryChildren: 1,
        isConsiderQualificationRate: 1,
        isConsiderLossRate: 1,
        isConsiderInTransit: 1,
        isCalculateStockWarn: 0,
        openLockStock: 0,
        status: '已审核',
      }),
      base({
        id: 2,
        billCode: 'MRPS-002',
        name: '指定仓库方案',
        mergeRule: '按订单合并',
        planPriority: '库存优先',
        isSpecifyStock: 1,
        stockNames: '成品仓,原材料仓',
        isDefault: 0,
        isConsiderInventory: 1,
        isConsiderInventoryChildren: 0,
        isConsiderQualificationRate: 0,
        isConsiderLossRate: 1,
        isConsiderInTransit: 0,
        isCalculateStockWarn: 1,
        openLockStock: 1,
        status: '待审核',
      }),
    ],
    filterFn: filterBy(['name', 'mergeRule']),
  }),

  mrp: createBillMockStore({
    prefix: 'MRP',
    seedList: [
      base({
        id: 1,
        billCode: 'MRP-20260925001',
        materialInfo: '主轴箱体组件 x2；液压阀组 x4',
        operationSchemeName: '标准MRP方案',
        contractNo: 'HT-2026-088',
        status: '待审核',
      }),
      base({
        id: 2,
        billCode: 'MRP-20260918002',
        billDate: '2026-09-18',
        materialInfo: '非标液压站 x1',
        operationSchemeName: '指定仓库方案',
        contractNo: 'HT-2026-076',
        status: '已审核',
        verifyData: '赵审 / 2026-09-19 11:00',
      }),
    ],
    filterFn: filterBy(['operationSchemeName', 'contractNo', 'materialInfo']),
  }),

  schedule: createBillMockStore({
    prefix: 'APS',
    seedList: [
      base({
        id: 1,
        billCode: 'APS-20260925001',
        planName: '箱体机加排程',
        productionGenerationRule: '按工序拆分',
        planStartDate: '2026-09-26',
        planEndDate: '2026-10-08',
        numberTotal: 16,
      }),
      base({
        id: 2,
        billCode: 'APS-20260912002',
        billDate: '2026-09-12',
        planName: '焊接线周排程',
        productionGenerationRule: '按数量拆分',
        planStartDate: '2026-09-12',
        planEndDate: '2026-09-19',
        numberTotal: 30,
        status: '已审核',
        verifyData: '赵审 / 2026-09-12 16:00',
      }),
    ],
    filterFn: filterBy(['planName', 'productionGenerationRule']),
  }),

  projectSchedule: createBillMockStore({
    prefix: 'PPS',
    seedList: [
      base({
        id: 1,
        billCode: 'PPS-20260925001',
        planName: 'ACME项目工序排产',
        orderSplittingRule: '按工序拆分',
        planStartDate: '2026-09-25',
        planEndDate: '2026-10-20',
        numberTotal: 12,
      }),
      base({
        id: 2,
        billCode: 'PPS-20260908002',
        billDate: '2026-09-08',
        planName: '液压站项目排产',
        orderSplittingRule: '不拆分',
        planStartDate: '2026-09-08',
        planEndDate: '2026-09-25',
        numberTotal: 5,
        status: '已审核',
        verifyData: '赵审 / 2026-09-09 10:00',
      }),
    ],
    filterFn: filterBy(['planName', 'orderSplittingRule']),
  }),
}

export function getPlanStore(key) {
  const store = planStores[key]
  if (!store) throw new Error(`未知计划模块: ${key}`)
  return store
}
