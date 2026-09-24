/** 全局开关：后续接真实后端时改为 false，并配置 VITE_API_BASE */
export const USE_MOCK = true

export function sleep(ms = 320) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function ok(data, message = 'success') {
  return { code: 0, message, data }
}

export function fail(message = 'error', code = 1) {
  return { code, message, data: null }
}
