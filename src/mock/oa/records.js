import { createBillMockStore, todayStr } from '../stock/_helpers'

function base(partial = {}) {
  return {
    billDate: todayStr(),
    status: '待审核',
    createAdminName: '张伟',
    createdAt: `${todayStr()} 10:20:00`,
    remark: '',
    auditName: '',
    priority: 10,
    ...partial,
  }
}

function filterBy(keys) {
  return (rows, p) => {
    let next = rows
    for (const key of keys) {
      if (p[key] !== undefined && p[key] !== null && p[key] !== '') {
        next = next.filter((r) =>
          String(r[key] ?? '').includes(String(p[key]).trim()),
        )
      }
    }
    return next
  }
}

export const oaStores = {
  todoBiz: createBillMockStore({
    prefix: 'TB',
    seedList: [
      base({
        id: 1,
        billCode: 'TB-001',
        name: '采购订单待审',
        count: 12,
        remark: '含加急单',
        status: '已审核',
      }),
      base({
        id: 2,
        billCode: 'TB-002',
        name: '销售出库待办',
        count: 5,
        remark: '',
        priority: 20,
        status: '待审核',
      }),
    ],
    filterFn: filterBy(['name']),
  }),

  taskProject: createBillMockStore({
    prefix: 'TP',
    seedList: [
      base({ id: 1, billCode: 'TP-001', name: '数字化升级', code: 'DIGI-01', status: '已审核' }),
      base({ id: 2, billCode: 'TP-002', name: '精益改善', code: 'LEAN-01', status: '已审核' }),
    ],
    filterFn: filterBy(['name', 'code']),
  }),

  task: createBillMockStore({
    prefix: 'TK',
    seedList: [
      base({
        id: 1,
        billCode: 'TK-20260925001',
        projectName: '数字化升级',
        content: '完成MES看板一期联调',
        endTime: '2026-09-30 18:00',
        operateDeptName: '信息部',
        operateAdminName: '李工',
        status: '进行中',
        completeTime: '',
        rewardResult: '无',
        rewardNo: '',
        rewardRemark: '',
      }),
      base({
        id: 2,
        billCode: 'TK-20260910002',
        billDate: '2026-09-10',
        projectName: '精益改善',
        content: '装配线节拍优化方案',
        endTime: '2026-09-20 18:00',
        operateDeptName: '生产部',
        operateAdminName: '王芳',
        status: '已完成',
        completeTime: '2026-09-18 16:30',
        rewardResult: '奖励',
        rewardNo: 'RW-20260918001',
        rewardRemark: '提前完成',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['projectName', 'content', 'operateAdminName']),
  }),

  todoTask: createBillMockStore({
    prefix: 'MT',
    seedList: [
      base({
        id: 1,
        billCode: 'MT-20260925001',
        content: '审核本周巡检报告',
        operateDeptName: '质量部',
        operateAdminName: '当前用户',
        status: '进行中',
        completeTime: '',
        rewardResult: '无',
        rewardNo: '',
        rewardRemark: '',
      }),
      base({
        id: 2,
        billCode: 'MT-20260912002',
        billDate: '2026-09-12',
        content: '提交设备点检记录',
        operateDeptName: '设备部',
        operateAdminName: '当前用户',
        status: '已完成',
        completeTime: '2026-09-13 11:00',
        rewardResult: '无',
        rewardNo: '',
        rewardRemark: '',
      }),
    ],
    filterFn: filterBy(['content', 'operateAdminName']),
  }),

  message: createBillMockStore({
    prefix: 'MSG',
    seedList: [
      base({
        id: 1,
        billCode: 'MSG-001',
        title: '系统维护通知',
        content: '本周六 22:00-24:00 进行系统升级维护',
        urgencyLevel: '紧急',
        isRead: '未读',
        status: '已审核',
        messageScope: 'system',
        direction: 'received',
        receiveAdminName: '',
        receiveDeptName: '',
      }),
      base({
        id: 2,
        billCode: 'MSG-002',
        title: '版本发布公告',
        content: 'P8 v2.6 已上线，请关注变更说明',
        urgencyLevel: '普通',
        isRead: '已读',
        status: '已审核',
        messageScope: 'system',
        direction: 'sent',
        receiveAdminName: '',
        receiveDeptName: '',
        createAdminName: '系统管理员',
      }),
      base({
        id: 3,
        billCode: 'MSG-003',
        title: '月度会议提醒',
        content: '请各部门周五前提交月报',
        urgencyLevel: '普通',
        isRead: '未读',
        status: '已审核',
        messageScope: 'personal',
        direction: 'received',
        receiveAdminName: '当前用户',
        receiveDeptName: '销售部',
        createAdminName: '王经理',
      }),
      base({
        id: 4,
        billCode: 'MSG-004',
        title: '请假审批结果',
        content: '您的请假申请已通过',
        urgencyLevel: '普通',
        isRead: '已读',
        status: '已审核',
        messageScope: 'personal',
        direction: 'sent',
        receiveAdminName: '李工',
        receiveDeptName: '工程部',
        createAdminName: '当前用户',
      }),
      base({
        id: 5,
        billCode: 'MSG-005',
        title: '图纸评审邀请',
        content: '请于明日参加主轴箱体图纸评审',
        urgencyLevel: '紧急',
        isRead: '未读',
        status: '已审核',
        messageScope: 'personal',
        direction: 'received',
        receiveAdminName: '当前用户',
        receiveDeptName: '工程部',
        createAdminName: '赵审',
      }),
    ],
    filterFn: (rows, p) => {
      let next = filterBy(['title', 'content', 'urgencyLevel'])(rows, p)
      if (p.messageScope) {
        next = next.filter((r) => r.messageScope === p.messageScope)
      }
      if (p.direction) {
        next = next.filter((r) => r.direction === p.direction)
      }
      return next
    },
  }),

  material: createBillMockStore({
    prefix: 'DOC',
    seedList: [
      base({
        id: 1,
        billCode: 'DOC-001',
        name: '员工手册2026',
        code: 'HR-MANUAL-26',
        categoryName: '人事制度',
        fileName: '员工手册.pdf',
        status: '已审核',
      }),
      base({
        id: 2,
        billCode: 'DOC-002',
        name: '工艺标准汇编',
        code: 'PE-STD-01',
        categoryName: '工艺资料',
        fileName: '工艺标准.zip',
        status: '待审核',
      }),
    ],
    filterFn: filterBy(['name', 'code', 'categoryName']),
  }),
}

export function getOaStore(key) {
  const alias = { messageSystem: 'message', messagePersonal: 'message' }
  const store = oaStores[alias[key] || key]
  if (!store) throw new Error(`未知办公模块: ${key}`)
  return store
}
