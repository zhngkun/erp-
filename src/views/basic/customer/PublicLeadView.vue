<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  FullScreen,
  Plus,
  Refresh,
  Setting,
} from '@element-plus/icons-vue'
import { getCustomerCategoryList } from '@/api/customerCategory'
import {
  batchAssignPublicLead,
  batchClaimPublicLead,
  batchDeletePublicLead,
  createPublicLead,
  deletePublicLead,
  getPublicLeadList,
  updatePublicLead,
} from '@/api/customerPublicLead'
import { PageList } from '@/components/page'

const loading = ref(false)
const categoryLoading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const assignVisible = ref(false)
const dialogMode = ref('create')
const assignName = ref('')

const categories = ref([])
const activeCategoryId = ref(null)

const query = reactive({
  categoryId: '',
  name: '',
  code: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  categoryId: null,
  name: '',
  code: '',
  email: '',
  fax: '',
  adminAddress: '',
  detailAddress: '',
  remark: '',
  sort: 0,
})

const formRef = ref(null)
const formRules = {
  name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入客户编码', trigger: 'blur' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? '新增公海线索' : '编辑公海线索',
)

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

async function fetchCategories() {
  categoryLoading.value = true
  try {
    const data = await getCustomerCategoryList({
      page: 1,
      pageSize: 200,
      enabled: 1,
    })
    categories.value = data.list || []
  } finally {
    categoryLoading.value = false
  }
}

function selectCategory(id) {
  activeCategoryId.value = id
  query.categoryId = id == null ? '' : id
  query.page = 1
  fetchList()
}

async function fetchList() {
  loading.value = true
  try {
    const data = await getPublicLeadList({ ...query })
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
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function resetForm() {
  form.id = null
  form.categoryId = activeCategoryId.value
  form.name = ''
  form.code = ''
  form.email = ''
  form.fax = ''
  form.adminAddress = ''
  form.detailAddress = ''
  form.remark = ''
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
    categoryId: row.categoryId,
    name: row.name,
    code: row.code,
    email: row.email || '',
    fax: row.fax || '',
    adminAddress: row.adminAddress || '',
    detailAddress: row.detailAddress || '',
    remark: row.remark || '',
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
      const payload = { ...form }
      delete payload.id
      if (dialogMode.value === 'create') {
        await createPublicLead(payload)
        ElMessage.success('新增成功')
      } else {
        await updatePublicLead(form.id, payload)
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
    await ElMessageBox.confirm(`确认删除线索「${row.name}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deletePublicLead(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && query.page > 1) query.page -= 1
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选线索')
    return
  }
  try {
    if (command === 'claim') {
      await ElMessageBox.confirm(
        `确认领取选中的 ${selectedIds.value.length} 条线索？领取后将转入私海。`,
        '提示',
        { type: 'warning', confirmButtonText: '领取', cancelButtonText: '取消' },
      )
      await batchClaimPublicLead(selectedIds.value)
      ElMessage.success('批量领取成功')
      fetchList()
    } else if (command === 'assign') {
      assignName.value = ''
      assignVisible.value = true
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 条线索？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await batchDeletePublicLead(selectedIds.value)
      ElMessage.success('批量删除成功')
      fetchList()
    }
  } catch {
    /* cancel */
  }
}

async function submitAssign() {
  if (!assignName.value.trim()) {
    ElMessage.warning('请输入负责人')
    return
  }
  await batchAssignPublicLead(selectedIds.value, {
    assignee: assignName.value.trim(),
  })
  ElMessage.success('批量分配成功')
  assignVisible.value = false
  fetchList()
}

function handleFullscreen() {
  ElMessage.info('全屏功能待开发')
}

onMounted(async () => {
  await fetchCategories()
  fetchList()
})
</script>

<template>
  <div class="page-root">
    <div class="lead-layout">
      <aside v-loading="categoryLoading" class="lead-side">
        <div class="lead-side__list">
          <button
            type="button"
            class="lead-side__item"
            :class="{ 'is-active': activeCategoryId === null }"
            @click="selectCategory(null)"
          >
            <span class="lead-side__name">全部</span>
          </button>
          <button
            v-for="item in categories"
            :key="item.id"
            type="button"
            class="lead-side__item"
            :class="{ 'is-active': item.id === activeCategoryId }"
            @click="selectCategory(item.id)"
          >
            <span class="lead-side__name">{{ item.name }}</span>
          </button>
        </div>
      </aside>

      <div class="lead-main">
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
            <el-form-item label="客户名称">
              <el-input
                v-model="query.name"
                clearable
                placeholder="请输入客户名称"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="客户编码">
              <el-input
                v-model="query.code"
                clearable
                placeholder="请输入客户编码"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </template>

          <template #header>
            <div class="lead-toolbar">
              <div class="lead-toolbar__left">
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
                      <el-dropdown-item command="claim">批量领取</el-dropdown-item>
                      <el-dropdown-item command="assign">批量分配</el-dropdown-item>
                      <el-dropdown-item command="delete" divided>
                        批量删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div class="lead-toolbar__right">
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
                <el-tooltip content="全屏" placement="top">
                  <el-button
                    circle
                    :icon="FullScreen"
                    @click="handleFullscreen"
                  />
                </el-tooltip>
              </div>
            </div>
          </template>

          <el-table-column type="selection" width="48" />
          <el-table-column
            prop="name"
            label="客户名称"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="code"
            label="客户编码"
            min-width="110"
            show-overflow-tooltip
          />
          <el-table-column
            prop="email"
            label="邮箱"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            prop="fax"
            label="传真"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="adminAddress"
            label="行政地址"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            prop="detailAddress"
            label="详细地址"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            prop="remark"
            label="备注"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column prop="sort" label="排序值" width="90" sortable />
          <el-table-column
            prop="createdAt"
            label="创建时间"
            min-width="170"
            sortable
          />
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <div class="table-actions">
                <el-button link type="primary" @click="openEdit(row)">
                  编辑
                </el-button>
                <el-button link type="danger" @click="handleDelete(row)">
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </PageList>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="96px"
      >
        <el-form-item label="客户分类">
          <el-select
            v-model="form.categoryId"
            clearable
            placeholder="请选择分类"
            style="width: 100%"
          >
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="form.name" maxlength="80" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="客户编码" prop="code">
          <el-input v-model="form.code" maxlength="32" placeholder="请输入客户编码" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" maxlength="80" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="传真">
          <el-input v-model="form.fax" maxlength="40" placeholder="请输入传真" />
        </el-form-item>
        <el-form-item label="行政地址">
          <el-input
            v-model="form.adminAddress"
            maxlength="120"
            placeholder="如：江苏省 / 苏州市 / 工业园区"
          />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input
            v-model="form.detailAddress"
            maxlength="160"
            placeholder="请输入详细地址"
          />
        </el-form-item>
        <el-form-item label="排序值">
          <el-input-number v-model="form.sort" :min="0" :max="9999" />
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

    <el-dialog v-model="assignVisible" title="批量分配" width="420px">
      <el-form label-width="88px">
        <el-form-item label="负责人" required>
          <el-input
            v-model="assignName"
            placeholder="请输入负责人姓名"
            maxlength="30"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAssign">确定</el-button>
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

.lead-layout {
  display: flex;
  gap: 12px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.lead-side {
  width: 180px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: var(--soft-radius-lg);
  background: var(--soft-surface);
  box-shadow: var(--soft-shadow-lg);
  min-height: 0;
}

.lead-side__list {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lead-side__item {
  display: flex;
  align-items: center;
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

.lead-side__item:hover {
  background: var(--soft-fill-hover);
}

.lead-side__item.is-active {
  background: var(--soft-primary-light);
  color: var(--soft-primary);
}

.lead-side__name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.lead-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.lead-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.lead-toolbar__left,
.lead-toolbar__right {
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
