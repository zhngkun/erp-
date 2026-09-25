<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  Delete,
  Edit,
  Plus,
  Refresh,
} from '@element-plus/icons-vue'
import {
  batchDeleteInventoryUnit,
  batchUpdateInventoryUnit,
  createInventoryUnit,
  createInventoryUnitGroup,
  deleteInventoryUnit,
  deleteInventoryUnitGroup,
  getInventoryUnitGroupList,
  getInventoryUnitList,
  updateInventoryUnit,
  updateInventoryUnitGroup,
} from '@/api/inventoryUnit'
import { PageList } from '@/components/page'

const groupLoading = ref(false)
const loading = ref(false)
const submitting = ref(false)
const groups = ref([])
const activeGroupId = ref(null)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])

const groupDialogVisible = ref(false)
const groupDialogMode = ref('create')
const unitDialogVisible = ref(false)
const unitDialogMode = ref('create')

const query = reactive({
  name: '',
  page: 1,
  pageSize: 10,
})

const groupForm = reactive({
  id: null,
  name: '',
  enabled: 1,
  sort: 0,
})

const unitForm = reactive({
  id: null,
  groupId: null,
  name: '',
  proportion: 1,
  isMain: 0,
  enabled: 1,
  sort: 0,
})

const groupFormRef = ref(null)
const unitFormRef = ref(null)

const groupRules = {
  name: [{ required: true, message: '请输入单位组名称', trigger: 'blur' }],
}

const unitRules = {
  name: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
  proportion: [{ required: true, message: '请输入换算比例', trigger: 'blur' }],
}

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

const groupDialogTitle = computed(() =>
  groupDialogMode.value === 'create' ? '新增单位组' : '编辑单位组',
)

const unitDialogTitle = computed(() =>
  unitDialogMode.value === 'create' ? '新增子单位' : '编辑子单位',
)

async function fetchGroups() {
  groupLoading.value = true
  try {
    const data = await getInventoryUnitGroupList()
    groups.value = data.list || []
    if (!activeGroupId.value && groups.value.length) {
      activeGroupId.value = groups.value[0].id
    } else if (
      activeGroupId.value &&
      !groups.value.some((g) => g.id === activeGroupId.value)
    ) {
      activeGroupId.value = groups.value[0]?.id ?? null
    }
  } finally {
    groupLoading.value = false
  }
}

async function fetchList() {
  if (!activeGroupId.value) {
    tableData.value = []
    total.value = 0
    return
  }
  loading.value = true
  try {
    const data = await getInventoryUnitList({
      ...query,
      groupId: activeGroupId.value,
    })
    tableData.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

function selectGroup(id) {
  if (activeGroupId.value === id) return
  activeGroupId.value = id
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

function openCreateGroup() {
  groupDialogMode.value = 'create'
  groupForm.id = null
  groupForm.name = ''
  groupForm.enabled = 1
  groupForm.sort = 0
  groupDialogVisible.value = true
}

function openEditGroup(group) {
  groupDialogMode.value = 'edit'
  groupForm.id = group.id
  groupForm.name = group.name
  groupForm.enabled = group.enabled
  groupForm.sort = group.sort ?? 0
  groupDialogVisible.value = true
}

async function submitGroup() {
  if (!groupFormRef.value) return
  await groupFormRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const payload = {
        name: groupForm.name,
        enabled: groupForm.enabled,
        sort: groupForm.sort,
      }
      if (groupDialogMode.value === 'create') {
        const row = await createInventoryUnitGroup(payload)
        ElMessage.success('新增成功')
        activeGroupId.value = row.id
      } else {
        await updateInventoryUnitGroup(groupForm.id, payload)
        ElMessage.success('更新成功')
      }
      groupDialogVisible.value = false
      await fetchGroups()
      fetchList()
    } finally {
      submitting.value = false
    }
  })
}

async function handleDeleteGroup(group) {
  try {
    await ElMessageBox.confirm(`确认删除单位组「${group.name}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteInventoryUnitGroup(group.id)
    ElMessage.success('删除成功')
    if (activeGroupId.value === group.id) activeGroupId.value = null
    await fetchGroups()
    fetchList()
  } catch {
    /* cancel */
  }
}

function openCreateUnit() {
  if (!activeGroupId.value) {
    ElMessage.warning('请先选择单位组')
    return
  }
  unitDialogMode.value = 'create'
  unitForm.id = null
  unitForm.groupId = activeGroupId.value
  unitForm.name = ''
  unitForm.proportion = 1
  unitForm.isMain = 0
  unitForm.enabled = 1
  unitForm.sort = 0
  unitDialogVisible.value = true
}

function openEditUnit(row) {
  unitDialogMode.value = 'edit'
  Object.assign(unitForm, {
    id: row.id,
    groupId: row.groupId,
    name: row.name,
    proportion: row.proportion,
    isMain: row.isMain,
    enabled: row.enabled,
    sort: row.sort ?? 0,
  })
  unitDialogVisible.value = true
}

async function submitUnit() {
  if (!unitFormRef.value) return
  await unitFormRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const payload = {
        groupId: unitForm.groupId,
        name: unitForm.name,
        proportion: unitForm.proportion,
        isMain: unitForm.isMain,
        enabled: unitForm.enabled,
        sort: unitForm.sort,
      }
      if (unitDialogMode.value === 'create') {
        await createInventoryUnit(payload)
        ElMessage.success('新增成功')
      } else {
        await updateInventoryUnit(unitForm.id, payload)
        ElMessage.success('更新成功')
      }
      unitDialogVisible.value = false
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
    await updateInventoryUnit(row.id, { enabled: next })
    ElMessage.success(next === 1 ? '已启用' : '已停用')
  } catch {
    row.enabled = prev
  }
}

async function handleDeleteUnit(row) {
  try {
    await ElMessageBox.confirm(`确认删除单位「${row.name}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteInventoryUnit(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && query.page > 1) query.page -= 1
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选单位')
    return
  }
  try {
    if (command === 'enable') {
      await batchUpdateInventoryUnit(selectedIds.value, { enabled: 1 })
      ElMessage.success('批量启用成功')
    } else if (command === 'disable') {
      await batchUpdateInventoryUnit(selectedIds.value, { enabled: 0 })
      ElMessage.success('批量停用成功')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 个单位？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await batchDeleteInventoryUnit(selectedIds.value)
      ElMessage.success('批量删除成功')
    }
    fetchList()
  } catch {
    /* cancel */
  }
}

watch(activeGroupId, () => {
  query.page = 1
  fetchList()
})

onMounted(async () => {
  await fetchGroups()
  fetchList()
})
</script>

<template>
  <div class="unit-page">
    <aside class="unit-side soft-card" v-loading="groupLoading">
      <div class="unit-side__head">
        <span>单位组</span>
        <el-button type="primary" link :icon="Plus" @click="openCreateGroup">
          新增
        </el-button>
      </div>
      <ul class="unit-side__list">
        <li
          v-for="group in groups"
          :key="group.id"
          class="unit-side__item"
          :class="{ 'is-active': group.id === activeGroupId }"
          @click="selectGroup(group.id)"
        >
          <span class="unit-side__name">{{ group.name }}</span>
          <span class="unit-side__ops" @click.stop>
            <el-button link type="primary" :icon="Edit" @click="openEditGroup(group)" />
            <el-button
              link
              type="danger"
              :icon="Delete"
              @click="handleDeleteGroup(group)"
            />
          </span>
        </li>
        <li v-if="!groups.length" class="unit-side__empty">暂无单位组</li>
      </ul>
    </aside>

    <div class="unit-main">
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
          <el-form-item label="单位名称">
            <el-input
              v-model="query.name"
              clearable
              placeholder="请输入单位名称"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
        </template>

        <template #header>
          <div class="inv-toolbar">
            <div class="inv-toolbar__left">
              <el-button type="primary" :icon="Plus" @click="openCreateUnit">
                新增子单位
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
          label="单位名称"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column prop="proportion" label="换算比例" width="110" />
        <el-table-column prop="isMain" label="是否主单位" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isMain === 1 ? 'primary' : 'info'" effect="light">
              {{ row.isMain === 1 ? '是' : '否' }}
            </el-tag>
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
        <el-table-column
          prop="result"
          label="换算结果"
          min-width="160"
          show-overflow-tooltip
        />
        <el-table-column prop="sort" label="排序值" width="100" sortable />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-button link type="primary" @click="openEditUnit(row)">
                编辑
              </el-button>
              <el-button link type="danger" @click="handleDeleteUnit(row)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </PageList>
    </div>

    <el-dialog
      v-model="groupDialogVisible"
      :title="groupDialogTitle"
      width="420px"
      destroy-on-close
    >
      <el-form
        ref="groupFormRef"
        :model="groupForm"
        :rules="groupRules"
        label-width="96px"
      >
        <el-form-item label="单位组名称" prop="name">
          <el-input v-model="groupForm.name" maxlength="40" />
        </el-form-item>
        <el-form-item label="排序值">
          <el-input-number v-model="groupForm.sort" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            :model-value="groupForm.enabled === 1"
            @change="(val) => (groupForm.enabled = val ? 1 : 0)"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="groupDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitGroup">
          确定
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="unitDialogVisible"
      :title="unitDialogTitle"
      width="460px"
      destroy-on-close
    >
      <el-form
        ref="unitFormRef"
        :model="unitForm"
        :rules="unitRules"
        label-width="96px"
      >
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="unitForm.name" maxlength="40" />
        </el-form-item>
        <el-form-item label="换算比例" prop="proportion">
          <el-input-number
            v-model="unitForm.proportion"
            :min="0"
            :step="0.001"
            :precision="6"
          />
        </el-form-item>
        <el-form-item label="是否主单位">
          <el-switch
            :model-value="unitForm.isMain === 1"
            @change="(val) => (unitForm.isMain = val ? 1 : 0)"
          />
        </el-form-item>
        <el-form-item label="排序值">
          <el-input-number v-model="unitForm.sort" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            :model-value="unitForm.enabled === 1"
            @change="(val) => (unitForm.enabled = val ? 1 : 0)"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="unitDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitUnit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.unit-page {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 12px;
  overflow: hidden;
}

.soft-card {
  background: var(--soft-surface);
  border-radius: 16px;
  box-shadow: var(--soft-shadow-lg);
}

.unit-side {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  padding: 12px;
}

.unit-side__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--soft-text);
}

.unit-side__list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: auto;
  flex: 1;
}

.unit-side__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--soft-text);
  transition: background 0.15s ease;
}

.unit-side__item:hover {
  background: color-mix(in srgb, var(--soft-primary) 8%, transparent);
}

.unit-side__item.is-active {
  background: color-mix(in srgb, var(--soft-primary) 14%, transparent);
  color: var(--soft-primary);
  font-weight: 600;
}

.unit-side__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unit-side__ops {
  display: inline-flex;
  opacity: 0.7;
}

.unit-side__empty {
  padding: 24px 12px;
  text-align: center;
  color: var(--soft-text-muted);
}

.unit-main {
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
