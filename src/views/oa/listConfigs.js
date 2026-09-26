/** 办公OA列表配置 —— 表头与朋来 P8 对齐 */

export const STATUS_OPTIONS = [
  { value: '已保存', label: '已保存', type: 'info' },
  { value: '待审核', label: '待审核', type: 'warning' },
  { value: '已审核', label: '已审核', type: 'success' },
  { value: '进行中', label: '进行中', type: 'warning' },
  { value: '已完成', label: '已完成', type: 'success' },
  { value: '已终止', label: '已终止', type: 'danger' },
  { value: '审核拒绝', label: '审核拒绝', type: 'danger' },
]

export const URGENCY_OPTIONS = [
  { value: '普通', label: '普通' },
  { value: '紧急', label: '紧急' },
  { value: '特急', label: '特急' },
]

export const REWARD_OPTIONS = [
  { value: '奖励', label: '奖励' },
  { value: '处罚', label: '处罚' },
  { value: '无', label: '无' },
]

export const LIST_CONFIGS = {
  todoBiz: {
    title: '待办业务',
    addLabel: '新增待办业务',
    kind: 'master',
    searchKeys: ['name'],
    dateSearch: false,
    columns: [
      { prop: 'name', label: '待办业务名称', minWidth: 160 },
      { prop: 'count', label: '数量', width: 100 },
      { prop: 'remark', label: '备注', minWidth: 160 },
      { prop: 'createdAt', label: '创建时间', minWidth: 160 },
      { prop: 'priority', label: '排序值', width: 90 },
    ],
    formFields: [
      { key: 'name', label: '待办业务名称', required: true },
      { key: 'count', label: '数量', type: 'number' },
      { key: 'priority', label: '排序值', type: 'number' },
      { key: 'remark', label: '备注', type: 'textarea' },
    ],
  },

  taskProject: {
    title: '任务项目',
    addLabel: '新增任务项目',
    kind: 'master',
    searchKeys: ['name', 'code'],
    dateSearch: false,
    columns: [
      { prop: 'name', label: '名称', minWidth: 160 },
      { prop: 'code', label: '编码', minWidth: 140 },
    ],
    formFields: [
      { key: 'name', label: '名称', required: true },
      { key: 'code', label: '编码', required: true },
      { key: 'remark', label: '备注', type: 'textarea' },
    ],
  },

  task: {
    title: '任务管理',
    addLabel: '新增任务',
    kind: 'bill',
    searchKeys: ['billCode', 'projectName', 'status'],
    dateSearch: true,
    columns: [
      { prop: 'billCode', label: '单据编号', minWidth: 165 },
      { prop: 'billDate', label: '单据日期', minWidth: 120 },
      { prop: 'projectName', label: '任务项目', minWidth: 140 },
      { prop: 'content', label: '任务内容', minWidth: 180 },
      { prop: 'endTime', label: '截止时间', minWidth: 150 },
      { prop: 'operateDeptName', label: '执行部门', minWidth: 120 },
      { prop: 'operateAdminName', label: '执行人', minWidth: 100 },
      { prop: 'status', label: '状态', width: 100, format: 'status' },
      { prop: 'completeTime', label: '完成时间', minWidth: 150 },
      { prop: 'rewardResult', label: '奖罚结果', minWidth: 100 },
      { prop: 'rewardNo', label: '奖罚单号', minWidth: 130 },
      { prop: 'rewardRemark', label: '奖罚备注', minWidth: 120 },
      { prop: 'auditName', label: '审核人', minWidth: 100 },
      { prop: 'createAdminName', label: '创建人', minWidth: 100 },
      { prop: 'createdAt', label: '创建时间', minWidth: 160 },
    ],
    formFields: [
      { key: 'billDate', label: '单据日期', type: 'date', required: true },
      { key: 'projectName', label: '任务项目', required: true },
      { key: 'content', label: '任务内容', required: true, type: 'textarea' },
      { key: 'endTime', label: '截止时间' },
      { key: 'operateDeptName', label: '执行部门' },
      { key: 'operateAdminName', label: '执行人' },
      {
        key: 'rewardResult',
        label: '奖罚结果',
        type: 'select',
        optionsKey: 'reward',
      },
      { key: 'rewardNo', label: '奖罚单号' },
      { key: 'rewardRemark', label: '奖罚备注' },
    ],
    moreActions: [
      { command: 'start', label: '开始任务' },
      { command: 'complete', label: '完成任务' },
      { command: 'end', label: '终止任务' },
      { command: 'reward', label: '任务奖惩' },
    ],
  },

  todoTask: {
    title: '待办任务',
    addLabel: '新增待办任务',
    kind: 'bill',
    searchKeys: ['billCode', 'content', 'status'],
    dateSearch: true,
    columns: [
      { prop: 'billCode', label: '单据编号', minWidth: 165 },
      { prop: 'billDate', label: '单据日期', minWidth: 120 },
      { prop: 'content', label: '任务内容', minWidth: 180 },
      { prop: 'operateDeptName', label: '执行部门', minWidth: 120 },
      { prop: 'operateAdminName', label: '执行人', minWidth: 100 },
      { prop: 'status', label: '状态', width: 100, format: 'status' },
      { prop: 'completeTime', label: '完成时间', minWidth: 150 },
      { prop: 'rewardResult', label: '奖罚结果', minWidth: 100 },
      { prop: 'rewardNo', label: '奖罚单号', minWidth: 130 },
      { prop: 'rewardRemark', label: '奖罚备注', minWidth: 120 },
      { prop: 'createAdminName', label: '创建人', minWidth: 100 },
      { prop: 'createdAt', label: '创建时间', minWidth: 160 },
    ],
    formFields: [
      { key: 'billDate', label: '单据日期', type: 'date', required: true },
      { key: 'content', label: '任务内容', required: true, type: 'textarea' },
      { key: 'operateDeptName', label: '执行部门' },
      { key: 'operateAdminName', label: '执行人' },
    ],
    moreActions: [
      { command: 'start', label: '开始任务' },
      { command: 'complete', label: '完成任务' },
      { command: 'end', label: '终止任务' },
    ],
  },

  message: {
    title: '消息管理',
    addLabel: '新增消息',
    kind: 'master',
    searchKeys: ['title', 'content'],
    dateSearch: false,
    columns: [
      { prop: 'title', label: '标题', minWidth: 160 },
      { prop: 'content', label: '内容', minWidth: 220 },
      { prop: 'urgencyLevel', label: '紧急程度', minWidth: 100 },
      { prop: 'isRead', label: '状态', minWidth: 90 },
      { prop: 'createAdminName', label: '创建人', minWidth: 100 },
      { prop: 'createdAt', label: '创建时间', minWidth: 160 },
    ],
    formFields: [
      { key: 'title', label: '标题', required: true },
      { key: 'content', label: '内容', required: true, type: 'textarea' },
      {
        key: 'urgencyLevel',
        label: '紧急程度',
        type: 'select',
        optionsKey: 'urgency',
      },
      { key: 'isRead', label: '状态' },
    ],
  },

  /** 朋来无独立「资料管理」页，按资料档案字段实现 */
  material: {
    title: '资料管理',
    addLabel: '新增资料',
    kind: 'master',
    searchKeys: ['name', 'code', 'categoryName'],
    dateSearch: false,
    columns: [
      { prop: 'name', label: '资料名称', minWidth: 160 },
      { prop: 'code', label: '资料编码', minWidth: 130 },
      { prop: 'categoryName', label: '分类', minWidth: 120 },
      { prop: 'fileName', label: '附件', minWidth: 140 },
      { prop: 'remark', label: '备注', minWidth: 140 },
      { prop: 'createAdminName', label: '创建人', minWidth: 100 },
      { prop: 'createdAt', label: '创建时间', minWidth: 160 },
    ],
    formFields: [
      { key: 'name', label: '资料名称', required: true },
      { key: 'code', label: '资料编码', required: true },
      { key: 'categoryName', label: '分类' },
      { key: 'fileName', label: '附件' },
      { key: 'remark', label: '备注', type: 'textarea' },
    ],
  },
}
