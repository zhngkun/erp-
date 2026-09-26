import { createBillMockStore, itemLine, todayStr } from './_helpers'

function bill(partial) {
  const items = partial.itemList || [itemLine()]
  return {
    billDate: todayStr(),
    status: '待审核',
    createAdminName: '张伟',
    createdAt: `${todayStr()} 10:20:00`,
    remark: '',
    verifyData: '',
    numberTotal: items.reduce((s, i) => s + Number(i.number || 0), 0),
    itemList: items,
    itemSummary: items.map((i) => i.materialName).join('、'),
    ...partial,
  }
}

const materials = [
  itemLine({ materialName: '铝合金型材 6063', code: 'SKU-6063-4040', number: 20 }),
  itemLine({
    materialName: '不锈钢板 304',
    spec: '1.2mm×1220×2440',
    code: 'SKU-SS304-12',
    number: 8,
    unitName: '张',
    stockName: '原材料仓',
    locationName: 'B-02-03',
    costPrice: 186,
    salePrice: 220,
  }),
  itemLine({
    materialName: 'M8 内六角螺丝',
    spec: 'M8×25',
    code: 'SKU-SCR-M825',
    number: 500,
    unitName: '个',
    stockName: '耗材仓',
    locationName: 'C-01-05',
    costPrice: 0.18,
    salePrice: 0.35,
  }),
  itemLine({
    materialName: '伺服电机 750W',
    spec: '750W/220V',
    code: 'SKU-SVO-750',
    number: 2,
    unitName: '台',
    stockName: '成品仓',
    locationName: 'F-03-01',
    costPrice: 1280,
    salePrice: 1680,
    serialNumber: 'SN202609001',
    batchNumber: 'BN202609',
  }),
]

function sampleItems(n = 2) {
  return materials.slice(0, n).map((m) => ({ ...m }))
}

/** @type {Record<string, ReturnType<typeof createBillMockStore>>} */
export const billStores = {
  otherIn: createBillMockStore({
    prefix: 'OI',
    seedList: [
      bill({
        id: 1,
        billCode: 'OI-20260925001',
        supplierName: '苏州精密传动有限公司',
        costPriceTotal: 2570,
        responsibleAdminName: '王强',
        itemList: sampleItems(2),
      }),
      bill({
        id: 2,
        billCode: 'OI-20260924002',
        billDate: '2026-09-24',
        status: '已审核',
        supplierName: '华东五金批发',
        costPriceTotal: 90,
        verifyData: '李娜 / 2026-09-24 15:00',
        itemList: [materials[2]],
      }),
      bill({
        id: 3,
        billCode: 'OI-20260922003',
        billDate: '2026-09-22',
        status: '已保存',
        supplierName: '德科集团',
        costPriceTotal: 2560,
        itemList: [materials[3]],
        remark: '试用入库',
      }),
    ],
    filterFn: (rows, p) => {
      if (p.supplierName) {
        return rows.filter((r) =>
          String(r.supplierName || '').includes(String(p.supplierName).trim()),
        )
      }
      return rows
    },
  }),

  otherOut: createBillMockStore({
    prefix: 'OO',
    seedList: [
      bill({
        id: 1,
        billCode: 'OO-20260925001',
        customerName: '测试客户01',
        salePriceTotal: 720,
        itemList: sampleItems(1),
      }),
      bill({
        id: 2,
        billCode: 'OO-20260923002',
        billDate: '2026-09-23',
        status: '已审核',
        customerName: '云仓优选旗舰店',
        salePriceTotal: 175,
        verifyData: '张伟 / 2026-09-23 11:20',
        itemList: [materials[2]],
      }),
    ],
    filterFn: (rows, p) => {
      if (p.customerName) {
        return rows.filter((r) =>
          String(r.customerName || '').includes(String(p.customerName).trim()),
        )
      }
      return rows
    },
  }),

  loss: createBillMockStore({
    prefix: 'LS',
    seedList: [
      bill({
        id: 1,
        billCode: 'LS-20260925001',
        reason: '破损报废',
        itemList: sampleItems(1),
        remark: '运输损坏',
      }),
      bill({
        id: 2,
        billCode: 'LS-20260920002',
        billDate: '2026-09-20',
        status: '已审核',
        reason: '盘亏',
        verifyData: '王强 / 2026-09-20 16:00',
        itemList: [materials[2]],
      }),
    ],
    filterFn: (rows, p) => {
      if (p.reason) {
        return rows.filter((r) =>
          String(r.reason || '').includes(String(p.reason).trim()),
        )
      }
      return rows
    },
  }),

  transfer: createBillMockStore({
    prefix: 'TF',
    seedList: [
      bill({
        id: 1,
        billCode: 'TF-20260925001',
        stockName: '原材料仓',
        instockStockName: '成品仓',
        itemList: sampleItems(2),
      }),
      bill({
        id: 2,
        billCode: 'TF-20260921002',
        billDate: '2026-09-21',
        status: '已审核',
        stockName: '成品仓',
        instockStockName: '半成品仓',
        verifyData: '陈浩 / 2026-09-21 14:10',
        itemList: [materials[3]],
      }),
    ],
  }),

  transferOut: createBillMockStore({
    prefix: 'TO',
    seedList: [
      bill({
        id: 1,
        billCode: 'TO-20260925001',
        sourceBillCode: 'TF-20260925001',
        sourceBillType: '库存调拨',
        stockName: '原材料仓',
        itemList: sampleItems(1),
      }),
      bill({
        id: 2,
        billCode: 'TO-20260921002',
        billDate: '2026-09-21',
        status: '已审核',
        sourceBillCode: 'TF-20260921002',
        sourceBillType: '库存调拨',
        stockName: '成品仓',
        verifyData: '陈浩 / 2026-09-21 15:00',
        itemList: [materials[3]],
      }),
    ],
  }),

  transferIn: createBillMockStore({
    prefix: 'TI',
    seedList: [
      bill({
        id: 1,
        billCode: 'TI-20260925001',
        sourceBillCode: 'TO-20260921002',
        sourceBillType: '调拨出库',
        stockName: '半成品仓',
        status: '待审核',
        itemList: [materials[3]],
      }),
    ],
  }),

  check: createBillMockStore({
    prefix: 'CK',
    seedList: [
      bill({
        id: 1,
        billCode: 'CK-20260925001',
        stockName: '原材料仓',
        itemList: [
          itemLine({
            number: 100,
            inventoryNumber: 98,
            diffNumber: -2,
            inventoryResult: '盘亏',
          }),
          itemLine({
            ...materials[1],
            number: 50,
            inventoryNumber: 50,
            diffNumber: 0,
            inventoryResult: '账实相符',
          }),
        ],
      }),
      bill({
        id: 2,
        billCode: 'CK-20260918002',
        billDate: '2026-09-18',
        status: '已审核',
        stockName: '成品仓',
        verifyData: '刘洋 / 2026-09-18 18:00',
        itemList: [
          itemLine({
            ...materials[3],
            number: 5,
            inventoryNumber: 6,
            diffNumber: 1,
            inventoryResult: '盘盈',
          }),
        ],
      }),
    ],
  }),

  lend: createBillMockStore({
    prefix: 'LD',
    seedList: [
      bill({
        id: 1,
        billCode: 'LD-20260925001',
        personType: '员工',
        personName: '周杰',
        returnNumberTotal: 0,
        waitReturnNumberTotal: 20,
        itemList: sampleItems(1),
      }),
      bill({
        id: 2,
        billCode: 'LD-20260910002',
        billDate: '2026-09-10',
        status: '已审核',
        personType: '客户',
        personName: '测试客户01',
        returnNumberTotal: 5,
        waitReturnNumberTotal: 3,
        verifyData: '张伟 / 2026-09-10 12:00',
        itemList: [materials[1]],
      }),
    ],
  }),

  revert: createBillMockStore({
    prefix: 'RV',
    seedList: [
      bill({
        id: 1,
        billCode: 'RV-20260925001',
        sourceBillCode: 'LD-20260910002',
        sourceBillType: '借出出库',
        personType: '客户',
        personName: '测试客户01',
        returnNumberTotal: 5,
        itemList: [
          itemLine({
            ...materials[1],
            number: 5,
            returnNumber: 5,
          }),
        ],
      }),
    ],
  }),

  costAdjust: createBillMockStore({
    prefix: 'CA',
    seedList: [
      bill({
        id: 1,
        billCode: 'CA-20260925001',
        itemList: [
          itemLine({
            number: 100,
            costPrice: 28.5,
            costPriceTotal: 2850,
            adjustmentCostPrice: 27.8,
            adjustmentCostPriceTotal: 2780,
          }),
        ],
      }),
      bill({
        id: 2,
        billCode: 'CA-20260915002',
        billDate: '2026-09-15',
        status: '已审核',
        verifyData: '李娜 / 2026-09-15 09:30',
        itemList: [
          itemLine({
            ...materials[3],
            number: 2,
            costPrice: 1280,
            costPriceTotal: 2560,
            adjustmentCostPrice: 1200,
            adjustmentCostPriceTotal: 2400,
          }),
        ],
      }),
    ],
  }),

  batchFill: createBillMockStore({
    prefix: 'BF',
    seedList: [
      bill({
        id: 1,
        billCode: 'BF-20260925001',
        itemList: [
          itemLine({
            batchNumber: 'BN20260925A',
            serialNumber: '',
            batchExpireTime: '2027-09-25',
            number: 30,
          }),
        ],
      }),
      bill({
        id: 2,
        billCode: 'BF-20260912002',
        billDate: '2026-09-12',
        status: '已审核',
        verifyData: '王强 / 2026-09-12 16:40',
        itemList: [
          itemLine({
            ...materials[3],
            batchNumber: 'BN20260912',
            serialNumber: 'SN20260912001',
            batchExpireTime: '2028-09-12',
          }),
        ],
      }),
    ],
  }),

  pickOut: createBillMockStore({
    prefix: 'WO',
    seedList: [
      bill({
        id: 1,
        billCode: 'WO-20260925001',
        sourceBillCode: 'MO-20260920001',
        sourceBillType: '生产工单',
        procedureName: '下料',
        processingMethod: '自制',
        itemList: sampleItems(2),
      }),
      bill({
        id: 2,
        billCode: 'WO-20260919002',
        billDate: '2026-09-19',
        status: '已审核',
        sourceBillCode: 'MO-20260918002',
        sourceBillType: '生产工单',
        procedureName: '装配',
        processingMethod: '自制',
        verifyData: '陈浩 / 2026-09-19 10:00',
        itemList: [materials[2]],
      }),
    ],
  }),

  materialReturn: createBillMockStore({
    prefix: 'WI',
    seedList: [
      bill({
        id: 1,
        billCode: 'WI-20260925001',
        sourceBillCode: 'WO-20260919002',
        sourceBillType: '在制品出库',
        procedureName: '装配',
        processingMethod: '自制',
        itemList: [materials[2]],
      }),
    ],
  }),

  consumableOut: createBillMockStore({
    prefix: 'CO',
    seedList: [
      bill({
        id: 1,
        billCode: 'CO-20260925001',
        businessType: '普通耗材出库',
        customerName: '内部领用',
        salePriceTotal: 175,
        itemList: [materials[2]],
      }),
      bill({
        id: 2,
        billCode: 'CO-20260916002',
        billDate: '2026-09-16',
        status: '已审核',
        businessType: '项目耗材',
        customerName: '德科集团采购中心',
        salePriceTotal: 720,
        verifyData: '周杰 / 2026-09-16 14:22',
        itemList: sampleItems(1),
      }),
    ],
  }),

  move: createBillMockStore({
    prefix: 'LA',
    seedList: [
      bill({
        id: 1,
        billCode: 'LA-20260925001',
        stockName: '原材料仓',
        itemList: [
          itemLine({
            locationName: 'A-01-01',
            instockLocationName: 'A-02-03',
            number: 15,
          }),
        ],
      }),
      bill({
        id: 2,
        billCode: 'LA-20260914002',
        billDate: '2026-09-14',
        status: '已审核',
        stockName: '成品仓',
        verifyData: '刘洋 / 2026-09-14 11:00',
        itemList: [
          itemLine({
            ...materials[3],
            locationName: 'F-03-01',
            instockLocationName: 'F-04-02',
          }),
        ],
      }),
    ],
  }),

  locationTransfer: createBillMockStore({
    prefix: 'LT',
    seedList: [
      bill({
        id: 1,
        billCode: 'LT-20260925001',
        stockName: '原材料仓',
        instockStockName: '半成品仓',
        itemList: [
          itemLine({
            locationName: 'A-01-01',
            instockLocationName: 'H-01-01',
            number: 10,
          }),
        ],
      }),
    ],
  }),

  assembly: createBillMockStore({
    prefix: 'ASM',
    seedList: [
      bill({
        id: 1,
        billCode: 'ASM-20260925001',
        businessType: '组装',
        stockName: '成品仓',
        sourceBillCode: '',
        itemList: [
          itemLine({ ...materials[0], number: 1, costPrice: 120 }),
          itemLine({ ...materials[1], number: 4, costPrice: 18 }),
        ],
        costPriceTotal: 192,
      }),
      bill({
        id: 2,
        billCode: 'ASM-20260918002',
        billDate: '2026-09-18',
        businessType: '拆卸',
        stockName: '半成品仓',
        status: '已审核',
        verifyData: '张伟 / 2026-09-18 15:00',
        itemList: [itemLine({ ...materials[2], number: 1, costPrice: 860 })],
        costPriceTotal: 860,
      }),
    ],
  }),

  pack: createBillMockStore({
    prefix: 'PK',
    seedList: [
      bill({
        id: 1,
        billCode: 'PK-20260925001',
        stockName: '成品仓',
        packageNumber: 5,
        sourceBillCode: 'SX-20260925001',
        itemList: [itemLine({ ...materials[0], number: 50 })],
      }),
    ],
  }),
}

export function getBillStore(key) {
  const store = billStores[key]
  if (!store) throw new Error(`未知库存单据类型: ${key}`)
  return store
}
