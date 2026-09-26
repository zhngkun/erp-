import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const Layout = () => import('@/layouts/MainLayout.vue')
const Placeholder = () => import('@/views/common/PlaceholderView.vue')

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { title: '登录', hidden: true, hiddenTag: true },
  },
  {
    path: '/',
    name: 'Root',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: '首页', icon: 'HomeFilled', affix: true },
      },
    ],
  },
  {
    path: '/plan',
    name: 'Plan',
    component: Layout,
    redirect: '/plan/mps',
    meta: { title: '计划管理', icon: 'DocumentChecked' },
    children: [
      { path: 'mps', name: 'PlanMps', component: () => import('@/views/plan/MpsView.vue'), meta: { title: '主制作计划', icon: 'DataBoard' } },
      { path: 'mrp-scheme', name: 'PlanMrpScheme', component: () => import('@/views/plan/MrpSchemeView.vue'), meta: { title: 'MRP方案', icon: 'EditPen' } },
      { path: 'mrp', name: 'PlanMrp', component: () => import('@/views/plan/MrpView.vue'), meta: { title: 'MRP计划', icon: 'Aim' } },
      { path: 'schedule', name: 'PlanSchedule', component: () => import('@/views/plan/ScheduleView.vue'), meta: { title: '计划排程', icon: 'Flag' } },
      { path: 'project-schedule', name: 'PlanProjectSchedule', component: () => import('@/views/plan/ProjectScheduleView.vue'), meta: { title: '项目排产', icon: 'Clock' } },
    ],
  },
  {
    path: '/production',
    name: 'Production',
    component: Layout,
    redirect: '/production/independent-demand',
    meta: { title: '生产管理', icon: 'OfficeBuilding' },
    children: [
      { path: 'independent-demand', name: 'ProductionIndependentDemand', component: () => import('@/views/production/IndependentDemandView.vue'), meta: { title: '独立需求', icon: 'Histogram' } },
      { path: 'equipment', name: 'ProductionEquipment', component: () => import('@/views/production/EquipmentView.vue'), meta: { title: '设备管理', icon: 'FirstAidKit' } },
      { path: 'in-house', name: 'ProductionInHouse', component: () => import('@/views/production/InHouseView.vue'), meta: { title: '自制制作', icon: 'Box' } },
      { path: 'outsource', name: 'ProductionOutsource', component: () => import('@/views/production/OutsourceView.vue'), meta: { title: '委外生产', icon: 'Box' } },
      { path: 'scrap-reason', name: 'ProductionScrapReason', component: () => import('@/views/production/ScrapReasonView.vue'), meta: { title: '工废原因', icon: 'Message' } },
      { path: 'fg-qc', name: 'ProductionFgQc', component: () => import('@/views/production/FgQcView.vue'), meta: { title: '成品质检', icon: 'ZoomIn' } },
      { path: 'consign-in', name: 'ProductionConsignIn', component: () => import('@/views/production/ConsignInView.vue'), meta: { title: '受托入库', icon: 'Place' } },
      { path: 'consign-return', name: 'ProductionConsignReturn', component: () => import('@/views/production/ConsignReturnView.vue'), meta: { title: '受托退货', icon: 'ShoppingBag' } },
      { path: 'disassemble-in', name: 'ProductionDisassembleIn', component: () => import('@/views/production/DisassembleInView.vue'), meta: { title: '废料入库', icon: 'WarningFilled' } },
    ],
  },
  {
    path: '/quality',
    name: 'Quality',
    component: Layout,
    redirect: '/quality/template',
    meta: { title: '质量管理', icon: 'CircleCheck' },
    children: [
      { path: 'template', name: 'QualityTemplate', component: () => import('@/views/quality/TemplateView.vue'), meta: { title: '质检模板', icon: 'Calendar' } },
      { path: 'packing', name: 'QualityPacking', component: () => import('@/views/quality/PackingView.vue'), meta: { title: '质检装箱', icon: 'Box' } },
      { path: 'incoming', name: 'QualityIncoming', component: () => import('@/views/quality/IncomingView.vue'), meta: { title: '来料质检', icon: 'Connection' } },
      { path: 'incoming-report', name: 'QualityIncomingReport', component: () => import('@/views/quality/IncomingReportView.vue'), meta: { title: '来料质检报告', icon: 'ZoomIn' } },
      { path: 'outgoing', name: 'QualityOutgoing', component: () => import('@/views/quality/OutgoingView.vue'), meta: { title: '出货质检', icon: 'Briefcase' } },
      { path: 'outgoing-report', name: 'QualityOutgoingReport', component: () => import('@/views/quality/OutgoingReportView.vue'), meta: { title: '出货质检报告', icon: 'Timer' } },
      { path: 'patrol-report', name: 'QualityPatrolReport', component: () => import('@/views/quality/PatrolReportView.vue'), meta: { title: '巡检报告', icon: 'Paperclip' } },
      { path: 'first-report', name: 'QualityFirstReport', component: () => import('@/views/quality/FirstReportView.vue'), meta: { title: '首次质检报告', icon: 'Document' } },
      { path: 'review', name: 'QualityReview', component: () => import('@/views/quality/ReviewView.vue'), meta: { title: '质量追溯', icon: 'ZoomIn' } },
    ],
  },
  {
    path: '/hr',
    name: 'Hr',
    component: Layout,
    redirect: '/hr/salary-item',
    meta: { title: '人力管理', icon: 'Avatar' },
    children: [
      { path: 'salary-item', name: 'HrSalaryItem', component: Placeholder, meta: { title: '薪资项目', icon: 'Files' } },
      { path: 'salary-adjust', name: 'HrSalaryAdjust', component: Placeholder, meta: { title: '薪资增减', icon: 'EditPen' } },
      { path: 'billing-report', name: 'HrBillingReport', component: Placeholder, meta: { title: '计费报表', icon: 'Document' } },
      { path: 'salary-detail', name: 'HrSalaryDetail', component: Placeholder, meta: { title: '薪酬明细', icon: 'Files' } },
      { path: 'my-salary', name: 'HrMySalary', component: Placeholder, meta: { title: '我的薪资', icon: 'Aim' } },
      { path: 'work-calendar', name: 'HrWorkCalendar', component: Placeholder, meta: { title: '工作日历', icon: 'Calendar' } },
      { path: 'punch-address', name: 'HrPunchAddress', component: Placeholder, meta: { title: '打卡地址', icon: 'Location' } },
      { path: 'attendance-rule', name: 'HrAttendanceRule', component: Placeholder, meta: { title: '考勤规则', icon: 'Coin' } },
      { path: 'punch-record', name: 'HrPunchRecord', component: Placeholder, meta: { title: '打卡记录', icon: 'AlarmClock' } },
      { path: 'leave', name: 'HrLeave', component: Placeholder, meta: { title: '请假单', icon: 'User' } },
      { path: 'shift', name: 'HrShift', component: Placeholder, meta: { title: '班次管理', icon: 'Compass' } },
      { path: 'roster', name: 'HrRoster', component: Placeholder, meta: { title: '排班管理', icon: 'EditPen' } },
      { path: 'training', name: 'HrTraining', component: Placeholder, meta: { title: '培训管理', icon: 'Reading' } },
      { path: 'daily-report', name: 'HrDailyReport', component: Placeholder, meta: { title: '日报', icon: 'Notebook' } },
      { path: 'seal-apply', name: 'HrSealApply', component: Placeholder, meta: { title: '盖章申请', icon: 'Files' } },
      { path: 'performance', name: 'HrPerformance', component: Placeholder, meta: { title: '绩效考核', icon: 'Document' } },
    ],
  },
  {
    path: '/oa',
    name: 'Oa',
    component: Layout,
    redirect: '/oa/todo-biz',
    meta: { title: '办公OA', icon: 'Suitcase' },
    children: [
      { path: 'todo-biz', name: 'OaTodoBiz', component: Placeholder, meta: { title: '待办业务', icon: 'Notebook' } },
      { path: 'task-project', name: 'OaTaskProject', component: Placeholder, meta: { title: '任务项目', icon: 'Tickets' } },
      { path: 'task', name: 'OaTask', component: Placeholder, meta: { title: '任务管理', icon: 'Folder' } },
      { path: 'todo-task', name: 'OaTodoTask', component: Placeholder, meta: { title: '待办任务', icon: 'Clock' } },
      { path: 'message', name: 'OaMessage', component: Placeholder, meta: { title: '消息管理', icon: 'ChatDotRound' } },
      { path: 'material', name: 'OaMaterial', component: Placeholder, meta: { title: '资料管理', icon: 'Document' } },
    ],
  },
  {
    path: '/accounting',
    name: 'Accounting',
    component: Layout,
    redirect: '/accounting/infra',
    meta: { title: '会计财务', icon: 'Tickets' },
    children: [
      { path: 'infra', name: 'AccountingInfra', component: Placeholder, meta: { title: '基础设施', icon: 'Operation' } },
      { path: 'resource', name: 'AccountingResource', component: Placeholder, meta: { title: '资源中心', icon: 'Folder' } },
      { path: 'ledger', name: 'AccountingLedger', component: Placeholder, meta: { title: '财务簿', icon: 'Notebook' } },
      { path: 'report', name: 'AccountingReport', component: Placeholder, meta: { title: '财务报表', icon: 'DataLine' } },
      { path: 'fund', name: 'AccountingFund', component: Placeholder, meta: { title: '资金', icon: 'Box' } },
      { path: 'asset', name: 'AccountingAsset', component: Placeholder, meta: { title: '资产', icon: 'Operation' } },
      { path: 'deposit', name: 'AccountingDeposit', component: Placeholder, meta: { title: '存款结算', icon: 'Lock' } },
    ],
  },
  {
    path: '/report',
    name: 'Report',
    component: Layout,
    redirect: '/report/stock',
    meta: { title: '报表管理', icon: 'DataAnalysis' },
    children: [
      { path: 'stock', name: 'ReportStock', component: Placeholder, meta: { title: '库存报表', icon: 'Box' } },
      { path: 'purchase', name: 'ReportPurchase', component: Placeholder, meta: { title: '采购报表', icon: 'Goods' } },
      { path: 'sales', name: 'ReportSales', component: Placeholder, meta: { title: '销售报表', icon: 'ShoppingBag' } },
      { path: 'gl', name: 'ReportGl', component: Placeholder, meta: { title: '总账报表', icon: 'Notebook' } },
      { path: 'production', name: 'ReportProduction', component: Placeholder, meta: { title: '生产报表', icon: 'Calendar' } },
      { path: 'board-sales', name: 'ReportBoardSales', component: Placeholder, meta: { title: '销售看板', icon: 'ShoppingBag' } },
      { path: 'board-purchase', name: 'ReportBoardPurchase', component: Placeholder, meta: { title: '采购看板', icon: 'Document' } },
      { path: 'board-finance', name: 'ReportBoardFinance', component: Placeholder, meta: { title: '财务看板', icon: 'CreditCard' } },
      { path: 'board-stock', name: 'ReportBoardStock', component: Placeholder, meta: { title: '库存看板', icon: 'Box' } },
      { path: 'board-production', name: 'ReportBoardProduction', component: Placeholder, meta: { title: '生产看板', icon: 'DocumentChecked' } },
      { path: 'board-survey', name: 'ReportBoardSurvey', component: Placeholder, meta: { title: '调查看板', icon: 'DataLine' } },
      { path: 'board-ops', name: 'ReportBoardOps', component: Placeholder, meta: { title: '运营看板', icon: 'Odometer' } },
    ],
  },
  {
    path: '/project',
    name: 'Project',
    component: Layout,
    redirect: '/project/design-task',
    meta: { title: '工程管理', icon: 'Folder' },
    children: [
      { path: 'design-task', name: 'ProjectDesignTask', component: () => import('@/views/project/DesignTaskView.vue'), meta: { title: '设计任务', icon: 'Operation' } },
      { path: 'drawing', name: 'ProjectDrawing', component: () => import('@/views/project/DrawingView.vue'), meta: { title: '图纸管理', icon: 'Notebook' } },
      { path: 'programming', name: 'ProjectProgramming', component: () => import('@/views/project/ProgrammingView.vue'), meta: { title: '编程设计', icon: 'EditPen' } },
      { path: 'issue', name: 'ProjectIssue', component: () => import('@/views/project/IssueView.vue'), meta: { title: '工程变更', icon: 'Location' } },
      { path: 'process-route', name: 'ProjectProcessRoute', component: () => import('@/views/project/ProcessRouteView.vue'), meta: { title: '工艺路线', icon: 'DataLine' } },
      { path: 'std-bom', name: 'ProjectStdBom', component: () => import('@/views/project/StdBomView.vue'), meta: { title: '标准物料清单', icon: 'Document' } },
      { path: 'order-bom', name: 'ProjectOrderBom', component: () => import('@/views/project/OrderBomView.vue'), meta: { title: '订单物料清单', icon: 'Notebook' } },
    ],
  },
  {
    path: '/cash',
    name: 'Cash',
    component: Layout,
    redirect: '/cash/payment-method',
    meta: { title: '往来现金', icon: 'Money' },
    children: [
      { path: 'payment-method', name: 'CashPaymentMethod', component: () => import('@/views/cash/CashPaymentMethodView.vue'), meta: { title: '支付方式', icon: 'Promotion' } },
      { path: 'expense', name: 'CashExpense', component: () => import('@/views/cash/CashExpenseView.vue'), meta: { title: '支出单', icon: 'Ticket' } },
      { path: 'payable', name: 'CashPayable', component: () => import('@/views/cash/CashPayableView.vue'), meta: { title: '应付事项', icon: 'Briefcase' } },
      { path: 'payment', name: 'CashPayment', component: () => import('@/views/cash/CashPaymentView.vue'), meta: { title: '付款单', icon: 'Suitcase' } },
      { path: 'income', name: 'CashIncome', component: () => import('@/views/cash/CashIncomeView.vue'), meta: { title: '收入单', icon: 'Paperclip' } },
      { path: 'receivable', name: 'CashReceivable', component: () => import('@/views/cash/CashReceivableView.vue'), meta: { title: '应收事项', icon: 'EditPen' } },
      { path: 'receipt', name: 'CashReceipt', component: () => import('@/views/cash/CashReceiptView.vue'), meta: { title: '收款单', icon: 'Wallet' } },
      { path: 'transfer', name: 'CashTransfer', component: () => import('@/views/cash/CashTransferView.vue'), meta: { title: '转账单', icon: 'Refresh' } },
      { path: 'fee', name: 'CashFee', component: () => import('@/views/cash/CashFeeView.vue'), meta: { title: '费用单', icon: 'Wallet' } },
      { path: 'reimburse', name: 'CashReimburse', component: () => import('@/views/cash/CashReimburseView.vue'), meta: { title: '报销单', icon: 'Bell' } },
      { path: 'output-invoice', name: 'CashOutputInvoice', component: () => import('@/views/cash/CashOutputInvoiceView.vue'), meta: { title: '销项发票', icon: 'Share' } },
      { path: 'input-invoice', name: 'CashInputInvoice', component: () => import('@/views/cash/CashInputInvoiceView.vue'), meta: { title: '进项发票', icon: 'Film' } },
      { path: 'customer-reconcile', name: 'CashCustomerReconcile', component: () => import('@/views/cash/CashCustomerReconcileView.vue'), meta: { title: '客户对账', icon: 'CreditCard' } },
      { path: 'supplier-reconcile', name: 'CashSupplierReconcile', component: () => import('@/views/cash/CashSupplierReconcileView.vue'), meta: { title: '供应商对账', icon: 'Menu' } },
    ],
  },
  {
    path: '/sales',
    name: 'Sales',
    component: Layout,
    redirect: '/sales/order',
    meta: { title: '销售管理', icon: 'ShoppingCart' },
    children: [
      { path: 'quote', name: 'SalesQuote', component: () => import('@/views/sales/SalesQuoteView.vue'), meta: { title: '销售报价', icon: 'ChatDotRound' } },
      { path: 'order', name: 'SalesOrder', component: () => import('@/views/sales/SalesOrderView.vue'), meta: { title: '销售订单', icon: 'ShoppingBag' } },
      { path: 'outbound', name: 'SalesOutbound', component: () => import('@/views/sales/SalesOutboundView.vue'), meta: { title: '销售出库', icon: 'Upload' } },
      { path: 'shipment', name: 'SalesShipment', component: () => import('@/views/sales/SalesShipmentView.vue'), meta: { title: '发货订单', icon: 'Van' } },
      { path: 'after-sale', name: 'SalesAfterSale', component: () => import('@/views/sales/SalesAfterSaleView.vue'), meta: { title: '售后维修', icon: 'Setting' } },
      { path: 'return-exchange', name: 'SalesReturnExchange', component: () => import('@/views/sales/SalesReturnExchangeView.vue'), meta: { title: '销售退换', icon: 'Tickets' } },
      { path: 'return-in', name: 'SalesReturnIn', component: () => import('@/views/sales/SalesReturnInView.vue'), meta: { title: '退货入库', icon: 'Download' } },
      { path: 'exchange-out', name: 'SalesExchangeOut', component: () => import('@/views/sales/SalesExchangeOutView.vue'), meta: { title: '换货出库', icon: 'Upload' } },
    ],
  },
  {
    path: '/purchase',
    name: 'Purchase',
    component: Layout,
    redirect: '/purchase/order',
    meta: { title: '采购管理', icon: 'Briefcase' },
    children: [
      { path: 'plan', name: 'PurchasePlan', component: () => import('@/views/purchase/PurchasePlanView.vue'), meta: { title: '采购计划', icon: 'VideoCamera' } },
      { path: 'requisition', name: 'PurchaseRequisition', component: () => import('@/views/purchase/PurchaseRequisitionView.vue'), meta: { title: '请购单', icon: 'EditPen' } },
      { path: 'order', name: 'PurchaseOrder', component: () => import('@/views/purchase/PurchaseOrderView.vue'), meta: { title: '采购订单', icon: 'Calendar' } },
      { path: 'inbound', name: 'PurchaseInbound', component: () => import('@/views/purchase/PurchaseInboundView.vue'), meta: { title: '采购入库', icon: 'ShoppingBag' } },
      { path: 'return-exchange', name: 'PurchaseReturnExchange', component: () => import('@/views/purchase/PurchaseReturnExchangeView.vue'), meta: { title: '采购退换', icon: 'DocumentDelete' } },
      { path: 'return-out', name: 'PurchaseReturnOut', component: () => import('@/views/purchase/PurchaseReturnOutView.vue'), meta: { title: '退货出库', icon: 'Upload' } },
      { path: 'exchange-in', name: 'PurchaseExchangeIn', component: () => import('@/views/purchase/PurchaseExchangeInView.vue'), meta: { title: '换货入库', icon: 'Download' } },
      { path: 'follow-up', name: 'PurchaseFollowUp', component: () => import('@/views/purchase/PurchaseFollowUpView.vue'), meta: { title: '采购跟进催表', icon: 'Notebook' } },
    ],
  },
  {
    path: '/stock',
    name: 'Stock',
    component: Layout,
    redirect: '/stock/list',
    meta: { title: '库存管理', icon: 'Coin' },
    children: [
      { path: 'list', name: 'StockList', component: () => import('@/views/stock/StockInventoryView.vue'), meta: { title: '库存清单', icon: 'DataLine' } },
      { path: 'flow', name: 'StockFlow', component: () => import('@/views/stock/StockFlowView.vue'), meta: { title: '库存流水', icon: 'Clock' } },
      { path: 'lock', name: 'StockLock', component: () => import('@/views/stock/StockLockView.vue'), meta: { title: '库存锁定', icon: 'Lock' } },
      { path: 'other-in', name: 'StockOtherIn', component: () => import('@/views/stock/StockOtherInView.vue'), meta: { title: '其他入库', icon: 'Download' } },
      { path: 'other-out', name: 'StockOtherOut', component: () => import('@/views/stock/StockOtherOutView.vue'), meta: { title: '其他出库', icon: 'Upload' } },
      { path: 'evaluate', name: 'StockLoss', component: () => import('@/views/stock/StockLossView.vue'), meta: { title: '库存损耗', icon: 'OfficeBuilding' } },
      { path: 'transfer', name: 'StockTransfer', component: () => import('@/views/stock/StockTransferView.vue'), meta: { title: '库存调拨', icon: 'Refresh' } },
      { path: 'transfer-out', name: 'StockTransferOut', component: () => import('@/views/stock/StockTransferOutView.vue'), meta: { title: '调拨出库', icon: 'Top' } },
      { path: 'transfer-in', name: 'StockTransferIn', component: () => import('@/views/stock/StockTransferInView.vue'), meta: { title: '调拨入库', icon: 'Bottom' } },
      { path: 'check', name: 'StockCheck', component: () => import('@/views/stock/StockCheckView.vue'), meta: { title: '库存盘点', icon: 'PieChart' } },
      { path: 'lend-out', name: 'StockLendOut', component: () => import('@/views/stock/StockLendOutView.vue'), meta: { title: '借出出库', icon: 'Present' } },
      { path: 'return-in', name: 'StockReturnIn', component: () => import('@/views/stock/StockReturnInView.vue'), meta: { title: '归还入库', icon: 'RefreshLeft' } },
      { path: 'cost-adjust', name: 'StockCostAdjust', component: () => import('@/views/stock/StockCostAdjustView.vue'), meta: { title: '成本调价', icon: 'Sort' } },
      { path: 'batch-fill', name: 'StockBatchFill', component: () => import('@/views/stock/StockBatchFillView.vue'), meta: { title: '批次补录', icon: 'FolderAdd' } },
      { path: 'pick-out', name: 'StockPickOut', component: () => import('@/views/stock/StockPickOutView.vue'), meta: { title: '在制品出库', icon: 'Top' } },
      { path: 'material-return', name: 'StockMaterialReturn', component: () => import('@/views/stock/StockMaterialReturnView.vue'), meta: { title: '在制品入库', icon: 'Bottom' } },
      { path: 'consumable-out', name: 'StockConsumableOut', component: () => import('@/views/stock/StockConsumableOutView.vue'), meta: { title: '耗材出库', icon: 'ShoppingBag' } },
      { path: 'move', name: 'StockMove', component: () => import('@/views/stock/StockMoveView.vue'), meta: { title: '货位调整', icon: 'Document' } },
      { path: 'location-transfer', name: 'StockLocationTransfer', component: () => import('@/views/stock/StockLocationTransferView.vue'), meta: { title: '货位调拨', icon: 'PriceTag' } },
    ],
  },
  {
    path: '/basic',
    name: 'Basic',
    component: Layout,
    redirect: '/basic/warehouse',
    meta: { title: '基础资料', icon: 'Notebook' },
    children: [
      { path: 'warehouse', name: 'BasicWarehouse', component: () => import('@/views/basic/WarehouseView.vue'), meta: { title: '仓库管理', icon: 'Box' } },
      { path: 'location', name: 'BasicLocation', component: () => import('@/views/basic/LocationView.vue'), meta: { title: '货位管理', icon: 'Grid' } },
      { path: 'address', name: 'BasicAddress', component: () => import('@/views/basic/AddressView.vue'), meta: { title: '行政地址', icon: 'Van' } },
      { path: 'finance-item', name: 'BasicFinanceItem', component: () => import('@/views/basic/FinanceItemView.vue'), meta: { title: '收支项目', icon: 'Wallet' } },
      { path: 'dict', name: 'BasicDict', component: () => import('@/views/basic/DictView.vue'), meta: { title: '字典管理', icon: 'Menu' } },
      // 供应商
      { path: 'supplier/category', name: 'SupplierCategory', component: () => import('@/views/basic/supplier/SupplierCategoryView.vue'), meta: { title: '供应商分类', icon: 'Operation' } },
      { path: 'supplier/list', name: 'SupplierList', component: () => import('@/views/basic/supplier/SupplierListView.vue'), meta: { title: '供应商管理', icon: 'Briefcase' } },
      { path: 'supplier/price', name: 'SupplierPrice', component: () => import('@/views/basic/supplier/SupplierPriceView.vue'), meta: { title: '供应商价格本', icon: 'Notebook' } },
      { path: 'supplier/portal', name: 'SupplierPortal', component: Placeholder, meta: { title: '供应商门户', icon: 'Star' } },
      // 客户（顺序对齐朋来P8）
      { path: 'customer/category', name: 'CustomerCategory', component: () => import('@/views/basic/customer/CustomerCategoryView.vue'), meta: { title: '客户分类', icon: 'Operation' } },
      { path: 'customer/public-lead', name: 'CustomerPublicLead', component: () => import('@/views/basic/customer/PublicLeadView.vue'), meta: { title: '公海线索', icon: 'Share' } },
      { path: 'customer/private-lead', name: 'CustomerPrivateLead', component: () => import('@/views/basic/customer/PrivateLeadView.vue'), meta: { title: '私海线索', icon: 'Lock' } },
      { path: 'customer/opportunity', name: 'CustomerOpportunity', component: () => import('@/views/basic/customer/OpportunityView.vue'), meta: { title: '销售机会', icon: 'TrendCharts' } },
      { path: 'customer/opportunity-eval', name: 'CustomerOpportunityEval', component: () => import('@/views/basic/customer/OpportunityEvalView.vue'), meta: { title: '机会评估', icon: 'DataAnalysis' } },
      { path: 'customer/list', name: 'CustomerList', component: () => import('@/views/basic/customer/CustomerListView.vue'), meta: { title: '客户管理', icon: 'User' } },
      { path: 'customer/price', name: 'CustomerPrice', component: () => import('@/views/basic/customer/CustomerPriceView.vue'), meta: { title: '客户价格本', icon: 'Notebook' } },
      { path: 'customer/owner', name: 'CustomerOwner', component: () => import('@/views/basic/customer/CustomerOwnerView.vue'), meta: { title: '客户负责人', icon: 'Avatar' } },
      { path: 'customer/portal', name: 'CustomerPortal', component: () => import('@/views/basic/customer/CustomerPortalView.vue'), meta: { title: '客户门户', icon: 'Star' } },
      { path: 'customer/order', name: 'CustomerOrder', component: () => import('@/views/basic/customer/CustomerOrderView.vue'), meta: { title: '客户订单', icon: 'ShoppingCart' } },
      { path: 'customer/withdraw', name: 'CustomerWithdraw', component: () => import('@/views/basic/customer/CustomerWithdrawView.vue'), meta: { title: '客户提现', icon: 'Wallet' } },
      { path: 'customer/commission', name: 'CustomerCommission', component: () => import('@/views/basic/customer/CustomerCommissionView.vue'), meta: { title: '客户佣金', icon: 'Money' } },
      { path: 'customer/feedback', name: 'CustomerFeedback', component: () => import('@/views/basic/customer/CustomerFeedbackView.vue'), meta: { title: '客户反馈', icon: 'ChatDotRound' } },
      // 存货（顺序对齐朋来P8：品牌→分类→属性→单位→批次条码→存货管理）
      { path: 'inventory/brand', name: 'InventoryBrand', component: () => import('@/views/basic/inventory/BrandView.vue'), meta: { title: '品牌管理', icon: 'Medal' } },
      { path: 'inventory/category', name: 'InventoryCategory', component: () => import('@/views/basic/inventory/CategoryView.vue'), meta: { title: '分类管理', icon: 'Operation' } },
      { path: 'inventory/attr', name: 'InventoryAttr', component: () => import('@/views/basic/inventory/AttrView.vue'), meta: { title: '属性管理', icon: 'SetUp' } },
      { path: 'inventory/unit', name: 'InventoryUnit', component: () => import('@/views/basic/inventory/UnitView.vue'), meta: { title: '计量单位', icon: 'ScaleToOriginal' } },
      { path: 'inventory/batch-code', name: 'InventoryBatchCode', component: () => import('@/views/basic/inventory/BatchCodeView.vue'), meta: { title: '批次条码', icon: 'Postcard' } },
      { path: 'inventory/list', name: 'InventoryList', component: () => import('@/views/basic/inventory/InventoryListView.vue'), meta: { title: '存货管理', icon: 'Goods' } },
    ],
  },
  {
    path: '/system',
    name: 'System',
    component: Layout,
    redirect: '/system/employee',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      { path: 'mcp', name: 'SystemMcp', component: Placeholder, meta: { title: 'MCP管理', icon: 'Key' } },
      { path: 'org-type', name: 'SystemOrgType', component: Placeholder, meta: { title: '组织类型', icon: 'OfficeBuilding' } },
      { path: 'org', name: 'SystemOrg', component: Placeholder, meta: { title: '组织管理', icon: 'School' } },
      { path: 'log', name: 'SystemLog', component: Placeholder, meta: { title: '系统日志', icon: 'Warning' } },
      { path: 'dept', name: 'SystemDept', component: Placeholder, meta: { title: '部门管理', icon: 'School' } },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/RoleView.vue'),
        meta: { title: '角色管理', icon: 'User' },
      },
      {
        path: 'employee',
        name: 'SystemEmployee',
        component: () => import('@/views/system/UserView.vue'),
        meta: { title: '员工管理', icon: 'User' },
      },
      { path: 'config', name: 'SystemConfig', component: Placeholder, meta: { title: '系统配置', icon: 'Setting' } },
      { path: 'profile', name: 'SystemProfile', component: Placeholder, meta: { title: '个人信息', icon: 'InfoFilled' } },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFound.vue'),
    meta: { title: '404', hidden: true, hiddenTag: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  document.title = `${to.meta?.title || 'ERP'} · ERP 管理系统`

  if (to.path === '/login') {
    if (userStore.isLoggedIn) {
      next('/dashboard')
    } else {
      next()
    }
    return
  }

  if (!userStore.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  next()
})

export default router
