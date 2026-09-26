import { createBillMockStore, todayStr } from '../stock/_helpers'

function base(partial = {}) {
  return {
    billDate: todayStr(),
    status: '待审核',
    createAdminName: '张伟',
    createdAt: `${todayStr()} 10:20:00`,
    remark: '',
    auditName: '',
    deptName: '人事部',
    enable: 1,
    priority: 10,
    amountTotal: 0,
    ...partial,
  }
}

function salaryRow(partial = {}) {
  return base({
    adminName: '李明',
    salaryDate: '2026-09',
    monthWages: 8000,
    wagesCount: 500,
    wagesTime: 300,
    overtimeWage: 400,
    seniorityPay: 200,
    perfectAttendanceBonus: 100,
    performance: 500,
    gradeAllowance: 200,
    jobSubsidies: 300,
    carAllowance: 200,
    housingSubsidy: 500,
    fiveSocial: 800,
    accumulationFund: 400,
    incomeTax: 200,
    deductMoney: 0,
    yearBonus: 0,
    salaryAdd: 200,
    salaryReduce: 100,
    takeHomePay: 9900,
    amountTotal: 9900,
    ...partial,
  })
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

export const hrStores = {
  salaryItem: createBillMockStore({
    prefix: 'SPI',
    seedList: [
      base({ id: 1, billCode: 'SPI-001', name: '基本工资', code: 'BASE', type: '基本工资', status: '已审核' }),
      base({ id: 2, billCode: 'SPI-002', name: '加班费', code: 'OT', type: '增项', status: '已审核' }),
      base({ id: 3, billCode: 'SPI-003', name: '迟到扣款', code: 'LATE', type: '减项', status: '待审核' }),
    ],
    filterFn: filterBy(['name', 'code', 'type']),
  }),

  salaryAdjust: createBillMockStore({
    prefix: 'SA',
    seedList: [
      base({ id: 1, billCode: 'SA-20260925001', amountTotal: 1500, deptName: '生产部' }),
      base({
        id: 2,
        billCode: 'SA-20260910002',
        billDate: '2026-09-10',
        amountTotal: -300,
        deptName: '质量部',
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['deptName']),
  }),

  billingReport: createBillMockStore({
    prefix: 'SAC',
    seedList: [
      base({ id: 1, billCode: 'SAC-20260925001', salaryDate: '2026-09', amountTotal: 186000 }),
      base({
        id: 2,
        billCode: 'SAC-20260820002',
        billDate: '2026-08-20',
        salaryDate: '2026-08',
        amountTotal: 172500,
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['salaryDate']),
  }),

  salaryDetail: createBillMockStore({
    prefix: 'SR',
    seedList: [
      salaryRow({ id: 1, billCode: 'SR-001', adminName: '李明', deptName: '机加车间' }),
      salaryRow({
        id: 2,
        billCode: 'SR-002',
        adminName: '王芳',
        deptName: '装配车间',
        monthWages: 7500,
        takeHomePay: 9200,
        amountTotal: 9200,
        status: '已审核',
      }),
    ],
    filterFn: filterBy(['adminName', 'deptName', 'salaryDate']),
  }),

  mySalary: createBillMockStore({
    prefix: 'MS',
    seedList: [
      salaryRow({ id: 1, billCode: 'MS-001', adminName: '当前用户', deptName: '工程部', salaryDate: '2026-09' }),
      salaryRow({
        id: 2,
        billCode: 'MS-002',
        adminName: '当前用户',
        deptName: '工程部',
        salaryDate: '2026-08',
        status: '已审核',
      }),
    ],
    filterFn: filterBy(['salaryDate', 'adminName']),
  }),

  workCalendar: createBillMockStore({
    prefix: 'HC',
    seedList: [
      base({
        id: 1,
        billCode: 'HC-001',
        name: '国庆假期',
        startDate: '2026-10-01',
        endDate: '2026-10-07',
        compensatoryWorkDate: '2026-09-27',
        status: '已审核',
      }),
      base({
        id: 2,
        billCode: 'HC-002',
        name: '中秋假期',
        startDate: '2026-09-15',
        endDate: '2026-09-17',
        compensatoryWorkDate: '',
        status: '已审核',
      }),
    ],
    filterFn: filterBy(['name']),
  }),

  punchAddress: createBillMockStore({
    prefix: 'PA',
    seedList: [
      base({
        id: 1,
        billCode: 'PA-001',
        name: '总部一楼',
        address: '苏州市工业园区星湖街328号',
        longitude: '120.737',
        latitude: '31.276',
        effectiveRange: 200,
        status: '已审核',
      }),
      base({
        id: 2,
        billCode: 'PA-002',
        name: '二号厂房',
        address: '苏州市工业园区唯亭街道',
        longitude: '120.752',
        latitude: '31.301',
        effectiveRange: 300,
        status: '待审核',
      }),
    ],
    filterFn: filterBy(['name', 'address']),
  }),

  attendanceRule: createBillMockStore({
    prefix: 'AR',
    seedList: [
      base({
        id: 1,
        billCode: 'AR-001',
        name: '标准工时规则',
        code: 'RULE-STD',
        applyDeptListStr: '生产部,质量部',
        applyAdminListStr: '全部',
        clockAddressListStr: '总部一楼,二号厂房',
        calendarName: '2026标准日历',
        isAllowReplacementClock: 1,
        isLimitReplacementClockTime: 1,
        limitReplacementClockDays: 3,
        isLimitMonthReplacementClockCount: 1,
        limitMonthReplacementClockCount: 3,
        status: '已审核',
      }),
      base({
        id: 2,
        billCode: 'AR-002',
        name: '弹性工时规则',
        code: 'RULE-FLEX',
        applyDeptListStr: '工程部',
        applyAdminListStr: '李工,王工',
        clockAddressListStr: '总部一楼',
        calendarName: '2026标准日历',
        isAllowReplacementClock: 1,
        isLimitReplacementClockTime: 0,
        limitReplacementClockDays: 0,
        isLimitMonthReplacementClockCount: 0,
        limitMonthReplacementClockCount: 0,
        status: '待审核',
      }),
    ],
    filterFn: filterBy(['name', 'code']),
  }),

  punchRecord: createBillMockStore({
    prefix: 'PR',
    seedList: [
      base({
        id: 1,
        billCode: 'PR-001',
        createAdminName: '李明',
        deptName: '机加车间',
        rulesName: '标准工时规则',
        clockList: '08:01上班 / 17:05下班',
        clockDate: '2026-09-25',
        status: '已审核',
      }),
      base({
        id: 2,
        billCode: 'PR-002',
        createAdminName: '王芳',
        deptName: '装配车间',
        rulesName: '标准工时规则',
        clockList: '08:12上班 / 17:30下班',
        clockDate: '2026-09-25',
        status: '已审核',
      }),
    ],
    filterFn: filterBy(['createAdminName', 'deptName', 'clockDate']),
  }),

  leave: createBillMockStore({
    prefix: 'LV',
    seedList: [
      base({
        id: 1,
        billCode: 'LV-20260925001',
        leaveType: '事假',
        startTime: '2026-09-28 09:00',
        endTime: '2026-09-28 18:00',
        leaveDuration: 1,
      }),
      base({
        id: 2,
        billCode: 'LV-20260910002',
        billDate: '2026-09-10',
        leaveType: '年假',
        startTime: '2026-09-15 09:00',
        endTime: '2026-09-17 18:00',
        leaveDuration: 3,
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['leaveType', 'deptName']),
  }),

  shift: createBillMockStore({
    prefix: 'SH',
    seedList: [
      base({
        id: 1,
        billCode: 'SH-001',
        name: '常白班',
        code: 'DAY',
        workingHours: 8,
        hourUnitPrice: 35,
        status: '已审核',
      }),
      base({
        id: 2,
        billCode: 'SH-002',
        name: '夜班',
        code: 'NIGHT',
        workingHours: 8,
        hourUnitPrice: 45,
        status: '已审核',
      }),
    ],
    filterFn: filterBy(['name', 'code']),
  }),

  roster: createBillMockStore({
    prefix: 'RO',
    seedList: [
      base({
        id: 1,
        billCode: 'RO-20260925001',
        adminName: '李明',
        shiftName: '常白班',
        shiftWorkingHours: 8,
        shiftHourUnitPrice: 35,
        amountTotal: 280,
      }),
      base({
        id: 2,
        billCode: 'RO-20260918002',
        billDate: '2026-09-18',
        adminName: '王芳',
        shiftName: '夜班',
        shiftWorkingHours: 8,
        shiftHourUnitPrice: 45,
        amountTotal: 360,
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['adminName', 'shiftName']),
  }),

  training: createBillMockStore({
    prefix: 'TRN',
    seedList: [
      base({
        id: 1,
        billCode: 'TRN-20260925001',
        trainingTheme: '安全生产培训',
        trainingCategory: '安全',
        trainingForm: '线下',
        trainer: '外聘讲师',
        trainingUnit: '市安监局',
        trainingLocation: '一号会议室',
        trainingBudget: 3000,
        startTime: '2026-09-28 09:00',
        endTime: '2026-09-28 17:00',
        trainingResult: '待开始',
      }),
      base({
        id: 2,
        billCode: 'TRN-20260905002',
        billDate: '2026-09-05',
        trainingTheme: '精益生产导入',
        trainingCategory: '技能',
        trainingForm: '线上',
        trainer: '内部讲师',
        trainingUnit: '本公司',
        trainingLocation: '线上直播',
        trainingBudget: 0,
        startTime: '2026-09-08 14:00',
        endTime: '2026-09-08 16:00',
        trainingResult: '已完成',
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['trainingTheme', 'trainingCategory']),
  }),

  dailyReport: createBillMockStore({
    prefix: 'DR',
    seedList: [
      base({
        id: 1,
        billCode: 'DR-20260925001',
        fillType: '日报',
        title: '9/25 生产进度汇报',
        deptName: '生产部',
      }),
      base({
        id: 2,
        billCode: 'DR-20260922002',
        billDate: '2026-09-22',
        fillType: '周报',
        title: '第38周工作小结',
        deptName: '工程部',
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['title', 'fillType', 'deptName']),
  }),

  sealApply: createBillMockStore({
    prefix: 'SEAL',
    seedList: [
      base({
        id: 1,
        billCode: 'SEAL-20260925001',
        sealType: '合同章',
        usePurpose: '销售合同盖章',
      }),
      base({
        id: 2,
        billCode: 'SEAL-20260912002',
        billDate: '2026-09-12',
        sealType: '公章',
        usePurpose: '资质证明开具',
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['sealType', 'usePurpose']),
  }),

  performance: createBillMockStore({
    prefix: 'PF',
    seedList: [
      base({
        id: 1,
        billCode: 'PF-20260925001',
        title: '2026Q3绩效考核',
        adminName: '李明',
        position: '机加组长',
        performance: 1000,
        actualPerformanceBonus: 920,
        score: 92,
      }),
      base({
        id: 2,
        billCode: 'PF-20260620002',
        billDate: '2026-06-20',
        title: '2026Q2绩效考核',
        adminName: '王芳',
        position: '装配员',
        performance: 800,
        actualPerformanceBonus: 800,
        score: 100,
        status: '已审核',
        auditName: '赵审',
      }),
    ],
    filterFn: filterBy(['adminName', 'title']),
  }),
}

export function getHrStore(key) {
  const store = hrStores[key]
  if (!store) throw new Error(`未知人力模块: ${key}`)
  return store
}
