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
  Upload,
} from '@element-plus/icons-vue'
import {
  batchDeleteInventoryCategory,
  batchUpdateInventoryCategory,
  createInventoryCategory,
  deleteInventoryCategory,
  getInventoryCategoryList,
  updateInventoryCategory,
} from '@/api/inventoryCategory'
import { PageList } from '@/components/page'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogMode = ref('create')

const query = reactive({
  name: '',
  code: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  pid: 0,
  name: '',
  code: '',
  cover: '',
  enabled: 1,
  isMallShow: 0,
  sort: 0,
  org: '总部',
})

const formRef = ref(null)
const parentOptions = ref([])
const formRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入分类编号', trigger: 'blur' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? '新增分类' : '编辑分类',
)

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

const parentNameMap = computed(() => {
  const map = new Map()
  parentOptions.value.forEach((item) => map.set(item.id, item.name))
  return map
})

function parentLabel(pid) {
  if (!pid) return '—'
  return parentNameMap.value.get(pid) || '—'
}

async function loadParentOptions() {
  const data = await getInventoryCategoryList({ page: 1, pageSize: 500 })
  parentOptions.value = data.list || []
}

async function fetchList() {
  loading.value = true
  try {
    const data = await getInventoryCategoryList({ ...query })
    tableData.value = data.list
    total.value = data.total
    await loadParentOptions()
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
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function resetForm() {
  form.id = null
  form.pid = 0
  form.name = ''
  form.code = ''
  form.cover = ''
  form.enabled = 1
  form.isMallShow = 0
  form.sort = 0
  form.org = '总部'
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
    pid: row.pid || 0,
    name: row.name,
    code: row.code,
    cover: row.cover || '',
    enabled: row.enabled,
    isMallShow: row.isMallShow ?? 0,
    sort: row.sort ?? 0,
    org: row.org || '总部',
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
        pid: form.pid || 0,
        name: form.name,
        code: form.code,
        cover: form.cover,
        enabled: form.enabled,
        isMallShow: form.isMallShow,
        sort: form.sort,
        org: form.org,
      }
      if (dialogMode.value === 'create') {
        await createInventoryCategory(payload)
        ElMessage.success('新增成功')
      } else {
        await updateInventoryCategory(form.id, payload)
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
    await updateInventoryCategory(row.id, { enabled: next })
    ElMessage.success(next === 1 ? '已启用' : '已停用')
  } catch {
    row.enabled = prev
  }
}

async function handleToggleMall(row, value) {
  const next = value ? 1 : 0
  const prev = row.isMallShow
  row.isMallShow = next
  try {
    await updateInventoryCategory(row.id, { isMallShow: next })
    ElMessage.success(next === 1 ? '已开启商城展示' : '已关闭商城展示')
  } catch {
    row.isMallShow = prev
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除分类「${row.name}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteInventoryCategory(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && query.page > 1) query.page -= 1
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选分类')
    return
  }
  try {
    if (command === 'enable') {
      await batchUpdateInventoryCategory(selectedIds.value, { enabled: 1 })
      ElMessage.success('批量启用成功')
    } else if (command === 'disable') {
      await batchUpdateInventoryCategory(selectedIds.value, { enabled: 0 })
      ElMessage.success('批量停用成功')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 个分类？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await batchDeleteInventoryCategory(selectedIds.value)
      ElMessage.success('批量删除成功')
    }
    fetchList()
  } catch {
    /* cancel */
  }
}

function handleImport() {
  ElMessage.info('导入功能待开发')
}

function handleExport() {
  ElMessage.info('导出功能待开发')
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
        <el-form-item label="分类名称">
          <el-input
            v-model="query.name"
            clearable
            placeholder="请输入分类名称"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="分类编号">
          <el-input
            v-model="query.code"
            clearable
            placeholder="请输入分类编号"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
      </template>

      <template #header>
        <div class="inv-toolbar">
          <div class="inv-toolbar__left">
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
          <div class="inv-toolbar__right">
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
        label="分类名称"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column label="上级分类" min-width="120" show-overflow-tooltip>
        <template #default="{ row }">
          {{ parentLabel(row.pid) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        label="分类编号"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column prop="cover" label="分类图片" width="90" align="center">
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
      <el-table-column prop="enabled" label="是否启用" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            :model-value="row.enabled === 1"
            @change="(val) => handleToggleEnabled(row, val)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="isMallShow" label="门户商城显示" width="120" align="center">
        <template #default="{ row }">
          <el-switch
            :model-value="row.isMallShow === 1"
            @change="(val) => handleToggleMall(row, val)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序值" width="100" sortable />
      <el-table-column
        prop="org"
        label="管理组织"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createdAt"
        label="创建时间"
        min-width="170"
        sortable
        show-overflow-tooltip
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
      width="480px"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="96px"
      >
        <el-form-item label="上级分类">
          <el-select
            v-model="form.pid"
            clearable
            filterable
            placeholder="无（顶级）"
            style="width: 100%"
          >
            <el-option label="无（顶级）" :value="0" />
            <el-option
              v-for="item in parentOptions.filter((c) => c.id !== form.id)"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" maxlength="40" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类编号" prop="code">
          <el-input
            v-model="form.code"
            maxlength="32"
            placeholder="请输入分类编号"
            :disabled="dialogMode === 'edit'"
          />
        </el-form-item>
        <el-form-item label="分类图片">
          <el-input v-model="form.cover" placeholder="分类图片 URL（演示）" />
        </el-form-item>
        <el-form-item label="管理组织">
          <el-input v-model="form.org" maxlength="40" />
        </el-form-item>
        <el-form-item label="排序值">
          <el-input-number v-model="form.sort" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            :model-value="form.enabled === 1"
            @change="(val) => (form.enabled = val ? 1 : 0)"
          />
        </el-form-item>
        <el-form-item label="门户商城显示">
          <el-switch
            :model-value="form.isMallShow === 1"
            @change="(val) => (form.isMallShow = val ? 1 : 0)"
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

.inv-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.inv-toolbar__left,
.inv-toolbar__right {
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
