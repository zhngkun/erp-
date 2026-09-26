import { defineFlowchart, flowEdge, flowNode } from './helpers'

/**
 * 库存管理流程 — 从左到右
 *
 * 组装拆卸、货位调整：独立节点
 * 库存盘点 → 其他入库 / 其他出库
 * 库存调拨 → 调拨出库 → 调拨入库
 * 借出出库 → 归还入库
 */
const COL = { left: 140, mid: 380, right: 620 }
const ROW = {
  assemble: 70,
  slot: 160,
  check: 280,
  transfer: 430,
  lend: 560,
}

export const stockFlowchart = defineFlowchart(
  '库存管理流程',
  [
    flowNode({ id: 'assemble', text: '组装拆卸', x: COL.left, y: ROW.assemble, path: null }),
    flowNode({ id: 'slot-adjust', text: '货位调整', x: COL.left, y: ROW.slot, path: '/stock/move' }),
    flowNode({ id: 'check', text: '库存盘点', x: COL.left, y: ROW.check, path: '/stock/check' }),
    flowNode({
      id: 'other-in',
      text: '其他入库',
      x: COL.mid,
      y: ROW.check - 50,
      path: '/stock/other-in',
    }),
    flowNode({
      id: 'other-out',
      text: '其他出库',
      x: COL.mid,
      y: ROW.check + 50,
      path: '/stock/other-out',
    }),
    flowNode({ id: 'transfer', text: '库存调拨', x: COL.left, y: ROW.transfer, path: '/stock/transfer' }),
    flowNode({
      id: 'transfer-out',
      text: '调拨出库',
      x: COL.mid,
      y: ROW.transfer,
      path: '/stock/transfer-out',
    }),
    flowNode({
      id: 'transfer-in',
      text: '调拨入库',
      x: COL.right,
      y: ROW.transfer,
      path: '/stock/transfer-in',
    }),
    flowNode({ id: 'lend-out', text: '借出出库', x: COL.left, y: ROW.lend, path: '/stock/lend-out' }),
    flowNode({ id: 'return-in', text: '归还入库', x: COL.mid, y: ROW.lend, path: '/stock/return-in' }),
  ],
  [
    flowEdge({ id: 'e-check-in', source: 'check', target: 'other-in' }),
    flowEdge({ id: 'e-check-out', source: 'check', target: 'other-out' }),
    flowEdge({ id: 'e-transfer-out', source: 'transfer', target: 'transfer-out' }),
    flowEdge({ id: 'e-transfer-in', source: 'transfer-out', target: 'transfer-in' }),
    flowEdge({ id: 'e-lend-return', source: 'lend-out', target: 'return-in' }),
  ],
)
