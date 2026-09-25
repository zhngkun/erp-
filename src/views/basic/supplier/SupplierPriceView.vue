<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  Picture,
  Plus,
  Refresh,
  Setting,
} from '@element-plus/icons-vue'
import {
  batchDeleteSupplierPrice,
  createSupplierPrice,
  deleteSupplierPrice,
  getSupplierPriceList,
  updateSupplierPrice,
} from '@/api/supplierPrice'
import { PageList } from '@/components/page'

const SCOPE_OPTIONS = [
  { value: '全部供应商', label: '全部供应商' },
  { value: '指定供应商', label: '指定供应商' },
]

const INVENTORY_SCOPE_OPTIONS = [
  { value: '全部存货', label: '全部存货' },
  { value: '指定存货分类', label: '指定存货分类' },
  { value: '指定存货', label: '指定存货' },
]

const PRICE_TYPE_OPTIONS = [
  { value: '含税采购价', label: '含税采购价' },
  { value: '未税采购价', label: '未税采购价' },
]

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogMode = ref('create')

const query = reactive({
  scope: '',
  supplierName: '',
  supplierCode: '',
  inventoryName: '',
  inventoryCode: '',
  priceType: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  scope: '指定供应商',
  supplierName: '',
  supplierCode: '',
  supplierCategory: '',
  inventoryScope: '指定存货',
  inventoryCategory: '',
  inventoryName: '',
  spec: '',
  cover: '',
  inventoryCode: '',
  priceType: '含税采购价',
  purchasePrice: 0,
  adjustRatio: 100,
  status: '启用',
  unit: '',
  taxRate: 13,
  enabled: 1,
  remark: '',
})

const formRef = ref(null)
const formRules = {
  scope: [{ required: true, message: '请选择作用范围', trigger: 'change' }],
  priceType: [{ required: true, message: '请选择价格类型', trigger: 'change' }],
  purchasePrice: [{ required: true, message: '请输入采购价格', trigger: 'blur' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? '新增供应商价格' : '编辑供应商价格',
)

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

async function fetchList() {
  loading.value = true
  try {
    const data = await getSupplierPriceList({ ...query })
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
  query.supplierName = ''
  query.supplierCode = ''
  query.inventoryName = ''
  query.inventoryCode = ''
  query.priceType = ''
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function resetForm() {
  form.id = null
  form.scope = '指定供应商'
  form.supplierName = ''
  form.supplierCode = ''
  form.supplierCategory = ''
  form.inventoryScope = '指定存货'
  form.inventoryCategory = ''
  form.inventoryName = ''
  form.spec = ''
  form.cover = ''
  form.inventoryCode = ''
  form.priceType = '含税采购价'
  form.purchasePrice = 0
  form.adjustRatio = 100
  form.status = '启用'
  form.unit = ''
  form.taxRate = 13
  form.enabled = 1
  form.remark = ''
}

function openCreate() {
  dialogMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  dialogMode.value = 'edit'
  Object.assign(form, {
    id: row.id,
    scope: row.scope,
    supplierName: row.supplierName || '',
    supplierCode: row.supplierCode || '',
    supplierCategory: row.supplierCategory || '',
    inventoryScope: row.inventoryScope || '指定存货',
    inventoryCategory: row.inventoryCategory || '',
    inventoryName: row.inventoryName || '',
    spec: row.spec || '',
    cover: row.cover || '',
    inventoryCode: row.inventoryCode || '',
    priceType: row.priceType,
    purchasePrice: row.purchasePrice ?? 0,
    adjustRatio: row.adjustRatio ?? 100,
    status: row.status || (row.enabled === 0 ? '停用' : '启用'),
    unit: row.unit || '',
    taxRate: row.taxRate ?? 13,
    enabled: row.enabled ?? 1,
    remark: row.remark || '',
  })
  dialogVisible.value = true
}

async function submitForm() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const payload = { ...form }
      delete payload.id
      payload.enabled = payload.status === '启用' ? 1 : 0
      if (dialogMode.value === 'create') {
        await createSupplierPrice(payload)
        ElMessage.success('新增成功')
      } else {
        await updateSupplierPrice(form.id, payload)
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
  try {
    await ElMessageBox.confirm('确认删除该价格记录？', '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteSupplierPrice(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && query.page > 1) {
      query.page -= 1
    }
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选记录')
    return
  }
  if (command !== 'delete') return
  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedIds.value.length} 条记录？`,
      '提示',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    )
    await batchDeleteSupplierPrice(selectedIds.value)
    ElMessage.success('批量删除成功')
    fetchList()
  } catch {
    /* cancel */
  }
}

function formatPrice(val) {
  if (val == null || val === '') return '—'
  return Number(val).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })
}

onMounted(fetchList)
</script>

<template>
  <div class="page-root">
    <PageList
      v-model:page="query.page"
      v-model:page-size="query.pageSize"
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
        <el-form-item label="供应商">
          <el-input
            v-model="query.supplierName"
            clearable
            placeholder="供应商名称"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="供应商编码">
          <el-input
            v-model="query.supplierCode"
            clearable
            placeholder="供应商编码"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="存货名称">
          <el-input
            v-model="query.inventoryName"
            clearable
            placeholder="存货名称"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="存货编码">
          <el-input
            v-model="query.inventoryCode"
            clearable
            placeholder="存货编码"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="价格类型">
          <el-select
            v-model="query.priceType"
            clearable
            placeholder="全部"
            style="width: 140px"
          >
            <el-option
              v-for="item in PRICE_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>

      <template #header>
        <div class="sp-toolbar">
          <div class="sp-toolbar__left">
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
                  <el-dropdown-item command="delete">批量删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="sp-toolbar__right">
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
        prop="supplierName"
        label="供应商"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="supplierCode"
        label="供应商编码"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="supplierCategory"
        label="供应商分类"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="inventoryScope"
        label="存货范围"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="inventoryCategory"
        label="存货分类"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="inventoryName"
        label="存货名称"
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
        prop="inventoryCode"
        label="存货编码"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="priceType"
        label="价格类型"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="purchasePrice"
        label="采购价格"
        width="110"
        align="right"
      >
        <template #default="{ row }">
          {{ formatPrice(row.purchasePrice) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="adjustRatio"
        label="调整比例"
        width="100"
        align="right"
      >
        <template #default="{ row }">
          {{ row.adjustRatio != null ? `${row.adjustRatio}%` : '—' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag
            size="small"
            effect="light"
            :type="row.status === '启用' ? 'primary' : 'info'"
          >
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
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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
        <el-form-item label="供应商">
          <el-input v-model="form.supplierName" placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="供应商编码">
          <el-input v-model="form.supplierCode" placeholder="请输入供应商编码" />
        </el-form-item>
        <el-form-item label="供应商分类">
          <el-input
            v-model="form.supplierCategory"
            placeholder="请输入供应商分类"
          />
        </el-form-item>
        <el-form-item label="存货范围">
          <el-select v-model="form.inventoryScope" style="width: 100%">
            <el-option
              v-for="item in INVENTORY_SCOPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="存货分类">
          <el-input
            v-model="form.inventoryCategory"
            placeholder="请输入存货分类"
          />
        </el-form-item>
        <el-form-item label="存货名称">
          <el-input v-model="form.inventoryName" placeholder="请输入存货名称" />
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="form.spec" placeholder="请输入规格" />
        </el-form-item>
        <el-form-item label="存货编码">
          <el-input v-model="form.inventoryCode" placeholder="请输入存货编码" />
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
        <el-form-item label="采购价格" prop="purchasePrice">
          <el-input-number
            v-model="form.purchasePrice"
            :min="0"
            :precision="4"
            :step="0.1"
          />
        </el-form-item>
        <el-form-item label="调整比例(%)">
          <el-input-number
            v-model="form.adjustRatio"
            :min="0"
            :max="9999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="启用" value="启用" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unit" placeholder="如：件、kg、吨" />
        </el-form-item>
        <el-form-item label="税率(%)">
          <el-input-number v-model="form.taxRate" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="2"
            maxlength="200"
            placeholder="请输入备注"
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

.sp-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.sp-toolbar__left,
.sp-toolbar__right {
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

.cover-thumb {
  width: 36px;
  height: 36px;
  border-radius: 8px;
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
