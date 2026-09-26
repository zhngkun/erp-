<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Plus, Refresh, Setting } from '@element-plus/icons-vue'
import { createSystemApi } from '@/api/system'
import { PageList } from '@/components/page'
import {
  DATA_SCOPE_OPTIONS,
  LIST_CONFIGS,
  ROLE_TYPE_OPTIONS,
  SEX_OPTIONS,
  STATUS_OPTIONS,
} from './listConfigs'

const props = defineProps({
  recordKey: { type: String, required: true },
  extraFilters: { type: Object, default: () => ({}) },
})

const config = computed(() => LIST_CONFIGS[props.recordKey])
const api = computed(() => createSystemApi(props.recordKey))

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogMode = ref('create')

const query = reactive({
  page: 1,
  pageSize: 10,
  dateRange: [],
  name: '',
  code: '',
  userName: '',
  createAdminName: '',
  module: '',
  title: '',
  operateType: '',
  leader: '',
  realName: '',
  phone: '',
  jobNumber: '',
  status: '',
})

const form = reactive({})

const selectedIds = computed(() => selectedRows.value.map((r) => r.id))
const dialogTitle = computed(() => {
  if (config.value.kind === 'profile') return '编辑个人信息'
  return dialogMode.value === 'create'
    ? config.value.addLabel
    : `编辑${config.value.title}`
})

const SELECT_OPTIONS = {
  sex: SEX_OPTIONS,
  roleType: ROLE_TYPE_OPTIONS,
  dataScope: DATA_SCOPE_OPTIONS,
  empStatus: [
    { value: '正常', label: '正常' },
    { value: '离职', label: '离职' },
    { value: '禁用', label: '禁用' },
  ],
}

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
  if (col.format === 'bool') return val ? '是' : '否'
  if (col.format === 'amount') return formatAmount(val)
  if (val == null || val === '') return '—'
  return val
}

function emptyForm() {
  const data = {
    id: null,
    enable: 1,
    priority: 10,
    remark: '',
    status: '正常',
    sex: '男',
    roleType: '自定义角色',
    dataScope: '本部门',
    miniappLogin: 0,
    isDefault: 0,
    isClientShow: 0,
    isInitial: 0,
  }
  for (const f of config.value.formFields || []) {
    if (!(f.key in data)) {
      data[f.key] = f.type === 'number' ? 0 : f.type === 'switch' ? 0 : ''
    }
  }
  return data
}

async function fetchList() {
  loading.value = true
  try {
    const [startDate, endDate] = query.dateRange || []
    const params = {
      status: query.status,
      startDate: startDate || '',
      endDate: endDate || '',
      page: query.page,
      pageSize: query.pageSize,
      ...(config.value.fixedFilters || {}),
      ...(props.extraFilters || {}),
    }
    for (const key of config.value.searchKeys || []) {
      if (key !== 'status') params[key] = query[key] || ''
    }
    const data = await api.value.getList(params)
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
  Object.keys(query).forEach((k) => {
    if (k === 'page') query.page = 1
    else if (k === 'pageSize') query.pageSize = 10
    else if (k === 'dateRange') query.dateRange = []
    else query[k] = ''
  })
  fetchList()
}

function openCreate() {
  if (config.value.kind === 'profile') {
    const row = tableData.value[0]
    if (row) openEdit(row)
    else ElMessage.warning('暂无个人资料')
    return
  }
  dialogMode.value = 'create'
  Object.assign(form, emptyForm())
  dialogVisible.value = true
}

function openEdit(row) {
  dialogMode.value = 'edit'
  Object.assign(form, emptyForm(), { ...row })
  dialogVisible.value = true
}

async function submitForm() {
  for (const f of config.value.formFields || []) {
    if (f.required && (form[f.key] === '' || form[f.key] == null)) {
      ElMessage.warning(`请填写${f.label}`)
      return
    }
  }
  submitting.value = true
  try {
    const payload = { ...form }
    delete payload.id
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
  const label = row.name || row.realName || row.title || row.code || row.id
  try {
    await ElMessageBox.confirm(`确认删除「${label}」？`, '提示', {
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

async function handleEnableChange(row, val) {
  const prev = row.enable
  row.enable = val
  try {
    await api.value.update(row.id, { enable: val })
    ElMessage.success('操作成功')
  } catch {
    row.enable = prev
  }
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选数据')
    return
  }
  if (command !== 'delete') return
  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedIds.value.length} 条？`,
      '提示',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    )
    await api.value.batchDelete(selectedIds.value)
    ElMessage.success('批量删除成功')
    fetchList()
  } catch {
    /* cancel */
  }
}

function handleMoreCommand(command, row) {
  if (command === 'edit') openEdit(row)
  else if (command === 'delete') handleDelete(row)
  else {
    const act = (config.value.moreActions || []).find((a) => a.command === command)
    ElMessage.info(`${act?.label || command}待开发`)
  }
}

function pending(label) {
  ElMessage.info(`${label}待开发`)
}

function searchLabel(key) {
  const map = {
    name: '名称',
    code: '编码',
    userName: '绑定用户',
    createAdminName: '操作人',
    module: '模块',
    title: '标题',
    operateType: '操作类型',
    leader: '负责人',
    realName: '真实姓名',
    phone: '手机号',
    jobNumber: '工号',
    status: '状态',
  }
  return map[key] || key
}

watch(
  () => props.recordKey,
  () => handleReset(),
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
        <el-form-item v-if="config.dateSearch" label="操作时间">
          <el-date-picker
            v-model="query.dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item
          v-for="key in (config.searchKeys || []).filter((k) => k !== 'status')"
          :key="key"
          :label="searchLabel(key)"
        >
          <el-input
            v-model="query[key]"
            clearable
            :placeholder="`请输入${searchLabel(key)}`"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item
          v-if="(config.searchKeys || []).includes('status')"
          label="状态"
        >
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
        <div class="sys-toolbar">
          <div class="sys-toolbar__left">
            <el-button
              v-if="!config.hideAdd"
              type="primary"
              :icon="Plus"
              @click="openCreate"
            >
              {{ config.addLabel }}
            </el-button>
            <el-dropdown
              v-if="config.kind === 'master'"
              trigger="click"
              @command="handleBatchCommand"
            >
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
          <div class="sys-toolbar__right">
            <el-button :icon="Refresh" @click="fetchList">刷新</el-button>
            <el-button :icon="Setting" @click="pending('列设置')">
              列设置
            </el-button>
            <el-button @click="pending('导出')">导出</el-button>
          </div>
        </div>
      </template>

      <el-table-column type="selection" width="48" fixed="left" />
      <el-table-column
        v-for="col in config.columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :min-width="col.minWidth"
        :width="col.width"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-tag
            v-if="col.format === 'status'"
            :type="statusType(row[col.prop] || row.status)"
            effect="light"
            round
          >
            {{ row[col.prop] || row.status || '—' }}
          </el-tag>
          <el-switch
            v-else-if="col.format === 'enable'"
            :model-value="!!row.enable"
            @change="(val) => handleEnableChange(row, val ? 1 : 0)"
          />
          <el-tag
            v-else-if="col.format === 'bool'"
            :type="row[col.prop] ? 'success' : 'info'"
            effect="light"
            round
          >
            {{ cellValue(row, col) }}
          </el-tag>
          <span v-else>{{ cellValue(row, col) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="config.kind !== 'report'"
        label="操作"
        width="180"
        fixed="right"
      >
        <template #default="{ row }">
          <div class="table-actions">
            <el-button link type="primary" @click="openEdit(row)">
              编辑
            </el-button>
            <el-dropdown
              v-if="config.kind === 'master'"
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
                    v-for="act in config.moreActions || []"
                    :key="act.command"
                    :command="act.command"
                  >
                    {{ act.label }}
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button
              v-if="config.kind === 'master'"
              link
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </PageList>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="720px"
      destroy-on-close
      class="soft-dialog"
    >
      <el-form label-width="120px" class="sys-form">
        <el-row :gutter="12">
          <el-col
            v-for="field in config.formFields"
            :key="field.key"
            :span="field.type === 'textarea' ? 24 : 12"
          >
            <el-form-item :label="field.label" :required="field.required">
              <el-date-picker
                v-if="field.type === 'date'"
                v-model="form[field.key]"
                type="date"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
              <el-input-number
                v-else-if="field.type === 'number'"
                v-model="form[field.key]"
                :min="0"
                style="width: 100%"
              />
              <el-switch
                v-else-if="field.type === 'switch'"
                v-model="form[field.key]"
                :active-value="1"
                :inactive-value="0"
              />
              <el-select
                v-else-if="field.type === 'select'"
                v-model="form[field.key]"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="opt in SELECT_OPTIONS[field.optionsKey] || []"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
              <el-input
                v-else-if="field.type === 'textarea'"
                v-model="form[field.key]"
                type="textarea"
                :rows="2"
              />
              <el-input v-else v-model="form[field.key]" clearable />
            </el-form-item>
          </el-col>
        </el-row>
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
.sys-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.sys-toolbar__left,
.sys-toolbar__right {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.table-actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;
}

.sys-form {
  padding-right: 8px;
}
</style>
