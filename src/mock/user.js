import { fail, ok, sleep } from './config'

const roles = ['超级管理员', '运维', '财务', '销售', '仓管']
const departments = ['总部', '技术部', '财务部', '销售部', '仓储部']

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function createSeedUsers(count = 57) {
  const list = [
    {
      id: 1,
      username: 'admin',
      nickname: '管理员',
      phone: '13800000001',
      email: 'admin@soft-erp.com',
      role: '超级管理员',
      department: '总部',
      status: 1,
      createdAt: '2025-01-01 09:00:00',
    },
  ]

  for (let i = 2; i <= count; i += 1) {
    const role = roles[i % roles.length]
    list.push({
      id: i,
      username: `user${pad(i)}`,
      nickname: `用户${i}`,
      phone: `138${String(10000000 + i).slice(0, 8)}`,
      email: `user${i}@soft-erp.com`,
      role,
      department: departments[i % departments.length],
      status: i % 5 === 0 ? 0 : 1,
      createdAt: formatDate(new Date(2025, (i % 12), (i % 28) + 1, 9, i % 60)),
    })
  }
  return list
}

let users = createSeedUsers()
let nextId = users.length + 1

export async function mockLogin({ username, password }) {
  await sleep()
  if (!username || !password) {
    return fail('请输入账号和密码')
  }
  return ok({
    token: `mock-token-${Date.now()}`,
    userInfo: {
      id: 1,
      username,
      nickname: username === 'admin' ? '管理员' : username,
      avatar: '',
      roles: ['admin'],
    },
  })
}

export async function mockGetUserList(params = {}) {
  await sleep()
  const {
    page = 1,
    pageSize = 10,
    username = '',
    nickname = '',
    phone = '',
    status = '',
  } = params

  let filtered = [...users]

  if (username) {
    filtered = filtered.filter((item) =>
      item.username.toLowerCase().includes(String(username).trim().toLowerCase()),
    )
  }
  if (nickname) {
    filtered = filtered.filter((item) =>
      item.nickname.includes(String(nickname).trim()),
    )
  }
  if (phone) {
    filtered = filtered.filter((item) => item.phone.includes(String(phone).trim()))
  }
  if (status !== '' && status !== null && status !== undefined) {
    filtered = filtered.filter((item) => item.status === Number(status))
  }

  const total = filtered.length
  const start = (Number(page) - 1) * Number(pageSize)
  const list = filtered.slice(start, start + Number(pageSize))

  return ok({ list, total, page: Number(page), pageSize: Number(pageSize) })
}

export async function mockCreateUser(payload) {
  await sleep()
  if (!payload?.username || !payload?.nickname) {
    return fail('账号和昵称不能为空')
  }
  if (users.some((item) => item.username === payload.username)) {
    return fail('账号已存在')
  }
  const row = {
    id: nextId++,
    username: payload.username,
    nickname: payload.nickname,
    phone: payload.phone || '',
    email: payload.email || '',
    role: payload.role || '运维',
    department: payload.department || '总部',
    status: payload.status ?? 1,
    createdAt: formatDate(new Date()),
  }
  users.unshift(row)
  return ok(row, '创建成功')
}

export async function mockUpdateUser(id, payload) {
  await sleep()
  const index = users.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('用户不存在')
  users[index] = { ...users[index], ...payload, id: users[index].id }
  return ok(users[index], '更新成功')
}

export async function mockDeleteUser(id) {
  await sleep()
  const index = users.findIndex((item) => item.id === Number(id))
  if (index === -1) return fail('用户不存在')
  if (users[index].username === 'admin') return fail('管理员账号不可删除')
  users.splice(index, 1)
  return ok(true, '删除成功')
}
