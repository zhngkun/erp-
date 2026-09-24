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
