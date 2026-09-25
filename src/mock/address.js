import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/** 行政等级：1省 2市 3区县 4街道乡镇 */
export const ADDRESS_LEVELS = [
  { value: 1, label: '省级' },
  { value: 2, label: '市级' },
  { value: 3, label: '区县级' },
  { value: 4, label: '街道/乡镇' },
]

const seedAddresses = [
  { id: 1, name: '江苏省', code: '320000', level: 1, sort: 10, createdAt: '2026-01-08 09:00:00' },
  { id: 2, name: '苏州市', code: '320500', level: 2, sort: 20, createdAt: '2026-01-08 09:05:12' },
  { id: 3, name: '工业园区', code: '320571', level: 3, sort: 30, createdAt: '2026-01-08 09:10:33' },
  { id: 4, name: '斜塘街道', code: '320571001', level: 4, sort: 40, createdAt: '2026-01-08 09:15:01' },
  { id: 5, name: '唯亭街道', code: '320571002', level: 4, sort: 50, createdAt: '2026-01-08 09:16:22' },
  { id: 6, name: '胜浦街道', code: '320571003', level: 4, sort: 60, createdAt: '2026-01-08 09:17:40' },
  { id: 7, name: '相城区', code: '320507', level: 3, sort: 70, createdAt: '2026-01-10 10:20:00' },
  { id: 8, name: '黄桥街道', code: '320507001', level: 4, sort: 80, createdAt: '2026-01-10 10:22:18' },
  { id: 9, name: '元和街道', code: '320507002', level: 4, sort: 90, createdAt: '2026-01-10 10:23:55' },
  { id: 10, name: '吴中区', code: '320506', level: 3, sort: 100, createdAt: '2026-01-12 11:00:00' },
  { id: 11, name: '越溪街道', code: '320506001', level: 4, sort: 110, createdAt: '2026-01-12 11:05:30' },
  { id: 12, name: '木渎镇', code: '320506101', level: 4, sort: 120, createdAt: '2026-01-12 11:08:44' },
  { id: 13, name: '浙江省', code: '330000', level: 1, sort: 130, createdAt: '2026-02-01 08:30:00' },
  { id: 14, name: '杭州市', code: '330100', level: 2, sort: 140, createdAt: '2026-02-01 08:35:10' },
  { id: 15, name: '西湖区', code: '330106', level: 3, sort: 150, createdAt: '2026-02-01 08:40:00' },
  { id: 16, name: '西溪街道', code: '330106001', level: 4, sort: 160, createdAt: '2026-02-01 08:42:16' },
  { id: 17, name: '上海市', code: '310000', level: 1, sort: 5, createdAt: '2026-02-15 14:00:00' },
  { id: 18, name: '浦东新区', code: '310115', level: 3, sort: 170, createdAt: '2026-02-15 14:10:22' },
  { id: 19, name: '张江镇', code: '310115101', level: 4, sort: 180, createdAt: '2026-02-15 14:12:08' },
  { id: 20, name: '广东省', code: '440000', level: 1, sort: 200, createdAt: '2026-03-01 09:00:00' },
  { id: 21, name: '深圳市', code: '440300', level: 2, sort: 210, createdAt: '2026-03-01 09:05:00' },
  { id: 22, name: '南山区', code: '440305', level: 3, sort: 220, createdAt: '2026-03-01 09:10:00' },
  { id: 23, name: '粤海街道', code: '440305001', level: 4, sort: 230, createdAt: '2026-03-01 09:12:30' },
  { id: 24, name: '北京市', code: '110000', level: 1, sort: 1, createdAt: '2026-03-10 16:20:00' },
  { id: 25, name: '海淀区', code: '110108', level: 3, sort: 240, createdAt: '2026-03-10 16:25:00' },
  { id: 26, name: '中关村街道', code: '110108001', level: 4, sort: 250, createdAt: '2026-03-10 16:28:40' },
]

let addresses = seedAddresses.map((item) => ({ ...item }))
let nextId = seedAddresses.length + 1

function levelLabel(level) {
  return ADDRESS_LEVELS.find((item) => item.value === Number(level))?.label || ''
}

export async function mockGetAddressList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    name = '',
    code = '',
    level = '',
  } = params

  let filtered = [...addresses]

  if (name) {
    filtered = filtered.filter((item) =>
      item.name.includes(String(name).trim()),
    )
  }
  if (code) {
    filtered = filtered.filter((item) =>
      item.code.includes(String(code).trim()),
    )
  }
  if (level !== '' && level !== null && level !== undefined) {
    filtered = filtered.filter((item) => item.level === Number(level))
  }

  filtered.sort((a, b) => a.sort - b.sort || a.id - b.id)

  const total = filtered.length
  const start = (Number(page) - 1) * Number(pageSize)
  const list = filtered.slice(start, start + Number(pageSize)).map((item) => ({
    ...item,
    levelLabel: levelLabel(item.level),
  }))

  return ok({ list, total, page: Number(page), pageSize: Number(pageSize) })
}

export async function mockCreateAddress(payload) {
  await sleep()
  if (!payload?.name || !payload?.code) {
    return fail('行政地址名称和编码不能为空')
  }
  if (payload?.level === undefined || payload?.level === null || payload?.level === '') {
    return fail('请选择行政等级')
  }
  if (addresses.some((item) => item.code === payload.code)) {
    return fail('行政地址编码已存在')
  }
  const row = {
    id: nextId++,
    name: payload.name,
    code: payload.code,
    level: Number(payload.level),
    sort: payload.sort ?? 0,
    createdAt: formatDate(new Date()),
  }
  addresses.unshift(row)
  return ok({ ...row, levelLabel: levelLabel(row.level) }, '创建成功')
}

export async function mockUpdateAddress(id, payload) {
  await sleep()
  const index = addresses.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('行政地址不存在')
  if (
    payload?.code &&
    addresses.some(
      (item) => item.code === payload.code && item.id !== Number(id),
    )
  ) {
    return fail('行政地址编码已存在')
  }
  addresses[index] = {
    ...addresses[index],
    ...payload,
    id: addresses[index].id,
    level: payload.level !== undefined ? Number(payload.level) : addresses[index].level,
  }
  return ok(
    { ...addresses[index], levelLabel: levelLabel(addresses[index].level) },
    '更新成功',
  )
}

export async function mockDeleteAddress(id) {
  await sleep()
  const index = addresses.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('行政地址不存在')
  addresses.splice(index, 1)
  return ok(true, '删除成功')
}

export async function mockBatchDeleteAddress(ids = []) {
  await sleep()
  const idSet = new Set((ids || []).map(Number))
  if (!idSet.size) return fail('请选择要删除的行政地址')
  addresses = addresses.filter((item) => !idSet.has(item.id))
  return ok(true, '批量删除成功')
}
