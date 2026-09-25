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
  batchDeleteWarehouse,
  batchUpdateWarehouse,
  createWarehouse,
  deleteWarehouse,
  getWarehouseList,
  updateWarehouse,
} from '@/api/warehouse'
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
  isWaste: '',
  enabled: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  name: '',
  code: '',
  isWaste: 0,
  manager: '',
  phone: '',
  address: '',
  enabled: 1,
  sort: 0,
  remark: '',
})

const formRef = ref(null)
const formRules = {
  name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入仓库编码', trigger: 'blur' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? '新增仓库' : '编辑仓库',
)

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

async function fetchList() {
  loading.value = true
  try {
    const data = await getWarehouseList({ ...query })
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
  query.isWaste = ''
  query.enabled = ''
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function resetForm() {
  form.id = null
  form.name = ''
  form.code = ''
  form.isWaste = 0
  form.manager = ''
  form.phone = ''
  form.address = ''
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
    isWaste: row.isWaste,
    manager: row.manager || '',
    phone: row.phone || '',
    address: row.address || '',
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
        isWaste: form.isWaste,
        manager: form.manager,
        phone: form.phone,
        address: form.address,
        enabled: form.enabled,
        sort: form.sort,
        remark: form.remark,
      }
      if (dialogMode.value === 'create') {
        await createWarehouse(payload)
        ElMessage.success('新增成功')
      } else {
        await updateWarehouse(form.id, payload)
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
    await updateWarehouse(row.id, { enabled: next })
    ElMessage.success(next === 1 ? '已启用' : '已停用')
  } catch {
    row.enabled = prev
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除仓库「${row.name}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteWarehouse(row.id)
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
    ElMessage.warning('请先勾选仓库')
    return
  }
  try {
    if (command === 'enable') {
      await batchUpdateWarehouse(selectedIds.value, { enabled: 1 })
      ElMessage.success('已批量启用')
    } else if (command === 'disable') {
      await batchUpdateWarehouse(selectedIds.value, { enabled: 0 })
      ElMessage.success('已批量停用')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 个仓库？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await batchDeleteWarehouse(selectedIds.value)
      ElMessage.success('批量删除成功')
    }
    fetchList()
  } catch {
    /* cancel or error */
  }
}

function handleMoreCommand(command, row) {
  if (command === 'trend') {
    ElMessage.info(`出库趋势：${row.name}（待开发）`)
  } else if (command === 'warning') {
    ElMessage.info(`库存预警：${row.name}（待开发）`)
  } else if (command === 'delete') {
    handleDelete(row)
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
      <el-form-item label="仓库名称">
        <el-input
          v-model="query.name"
          clearable
          placeholder="请输入仓库名称"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item label="仓库编码">
        <el-input
          v-model="query.code"
          clearable
          placeholder="请输入仓库编码"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item label="废品仓">
        <el-select
          v-model="query.isWaste"
          clearable
          placeholder="全部"
          style="width: 120px"
        >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
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
      <div class="wh-toolbar">
        <div class="wh-toolbar__left">
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
        <div class="wh-toolbar__right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="fetchList" />
          </el-tooltip>
          <el-tooltip content="列设置" placement="top">
            <el-button circle :icon="Setting" @click="ElMessage.info('列设置待开发')" />
          </el-tooltip>
        </div>
      </div>
    </template>

    <el-table-column type="selection" width="48" />
    <el-table-column prop="name" label="仓库名称" min-width="120" show-overflow-tooltip />
    <el-table-column prop="code" label="仓库编码" min-width="120" show-overflow-tooltip />
    <el-table-column prop="isWaste" label="废品仓" width="100" align="center">
      <template #default="{ row }">
        <el-tag size="small" :type="row.isWaste === 1 ? 'warning' : 'primary'" effect="light">
          {{ row.isWaste === 1 ? '是' : '否' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="manager" label="负责人" min-width="100" show-overflow-tooltip />
    <el-table-column prop="phone" label="联系电话" min-width="120" show-overflow-tooltip />
    <el-table-column prop="address" label="地址" min-width="140" show-overflow-tooltip />
    <el-table-column prop="enabled" label="是否启用" width="100" align="center">
      <template #default="{ row }">
        <el-switch
          :model-value="row.enabled === 1"
          @change="(val) => handleToggleEnabled(row, val)"
        />
      </template>
    </el-table-column>
    <el-table-column prop="sort" label="排序值" width="90" sortable />
    <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip />
    <el-table-column prop="createdAt" label="创建时间" min-width="170" sortable />
    <el-table-column label="操作" width="168" fixed="right">
      <template #default="{ row }">
        <el-button type="primary" size="small" @click="openEdit(row)">
          编辑
        </el-button>
        <el-dropdown
          trigger="click"
          @command="(cmd) => handleMoreCommand(cmd, row)"
        >
          <el-button type="success" size="small">
            更多
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="trend">出库趋势</el-dropdown-item>
              <el-dropdown-item command="warning">库存预警</el-dropdown-item>
              <el-dropdown-item command="delete" divided>
                <span class="danger-text">删除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-table-column>
  </PageList>

  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="560px"
    destroy-on-close
    @closed="resetForm"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="96px"
    >
      <el-form-item label="仓库名称" prop="name">
        <el-input v-model="form.name" maxlength="50" placeholder="请输入仓库名称" />
      </el-form-item>
      <el-form-item label="仓库编码" prop="code">
        <el-input v-model="form.code" maxlength="32" placeholder="请输入仓库编码" />
      </el-form-item>
      <el-form-item label="废品仓">
        <el-radio-group v-model="form.isWaste">
          <el-radio :value="0">否</el-radio>
          <el-radio :value="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="负责人">
        <el-input v-model="form.manager" maxlength="30" placeholder="请输入负责人" />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.phone" maxlength="20" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address" maxlength="120" placeholder="请输入地址" />
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
</template>

<style scoped>
.wh-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.wh-toolbar__left,
.wh-toolbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.danger-text {
  color: var(--el-color-danger);
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
