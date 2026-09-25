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
