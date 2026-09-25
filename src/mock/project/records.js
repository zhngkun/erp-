import { createBillMockStore, nowStr, todayStr } from '../stock/_helpers'

function baseBill(partial = {}) {
  return {
    billDate: todayStr(),
    status: '待审核',
    createAdminName: '张伟',
    createdAt: `${todayStr()} 10:20:00`,
    remark: '',
    verifyData: '',
    auditName: '',
    deptName: '工程部',
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

export const projectStores = {
  designTask: createBillMockStore({
    prefix: 'DT',
    seedList: [
      baseBill({
        id: 1,
        billCode: 'DT-20260925001',
        sourceBillType: '销售订单',
        sourceBillCode: 'SO-20260920001',
        materialName: '主轴箱体',
        spec: 'HT250 / 定制',
        code: 'M-SPINDLE-01',
        number: 2,
        unitName: '件',
        designTaskType: '非标设计',
        responsibleAdminName: '李工',
        planStartDate: '2026-09-25',
        planEndDate: '2026-10-10',
        designTaskProgress: '进行中',
      }),
      baseBill({
        id: 2,
        billCode: 'DT-20260918002',
        billDate: '2026-09-18',
        status: '已审核',
        sourceBillType: '销售订单',
        sourceBillCode: 'SO-20260915008',
        materialName: '液压站底板',
        spec: 'Q235B 20mm',
        code: 'M-HYD-BASE-02',
        number: 1,
        unitName: '件',
        designTaskType: '改型设计',
        responsibleAdminName: '王工',
        planStartDate: '2026-09-18',
        planEndDate: '2026-09-28',
        designTaskProgress: '已完成',
        verifyData: '赵审 / 2026-09-20 11:00',
      }),
    ],
    filterFn: filterBy(['materialName', 'sourceBillCode', 'designTaskType']),
  }),

  drawing: createBillMockStore({
    prefix: 'DW',
    seedList: [
      baseBill({
        id: 1,
        billCode: 'DW-20260925001',
        name: '主轴箱体零件图',
        drawingNumber: 'DW-SP-001',
        sourceBillType: '设计任务',
        sourceBillCode: 'DT-20260925001',
        drawingCategory: '机械零件',
        standardType: '零件图',
        materialName: '主轴箱体',
        spec: 'HT250 / 定制',
        code: 'M-SPINDLE-01',
        version: 'A1',
        responsibleAdminName: '李工',
        isDefault: 1,
        status: '已审核',
      }),
      baseBill({
        id: 2,
        billCode: 'DW-20260918002',
        billDate: '2026-09-18',
        name: '液压站装配图',
        drawingNumber: 'DW-HYD-002',
        sourceBillType: '设计任务',
        sourceBillCode: 'DT-20260918002',
        drawingCategory: '装配',
        standardType: '装配图',
        materialName: '液压站底板',
        spec: 'Q235B 20mm',
        code: 'M-HYD-BASE-02',
        version: 'B0',
        responsibleAdminName: '王工',
        isDefault: 0,
        status: '待审核',
      }),
    ],
    filterFn: filterBy([
      'name',
      'drawingNumber',
      'materialName',
      'drawingCategory',
      'standardType',
    ]),
  }),

  programming: createBillMockStore({
    prefix: 'PG',
    seedList: [
      baseBill({
        id: 1,
        billCode: 'PG-20260925001',
        sourceBillType: '图纸管理',
        sourceBillCode: 'DW-20260925001',
        standardType: '零件图',
        programmingCode: 'NC-SP-001',
        materialName: '主轴箱体',
        spec: 'HT250 / 定制',
        status: '待审核',
      }),
      baseBill({
        id: 2,
        billCode: 'PG-20260918002',
        billDate: '2026-09-18',
        sourceBillType: '图纸管理',
        sourceBillCode: 'DW-20260918002',
        standardType: '装配图',
        programmingCode: 'NC-HYD-002',
        materialName: '液压站底板',
        spec: 'Q235B 20mm',
        status: '已审核',
        verifyData: '赵审 / 2026-09-19 16:00',
      }),
    ],
    filterFn: filterBy([
      'programmingCode',
      'materialName',
      'standardType',
      'sourceBillCode',
    ]),
  }),

  issue: createBillMockStore({
    prefix: 'ECN',
    seedList: [
      baseBill({
        id: 1,
        billCode: 'ECN-20260925001',
        changeType: '设计变更',
        changeReason: '客户要求',
        changeObject: 'BOM',
        materialName: '主轴箱体',
        spec: 'HT250 / 定制',
        code: 'M-SPINDLE-01',
        beforeName: '主轴箱体 V1',
        beforeVersion: 'A0',
        afterName: '主轴箱体 V2',
        afterVersion: 'A1',
        status: '待审核',
      }),
      baseBill({
        id: 2,
        billCode: 'ECN-20260912002',
        billDate: '2026-09-12',
        changeType: '工艺变更',
        changeReason: '工艺改进',
        changeObject: '工艺路线',
        materialName: '液压站底板',
        spec: 'Q235B 20mm',
        code: 'M-HYD-BASE-02',
        beforeName: '液压路线-旧',
        beforeVersion: 'R1',
        afterName: '液压路线-新',
        afterVersion: 'R2',
        status: '已审核',
        verifyData: '赵审 / 2026-09-13 09:30',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['changeType', 'changeReason', 'materialName']),
  }),

  processRoute: createBillMockStore({
    prefix: 'RT',
    seedList: [
      baseBill({
        id: 1,
        billCode: 'RT-20260925001',
        name: '箱体机加路线',
        code: 'RT-BOX-01',
        sourceBillType: '标准BOM',
        sourceBillCode: 'BOM-STD-001',
        status: '已审核',
        auditName: '赵审',
        verifyData: '赵审 / 2026-09-20 10:00',
      }),
      baseBill({
        id: 2,
        billCode: 'RT-20260918002',
        billDate: '2026-09-18',
        name: '液压件焊接路线',
        code: 'RT-WELD-02',
        sourceBillType: '订单BOM',
        sourceBillCode: 'BOM-ORD-002',
        status: '待审核',
      }),
    ],
    filterFn: filterBy(['name', 'code', 'sourceBillCode']),
  }),

  stdBom: createBillMockStore({
    prefix: 'BOM',
    seedList: [
      baseBill({
        id: 1,
        billCode: 'BOM-20260925001',
        materialName: '主轴箱体组件',
        cover: '—',
        spec: '标准件',
        code: 'BOM-STD-001',
        bomCategoryName: '机械组件',
        number: 1,
        unitName: '套',
        version: 'V1.0',
        customerMaterialName: '',
        customerMaterialCode: '',
        standardType: '标准',
        status: '已审核',
      }),
      baseBill({
        id: 2,
        billCode: 'BOM-20260910002',
        billDate: '2026-09-10',
        materialName: '通用液压阀组',
        cover: '—',
        spec: '系列A',
        code: 'BOM-STD-002',
        bomCategoryName: '液压',
        number: 1,
        unitName: '套',
        version: 'V2.1',
        customerMaterialName: '',
        customerMaterialCode: '',
        standardType: '标准',
        status: '待审核',
      }),
    ],
    filterFn: (rows, p) => {
      let next = filterBy(['materialName', 'code', 'bomCategoryName'])(rows, p)
      if (p.standardType) {
        next = next.filter((r) => r.standardType === p.standardType)
      }
      return next
    },
  }),

  orderBom: createBillMockStore({
    prefix: 'OBOM',
    seedList: [
      baseBill({
        id: 1,
        billCode: 'OBOM-20260925001',
        materialName: '非标主轴箱体',
        cover: '—',
        spec: '客户定制',
        code: 'BOM-ORD-001',
        bomCategoryName: '机械组件',
        number: 1,
        unitName: '套',
        version: 'C1',
        customerMaterialName: 'ACME-箱体',
        customerMaterialCode: 'CUS-BOX-01',
        standardType: '非标',
        status: '待审核',
      }),
      baseBill({
        id: 2,
        billCode: 'OBOM-20260915002',
        billDate: '2026-09-15',
        materialName: '非标液压站',
        cover: '—',
        spec: '订单 SO-889',
        code: 'BOM-ORD-002',
        bomCategoryName: '液压',
        number: 1,
        unitName: '套',
        version: 'C0',
        customerMaterialName: 'HYD-Station',
        customerMaterialCode: 'CUS-HYD-09',
        standardType: '非标',
        status: '已审核',
        verifyData: '赵审 / 2026-09-16 14:00',
      }),
    ],
    filterFn: (rows, p) => {
      let next = filterBy([
        'materialName',
        'code',
        'customerMaterialName',
        'bomCategoryName',
      ])(rows, p)
      if (p.standardType) {
        next = next.filter((r) => r.standardType === p.standardType)
      }
      return next
    },
  }),
}

export function getProjectStore(key) {
  const store = projectStores[key]
  if (!store) {
    throw new Error(`未知工程模块: ${key}`)
  }
  return store
}

export { nowStr }
