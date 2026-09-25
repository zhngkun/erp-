<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  Plus,
  Refresh,
} from '@element-plus/icons-vue'
import {
  batchDeleteDictValue,
  batchUpdateDictValue,
  createDictValue,
  deleteDictValue,
  getDictTypeList,
  getDictValueList,
  updateDictValue,
} from '@/api/dict'
import { PageList } from '@/components/page'

const typeLoading = ref(false)
const loading = ref(false)
const submitting = ref(false)
const dictTypes = ref([])
const activePid = ref(null)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogMode = ref('create')

const query = reactive({
  name: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  pid: null,
  name: '',
  enabled: 1,
  sort: 0,
  remark: '',
})

const formRef = ref(null)
const formRules = {
  name: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? '新增字典值' : '编辑字典值',
)

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

const activeTypeName = computed(() => {
  if (!activePid.value) return ''
  return dictTypes.value.find((t) => t.id === activePid.value)?.name || ''
})

async function fetchTypes() {
  typeLoading.value = true
  try {
    const data = await getDictTypeList()
    dictTypes.value = data.list || []
    if (!activePid.value && dictTypes.value.length) {
      activePid.value = dictTypes.value[0].id
    }
  } finally {
    typeLoading.value = false
  }
}

async function fetchList() {
  if (!activePid.value) {
    tableData.value = []
    total.value = 0
    return
  }
  loading.value = true
  try {
    const data = await getDictValueList({
      ...query,
      pid: activePid.value,
    })
    tableData.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

function selectType(id) {
  if (activePid.value === id) return
  activePid.value = id
  query.page = 1
}

function handleSearch() {
  query.page = 1
  fetchList()
}

function handleReset() {
  query.name = ''
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function resetForm() {
  form.id = null
  form.pid = activePid.value
  form.name = ''
  form.enabled = 1
  form.sort = 0
  form.remark = ''
}

function openCreate() {
  if (!activePid.value) {
    ElMessage.warning('请先选择字典')
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
    pid: row.pid,
    name: row.name,
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
        pid: form.pid,
        name: form.name,
        enabled: form.enabled,
        sort: form.sort,
        remark: form.remark,
      }
      if (dialogMode.value === 'create') {
        await createDictValue(payload)
        ElMessage.success('新增成功')
      } else {
        await updateDictValue(form.id, payload)
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
    await updateDictValue(row.id, { enabled: next })
    ElMessage.success(next === 1 ? '已启用' : '已停用')
  } catch {
    row.enabled = prev
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除字典值「${row.name}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteDictValue(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && query.page > 1) query.page -= 1
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选字典值')
    return
  }
  try {
    if (command === 'enable') {
      await batchUpdateDictValue(selectedIds.value, { enabled: 1 })
      ElMessage.success('批量启用成功')
    } else if (command === 'disable') {
      await batchUpdateDictValue(selectedIds.value, { enabled: 0 })
      ElMessage.success('批量停用成功')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 个字典值？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await batchDeleteDictValue(selectedIds.value)
      ElMessage.success('批量删除成功')
    }
    fetchList()
  } catch {
    /* cancel */
  }
}

watch(activePid, () => {
  query.page = 1
  fetchList()
})

onMounted(async () => {
  await fetchTypes()
  fetchList()
})
</script>

<template>
  <div class="dict-page">
    <aside class="dict-side soft-card" v-loading="typeLoading">
      <div class="dict-side__head">字典</div>
      <ul class="dict-side__list">
        <li
          v-for="item in dictTypes"
          :key="item.id"
          class="dict-side__item"
          :class="{ 'is-active': item.id === activePid }"
          @click="selectType(item.id)"
        >
          {{ item.name }}
        </li>
        <li v-if="!dictTypes.length" class="dict-side__empty">暂无字典</li>
      </ul>
    </aside>

    <div class="dict-main">
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
          <el-form-item label="字典值">
            <el-input
              v-model="query.name"
              clearable
              placeholder="请输入字典值"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
        </template>

        <template #header>
          <div class="inv-toolbar">
            <div class="inv-toolbar__left">
              <span v-if="activeTypeName" class="dict-current">
                当前：{{ activeTypeName }}
              </span>
              <el-button
                type="primary"
                :icon="Plus"
                :disabled="!activePid"
                @click="openCreate"
              >
                新增
              </el-button>
              <el-dropdown trigger="click" @command="handleBatchCommand">
                <el-button type="primary" plain :disabled="!activePid">
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
            </div>
            <div class="inv-toolbar__right">
              <el-tooltip content="刷新" placement="top">
                <el-button circle :icon="Refresh" @click="fetchList" />
              </el-tooltip>
            </div>
          </div>
        </template>

        <el-table-column type="selection" width="48" />
        <el-table-column
          prop="name"
          label="字典值"
          min-width="160"
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
        <el-table-column prop="sort" label="排序值" width="100" sortable />
        <el-table-column
          prop="remark"
          label="备注"
          min-width="140"
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
              <el-button link type="danger" @click="handleDelete(row)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </PageList>
    </div>

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
        <el-form-item label="所属字典">
          <el-input :model-value="activeTypeName" disabled />
        </el-form-item>
        <el-form-item label="字典值" prop="name">
          <el-input v-model="form.name" maxlength="60" placeholder="请输入字典值" />
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
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
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
.dict-page {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 12px;
  overflow: hidden;
}

.soft-card {
  background: var(--soft-surface);
  border-radius: 16px;
  box-shadow: var(--soft-shadow-lg);
}

.dict-side {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  padding: 12px;
}

.dict-side__head {
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--soft-text);
}

.dict-side__list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: auto;
  flex: 1;
}

.dict-side__item {
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--soft-text);
  transition: background 0.15s ease;
}

.dict-side__item:hover {
  background: color-mix(in srgb, var(--soft-primary) 8%, transparent);
}

.dict-side__item.is-active {
  background: color-mix(in srgb, var(--soft-primary) 14%, transparent);
  color: var(--soft-primary);
  font-weight: 600;
}

.dict-side__empty {
  padding: 24px 12px;
  text-align: center;
  color: var(--soft-text-muted);
}

.dict-main {
  min-width: 0;
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

.dict-current {
  color: var(--soft-text-muted);
  font-size: 13px;
  margin-right: 4px;
}

.table-actions {
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 2px;
  white-space: nowrap;
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
