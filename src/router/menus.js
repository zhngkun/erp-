/** 侧边栏菜单（可后续改为接口下发） */
export const menuRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: { title: '工作台', icon: 'Odometer' },
  },
  {
    path: '/system',
    name: 'System',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: '/system/user',
        name: 'SystemUser',
        meta: { title: '用户管理', icon: 'User' },
      },
      {
        path: '/system/role',
        name: 'SystemRole',
        meta: { title: '角色管理', icon: 'UserFilled' },
      },
    ],
  },
]
