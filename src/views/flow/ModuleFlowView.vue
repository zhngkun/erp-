<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LogicFlowBoard from '@/components/flow/LogicFlowBoard.vue'
import { getFlowchartByModule } from '@/config/flowcharts'

const route = useRoute()
const router = useRouter()

const modulePath = computed(() => {
  const matched = route.matched.find((r) => r.meta?.isModuleRoot)
  return matched?.path || `/${route.path.split('/')[1]}`
})

const flowchart = computed(() => getFlowchartByModule(modulePath.value))

const graphData = computed(() => ({
  nodes: flowchart.value.nodes || [],
  edges: flowchart.value.edges || [],
}))

function onNodeClick(data) {
  const path = data?.properties?.path
  if (path) {
    router.push(path)
  }
}
</script>

<template>
  <div class="module-flow">
    <div class="flow-header">
      <span class="flow-bar" />
      <h2 class="flow-title">{{ flowchart.title }}</h2>
    </div>
    <div class="flow-canvas">
      <LogicFlowBoard :data="graphData" @node-click="onNodeClick" />
    </div>
  </div>
</template>

<style scoped>
.module-flow {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #ffffff 0%, #f5f9ff 100%);
  border-radius: 1rem;
  box-shadow: var(--soft-shadow-lg);
  overflow: hidden;
}

.flow-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 24px 10px;
  flex-shrink: 0;
}

.flow-bar {
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: linear-gradient(180deg, #69b1ff, #1677ff);
}

.flow-title {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: var(--soft-text, #1f2937);
  line-height: 1.2;
  letter-spacing: 0.02em;
}

.flow-canvas {
  flex: 1;
  min-height: 0;
  padding: 4px 16px 16px;
}
</style>
