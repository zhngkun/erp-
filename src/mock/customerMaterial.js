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
    customerName: '测试客户01',
    customerCode: '192418',
    materialName: '精密传动模组 A1',
    materialCode: 'FG-TM-A1',
    customerMaterialName: '传动模组-客A',
    customerMaterialCode: 'C-TM-A1',
    spec: '标准型',
    unitName: '套',
    remark: '',
    createdAt: '2026-09-20 10:12:05',
  },
  {
    id: 2,
    customerName: 'ACME工业',
    customerCode: 'ACME-01',
    materialName: '主轴箱体',
    materialCode: 'FG-SP-01',
    customerMaterialName: 'SPINDLE BOX',
    customerMaterialCode: 'ACME-SP-01',
    spec: 'HT250',
    unitName: '件',
    remark: '出口客户编码',
    createdAt: '2026-09-15 14:00:00',
  },
]
let seq = 3

export async function mockGetCustomerMaterialList(params = {}) {
  await sleep()
  let rows = [...list]
  if (params.customerName) {
    rows = rows.filter((r) =>
      String(r.customerName).includes(String(params.customerName).trim()),
    )
  }
  if (params.materialName) {
    rows = rows.filter((r) =>
      String(r.materialName).includes(String(params.materialName).trim()),
    )
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

export async function mockCreateCustomerMaterial(payload = {}) {
  await sleep()
  if (!payload.customerName || !payload.materialName) return fail('客户与物料必填')
  const row = { id: seq++, createdAt: nowStr(), unitName: '件', ...payload }
  list.unshift(row)
  return ok(row)
}

export async function mockUpdateCustomerMaterial(id, payload = {}) {
  await sleep()
  const idx = list.findIndex((r) => String(r.id) === String(id))
  if (idx < 0) return fail('记录不存在')
  list[idx] = { ...list[idx], ...payload }
  return ok(list[idx])
}

export async function mockRemoveCustomerMaterial(id) {
  await sleep()
  list = list.filter((r) => String(r.id) !== String(id))
  return ok(true)
}
