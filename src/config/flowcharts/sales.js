import { defineFlowchart, flowCurve, flowEdge, flowNode } from './helpers'

/**
 * 销售管理流程 — 连线分区，避免重叠
 *
 * 主行：销售订单 → 销售出库 → 销售退换 → 销售退货入库 → 销售换货出库
 * 支行（同一行左右排）：销货订单 | 销项发票 …… 应收事项 → 收款单
 *
 * 同源向下分支优先「一行左右排」，从上方落入目标【上边】；
 * 汇入应收事项同样上边入点、左右错开。
 */

const H = 36
const halfH = H / 2

const COL = {
  order: 100,
  outbound: 320,
  retEx: 540,
  retIn: 760,
  exOut: 980,
}

const ROW = {
  main: 110,
  // 支行：销货/发票与应收/收款同一水平带，左右分区
  branch: 300,
}

const N = {
  order: { x: COL.order, y: ROW.main },
  outbound: { x: COL.outbound, y: ROW.main },
  retEx: { x: COL.retEx, y: ROW.main },
  retIn: { x: COL.retIn, y: ROW.main },
  exOut: { x: COL.exOut, y: ROW.main },
  // 左区：销货订单、销项发票 —— 同一行左右排列
  goodsOrder: { x: COL.outbound - 20, y: ROW.branch },
  invoice: { x: COL.outbound + 200, y: ROW.branch },
  // 右区：应收事项、收款单
  receivable: { x: COL.retIn, y: ROW.branch },
  receipt: { x: COL.exOut, y: ROW.branch },
}

function bottom(_id, x, y) {
  return { x, y: y + halfH }
}
function topIn(x, y, dx = 0) {
  return { x: x + dx, y: y - halfH }
}

export const salesFlowchart = defineFlowchart(
  '销售管理流程',
  [
    flowNode({ id: 'sales-order', text: '销售订单', ...N.order, path: '/sales/order' }),
    flowNode({ id: 'outbound', text: '销售出库', ...N.outbound, path: '/sales/outbound' }),
    flowNode({ id: 'return-exchange', text: '销售退换', ...N.retEx, path: '/sales/return-exchange' }),
    flowNode({ id: 'return-in', text: '销售退货入库', ...N.retIn, path: '/sales/return-in' }),
    flowNode({ id: 'exchange-out', text: '销售换货出库', ...N.exOut, path: '/sales/exchange-out' }),
    flowNode({ id: 'goods-order', text: '销货订单', ...N.goodsOrder, path: '/sales/shipment' }),
    flowNode({ id: 'output-invoice', text: '销项发票', ...N.invoice, path: '/cash/output-invoice' }),
    flowNode({ id: 'receivable', text: '应收事项', ...N.receivable, path: '/cash/receivable' }),
    flowNode({ id: 'receipt', text: '收款单', ...N.receipt, path: '/cash/receipt' }),
  ],
  [
    flowEdge({ id: 'e-order-out', source: 'sales-order', target: 'outbound' }),
    flowEdge({ id: 'e-out-ret', source: 'outbound', target: 'return-exchange' }),
    flowEdge({ id: 'e-ret-in', source: 'return-exchange', target: 'return-in' }),
    flowEdge({ id: 'e-in-ex', source: 'return-in', target: 'exchange-out' }),
    flowEdge({ id: 'e-recv-receipt', source: 'receivable', target: 'receipt' }),

    // 出库 → 销货订单（上边入，偏左出口）
    flowCurve({
      id: 'e-out-goods',
      source: 'outbound',
      target: 'goods-order',
      pointsList: [
        bottom('outbound', N.outbound.x - 36, N.outbound.y),
        { x: N.outbound.x - 36, y: N.outbound.y + 70 },
        { x: N.goodsOrder.x, y: N.goodsOrder.y - 70 },
        topIn(N.goodsOrder.x, N.goodsOrder.y, 0),
      ],
    }),

    // 出库 → 销项发票（上边入，偏右出口，与上条错开）
    flowCurve({
      id: 'e-out-invoice',
      source: 'outbound',
      target: 'output-invoice',
      pointsList: [
        bottom('outbound', N.outbound.x + 36, N.outbound.y),
        { x: N.outbound.x + 100, y: N.outbound.y + 80 },
        { x: N.invoice.x - 20, y: N.invoice.y - 70 },
        topIn(N.invoice.x, N.invoice.y, 0),
      ],
    }),

    // 出库 → 应收（右侧通道，上边偏左入）
    flowCurve({
      id: 'e-out-receivable',
      source: 'outbound',
      target: 'receivable',
      pointsList: [
        bottom('outbound', N.outbound.x + 55, N.outbound.y),
        { x: N.outbound.x + 220, y: N.outbound.y + 40 },
        { x: N.receivable.x - 100, y: N.receivable.y - 55 },
        topIn(N.receivable.x, N.receivable.y, -52),
      ],
    }),

    // 退换 → 应收（上边正中）
    flowCurve({
      id: 'e-ret-receivable',
      source: 'return-exchange',
      target: 'receivable',
      pointsList: [
        bottom('retEx', N.retEx.x + 24, N.retEx.y),
        { x: N.retEx.x + 70, y: N.retEx.y + 85 },
        { x: N.receivable.x - 16, y: N.receivable.y - 85 },
        topIn(N.receivable.x, N.receivable.y, 0),
      ],
    }),

    // 退货入库 → 应收（上边偏右）
    flowCurve({
      id: 'e-in-receivable',
      source: 'return-in',
      target: 'receivable',
      pointsList: [
        bottom('retIn', N.retIn.x, N.retIn.y),
        { x: N.retIn.x + 8, y: N.retIn.y + 65 },
        { x: N.receivable.x + 36, y: N.receivable.y - 65 },
        topIn(N.receivable.x, N.receivable.y, 52),
      ],
    }),
  ],
)
