<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { printWithTemplate } from '@/utils/listToolkit'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  title: { type: String, default: '打印' },
  formatCell: { type: Function, default: null },
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const template = ref('list')

const TEMPLATES = [
  { value: 'list', label: '清单模板', tip: '表格清单，适合多行' },
  { value: 'bill', label: '单据模板', tip: '单张单据字段表，适合行打印' },
  { value: 'simple', label: '简洁模板', tip: '同清单，紧凑样式' },
]

function handlePrint() {
  if (!props.rows?.length) {
    ElMessage.warning('没有可打印的数据')
    return
  }
  const tpl = template.value === 'simple' ? 'list' : template.value
  const rows =
    tpl === 'bill' && props.rows.length > 1 ? [props.rows[0]] : props.rows
  if (tpl === 'bill' && props.rows.length > 1) {
    ElMessage.info('单据模板仅打印首行，多行请用清单模板')
  }
  const ok = printWithTemplate(
    props.columns,
    rows,
    props.title,
    tpl,
    props.formatCell || undefined,
  )
  if (!ok) ElMessage.warning('请允许浏览器弹窗以打印')
  else visible.value = false
}
</script>

<template>
  <el-dialog v-model="visible" title="选择打印模板" width="420px" destroy-on-close>
    <el-radio-group v-model="template" class="tpl-list">
      <el-radio
        v-for="item in TEMPLATES"
        :key="item.value"
        :value="item.value"
        border
        class="tpl-item"
      >
        <div>
          <div class="tpl-label">{{ item.label }}</div>
          <div class="tpl-tip">{{ item.tip }}</div>
        </div>
      </el-radio>
    </el-radio-group>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handlePrint">打印</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.tpl-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.tpl-item {
  width: 100%;
  height: auto;
  padding: 10px 12px;
  margin: 0 !important;
}
.tpl-label {
  font-weight: 600;
}
.tpl-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}
</style>
