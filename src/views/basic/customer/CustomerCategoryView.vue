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
import {
  batchDeleteCustomerCategory,
  batchUpdateCustomerCategory,
  createCustomerCategory,
  deleteCustomerCategory,
  getCustomerCategoryList,
  updateCustomerCategory,
} from '@/api/customerCategory'
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
  enabled: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  name: '',
  code: '',
  enabled: 1,
  sort: 0,
  remark: '',
})

const formRef = ref(null)
const formRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入分类编码', trigger: 'blur' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? '新增客户分类' : '编辑客户分类',
)

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

async function fetchList() {
  loading.value = true
  try {
    const data = await getCustomerCategoryList({ ...query })
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
  form.name = ''
  form.code = ''
  form.enabled = 1
  form.sort = 0
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
        name: form.name,
        code: form.code,
        enabled: form.enabled,
        sort: form.sort,
        remark: form.remark,
      }
      if (dialogMode.value === 'create') {
        await createCustomerCategory(payload)
        ElMessage.success('新增成功')
      } else {
        await updateCustomerCategory(form.id, payload)
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
    await updateCustomerCategory(row.id, { enabled: next })
    ElMessage.success(next === 1 ? '已启用' : '已停用')
  } catch {
    row.enabled = prev
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除分类「${row.name}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteCustomerCategory(row.id)
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
    ElMessage.warning('请先勾选分类')
    return
  }
  try {
    if (command === 'enable') {
      await batchUpdateCustomerCategory(selectedIds.value, { enabled: 1 })
      ElMessage.success('已批量启用')
    } else if (command === 'disable') {
      await batchUpdateCustomerCategory(selectedIds.value, { enabled: 0 })
      ElMessage.success('已批量停用')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 个分类？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await batchDeleteCustomerCategory(selectedIds.value)
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
        <el-form-item label="分类名称">
          <el-input
            v-model="query.name"
            clearable
            placeholder="请输入分类名称"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="分类编码">
          <el-input
            v-model="query.code"
            clearable
            placeholder="请输入分类编码"
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
        <div class="cc-toolbar">
          <div class="cc-toolbar__left">
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
          <div class="cc-toolbar__right">
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
      <el-table-column
        prop="code"
        label="分类编码"
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
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="form.name"
            maxlength="50"
            placeholder="请输入分类名称"
          />
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input
            v-model="form.code"
            maxlength="32"
            placeholder="请输入分类编码"
          />
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

.cc-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.cc-toolbar__left,
.cc-toolbar__right {
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
