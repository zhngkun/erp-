<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  Download,
  Picture,
  Plus,
  Refresh,
  Setting,
} from '@element-plus/icons-vue'
import {
  batchDeleteCustomerPrice,
  batchUpdateCustomerPrice,
  createCustomerPrice,
  deleteCustomerPrice,
  getCustomerPriceList,
  updateCustomerPrice,
} from '@/api/customerPrice'
import { PageList } from '@/components/page'

const SCOPE_OPTIONS = [
  { value: '所有客户', label: '所有客户' },
  { value: '未分类客户', label: '未分类客户' },
  { value: '客户分类', label: '客户分类' },
  { value: '指定客户', label: '指定客户' },
]

const MATERIAL_SCOPE_OPTIONS = [
  { value: '所有物料', label: '所有物料' },
  { value: '未分类物料', label: '未分类物料' },
  { value: '物料分类', label: '物料分类' },
  { value: '指定物料', label: '指定物料' },
]

const PRICE_TYPE_OPTIONS = [
  { value: '价格', label: '价格' },
  { value: '比例', label: '比例' },
]

const STATUS_OPTIONS = [
  { value: '已保存', label: '已保存', type: 'info' },
  { value: '待审核', label: '待审核', type: 'warning' },
  { value: '审核拒绝', label: '审核拒绝', type: 'danger' },
  { value: '已审核', label: '已审核', type: 'success' },
]

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogMode = ref('create')
const detailRow = ref(null)

const query = reactive({
  scope: '',
  customerName: '',
  customerCode: '',
  materialName: '',
  materialCode: '',
  priceType: '',
  status: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  scope: '指定客户',
  customerName: '',
  customerCode: '',
  categoryName: '',
  materialScope: '指定物料',
  materialCategory: '',
  materialName: '',
  spec: '',
  cover: '',
  materialCode: '',
  customerMaterialName: '',
  customerMaterialCode: '',
  priceType: '价格',
  salePrice: 0,
  adjustRatio: 100,
  status: '已保存',
  remark: '',
})

const formRef = ref(null)
const formRules = {
  scope: [{ required: true, message: '请选择作用范围', trigger: 'change' }],
  priceType: [{ required: true, message: '请选择价格类型', trigger: 'change' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? '新增客户价格' : '编辑客户价格',
)

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

function statusType(status) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.type || 'info'
}

function canEdit(row) {
  return ['已保存', '审核拒绝'].includes(row.status)
}

function canDelete(row) {
  return ['已保存', '审核拒绝', '待审核'].includes(row.status)
}

function canAudit(row) {
  return row.status === '待审核'
}

function canAbandon(row) {
  return row.status === '已审核'
}

async function fetchList() {
  loading.value = true
  try {
    const data = await getCustomerPriceList({ ...query })
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
  query.scope = ''
  query.customerName = ''
  query.customerCode = ''
  query.materialName = ''
  query.materialCode = ''
  query.priceType = ''
  query.status = ''
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function resetForm() {
  form.id = null
  form.scope = '指定客户'
  form.customerName = ''
  form.customerCode = ''
  form.categoryName = ''
  form.materialScope = '指定物料'
  form.materialCategory = ''
  form.materialName = ''
  form.spec = ''
  form.cover = ''
  form.materialCode = ''
  form.customerMaterialName = ''
  form.customerMaterialCode = ''
  form.priceType = '价格'
  form.salePrice = 0
  form.adjustRatio = 100
  form.status = '已保存'
  form.remark = ''
}

function openCreate() {
  dialogMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  if (!canEdit(row)) {
    ElMessage.warning('当前状态不可编辑')
    return
  }
  dialogMode.value = 'edit'
  Object.assign(form, {
    id: row.id,
    scope: row.scope,
    customerName: row.customerName || '',
    customerCode: row.customerCode || '',
    categoryName: row.categoryName || '',
    materialScope: row.materialScope || '指定物料',
    materialCategory: row.materialCategory || '',
    materialName: row.materialName || '',
    spec: row.spec || '',
    cover: row.cover || '',
    materialCode: row.materialCode || '',
    customerMaterialName: row.customerMaterialName || '',
    customerMaterialCode: row.customerMaterialCode || '',
    priceType: row.priceType,
    salePrice: row.salePrice ?? 0,
    adjustRatio: row.adjustRatio ?? 100,
    status: row.status || '已保存',
    remark: row.remark || '',
  })
  dialogVisible.value = true
}

function openDetail(row) {
  detailRow.value = { ...row }
  detailVisible.value = true
}

async function submitForm() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const payload = { ...form }
      delete payload.id
      if (dialogMode.value === 'create') {
        payload.status = '已保存'
        await createCustomerPrice(payload)
        ElMessage.success('新增成功')
      } else {
        await updateCustomerPrice(form.id, payload)
        ElMessage.success('更新成功')
      }
      dialogVisible.value = false
      fetchList()
    } finally {
      submitting.value = false
    }
  })
}

async function handleDelete(row) {
  if (!canDelete(row)) {
    ElMessage.warning('当前状态不可删除')
    return
  }
  try {
    await ElMessageBox.confirm('确认删除该价格记录？', '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteCustomerPrice(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && query.page > 1) query.page -= 1
    fetchList()
  } catch {
    /* cancel */
  }
}

async function setStatus(row, status, successMsg) {
  await updateCustomerPrice(row.id, { status })
  ElMessage.success(successMsg)
  fetchList()
}

async function handleAudit(row) {
  if (!canAudit(row)) return
  try {
    await ElMessageBox.confirm(`确认审核通过「${row.materialName || row.id}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '审核',
      cancelButtonText: '取消',
    })
    await setStatus(row, '已审核', '审核成功')
  } catch {
    /* cancel */
  }
}

async function handleRefuse(row) {
  if (!canAudit(row)) return
  try {
    await ElMessageBox.confirm(`确认拒绝「${row.materialName || row.id}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '拒绝',
      cancelButtonText: '取消',
    })
    await setStatus(row, '审核拒绝', '已拒绝')
  } catch {
    /* cancel */
  }
}

async function handleAbandon(row) {
  if (!canAbandon(row)) return
  try {
    await ElMessageBox.confirm(`确认弃审「${row.materialName || row.id}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '弃审',
      cancelButtonText: '取消',
    })
    await setStatus(row, '已保存', '弃审成功')
  } catch {
    /* cancel */
  }
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选记录')
    return
  }
  try {
    if (command === 'audit') {
      await batchUpdateCustomerPrice(selectedIds.value, { status: '已审核' })
      ElMessage.success('批量审核成功')
    } else if (command === 'abandon') {
      await batchUpdateCustomerPrice(selectedIds.value, { status: '已保存' })
      ElMessage.success('批量弃审成功')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 条记录？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await batchDeleteCustomerPrice(selectedIds.value)
      ElMessage.success('批量删除成功')
    }
    fetchList()
  } catch {
    /* cancel */
  }
}

function handleMoreCommand(command, row) {
  if (command === 'edit') openEdit(row)
  else if (command === 'delete') handleDelete(row)
  else if (command === 'audit') handleAudit(row)
  else if (command === 'refuse') handleRefuse(row)
  else if (command === 'abandon') handleAbandon(row)
  else if (command === 'submit') submitForAudit(row)
  else if (command === 'log') ElMessage.info('操作日志待开发')
}

function handleExport() {
  ElMessage.info('导出功能待开发')
}

function formatPrice(val) {
  if (val == null || val === '') return '—'
  return Number(val).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })
}

function submitForAudit(row) {
  if (!canEdit(row)) return
  setStatus(row, '待审核', '已提交审核')
}

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
        <el-form-item label="作用范围">
          <el-select
            v-model="query.scope"
            clearable
            placeholder="全部"
            style="width: 140px"
          >
            <el-option
              v-for="item in SCOPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户">
          <el-input
            v-model="query.customerName"
            clearable
            placeholder="客户名称"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="客户编号">
          <el-input
            v-model="query.customerCode"
            clearable
            placeholder="客户编号"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input
            v-model="query.materialName"
            clearable
            placeholder="物料名称"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="SKU编码">
          <el-input
            v-model="query.materialCode"
            clearable
            placeholder="SKU编码"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="价格类型">
          <el-select
            v-model="query.priceType"
            clearable
            placeholder="全部"
            style="width: 120px"
          >
            <el-option
              v-for="item in PRICE_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        <div class="cp-toolbar">
          <div class="cp-toolbar__left">
            <el-button type="primary" :icon="Plus" @click="openCreate">
              新增
            </el-button>
            <el-dropdown trigger="click" @command="handleBatchCommand">
              <el-button type="primary" plain>
                批量
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="audit">批量审核</el-dropdown-item>
                  <el-dropdown-item command="abandon">批量弃审</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    批量删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button type="primary" plain :icon="Download" @click="handleExport">
              导出
            </el-button>
          </div>
          <div class="cp-toolbar__right">
            <el-tooltip content="刷新" placement="top">
              <el-button circle :icon="Refresh" @click="fetchList" />
            </el-tooltip>
            <el-tooltip content="列设置" placement="top">
              <el-button
                circle
                :icon="Setting"
                @click="ElMessage.info('列设置待开发')"
              />
            </el-tooltip>
          </div>
        </div>
      </template>

      <el-table-column type="selection" width="48" fixed="left" />
      <el-table-column
        prop="scope"
        label="作用范围"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="customerName"
        label="客户"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column
        prop="customerCode"
        label="客户编号"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="categoryName"
        label="客户分类"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="materialScope"
        label="物料范围"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="materialCategory"
        label="物料分类"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="materialName"
        label="物料名称"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column
        prop="spec"
        label="规格"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column prop="cover" label="封面" width="72" align="center">
        <template #default="{ row }">
          <el-image
            v-if="row.cover"
            :src="row.cover"
            fit="cover"
            class="cover-thumb"
          />
          <el-icon v-else class="cover-empty"><Picture /></el-icon>
        </template>
      </el-table-column>
      <el-table-column
        prop="materialCode"
        label="SKU编码"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="customerMaterialName"
        label="客品名称"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="customerMaterialCode"
        label="客品编码"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="priceType"
        label="价格类型"
        width="90"
        align="center"
      />
      <el-table-column
        prop="salePrice"
        label="销售价格"
        width="110"
        align="right"
      >
        <template #default="{ row }">
          {{ formatPrice(row.salePrice) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="adjustRatio"
        label="调价比例(%)"
        width="120"
        align="right"
      >
        <template #default="{ row }">
          {{ row.adjustRatio != null ? `${row.adjustRatio}%` : '—' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" effect="light" :type="statusType(row.status)">
            {{ row.status || '—' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createdAt"
        label="创建时间"
        min-width="170"
        sortable
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
                  <el-dropdown-item v-if="canEdit(row)" command="edit">
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item v-if="canEdit(row)" command="submit">
                    提交审核
                  </el-dropdown-item>
                  <el-dropdown-item v-if="canDelete(row)" command="delete">
                    <span class="danger-text">删除</span>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="canAudit(row)" command="audit">
                    审核
                  </el-dropdown-item>
                  <el-dropdown-item v-if="canAudit(row)" command="refuse">
                    拒绝
                  </el-dropdown-item>
                  <el-dropdown-item v-if="canAbandon(row)" command="abandon">
                    弃审
                  </el-dropdown-item>
                  <el-dropdown-item command="log" divided>日志</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </PageList>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="640px"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="110px"
      >
        <el-form-item label="作用范围" prop="scope">
          <el-select v-model="form.scope" style="width: 100%">
            <el-option
              v-for="item in SCOPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="客户编号">
          <el-input v-model="form.customerCode" placeholder="请输入客户编号" />
        </el-form-item>
        <el-form-item label="客户分类">
          <el-input v-model="form.categoryName" placeholder="请输入客户分类" />
        </el-form-item>
        <el-form-item label="物料范围">
          <el-select v-model="form.materialScope" style="width: 100%">
            <el-option
              v-for="item in MATERIAL_SCOPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料分类">
          <el-input v-model="form.materialCategory" placeholder="请输入物料分类" />
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input v-model="form.materialName" placeholder="请输入物料名称" />
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="form.spec" placeholder="请输入规格" />
        </el-form-item>
        <el-form-item label="SKU编码">
          <el-input v-model="form.materialCode" placeholder="请输入SKU编码" />
        </el-form-item>
        <el-form-item label="客品名称">
          <el-input
            v-model="form.customerMaterialName"
            placeholder="请输入客品名称"
          />
        </el-form-item>
        <el-form-item label="客品编码">
          <el-input
            v-model="form.customerMaterialCode"
            placeholder="请输入客品编码"
          />
        </el-form-item>
        <el-form-item label="价格类型" prop="priceType">
          <el-select v-model="form.priceType" style="width: 100%">
            <el-option
              v-for="item in PRICE_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input-number
            v-model="form.salePrice"
            :min="0"
            :precision="4"
            :step="1"
          />
        </el-form-item>
        <el-form-item label="调价比例(%)">
          <el-input-number
            v-model="form.adjustRatio"
            :min="0"
            :precision="2"
            :step="1"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="2"
            maxlength="200"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">
          确定
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="detailVisible"
      title="客户价格详情"
      width="640px"
      destroy-on-close
    >
      <el-descriptions v-if="detailRow" :column="2" border>
        <el-descriptions-item label="作用范围">
          {{ detailRow.scope }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ detailRow.status }}
        </el-descriptions-item>
        <el-descriptions-item label="客户">
          {{ detailRow.customerName || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="客户编号">
          {{ detailRow.customerCode || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="客户分类">
          {{ detailRow.categoryName || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="物料范围">
          {{ detailRow.materialScope }}
        </el-descriptions-item>
        <el-descriptions-item label="物料分类">
          {{ detailRow.materialCategory || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="物料名称">
          {{ detailRow.materialName || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="规格">
          {{ detailRow.spec || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="SKU编码">
          {{ detailRow.materialCode || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="价格类型">
          {{ detailRow.priceType }}
        </el-descriptions-item>
        <el-descriptions-item label="销售价格">
          {{ formatPrice(detailRow.salePrice) }}
        </el-descriptions-item>
        <el-descriptions-item label="调整比例">
          {{ detailRow.adjustRatio }}%
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ detailRow.createdAt }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">
          {{ detailRow.remark || '—' }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
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

.cp-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.cp-toolbar__left,
.cp-toolbar__right {
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

.cover-thumb {
  width: 36px;
  height: 36px;
  border-radius: 6px;
}

.cover-empty {
  font-size: 20px;
  color: var(--soft-text-muted);
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
