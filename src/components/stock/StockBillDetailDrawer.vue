<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: '详情' },
  row: { type: Object, default: null },
  columns: { type: Array, default: () => [] },
  itemFields: { type: Array, default: () => [] },
  fieldLabels: { type: Object, default: () => ({}) },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <el-drawer
    :model-value="modelValue"
    :title="title"
    size="640px"
    destroy-on-close
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <slot />
  </el-drawer>
</template>
