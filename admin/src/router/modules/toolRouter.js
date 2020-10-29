/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const toolRouter = {
  path: '/tool',
  component: Layout,
  redirect: '/tool/tool',
  name: 'tool',
  meta: {
    title: '工具库管理',
    icon: 'lock',
    roles: ['admin', 'teacher']
  },
  children: [

    {
      path: 'addTool',
      component: () => import('@/views/tool/addTool'),
      hidden: true,
      meta: { title: '新增工具', activeMenu: '/tool/tool' }
    },
    {
      path: 'editTool',
      component: () => import('@/views/tool/addTool'),
      name: 'editTool',
      hidden: true,
      meta: { title: '编辑工具', activeMenu: '/tool/tool' }
    },
    {
      path: 'tool',
      component: () => import('@/views/tool/toolList'),
      name: 'toolManage',
      meta: { title: '工具库管理' }
    }

  ]
}

export default toolRouter
