import { defineFlowchart, flowCurve, flowEdge, flowNode } from './helpers'

/**
 * 采购管理流程 — 对齐业务示意图
 *
 * 主行：请购订单 → 采购订单 → 采购入库 → 采购退换 → 采购退货出库 → 采购换货入库
 * 底行：销售订单、进项发票、应付事项 → 付款单
 * 汇入应付事项的曲线：箭头一律落在应付事项【上边】，左右错开避免重叠
 */

const H = 36
const halfH = H / 2

const COL = {
  req: 120,
  order: 320,
  inbound: 520,
  retEx: 720,
  retOut: 940,
  exIn: 1160,
}

const ROW = {
  main: 120,
  sales: 280,
  bottom: 300,
}

const N = {
  requisition: { x: COL.req, y: ROW.main },
  sales: { x: COL.req, y: ROW.sales },
  order: { x: COL.order, y: ROW.main },
  inbound: { x: COL.inbound, y: ROW.main },
  retEx: { x: COL.retEx, y: ROW.main },
  retOut: { x: COL.retOut, y: ROW.main },
  exIn: { x: COL.exIn, y: ROW.main },
  invoice: { x: COL.inbound, y: ROW.bottom },
  // 应付事项在「采购退换」正下方；付款单在「采购退货出库」正下方
  payable: { x: COL.retEx, y: ROW.bottom },
  payment: { x: COL.retOut, y: ROW.bottom },
}

function bottom(_id, x, y) {
  return { x, y: y + halfH }
}
function top(_id, x, y) {
  return { x, y: y - halfH }
}
/** 上边入点，dx 相对节点中心左右错开，避免多箭头重叠 */
function topIn(x, y, dx = 0) {
  return { x: x + dx, y: y - halfH }
}

export const purchaseFlowchart = defineFlowchart(
  '采购管理流程',
  [
    flowNode({ id: 'requisition', text: '请购订单', ...N.requisition, path: '/purchase/requisition' }),
    flowNode({ id: 'sales-order', text: '销售订单', ...N.sales, path: '/sales/order' }),
    flowNode({ id: 'purchase-order', text: '采购订单', ...N.order, path: '/purchase/order' }),
    flowNode({ id: 'inbound', text: '采购入库', ...N.inbound, path: '/purchase/inbound' }),
    flowNode({ id: 'return-exchange', text: '采购退换', ...N.retEx, path: '/purchase/return-exchange' }),
    flowNode({ id: 'return-out', text: '采购退货出库', ...N.retOut, path: '/purchase/return-out' }),
    flowNode({ id: 'exchange-in', text: '采购换货入库', ...N.exIn, path: '/purchase/exchange-in' }),
    flowNode({ id: 'input-invoice', text: '进项发票', ...N.invoice, path: '/cash/input-invoice' }),
    flowNode({ id: 'payable', text: '应付事项', ...N.payable, path: '/cash/payable' }),
    flowNode({ id: 'payment', text: '付款单', ...N.payment, path: '/cash/payment' }),
  ],
  [
    // 主链水平
    flowEdge({ id: 'e-req-order', source: 'requisition', target: 'purchase-order' }),
    flowEdge({ id: 'e-order-inbound', source: 'purchase-order', target: 'inbound' }),
    flowEdge({ id: 'e-inbound-ret', source: 'inbound', target: 'return-exchange' }),
    flowEdge({ id: 'e-ret-out', source: 'return-exchange', target: 'return-out' }),
    flowEdge({ id: 'e-out-ex', source: 'return-out', target: 'exchange-in' }),
    flowEdge({ id: 'e-payable-pay', source: 'payable', target: 'payment' }),

    // 销售订单 → 采购订单（斜向曲线，近似示意图对角线）
    flowCurve({
      id: 'e-sales-order',
      source: 'sales-order',
      target: 'purchase-order',
      pointsList: [
        top('sales', N.sales.x + 30, N.sales.y),
        { x: N.sales.x + 90, y: N.sales.y - 40 },
        { x: N.order.x - 20, y: N.order.y + 50 },
        bottom('order', N.order.x, N.order.y),
      ],
    }),

    // 采购入库 → 进项发票（竖直）
    flowCurve({
      id: 'e-inbound-invoice',
      source: 'inbound',
      target: 'input-invoice',
      pointsList: [
        bottom('inbound', N.inbound.x, N.inbound.y),
        { x: N.inbound.x, y: (N.inbound.y + N.invoice.y) / 2 },
        { x: N.invoice.x, y: (N.inbound.y + N.invoice.y) / 2 },
        top('invoice', N.invoice.x, N.invoice.y),
      ],
    }),

    // 采购入库 → 应付事项（右下弧，箭头落在应付事项【上边】偏左）
    flowCurve({
      id: 'e-inbound-payable',
      source: 'inbound',
      target: 'payable',
      pointsList: [
        bottom('inbound', N.inbound.x + 20, N.inbound.y),
        { x: N.inbound.x + 120, y: N.inbound.y + 70 },
        { x: N.payable.x - 50, y: N.payable.y - 70 },
        topIn(N.payable.x, N.payable.y, -36),
      ],
    }),

    // 采购退换 → 应付事项（竖直向下，箭头落在应付事项【上边】正中）
    flowCurve({
      id: 'e-ret-payable',
      source: 'return-exchange',
      target: 'payable',
      pointsList: [
        bottom('retEx', N.retEx.x, N.retEx.y),
        { x: N.retEx.x, y: (N.retEx.y + N.payable.y) / 2 },
        { x: N.payable.x, y: (N.retEx.y + N.payable.y) / 2 },
        topIn(N.payable.x, N.payable.y, 0),
      ],
    }),

    // 采购退货出库 → 应付事项（左下弧，箭头落在应付事项【上边】偏右）
    flowCurve({
      id: 'e-out-payable',
      source: 'return-out',
      target: 'payable',
      pointsList: [
        bottom('retOut', N.retOut.x - 20, N.retOut.y),
        { x: N.retOut.x - 100, y: N.retOut.y + 70 },
        { x: N.payable.x + 50, y: N.payable.y - 70 },
        topIn(N.payable.x, N.payable.y, 36),
      ],
    }),
  ],
)
