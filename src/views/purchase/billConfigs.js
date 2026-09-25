/** 采购单据页配置 */
export const STATUS_OPTIONS = [
  { value: '已保存', label: '已保存', type: 'info' },
  { value: '待审核', label: '待审核', type: 'warning' },
  { value: '已审核', label: '已审核', type: 'success' },
  { value: '审核拒绝', label: '审核拒绝', type: 'danger' },
  { value: '已取消', label: '已取消', type: 'info' },
  { value: '已完结', label: '已完结', type: 'success' },
]

export const BILL_CONFIGS = {
  plan: {
    title: '采购计划',
    billKey: 'plan',
    addLabel: '新增采购计划',
    extraSearch: [
      { key: 'planType', label: '计划类型', placeholder: '请输入计划类型' },
    ],
    columns: [
      { prop: 'planType', label: '计划类型', minWidth: 110 },
      { prop: 'contractNo', label: '合同号', minWidth: 120 },
    ],
    formExtras: [
      { key: 'planType', label: '计划类型', required: true },
      { key: 'contractNo', label: '合同号' },
    ],
    itemFields: ['materialName', 'number', 'unitName', 'remark'],
    moreActions: [{ command: 'pushRequisition', label: '下推请购单' }],
  },
  requisition: {
    title: '请购单',
    billKey: 'requisition',
    addLabel: '新增请购单',
    extraSearch: [
      { key: 'supplierName', label: '建议供应商', placeholder: '请输入供应商' },
      {
        key: 'requisitionAdminName',
        label: '请购人',
        placeholder: '请输入请购人',
      },
    ],
    columns: [
      { prop: 'requisitionAdminName', label: '请购人', width: 100 },
      { prop: 'requisitionDeptName', label: '请购部门', minWidth: 110 },
      { prop: 'supplierName', label: '建议供应商', minWidth: 140 },
      { prop: 'demandDate', label: '需求日期', width: 120 },
    ],
    formExtras: [
      { key: 'requisitionAdminName', label: '请购人', required: true },
      { key: 'requisitionDeptName', label: '请购部门' },
      { key: 'supplierName', label: '建议供应商' },
      { key: 'demandDate', label: '需求日期' },
    ],
    itemFields: ['materialName', 'number', 'unitName', 'remark'],
    moreActions: [
      { command: 'pushOrder', label: '下推采购订单' },
      { command: 'pushCompare', label: '下推采购比价' },
    ],
  },
  order: {
    title: '采购订单',
    billKey: 'order',
    addLabel: '新增采购订单',
    extraSearch: [
      { key: 'supplierName', label: '供应商', placeholder: '请输入供应商' },
    ],
    columns: [
      { prop: 'supplierName', label: '供应商', minWidth: 140 },
      { prop: 'supplierCode', label: '供应商编码', width: 110 },
      {
        prop: 'amountTotal',
        label: '价税合计',
        width: 110,
        align: 'right',
        format: 'amount',
      },
      { prop: 'arrivalDate', label: '到货日期', width: 120 },
      { prop: 'settleStatus', label: '结算状态', width: 100 },
      { prop: 'invoiceStatus', label: '开票状态', width: 100 },
    ],
    formExtras: [
      { key: 'supplierName', label: '供应商', required: true },
      { key: 'supplierCode', label: '供应商编码' },
      { key: 'arrivalDate', label: '到货日期' },
      { key: 'contractNo', label: '合同号' },
    ],
    itemFields: [
      'materialName',
      'number',
      'unitName',
      'costPrice',
      'taxRate',
      'taxCostPrice',
    ],
    amountField: 'amountTotal',
    moreActions: [
      { command: 'pushInbound', label: '下推采购入库' },
      { command: 'complete', label: '完结' },
    ],
  },
  inbound: {
    title: '采购入库',
    billKey: 'inbound',
    addLabel: '新增采购入库',
    extraSearch: [
      { key: 'supplierName', label: '供应商', placeholder: '请输入供应商' },
    ],
    columns: [
      { prop: 'sourceBillCode', label: '来源单据', minWidth: 140 },
      { prop: 'supplierName', label: '供应商', minWidth: 140 },
      {
        prop: 'amountTotal',
        label: '价税合计',
        width: 110,
        align: 'right',
        format: 'amount',
      },
      { prop: 'settleStatus', label: '结算状态', width: 100 },
    ],
    formExtras: [
      { key: 'sourceBillCode', label: '来源单据' },
      { key: 'supplierName', label: '供应商', required: true },
      { key: 'contractNo', label: '合同号' },
    ],
    itemFields: [
      'materialName',
      'number',
      'unitName',
      'stockName',
      'locationName',
      'costPrice',
      'taxCostPrice',
    ],
    amountField: 'amountTotal',
    moreActions: [
      { command: 'pushReturn', label: '下推采购退换' },
      { command: 'complete', label: '完结' },
    ],
  },
  returnExchange: {
    title: '采购退换',
    billKey: 'returnExchange',
    addLabel: '新增采购退换',
    extraSearch: [
      { key: 'supplierName', label: '供应商', placeholder: '请输入供应商' },
      { key: 'refundType', label: '退换类型', placeholder: '退货/换货' },
    ],
    columns: [
      { prop: 'refundType', label: '退换类型', width: 100 },
      { prop: 'sourceBillCode', label: '来源单据', minWidth: 140 },
      { prop: 'supplierName', label: '供应商', minWidth: 140 },
      {
        prop: 'amountTotal',
        label: '价税合计',
        width: 110,
        align: 'right',
        format: 'amount',
      },
      { prop: 'instockStatus', label: '入库状态', width: 100 },
      { prop: 'outstockStatus', label: '出库状态', width: 100 },
    ],
    formExtras: [
      { key: 'refundType', label: '退换类型', required: true },
      { key: 'sourceBillCode', label: '来源单据' },
      { key: 'supplierName', label: '供应商', required: true },
    ],
    itemFields: [
      'materialName',
      'number',
      'refundNumber',
      'unitName',
      'costPrice',
    ],
    amountField: 'amountTotal',
    moreActions: [
      { command: 'pushReturnOut', label: '下推退货出库' },
      { command: 'pushExchangeIn', label: '下推换货入库' },
    ],
  },
  returnOut: {
    title: '退货出库',
    billKey: 'returnOut',
    addLabel: '新增退货出库',
    extraSearch: [
      { key: 'supplierName', label: '供应商', placeholder: '请输入供应商' },
    ],
    columns: [
      { prop: 'refundType', label: '退换类型', width: 100 },
      { prop: 'sourceBillCode', label: '来源单据', minWidth: 140 },
      { prop: 'supplierName', label: '供应商', minWidth: 140 },
      {
        prop: 'amountTotal',
        label: '价税合计',
        width: 110,
        align: 'right',
        format: 'amount',
      },
    ],
    formExtras: [
      { key: 'refundType', label: '退换类型' },
      { key: 'sourceBillCode', label: '来源单据' },
      { key: 'supplierName', label: '供应商', required: true },
    ],
    itemFields: [
      'materialName',
      'number',
      'unitName',
      'stockName',
      'locationName',
      'costPrice',
    ],
    amountField: 'amountTotal',
    moreActions: [{ command: 'pushExchangeIn', label: '下推换货入库' }],
  },
  exchangeIn: {
    title: '换货入库',
    billKey: 'exchangeIn',
    addLabel: '新增换货入库',
    extraSearch: [
      { key: 'supplierName', label: '供应商', placeholder: '请输入供应商' },
    ],
    columns: [
      { prop: 'sourceBillCode', label: '来源单据', minWidth: 140 },
      { prop: 'supplierName', label: '供应商', minWidth: 140 },
      {
        prop: 'amountTotal',
        label: '价税合计',
        width: 110,
        align: 'right',
        format: 'amount',
      },
    ],
    formExtras: [
      { key: 'sourceBillCode', label: '来源单据' },
      { key: 'supplierName', label: '供应商', required: true },
    ],
    itemFields: [
      'materialName',
      'number',
      'unitName',
      'stockName',
      'locationName',
      'costPrice',
      'taxCostPrice',
    ],
    amountField: 'amountTotal',
  },
}

export const ITEM_FIELD_LABELS = {
  materialName: '存货名称',
  number: '数量',
  refundNumber: '退货数量',
  unitName: '单位',
  stockName: '仓库',
  locationName: '货位',
  costPrice: '采购单价',
  taxRate: '税率(%)',
  taxCostPrice: '含税单价',
  remark: '备注',
}
