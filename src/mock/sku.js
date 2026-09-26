import { fail, ok, sleep } from './config'

function pad(n) {
  return String(n).padStart(2, '0')
}

function nowStr() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

let list = [
  {
    id: 1,
    name: '精密传动模组 A1',
    code: 'FG-TM-A1',
    spec: '标准型',
    unitName: '套',
    salePrice: 1280,
    costPrice: 860,
    enable: 1,
    remark: '',
    createdAt: '2026-09-20 10:00:00',
  },
  {
    id: 2,
    name: '精密传动模组 B2',
    code: 'FG-TM-B2',
    spec: '加长型',
    unitName: '套',
    salePrice: 1560,
    costPrice: 980,
    enable: 1,
    remark: '',
    createdAt: '2026-09-18 11:20:00',
  },
  {
    id: 3,
    name: '不锈钢板 304',
    code: 'SKU-SS304-12',
    spec: '1.2mm',
    unitName: '张',
    salePrice: 210,
    costPrice: 186,
    enable: 1,
    remark: '',
    createdAt: '2026-09-10 09:00:00',
  },
]
let seq = 4

export async function mockGetSkuList(params = {}) {
  await sleep()
  let rows = [...list]
  if (params.name) {
    rows = rows.filter((r) => String(r.name).includes(String(params.name).trim()))
  }
  if (params.code) {
    rows = rows.filter((r) => String(r.code).includes(String(params.code).trim()))
  }
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 10
  const start = (page - 1) * pageSize
  return ok({
    list: rows.slice(start, start + pageSize),
    total: rows.length,
    page,
    pageSize,
  })
}

export async function mockCreateSku(payload = {}) {
  await sleep()
  if (!payload.name || !payload.code) return fail('名称与编码必填')
  const row = {
    id: seq++,
    createdAt: nowStr(),
    enable: 1,
    salePrice: 0,
    costPrice: 0,
    unitName: '件',
    ...payload,
  }
  list.unshift(row)
  return ok(row)
}

export async function mockUpdateSku(id, payload = {}) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('记录不存在')
  list[idx] = { ...list[idx], ...payload }
  return ok(list[idx])
}

export async function mockRemoveSku(id) {
  await sleep()
  list = list.filter((r) => String(r.id) !== String(id))
  return ok(true)
}
