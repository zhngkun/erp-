/**
 * 流程图数据编写辅助（新增模块流程时优先用这些方法）
 */

export const FLOW_EDGE_TYPE = 'flow-edge'

/**
 * @param {object} opts
 * @param {string} opts.id
 * @param {string} opts.text 节点文案
 * @param {number} opts.x
 * @param {number} opts.y
 * @param {string|null} [opts.path] 点击跳转路由，无则传 null
 */
export function flowNode({ id, text, x, y, path = null }) {
  return {
    id,
    type: 'rect',
    x,
    y,
    text,
    properties: { path },
  }
}

/**
 * @param {object} opts
 * @param {string} opts.id
 * @param {string} opts.source 起点节点 id
 * @param {string} opts.target 终点节点 id
 */
export function flowEdge({ id, source, target }) {
  return {
    id,
    type: FLOW_EDGE_TYPE,
    sourceNodeId: source,
    targetNodeId: target,
  }
}

/**
 * @param {string} title 页面标题，如「采购管理流程」
 * @param {object[]} nodes
 * @param {object[]} edges
 */
export function defineFlowchart(title, nodes, edges = []) {
  return { title, nodes, edges }
}
