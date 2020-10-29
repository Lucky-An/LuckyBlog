/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemManage = {
  path: '/systemManage',
  component: Layout,
  redirect: '/systemManage/config',
  name: 'systemManage',
  meta: {
    title: '系统管理',
    icon: 'example'
  },
  children: [
    {
      path: 'config',
      component: () => import('@/views/systemManage/config/index'), // Parent router-view
      name: 'systemManageConfig',
      meta: { title: '系统配置', roles: ['admin'] }
    },
    {
      path: 'update',
      component: () => import('@/views/systemManage/update'), // Parent router-view
      name: 'systemManageUpdate',
      meta: { title: '系统升级', roles: ['admin'] }
    },
    {
      path: 'matchRecord',
      component: () => import('@/views/systemManage/log'), // Parent router-view
      name: 'matchRecord',
      meta: { title: '日志审计' }
    },
    {
      path: 'watchMatch',
      component: () => import('@/views/systemManage/watchMatch'), // Parent router-view
      name: 'watchMatch',
      meta: { title: '观摩管理' }
    },
    {// 实例模板管理
      path: 'example',
      component: () => import('@/views/systemManage/example'), // Parent router-view
      name: 'example',
      meta: {
        title: '实例模板管理'
      },
      redirect: '/systemManage/example',
      children: [
        {
          path: '',
          component: () => import('@/views/systemManage/example/list'), // Parent router-view
          name: 'exampleList',
          meta: {
            title: '实例模板管理'
          }
        },
        {
          path: 'create',
          component: () => import('@/views/systemManage/example/add'), // Parent router-view
          name: 'createExample',
          meta: { title: '新增', activeMenu: '/systemManage/example' },
          hidden: true
        },
        {
          path: 'edit',
          component: () => import('@/views/systemManage/example/add'), // Parent router-view
          name: 'editExample',
          meta: { title: '编辑', activeMenu: '/systemManage/example' },
          hidden: true
        }
      ]
    }
  ]
}

export default systemManage
