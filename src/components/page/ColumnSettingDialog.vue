<script setup>
import { computed, ref, watch } from 'vue'
import { loadColumnVisibility, saveColumnVisibility } from '@/utils/listToolkit'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  storageKey: { type: String, required: true },
  columns: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'change'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const checks = ref({})

const options = computed(() =>
  (props.columns || []).filter((c) => c.prop && c.label),
)

const allChecked = computed(() =>
  options.value.every((c) => checks.value[c.prop] !== false),
)

const indeterminate = computed(() => {
  const some = options.value.some((c) => checks.value[c.prop] !== false)
  return some && !allChecked.value
})

watch(
  () => [props.modelValue, props.storageKey, props.columns],
  () => {
    if (!props.modelValue) return
    checks.value = loadColumnVisibility(props.storageKey, props.columns)
  },
  { immediate: true, deep: true },
)

function handleCheckAll(val) {
  const next = { ...checks.value }
  for (const c of options.value) next[c.prop] = !!val
  checks.value = next
}

function setCheck(prop, val) {
  checks.value = { ...checks.value, [prop]: !!val }
}

function handleSave() {
  saveColumnVisibility(props.storageKey, checks.value)
  emit('change', { ...checks.value })
  visible.value = false
}

function handleReset() {
  const next = Object.fromEntries(options.value.map((c) => [c.prop, true]))
  checks.value = next
  saveColumnVisibility(props.storageKey, next)
  emit('change', { ...next })
}
</script>

<template>
  <el-dialog v-model="visible" title="列设置" width="420px" destroy-on-close>
    <div class="col-setting">
      <el-checkbox
        :model-value="allChecked"
        :indeterminate="indeterminate"
        @change="handleCheckAll"
      >
        全选
      </el-checkbox>
      <el-divider style="margin: 10px 0" />
      <div class="col-setting__list">
        <el-checkbox
          v-for="col in options"
          :key="col.prop"
          :model-value="checks[col.prop] !== false"
          @change="(val) => setCheck(col.prop, val)"
        >
          {{ col.label }}
        </el-checkbox>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleReset">恢复默认</el-button>
      <el-button type="primary" @click="handleSave">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.col-setting__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 360px;
  overflow: auto;
}
</style>
