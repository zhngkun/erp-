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

/** 下载 Excel 可打开的 CSV 导入模板（含表头 + 示例行） */
export function downloadImportTemplate(columns, filename, sampleRow = {}) {
  const cols = columns.filter((c) => c.prop && c.label)
  const header = cols.map((c) => escapeCsvCell(c.label)).join(',')
  const sample = cols.map((c) => escapeCsvCell(sampleRow[c.prop] ?? '')).join(',')
  downloadText(
    filename.endsWith('.csv') ? filename : `${filename}-导入模板.csv`,
    [header, sample].join('\n'),
  )
}

function parseCsvLine(line) {
  const cells = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        cur += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      cells.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  cells.push(cur)
  return cells
}

/** 解析 CSV 文本为对象数组（首行为中文表头，映射到 columns.prop） */
export function parseCsvToRows(text, columns) {
  const cols = columns.filter((c) => c.prop && c.label)
  const labelToProp = Object.fromEntries(cols.map((c) => [c.label, c.prop]))
  const lines = String(text || '')
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((l) => l.trim())
  if (lines.length < 2) return []
  const headers = parseCsvLine(lines[0]).map((h) => h.trim())
  const props = headers.map((h) => labelToProp[h] || null)
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i])
    const row = {}
    let has = false
    props.forEach((prop, idx) => {
      if (!prop) return
      const val = (cells[idx] ?? '').trim()
      if (val !== '') has = true
      row[prop] = val
    })
    if (has) rows.push(row)
  }
  return rows
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsText(file, 'UTF-8')
  })
}

/**
 * 按模板打印：list=清单 | bill=单据样式 | simple=简洁
 */
export function printWithTemplate(columns, rows, title, template = 'list', formatCell) {
  const cols = columns.filter((c) => c.prop && c.label)
  if (template === 'bill' && rows.length === 1) {
    const row = rows[0]
    const fields = cols
      .map((c) => {
        const raw = formatCell ? formatCell(row, c) : row[c.prop]
        return `<tr><th>${escapeHtml(c.label)}</th><td>${escapeHtml(raw == null || raw === '' ? '—' : String(raw))}</td></tr>`
      })
      .join('')
    const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title>
<style>
body{font-family:"PingFang SC",system-ui,sans-serif;padding:24px;color:#222}
.sheet{max-width:720px;margin:0 auto;border:1px solid #333;padding:20px 24px}
h1{text-align:center;font-size:18px;margin:0 0 16px;letter-spacing:2px}
table{width:100%;border-collapse:collapse;font-size:13px}
th{width:28%;text-align:right;padding:8px 12px;background:#f7f7f7;border:1px solid #ccc;font-weight:600}
td{padding:8px 12px;border:1px solid #ccc}
.footer{margin-top:28px;display:flex;justify-content:space-between;font-size:12px;color:#666}
</style></head><body>
<div class="sheet">
  <h1>${escapeHtml(title)}</h1>
  <table>${fields}</table>
  <div class="footer"><span>打印时间：${new Date().toLocaleString('zh-CN')}</span><span>签字：__________</span></div>
</div>
<script>window.onload=function(){window.print()}<\/script>
</body></html>`
    const w = window.open('', '_blank')
    if (!w) return false
    w.document.write(html)
    w.document.close()
    return true
  }
  return printRows(columns, rows, title, formatCell)
}

