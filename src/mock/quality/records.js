import { createBillMockStore, todayStr } from '../stock/_helpers'

function base(partial = {}) {
  return {
    billDate: todayStr(),
    status: '待审核',
    createAdminName: '张伟',
    createdAt: `${todayStr()} 10:20:00`,
    remark: '',
    auditName: '',
    deptName: '质量部',
    number: 10,
    numberTotal: 10,
    cover: '—',
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

export const qualityStores = {
  template: createBillMockStore({
    prefix: 'QT',
    seedList: [
      base({
        id: 1,
        billCode: 'QT-001',
        name: '来料通用质检模板',
        code: 'TMP-IQC-01',
        remark: '适用于标准件来料',
        status: '已审核',
      }),
      base({
        id: 2,
        billCode: 'QT-002',
        name: '出货抽检模板',
        code: 'TMP-OQC-01',
        remark: '',
        status: '待审核',
      }),
    ],
    filterFn: filterBy(['name', 'code']),
  }),

  packing: createBillMockStore({
    prefix: 'QB',
    seedList: [
      base({
        id: 1,
        billCode: 'QB-20260925001',
        materialInfo: '主轴箱体 x10',
        number: 10,
        inspectionResult: '合格',
      }),
      base({
        id: 2,
        billCode: 'QB-20260918002',
        billDate: '2026-09-18',
        materialInfo: '液压阀组 x20',
        number: 20,
        inspectionResult: '让步接收',
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['materialInfo', 'inspectionResult']),
  }),

  incoming: createBillMockStore({
    prefix: 'IQC',
    seedList: [
      base({
        id: 1,
        billCode: 'IQC-20260925001',
        sourceBillCode: 'PI-20260924001',
        materialInfo: '轴承 6205 x200',
        supplierName: '华东五金批发',
        contractNo: 'HT-2026-100',
        instockStatus: '未入库',
        numberTotal: 200,
      }),
      base({
        id: 2,
        billCode: 'IQC-20260915002',
        billDate: '2026-09-15',
        sourceBillCode: 'PI-20260914008',
        materialInfo: '钢板 Q235B x50',
        supplierName: '苏州精密传动',
        contractNo: 'HT-2026-076',
        instockStatus: '已入库',
        numberTotal: 50,
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['supplierName', 'contractNo', 'materialInfo']),
  }),

  incomingReport: createBillMockStore({
    prefix: 'IQR',
    seedList: [
      base({
        id: 1,
        billCode: 'IQR-20260925001',
        sourceBillType: '来料质检',
        sourceBillCode: 'IQC-20260925001',
        supplierName: '华东五金批发',
        number: 200,
      }),
      base({
        id: 2,
        billCode: 'IQR-20260915002',
        billDate: '2026-09-15',
        sourceBillType: '来料质检',
        sourceBillCode: 'IQC-20260915002',
        supplierName: '苏州精密传动',
        number: 50,
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['supplierName', 'sourceBillCode']),
  }),

  outgoing: createBillMockStore({
    prefix: 'OQC',
    seedList: [
      base({
        id: 1,
        billCode: 'OQC-20260925001',
        sourceBillCode: 'SO-20260920001',
        materialInfo: '主轴箱体组件 x5',
        customerName: 'ACME工业',
        outstockStatus: '未出库',
        numberTotal: 5,
        contractNo: 'HT-2026-100',
      }),
      base({
        id: 2,
        billCode: 'OQC-20260912002',
        billDate: '2026-09-12',
        sourceBillCode: 'SO-20260908008',
        materialInfo: '液压站 x2',
        customerName: '华东液压',
        outstockStatus: '已出库',
        numberTotal: 2,
        contractNo: 'HT-2026-076',
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['customerName', 'contractNo', 'materialInfo']),
  }),

  outgoingReport: createBillMockStore({
    prefix: 'OQR',
    seedList: [
      base({
        id: 1,
        billCode: 'OQR-20260925001',
        sourceBillType: '出货质检',
        sourceBillCode: 'OQC-20260925001',
        customerName: 'ACME工业',
        number: 5,
        customerMaterialName: 'ACME-箱体',
        customerMaterialCode: 'CUS-BOX-01',
      }),
      base({
        id: 2,
        billCode: 'OQR-20260912002',
        billDate: '2026-09-12',
        sourceBillType: '出货质检',
        sourceBillCode: 'OQC-20260912002',
        customerName: '华东液压',
        number: 2,
        customerMaterialName: 'HYD-Station',
        customerMaterialCode: 'CUS-HYD-09',
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['customerName', 'customerMaterialName', 'sourceBillCode']),
  }),

  patrolReport: createBillMockStore({
    prefix: 'RR',
    seedList: [
      base({
        id: 1,
        billCode: 'RR-20260925001',
        sourceBillType: '生产订单',
        processInfo: '粗铣 → 精铣',
        materialInfo: '主轴箱体 x10',
        contractNo: 'HT-2026-100',
        inspectionMethod: '抽检',
      }),
      base({
        id: 2,
        billCode: 'RR-20260910002',
        billDate: '2026-09-10',
        sourceBillType: '生产订单',
        processInfo: '焊接 → 打磨',
        materialInfo: '液压站底板 x5',
        contractNo: 'HT-2026-076',
        inspectionMethod: '全检',
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['contractNo', 'processInfo', 'materialInfo']),
  }),

  firstReport: createBillMockStore({
    prefix: 'FR',
    seedList: [
      base({
        id: 1,
        billCode: 'FR-20260925001',
        sourceBillType: '生产订单',
        sourceBillCode: 'MO-20260925001',
      }),
      base({
        id: 2,
        billCode: 'FR-20260908002',
        billDate: '2026-09-08',
        sourceBillType: '生产订单',
        sourceBillCode: 'MO-20260910002',
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['sourceBillCode', 'sourceBillType']),
  }),

  review: createBillMockStore({
    prefix: 'TR',
    seedList: [
      base({
        id: 1,
        billCode: 'TR-001',
        materialName: '主轴箱体',
        code: 'M-SPINDLE-01',
        spec: 'HT250 / 定制',
        serialNumber: 'SN-20260925-001',
        batchNumber: 'B20260925',
        unitName: '件',
        traceType: '序列追溯',
        status: '已审核',
      }),
      base({
        id: 2,
        billCode: 'TR-002',
        materialName: '轴承 6205',
        code: 'M-BRG-6205',
        spec: 'P5',
        serialNumber: '',
        batchNumber: 'LOT-20260915',
        unitName: '个',
        traceType: '批次追溯',
        status: '已审核',
      }),
    ],
    filterFn: filterBy([
      'materialName',
      'code',
      'serialNumber',
      'batchNumber',
      'traceType',
    ]),
  }),
}

export function getQualityStore(key) {
  const store = qualityStores[key]
  if (!store) throw new Error(`未知质量模块: ${key}`)
  return store
}
