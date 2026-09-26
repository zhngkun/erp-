import { menuRoutes } from '@/router/menus'
import { FLOW_EDGE_TYPE } from './helpers'
import { purchaseFlowchart } from './purchase'
import { stockFlowchart } from './stock'

/**
 * 已定制流程图注册表
 * key = 模块根 path（与 menus.js / router 中父级 path 一致）
 * value = defineFlowchart(...) 的返回值
 *
 * 新增模块流程：
 * 1. 新建 src/config/flowcharts/<module>.js
 * 2. 在此对象中登记：'/purchase': purchaseFlowchart
 */
export const customFlowcharts = {
  '/stock': stockFlowchart,
  '/purchase': purchaseFlowchart,
}

/**
 * 从菜单 children 自动生成「从左到右」简易流程（未定制时的兜底）
 * @param {string} modulePath 如 /purchase
 */
export function buildAutoFlowchart(modulePath) {
  const menu = menuRoutes.find((item) => item.path === modulePath)
  const title = `${menu?.meta?.title || '模块'}流程`
  const leaves = []

  function walk(nodes) {
    if (!nodes?.length) return
    for (const node of nodes) {
      if (node.children?.length) {
        walk(node.children)
      } else if (node.path) {
        leaves.push(node)
      }
    }
  }
  walk(menu?.children)

  const gapX = 200
  const gapY = 100
  const cols = Math.min(4, Math.max(1, leaves.length))
  const startX = 140
  const startY = 120

  const nodes = leaves.map((item, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)
    return {
      id: item.name || item.path,
      type: 'rect',
      x: startX + col * gapX,
      y: startY + row * gapY,
      text: item.meta?.title || item.name,
      properties: { path: item.path },
    }
  })

  const edges = []
  for (let i = 0; i < leaves.length - 1; i += 1) {
    const sameRow = Math.floor(i / cols) === Math.floor((i + 1) / cols)
    if (!sameRow) continue
    edges.push({
      id: `auto-e-${i}`,
      type: FLOW_EDGE_TYPE,
      sourceNodeId: nodes[i].id,
      targetNodeId: nodes[i + 1].id,
    })
  }

  return { title, nodes, edges }
}

/**
 * @param {string} modulePath 模块根路径，如 /stock
 */
export function getFlowchartByModule(modulePath) {
  if (customFlowcharts[modulePath]) {
    return customFlowcharts[modulePath]
  }
  return buildAutoFlowchart(modulePath)
}

/** 侧边栏父级菜单对应的概览页路径 */
export function getModuleOverviewPath(modulePath) {
  if (!modulePath || modulePath === '/dashboard') return null
  return `${modulePath}/overview`
}

export { defineFlowchart, flowCurve, flowEdge, flowNode } from './helpers'
