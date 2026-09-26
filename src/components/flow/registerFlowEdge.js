import { h, PolylineEdge, PolylineEdgeModel, RectNode, RectNodeModel } from '@logicflow/core'

export const FLOW_EDGE_TYPE = 'flow-edge'
export const FLOW_NODE_TYPE = 'flow-rect'

/** 横向长方形节点 */
class FlowRectModel extends RectNodeModel {
  setAttributes() {
    super.setAttributes()
    this.width = 160
    this.height = 36
    this.radius = 4
  }
}

class FlowEdgeModel extends PolylineEdgeModel {
  setAttributes() {
    // 关闭内置 isAnimation，改用自定义 CSS 关键帧（方向可控、必生效）
    this.isAnimation = false
  }

  getEdgeStyle() {
    const style = super.getEdgeStyle()
    style.stroke = '#1677ff'
    style.strokeWidth = 2
    style.strokeDasharray = '12 10'
    return style
  }

  getArrowStyle() {
    const style = super.getArrowStyle()
    style.stroke = '#1677ff'
    style.fill = '#1677ff'
    style.offset = 10
    style.verticalLength = 5
    style.endArrowType = 'solid'
    style.startArrowType = 'none'
    return style
  }
}

/**
 * 自定义边视图：给折线打上 class，用 CSS 驱动「沿箭头」流动
 * stroke-dashoffset 减小（负向）= 沿 path 从起点流向终点（箭头方向）
 */
class FlowEdgeView extends PolylineEdge {
  getEdge() {
    const { model } = this.props
    const style = model.getEdgeStyle()
    const { stroke, strokeWidth, strokeDasharray } = style
    const { markerEnd, markerStart } = model.arrowConfig || {}
    const points = model.points

    return h('g', {}, [
      // 底线
      h('polyline', {
        points,
        stroke: '#c6e0ff',
        strokeWidth: strokeWidth || 2,
        fill: 'none',
      }),
      // 流动虚线 + 终点箭头（marker 挂在这条线上才会显示）
      h('polyline', {
        points,
        className: 'erp-flow-dash',
        stroke: stroke || '#1677ff',
        strokeWidth: strokeWidth || 2,
        fill: 'none',
        strokeDasharray: strokeDasharray || '12 10',
        strokeLinecap: 'round',
        markerEnd,
        markerStart,
      }),
    ])
  }
}

export function registerFlowElements(lf) {
  lf.register({
    type: FLOW_NODE_TYPE,
    view: RectNode,
    model: FlowRectModel,
  })
  lf.register({
    type: FLOW_EDGE_TYPE,
    view: FlowEdgeView,
    model: FlowEdgeModel,
  })
  lf.setDefaultEdgeType(FLOW_EDGE_TYPE)
}
