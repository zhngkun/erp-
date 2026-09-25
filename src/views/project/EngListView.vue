<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Plus, Refresh, Setting } from '@element-plus/icons-vue'
import { createProjectApi } from '@/api/project'
import { PageList } from '@/components/page'
import {
  BOM_TYPE_OPTIONS,
  CHANGE_REASON_OPTIONS,
  CHANGE_TYPE_OPTIONS,
  DRAWING_TYPE_OPTIONS,
  LIST_CONFIGS,
  STATUS_OPTIONS,
} from './listConfigs'

const props = defineProps({
  recordKey: { type: String, required: true },
})

const config = computed(() => LIST_CONFIGS[props.recordKey])
const api = computed(() => createProjectApi(props.recordKey))

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogMode = ref('create')

const query = reactive({
  billCode: '',
  status: '',
  dateRange: [],
  page: 1,
  pageSize: 10,
  name: '',
  code: '',
  materialName: '',
  drawingNumber: '',
  programmingCode: '',
  changeType: '',
  sourceBillCode: '',
  customerMaterialName: '',
})

const form = reactive({})

const selectedIds = computed(() => selectedRows.value.map((r) => r.id))
const dialogTitle = computed(() =>
  dialogMode.value === 'create'
    ? config.value.addLabel
    : `编辑${config.value.title}`,
)

const SELECT_OPTIONS = {
  drawingType: DRAWING_TYPE_OPTIONS,
  bomType: BOM_TYPE_OPTIONS,
  changeType: CHANGE_TYPE_OPTIONS,
  changeReason: CHANGE_REASON_OPTIONS,
}

function statusType(status) {
  return STATUS_OPTIONS.find((i) => i.value === status)?.type || 'info'
}

function cellValue(row, col) {
  const val = row[col.prop]
  if (col.format === 'bool') return val ? '是' : '否'
  if (val == null || val === '') return '—'
  return val
}

function emptyForm() {
  const data = {
    id: null,
    billDate: new Date().toISOString().slice(0, 10),
    remark: '',
    status: '已保存',
    number: 1,
    unitName: '件',
    version: 'V1.0',
    isDefault: 0,
    standardType: props.recordKey === 'orderBom' ? '非标' : props.recordKey === 'stdBom' ? '标准' : '',
    cover: '—',
  }
  for (const f of config.value.formFields || []) {
    if (!(f.key in data)) data[f.key] = f.type === 'number' ? 0 : f.type === 'switch' ? 0 : ''
  }
  return data
}

async function fetchList() {
  loading.value = true
  try {
    const [startDate, endDate] = query.dateRange || []
    const params = {
      billCode: query.billCode,
      status: query.status,
      startDate: startDate || '',
      endDate: endDate || '',
      page: query.page,
      pageSize: query.pageSize,
      ...(config.value.fixedFilters || {}),
    }
    for (const key of config.value.searchKeys || []) {
      if (key !== 'billCode' && key !== 'status') {
        params[key] = query[key] || ''
      }
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
  query.billCode = ''
  query.status = ''
  query.dateRange = []
  query.name = ''
  query.code = ''
  query.materialName = ''
  query.drawingNumber = ''
  query.programmingCode = ''
  query.changeType = ''
  query.sourceBillCode = ''
  query.customerMaterialName = ''
  query.page = 1
  fetchList()
}

function openCreate() {
  dialogMode.value = 'create'
  Object.assign(form, emptyForm())
  dialogVisible.value = true
}

function openEdit(row) {
  if (config.value.kind === 'bill' && !['已保存', '待审核', '审核拒绝'].includes(row.status)) {
    ElMessage.warning('当前状态不可编辑')
    return
  }
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
  const label = row.billCode || row.name || row.materialName || row.code || row.id
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

async function handleAudit(row) {
  if (!['待审核', '已保存'].includes(row.status)) {
    ElMessage.warning('当前状态不可审核')
    return
  }
  try {
    await ElMessageBox.confirm(`确认审核通过？`, '提示', {
      type: 'warning',
      confirmButtonText: '审核',
      cancelButtonText: '取消',
    })
    await api.value.update(row.id, {
      status: '已审核',
      verifyData: `管理员 / ${new Date().toLocaleString('zh-CN')}`,
      auditName: '管理员',
    })
    ElMessage.success('审核成功')
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleAbandon(row) {
  if (row.status !== '已审核') {
    ElMessage.warning('仅已审核可弃审')
    return
  }
  try {
    await ElMessageBox.confirm(`确认弃审？`, '提示', {
      type: 'warning',
      confirmButtonText: '弃审',
      cancelButtonText: '取消',
    })
    await api.value.update(row.id, {
      status: '待审核',
      verifyData: '',
      auditName: '',
    })
    ElMessage.success('弃审成功')
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选数据')
    return
  }
  try {
    if (command === 'audit') {
      await api.value.batchUpdate(selectedIds.value, {
        status: '已审核',
        verifyData: `管理员 / ${new Date().toLocaleString('zh-CN')}`,
        auditName: '管理员',
      })
      ElMessage.success('批量审核成功')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 条？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await api.value.batchDelete(selectedIds.value)
      ElMessage.success('批量删除成功')
    }
    fetchList()
  } catch {
    /* cancel */
  }
}

function handleMoreCommand(command, row) {
  if (command === 'edit') openEdit(row)
  else if (command === 'audit') handleAudit(row)
  else if (command === 'abandon') handleAbandon(row)
  else if (command === 'delete') handleDelete(row)
  else if (command === 'copy') ElMessage.info('复制待开发')
  else if (command === 'print') ElMessage.info('打印待开发')
  else if (command === 'export') ElMessage.info('导出待开发')
  else ElMessage.info(`${command}待开发`)
}

function pending(label) {
  ElMessage.info(`${label}待开发`)
}

function searchLabel(key) {
  const map = {
    billCode: '单据编号',
    materialName: '物料名称',
    name: '名称',
    code: '编码',
    drawingNumber: '图号',
    programmingCode: '程序编号',
    changeType: '变更类型',
    sourceBillCode: '来源单据',
    customerMaterialName: '客品名称',
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
        <el-form-item v-if="config.dateSearch" label="单据日期">
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
        <div class="eng-toolbar">
          <div class="eng-toolbar__left">
            <el-button type="primary" :icon="Plus" @click="openCreate">
              {{ config.addLabel }}
            </el-button>
            <el-dropdown trigger="click" @command="handleBatchCommand">
              <el-button type="primary" plain>
                批量
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="config.kind === 'bill'"
                    command="audit"
                  >
                    批量审核
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    批量删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="eng-toolbar__right">
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
            :type="statusType(row.status)"
            effect="light"
            round
          >
            {{ row.status || '—' }}
          </el-tag>
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
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button link type="primary" @click="openEdit(row)">
              编辑
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
                  <el-dropdown-item
                    v-if="config.kind === 'bill'"
                    command="audit"
                  >
                    审核
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="config.kind === 'bill'"
                    command="abandon"
                  >
                    弃审
                  </el-dropdown-item>
                  <el-dropdown-item command="copy">复制</el-dropdown-item>
                  <el-dropdown-item command="print">打印</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button link type="danger" @click="handleDelete(row)">
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
      <el-form label-width="110px" class="eng-form">
        <el-row :gutter="12">
          <el-col
            v-for="field in config.formFields"
            :key="field.key"
            :span="field.type === 'textarea' ? 24 : 12"
          >
            <el-form-item
              :label="field.label"
              :required="field.required"
            >
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
.eng-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.eng-toolbar__left,
.eng-toolbar__right {
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

.eng-form {
  padding-right: 8px;
}
</style>
