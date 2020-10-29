/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const itemBankRouter = {
  path: '/itemBank',
  component: Layout,
  redirect: '/itemBank/theory/index',
  name: 'itemBank',
  meta: {
    title: '题库管理',
    icon: 'component'
  },
  children: [
    {
      path: 'theory',
      component: () => import('@/views/itemBank/index'),
      // Parent router-view
      name: 'theory',
      meta: { title: '理论赛题目', roles: ['admin', 'teacher'] },
      redirect: '/itemBank/theory/index',
      children: [
        {
          path: 'index',
          component: () => import('@/views/itemBank/theory/theory/index'), // Parent router-view
          name: 'theoryList',
          meta: { title: '理论赛题目' }
        },
        {
          path: 'addTheory',
          component: () => import('@/views/itemBank/theory/addTopic'), // Parent router-view
          name: 'addTheory',
          hidden: true,
          meta: { title: '新增题目', activeMenu: '/itemBank/theory/index' }
        },
        {
          path: 'editTheory',
          component: () => import('@/views/itemBank/theory/addTopic'), // Parent router-view
          name: 'editTheory',
          hidden: true,
          meta: { title: '编辑题目', activeMenu: '/itemBank/theory/index' }
        }]
    },
    {
      path: 'jeopardy',
      component: () => import('@/views/itemBank/index'),
      // Parent router-view
      name: 'jeopardy',
      meta: { title: '解题赛题目', roles: ['admin', 'teacher'] },
      redirect: '/itemBank/jeopardy/index',
      children: [
        {
          path: 'index',
          component: () => import('@/views/itemBank/jeopardy/jeopardy/index'), // Parent router-view
          name: 'jeopardyList',
          meta: { title: '解题赛题目' }
        },
        {
          path: 'addJeopardy',
          component: () => import('@/views/itemBank/jeopardy/addTopic'), // Parent router-view
          name: 'addJeopardy',
          hidden: true,
          meta: { title: '新增题目', activeMenu: '/itemBank/jeopardy/index' }
        },
        {
          path: 'editJeopardy',
          component: () => import('@/views/itemBank/jeopardy/addTopic'), // Parent router-view
          name: 'editJeopardy',
          hidden: true,
          meta: { title: '编辑题目', activeMenu: '/itemBank/jeopardy/index' }
        }]
    },
    {
      path: 'defense',
      component: () => import('@/views/itemBank/index'),
      // Parent router-view
      name: 'defense',
      meta: { title: '攻防赛题目', roles: ['admin', 'teacher'] },
      redirect: '/itemBank/defense/index',
      children: [
        {
          path: 'index',
          component: () => import('@/views/itemBank/defense/defense/index'), // Parent router-view
          name: 'defenseList',
          meta: { title: '攻防赛题目' }
        },
        {
          path: 'addDefense',
          component: () => import('@/views/itemBank/defense/addTopic'), // Parent router-view
          name: 'addDefense',
          hidden: true,
          meta: { title: '新增题目', activeMenu: '/itemBank/defense/index' }
        },
        {
          path: 'editDefense',
          component: () => import('@/views/itemBank/defense/addTopic'), // Parent router-view
          name: 'editDefense',
          hidden: true,
          meta: { title: '编辑题目', activeMenu: '/itemBank/defense/index' }
        }]
    },
    {
      path: 'NewAD',
      name: 'NewAD',
      component: () => import('@/views/itemBank/index'),
      // Parent router-view
      meta: { title: '新攻防题目', roles: ['admin', 'teacher'] },
      redirect: '/itemBank/newAD/index',
      children: [
        {
          path: 'index',
          component: () => import('@/views/itemBank/newAD/NewAD/index'), // Parent router-view
          name: 'NewADList',
          meta: { title: '新攻防题目' }
        },
        {
          path: 'addNewAD',
          component: () => import('@/views/itemBank/newAD/addTopic'), // Parent router-view
          name: 'addNewAD',
          hidden: true,
          meta: { title: '新增题目', activeMenu: '/itemBank/NewAD/index' }
        },
        {
          path: 'editNewAD',
          component: () => import('@/views/itemBank/newAD/addTopic'), // Parent router-view
          name: 'editNewAD',
          hidden: true,
          meta: { title: '编辑题目', activeMenu: '/itemBank/NewAD/index' }
        }]
    },
    {
      path: 'DevOps',
      name: 'DevOps',
      meta: { title: '运维赛题目', roles: ['admin', 'teacher'] },
      component: () => import('@/views/itemBank/index'),
      // Parent router-view
      redirect: '/itemBank/DevOps/index',
      children: [
        {
          path: 'index',
          component: () => import('@/views/itemBank/DevOps/DevOps/index'), // Parent router-view
          name: 'DevOpsList',
          meta: { title: '运维赛题目' }
        },
        {
          path: 'addDevOps',
          component: () => import('@/views/itemBank/DevOps/addTopic'), // Parent router-view
          name: 'addDevOps',
          hidden: true,
          meta: { title: '新增题目', activeMenu: '/itemBank/DevOps/index' }
        },
        {
          path: 'editDevOps',
          component: () => import('@/views/itemBank/DevOps/addTopic'), // Parent router-view
          name: 'editDevOps',
          hidden: true,
          meta: { title: '编辑题目', activeMenu: '/itemBank/DevOps/index' }
        }]
    },
    // {
    //   path: 'layered',
    //   component: () => import('@/views/itemBank/index'),
    //   // Parent router-view
    //   name: 'layered',
    //   meta: { title: '闯关赛题目',roles: ['admin','teacher'] },
    //   redirect: '/itemBank/layered/index',
    //   children: [
    //     {
    //       path: 'index',
    //       component: () => import('@/views/itemBank/layered/layered/index'), // Parent router-view
    //       name: 'layeredList',
    //       meta: { title: '闯关赛题目' }
    //     },
    //     {
    //       path: 'addLayered',
    //       component: () => import('@/views/itemBank/layered/addTopic'), // Parent router-view
    //       name: 'addLayered',
    //       hidden: true,
    //       meta: { title: '新增题目', activeMenu: '/itemBank/layered/index' }
    //     },
    //     {
    //       path: 'editLayered',
    //       component: () => import('@/views/itemBank/layered/addTopic'), // Parent router-view
    //       name: 'editLayered',
    //       hidden: true,
    //       meta: { title: '编辑题目', activeMenu: '/itemBank/layered/index' }
    //     },
    //   ],
    // },
    {
      path: 'rw',
      component: () => import('@/views/itemBank/index'),
      // Parent router-view
      name: 'realWord',
      meta: { title: 'RealWorld题目', roles: ['admin', 'teacher'] },
      redirect: '/itemBank/rw/index',
      children: [
        {
          path: 'index',
          component: () => import('@/views/itemBank/rw/rw'), // Parent router-view
          name: 'rwList',
          meta: { title: 'RealWorld题目' }
        },
        {
          path: 'addRW',
          component: () => import('@/views/itemBank/rw/addTopic'), // Parent router-view
          name: 'addRW',
          hidden: true,
          meta: { title: '新增题目', activeMenu: '/itemBank/rw/index' }
        },
        {
          path: 'editRW',
          component: () => import('@/views/itemBank/rw/addTopic'), // Parent router-view
          name: 'editRW',
          hidden: true,
          meta: { title: '编辑题目', activeMenu: '/itemBank/rw/index' }
        }]
    },
    {
      path: 'penetration',
      component: () => import('@/views/itemBank/index'),
      // Parent router-view
      name: 'penetration',
      meta: { title: '渗透赛题目', roles: ['admin', 'teacher'] },
      redirect: '/itemBank/penetration/index',
      children: [
        {
          path: 'index',
          component: () => import('@/views/itemBank/penetration/penetration'), // Parent router-view
          name: 'penetrationList',
          meta: { title: '渗透赛题目' }
        }, {
          path: 'addpenetration',
          component: () => import('@/views/itemBank/penetration/addTopic'), // Parent router-view
          name: 'addpenetration',
          hidden: true,
          meta: { title: '新增题目', activeMenu: '/itemBank/penetration/index' }
        }, {
          path: 'editpenetration',
          component: () => import('@/views/itemBank/penetration/addTopic'), // Parent router-view
          name: 'editpenetration',
          hidden: true,
          meta: { title: '编辑题目', activeMenu: '/itemBank/penetration/index' }
        }

      ]
    }
  ]
}

export default itemBankRouter
