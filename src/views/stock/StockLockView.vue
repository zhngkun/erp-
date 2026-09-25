<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Setting } from '@element-plus/icons-vue'
import { getStockLockList, unlockStock } from '@/api/stock'
import { PageList } from '@/components/page'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const query = reactive({
  materialName: '',
  code: '',
  page: 1,
  pageSize: 10,
})

async function fetchList() {
  loading.value = true
  try {
    const data = await getStockLockList({ ...query })
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
  query.materialName = ''
  query.code = ''
  query.page = 1
  fetchList()
}

async function handleUnlock(row) {
  if (!row.lockNumberTotal) {
    ElMessage.warning('当前无锁定数量')
    return
  }
  try {
    await ElMessageBox.confirm(
      `确认释放「${row.materialName}」的锁定库存？`,
      '提示',
      { type: 'warning', confirmButtonText: '解锁', cancelButtonText: '取消' },
    )
    await unlockStock(row.id)
    ElMessage.success('解锁成功')
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
      search-text="搜索"
      :query="query"
      :loading="loading"
      :data="tableData"
      :total="total"
      @search="handleSearch"
      @reset="handleReset"
      @page-change="fetchList"
      @size-change="fetchList"
    >
      <template #search>
        <el-form-item label="存货名称">
          <el-input
            v-model="query.materialName"
            clearable
            placeholder="请输入存货名称"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="存货编码">
          <el-input
            v-model="query.code"
            clearable
            placeholder="请输入编码"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
      </template>

      <template #header>
        <div class="order-toolbar">
          <div />
          <div class="order-toolbar__right">
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

      <el-table-column
        prop="materialName"
        label="存货名称"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="spec"
        label="规格"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column prop="cover" label="封面" width="80" align="center">
        <template #default>—</template>
      </el-table-column>
      <el-table-column
        prop="code"
        label="编码"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column prop="categoryName" label="分类" width="100" />
      <el-table-column prop="brandName" label="品牌" width="90" />
      <el-table-column
        prop="numberTotal"
        label="库存总量"
        width="100"
        align="right"
      />
      <el-table-column
        prop="available"
        label="可用量"
        width="100"
        align="right"
      />
      <el-table-column
        prop="lockNumberTotal"
        label="锁定数量"
        width="100"
        align="right"
      >
        <template #default="{ row }">
          <span :class="{ 'lock-num': row.lockNumberTotal > 0 }">
            {{ row.lockNumberTotal }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lockRecord"
        label="锁定记录"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button
              link
              type="primary"
              :disabled="!row.lockNumberTotal"
              @click="handleUnlock(row)"
            >
              解锁
            </el-button>
          </div>
        </template>
      </el-table-column>
    </PageList>
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

.order-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.order-toolbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.table-actions {
  display: inline-flex;
  align-items: center;
}

.lock-num {
  color: var(--el-color-warning);
  font-weight: 600;
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
