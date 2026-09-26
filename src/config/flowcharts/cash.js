import { defineFlowchart, flowCurve, flowNode } from './helpers'

/**
 * 往来现金流程 — 贴近业务示意图
 *
 * 上行：采购入库 | 采购退换 | 采购退货出库 | 支出单 | 销售退换 | 销售退货入库 | 收入单 | 销售出库
 * 中行：进项发票（对入库） 应付事项（对退换） …… 应收事项（对退货入库） 销项发票（对销售出库）
 * 下行：付款单（对应付） 收款单（对应收）
 *
 * 左簇汇入应付、右簇汇入应收：箭头一律落在目标【上边】，左右错开
 */

const H = 36
const halfH = H / 2

const GAP = 175
const COL = {
  pIn: 100,
  pRet: 100 + GAP,
  pOut: 100 + GAP * 2,
  expense: 100 + GAP * 3,
  sRet: 100 + GAP * 4,
  sIn: 100 + GAP * 5,
  income: 100 + GAP * 6,
  sOut: 100 + GAP * 7,
}

const ROW = {
  top: 110,
  mid: 290,
  bottom: 450,
}

const N = {
  purchaseIn: { x: COL.pIn, y: ROW.top },
  purchaseRet: { x: COL.pRet, y: ROW.top },
  purchaseOut: { x: COL.pOut, y: ROW.top },
  expense: { x: COL.expense, y: ROW.top },
  salesRet: { x: COL.sRet, y: ROW.top },
  salesIn: { x: COL.sIn, y: ROW.top },
  income: { x: COL.income, y: ROW.top },
  salesOut: { x: COL.sOut, y: ROW.top },
  inputInvoice: { x: COL.pIn, y: ROW.mid },
  payable: { x: COL.pRet, y: ROW.mid },
  receivable: { x: COL.sIn, y: ROW.mid },
  outputInvoice: { x: COL.sOut, y: ROW.mid },
  payment: { x: COL.pRet, y: ROW.bottom },
  receipt: { x: COL.sIn, y: ROW.bottom },
}

function bottom(_id, x, y) {
  return { x, y: y + halfH }
}
function topIn(x, y, dx = 0) {
  return { x: x + dx, y: y - halfH }
}

export const cashFlowchart = defineFlowchart(
  '往来现金流程',
  [
    flowNode({ id: 'purchase-in', text: '采购入库', ...N.purchaseIn, path: '/purchase/inbound' }),
    flowNode({ id: 'purchase-ret', text: '采购退换', ...N.purchaseRet, path: '/purchase/return-exchange' }),
    flowNode({ id: 'purchase-out', text: '采购退货出库', ...N.purchaseOut, path: '/purchase/return-out' }),
    flowNode({ id: 'expense', text: '支出单', ...N.expense, path: '/cash/expense' }),
    flowNode({ id: 'sales-ret', text: '销售退换', ...N.salesRet, path: '/sales/return-exchange' }),
    flowNode({ id: 'sales-in', text: '销售退货入库', ...N.salesIn, path: '/sales/return-in' }),
    flowNode({ id: 'income', text: '收入单', ...N.income, path: '/cash/income' }),
    flowNode({ id: 'sales-out', text: '销售出库', ...N.salesOut, path: '/sales/outbound' }),
    flowNode({ id: 'input-invoice', text: '进项发票', ...N.inputInvoice, path: '/cash/input-invoice' }),
    flowNode({ id: 'payable', text: '应付事项', ...N.payable, path: '/cash/payable' }),
    flowNode({ id: 'receivable', text: '应收事项', ...N.receivable, path: '/cash/receivable' }),
    flowNode({ id: 'output-invoice', text: '销项发票', ...N.outputInvoice, path: '/cash/output-invoice' }),
    flowNode({ id: 'payment', text: '付款单', ...N.payment, path: '/cash/payment' }),
    flowNode({ id: 'receipt', text: '收款单', ...N.receipt, path: '/cash/receipt' }),
  ],
  [
    // —— 左簇：进项 / 应付 / 付款 ——
    flowCurve({
      id: 'e-pin-invoice',
      source: 'purchase-in',
      target: 'input-invoice',
      pointsList: [
        bottom('pin', N.purchaseIn.x, N.purchaseIn.y),
        { x: N.purchaseIn.x, y: (N.purchaseIn.y + N.inputInvoice.y) / 2 },
        { x: N.inputInvoice.x, y: (N.purchaseIn.y + N.inputInvoice.y) / 2 },
        topIn(N.inputInvoice.x, N.inputInvoice.y, 0),
      ],
    }),
    // 采购入库 → 应付（上边偏左）
    flowCurve({
      id: 'e-pin-payable',
      source: 'purchase-in',
      target: 'payable',
      pointsList: [
        bottom('pin', N.purchaseIn.x + 30, N.purchaseIn.y),
        { x: N.purchaseIn.x + 90, y: N.purchaseIn.y + 80 },
        { x: N.payable.x - 50, y: N.payable.y - 80 },
        topIn(N.payable.x, N.payable.y, -48),
      ],
    }),
    // 采购退换 → 应付（上边正中）
    flowCurve({
      id: 'e-pret-payable',
      source: 'purchase-ret',
      target: 'payable',
      pointsList: [
        bottom('pret', N.purchaseRet.x, N.purchaseRet.y),
        { x: N.purchaseRet.x, y: (N.purchaseRet.y + N.payable.y) / 2 },
        { x: N.payable.x, y: (N.purchaseRet.y + N.payable.y) / 2 },
        topIn(N.payable.x, N.payable.y, 0),
      ],
    }),
    // 采购退货出库 → 应付（上边偏右）
    flowCurve({
      id: 'e-pout-payable',
      source: 'purchase-out',
      target: 'payable',
      pointsList: [
        bottom('pout', N.purchaseOut.x, N.purchaseOut.y),
        { x: N.purchaseOut.x - 40, y: N.purchaseOut.y + 90 },
        { x: N.payable.x + 40, y: N.payable.y - 70 },
        topIn(N.payable.x, N.payable.y, 36),
      ],
    }),
    // 支出单 → 应付（更右入点，绕开退货出库弧）
    flowCurve({
      id: 'e-expense-payable',
      source: 'expense',
      target: 'payable',
      pointsList: [
        bottom('exp', N.expense.x - 20, N.expense.y),
        { x: N.expense.x - 80, y: N.expense.y + 100 },
        { x: N.payable.x + 70, y: N.payable.y - 55 },
        topIn(N.payable.x, N.payable.y, 56),
      ],
    }),
    flowCurve({
      id: 'e-payable-pay',
      source: 'payable',
      target: 'payment',
      pointsList: [
        bottom('pay', N.payable.x, N.payable.y),
        { x: N.payable.x, y: (N.payable.y + N.payment.y) / 2 },
        { x: N.payment.x, y: (N.payable.y + N.payment.y) / 2 },
        topIn(N.payment.x, N.payment.y, 0),
      ],
    }),

    // —— 右簇：应收 / 销项 / 收款 ——
    // 销售退换 → 应收（上边偏左）
    flowCurve({
      id: 'e-sret-recv',
      source: 'sales-ret',
      target: 'receivable',
      pointsList: [
        bottom('sret', N.salesRet.x + 20, N.salesRet.y),
        { x: N.salesRet.x + 70, y: N.salesRet.y + 90 },
        { x: N.receivable.x - 50, y: N.receivable.y - 75 },
        topIn(N.receivable.x, N.receivable.y, -48),
      ],
    }),
    // 销售退货入库 → 应收（上边正中）
    flowCurve({
      id: 'e-sin-recv',
      source: 'sales-in',
      target: 'receivable',
      pointsList: [
        bottom('sin', N.salesIn.x, N.salesIn.y),
        { x: N.salesIn.x, y: (N.salesIn.y + N.receivable.y) / 2 },
        { x: N.receivable.x, y: (N.salesIn.y + N.receivable.y) / 2 },
        topIn(N.receivable.x, N.receivable.y, 0),
      ],
    }),
    // 收入单 → 应收（上边偏右）
    flowCurve({
      id: 'e-income-recv',
      source: 'income',
      target: 'receivable',
      pointsList: [
        bottom('inc', N.income.x - 16, N.income.y),
        { x: N.income.x - 60, y: N.income.y + 90 },
        { x: N.receivable.x + 40, y: N.receivable.y - 70 },
        topIn(N.receivable.x, N.receivable.y, 36),
      ],
    }),
    // 销售出库 → 应收（更右入点）
    flowCurve({
      id: 'e-sout-recv',
      source: 'sales-out',
      target: 'receivable',
      pointsList: [
        bottom('sout', N.salesOut.x - 40, N.salesOut.y),
        { x: N.salesOut.x - 120, y: N.salesOut.y + 100 },
        { x: N.receivable.x + 70, y: N.receivable.y - 55 },
        topIn(N.receivable.x, N.receivable.y, 56),
      ],
    }),
    // 销售出库 → 销项发票（竖直）
    flowCurve({
      id: 'e-sout-invoice',
      source: 'sales-out',
      target: 'output-invoice',
      pointsList: [
        bottom('sout', N.salesOut.x, N.salesOut.y),
        { x: N.salesOut.x, y: (N.salesOut.y + N.outputInvoice.y) / 2 },
        { x: N.outputInvoice.x, y: (N.salesOut.y + N.outputInvoice.y) / 2 },
        topIn(N.outputInvoice.x, N.outputInvoice.y, 0),
      ],
    }),
    flowCurve({
      id: 'e-recv-receipt',
      source: 'receivable',
      target: 'receipt',
      pointsList: [
        bottom('recv', N.receivable.x, N.receivable.y),
        { x: N.receivable.x, y: (N.receivable.y + N.receipt.y) / 2 },
        { x: N.receipt.x, y: (N.receivable.y + N.receipt.y) / 2 },
        topIn(N.receipt.x, N.receipt.y, 0),
      ],
    }),
  ],
)
