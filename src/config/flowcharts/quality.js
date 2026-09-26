import { defineFlowchart, flowCurve, flowNode } from './helpers'

/**
 * 质量管理流程 — 三列竖向树 + 孤立「质检装箱」
 *
 * 左列采购：采购订单 → 来料质检 → 来料质检报告 | 采购入库
 * 中列销售：销售订单 → 出货质检 → 出货质检报告 | 销售出库
 * 孤立：质检装箱（无连线）
 * 右列生产：生产订单 → 首次质检报告 | 巡检报告
 *
 * 竖直关系用短曲线；侧向分支从上边入点落入右侧子节点。
 */

const H = 36
const halfH = H / 2

const ROW = {
  top: 100,
  mid: 260,
  bottom: 420,
}

/** 列间距约 280；每列内报告与入库/出库水平间距约 180 */
const COL = {
  purchase: 140,
  purchaseRight: 320,
  sales: 560,
  salesRight: 740,
  packing: 960,
  production: 1200,
  productionRight: 1380,
}

const N = {
  purchaseOrder: { x: COL.purchase, y: ROW.top },
  incoming: { x: COL.purchase, y: ROW.mid },
  incomingReport: { x: COL.purchase, y: ROW.bottom },
  purchaseIn: { x: COL.purchaseRight, y: ROW.bottom },

  salesOrder: { x: COL.sales, y: ROW.top },
  outgoing: { x: COL.sales, y: ROW.mid },
  outgoingReport: { x: COL.sales, y: ROW.bottom },
  salesOut: { x: COL.salesRight, y: ROW.bottom },

  packing: { x: COL.packing, y: ROW.top },

  prodOrder: { x: COL.production, y: ROW.top },
  firstReport: { x: COL.production, y: ROW.mid },
  patrolReport: { x: COL.productionRight, y: ROW.mid },
}

function bottom(x, y, dx = 0) {
  return { x: x + dx, y: y + halfH }
}
function topIn(x, y, dx = 0) {
  return { x: x + dx, y: y - halfH }
}

function vertical(id, source, target, sx, sy, tx, ty) {
  const midY = (sy + ty) / 2
  return flowCurve({
    id,
    source,
    target,
    pointsList: [
      bottom(sx, sy),
      { x: sx, y: midY },
      { x: tx, y: midY },
      topIn(tx, ty),
    ],
  })
}

/** 父节点 → 右下方子节点（先下再横再落上边） */
function branchRight(id, source, target, sx, sy, tx, ty, exitDx = 20) {
  return flowCurve({
    id,
    source,
    target,
    pointsList: [
      bottom(sx, sy, exitDx),
      { x: sx + exitDx, y: sy + 50 },
      { x: tx, y: ty - 50 },
      topIn(tx, ty),
    ],
  })
}

export const qualityFlowchart = defineFlowchart(
  '质量管理流程',
  [
    flowNode({ id: 'purchase-order', text: '采购订单', ...N.purchaseOrder, path: '/purchase/order' }),
    flowNode({ id: 'incoming', text: '来料质检', ...N.incoming, path: '/quality/incoming' }),
    flowNode({ id: 'incoming-report', text: '来料质检报告', ...N.incomingReport, path: '/quality/incoming-report' }),
    flowNode({ id: 'purchase-in', text: '采购入库', ...N.purchaseIn, path: '/purchase/inbound' }),

    flowNode({ id: 'sales-order', text: '销售订单', ...N.salesOrder, path: '/sales/order' }),
    flowNode({ id: 'outgoing', text: '出货质检', ...N.outgoing, path: '/quality/outgoing' }),
    flowNode({ id: 'outgoing-report', text: '出货质检报告', ...N.outgoingReport, path: '/quality/outgoing-report' }),
    flowNode({ id: 'sales-out', text: '销售出库', ...N.salesOut, path: '/sales/outbound' }),

    flowNode({ id: 'packing', text: '质检装箱', ...N.packing, path: '/quality/packing' }),

    flowNode({ id: 'prod-order', text: '生产订单', ...N.prodOrder, path: '/production/in-house' }),
    flowNode({ id: 'first-report', text: '首次质检报告', ...N.firstReport, path: '/quality/first-report' }),
    flowNode({ id: 'patrol-report', text: '巡检报告', ...N.patrolReport, path: '/quality/patrol-report' }),
  ],
  [
    // 左列
    vertical('e-po-incoming', 'purchase-order', 'incoming', N.purchaseOrder.x, N.purchaseOrder.y, N.incoming.x, N.incoming.y),
    vertical('e-incoming-report', 'incoming', 'incoming-report', N.incoming.x, N.incoming.y, N.incomingReport.x, N.incomingReport.y),
    branchRight('e-incoming-pin', 'incoming', 'purchase-in', N.incoming.x, N.incoming.y, N.purchaseIn.x, N.purchaseIn.y, 28),

    // 中列
    vertical('e-so-outgoing', 'sales-order', 'outgoing', N.salesOrder.x, N.salesOrder.y, N.outgoing.x, N.outgoing.y),
    vertical('e-outgoing-report', 'outgoing', 'outgoing-report', N.outgoing.x, N.outgoing.y, N.outgoingReport.x, N.outgoingReport.y),
    branchRight('e-outgoing-sout', 'outgoing', 'sales-out', N.outgoing.x, N.outgoing.y, N.salesOut.x, N.salesOut.y, 28),

    // 右列（质检装箱无边）
    vertical('e-prod-first', 'prod-order', 'first-report', N.prodOrder.x, N.prodOrder.y, N.firstReport.x, N.firstReport.y),
    branchRight('e-prod-patrol', 'prod-order', 'patrol-report', N.prodOrder.x, N.prodOrder.y, N.patrolReport.x, N.patrolReport.y, 28),
  ],
)
