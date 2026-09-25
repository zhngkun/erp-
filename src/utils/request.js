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
