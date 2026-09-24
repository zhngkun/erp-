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
      // —— 计划 / 生产 / 质量 / 人力 / OA / 会计 / 报表 ——
      { path: 'plan', name: 'Plan', component: Placeholder, meta: { title: '计划管理', icon: 'DocumentChecked' } },
      { path: 'production', name: 'Production', component: Placeholder, meta: { title: '生产管理', icon: 'OfficeBuilding' } },
      { path: 'quality', name: 'Quality', component: Placeholder, meta: { title: '质量管理', icon: 'CircleCheck' } },
      { path: 'hr', name: 'Hr', component: Placeholder, meta: { title: '人力管理', icon: 'Avatar' } },
      { path: 'oa', name: 'Oa', component: Placeholder, meta: { title: '办公OA', icon: 'Suitcase' } },
      { path: 'accounting', name: 'Accounting', component: Placeholder, meta: { title: '会计财务', icon: 'Tickets' } },
      { path: 'report', name: 'Report', component: Placeholder, meta: { title: '报表管理', icon: 'DataAnalysis' } },
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
      { path: 'warehouse', name: 'BasicWarehouse', component: Placeholder, meta: { title: '仓库管理', icon: 'Box' } },
      { path: 'location', name: 'BasicLocation', component: Placeholder, meta: { title: '货位管理', icon: 'Grid' } },
      { path: 'address', name: 'BasicAddress', component: Placeholder, meta: { title: '行政地址', icon: 'Van' } },
      { path: 'finance-item', name: 'BasicFinanceItem', component: Placeholder, meta: { title: '收支项目', icon: 'Wallet' } },
      { path: 'dict', name: 'BasicDict', component: Placeholder, meta: { title: '字典管理', icon: 'Menu' } },
      // 供应商
      { path: 'supplier/category', name: 'SupplierCategory', component: Placeholder, meta: { title: '供应商分类', icon: 'Operation' } },
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
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/UserView.vue'),
        meta: { title: '用户管理', icon: 'User' },
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/RoleView.vue'),
        meta: { title: '角色管理', icon: 'UserFilled' },
      },
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
