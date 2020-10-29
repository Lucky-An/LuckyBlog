/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const itemBankRouter = {
  path: '/account',
  component: Layout,
  redirect: '/account/user/index',
  name: 'account',
  meta: {
    title: '账号管理',
    icon: 'peoples',
    roles: ['admin', 'teacher']
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/account/index'),
      // Parent router-view
      name: 'userAccount',
      meta: { title: '用户管理' },
      redirect: '/account/user/index',
      children: [
        {
          path: 'index',
          component: () => import('@/views/account/user/index'), // Parent router-view
          name: 'userList',
          meta: { title: '用户管理' }
        },
        {
          path: 'addUser',
          component: () => import('@/views/account/user/addUser'), // Parent router-view
          name: 'addUserAccount',
          hidden: true,
          meta: { title: '新增用户', activeMenu: '/account/user/index' }
        },
        {
          path: 'editUser',
          component: () => import('@/views/account/user/addUser'), // Parent router-view
          name: 'editUserAccount',
          hidden: true,
          meta: { title: '编辑用户', activeMenu: '/account/user/index' }
        }
      ]
    },
    {
      path: 'team',
      name: 'teamAccount',
      component: () => import('@/views/account/index'),
      // Parent router-view
      meta: { title: '战队管理' },
      redirect: '/account/team/index',
      children: [
        {
          path: 'index',
          component: () => import('@/views/account/team/index'), // Parent router-view
          name: 'teamList',
          meta: { title: '战队管理' }
        },
        {
          path: 'addTeam',
          component: () => import('@/views/account/team/addTeam'), // Parent router-view
          name: 'addTeam',
          hidden: true,
          meta: { title: '新增战队', activeMenu: '/account/team/index' }
        },
        {
          path: 'editTeam',
          component: () => import('@/views/account/team/addTeam'), // Parent router-view
          name: 'editTeam',
          hidden: true,
          meta: { title: '编辑战队', activeMenu: '/account/team/index' }
        }
      ]
    }

  ]
}

export default itemBankRouter
