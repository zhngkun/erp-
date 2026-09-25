<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  Download,
  Plus,
  Refresh,
  Setting,
  Upload,
} from '@element-plus/icons-vue'
import { getWarehouseList } from '@/api/warehouse'
import {
  batchDeleteLocation,
  batchUpdateLocation,
  createLocation,
  deleteLocation,
  getLocationList,
  updateLocation,
} from '@/api/location'
import { PageList } from '@/components/page'

const loading = ref(false)
const warehouseLoading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogMode = ref('create')

const warehouses = ref([])
const warehouseKeyword = ref('')
const activeWarehouseId = ref(null)

const query = reactive({
  warehouseId: '',
  name: '',
  code: '',
  enabled: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  warehouseId: null,
  name: '',
  code: '',
  enabled: 1,
  sort: 0,
  remark: '',
})

const formRef = ref(null)
const formRules = {
  name: [{ required: true, message: '请输入货位名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入货位编码', trigger: 'blur' }],
  warehouseId: [{ required: true, message: '请选择所属仓库', trigger: 'change' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? '新增货位' : '编辑货位',
)

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

const filteredWarehouses = computed(() => {
  const kw = warehouseKeyword.value.trim()
  if (!kw) return warehouses.value
  return warehouses.value.filter(
    (item) => item.name.includes(kw) || item.code.includes(kw),
  )
})

async function fetchWarehouses() {
  warehouseLoading.value = true
  try {
    const data = await getWarehouseList({ page: 1, pageSize: 200, enabled: 1 })
    warehouses.value = data.list || []
    if (!activeWarehouseId.value && warehouses.value.length) {
      selectWarehouse(warehouses.value[0])
    } else if (activeWarehouseId.value) {
      const still = warehouses.value.some(
        (item) => item.id === activeWarehouseId.value,
      )
      if (!still && warehouses.value.length) {
        selectWarehouse(warehouses.value[0])
      }
    }
  } finally {
    warehouseLoading.value = false
  }
}

function selectWarehouse(row) {
  if (!row) return
  activeWarehouseId.value = row.id
  query.warehouseId = row.id
  query.page = 1
  fetchList()
}

async function fetchList() {
  if (!query.warehouseId) {
    tableData.value = []
    total.value = 0
    return
  }
  loading.value = true
  try {
    const data = await getLocationList({ ...query })
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
  query.name = ''
  query.code = ''
  query.enabled = ''
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function resetForm() {
  form.id = null
  form.warehouseId = activeWarehouseId.value
  form.name = ''
  form.code = ''
  form.enabled = 1
  form.sort = 0
  form.remark = ''
}

function openCreate() {
  if (!activeWarehouseId.value) {
    ElMessage.warning('请先选择仓库')
    return
  }
  dialogMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  dialogMode.value = 'edit'
  Object.assign(form, {
    id: row.id,
    warehouseId: row.warehouseId,
    name: row.name,
    code: row.code,
    enabled: row.enabled,
    sort: row.sort ?? 0,
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
      const payload = {
        warehouseId: form.warehouseId,
        name: form.name,
        code: form.code,
        enabled: form.enabled,
        sort: form.sort,
        remark: form.remark,
      }
      if (dialogMode.value === 'create') {
        await createLocation(payload)
        ElMessage.success('新增成功')
      } else {
        await updateLocation(form.id, payload)
        ElMessage.success('更新成功')
      }
      dialogVisible.value = false
      fetchList()
    } finally {
      submitting.value = false
    }
  })
}

async function handleToggleEnabled(row, value) {
  const next = value ? 1 : 0
  const prev = row.enabled
  row.enabled = next
  try {
    await updateLocation(row.id, { enabled: next })
    ElMessage.success(next === 1 ? '已启用' : '已停用')
  } catch {
    row.enabled = prev
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除货位「${row.name}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteLocation(row.id)
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
    ElMessage.warning('请先勾选货位')
    return
  }
  try {
    if (command === 'enable') {
      await batchUpdateLocation(selectedIds.value, { enabled: 1 })
      ElMessage.success('已批量启用')
    } else if (command === 'disable') {
      await batchUpdateLocation(selectedIds.value, { enabled: 0 })
      ElMessage.success('已批量停用')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 个货位？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await batchDeleteLocation(selectedIds.value)
      ElMessage.success('批量删除成功')
    }
    fetchList()
  } catch {
    /* cancel or error */
  }
}

function handleImport() {
  ElMessage.info('导入功能待开发')
}

function handleExport() {
  ElMessage.info('导出功能待开发')
}

onMounted(async () => {
  await fetchWarehouses()
})
</script>

<template>
  <div class="page-root">
  <div class="loc-layout">
    <aside v-loading="warehouseLoading" class="loc-side">
      <el-input
        v-model="warehouseKeyword"
        clearable
        placeholder="输入关键字过滤"
      />
      <div class="loc-side__list">
        <button
          v-for="item in filteredWarehouses"
          :key="item.id"
          type="button"
          class="loc-side__item"
          :class="{ 'is-active': item.id === activeWarehouseId }"
          @click="selectWarehouse(item)"
        >
          <span class="loc-side__name">{{ item.name }}</span>
          <span class="loc-side__code">{{ item.code }}</span>
        </button>
        <div v-if="!filteredWarehouses.length" class="loc-side__empty">
          暂无仓库
        </div>
      </div>
    </aside>

    <div class="loc-main">
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
          <el-form-item label="货位名称">
            <el-input
              v-model="query.name"
              clearable
              placeholder="请输入货位名称"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="货位编码">
            <el-input
              v-model="query.code"
              clearable
              placeholder="请输入货位编码"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="是否启用">
            <el-select
              v-model="query.enabled"
              clearable
              placeholder="全部"
              style="width: 120px"
            >
              <el-option label="启用" :value="1" />
              <el-option label="停用" :value="0" />
            </el-select>
          </el-form-item>
        </template>

        <template #header>
          <div class="loc-toolbar">
            <div class="loc-toolbar__left">
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
                    <el-dropdown-item command="enable">批量启用</el-dropdown-item>
                    <el-dropdown-item command="disable">批量停用</el-dropdown-item>
                    <el-dropdown-item command="delete" divided>
                      批量删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button type="primary" plain :icon="Upload" @click="handleImport">
                导入
              </el-button>
              <el-button type="primary" plain :icon="Download" @click="handleExport">
                导出
              </el-button>
            </div>
            <div class="loc-toolbar__right">
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

        <el-table-column type="selection" width="48" />
        <el-table-column
          prop="name"
          label="货位名称"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="code"
          label="货位编码"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column prop="enabled" label="是否启用" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.enabled === 1"
              @change="(val) => handleToggleEnabled(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序值" width="90" sortable />
        <el-table-column
          prop="remark"
          label="备注"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column prop="createdAt" label="创建时间" min-width="170" sortable />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </PageList>
    </div>
  </div>

  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="520px"
    destroy-on-close
    @closed="resetForm"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="96px"
    >
      <el-form-item label="所属仓库" prop="warehouseId">
        <el-select
          v-model="form.warehouseId"
          placeholder="请选择仓库"
          style="width: 100%"
        >
          <el-option
            v-for="item in warehouses"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="货位名称" prop="name">
        <el-input v-model="form.name" maxlength="50" placeholder="请输入货位名称" />
      </el-form-item>
      <el-form-item label="货位编码" prop="code">
        <el-input v-model="form.code" maxlength="32" placeholder="请输入货位编码" />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch
          v-model="form.enabled"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="排序值">
        <el-input-number v-model="form.sort" :min="0" :max="9999" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
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

.table-actions {
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 2px;
  white-space: nowrap;
}

.loc-layout {
  display: flex;
  gap: 12px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.loc-side {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border-radius: var(--soft-radius-lg);
  background: var(--soft-surface);
  box-shadow: var(--soft-shadow-lg);
  min-height: 0;
}

.loc-side__list {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.loc-side__item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: var(--soft-radius);
  background: transparent;
  color: var(--soft-text);
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.loc-side__item:hover {
  background: var(--soft-fill-hover);
}

.loc-side__item.is-active {
  background: var(--soft-primary-light);
  color: var(--soft-primary);
}

.loc-side__name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.loc-side__code {
  font-size: 12px;
  color: var(--soft-text-muted);
  line-height: 1.3;
}

.loc-side__item.is-active .loc-side__code {
  color: var(--soft-primary);
  opacity: 0.75;
}

.loc-side__empty {
  padding: 24px 8px;
  text-align: center;
  color: var(--soft-text-muted);
  font-size: 13px;
}

.loc-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.loc-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.loc-toolbar__left,
.loc-toolbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
