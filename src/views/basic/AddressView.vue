<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Plus, Refresh, Setting } from '@element-plus/icons-vue'
import {
  batchDeleteAddress,
  createAddress,
  deleteAddress,
  getAddressList,
  updateAddress,
} from '@/api/address'
import { PageList } from '@/components/page'

const LEVEL_OPTIONS = [
  { value: 1, label: '省级' },
  { value: 2, label: '市级' },
  { value: 3, label: '区县级' },
  { value: 4, label: '街道/乡镇' },
]

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
  level: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  name: '',
  code: '',
  level: 3,
  sort: 0,
})

const formRef = ref(null)
const formRules = {
  name: [{ required: true, message: '请输入行政地址名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入行政地址编码', trigger: 'blur' }],
  level: [{ required: true, message: '请选择行政等级', trigger: 'change' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? '新增行政地址' : '编辑行政地址',
)

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

async function fetchList() {
  loading.value = true
  try {
    const data = await getAddressList({ ...query })
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
  query.level = ''
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function resetForm() {
  form.id = null
  form.name = ''
  form.code = ''
  form.level = 3
  form.sort = 0
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
    level: row.level,
    sort: row.sort ?? 0,
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
        level: form.level,
        sort: form.sort,
      }
      if (dialogMode.value === 'create') {
        await createAddress(payload)
        ElMessage.success('新增成功')
      } else {
        await updateAddress(form.id, payload)
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
    await ElMessageBox.confirm(`确认删除行政地址「${row.name}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteAddress(row.id)
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
    ElMessage.warning('请先勾选行政地址')
    return
  }
  if (command !== 'delete') return
  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedIds.value.length} 条行政地址？`,
      '提示',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    )
    await batchDeleteAddress(selectedIds.value)
    ElMessage.success('批量删除成功')
    fetchList()
  } catch {
    /* cancel */
  }
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
      <el-form-item label="地址名称">
        <el-input
          v-model="query.name"
          clearable
          placeholder="请输入行政地址名称"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item label="地址编码">
        <el-input
          v-model="query.code"
          clearable
          placeholder="请输入行政地址编码"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item label="行政等级">
        <el-select
          v-model="query.level"
          clearable
          placeholder="全部"
          style="width: 140px"
        >
          <el-option
            v-for="item in LEVEL_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </template>

    <template #header>
      <div class="addr-toolbar">
        <div class="addr-toolbar__left">
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
        <div class="addr-toolbar__right">
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
      label="行政地址名称"
      min-width="160"
      show-overflow-tooltip
    />
    <el-table-column
      prop="code"
      label="行政地址编码"
      min-width="140"
      show-overflow-tooltip
    />
    <el-table-column prop="levelLabel" label="行政等级" width="120" />
    <el-table-column prop="sort" label="排序值" width="100" sortable />
    <el-table-column prop="createdAt" label="创建时间" min-width="170" sortable />
    <el-table-column label="操作" width="140" fixed="right">
      <template #default="{ row }">
        <el-button type="primary" link @click="openEdit(row)">编辑</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
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
      label-width="120px"
    >
      <el-form-item label="行政地址名称" prop="name">
        <el-input v-model="form.name" maxlength="50" placeholder="如：工业园区" />
      </el-form-item>
      <el-form-item label="行政地址编码" prop="code">
        <el-input v-model="form.code" maxlength="32" placeholder="如：320571" />
      </el-form-item>
      <el-form-item label="行政等级" prop="level">
        <el-select v-model="form.level" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in LEVEL_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序值">
        <el-input-number v-model="form.sort" :min="0" :max="9999" />
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

.addr-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.addr-toolbar__left,
.addr-toolbar__right {
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
