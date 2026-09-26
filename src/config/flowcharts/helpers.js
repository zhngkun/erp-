/**
 * 流程图数据编写辅助（新增模块流程时优先用这些方法）
 */

export const FLOW_EDGE_TYPE = 'flow-edge'
export const FLOW_CURVE_TYPE = 'flow-curve'

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
 * 折线边（同排水平连接）
 * @param {object} opts
 * @param {string} opts.id
 * @param {string} opts.source
 * @param {string} opts.target
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
 * 贝塞尔曲线边（跨行 / 汇聚，可传 pointsList 精确控制路径避免重叠）
 *
 * pointsList: [起点, 控制点1, 控制点2, 终点] 四个点；不传则按锚点自动生成
 *
 * 【约定】从上方节点汇入下方节点时，终点必须落在目标节点【上边】，
 * 多条汇入时用不同水平偏移错开（见 docs/教程/模块流程图开发说明.md）。
 *
 * @param {object} opts
 * @param {string} opts.id
 * @param {string} opts.source
 * @param {string} opts.target
 * @param {Array<{x:number,y:number}>} [opts.pointsList]
 * @param {number} [opts.offset=100] 自动曲线弯曲程度
 * @param {string} [opts.sourceAnchorId] 如 `${sourceId}_1` 右 / `_2` 下 / `_3` 左 / `_0` 上
 * @param {string} [opts.targetAnchorId]
 */
export function flowCurve({
  id,
  source,
  target,
  pointsList,
  offset = 100,
  sourceAnchorId,
  targetAnchorId,
}) {
  const edge = {
    id,
    type: FLOW_CURVE_TYPE,
    sourceNodeId: source,
    targetNodeId: target,
    properties: { offset },
  }
  if (pointsList?.length) edge.pointsList = pointsList
  if (sourceAnchorId) edge.sourceAnchorId = sourceAnchorId
  if (targetAnchorId) edge.targetAnchorId = targetAnchorId
  return edge
}

/**
 * @param {string} title 页面标题，如「采购管理流程」
 * @param {object[]} nodes
 * @param {object[]} edges
 */
export function defineFlowchart(title, nodes, edges = []) {
  return { title, nodes, edges }
}
