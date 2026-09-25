<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  Download,
  Plus,
  Refresh,
  Search,
  Setting,
  Upload,
} from '@element-plus/icons-vue'
import { getCustomerCategoryList } from '@/api/customerCategory'
import {
  batchDeleteCustomer,
  batchUpdateCustomer,
  createCustomer,
  deleteCustomer,
  getCustomerList,
  updateCustomer,
} from '@/api/customer'
import { PageList } from '@/components/page'

const TYPE_OPTIONS = [
  { value: '企业', label: '企业' },
  { value: '个人', label: '个人' },
]

const SOURCE_OPTIONS = [
  { value: '系统添加', label: '系统添加' },
  { value: '邀请注册', label: '邀请注册' },
]

const WARN_PICKUP_OPTIONS = [
  { value: '', label: '最近未拿货时间' },
  { value: '7', label: '超过7天未拿货' },
  { value: '30', label: '超过30天未拿货' },
  { value: '90', label: '超过90天未拿货' },
]

const loading = ref(false)
const categoryLoading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogMode = ref('create')
const detailRow = ref(null)

const categories = ref([])
/** null = 全部 */
const activeCategoryId = ref(null)

const query = reactive({
  categoryId: '',
  name: '',
  code: '',
  customerType: '',
  sourceType: '',
  filterZeroReceivable: 0,
  warnPickupDays: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  categoryId: null,
  name: '',
  code: '',
  customerType: '企业',
  org: '',
  sourceType: '系统添加',
  email: '',
  enabled: 1,
  openingReceivable: 0,
  openingReceivableBalance: 0,
  receivableAmount: 0,
  contact: '',
  phone: '',
  address: '',
  leaderNum: 0,
  remark: '',
})

const formRef = ref(null)
const formRules = {
  name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入客户编号', trigger: 'blur' }],
  customerType: [{ required: true, message: '请选择客户类型', trigger: 'change' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? '新增客户' : '编辑客户',
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
    const data = await getCustomerList({ ...query })
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
  query.customerType = ''
  query.sourceType = ''
  query.filterZeroReceivable = 0
  query.warnPickupDays = ''
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function resetForm() {
  form.id = null
  form.categoryId = activeCategoryId.value
  form.name = ''
  form.code = ''
  form.customerType = '企业'
  form.org = ''
  form.sourceType = '系统添加'
  form.email = ''
  form.enabled = 1
  form.openingReceivable = 0
  form.openingReceivableBalance = 0
  form.receivableAmount = 0
  form.contact = ''
  form.phone = ''
  form.address = ''
  form.leaderNum = 0
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
    categoryId: row.categoryId,
    name: row.name,
    code: row.code,
    customerType: row.customerType || '企业',
    org: row.org || '',
    sourceType: row.sourceType || '系统添加',
    email: row.email || '',
    enabled: row.enabled,
    openingReceivable: row.openingReceivable ?? 0,
    openingReceivableBalance: row.openingReceivableBalance ?? 0,
    receivableAmount: row.receivableAmount ?? 0,
    contact: row.contact || '',
    phone: row.phone || '',
    address: row.address || '',
    leaderNum: row.leaderNum ?? 0,
    remark: row.remark || '',
  })
  dialogVisible.value = true
}

function openDetail(row) {
  detailRow.value = { ...row }
  detailVisible.value = true
}

async function submitForm() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const payload = {
        categoryId: form.categoryId,
        name: form.name,
        code: form.code,
        customerType: form.customerType,
        org: form.org,
        sourceType: form.sourceType,
        email: form.email,
        enabled: form.enabled,
        openingReceivable: form.openingReceivable,
        openingReceivableBalance: form.openingReceivableBalance,
        receivableAmount: form.receivableAmount,
        contact: form.contact,
        phone: form.phone,
        address: form.address,
        leaderNum: form.leaderNum,
        remark: form.remark,
      }
      if (dialogMode.value === 'create') {
        await createCustomer(payload)
        ElMessage.success('新增成功')
      } else {
        await updateCustomer(form.id, payload)
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
    await updateCustomer(row.id, { enabled: next })
    ElMessage.success(next === 1 ? '已启用' : '已停用')
  } catch {
    row.enabled = prev
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除客户「${row.name}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteCustomer(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && query.page > 1) query.page -= 1
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选客户')
    return
  }
  try {
    if (command === 'enable') {
      await batchUpdateCustomer(selectedIds.value, { enabled: 1 })
      ElMessage.success('批量启用成功')
    } else if (command === 'disable') {
      await batchUpdateCustomer(selectedIds.value, { enabled: 0 })
      ElMessage.success('批量停用成功')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 个客户？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await batchDeleteCustomer(selectedIds.value)
      ElMessage.success('批量删除成功')
    } else if (command === 'ascription') {
      ElMessage.info('批量归属待开发')
      return
    } else if (command === 'category') {
      ElMessage.info('批量修改分类待开发')
      return
    }
    fetchList()
  } catch {
    /* cancel */
  }
}

function handleMoreCommand(command, row) {
  if (command === 'edit') openEdit(row)
  else if (command === 'leader') ElMessage.info(`负责人管理：${row.name} 待开发`)
  else if (command === 'exportBill') ElMessage.info(`导出对账：${row.name} 待开发`)
  else if (command === 'delete') handleDelete(row)
}

function handleImport() {
  ElMessage.info('导入功能待开发')
}

function handleExport() {
  ElMessage.info('导出功能待开发')
}

function handleBelongQuery() {
  ElMessage.info('归属查询待开发')
}

function categoryName(id) {
  if (id == null) return '—'
  return categories.value.find((item) => item.id === id)?.name || '—'
}

onMounted(async () => {
  await fetchCategories()
  fetchList()
})
</script>

<template>
  <div class="page-root">
    <div class="cust-layout">
      <aside v-loading="categoryLoading" class="cust-side">
        <div class="cust-side__list">
          <button
            type="button"
            class="cust-side__item"
            :class="{ 'is-active': activeCategoryId === null }"
            @click="selectCategory(null)"
          >
            <span class="cust-side__name">全部</span>
          </button>
          <button
            v-for="item in categories"
            :key="item.id"
            type="button"
            class="cust-side__item"
            :class="{ 'is-active': item.id === activeCategoryId }"
            @click="selectCategory(item.id)"
          >
            <span class="cust-side__name">{{ item.name }}</span>
          </button>
          <div v-if="!categories.length" class="cust-side__empty">
            暂无分类
          </div>
        </div>
      </aside>

      <div class="cust-main">
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
            <el-form-item label="未拿货">
              <el-select
                v-model="query.warnPickupDays"
                clearable
                placeholder="最近未拿货时间"
                style="width: 170px"
              >
                <el-option
                  v-for="item in WARN_PICKUP_OPTIONS.filter((o) => o.value)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="应收过滤">
              <el-select
                v-model="query.filterZeroReceivable"
                style="width: 160px"
              >
                <el-option label="不过滤0应收" :value="0" />
                <el-option label="过滤0应收" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="客户名称">
              <el-input
                v-model="query.name"
                clearable
                placeholder="请输入客户名称"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="客户编号">
              <el-input
                v-model="query.code"
                clearable
                placeholder="请输入客户编号"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="客户类型">
              <el-select
                v-model="query.customerType"
                clearable
                placeholder="全部"
                style="width: 120px"
              >
                <el-option
                  v-for="item in TYPE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="来源">
              <el-select
                v-model="query.sourceType"
                clearable
                placeholder="全部"
                style="width: 120px"
              >
                <el-option
                  v-for="item in SOURCE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>

          <template #header>
            <div class="cust-toolbar">
              <div class="cust-toolbar__left">
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
                      <el-dropdown-item command="ascription">批量归属</el-dropdown-item>
                      <el-dropdown-item command="category">批量分类</el-dropdown-item>
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
                <el-button type="primary" @click="handleBelongQuery">
                  归属查询
                </el-button>
              </div>
              <div class="cust-toolbar__right">
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
                <el-tooltip content="高级筛选" placement="top">
                  <el-button
                    circle
                    :icon="Search"
                    @click="ElMessage.info('高级筛选待开发')"
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
            label="客户编号"
            min-width="110"
            show-overflow-tooltip
          />
          <el-table-column label="客户分类" min-width="110" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.categoryName || categoryName(row.categoryId) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="leaderNum"
            label="负责人数量"
            width="100"
            align="center"
          />
          <el-table-column
            prop="customerType"
            label="客户类型"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag size="small" type="primary" effect="light">
                {{ row.customerType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="org"
            label="所属组织"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column prop="sourceType" label="来源" width="110" align="center">
            <template #default="{ row }">
              <el-tag
                size="small"
                effect="light"
                :type="row.sourceType === '邀请注册' ? 'success' : 'primary'"
              >
                {{ row.sourceType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            min-width="150"
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
          <el-table-column
            prop="openingReceivable"
            label="期初应收"
            width="100"
            sortable
            align="right"
          />
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <div class="table-actions">
                <el-button link type="primary" @click="openDetail(row)">
                  详情
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
                      <el-dropdown-item command="edit">编辑</el-dropdown-item>
                      <el-dropdown-item command="leader">负责人</el-dropdown-item>
                      <el-dropdown-item command="exportBill">
                        导出对账
                      </el-dropdown-item>
                      <el-dropdown-item command="delete" divided>
                        <span class="danger-text">删除</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </PageList>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="640px"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="110px"
      >
        <el-form-item label="客户分类">
          <el-select
            v-model="form.categoryId"
            clearable
            placeholder="未分类"
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
        <el-form-item label="客户编号" prop="code">
          <el-input
            v-model="form.code"
            maxlength="32"
            placeholder="请输入客户编号"
            :disabled="dialogMode === 'edit'"
          />
        </el-form-item>
        <el-form-item label="客户类型" prop="customerType">
          <el-select v-model="form.customerType" style="width: 100%">
            <el-option
              v-for="item in TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属组织">
          <el-input v-model="form.org" maxlength="40" placeholder="可选" />
        </el-form-item>
        <el-form-item label="来源">
          <el-select v-model="form.sourceType" style="width: 100%">
            <el-option
              v-for="item in SOURCE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" maxlength="80" placeholder="可选" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.contact" maxlength="40" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" maxlength="32" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" maxlength="120" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            :model-value="form.enabled === 1"
            @change="(val) => (form.enabled = val ? 1 : 0)"
          />
        </el-form-item>
        <el-form-item label="期初应收">
          <el-input-number
            v-model="form.openingReceivable"
            :min="0"
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="2"
            maxlength="200"
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

    <el-dialog
      v-model="detailVisible"
      title="客户详情"
      width="640px"
      destroy-on-close
    >
      <el-descriptions v-if="detailRow" :column="2" border>
        <el-descriptions-item label="客户名称">
          {{ detailRow.name }}
        </el-descriptions-item>
        <el-descriptions-item label="客户编号">
          {{ detailRow.code }}
        </el-descriptions-item>
        <el-descriptions-item label="客户分类">
          {{ detailRow.categoryName || categoryName(detailRow.categoryId) }}
        </el-descriptions-item>
        <el-descriptions-item label="负责人数量">
          {{ detailRow.leaderNum }}
        </el-descriptions-item>
        <el-descriptions-item label="客户类型">
          {{ detailRow.customerType }}
        </el-descriptions-item>
        <el-descriptions-item label="所属组织">
          {{ detailRow.org || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="来源">
          {{ detailRow.sourceType }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ detailRow.email || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="联系人">
          {{ detailRow.contact || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ detailRow.phone || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">
          {{ detailRow.address || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="是否启用">
          {{ detailRow.enabled === 1 ? '启用' : '停用' }}
        </el-descriptions-item>
        <el-descriptions-item label="期初应收">
          {{ detailRow.openingReceivable }}
        </el-descriptions-item>
        <el-descriptions-item label="应收金额">
          {{ detailRow.receivableAmount }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ detailRow.createdAt }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">
          {{ detailRow.remark || '—' }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="detailVisible = false">关闭</el-button>
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

.cust-layout {
  display: flex;
  gap: 12px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.cust-side {
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

.cust-side__list {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cust-side__item {
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

.cust-side__item:hover {
  background: var(--soft-fill-hover);
}

.cust-side__item.is-active {
  background: var(--soft-primary-light);
  color: var(--soft-primary);
}

.cust-side__name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.cust-side__empty {
  padding: 24px 8px;
  text-align: center;
  color: var(--soft-text-muted);
  font-size: 13px;
}

.cust-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.cust-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.cust-toolbar__left,
.cust-toolbar__right {
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

.danger-text {
  color: var(--el-color-danger);
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
