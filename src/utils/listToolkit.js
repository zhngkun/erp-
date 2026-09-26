/** 列表页通用：导出 CSV / 打印 / 复制字段清洗 */

function escapeCsvCell(val) {
  const s = val == null ? '' : String(val)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function downloadText(filename, text, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob(['\uFEFF' + text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * @param {{ prop: string, label: string }[]} columns
 * @param {Record<string, unknown>[]} rows
 * @param {string} filename
 * @param {(row: object, col: object) => string} [formatCell]
 */
export function exportRowsToCsv(columns, rows, filename, formatCell) {
  const cols = columns.filter((c) => c.prop && c.label)
  const header = cols.map((c) => escapeCsvCell(c.label)).join(',')
  const lines = rows.map((row) =>
    cols
      .map((c) => {
        const raw = formatCell ? formatCell(row, c) : row[c.prop]
        return escapeCsvCell(raw == null || raw === '' ? '' : raw)
      })
      .join(','),
  )
  downloadText(filename.endsWith('.csv') ? filename : `${filename}.csv`, [header, ...lines].join('\n'))
}

/**
 * @param {{ prop: string, label: string }[]} columns
 * @param {Record<string, unknown>[]} rows
 * @param {string} title
 * @param {(row: object, col: object) => string} [formatCell]
 */
export function printRows(columns, rows, title, formatCell) {
  const cols = columns.filter((c) => c.prop && c.label)
  const thead = cols.map((c) => `<th>${escapeHtml(c.label)}</th>`).join('')
  const tbody = rows
    .map((row) => {
      const tds = cols
        .map((c) => {
          const raw = formatCell ? formatCell(row, c) : row[c.prop]
          return `<td>${escapeHtml(raw == null || raw === '' ? '—' : String(raw))}</td>`
        })
        .join('')
      return `<tr>${tds}</tr>`
    })
    .join('')
  const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title>
<style>
body{font-family:system-ui,sans-serif;padding:16px;color:#222}
h1{font-size:16px;margin:0 0 12px}
table{border-collapse:collapse;width:100%;font-size:12px}
th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}
th{background:#f5f5f5}
</style></head><body>
<h1>${escapeHtml(title)}</h1>
<table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>
<script>window.onload=function(){window.print()}<\/script>
</body></html>`
  const w = window.open('', '_blank')
  if (!w) return false
  w.document.write(html)
  w.document.close()
  return true
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** 复制单据时去掉主键与状态字段 */
export function stripForCopy(row, extraOmit = []) {
  if (!row) return {}
  const omit = new Set([
    'id',
    'billCode',
    'status',
    'auditName',
    'verifyData',
    'createdAt',
    'updatedAt',
    ...extraOmit,
  ])
  const next = {}
  for (const [k, v] of Object.entries(row)) {
    if (omit.has(k)) continue
    next[k] = Array.isArray(v) ? v.map((i) => ({ ...i })) : v
  }
  next.status = '已保存'
  next.billDate = new Date().toISOString().slice(0, 10)
  return next
}

const STORAGE_PREFIX = 'erp.colSettings.'

export function loadColumnVisibility(storageKey, columns) {
  const defaults = Object.fromEntries(
    (columns || []).filter((c) => c.prop).map((c) => [c.prop, true]),
  )
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + storageKey)
    if (!raw) return { ...defaults }
    const saved = JSON.parse(raw)
    return { ...defaults, ...saved }
  } catch {
    return { ...defaults }
  }
}

export function saveColumnVisibility(storageKey, visibility) {
  localStorage.setItem(STORAGE_PREFIX + storageKey, JSON.stringify(visibility))
}

export function filterVisibleColumns(columns, visibility) {
  return (columns || []).filter((c) => !c.prop || visibility[c.prop] !== false)
}
