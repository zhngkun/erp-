import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/** pid: 0 表示顶级 */
const seedList = [
  {
    id: 1,
    pid: 0,
    name: '原材料',
    code: 'IC-RM',
    cover: '',
    enabled: 1,
    isMallShow: 0,
    sort: 10,
    org: '总部',
    createdAt: '2026-09-20 09:20:11',
  },
  {
    id: 8,
    pid: 1,
    name: '金属材料',
    code: 'IC-RM-METAL',
    cover: '',
    enabled: 1,
    isMallShow: 0,
    sort: 11,
    org: '总部',
    createdAt: '2026-09-20 09:22:00',
  },
  {
    id: 9,
    pid: 1,
    name: '非金属材料',
    code: 'IC-RM-NON',
    cover: '',
    enabled: 1,
    isMallShow: 0,
    sort: 12,
    org: '总部',
    createdAt: '2026-09-20 09:23:00',
  },
  {
    id: 5,
    pid: 1,
    name: '电子元器件',
    code: 'IC-EL',
    cover: '',
    enabled: 1,
    isMallShow: 1,
    sort: 15,
    org: '总部',
    createdAt: '2026-09-12 16:45:18',
  },
  {
    id: 10,
    pid: 5,
    name: '被动元件',
    code: 'IC-EL-PASS',
    cover: '',
    enabled: 1,
    isMallShow: 0,
    sort: 16,
    org: '总部',
    createdAt: '2026-09-12 16:50:00',
  },
  {
    id: 2,
    pid: 0,
    name: '半成品',
    code: 'IC-SF',
    cover: '',
    enabled: 1,
    isMallShow: 0,
    sort: 20,
    org: '制造中心',
    createdAt: '2026-09-20 09:21:05',
  },
  {
    id: 11,
    pid: 2,
    name: '机加件',
    code: 'IC-SF-MACH',
    cover: '',
    enabled: 1,
    isMallShow: 0,
    sort: 21,
    org: '制造中心',
    createdAt: '2026-09-20 09:25:00',
  },
  {
    id: 3,
    pid: 0,
    name: '成品',
    code: 'IC-FG',
    cover: '',
    enabled: 1,
    isMallShow: 1,
    sort: 30,
    org: '总部',
    createdAt: '2026-09-18 14:10:22',
  },
  {
    id: 12,
    pid: 3,
    name: '整机',
    code: 'IC-FG-FULL',
    cover: '',
    enabled: 1,
    isMallShow: 1,
    sort: 31,
    org: '总部',
    createdAt: '2026-09-18 14:15:00',
  },
  {
    id: 4,
    pid: 0,
    name: '辅料',
    code: 'IC-AUX',
    cover: '',
    enabled: 1,
    isMallShow: 0,
    sort: 40,
    org: '供应链',
    createdAt: '2026-09-15 11:30:00',
  },
  {
    id: 6,
    pid: 0,
    name: '包装材料',
    code: 'IC-PKG',
    cover: '',
    enabled: 1,
    isMallShow: 0,
    sort: 50,
    org: '供应链',
    createdAt: '2026-09-10 08:55:18',
  },
  {
    id: 7,
    pid: 0,
    name: '临时分类',
    code: 'IC-TMP',
    cover: '',
    enabled: 0,
    isMallShow: 0,
    sort: 999,
    org: '总部',
    createdAt: '2026-08-28 09:01:19',
  },
]

let list = seedList.map((item) => ({ ...item }))
let nextId = Math.max(...list.map((r) => r.id)) + 1

export function buildCategoryTree(rows = []) {
  const map = new Map()
  rows.forEach((item) => {
    map.set(item.id, { ...item, children: [] })
  })
  const roots = []
  map.forEach((node) => {
    const pid = Number(node.pid) || 0
    if (pid && map.has(pid)) {
      map.get(pid).children.push(node)
    } else {
      roots.push(node)
    }
  })
  const sortDeep = (nodes) => {
    nodes.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    nodes.forEach((n) => {
      if (n.children?.length) sortDeep(n.children)
      else delete n.children
    })
  }
  sortDeep(roots)
  return roots
}

/** 含自身及全部子孙 id */
export function collectCategoryIds(rootId, rows = list) {
  const id = Number(rootId)
  if (!id) return []
  const result = [id]
  const walk = (pid) => {
    rows.forEach((r) => {
      if (Number(r.pid) === pid) {
        result.push(r.id)
        walk(r.id)
      }
    })
  }
  walk(id)
  return result
}

export async function mockGetInventoryCategoryList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    name = '',
    code = '',
    enabled = '',
    asTree = '',
  } = params
  let rows = [...list]
  if (name) rows = rows.filter((r) => r.name.includes(String(name).trim()))
  if (code) rows = rows.filter((r) => r.code.includes(String(code).trim()))
  if (enabled !== '' && enabled != null) {
    rows = rows.filter((r) => r.enabled === Number(enabled))
  }
  rows.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))

  // 侧栏树：返回完整树（忽略分页）
  if (String(asTree) === '1' || asTree === true) {
    return ok({
      list: buildCategoryTree(rows),
      flat: rows,
      total: rows.length,
    })
  }

  const total = rows.length
  const start = (Number(page) - 1) * Number(pageSize)
  return ok({
    list: rows.slice(start, start + Number(pageSize)),
    total,
    page: Number(page),
    pageSize: Number(pageSize),
  })
}

export async function mockCreateInventoryCategory(payload) {
  await sleep()
  if (!payload?.name?.trim()) return fail('请输入分类名称')
  if (!payload?.code?.trim()) return fail('请输入分类编号')
  if (list.some((r) => r.code === payload.code.trim())) return fail('分类编号已存在')
  const pid = Number(payload.pid) || 0
  if (pid && !list.some((r) => r.id === pid)) return fail('上级分类不存在')
  const row = {
    id: nextId++,
    pid,
    name: payload.name.trim(),
    code: payload.code.trim(),
    cover: payload.cover || '',
    enabled: payload.enabled === 0 ? 0 : 1,
    isMallShow: payload.isMallShow === 1 ? 1 : 0,
    sort: Number(payload.sort) || 0,
    org: payload.org || '总部',
    createdAt: formatDate(new Date()),
  }
  list.unshift(row)
  return ok({ ...row })
}

export async function mockUpdateInventoryCategory(id, payload) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('分类不存在')
  if (payload.code) {
    const exists = list.some(
      (r) => r.code === payload.code.trim() && String(r.id) !== String(id),
    )
    if (exists) return fail('分类编号已存在')
  }
  if (payload.pid != null) {
    const pid = Number(payload.pid) || 0
    if (pid === Number(id)) return fail('上级分类不能是自身')
    if (pid) {
      const descendants = collectCategoryIds(id)
      if (descendants.includes(pid)) return fail('上级分类不能是自身的下级')
      if (!list.some((r) => r.id === pid)) return fail('上级分类不存在')
    }
  }
  list[idx] = {
    ...list[idx],
    ...payload,
    id: list[idx].id,
    pid: payload.pid != null ? Number(payload.pid) || 0 : list[idx].pid,
    name: payload.name != null ? String(payload.name).trim() : list[idx].name,
    code: payload.code != null ? String(payload.code).trim() : list[idx].code,
  }
  return ok({ ...list[idx] })
}

export async function mockDeleteInventoryCategory(id) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('分类不存在')
  if (list.some((r) => Number(r.pid) === Number(id))) {
    return fail('请先删除下级分类')
  }
  list.splice(idx, 1)
  return ok(true)
}

export async function mockBatchDeleteInventoryCategory(ids = []) {
  await sleep()
  if (!ids.length) return fail('请选择分类')
  const idSet = new Set(ids.map(String))
  const hasChild = list.some(
    (r) => idSet.has(String(r.pid)) && !idSet.has(String(r.id)),
  )
  if (hasChild) return fail('选中项存在未一并删除的下级分类')
  list = list.filter((r) => !idSet.has(String(r.id)))
  return ok(true)
}

export async function mockBatchUpdateInventoryCategory(ids = [], data = {}) {
  await sleep()
  if (!ids.length) return fail('请选择分类')
  const idSet = new Set(ids.map(String))
  list = list.map((r) => (idSet.has(String(r.id)) ? { ...r, ...data } : r))
  return ok(true)
}

/** 供存货列表按分类树过滤使用 */
export function getInventoryCategoryFlat() {
  return list.map((r) => ({ ...r }))
}
