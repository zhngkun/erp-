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
      { path: 'mps', name: 'PlanMps', component: Placeholder, meta: { title: '主制作计划', icon: 'DataBoard' } },
      { path: 'mrp-scheme', name: 'PlanMrpScheme', component: Placeholder, meta: { title: 'MRP方案', icon: 'EditPen' } },
      { path: 'mrp', name: 'PlanMrp', component: Placeholder, meta: { title: 'MRP计划', icon: 'Aim' } },
      { path: 'schedule', name: 'PlanSchedule', component: Placeholder, meta: { title: '计划排程', icon: 'Flag' } },
      { path: 'project-schedule', name: 'PlanProjectSchedule', component: Placeholder, meta: { title: '项目排产', icon: 'Clock' } },
    ],
  },
  {
    path: '/production',
    name: 'Production',
    component: Layout,
    redirect: '/production/independent-demand',
    meta: { title: '生产管理', icon: 'OfficeBuilding' },
    children: [
      { path: 'independent-demand', name: 'ProductionIndependentDemand', component: Placeholder, meta: { title: '独立需求', icon: 'Histogram' } },
      { path: 'equipment', name: 'ProductionEquipment', component: Placeholder, meta: { title: '设备管理', icon: 'FirstAidKit' } },
      { path: 'in-house', name: 'ProductionInHouse', component: Placeholder, meta: { title: '自制制作', icon: 'Box' } },
      { path: 'outsource', name: 'ProductionOutsource', component: Placeholder, meta: { title: '委外生产', icon: 'Box' } },
      { path: 'scrap-reason', name: 'ProductionScrapReason', component: Placeholder, meta: { title: '工废原因', icon: 'Message' } },
      { path: 'fg-qc', name: 'ProductionFgQc', component: Placeholder, meta: { title: '成品质检', icon: 'ZoomIn' } },
      { path: 'consign-in', name: 'ProductionConsignIn', component: Placeholder, meta: { title: '受托入库', icon: 'Place' } },
      { path: 'consign-return', name: 'ProductionConsignReturn', component: Placeholder, meta: { title: '受托退货', icon: 'ShoppingBag' } },
      { path: 'disassemble-in', name: 'ProductionDisassembleIn', component: Placeholder, meta: { title: '拆入库', icon: 'WarningFilled' } },
    ],
  },
  {
    path: '/quality',
    name: 'Quality',
    component: Layout,
    redirect: '/quality/template',
    meta: { title: '质量管理', icon: 'CircleCheck' },
    children: [
      { path: 'template', name: 'QualityTemplate', component: Placeholder, meta: { title: '质检模板', icon: 'Calendar' } },
      { path: 'packing', name: 'QualityPacking', component: Placeholder, meta: { title: '质检装箱', icon: 'Box' } },
      { path: 'incoming', name: 'QualityIncoming', component: Placeholder, meta: { title: '来料质检', icon: 'Connection' } },
      { path: 'incoming-report', name: 'QualityIncomingReport', component: Placeholder, meta: { title: '来料质检报告', icon: 'ZoomIn' } },
      { path: 'outgoing', name: 'QualityOutgoing', component: Placeholder, meta: { title: '出货质检', icon: 'Briefcase' } },
      { path: 'outgoing-report', name: 'QualityOutgoingReport', component: Placeholder, meta: { title: '出货质检报告', icon: 'Timer' } },
      { path: 'patrol-report', name: 'QualityPatrolReport', component: Placeholder, meta: { title: '巡检报告', icon: 'Paperclip' } },
      { path: 'first-report', name: 'QualityFirstReport', component: Placeholder, meta: { title: '第一次质检报告', icon: 'Document' } },
      { path: 'review', name: 'QualityReview', component: Placeholder, meta: { title: '质量回顾', icon: 'ZoomIn' } },
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
      { path: 'design-task', name: 'ProjectDesignTask', component: Placeholder, meta: { title: '设计任务', icon: 'Operation' } },
      { path: 'drawing', name: 'ProjectDrawing', component: Placeholder, meta: { title: '图纸管理', icon: 'Notebook' } },
      { path: 'programming', name: 'ProjectProgramming', component: Placeholder, meta: { title: '编程设计', icon: 'EditPen' } },
      { path: 'issue', name: 'ProjectIssue', component: Placeholder, meta: { title: '问题管理', icon: 'Location' } },
      { path: 'process-route', name: 'ProjectProcessRoute', component: Placeholder, meta: { title: '工艺路线', icon: 'DataLine' } },
      { path: 'std-bom', name: 'ProjectStdBom', component: Placeholder, meta: { title: '标准物料清单', icon: 'Document' } },
      { path: 'order-bom', name: 'ProjectOrderBom', component: Placeholder, meta: { title: '订单物料清单', icon: 'Notebook' } },
    ],
  },
  {
    path: '/cash',
    name: 'Cash',
    component: Layout,
    redirect: '/cash/payment-method',
    meta: { title: '往来现金', icon: 'Money' },
    children: [
      { path: 'payment-method', name: 'CashPaymentMethod', component: Placeholder, meta: { title: '支付方式', icon: 'Promotion' } },
      { path: 'expense', name: 'CashExpense', component: Placeholder, meta: { title: '支出单', icon: 'Ticket' } },
      { path: 'payable', name: 'CashPayable', component: Placeholder, meta: { title: '应付事项', icon: 'Briefcase' } },
      { path: 'payment', name: 'CashPayment', component: Placeholder, meta: { title: '付款单', icon: 'Suitcase' } },
      { path: 'income', name: 'CashIncome', component: Placeholder, meta: { title: '收入单', icon: 'Paperclip' } },
      { path: 'receivable', name: 'CashReceivable', component: Placeholder, meta: { title: '应收事项', icon: 'EditPen' } },
      { path: 'receipt', name: 'CashReceipt', component: Placeholder, meta: { title: '收款单', icon: 'Wallet' } },
      { path: 'transfer', name: 'CashTransfer', component: Placeholder, meta: { title: '转账单', icon: 'Refresh' } },
      { path: 'fee', name: 'CashFee', component: Placeholder, meta: { title: '费用单', icon: 'Wallet' } },
      { path: 'reimburse', name: 'CashReimburse', component: Placeholder, meta: { title: '报销单', icon: 'Bell' } },
      { path: 'output-invoice', name: 'CashOutputInvoice', component: Placeholder, meta: { title: '销项发票', icon: 'Share' } },
      { path: 'input-invoice', name: 'CashInputInvoice', component: Placeholder, meta: { title: '进项发票', icon: 'Film' } },
      { path: 'customer-reconcile', name: 'CashCustomerReconcile', component: Placeholder, meta: { title: '客户对账', icon: 'CreditCard' } },
      { path: 'supplier-reconcile', name: 'CashSupplierReconcile', component: Placeholder, meta: { title: '供应商对账', icon: 'Menu' } },
    ],
  },
  {
    path: '/sales',
    name: 'Sales',
    component: Layout,
    redirect: '/sales/order',
    meta: { title: '销售管理', icon: 'ShoppingCart' },
    children: [
      { path: 'quote', name: 'SalesQuote', component: Placeholder, meta: { title: '销售报价', icon: 'ChatDotRound' } },
      { path: 'order', name: 'SalesOrder', component: Placeholder, meta: { title: '销售订单', icon: 'ShoppingBag' } },
      { path: 'outbound', name: 'SalesOutbound', component: Placeholder, meta: { title: '销售出库', icon: 'Upload' } },
      { path: 'shipment', name: 'SalesShipment', component: Placeholder, meta: { title: '发货订单', icon: 'Van' } },
      { path: 'after-sale', name: 'SalesAfterSale', component: Placeholder, meta: { title: '售后维修', icon: 'Setting' } },
      { path: 'return-exchange', name: 'SalesReturnExchange', component: Placeholder, meta: { title: '销售退换', icon: 'Tickets' } },
      { path: 'return-in', name: 'SalesReturnIn', component: Placeholder, meta: { title: '退货入库', icon: 'Download' } },
      { path: 'exchange-out', name: 'SalesExchangeOut', component: Placeholder, meta: { title: '换货出库', icon: 'Upload' } },
    ],
  },
  {
    path: '/purchase',
    name: 'Purchase',
    component: Layout,
    redirect: '/purchase/order',
    meta: { title: '采购管理', icon: 'Briefcase' },
    children: [
      { path: 'plan', name: 'PurchasePlan', component: Placeholder, meta: { title: '采购计划', icon: 'VideoCamera' } },
      { path: 'requisition', name: 'PurchaseRequisition', component: Placeholder, meta: { title: '请购单', icon: 'EditPen' } },
      { path: 'order', name: 'PurchaseOrder', component: Placeholder, meta: { title: '采购订单', icon: 'Calendar' } },
      { path: 'inbound', name: 'PurchaseInbound', component: Placeholder, meta: { title: '采购入库', icon: 'ShoppingBag' } },
      { path: 'return-exchange', name: 'PurchaseReturnExchange', component: Placeholder, meta: { title: '采购退换', icon: 'DocumentDelete' } },
      { path: 'return-out', name: 'PurchaseReturnOut', component: Placeholder, meta: { title: '退货出库', icon: 'Upload' } },
      { path: 'exchange-in', name: 'PurchaseExchangeIn', component: Placeholder, meta: { title: '换货入库', icon: 'Download' } },
      { path: 'follow-up', name: 'PurchaseFollowUp', component: Placeholder, meta: { title: '采购跟进催表', icon: 'Notebook' } },
    ],
  },
  {
    path: '/stock',
    name: 'Stock',
    component: Layout,
    redirect: '/stock/list',
    meta: { title: '库存管理', icon: 'Coin' },
    children: [
      { path: 'list', name: 'StockList', component: Placeholder, meta: { title: '库存清单', icon: 'DataLine' } },
      { path: 'flow', name: 'StockFlow', component: Placeholder, meta: { title: '库存流水', icon: 'Clock' } },
      { path: 'lock', name: 'StockLock', component: Placeholder, meta: { title: '库存锁定', icon: 'Lock' } },
      { path: 'other-in', name: 'StockOtherIn', component: Placeholder, meta: { title: '其他入库', icon: 'Download' } },
      { path: 'other-out', name: 'StockOtherOut', component: Placeholder, meta: { title: '其他出库', icon: 'Upload' } },
      { path: 'evaluate', name: 'StockEvaluate', component: Placeholder, meta: { title: '评价', icon: 'OfficeBuilding' } },
      { path: 'transfer', name: 'StockTransfer', component: Placeholder, meta: { title: '库存调拨', icon: 'Refresh' } },
      { path: 'transfer-out', name: 'StockTransferOut', component: Placeholder, meta: { title: '调拨出库', icon: 'Top' } },
      { path: 'transfer-in', name: 'StockTransferIn', component: Placeholder, meta: { title: '调拨入库', icon: 'Bottom' } },
      { path: 'check', name: 'StockCheck', component: Placeholder, meta: { title: '库存盘点', icon: 'PieChart' } },
      { path: 'lend-out', name: 'StockLendOut', component: Placeholder, meta: { title: '借出出库', icon: 'Present' } },
      { path: 'return-in', name: 'StockReturnIn', component: Placeholder, meta: { title: '归还入库', icon: 'RefreshLeft' } },
      { path: 'cost-adjust', name: 'StockCostAdjust', component: Placeholder, meta: { title: '成本调价', icon: 'Sort' } },
      { path: 'batch-fill', name: 'StockBatchFill', component: Placeholder, meta: { title: '批量补录', icon: 'FolderAdd' } },
      { path: 'pick-out', name: 'StockPickOut', component: Placeholder, meta: { title: '领料出库', icon: 'Top' } },
      { path: 'material-return', name: 'StockMaterialReturn', component: Placeholder, meta: { title: '退料入库', icon: 'Bottom' } },
      { path: 'consumable-out', name: 'StockConsumableOut', component: Placeholder, meta: { title: '耗材出库', icon: 'ShoppingBag' } },
      { path: 'move', name: 'StockMove', component: Placeholder, meta: { title: '库存搬运', icon: 'Document' } },
      { path: 'location-transfer', name: 'StockLocationTransfer', component: Placeholder, meta: { title: '货位调拨', icon: 'PriceTag' } },
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
      { path: 'finance-item', name: 'BasicFinanceItem', component: Placeholder, meta: { title: '收支项目', icon: 'Wallet' } },
      { path: 'dict', name: 'BasicDict', component: Placeholder, meta: { title: '字典管理', icon: 'Menu' } },
      // 供应商
      { path: 'supplier/category', name: 'SupplierCategory', component: () => import('@/views/basic/supplier/SupplierCategoryView.vue'), meta: { title: '供应商分类', icon: 'Operation' } },
      { path: 'supplier/list', name: 'SupplierList', component: Placeholder, meta: { title: '供应商管理', icon: 'Briefcase' } },
      { path: 'supplier/price', name: 'SupplierPrice', component: Placeholder, meta: { title: '供应商价格本', icon: 'Notebook' } },
      { path: 'supplier/portal', name: 'SupplierPortal', component: Placeholder, meta: { title: '供应商门户', icon: 'Star' } },
      // 客户
      { path: 'customer/category', name: 'CustomerCategory', component: Placeholder, meta: { title: '客户分类', icon: 'Operation' } },
      { path: 'customer/list', name: 'CustomerList', component: Placeholder, meta: { title: '客户管理', icon: 'User' } },
      { path: 'customer/price', name: 'CustomerPrice', component: Placeholder, meta: { title: '客户价格本', icon: 'Notebook' } },
      { path: 'customer/portal', name: 'CustomerPortal', component: Placeholder, meta: { title: '客户门户', icon: 'Star' } },
      // 存货
      { path: 'inventory/category', name: 'InventoryCategory', component: Placeholder, meta: { title: '存货分类', icon: 'Operation' } },
      { path: 'inventory/list', name: 'InventoryList', component: Placeholder, meta: { title: '存货管理', icon: 'Goods' } },
      { path: 'inventory/unit', name: 'InventoryUnit', component: Placeholder, meta: { title: '计量单位', icon: 'ScaleToOriginal' } },
      { path: 'inventory/brand', name: 'InventoryBrand', component: Placeholder, meta: { title: '品牌管理', icon: 'Medal' } },
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
