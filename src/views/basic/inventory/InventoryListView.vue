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
import { getInventoryBrandList } from '@/api/inventoryBrand'
import { getInventoryCategoryList } from '@/api/inventoryCategory'
import {
  batchDeleteInventory,
  batchUpdateInventory,
  createInventory,
  deleteInventory,
  getInventoryList,
  updateInventory,
} from '@/api/inventory'
import { PageList } from '@/components/page'

const TYPE_OPTIONS = [
  { value: 'sale', label: '销售' },
  { value: 'purchase', label: '采购' },
  { value: 'production', label: '生产' },
  { value: 'outsource', label: '委外' },
  { value: 'consumables', label: '耗材' },
  { value: 'stock', label: '库存' },
]

const loading = ref(false)
const categoryLoading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogMode = ref('create')
const categoryTree = ref([])
const categoryFlat = ref([])
const categoryTreeRef = ref(null)
const brands = ref([])
/** null / 0 = 全部 */
const activeCategoryId = ref(0)

const treeProps = {
  children: 'children',
  label: 'name',
}

const query = reactive({
  categoryId: '',
  name: '',
  mnemonicCode: '',
  brandId: '',
  type: '',
  enabled: '',
  remark: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  name: '',
  cover: '',
  mnemonicCode: '',
  categoryId: null,
  categoryName: '',
  brandId: null,
  brandName: '',
  types: [],
  unitName: '个',
  enabled: 1,
  enableSerialNumber: 0,
  enableBatchNumber: 0,
  supplyCycle: 0,
  productionCycle: 0,
  remark: '',
  sort: 0,
  org: '总部',
})

const formRef = ref(null)
const formRules = {
  name: [{ required: true, message: '请输入存货名称', trigger: 'blur' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? '新增存货' : '编辑存货',
)

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

function typeLabels(types = []) {
  return types
    .map((t) => TYPE_OPTIONS.find((o) => o.value === t)?.label || t)
    .join('、')
}

async function fetchCategories() {
  categoryLoading.value = true
  try {
    const data = await getInventoryCategoryList({ asTree: 1 })
    categoryTree.value = [
      { id: 0, name: '全部分类', children: data.list || [] },
    ]
    categoryFlat.value = data.flat || flattenTree(data.list || [])
  } finally {
    categoryLoading.value = false
  }
}

function flattenTree(nodes, acc = []) {
  nodes.forEach((n) => {
    acc.push({ id: n.id, name: n.name, pid: n.pid })
    if (n.children?.length) flattenTree(n.children, acc)
  })
  return acc
}

async function fetchBrands() {
  const data = await getInventoryBrandList({ page: 1, pageSize: 200 })
  brands.value = data.list || []
}

async function fetchList() {
  loading.value = true
  try {
    const data = await getInventoryList({
      ...query,
      categoryId:
        activeCategoryId.value && activeCategoryId.value !== 0
          ? activeCategoryId.value
          : '',
    })
    tableData.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

function selectCategory(id) {
  const next = id === 0 || id == null ? 0 : id
  activeCategoryId.value = next
  query.page = 1
  fetchList()
}

function handleTreeClick(data) {
  selectCategory(data.id)
}

function handleSearch() {
  query.page = 1
  fetchList()
}

function handleReset() {
  query.name = ''
  query.mnemonicCode = ''
  query.brandId = ''
  query.type = ''
  query.enabled = ''
  query.remark = ''
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function resetForm() {
  form.id = null
  form.name = ''
  form.cover = ''
  form.mnemonicCode = ''
  form.categoryId =
    activeCategoryId.value && activeCategoryId.value !== 0
      ? activeCategoryId.value
      : null
  form.categoryName = ''
  form.brandId = null
  form.brandName = ''
  form.types = ['stock']
  form.unitName = '个'
  form.enabled = 1
  form.enableSerialNumber = 0
  form.enableBatchNumber = 0
  form.supplyCycle = 0
  form.productionCycle = 0
  form.remark = ''
  form.sort = 0
  form.org = '总部'
}

function syncCategoryName() {
  form.categoryName =
    categoryFlat.value.find((c) => c.id === form.categoryId)?.name || ''
}

function syncBrandName() {
  form.brandName = brands.value.find((b) => b.id === form.brandId)?.name || ''
}

function openCreate() {
  dialogMode.value = 'create'
  resetForm()
  syncCategoryName()
  dialogVisible.value = true
}

function openEdit(row) {
  dialogMode.value = 'edit'
  Object.assign(form, {
    id: row.id,
    name: row.name,
    cover: row.cover || '',
    mnemonicCode: row.mnemonicCode || '',
    categoryId: row.categoryId,
    categoryName: row.categoryName || '',
    brandId: row.brandId,
    brandName: row.brandName || '',
    types: [...(row.types || [])],
    unitName: row.unitName || '个',
    enabled: row.enabled,
    enableSerialNumber: row.enableSerialNumber ?? 0,
    enableBatchNumber: row.enableBatchNumber ?? 0,
    supplyCycle: row.supplyCycle ?? 0,
    productionCycle: row.productionCycle ?? 0,
    remark: row.remark || '',
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
      syncCategoryName()
      syncBrandName()
      const payload = { ...form }
      delete payload.id
      if (dialogMode.value === 'create') {
        await createInventory(payload)
        ElMessage.success('新增成功')
      } else {
        await updateInventory(form.id, payload)
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
    await updateInventory(row.id, { enabled: next })
    ElMessage.success(next === 1 ? '已启用' : '已停用')
  } catch {
    row.enabled = prev
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除存货「${row.name}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteInventory(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && query.page > 1) query.page -= 1
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选存货')
    return
  }
  try {
    if (command === 'enable') {
      await batchUpdateInventory(selectedIds.value, { enabled: 1 })
      ElMessage.success('批量启用成功')
    } else if (command === 'disable') {
      await batchUpdateInventory(selectedIds.value, { enabled: 0 })
      ElMessage.success('批量停用成功')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 条存货？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await batchDeleteInventory(selectedIds.value)
      ElMessage.success('批量删除成功')
    } else if (command === 'copy') {
      ElMessage.info('批量复制待开发')
      return
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

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchBrands()])
  fetchList()
})
</script>

<template>
  <div class="page-root">
    <div class="inv-layout">
      <aside v-loading="categoryLoading" class="inv-side">
        <el-tree
          ref="categoryTreeRef"
          class="inv-tree"
          :data="categoryTree"
          :props="treeProps"
          node-key="id"
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          :current-node-key="activeCategoryId"
          @node-click="handleTreeClick"
        />
        <div v-if="!categoryFlat.length" class="inv-side__empty">暂无分类</div>
      </aside>

      <div class="inv-main">
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
            <el-form-item label="存货名称">
              <el-input
                v-model="query.name"
                clearable
                placeholder="请输入存货名称"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="助记码">
              <el-input
                v-model="query.mnemonicCode"
                clearable
                placeholder="助记码"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="品牌">
              <el-select
                v-model="query.brandId"
                clearable
                filterable
                placeholder="全部"
                style="width: 140px"
              >
                <el-option
                  v-for="item in brands"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="业务属性">
              <el-select
                v-model="query.type"
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
            <el-form-item label="是否启用">
              <el-select
                v-model="query.enabled"
                clearable
                placeholder="全部"
                style="width: 110px"
              >
                <el-option label="启用" :value="1" />
                <el-option label="停用" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="query.remark"
                clearable
                placeholder="备注"
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
                      <el-dropdown-item command="copy">批量复制</el-dropdown-item>
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
            label="存货名称"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column prop="cover" label="封面" width="72" align="center">
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
          <el-table-column
            prop="mnemonicCode"
            label="助记码"
            min-width="110"
            show-overflow-tooltip
          />
          <el-table-column
            prop="categoryName"
            label="分类"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="brandName"
            label="品牌"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column label="业务属性" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">
              {{ typeLabels(row.types) || '—' }}
            </template>
          </el-table-column>
          <el-table-column prop="unitName" label="单位" width="80" />
          <el-table-column prop="enabled" label="是否启用" width="100" align="center">
            <template #default="{ row }">
              <el-switch
                :model-value="row.enabled === 1"
                @change="(val) => handleToggleEnabled(row, val)"
              />
            </template>
          </el-table-column>
          <el-table-column label="序列号" width="90" align="center">
            <template #default="{ row }">
              <el-tag
                size="small"
                :type="row.enableSerialNumber === 1 ? 'success' : 'info'"
                effect="light"
              >
                {{ row.enableSerialNumber === 1 ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="批次号" width="90" align="center">
            <template #default="{ row }">
              <el-tag
                size="small"
                :type="row.enableBatchNumber === 1 ? 'success' : 'info'"
                effect="light"
              >
                {{ row.enableBatchNumber === 1 ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="supplyCycle" label="供货周期" width="100" />
          <el-table-column prop="productionCycle" label="生产周期" width="100" />
          <el-table-column
            prop="remark"
            label="备注"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column prop="sort" label="排序值" width="90" sortable />
          <el-table-column
            prop="org"
            label="创建组织"
            min-width="110"
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
        label-width="100px"
      >
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="存货名称" prop="name">
              <el-input v-model="form.name" maxlength="80" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="助记码">
              <el-input v-model="form.mnemonicCode" maxlength="40" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类">
              <el-tree-select
                v-model="form.categoryId"
                :data="categoryTree[0]?.children || []"
                :props="treeProps"
                check-strictly
                clearable
                filterable
                placeholder="请选择分类"
                style="width: 100%"
                @change="syncCategoryName"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌">
              <el-select
                v-model="form.brandId"
                clearable
                filterable
                style="width: 100%"
                @change="syncBrandName"
              >
                <el-option
                  v-for="item in brands"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位">
              <el-input v-model="form.unitName" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建组织">
              <el-input v-model="form.org" maxlength="40" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="业务属性">
              <el-select
                v-model="form.types"
                multiple
                collapse-tags
                collapse-tags-tooltip
                style="width: 100%"
              >
                <el-option
                  v-for="item in TYPE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供货周期">
              <el-input-number v-model="form.supplyCycle" :min="0" :step="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产周期">
              <el-input-number v-model="form.productionCycle" :min="0" :step="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用序列号">
              <el-switch
                :model-value="form.enableSerialNumber === 1"
                @change="(val) => (form.enableSerialNumber = val ? 1 : 0)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用批次号">
              <el-switch
                :model-value="form.enableBatchNumber === 1"
                @change="(val) => (form.enableBatchNumber = val ? 1 : 0)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序值">
              <el-input-number v-model="form.sort" :min="0" :step="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-switch
                :model-value="form.enabled === 1"
                @change="(val) => (form.enabled = val ? 1 : 0)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="封面">
              <el-input v-model="form.cover" placeholder="封面 URL（演示）" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" :rows="2" />
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
.page-root {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.inv-layout {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 12px;
  overflow: hidden;
}

.inv-side {
  background: var(--soft-surface);
  border-radius: 16px;
  box-shadow: var(--soft-shadow-lg);
  padding: 10px 8px;
  overflow: auto;
}

.inv-tree {
  background: transparent;
  --el-tree-node-hover-bg-color: color-mix(
    in srgb,
    var(--soft-primary) 10%,
    transparent
  );
}

.inv-tree :deep(.el-tree-node__content) {
  height: 36px;
  border-radius: 10px;
  margin: 1px 0;
}

.inv-tree :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background: color-mix(in srgb, var(--soft-primary) 14%, transparent);
  color: var(--soft-primary);
  font-weight: 600;
}

.inv-side__empty {
  padding: 24px 8px;
  text-align: center;
  color: var(--soft-text-muted);
}

.inv-main {
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
