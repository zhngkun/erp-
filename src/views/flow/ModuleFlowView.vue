<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LogicFlowBoard from '@/components/flow/LogicFlowBoard.vue'
import { getModulePageByPath } from '@/config/flowcharts'

const route = useRoute()
const router = useRouter()

const modulePath = computed(() => {
  const matched = route.matched.find((r) => r.meta?.isModuleRoot)
  return matched?.path || `/${route.path.split('/')[1]}`
})

const page = computed(() => getModulePageByPath(modulePath.value))

const graphData = computed(() => ({
  nodes: page.value.nodes || [],
  edges: page.value.edges || [],
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
      <h2 class="flow-title">{{ page.title }}</h2>
    </div>

    <div v-if="page.mode === 'intro'" class="intro-body">
      <article class="intro-card">
        <p v-for="(text, index) in page.paragraphs" :key="index" class="intro-p">
          {{ text }}
        </p>
      </article>
    </div>

    <div v-else class="flow-canvas">
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

.intro-body {
  flex: 1;
  min-height: 0;
  padding: 8px 24px 28px;
  overflow: auto;
}

.intro-card {
  max-width: 760px;
  padding: 28px 32px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(22, 119, 255, 0.08);
  box-shadow: 0 8px 24px rgba(15, 40, 80, 0.06);
}

.intro-p {
  margin: 0 0 1.1em;
  font-size: 15px;
  line-height: 1.85;
  color: #475569;
  text-align: justify;
  letter-spacing: 0.02em;
}

.intro-p:last-child {
  margin-bottom: 0;
}
</style>
