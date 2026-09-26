import { defineFlowchart, flowCurve, flowNode } from './helpers'

/**
 * 生产管理流程 — 三簇树形结构，贴近业务示意图
 *
 * 左簇 MRP：独立需求 + 销售订单 → MRP计划 → 采购订单 | 生产订单 | 委外订单
 * 中簇 自制：独立需求 + 销售订单 → 生产订单 → 五并行支，工序执行下挂竖链
 * 右簇 委外：销售订单 + 独立需求 → 委外订单 → 四并行支，委外入库下挂竖链
 *
 * 汇入下方节点一律【上边】入点；同源多分支底边出口左右错开。
 */

const H = 36
const halfH = H / 2

const ROW = {
  top: 90,
  hub: 220,
  branch: 360,
  v1: 470,
  v2: 560,
  v3: 650,
}

/** 左簇中心 ~280，中簇 ~900，右簇 ~1580 */
const L = {
  demand: 160,
  sales: 400,
  hub: 280,
  purchase: 100,
  prod: 280,
  outsource: 460,
}

const M = {
  demand: 720,
  sales: 1080,
  hub: 900,
  process: 560,
  finish: 730,
  qc: 900,
  pick: 1070,
  ret: 1240,
}

const R = {
  sales: 1420,
  demand: 1740,
  hub: 1580,
  in: 1340,
  qc: 1510,
  pick: 1680,
  ret: 1850,
}

const N = {
  // —— 左簇 ——
  lDemand: { x: L.demand, y: ROW.top },
  lSales: { x: L.sales, y: ROW.top },
  mrp: { x: L.hub, y: ROW.hub },
  lPurchase: { x: L.purchase, y: ROW.branch },
  lProd: { x: L.prod, y: ROW.branch },
  lOut: { x: L.outsource, y: ROW.branch },
  // —— 中簇 ——
  mDemand: { x: M.demand, y: ROW.top },
  mSales: { x: M.sales, y: ROW.top },
  mProd: { x: M.hub, y: ROW.hub },
  mProcess: { x: M.process, y: ROW.branch },
  mFinish: { x: M.finish, y: ROW.branch },
  mQc: { x: M.qc, y: ROW.branch },
  mPick: { x: M.pick, y: ROW.branch },
  mRet: { x: M.ret, y: ROW.branch },
  mReport: { x: M.process, y: ROW.v1 },
  mInspect: { x: M.process, y: ROW.v2 },
  mCost: { x: M.process, y: ROW.v3 },
  // —— 右簇 ——
  rSales: { x: R.sales, y: ROW.top },
  rDemand: { x: R.demand, y: ROW.top },
  rOut: { x: R.hub, y: ROW.hub },
  rIn: { x: R.in, y: ROW.branch },
  rQc: { x: R.qc, y: ROW.branch },
  rPick: { x: R.pick, y: ROW.branch },
  rRet: { x: R.ret, y: ROW.branch },
  rRetEx: { x: R.in, y: ROW.v1 },
  rRetWh: { x: R.in, y: ROW.v2 },
  rExIn: { x: R.in, y: ROW.v3 },
}

function bottom(x, y, dx = 0) {
  return { x: x + dx, y: y + halfH }
}
function topIn(x, y, dx = 0) {
  return { x: x + dx, y: y - halfH }
}

/** 竖直短链 */
function verticalEdge(id, source, target, sx, sy, tx, ty) {
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

/** 上方两源汇入 hub 上边 */
function fanInTop(id, source, target, sx, sy, tx, ty, dx) {
  return flowCurve({
    id,
    source,
    target,
    pointsList: [
      bottom(sx, sy),
      { x: sx, y: (sy + ty) / 2 },
      { x: tx + dx, y: (sy + ty) / 2 },
      topIn(tx, ty, dx),
    ],
  })
}

/** hub 底边分叉到同行多子节点 */
function fanOut(id, source, target, sx, sy, tx, ty, exitDx, inDx = 0) {
  return flowCurve({
    id,
    source,
    target,
    pointsList: [
      bottom(sx, sy, exitDx),
      { x: sx + exitDx, y: sy + 55 },
      { x: tx + inDx, y: ty - 55 },
      topIn(tx, ty, inDx),
    ],
  })
}

export const productionFlowchart = defineFlowchart(
  '生产管理流程',
  [
    // 左簇
    flowNode({ id: 'l-demand', text: '独立需求', ...N.lDemand, path: '/production/independent-demand' }),
    flowNode({ id: 'l-sales', text: '销售订单', ...N.lSales, path: '/sales/order' }),
    flowNode({ id: 'mrp', text: 'MRP计划', ...N.mrp, path: '/plan/mrp' }),
    flowNode({ id: 'l-purchase', text: '采购订单', ...N.lPurchase, path: '/purchase/order' }),
    flowNode({ id: 'l-prod', text: '生产订单', ...N.lProd, path: '/production/in-house' }),
    flowNode({ id: 'l-out', text: '委外订单', ...N.lOut, path: '/production/outsource' }),
    // 中簇
    flowNode({ id: 'm-demand', text: '独立需求', ...N.mDemand, path: '/production/independent-demand' }),
    flowNode({ id: 'm-sales', text: '销售订单', ...N.mSales, path: '/sales/order' }),
    flowNode({ id: 'm-prod', text: '生产订单', ...N.mProd, path: '/production/in-house' }),
    flowNode({ id: 'm-process', text: '工序执行', ...N.mProcess, path: null }),
    flowNode({ id: 'm-finish', text: '完工入库', ...N.mFinish, path: null }),
    flowNode({ id: 'm-qc', text: '成品质检', ...N.mQc, path: '/production/fg-qc' }),
    flowNode({ id: 'm-pick', text: '领料出库', ...N.mPick, path: '/stock/pick-out' }),
    flowNode({ id: 'm-ret', text: '退料入库', ...N.mRet, path: '/stock/material-return' }),
    flowNode({ id: 'm-report', text: '工序汇报', ...N.mReport, path: null }),
    flowNode({ id: 'm-inspect', text: '工序检验', ...N.mInspect, path: null }),
    flowNode({ id: 'm-cost', text: '工序核算', ...N.mCost, path: null }),
    // 右簇
    flowNode({ id: 'r-sales', text: '销售订单', ...N.rSales, path: '/sales/order' }),
    flowNode({ id: 'r-demand', text: '独立需求', ...N.rDemand, path: '/production/independent-demand' }),
    flowNode({ id: 'r-out', text: '委外订单', ...N.rOut, path: '/production/outsource' }),
    flowNode({ id: 'r-in', text: '委外入库', ...N.rIn, path: null }),
    flowNode({ id: 'r-qc', text: '成品质检', ...N.rQc, path: '/production/fg-qc' }),
    flowNode({ id: 'r-pick', text: '领料出库', ...N.rPick, path: '/stock/pick-out' }),
    flowNode({ id: 'r-ret', text: '退料入库', ...N.rRet, path: '/stock/material-return' }),
    flowNode({ id: 'r-retex', text: '委外退换', ...N.rRetEx, path: null }),
    flowNode({ id: 'r-retwh', text: '委外退库', ...N.rRetWh, path: null }),
    flowNode({ id: 'r-exin', text: '委外换入', ...N.rExIn, path: null }),
  ],
  [
    // —— 左簇：汇入 MRP ——
    fanInTop('e-ld-mrp', 'l-demand', 'mrp', N.lDemand.x, N.lDemand.y, N.mrp.x, N.mrp.y, -36),
    fanInTop('e-ls-mrp', 'l-sales', 'mrp', N.lSales.x, N.lSales.y, N.mrp.x, N.mrp.y, 36),
    fanOut('e-mrp-po', 'mrp', 'l-purchase', N.mrp.x, N.mrp.y, N.lPurchase.x, N.lPurchase.y, -50),
    fanOut('e-mrp-prod', 'mrp', 'l-prod', N.mrp.x, N.mrp.y, N.lProd.x, N.lProd.y, 0),
    fanOut('e-mrp-out', 'mrp', 'l-out', N.mrp.x, N.mrp.y, N.lOut.x, N.lOut.y, 50),

    // —— 中簇：汇入生产订单 ——
    fanInTop('e-md-prod', 'm-demand', 'm-prod', N.mDemand.x, N.mDemand.y, N.mProd.x, N.mProd.y, -36),
    fanInTop('e-ms-prod', 'm-sales', 'm-prod', N.mSales.x, N.mSales.y, N.mProd.x, N.mProd.y, 36),
    fanOut('e-prod-process', 'm-prod', 'm-process', N.mProd.x, N.mProd.y, N.mProcess.x, N.mProcess.y, -70),
    fanOut('e-prod-finish', 'm-prod', 'm-finish', N.mProd.x, N.mProd.y, N.mFinish.x, N.mFinish.y, -35),
    fanOut('e-prod-qc', 'm-prod', 'm-qc', N.mProd.x, N.mProd.y, N.mQc.x, N.mQc.y, 0),
    fanOut('e-prod-pick', 'm-prod', 'm-pick', N.mProd.x, N.mProd.y, N.mPick.x, N.mPick.y, 35),
    fanOut('e-prod-ret', 'm-prod', 'm-ret', N.mProd.x, N.mProd.y, N.mRet.x, N.mRet.y, 70),
    verticalEdge('e-process-report', 'm-process', 'm-report', N.mProcess.x, N.mProcess.y, N.mReport.x, N.mReport.y),
    verticalEdge('e-report-inspect', 'm-report', 'm-inspect', N.mReport.x, N.mReport.y, N.mInspect.x, N.mInspect.y),
    verticalEdge('e-inspect-cost', 'm-inspect', 'm-cost', N.mInspect.x, N.mInspect.y, N.mCost.x, N.mCost.y),

    // —— 右簇：汇入委外订单 ——
    fanInTop('e-rs-out', 'r-sales', 'r-out', N.rSales.x, N.rSales.y, N.rOut.x, N.rOut.y, -36),
    fanInTop('e-rd-out', 'r-demand', 'r-out', N.rDemand.x, N.rDemand.y, N.rOut.x, N.rOut.y, 36),
    fanOut('e-out-in', 'r-out', 'r-in', N.rOut.x, N.rOut.y, N.rIn.x, N.rIn.y, -55),
    fanOut('e-out-qc', 'r-out', 'r-qc', N.rOut.x, N.rOut.y, N.rQc.x, N.rQc.y, -18),
    fanOut('e-out-pick', 'r-out', 'r-pick', N.rOut.x, N.rOut.y, N.rPick.x, N.rPick.y, 18),
    fanOut('e-out-ret', 'r-out', 'r-ret', N.rOut.x, N.rOut.y, N.rRet.x, N.rRet.y, 55),
    verticalEdge('e-in-retex', 'r-in', 'r-retex', N.rIn.x, N.rIn.y, N.rRetEx.x, N.rRetEx.y),
    verticalEdge('e-retex-retwh', 'r-retex', 'r-retwh', N.rRetEx.x, N.rRetEx.y, N.rRetWh.x, N.rRetWh.y),
    verticalEdge('e-retwh-exin', 'r-retwh', 'r-exin', N.rRetWh.x, N.rRetWh.y, N.rExIn.x, N.rExIn.y),
  ],
)
