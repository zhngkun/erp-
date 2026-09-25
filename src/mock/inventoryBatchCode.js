import { fail, ok, sleep } from './config'

const defaultSettings = {
  codeType: 'barcode',
  paperSize: '40x30',
  barHeight: 40,
  marginLeft: 2,
  marginTop: 2,
  marginBottom: 2,
  textAlign: 'center',
  codeShow: 1,
  codeFontSize: 12,
  codeFontWeight: 'normal',
  prefixType: 'none',
  prefixValue: '',
  startNo: 1,
  number: 10,
  fillGap: 4,
  separator: '-',
}

let settings = { ...defaultSettings }

function pad(n, len) {
  return String(n).padStart(len, '0')
}

function buildCodes(cfg) {
  const count = Math.max(1, Math.min(Number(cfg.number) || 1, 200))
  const start = Number(cfg.startNo) || 1
  const gap = Math.max(1, Number(cfg.fillGap) || 1)
  const list = []
  for (let i = 0; i < count; i += 1) {
    const seq = pad(start + i, gap)
    let prefix = ''
    if (cfg.prefixType === 'text') prefix = cfg.prefixValue || ''
    if (cfg.prefixType === 'date') {
      const d = new Date()
      prefix = `${d.getFullYear()}${pad(d.getMonth() + 1, 2)}${pad(d.getDate(), 2)}`
    }
    const code = prefix
      ? `${prefix}${cfg.separator || ''}${seq}`
      : seq
    list.push({ id: i + 1, code, count: 1 })
  }
  return list
}

export async function mockGetInventoryBatchCodeSettings() {
  await sleep()
  return ok({ ...settings })
}

export async function mockSaveInventoryBatchCodeSettings(payload = {}) {
  await sleep()
  settings = { ...settings, ...payload }
  return ok({ ...settings })
}

export async function mockPreviewInventoryBatchCodes(payload = {}) {
  await sleep()
  const cfg = { ...settings, ...payload }
  if (!cfg.codeType) return fail('请选择条码类型')
  return ok({
    settings: cfg,
    list: buildCodes(cfg),
  })
}
