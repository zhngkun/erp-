<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Picture, Refresh, Setting } from '@element-plus/icons-vue'
import {
  getCustomerFeedbackList,
  updateCustomerFeedback,
} from '@/api/customerFeedback'
import { PageList } from '@/components/page'

const TYPE_OPTIONS = [
  { value: '功能问题', label: '功能问题' },
  { value: '账号问题', label: '账号问题' },
  { value: '操作问题', label: '操作问题' },
  { value: 'Bug反馈', label: 'Bug反馈' },
  { value: '其他', label: '其他' },
]

const STATUS_OPTIONS = [
  { value: '已提交', label: '已提交', type: 'warning' },
  { value: '处理中', label: '处理中', type: 'primary' },
  { value: '已完成', label: '已完成', type: 'success' },
  { value: '已取消', label: '已取消', type: 'info' },
]

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])

const query = reactive({
  customerName: '',
  leaderName: '',
  leaderPhone: '',
  feedbackType: '',
  status: '',
  content: '',
  page: 1,
  pageSize: 10,
})

function statusType(status) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.type || 'info'
}

function canOperate(row) {
  return !['已完成', '已取消'].includes(row.status)
}

async function fetchList() {
  loading.value = true
  try {
    const data = await getCustomerFeedbackList({ ...query })
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
  query.customerName = ''
  query.leaderName = ''
  query.leaderPhone = ''
  query.feedbackType = ''
  query.status = ''
  query.content = ''
  query.page = 1
  query.pageSize = 10
  fetchList()
}

async function handleAccept(row) {
  if (row.status !== '已提交') {
    ElMessage.warning('仅已提交状态可受理')
    return
  }
  try {
    await ElMessageBox.confirm(`确认受理「${row.customerName}」的反馈？`, '提示', {
      type: 'warning',
      confirmButtonText: '受理',
      cancelButtonText: '取消',
    })
    await updateCustomerFeedback(row.id, { status: '处理中' })
    ElMessage.success('已受理')
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleProcess(row) {
  if (row.status !== '处理中') {
    ElMessage.warning('仅处理中状态可完结')
    return
  }
  try {
    const { value } = await ElMessageBox.prompt('请输入处理备注', '处理反馈', {
      confirmButtonText: '完成',
      cancelButtonText: '取消',
      inputPlaceholder: '处理备注',
      inputValidator: (v) => !!String(v || '').trim() || '请填写处理备注',
    })
    await updateCustomerFeedback(row.id, {
      status: '已完成',
      handleRemark: value,
    })
    ElMessage.success('处理完成')
    fetchList()
  } catch {
    /* cancel */
  }
}

function handleMoreCommand(command, row) {
  if (command === 'accept') handleAccept(row)
  else if (command === 'handle') handleProcess(row)
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
      @selection-change="selectedRows = $event"
    >
      <template #search>
        <el-form-item label="客户">
          <el-input
            v-model="query.customerName"
            clearable
            placeholder="请输入客户"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="负责人名称">
          <el-input
            v-model="query.leaderName"
            clearable
            placeholder="请输入负责人"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input
            v-model="query.leaderPhone"
            clearable
            placeholder="请输入联系电话"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="反馈类型">
          <el-select
            v-model="query.feedbackType"
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
        <el-form-item label="反馈状态">
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
        <el-form-item label="反馈内容">
          <el-input
            v-model="query.content"
            clearable
            placeholder="请输入反馈内容"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
      </template>

      <template #header>
        <div class="fb-toolbar">
          <div class="fb-toolbar__left" />
          <div class="fb-toolbar__right">
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
        prop="customerName"
        label="客户"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="leaderName"
        label="负责人名称"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="leaderPhone"
        label="联系电话"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="feedbackType"
        label="反馈类型"
        width="110"
        align="center"
      >
        <template #default="{ row }">
          <el-tag size="small" effect="light" type="primary">
            {{ row.feedbackType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="反馈状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" effect="light" :type="statusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="反馈内容"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column label="图片" width="120" align="center">
        <template #default="{ row }">
          <div v-if="row.imgs?.length" class="img-list">
            <el-image
              v-for="(src, idx) in row.imgs"
              :key="idx"
              :src="src"
              fit="cover"
              class="fb-img"
              :preview-src-list="row.imgs"
              :initial-index="idx"
            />
          </div>
          <el-icon v-else class="fb-img-empty"><Picture /></el-icon>
        </template>
      </el-table-column>
      <el-table-column
        prop="acceptanceTime"
        label="受理时间"
        min-width="170"
        show-overflow-tooltip
      />
      <el-table-column
        prop="handleTime"
        label="处理时间"
        min-width="170"
        show-overflow-tooltip
      />
      <el-table-column
        prop="handleRemark"
        label="处理备注"
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
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <div class="table-actions">
            <el-dropdown
              trigger="click"
              :disabled="!canOperate(row)"
              @command="(cmd) => handleMoreCommand(cmd, row)"
            >
              <el-button link type="primary" :disabled="!canOperate(row)">
                更多
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="row.status === '已提交'"
                    command="accept"
                  >
                    受理
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="row.status === '处理中'"
                    command="handle"
                  >
                    处理
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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

.fb-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}

.fb-toolbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-actions {
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 2px;
  white-space: nowrap;
}

.img-list {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.fb-img {
  width: 32px;
  height: 32px;
  border-radius: 6px;
}

.fb-img-empty {
  font-size: 20px;
  color: var(--soft-text-muted);
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
