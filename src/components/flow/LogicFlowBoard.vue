<script setup>
import { nextTick, onActivated, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import LogicFlow from '@logicflow/core'
import '@logicflow/core/es/index.css'
import {
  FLOW_EDGE_TYPE,
  FLOW_NODE_TYPE,
  registerFlowElements,
} from './registerFlowEdge'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  silent: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['node-click'])

const containerRef = ref(null)
let lf = null
let resizeObserver = null

const NODE_WIDTH = 160
const NODE_HEIGHT = 36

const FLOW_THEME = {
  rect: {
    radius: 4,
    fill: '#e8f3ff',
    stroke: '#1677ff',
    strokeWidth: 1.5,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  },
  nodeText: {
    fontSize: 13,
    fontWeight: 500,
    color: '#1677ff',
    overflowMode: 'default',
  },
  polyline: {
    stroke: '#1677ff',
    strokeWidth: 2,
  },
  arrow: {
    offset: 10,
    verticalLength: 5,
    endArrowType: 'solid',
    startArrowType: 'none',
    fill: '#1677ff',
    stroke: '#1677ff',
  },
  outline: {
    stroke: 'transparent',
    hover: {
      stroke: 'transparent',
    },
  },
}

function normalizeGraphData(data) {
  if (!data) return { nodes: [], edges: [] }
  return {
    nodes: (data.nodes || []).map((node) => ({
      ...node,
      type: node.type === 'rect' || !node.type ? FLOW_NODE_TYPE : node.type,
      properties: {
        ...node.properties,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        radius: 4,
      },
    })),
    edges: (data.edges || []).map((edge) => ({
      ...edge,
      type: edge.type || FLOW_EDGE_TYPE,
    })),
  }
}

function fitSize() {
  if (!lf || !containerRef.value) return
  const { clientWidth: w, clientHeight: h } = containerRef.value
  if (w > 0 && h > 0) lf.resize(w, h)
}

function renderGraph(data) {
  if (!lf) return
  lf.render(normalizeGraphData(data))
  nextTick(() => {
    lf.translateCenter()
  })
}

function destroyLogicFlow() {
  resizeObserver?.disconnect()
  resizeObserver = null
  if (lf) {
    try {
      lf.destroy?.()
    } catch {
      /* ignore */
    }
    lf = null
  }
  if (containerRef.value) {
    containerRef.value.innerHTML = ''
  }
}

function initLogicFlow() {
  if (!containerRef.value) return
  destroyLogicFlow()

  const { clientWidth, clientHeight } = containerRef.value
  lf = new LogicFlow({
    container: containerRef.value,
    width: clientWidth || 800,
    height: clientHeight || 500,
    grid: false,
    background: {
      backgroundColor: '#fafcff',
    },
    isSilentMode: props.silent,
    stopZoomGraph: false,
    stopScrollGraph: false,
    stopMoveGraph: false,
    hoverOutline: false,
    nodeSelectedOutline: false,
    edgeSelectedOutline: false,
  })

  registerFlowElements(lf)
  lf.setTheme(FLOW_THEME)
  renderGraph(props.data)

  lf.on('node:click', ({ data }) => {
    emit('node-click', data)
  })

  resizeObserver = new ResizeObserver(() => fitSize())
  resizeObserver.observe(containerRef.value)
}

onMounted(() => {
  nextTick(() => initLogicFlow())
})

onActivated(() => {
  nextTick(() => initLogicFlow())
})

onBeforeUnmount(() => {
  destroyLogicFlow()
})

watch(
  () => props.data,
  (next) => {
    renderGraph(next)
  },
  { deep: true },
)
</script>

<template>
  <div ref="containerRef" class="logicflow-board" />
</template>

<style scoped>
.logicflow-board {
  width: 100%;
  height: 100%;
  min-height: 420px;
  background: #fafcff;
  border-radius: 12px;
}

.logicflow-board :deep(.lf-node-text) {
  cursor: pointer;
}

.logicflow-board :deep(.lf-node-rect) {
  filter: drop-shadow(0 2px 6px rgb(22 119 255 / 0.12));
}

/*
 * 沿箭头方向流动：
 * stroke-dashoffset 往负方向跑 = 虚线从起点流向终点（箭头一侧）
 * 若仍觉得反了，把 to 改成正值即可
 */
.logicflow-board :deep(.erp-flow-dash) {
  animation: erp-flow-dash 8s linear infinite;
}

@keyframes erp-flow-dash {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -220;
  }
}
</style>
