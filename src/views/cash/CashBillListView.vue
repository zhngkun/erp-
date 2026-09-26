<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Plus, Refresh, Setting } from '@element-plus/icons-vue'
import { createCashBillApi } from '@/api/cash'
import { ColumnSettingDialog, PageList } from '@/components/page'
import {
  exportRowsToCsv,
  filterVisibleColumns,
  loadColumnVisibility,
  printRows,
  stripForCopy,
} from '@/utils/listToolkit'

import {
  BILL_CONFIGS,
  ITEM_FIELD_LABELS,
  STATUS_OPTIONS,
} from './billConfigs'

const props = defineProps({
  billKey: { type: String, required: true },
})

const config = computed(() => BILL_CONFIGS[props.billKey])
const api = computed(() => createCashBillApi(props.billKey))

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const detailVisible = ref(false)
const detailRow = ref(null)
const dialogVisible = ref(false)
const dialogMode = ref('create')
const formRef = ref(null)
const colSettingVisible = ref(false)
const colVisibility = ref({})

const baseColumns = computed(() => [
  { prop: 'billCode', label: '单据编号' },
  { prop: 'billDate', label: '单据日期' },
  { prop: 'itemSummary', label: '明细摘要' },
  ...(config.value?.columns || []),
  { prop: 'numberTotal', label: '数量合计' },
  { prop: 'status', label: '状态' },
  { prop: 'createAdminName', label: '创建人' },
  { prop: 'createdAt', label: '创建时间' },
  { prop: 'remark', label: '备注' },
])
const visibleConfigColumns = computed(() =>
  filterVisibleColumns(config.value?.columns || [], colVisibility.value),
)
const colStorageKey = computed(() => `cash.${props.billKey}`)
colVisibility.value = loadColumnVisibility(colStorageKey.value, baseColumns.value)

function isColVisible(prop) {
  return colVisibility.value[prop] !== false
}
function onColSettingChange(vis) {
  colVisibility.value = vis
}
function handleExport() {
  const cols = filterVisibleColumns(baseColumns.value, colVisibility.value)
  exportRowsToCsv(cols, tableData.value, `${config.value.title}-${Date.now()}`, cellValue)
  ElMessage.success('已导出当前页')
}
function handlePrintRow(row) {
  const cols = filterVisibleColumns(baseColumns.value, colVisibility.value)
  if (!printRows(cols, [row], `${config.value.title} ${row.billCode}`, cellValue)) {
    ElMessage.warning('请允许浏览器弹窗以打印')
  }
}
function openCopy(row) {
  openCreate()
  const copied = stripForCopy(row)
  Object.assign(form, copied, { id: null, status: '已保存' })
  if (Array.isArray(copied.itemList)) {
    form.itemList = copied.itemList.map((i) => ({ ...i }))
  }
  ElMessage.success('已复制，请确认后保存')
}

const query = reactive({
  billCode: '',
  status: '',
  dateRange: [],
  page: 1,
  pageSize: 10,
  supplierName: '',
  customerName: '',
  reason: '',
})

const emptyItem = () => ({
  materialName: '',
  feeName: '',
  number: 1,
  unitName: '个',
  stockName: '',
  locationName: '',
  instockLocationName: '',
  costPrice: 0,
  salePrice: 0,
  amount: 0,
  taxRate: 13,
  taxCostPrice: 0,
  taxSalePrice: 0,
  inventoryNumber: 0,
  diffNumber: 0,
  inventoryResult: '',
  returnNumber: 0,
  refundNumber: 0,
  serialNumber: '',
  batchNumber: '',
  batchExpireTime: '',
  adjustmentCostPrice: 0,
  sourceBillType: '',
  sourceBillCode: '',
  remark: '',
})

const form = reactive({
  id: null,
  billDate: '',
  remark: '',
  supplierName: '',
  supplierCode: '',
  customerName: '',
  customerCode: '',
  salesmanName: '',
  responsibleAdminName: '',
  reason: '',
  stockName: '',
  instockStockName: '',
  sourceBillCode: '',
  personType: '供应商',
  personName: '',
  businessType: '',
  procedureName: '',
  processingMethod: '自制',
  planType: '',
  contractNo: '',
  requisitionAdminName: '',
  requisitionDeptName: '',
  demandDate: '',
  arrivalDate: '',
  deliveryDate: '',
  deliveryAdminName: '',
  arriveDate: '',
  receiptStatus: '未收款',
  processStatus: '处理中',
  refundType: '退货',
  paytypeName: '',
  isPay: '是',
  operateAdminName: '',
  operateDeptName: '',
  sourcePaytypeName: '',
  toPaytypeName: '',
  invoiceType: '增值税专用发票',
  invoiceNumber: '',
  taxNo: '',
  itemList: [emptyItem()],
})

const selectedIds = computed(() => selectedRows.value.map((r) => r.id))
const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? config.value.addLabel : `编辑${config.value.title}`,
)

function statusType(status) {
  return STATUS_OPTIONS.find((i) => i.value === status)?.type || 'info'
}

function formatAmount(val) {
  if (val == null || val === '') return '—'
  return Number(val).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function cellValue(row, col) {
  const val = row[col.prop]
  if (col.format === 'amount') return formatAmount(val)
  return val ?? '—'
}

async function fetchList() {
  loading.value = true
  try {
    const [startDate, endDate] = query.dateRange || []
    const extra = {}
    for (const item of config.value?.extraSearch || []) {
      extra[item.key] = query[item.key] || ''
    }
    const data = await api.value.getList({
      billCode: query.billCode,
      status: query.status,
      startDate: startDate || '',
      endDate: endDate || '',
      ...extra,
      page: query.page,
      pageSize: query.pageSize,
    })
    tableData.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  query.page = 1
  fetchList()
}

function handleReset() {
  query.billCode = ''
  query.status = ''
  query.dateRange = []
  query.supplierName = ''
  query.customerName = ''
  query.reason = ''
  for (const item of config.value?.extraSearch || []) {
    query[item.key] = ''
  }
  query.page = 1
  fetchList()
}

function openDetail(row) {
  detailRow.value = { ...row, itemList: [...(row.itemList || [])] }
  detailVisible.value = true
}

function resetForm() {
  form.id = null
  form.billDate = new Date().toISOString().slice(0, 10)
  form.remark = ''
  form.supplierName = ''
  form.supplierCode = ''
  form.customerName = ''
  form.customerCode = ''
  form.salesmanName = ''
  form.responsibleAdminName = ''
  form.reason = ''
  form.stockName = ''
  form.instockStockName = ''
  form.sourceBillCode = ''
  form.personType = '供应商'
  form.personName = ''
  form.businessType = ''
  form.procedureName = ''
  form.processingMethod = '自制'
  form.planType = ''
  form.contractNo = ''
  form.requisitionAdminName = ''
  form.requisitionDeptName = ''
  form.demandDate = ''
  form.arrivalDate = ''
  form.deliveryDate = ''
  form.deliveryAdminName = ''
  form.arriveDate = ''
  form.receiptStatus = '未收款'
  form.processStatus = '处理中'
  form.refundType = '退货'
  form.paytypeName = ''
  form.isPay = '是'
  form.operateAdminName = ''
  form.operateDeptName = ''
  form.sourcePaytypeName = ''
  form.toPaytypeName = ''
  form.invoiceType = '增值税专用发票'
  form.invoiceNumber = ''
  form.taxNo = ''
  form.itemList = [emptyItem()]
}

function openCreate() {
  dialogMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  if (!['已保存', '待审核', '审核拒绝'].includes(row.status)) {
    ElMessage.warning('当前状态不可编辑')
    return
  }
  dialogMode.value = 'edit'
  resetForm()
  Object.assign(form, {
    id: row.id,
    billDate: row.billDate,
    remark: row.remark || '',
    supplierName: row.supplierName || '',
    supplierCode: row.supplierCode || '',
    customerName: row.customerName || '',
    customerCode: row.customerCode || '',
    salesmanName: row.salesmanName || '',
    responsibleAdminName: row.responsibleAdminName || '',
    reason: row.reason || '',
    stockName: row.stockName || '',
    instockStockName: row.instockStockName || '',
    sourceBillCode: row.sourceBillCode || '',
    personType: row.personType || '供应商',
    personName: row.personName || '',
    businessType: row.businessType || '',
    procedureName: row.procedureName || '',
    processingMethod: row.processingMethod || '自制',
    planType: row.planType || '',
    contractNo: row.contractNo || '',
    requisitionAdminName: row.requisitionAdminName || '',
    requisitionDeptName: row.requisitionDeptName || '',
    demandDate: row.demandDate || '',
    arrivalDate: row.arrivalDate || '',
    deliveryDate: row.deliveryDate || '',
    deliveryAdminName: row.deliveryAdminName || '',
    arriveDate: row.arriveDate || '',
    receiptStatus: row.receiptStatus || '未收款',
    processStatus: row.processStatus || '处理中',
    refundType: row.refundType || '退货',
    paytypeName: row.paytypeName || '',
    isPay: row.isPay || '是',
    operateAdminName: row.operateAdminName || '',
    operateDeptName: row.operateDeptName || '',
    sourcePaytypeName: row.sourcePaytypeName || '',
    toPaytypeName: row.toPaytypeName || '',
    invoiceType: row.invoiceType || '增值税专用发票',
    invoiceNumber: row.invoiceNumber || '',
    taxNo: row.taxNo || '',
    itemList: (row.itemList || []).map((i) => ({ ...emptyItem(), ...i })),
  })
  if (!form.itemList.length) form.itemList = [emptyItem()]
  dialogVisible.value = true
}

function addItemRow() {
  form.itemList.push(emptyItem())
}

function removeItemRow(idx) {
  if (form.itemList.length <= 1) {
    ElMessage.warning('至少保留一行明细')
    return
  }
  form.itemList.splice(idx, 1)
}

function buildPayload() {
  const numberTotal = form.itemList.reduce(
    (s, i) => s + Number(i.number || 0),
    0,
  )
  const payload = {
    billDate: form.billDate,
    remark: form.remark,
    itemList: form.itemList.map((i) => ({ ...i })),
    numberTotal,
    itemSummary: form.itemList
      .map((i) => i.feeName || i.materialName || i.sourceBillCode)
      .filter(Boolean)
      .join('、'),
    status: dialogMode.value === 'create' ? '已保存' : undefined,
  }
  for (const f of config.value.formExtras || []) {
    payload[f.key] = form[f.key]
  }
  if (config.value.amountField === 'costPriceTotal') {
    payload.costPriceTotal = form.itemList.reduce(
      (s, i) => s + Number(i.number || 0) * Number(i.costPrice || 0),
      0,
    )
  }
  if (config.value.amountField === 'salePriceTotal') {
    payload.salePriceTotal = form.itemList.reduce(
      (s, i) => s + Number(i.number || 0) * Number(i.salePrice || 0),
      0,
    )
  }
  if (config.value.amountField === 'amountTotal') {
    payload.amountTotal = Number(
      form.itemList
        .reduce(
          (s, i) =>
            s +
            Number(
              i.amount ||
                Number(i.number || 0) *
                  Number(i.taxSalePrice || i.taxCostPrice || i.salePrice || i.costPrice || 0),
            ),
          0,
        )
        .toFixed(2),
    )
    payload.salePriceTotal = payload.amountTotal
    payload.costPriceTotal = payload.amountTotal
    payload.amount = payload.amountTotal
    payload.payAmount = payload.amountTotal
    payload.taxPriceTotal = payload.amountTotal
  }
  if (config.value.amountField === 'amount') {
    payload.amount = Number(
      form.itemList
        .reduce((s, i) => s + Number(i.amount || 0), 0)
        .toFixed(2),
    )
    payload.amountTotal = payload.amount
    payload.payAmount = payload.amount
    payload.toAmount = payload.amount
  }
  if (config.value.amountField === 'taxPriceTotal') {
    payload.taxPriceTotal = Number(
      form.itemList
        .reduce((s, i) => s + Number(i.amount || 0), 0)
        .toFixed(2),
    )
    payload.amountTotal = payload.taxPriceTotal
    payload.amount = payload.taxPriceTotal
  }
  if (props.billKey === 'lend') {
    payload.returnNumberTotal = 0
    payload.waitReturnNumberTotal = numberTotal
  }
  return payload
}

async function submitForm() {
  if (!form.billDate) {
    ElMessage.warning('请选择单据日期')
    return
  }
  for (const f of config.value.formExtras || []) {
    if (f.required && !form[f.key]) {
      ElMessage.warning(`请填写${f.label}`)
      return
    }
  }
  if (!form.itemList.some((i) => i.materialName)) {
    ElMessage.warning('请至少填写一行存货明细')
    return
  }
  submitting.value = true
  try {
    const payload = buildPayload()
    if (dialogMode.value === 'create') {
      await api.value.create(payload)
      ElMessage.success('新增成功')
    } else {
      await api.value.update(form.id, payload)
      ElMessage.success('保存成功')
    }
    dialogVisible.value = false
    fetchList()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除单据「${row.billCode}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await api.value.remove(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && query.page > 1) query.page -= 1
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleAudit(row) {
  if (!['待审核', '已保存'].includes(row.status)) {
    ElMessage.warning('当前状态不可审核')
    return
  }
  try {
    await ElMessageBox.confirm(`确认审核通过「${row.billCode}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '审核',
      cancelButtonText: '取消',
    })
    await api.value.update(row.id, {
      status: '已审核',
      verifyData: `管理员 / ${new Date().toLocaleString('zh-CN')}`,
    })
    ElMessage.success('审核成功')
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleAbandon(row) {
  if (row.status !== '已审核') {
    ElMessage.warning('仅已审核单据可弃审')
    return
  }
  try {
    await ElMessageBox.confirm(`确认弃审「${row.billCode}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '弃审',
      cancelButtonText: '取消',
    })
    await api.value.update(row.id, { status: '待审核', verifyData: '' })
    ElMessage.success('弃审成功')
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选单据')
    return
  }
  try {
    if (command === 'audit') {
      await api.value.batchUpdate(selectedIds.value, {
        status: '已审核',
        verifyData: `管理员 / ${new Date().toLocaleString('zh-CN')}`,
      })
      ElMessage.success('批量审核成功')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 张单据？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await api.value.batchDelete(selectedIds.value)
      ElMessage.success('批量删除成功')
    }
    fetchList()
  } catch {
    /* cancel */
  }
}


async function handlePush(command, row) {
  const map = {

  }
  const target = map[command]
  if (!target) {
    const act = (config.value.moreActions || []).find((a) => a.command === command)
    ElMessage.info(`${act?.label || command}待开发`)
    return
  }
  if (row.status !== '已审核') {
    ElMessage.warning('仅已审核单据可下推')
    return
  }
  try {
    await ElMessageBox.confirm(`确认下推生成「${target.label}」？`, '下推确认', { type: 'info' })
    const targetApi = createCashBillApi(target.target)
    await targetApi.create({
      ...stripForCopy(row),
      sourceBillCode: row.billCode,
      sourceBillType: config.value.title,
      remark: `由${row.billCode}下推`,
      status: '已保存',
    })
    ElMessage.success(`已下推${target.label}`)
  } catch { /* cancel */ }
}

function handleMoreCommand(command, row) {
  if (command === 'edit') openEdit(row)
  else if (command === 'audit') handleAudit(row)
  else if (command === 'abandon') handleAbandon(row)
  else if (command === 'delete') handleDelete(row)
  else if (command === 'copy') openCopy(row)
  else if (command === 'print') handlePrintRow(row)
  else {
    handlePush(command, row)
  }
}

watch(
  () => props.billKey,
  () => {
    colVisibility.value = loadColumnVisibility(colStorageKey.value, baseColumns.value)
    handleReset()
  },
)

onMounted(fetchList)
</script>

<template>
  <div class="page-root">
    <PageList
      v-model:page="query.page"
      v-model:page-size="query.pageSize"
      search-text="搜索"
      :query="query"
      :loading="loading"
      :data="tableData"
      :total="total"
      @search="handleSearch"
      @reset="handleReset"
      @page-change="fetchList"
      @size-change="fetchList"
      @selection-change="selectedRows = $event"
    >
      <template #search>
        <el-form-item label="单据日期">
          <el-date-picker
            v-model="query.dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item label="单据编号">
          <el-input
            v-model="query.billCode"
            clearable
            placeholder="请输入单据编号"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item
          v-for="item in config.extraSearch || []"
          :key="item.key"
          :label="item.label"
        >
          <el-input
            v-model="query[item.key]"
            clearable
            :placeholder="item.placeholder"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="query.status"
            clearable
            placeholder="全部"
            style="width: 120px"
          >
            <el-option
              v-for="item in STATUS_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>

      <template #header>
        <div class="order-toolbar">
          <div class="order-toolbar__left">
            <el-button type="primary" :icon="Plus" @click="openCreate">
              {{ config.addLabel }}
            </el-button>
            <el-dropdown trigger="click" @command="handleBatchCommand">
              <el-button type="primary" plain>
                批量
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="audit">批量审核</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    批量删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="order-toolbar__right">
            <el-tooltip content="导出" placement="top">
              <el-button
                circle
                @click="handleExport"
              >
                导
              </el-button>
            </el-tooltip>
            <el-tooltip content="刷新" placement="top">
              <el-button circle :icon="Refresh" @click="fetchList" />
            </el-tooltip>
            <el-tooltip content="列设置" placement="top">
              <el-button
                circle
                :icon="Setting"
                @click="colSettingVisible = true"
              />
            </el-tooltip>
          </div>
        </div>
      </template>

      <el-table-column type="selection" width="48" />
      <el-table-column
        prop="billCode"
        label="单据编号"
        min-width="150"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)">
            {{ row.billCode }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="billDate" label="单据日期" width="120" />
      <el-table-column
        prop="itemSummary"
        label="明细摘要"
        min-width="160"
        show-overflow-tooltip
      />
      <el-table-column
        v-for="col in visibleConfigColumns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :min-width="col.minWidth"
        :width="col.width"
        :align="col.align || 'left'"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ cellValue(row, col) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="numberTotal"
        label="数量合计"
        width="100"
        align="right"
      />
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" effect="light" :type="statusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="verifyData"
        label="审核信息"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createAdminName"
        label="创建人"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createdAt"
        label="创建时间"
        min-width="170"
        show-overflow-tooltip
      />
      <el-table-column
        prop="remark"
        label="备注"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button link type="primary" @click="openDetail(row)">
              详情
            </el-button>
            <el-dropdown
              trigger="click"
              @command="(cmd) => handleMoreCommand(cmd, row)"
            >
              <el-button link type="primary">
                更多
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="['已保存', '待审核', '审核拒绝'].includes(row.status)"
                    command="edit"
                  >
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="['待审核', '已保存'].includes(row.status)"
                    command="audit"
                  >
                    审核
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="row.status === '已审核'"
                    command="abandon"
                  >
                    弃审
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-for="act in config.moreActions || []"
                    :key="act.command"
                    :command="act.command"
                  >
                    {{ act.label }}
                  </el-dropdown-item>
                  <el-dropdown-item command="copy">复制</el-dropdown-item>
                  <el-dropdown-item command="print">打印</el-dropdown-item>
                  <el-dropdown-item
                    v-if="['已保存', '待审核', '审核拒绝'].includes(row.status)"
                    command="delete"
                    divided
                  >
                    <span class="danger-text">删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </PageList>

    <el-drawer
      v-model="detailVisible"
      :title="`${config.title}详情`"
      size="640px"
      destroy-on-close
    >
      <template v-if="detailRow">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="单据编号">
            {{ detailRow.billCode }}
          </el-descriptions-item>
          <el-descriptions-item label="单据日期">
            {{ detailRow.billDate }}
          </el-descriptions-item>
          <el-descriptions-item
            v-for="col in visibleConfigColumns"
            :key="col.prop"
            :label="col.label"
          >
            {{ cellValue(detailRow, col) }}
          </el-descriptions-item>
          <el-descriptions-item label="数量合计">
            {{ detailRow.numberTotal }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            {{ detailRow.status }}
          </el-descriptions-item>
          <el-descriptions-item label="审核信息">
            {{ detailRow.verifyData || '—' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建人">
            {{ detailRow.createAdminName }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ detailRow.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ detailRow.remark || '—' }}
          </el-descriptions-item>
        </el-descriptions>
        <h4 class="detail-sub">明细</h4>
        <el-table :data="detailRow.itemList || []" border stripe size="small">
          <el-table-column
            v-for="field in config.itemFields"
            :key="field"
            :prop="field"
            :label="ITEM_FIELD_LABELS[field] || field"
            min-width="100"
            show-overflow-tooltip
          />
        </el-table>
      </template>
    </el-drawer>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="820px"
      destroy-on-close
      @closed="formRef?.resetFields?.()"
    >
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="单据日期" required>
              <el-date-picker
                v-model="form.billDate"
                type="date"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col
            v-for="item in config.formExtras || []"
            :key="item.key"
            :span="12"
          >
            <el-form-item :label="item.label" :required="item.required">
              <el-input v-model="form[item.key]" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="item-head">
          <span>明细行</span>
          <el-button link type="primary" @click="addItemRow">添加行</el-button>
        </div>
        <el-table :data="form.itemList" border size="small" class="item-table">
          <el-table-column
            v-for="field in config.itemFields"
            :key="field"
            :label="ITEM_FIELD_LABELS[field] || field"
            min-width="110"
          >
            <template #default="{ row }">
              <el-input
                v-if="
                  ![
                    'number',
                    'costPrice',
                    'salePrice',
                    'taxRate',
                    'taxCostPrice',
                    'taxSalePrice',
                    'amount',
                    'inventoryNumber',
                    'diffNumber',
                    'returnNumber',
                    'refundNumber',
                    'adjustmentCostPrice',
                  ].includes(field)
                "
                v-model="row[field]"
                size="small"
              />
              <el-input-number
                v-else
                v-model="row[field]"
                size="small"
                :controls="false"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70" fixed="right">
            <template #default="{ $index }">
              <el-button
                link
                type="danger"
                @click="removeItemRow($index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">
          保存
        </el-button>
      </template>
    </el-dialog>
  
    <ColumnSettingDialog
      v-model="colSettingVisible"
      :storage-key="colStorageKey"
      :columns="baseColumns"
      @change="onColSettingChange"
    />
</div>
</template>

<style scoped>
.page-root {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.order-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.order-toolbar__left,
.order-toolbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.table-actions {
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 2px;
  white-space: nowrap;
}

.danger-text {
  color: var(--el-color-danger);
}

.detail-sub {
  margin: 16px 0 8px;
  font-size: 14px;
  font-weight: 600;
}

.item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
  font-weight: 600;
}

.item-table {
  width: 100%;
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
