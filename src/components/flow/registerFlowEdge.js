import {
  BezierEdge,
  BezierEdgeModel,
  h,
  PolylineEdge,
  PolylineEdgeModel,
  RectNode,
  RectNodeModel,
} from '@logicflow/core'

export const FLOW_EDGE_TYPE = 'flow-edge'
export const FLOW_CURVE_TYPE = 'flow-curve'
export const FLOW_NODE_TYPE = 'flow-rect'

const NODE_W = 160
const NODE_H = 36
const ACCENT_W = 4

const EDGE_STROKE = '#69b1ff'
const EDGE_FLOW = '#1677ff'
const ARROW_SIZE = 8

/** 横向长方形节点（左侧蓝色竖条） */
class FlowRectModel extends RectNodeModel {
  setAttributes() {
    super.setAttributes()
    this.width = NODE_W
    this.height = NODE_H
    this.radius = 4
  }
}

class FlowRectView extends RectNode {
  getShape() {
    const { model } = this.props
    const { x, y, width, height, radius } = model
    const style = model.getNodeStyle()
    const left = x - width / 2
    const top = y - height / 2

    return h('g', { className: 'erp-flow-node' }, [
      h('rect', {
        ...style,
        x: left,
        y: top,
        width,
        height,
        rx: radius,
        ry: radius,
      }),
      h('rect', {
        x: left,
        y: top,
        width: ACCENT_W,
        height,
        fill: '#1677ff',
        stroke: 'none',
        rx: 2,
        ry: 2,
      }),
    ])
  }
}

function applyEdgeArrowStyle(style) {
  style.stroke = EDGE_FLOW
  style.fill = EDGE_FLOW
  style.offset = ARROW_SIZE
  style.verticalLength = 5
  style.endArrowType = 'solid'
  style.startArrowType = 'none'
  return style
}

/**
 * 在终点手动画实心三角箭头（不依赖 SVG marker，虚线边上也能稳定显示）
 * @param {{x:number,y:number}} from 箭头尾部方向参考点
 * @param {{x:number,y:number}} to 箭头尖端（贴目标节点边）
 */
function renderArrowHead(from, to) {
  if (!from || !to) return null
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  // 尖端略收回，避免被目标节点盖住
  const tipX = to.x - ux * 1
  const tipY = to.y - uy * 1
  const baseX = tipX - ux * ARROW_SIZE
  const baseY = tipY - uy * ARROW_SIZE
  const nx = -uy
  const ny = ux
  const half = ARROW_SIZE * 0.45
  const p1 = `${tipX},${tipY}`
  const p2 = `${baseX + nx * half},${baseY + ny * half}`
  const p3 = `${baseX - nx * half},${baseY - ny * half}`
  return h('polygon', {
    points: `${p1} ${p2} ${p3}`,
    fill: EDGE_FLOW,
    stroke: EDGE_FLOW,
    strokeWidth: 1,
    className: 'erp-flow-arrow',
  })
}

function getPolylineArrowPoints(model) {
  const list = (model.points || '')
    .split(' ')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const [x, y] = p.split(',').map(Number)
      return { x, y }
    })
  if (list.length < 2) return null
  return {
    from: list[list.length - 2],
    to: list[list.length - 1],
  }
}

function getBezierArrowPoints(model) {
  const pts = model.pointsList
  if (!pts || pts.length < 2) return null
  // 用终点与其前一个控制点确定切线方向
  const to = pts[pts.length - 1]
  const from = pts[pts.length - 2]
  return { from, to }
}

/** 折线边（同排水平连接用） */
class FlowEdgeModel extends PolylineEdgeModel {
  setAttributes() {
    this.isAnimation = false
    // 禁用 marker，改用手动箭头，避免虚线 + marker 不显示
    this.arrowConfig = {
      markerEnd: '',
      markerStart: '',
    }
  }

  getEdgeStyle() {
    const style = super.getEdgeStyle()
    style.stroke = EDGE_STROKE
    style.strokeWidth = 1.5
    return style
  }

  getArrowStyle() {
    return applyEdgeArrowStyle(super.getArrowStyle())
  }
}

class FlowEdgeView extends PolylineEdge {
  // 覆盖：不再渲染 LF 内置 marker defs 箭头
  getArrow() {
    return null
  }

  getEdge() {
    const { model } = this.props
    const points = model.points
    const arrow = getPolylineArrowPoints(model)

    return h('g', {}, [
      // 实线底（保证路径完整可见）
      h('polyline', {
        points,
        stroke: '#c6e0ff',
        strokeWidth: 1.5,
        fill: 'none',
      }),
      // 流动虚线（不挂 marker）
      h('polyline', {
        points,
        className: 'erp-flow-dash',
        stroke: EDGE_FLOW,
        strokeWidth: 1.5,
        fill: 'none',
        strokeDasharray: '8 6',
        strokeLinecap: 'round',
      }),
      arrow ? renderArrowHead(arrow.from, arrow.to) : null,
    ])
  }
}

/** 贝塞尔曲线边 */
class FlowCurveModel extends BezierEdgeModel {
  setAttributes() {
    this.isAnimation = false
    this.arrowConfig = {
      markerEnd: '',
      markerStart: '',
    }
  }

  getEdgeStyle() {
    const style = super.getEdgeStyle()
    style.stroke = EDGE_STROKE
    style.strokeWidth = 1.5
    return style
  }

  getArrowStyle() {
    return applyEdgeArrowStyle(super.getArrowStyle())
  }
}

class FlowCurveView extends BezierEdge {
  getArrow() {
    return null
  }

  getEdge() {
    const { model } = this.props
    const { path } = model
    const arrow = getBezierArrowPoints(model)

    return h('g', {}, [
      h('path', {
        d: path,
        stroke: '#c6e0ff',
        strokeWidth: 1.5,
        fill: 'none',
      }),
      h('path', {
        d: path,
        className: 'erp-flow-dash',
        stroke: EDGE_FLOW,
        strokeWidth: 1.5,
        fill: 'none',
        strokeDasharray: '8 6',
        strokeLinecap: 'round',
      }),
      arrow ? renderArrowHead(arrow.from, arrow.to) : null,
    ])
  }
}

export function registerFlowElements(lf) {
  lf.register({
    type: FLOW_NODE_TYPE,
    view: FlowRectView,
    model: FlowRectModel,
  })
  lf.register({
    type: FLOW_EDGE_TYPE,
    view: FlowEdgeView,
    model: FlowEdgeModel,
  })
  lf.register({
    type: FLOW_CURVE_TYPE,
    view: FlowCurveView,
    model: FlowCurveModel,
  })
  lf.setDefaultEdgeType(FLOW_EDGE_TYPE)
}
