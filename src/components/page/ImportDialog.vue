<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  downloadImportTemplate,
  parseCsvToRows,
  readFileAsText,
} from '@/utils/listToolkit'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  columns: { type: Array, default: () => [] },
  title: { type: String, default: '导入' },
  sampleRow: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const fileList = ref([])
const previewRows = ref([])
const importing = ref(false)

const importColumns = computed(() =>
  (props.columns || []).filter((c) => c.prop && c.label && !c.importSkip),
)

function handleDownloadTemplate() {
  downloadImportTemplate(
    importColumns.value,
    props.title,
    props.sampleRow,
  )
  ElMessage.success('已下载导入模板（CSV，可用 Excel 打开）')
}

async function handleFileChange(uploadFile) {
  const raw = uploadFile?.raw
  if (!raw) return
  try {
    const text = await readFileAsText(raw)
    previewRows.value = parseCsvToRows(text, importColumns.value)
    if (!previewRows.value.length) {
      ElMessage.warning('未解析到有效数据，请检查表头是否与模板一致')
    }
  } catch (e) {
    ElMessage.error(e.message || '解析失败')
    previewRows.value = []
  }
}

function handleRemove() {
  previewRows.value = []
  fileList.value = []
}

async function handleConfirm() {
  if (!previewRows.value.length) {
    ElMessage.warning('请先选择并解析 CSV 文件')
    return
  }
  importing.value = true
  try {
    emit('success', previewRows.value.map((r) => ({ ...r })))
    visible.value = false
    previewRows.value = []
    fileList.value = []
  } finally {
    importing.value = false
  }
}
</script>

<template>
  <el-dialog v-model="visible" :title="`${title} - 导入`" width="640px" destroy-on-close>
    <div class="import-box">
      <el-alert
        type="info"
        :closable="false"
        title="请先下载模板，用 Excel 编辑后另存为 CSV（UTF-8）再上传。"
        style="margin-bottom: 12px"
      />
      <div class="import-actions">
        <el-button type="primary" plain @click="handleDownloadTemplate">
          下载导入模板
        </el-button>
        <el-upload
          :auto-upload="false"
          :limit="1"
          accept=".csv,text/csv"
          v-model:file-list="fileList"
          :on-change="handleFileChange"
          :on-remove="handleRemove"
        >
          <el-button>选择 CSV 文件</el-button>
        </el-upload>
      </div>
      <p v-if="previewRows.length" class="hint">
        已解析 {{ previewRows.length }} 行，确认后写入。
      </p>
      <el-table
        v-if="previewRows.length"
        :data="previewRows.slice(0, 5)"
        border
        size="small"
        max-height="220"
        style="margin-top: 8px"
      >
        <el-table-column
          v-for="col in importColumns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          min-width="100"
          show-overflow-tooltip
        />
      </el-table>
    </div>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        :loading="importing"
        :disabled="!previewRows.length"
        @click="handleConfirm"
      >
        确认导入
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.import-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.hint {
  margin: 10px 0 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>
