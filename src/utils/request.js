import axios from 'axios'
import { ElMessage } from 'element-plus'
import { USE_MOCK } from '@/mock/config'
import {
  mockCreateUser,
  mockDeleteUser,
  mockGetUserList,
  mockLogin,
  mockUpdateUser,
} from '@/mock/user'
import {
  mockBatchDeleteWarehouse,
  mockBatchUpdateWarehouse,
  mockCreateWarehouse,
  mockDeleteWarehouse,
  mockGetWarehouseList,
  mockUpdateWarehouse,
} from '@/mock/warehouse'
import {
  mockBatchDeleteAddress,
  mockCreateAddress,
  mockDeleteAddress,
  mockGetAddressList,
  mockUpdateAddress,
} from '@/mock/address'
import {
  mockBatchDeleteLocation,
  mockBatchUpdateLocation,
  mockCreateLocation,
  mockDeleteLocation,
  mockGetLocationList,
  mockUpdateLocation,
} from '@/mock/location'
import {
  mockBatchDeleteSupplierCategory,
  mockBatchUpdateSupplierCategory,
  mockCreateSupplierCategory,
  mockDeleteSupplierCategory,
  mockGetSupplierCategoryList,
  mockUpdateSupplierCategory,
} from '@/mock/supplierCategory'
import {
  mockBatchDeleteSupplier,
  mockBatchUpdateSupplier,
  mockCreateSupplier,
  mockDeleteSupplier,
  mockGetSupplierList,
  mockUpdateSupplier,
} from '@/mock/supplier'
import {
  mockBatchDeleteSupplierPrice,
  mockCreateSupplierPrice,
  mockDeleteSupplierPrice,
  mockGetSupplierPriceList,
  mockUpdateSupplierPrice,
} from '@/mock/supplierPrice'
import {
  mockBatchDeleteCustomerCategory,
  mockBatchUpdateCustomerCategory,
  mockCreateCustomerCategory,
  mockDeleteCustomerCategory,
  mockGetCustomerCategoryList,
  mockUpdateCustomerCategory,
} from '@/mock/customerCategory'
import {
  mockBatchAssignPublicLead,
  mockBatchClaimPublicLead,
  mockBatchDeletePublicLead,
  mockCreatePublicLead,
  mockDeletePublicLead,
  mockGetPublicLeadList,
  mockUpdatePublicLead,
} from '@/mock/customerPublicLead'
import {
  mockBatchDealPrivateLead,
  mockBatchDeletePrivateLead,
  mockBatchReleasePrivateLead,
  mockCreatePrivateLead,
  mockDeletePrivateLead,
  mockGetPrivateLeadList,
  mockUpdatePrivateLead,
} from '@/mock/customerPrivateLead'
import {
  mockBatchDeleteOpportunity,
  mockCreateOpportunity,
  mockDeleteOpportunity,
  mockGetOpportunityList,
  mockPushOpportunity,
  mockUpdateOpportunity,
} from '@/mock/customerOpportunity'
import {
  mockBatchDeleteOpportunityEval,
  mockDeleteOpportunityEval,
  mockGetOpportunityEvalList,
  mockUpdateOpportunityEval,
} from '@/mock/customerOpportunityEval'
import {
  mockBatchDeleteCustomer,
  mockBatchUpdateCustomer,
  mockCreateCustomer,
  mockDeleteCustomer,
  mockGetCustomerList,
  mockUpdateCustomer,
} from '@/mock/customer'
import {
  mockBatchDeleteCustomerPrice,
  mockBatchUpdateCustomerPrice,
  mockCreateCustomerPrice,
  mockDeleteCustomerPrice,
  mockGetCustomerPriceList,
  mockUpdateCustomerPrice,
} from '@/mock/customerPrice'
import {
  mockBatchDeleteCustomerOwner,
  mockBatchUpdateCustomerOwner,
  mockDeleteCustomerOwner,
  mockGetCustomerOwnerList,
  mockUpdateCustomerOwner,
} from '@/mock/customerOwner'
import {
  mockBatchDeleteCustomerOrder,
  mockBatchUpdateCustomerOrder,
  mockDeleteCustomerOrder,
  mockGetCustomerOrderList,
  mockUpdateCustomerOrder,
} from '@/mock/customerOrder'
import {
  mockBatchUpdateCustomerWithdraw,
  mockGetCustomerWithdrawList,
  mockUpdateCustomerWithdraw,
} from '@/mock/customerWithdraw'
import {
  mockGetCustomerCommissionCustomerDetails,
  mockGetCustomerCommissionSaleDetails,
  mockGetCustomerCommissionSummary,
  mockGetCustomerCommissionWithdrawDetails,
} from '@/mock/customerCommission'
import {
  mockGetCustomerFeedbackList,
  mockUpdateCustomerFeedback,
} from '@/mock/customerFeedback'
import {
  mockGetStockFlowList,
  mockGetStockInventoryList,
  mockGetStockLockList,
  mockUnlockStock,
} from '@/mock/stock/inventory'
import { getBillStore } from '@/mock/stock/bills'
import { getPurchaseBillStore } from '@/mock/purchase/bills'
import { mockGetPurchaseFollowUpList } from '@/mock/purchase/followUp'
import { getSalesBillStore } from '@/mock/sales/bills'
import { getCashBillStore } from '@/mock/cash/bills'
import { getProjectStore } from '@/mock/project/records'
import { getPlanStore } from '@/mock/plan/records'
import { getProductionStore } from '@/mock/production/records'
import { getQualityStore } from '@/mock/quality/records'
import { getHrStore } from '@/mock/hr/records'
import { getOaStore } from '@/mock/oa/records'
import {
  mockBatchDeleteCashPaymentMethod,
  mockBatchUpdateCashPaymentMethod,
  mockCreateCashPaymentMethod,
  mockDeleteCashPaymentMethod,
  mockGetCashPaymentMethodList,
  mockUpdateCashPaymentMethod,
} from '@/mock/cash/paymentMethod'
import {
  mockBatchDeleteInventoryBrand,
  mockBatchUpdateInventoryBrand,
  mockCreateInventoryBrand,
  mockDeleteInventoryBrand,
  mockGetInventoryBrandList,
  mockUpdateInventoryBrand,
} from '@/mock/inventoryBrand'
import {
  mockBatchDeleteInventoryCategory,
  mockBatchUpdateInventoryCategory,
  mockCreateInventoryCategory,
  mockDeleteInventoryCategory,
  mockGetInventoryCategoryList,
  mockUpdateInventoryCategory,
} from '@/mock/inventoryCategory'
import {
  mockBatchDeleteInventoryAttr,
  mockBatchUpdateInventoryAttr,
  mockCreateInventoryAttr,
  mockDeleteInventoryAttr,
  mockGetInventoryAttrList,
  mockUpdateInventoryAttr,
} from '@/mock/inventoryAttr'
import {
  mockBatchDeleteInventoryUnit,
  mockBatchUpdateInventoryUnit,
  mockCreateInventoryUnit,
  mockCreateInventoryUnitGroup,
  mockDeleteInventoryUnit,
  mockDeleteInventoryUnitGroup,
  mockGetInventoryUnitGroupList,
  mockGetInventoryUnitList,
  mockUpdateInventoryUnit,
  mockUpdateInventoryUnitGroup,
} from '@/mock/inventoryUnit'
import {
  mockGetInventoryBatchCodeSettings,
  mockPreviewInventoryBatchCodes,
  mockSaveInventoryBatchCodeSettings,
} from '@/mock/inventoryBatchCode'
import {
  mockBatchDeleteInventory,
  mockBatchUpdateInventory,
  mockCreateInventory,
  mockDeleteInventory,
  mockGetInventoryList,
  mockUpdateInventory,
} from '@/mock/inventory'
import {
  mockBatchDeleteFinanceItem,
  mockBatchUpdateFinanceItem,
  mockCreateFinanceItem,
  mockDeleteFinanceItem,
  mockGetFinanceItemList,
  mockUpdateFinanceItem,
} from '@/mock/financeItem'
import {
  mockBatchDeleteDictValue,
  mockBatchUpdateDictValue,
  mockCreateDictValue,
  mockDeleteDictValue,
  mockGetDictTypeList,
  mockGetDictValueList,
  mockUpdateDictValue,
} from '@/mock/dict'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 15000,
})

service.interceptors.request.use((config) => {
  const token = localStorage.getItem('erp_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res?.code !== 0) {
      ElMessage.error(res?.message || '请求失败')
      return Promise.reject(new Error(res?.message || '请求失败'))
    }
    return res.data
  },
  (error) => {
    ElMessage.error(error.message || '网络异常')
    return Promise.reject(error)
  },
)

/** 统一走 mock / 真实接口；后续关 USE_MOCK 即可切后端 */
async function request(config) {
  if (!USE_MOCK) {
    return service(config)
  }

  const { method = 'get', url, params, data } = config
  const m = String(method).toLowerCase()

  let result
  if (url === '/auth/login' && m === 'post') {
    result = await mockLogin(data)
  } else if (url === '/system/users' && m === 'get') {
    result = await mockGetUserList(params)
  } else if (url === '/system/users' && m === 'post') {
    result = await mockCreateUser(data)
  } else if (url?.startsWith('/system/users/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateUser(id, data)
  } else if (url?.startsWith('/system/users/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteUser(id)
  } else if (url === '/basic/warehouses' && m === 'get') {
    result = await mockGetWarehouseList(params)
  } else if (url === '/basic/warehouses' && m === 'post') {
    result = await mockCreateWarehouse(data)
  } else if (url === '/basic/warehouses/batch-delete' && m === 'post') {
    result = await mockBatchDeleteWarehouse(data?.ids)
  } else if (url === '/basic/warehouses/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateWarehouse(ids, rest)
  } else if (url?.startsWith('/basic/warehouses/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateWarehouse(id, data)
  } else if (url?.startsWith('/basic/warehouses/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteWarehouse(id)
  } else if (url === '/basic/addresses' && m === 'get') {
    result = await mockGetAddressList(params)
  } else if (url === '/basic/addresses' && m === 'post') {
    result = await mockCreateAddress(data)
  } else if (url === '/basic/addresses/batch-delete' && m === 'post') {
    result = await mockBatchDeleteAddress(data?.ids)
  } else if (url?.startsWith('/basic/addresses/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateAddress(id, data)
  } else if (url?.startsWith('/basic/addresses/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteAddress(id)
  } else if (url === '/basic/locations' && m === 'get') {
    result = await mockGetLocationList(params)
  } else if (url === '/basic/locations' && m === 'post') {
    result = await mockCreateLocation(data)
  } else if (url === '/basic/locations/batch-delete' && m === 'post') {
    result = await mockBatchDeleteLocation(data?.ids)
  } else if (url === '/basic/locations/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateLocation(ids, rest)
  } else if (url?.startsWith('/basic/locations/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateLocation(id, data)
  } else if (url?.startsWith('/basic/locations/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteLocation(id)
  } else if (url === '/basic/supplier-categories' && m === 'get') {
    result = await mockGetSupplierCategoryList(params)
  } else if (url === '/basic/supplier-categories' && m === 'post') {
    result = await mockCreateSupplierCategory(data)
  } else if (url === '/basic/supplier-categories/batch-delete' && m === 'post') {
    result = await mockBatchDeleteSupplierCategory(data?.ids)
  } else if (url === '/basic/supplier-categories/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateSupplierCategory(ids, rest)
  } else if (url?.startsWith('/basic/supplier-categories/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateSupplierCategory(id, data)
  } else if (url?.startsWith('/basic/supplier-categories/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteSupplierCategory(id)
  } else if (url === '/basic/suppliers' && m === 'get') {
    result = await mockGetSupplierList(params)
  } else if (url === '/basic/suppliers' && m === 'post') {
    result = await mockCreateSupplier(data)
  } else if (url === '/basic/suppliers/batch-delete' && m === 'post') {
    result = await mockBatchDeleteSupplier(data?.ids)
  } else if (url === '/basic/suppliers/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateSupplier(ids, rest)
  } else if (url?.startsWith('/basic/suppliers/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateSupplier(id, data)
  } else if (url?.startsWith('/basic/suppliers/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteSupplier(id)
  } else if (url === '/basic/supplier-prices' && m === 'get') {
    result = await mockGetSupplierPriceList(params)
  } else if (url === '/basic/supplier-prices' && m === 'post') {
    result = await mockCreateSupplierPrice(data)
  } else if (url === '/basic/supplier-prices/batch-delete' && m === 'post') {
    result = await mockBatchDeleteSupplierPrice(data?.ids)
  } else if (url?.startsWith('/basic/supplier-prices/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateSupplierPrice(id, data)
  } else if (url?.startsWith('/basic/supplier-prices/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteSupplierPrice(id)
  } else if (url === '/basic/customer-categories' && m === 'get') {
    result = await mockGetCustomerCategoryList(params)
  } else if (url === '/basic/customer-categories' && m === 'post') {
    result = await mockCreateCustomerCategory(data)
  } else if (url === '/basic/customer-categories/batch-delete' && m === 'post') {
    result = await mockBatchDeleteCustomerCategory(data?.ids)
  } else if (url === '/basic/customer-categories/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateCustomerCategory(ids, rest)
  } else if (url?.startsWith('/basic/customer-categories/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateCustomerCategory(id, data)
  } else if (url?.startsWith('/basic/customer-categories/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteCustomerCategory(id)
  } else if (url === '/basic/customer-public-leads' && m === 'get') {
    result = await mockGetPublicLeadList(params)
  } else if (url === '/basic/customer-public-leads' && m === 'post') {
    result = await mockCreatePublicLead(data)
  } else if (url === '/basic/customer-public-leads/batch-delete' && m === 'post') {
    result = await mockBatchDeletePublicLead(data?.ids)
  } else if (url === '/basic/customer-public-leads/batch-claim' && m === 'post') {
    result = await mockBatchClaimPublicLead(data?.ids)
  } else if (url === '/basic/customer-public-leads/batch-assign' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchAssignPublicLead(ids, rest)
  } else if (url?.startsWith('/basic/customer-public-leads/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdatePublicLead(id, data)
  } else if (url?.startsWith('/basic/customer-public-leads/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeletePublicLead(id)
  } else if (url === '/basic/customer-private-leads' && m === 'get') {
    result = await mockGetPrivateLeadList(params)
  } else if (url === '/basic/customer-private-leads' && m === 'post') {
    result = await mockCreatePrivateLead(data)
  } else if (url === '/basic/customer-private-leads/batch-delete' && m === 'post') {
    result = await mockBatchDeletePrivateLead(data?.ids)
  } else if (url === '/basic/customer-private-leads/batch-deal' && m === 'post') {
    result = await mockBatchDealPrivateLead(data?.ids)
  } else if (url === '/basic/customer-private-leads/batch-release' && m === 'post') {
    result = await mockBatchReleasePrivateLead(data?.ids)
  } else if (url?.startsWith('/basic/customer-private-leads/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdatePrivateLead(id, data)
  } else if (url?.startsWith('/basic/customer-private-leads/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeletePrivateLead(id)
  } else if (url === '/basic/customer-opportunities' && m === 'get') {
    result = await mockGetOpportunityList(params)
  } else if (url === '/basic/customer-opportunities' && m === 'post') {
    result = await mockCreateOpportunity(data)
  } else if (url === '/basic/customer-opportunities/batch-delete' && m === 'post') {
    result = await mockBatchDeleteOpportunity(data?.ids)
  } else if (url === '/basic/customer-opportunities/push' && m === 'post') {
    result = await mockPushOpportunity(data?.ids, data?.target)
  } else if (url?.startsWith('/basic/customer-opportunities/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateOpportunity(id, data)
  } else if (url?.startsWith('/basic/customer-opportunities/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteOpportunity(id)
  } else if (url === '/basic/customer-opportunity-evals' && m === 'get') {
    result = await mockGetOpportunityEvalList(params)
  } else if (url === '/basic/customer-opportunity-evals/batch-delete' && m === 'post') {
    result = await mockBatchDeleteOpportunityEval(data?.ids)
  } else if (url?.startsWith('/basic/customer-opportunity-evals/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateOpportunityEval(id, data)
  } else if (url?.startsWith('/basic/customer-opportunity-evals/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteOpportunityEval(id)
  } else if (url === '/basic/customers' && m === 'get') {
    result = await mockGetCustomerList(params)
  } else if (url === '/basic/customers' && m === 'post') {
    result = await mockCreateCustomer(data)
  } else if (url === '/basic/customers/batch-delete' && m === 'post') {
    result = await mockBatchDeleteCustomer(data?.ids)
  } else if (url === '/basic/customers/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateCustomer(ids, rest)
  } else if (url?.startsWith('/basic/customers/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateCustomer(id, data)
  } else if (url?.startsWith('/basic/customers/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteCustomer(id)
  } else if (url === '/basic/customer-prices' && m === 'get') {
    result = await mockGetCustomerPriceList(params)
  } else if (url === '/basic/customer-prices' && m === 'post') {
    result = await mockCreateCustomerPrice(data)
  } else if (url === '/basic/customer-prices/batch-delete' && m === 'post') {
    result = await mockBatchDeleteCustomerPrice(data?.ids)
  } else if (url === '/basic/customer-prices/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateCustomerPrice(ids, rest)
  } else if (url?.startsWith('/basic/customer-prices/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateCustomerPrice(id, data)
  } else if (url?.startsWith('/basic/customer-prices/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteCustomerPrice(id)
  } else if (url === '/basic/customer-owners' && m === 'get') {
    result = await mockGetCustomerOwnerList(params)
  } else if (url === '/basic/customer-owners/batch-delete' && m === 'post') {
    result = await mockBatchDeleteCustomerOwner(data?.ids)
  } else if (url === '/basic/customer-owners/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateCustomerOwner(ids, rest)
  } else if (url?.startsWith('/basic/customer-owners/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateCustomerOwner(id, data)
  } else if (url?.startsWith('/basic/customer-owners/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteCustomerOwner(id)
  } else if (url === '/basic/customer-orders' && m === 'get') {
    result = await mockGetCustomerOrderList(params)
  } else if (url === '/basic/customer-orders/batch-delete' && m === 'post') {
    result = await mockBatchDeleteCustomerOrder(data?.ids)
  } else if (url === '/basic/customer-orders/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateCustomerOrder(ids, rest)
  } else if (url?.startsWith('/basic/customer-orders/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateCustomerOrder(id, data)
  } else if (url?.startsWith('/basic/customer-orders/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteCustomerOrder(id)
  } else if (url === '/basic/customer-withdrawals' && m === 'get') {
    result = await mockGetCustomerWithdrawList(params)
  } else if (url === '/basic/customer-withdrawals/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateCustomerWithdraw(ids, rest)
  } else if (url?.startsWith('/basic/customer-withdrawals/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateCustomerWithdraw(id, data)
  } else if (url === '/basic/customer-commissions/summary' && m === 'get') {
    result = await mockGetCustomerCommissionSummary(params)
  } else if (url === '/basic/customer-commissions/sale-details' && m === 'get') {
    result = await mockGetCustomerCommissionSaleDetails(params)
  } else if (url === '/basic/customer-commissions/customer-details' && m === 'get') {
    result = await mockGetCustomerCommissionCustomerDetails(params)
  } else if (url === '/basic/customer-commissions/withdraw-details' && m === 'get') {
    result = await mockGetCustomerCommissionWithdrawDetails(params)
  } else if (url === '/basic/customer-feedbacks' && m === 'get') {
    result = await mockGetCustomerFeedbackList(params)
  } else if (url?.startsWith('/basic/customer-feedbacks/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateCustomerFeedback(id, data)
  } else if (url === '/basic/inventory-brands' && m === 'get') {
    result = await mockGetInventoryBrandList(params)
  } else if (url === '/basic/inventory-brands' && m === 'post') {
    result = await mockCreateInventoryBrand(data)
  } else if (url === '/basic/inventory-brands/batch-delete' && m === 'post') {
    result = await mockBatchDeleteInventoryBrand(data?.ids)
  } else if (url === '/basic/inventory-brands/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateInventoryBrand(ids, rest)
  } else if (url?.startsWith('/basic/inventory-brands/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateInventoryBrand(id, data)
  } else if (url?.startsWith('/basic/inventory-brands/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteInventoryBrand(id)
  } else if (url === '/basic/inventory-categories' && m === 'get') {
    result = await mockGetInventoryCategoryList(params)
  } else if (url === '/basic/inventory-categories' && m === 'post') {
    result = await mockCreateInventoryCategory(data)
  } else if (url === '/basic/inventory-categories/batch-delete' && m === 'post') {
    result = await mockBatchDeleteInventoryCategory(data?.ids)
  } else if (url === '/basic/inventory-categories/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateInventoryCategory(ids, rest)
  } else if (url?.startsWith('/basic/inventory-categories/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateInventoryCategory(id, data)
  } else if (url?.startsWith('/basic/inventory-categories/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteInventoryCategory(id)
  } else if (url === '/basic/inventory-attrs' && m === 'get') {
    result = await mockGetInventoryAttrList(params)
  } else if (url === '/basic/inventory-attrs' && m === 'post') {
    result = await mockCreateInventoryAttr(data)
  } else if (url === '/basic/inventory-attrs/batch-delete' && m === 'post') {
    result = await mockBatchDeleteInventoryAttr(data?.ids)
  } else if (url === '/basic/inventory-attrs/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateInventoryAttr(ids, rest)
  } else if (url?.startsWith('/basic/inventory-attrs/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateInventoryAttr(id, data)
  } else if (url?.startsWith('/basic/inventory-attrs/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteInventoryAttr(id)
  } else if (url === '/basic/inventory-unit-groups' && m === 'get') {
    result = await mockGetInventoryUnitGroupList(params)
  } else if (url === '/basic/inventory-unit-groups' && m === 'post') {
    result = await mockCreateInventoryUnitGroup(data)
  } else if (url?.startsWith('/basic/inventory-unit-groups/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateInventoryUnitGroup(id, data)
  } else if (url?.startsWith('/basic/inventory-unit-groups/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteInventoryUnitGroup(id)
  } else if (url === '/basic/inventory-units' && m === 'get') {
    result = await mockGetInventoryUnitList(params)
  } else if (url === '/basic/inventory-units' && m === 'post') {
    result = await mockCreateInventoryUnit(data)
  } else if (url === '/basic/inventory-units/batch-delete' && m === 'post') {
    result = await mockBatchDeleteInventoryUnit(data?.ids)
  } else if (url === '/basic/inventory-units/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateInventoryUnit(ids, rest)
  } else if (url?.startsWith('/basic/inventory-units/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateInventoryUnit(id, data)
  } else if (url?.startsWith('/basic/inventory-units/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteInventoryUnit(id)
  } else if (url === '/basic/inventory-batch-code/settings' && m === 'get') {
    result = await mockGetInventoryBatchCodeSettings()
  } else if (url === '/basic/inventory-batch-code/settings' && m === 'put') {
    result = await mockSaveInventoryBatchCodeSettings(data)
  } else if (url === '/basic/inventory-batch-code/preview' && m === 'post') {
    result = await mockPreviewInventoryBatchCodes(data)
  } else if (url === '/basic/inventories' && m === 'get') {
    result = await mockGetInventoryList(params)
  } else if (url === '/basic/inventories' && m === 'post') {
    result = await mockCreateInventory(data)
  } else if (url === '/basic/inventories/batch-delete' && m === 'post') {
    result = await mockBatchDeleteInventory(data?.ids)
  } else if (url === '/basic/inventories/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateInventory(ids, rest)
  } else if (url?.startsWith('/basic/inventories/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateInventory(id, data)
  } else if (url?.startsWith('/basic/inventories/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteInventory(id)
  } else if (url === '/basic/finance-items' && m === 'get') {
    result = await mockGetFinanceItemList(params)
  } else if (url === '/basic/finance-items' && m === 'post') {
    result = await mockCreateFinanceItem(data)
  } else if (url === '/basic/finance-items/batch-delete' && m === 'post') {
    result = await mockBatchDeleteFinanceItem(data?.ids)
  } else if (url === '/basic/finance-items/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateFinanceItem(ids, rest)
  } else if (url?.startsWith('/basic/finance-items/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateFinanceItem(id, data)
  } else if (url?.startsWith('/basic/finance-items/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteFinanceItem(id)
  } else if (url === '/basic/dict-types' && m === 'get') {
    result = await mockGetDictTypeList()
  } else if (url === '/basic/dict-values' && m === 'get') {
    result = await mockGetDictValueList(params)
  } else if (url === '/basic/dict-values' && m === 'post') {
    result = await mockCreateDictValue(data)
  } else if (url === '/basic/dict-values/batch-delete' && m === 'post') {
    result = await mockBatchDeleteDictValue(data?.ids)
  } else if (url === '/basic/dict-values/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateDictValue(ids, rest)
  } else if (url?.startsWith('/basic/dict-values/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateDictValue(id, data)
  } else if (url?.startsWith('/basic/dict-values/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteDictValue(id)
  } else if (url === '/stock/inventories' && m === 'get') {
    result = await mockGetStockInventoryList(params)
  } else if (url === '/stock/flows' && m === 'get') {
    result = await mockGetStockFlowList(params)
  } else if (url === '/stock/locks' && m === 'get') {
    result = await mockGetStockLockList(params)
  } else if (url?.match(/^\/stock\/locks\/[^/]+\/unlock$/) && m === 'post') {
    const id = url.split('/')[3]
    result = await mockUnlockStock(id)
  } else if (url?.match(/^\/stock\/bills\/[^/]+$/) && m === 'get') {
    const billKey = url.split('/')[3]
    result = await getBillStore(billKey).getList(params)
  } else if (url?.match(/^\/stock\/bills\/[^/]+$/) && m === 'post') {
    const billKey = url.split('/')[3]
    result = await getBillStore(billKey).create(data)
  } else if (url?.match(/^\/stock\/bills\/[^/]+\/batch-delete$/) && m === 'post') {
    const billKey = url.split('/')[3]
    result = await getBillStore(billKey).batchDelete(data?.ids)
  } else if (url?.match(/^\/stock\/bills\/[^/]+\/batch-update$/) && m === 'post') {
    const billKey = url.split('/')[3]
    const { ids, ...rest } = data || {}
    result = await getBillStore(billKey).batchUpdate(ids, rest)
  } else if (url?.match(/^\/stock\/bills\/[^/]+\/[^/]+$/) && m === 'put') {
    const parts = url.split('/')
    const billKey = parts[3]
    const id = parts[4]
    result = await getBillStore(billKey).update(id, data)
  } else if (url?.match(/^\/stock\/bills\/[^/]+\/[^/]+$/) && m === 'delete') {
    const parts = url.split('/')
    const billKey = parts[3]
    const id = parts[4]
    result = await getBillStore(billKey).remove(id)
  } else if (url === '/purchase/follow-ups' && m === 'get') {
    result = await mockGetPurchaseFollowUpList(params)
  } else if (url?.match(/^\/purchase\/bills\/[^/]+$/) && m === 'get') {
    const billKey = url.split('/')[3]
    result = await getPurchaseBillStore(billKey).getList(params)
  } else if (url?.match(/^\/purchase\/bills\/[^/]+$/) && m === 'post') {
    const billKey = url.split('/')[3]
    result = await getPurchaseBillStore(billKey).create(data)
  } else if (url?.match(/^\/purchase\/bills\/[^/]+\/batch-delete$/) && m === 'post') {
    const billKey = url.split('/')[3]
    result = await getPurchaseBillStore(billKey).batchDelete(data?.ids)
  } else if (url?.match(/^\/purchase\/bills\/[^/]+\/batch-update$/) && m === 'post') {
    const billKey = url.split('/')[3]
    const { ids, ...rest } = data || {}
    result = await getPurchaseBillStore(billKey).batchUpdate(ids, rest)
  } else if (url?.match(/^\/purchase\/bills\/[^/]+\/[^/]+$/) && m === 'put') {
    const parts = url.split('/')
    const billKey = parts[3]
    const id = parts[4]
    result = await getPurchaseBillStore(billKey).update(id, data)
  } else if (url?.match(/^\/purchase\/bills\/[^/]+\/[^/]+$/) && m === 'delete') {
    const parts = url.split('/')
    const billKey = parts[3]
    const id = parts[4]
    result = await getPurchaseBillStore(billKey).remove(id)
  } else if (url?.match(/^\/sales\/bills\/[^/]+$/) && m === 'get') {
    const billKey = url.split('/')[3]
    result = await getSalesBillStore(billKey).getList(params)
  } else if (url?.match(/^\/sales\/bills\/[^/]+$/) && m === 'post') {
    const billKey = url.split('/')[3]
    result = await getSalesBillStore(billKey).create(data)
  } else if (url?.match(/^\/sales\/bills\/[^/]+\/batch-delete$/) && m === 'post') {
    const billKey = url.split('/')[3]
    result = await getSalesBillStore(billKey).batchDelete(data?.ids)
  } else if (url?.match(/^\/sales\/bills\/[^/]+\/batch-update$/) && m === 'post') {
    const billKey = url.split('/')[3]
    const { ids, ...rest } = data || {}
    result = await getSalesBillStore(billKey).batchUpdate(ids, rest)
  } else if (url?.match(/^\/sales\/bills\/[^/]+\/[^/]+$/) && m === 'put') {
    const parts = url.split('/')
    const billKey = parts[3]
    const id = parts[4]
    result = await getSalesBillStore(billKey).update(id, data)
  } else if (url?.match(/^\/sales\/bills\/[^/]+\/[^/]+$/) && m === 'delete') {
    const parts = url.split('/')
    const billKey = parts[3]
    const id = parts[4]
    result = await getSalesBillStore(billKey).remove(id)
  } else if (url === '/cash/payment-methods' && m === 'get') {
    result = await mockGetCashPaymentMethodList(params)
  } else if (url === '/cash/payment-methods' && m === 'post') {
    result = await mockCreateCashPaymentMethod(data)
  } else if (url === '/cash/payment-methods/batch-delete' && m === 'post') {
    result = await mockBatchDeleteCashPaymentMethod(data?.ids)
  } else if (url === '/cash/payment-methods/batch-update' && m === 'post') {
    const { ids, ...rest } = data || {}
    result = await mockBatchUpdateCashPaymentMethod(ids, rest)
  } else if (url?.startsWith('/cash/payment-methods/') && m === 'put') {
    const id = url.split('/').pop()
    result = await mockUpdateCashPaymentMethod(id, data)
  } else if (url?.startsWith('/cash/payment-methods/') && m === 'delete') {
    const id = url.split('/').pop()
    result = await mockDeleteCashPaymentMethod(id)
  } else if (url?.match(/^\/cash\/bills\/[^/]+$/) && m === 'get') {
    const billKey = url.split('/')[3]
    result = await getCashBillStore(billKey).getList(params)
  } else if (url?.match(/^\/cash\/bills\/[^/]+$/) && m === 'post') {
    const billKey = url.split('/')[3]
    result = await getCashBillStore(billKey).create(data)
  } else if (url?.match(/^\/cash\/bills\/[^/]+\/batch-delete$/) && m === 'post') {
    const billKey = url.split('/')[3]
    result = await getCashBillStore(billKey).batchDelete(data?.ids)
  } else if (url?.match(/^\/cash\/bills\/[^/]+\/batch-update$/) && m === 'post') {
    const billKey = url.split('/')[3]
    const { ids, ...rest } = data || {}
    result = await getCashBillStore(billKey).batchUpdate(ids, rest)
  } else if (url?.match(/^\/cash\/bills\/[^/]+\/[^/]+$/) && m === 'put') {
    const parts = url.split('/')
    const billKey = parts[3]
    const id = parts[4]
    result = await getCashBillStore(billKey).update(id, data)
  } else if (url?.match(/^\/cash\/bills\/[^/]+\/[^/]+$/) && m === 'delete') {
    const parts = url.split('/')
    const billKey = parts[3]
    const id = parts[4]
    result = await getCashBillStore(billKey).remove(id)
  } else if (url?.match(/^\/project\/records\/[^/]+$/) && m === 'get') {
    const recordKey = url.split('/')[3]
    result = await getProjectStore(recordKey).getList(params)
  } else if (url?.match(/^\/project\/records\/[^/]+$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    result = await getProjectStore(recordKey).create(data)
  } else if (url?.match(/^\/project\/records\/[^/]+\/batch-delete$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    result = await getProjectStore(recordKey).batchDelete(data?.ids)
  } else if (url?.match(/^\/project\/records\/[^/]+\/batch-update$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    const { ids, ...rest } = data || {}
    result = await getProjectStore(recordKey).batchUpdate(ids, rest)
  } else if (url?.match(/^\/project\/records\/[^/]+\/[^/]+$/) && m === 'put') {
    const parts = url.split('/')
    const recordKey = parts[3]
    const id = parts[4]
    result = await getProjectStore(recordKey).update(id, data)
  } else if (url?.match(/^\/project\/records\/[^/]+\/[^/]+$/) && m === 'delete') {
    const parts = url.split('/')
    const recordKey = parts[3]
    const id = parts[4]
    result = await getProjectStore(recordKey).remove(id)
  } else if (url?.match(/^\/plan\/records\/[^/]+$/) && m === 'get') {
    const recordKey = url.split('/')[3]
    result = await getPlanStore(recordKey).getList(params)
  } else if (url?.match(/^\/plan\/records\/[^/]+$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    result = await getPlanStore(recordKey).create(data)
  } else if (url?.match(/^\/plan\/records\/[^/]+\/batch-delete$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    result = await getPlanStore(recordKey).batchDelete(data?.ids)
  } else if (url?.match(/^\/plan\/records\/[^/]+\/batch-update$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    const { ids, ...rest } = data || {}
    result = await getPlanStore(recordKey).batchUpdate(ids, rest)
  } else if (url?.match(/^\/plan\/records\/[^/]+\/[^/]+$/) && m === 'put') {
    const parts = url.split('/')
    const recordKey = parts[3]
    const id = parts[4]
    result = await getPlanStore(recordKey).update(id, data)
  } else if (url?.match(/^\/plan\/records\/[^/]+\/[^/]+$/) && m === 'delete') {
    const parts = url.split('/')
    const recordKey = parts[3]
    const id = parts[4]
    result = await getPlanStore(recordKey).remove(id)
  } else if (url?.match(/^\/production\/records\/[^/]+$/) && m === 'get') {
    const recordKey = url.split('/')[3]
    result = await getProductionStore(recordKey).getList(params)
  } else if (url?.match(/^\/production\/records\/[^/]+$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    result = await getProductionStore(recordKey).create(data)
  } else if (url?.match(/^\/production\/records\/[^/]+\/batch-delete$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    result = await getProductionStore(recordKey).batchDelete(data?.ids)
  } else if (url?.match(/^\/production\/records\/[^/]+\/batch-update$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    const { ids, ...rest } = data || {}
    result = await getProductionStore(recordKey).batchUpdate(ids, rest)
  } else if (url?.match(/^\/production\/records\/[^/]+\/[^/]+$/) && m === 'put') {
    const parts = url.split('/')
    const recordKey = parts[3]
    const id = parts[4]
    result = await getProductionStore(recordKey).update(id, data)
  } else if (url?.match(/^\/production\/records\/[^/]+\/[^/]+$/) && m === 'delete') {
    const parts = url.split('/')
    const recordKey = parts[3]
    const id = parts[4]
    result = await getProductionStore(recordKey).remove(id)
  } else if (url?.match(/^\/quality\/records\/[^/]+$/) && m === 'get') {
    const recordKey = url.split('/')[3]
    result = await getQualityStore(recordKey).getList(params)
  } else if (url?.match(/^\/quality\/records\/[^/]+$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    result = await getQualityStore(recordKey).create(data)
  } else if (url?.match(/^\/quality\/records\/[^/]+\/batch-delete$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    result = await getQualityStore(recordKey).batchDelete(data?.ids)
  } else if (url?.match(/^\/quality\/records\/[^/]+\/batch-update$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    const { ids, ...rest } = data || {}
    result = await getQualityStore(recordKey).batchUpdate(ids, rest)
  } else if (url?.match(/^\/quality\/records\/[^/]+\/[^/]+$/) && m === 'put') {
    const parts = url.split('/')
    const recordKey = parts[3]
    const id = parts[4]
    result = await getQualityStore(recordKey).update(id, data)
  } else if (url?.match(/^\/quality\/records\/[^/]+\/[^/]+$/) && m === 'delete') {
    const parts = url.split('/')
    const recordKey = parts[3]
    const id = parts[4]
    result = await getQualityStore(recordKey).remove(id)
  } else if (url?.match(/^\/hr\/records\/[^/]+$/) && m === 'get') {
    const recordKey = url.split('/')[3]
    result = await getHrStore(recordKey).getList(params)
  } else if (url?.match(/^\/hr\/records\/[^/]+$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    result = await getHrStore(recordKey).create(data)
  } else if (url?.match(/^\/hr\/records\/[^/]+\/batch-delete$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    result = await getHrStore(recordKey).batchDelete(data?.ids)
  } else if (url?.match(/^\/hr\/records\/[^/]+\/batch-update$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    const { ids, ...rest } = data || {}
    result = await getHrStore(recordKey).batchUpdate(ids, rest)
  } else if (url?.match(/^\/hr\/records\/[^/]+\/[^/]+$/) && m === 'put') {
    const parts = url.split('/')
    const recordKey = parts[3]
    const id = parts[4]
    result = await getHrStore(recordKey).update(id, data)
  } else if (url?.match(/^\/hr\/records\/[^/]+\/[^/]+$/) && m === 'delete') {
    const parts = url.split('/')
    const recordKey = parts[3]
    const id = parts[4]
    result = await getHrStore(recordKey).remove(id)
  } else if (url?.match(/^\/oa\/records\/[^/]+$/) && m === 'get') {
    const recordKey = url.split('/')[3]
    result = await getOaStore(recordKey).getList(params)
  } else if (url?.match(/^\/oa\/records\/[^/]+$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    result = await getOaStore(recordKey).create(data)
  } else if (url?.match(/^\/oa\/records\/[^/]+\/batch-delete$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    result = await getOaStore(recordKey).batchDelete(data?.ids)
  } else if (url?.match(/^\/oa\/records\/[^/]+\/batch-update$/) && m === 'post') {
    const recordKey = url.split('/')[3]
    const { ids, ...rest } = data || {}
    result = await getOaStore(recordKey).batchUpdate(ids, rest)
  } else if (url?.match(/^\/oa\/records\/[^/]+\/[^/]+$/) && m === 'put') {
    const parts = url.split('/')
    const recordKey = parts[3]
    const id = parts[4]
    result = await getOaStore(recordKey).update(id, data)
  } else if (url?.match(/^\/oa\/records\/[^/]+\/[^/]+$/) && m === 'delete') {
    const parts = url.split('/')
    const recordKey = parts[3]
    const id = parts[4]
    result = await getOaStore(recordKey).remove(id)
  } else {
    result = { code: 1, message: `未配置 mock: ${m.toUpperCase()} ${url}`, data: null }
  }

  if (result.code !== 0) {
    ElMessage.error(result.message || '请求失败')
    return Promise.reject(new Error(result.message || '请求失败'))
  }
  return result.data
}

export default request
