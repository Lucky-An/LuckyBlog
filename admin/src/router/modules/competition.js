/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const competitionRouter = {
  path: '/competition',
  redirect: '/competition/theory/index',
  component: Layout,
  name: 'competition',
  meta: {
    title: '竞赛管理',
    icon: 'nested'
  },
  children: [
    {
      path: 'theory',
      component: () => import('@/views/itemBank/index'),
      // Parent router-view
      name: 'theoryMatch',
      meta: {
        title: '理论赛',
        roles: ['admin', 'teacher']
      },
      redirect: '/competition/theory/index',
      children: [{
        path: 'index',
        component: () => import('@/views/competition/theory/index'), // Parent router-view
        name: 'theoryListMatch',
        meta: {
          title: '理论赛'
        }
      },
      {
        path: 'createMatch',
        component: () => import('@/views/competition/theory/createMatch'),
        name: 'createTheoryMatch',
        hidden: true,
        meta: {
          title: '新建赛事',
          activeMenu: '/competition/theory/index'
        }
      },
      {
        path: 'editMatch',
        component: () => import('@/views/itemBank/index'),
        name: 'editTheoryMatchView',
        hidden: true,
        redirect: '/competition/theory/editMatch/editMatch',
        meta: {
          noCache: true
        },
        children: [{
          path: 'editMatch',
          component: () => import('@/views/competition/theory/createMatch'),
          name: 'editTheoryMatch',
          hidden: true,
          meta: {
            title: '编辑赛事',
            noCache: true,
            activeMenu: '/competition/theory/index'
          }
        },
        {
          path: 'importTopic',
          component: () => import('@/views/competition/theory/createMatch/topic/import'),
          name: 'importTopic',
          hidden: true,
          meta: {
            title: '导入题目',
            noCache: true,
            activeMenu: '/competition/theory/index'
          }
        }
        ]
      },
      {
        path: 'scoreManage',
        component: () => import('@/views/competition/theory/scoreManage'),
        name: 'scoreManage',
        hidden: true,
        meta: {
          title: '理论赛管理',
          noCache: true,
          activeMenu: '/competition/theory/index'
        }
      },
      {
        path: 'inspect',
        component: () => import('@/views/competition/theory/scoreManage/inspect'),
        name: 'inspect',
        hidden: true,
        meta: {
          title: '检查成绩',
          noCache: true,
          activeMenu: '/competition/theory/index'
        }
      }

      ]
    },
    {
      path: 'jeopardy',
      component: () => import('@/views/itemBank/index'),
      // Parent router-view
      name: 'jeopardyMatch',
      meta: {
        title: '解题赛',
        roles: ['admin', 'teacher']
      },
      redirect: '/competition/jeopardy/index',
      children: [{
        path: 'index',
        component: () => import('@/views/competition/jeopardy/index'), // Parent router-view
        name: 'jeopardyListMatch',
        meta: {
          title: '解题赛'
        }
      },
      // {
      //   path: 'addDefense',
      //   component: () => import('@/views/itemBank/jeopardy/addTopic'), // Parent router-view
      //   name: 'addDefenseMatch',
      //   hidden: true,
      //   meta: { title: '新增题目' }
      // },
      {
        path: 'createMatch',
        component: () => import('@/views/competition/jeopardy/createMatch'),
        name: 'createJeopardyMatch',
        hidden: true,
        meta: {
          title: '新建赛事',
          noCache: true,
          activeMenu: '/competition/jeopardy/index'
        }
      },
      {
        path: 'editMatch',
        component: () => import('@/views/itemBank/index'),
        name: 'editJeopardyMatchView',
        hidden: true,
        redirect: '/competition/jeopardy/editMatch/editMatch',
        meta: {
          noCache: true,
          activeMenu: '/competition/jeopardy/index'
        },
        children: [{
          path: 'editMatch',
          component: () => import('@/views/competition/jeopardy/createMatch'),
          name: 'editJeopardyMatch',
          hidden: true,
          meta: {
            title: '编辑赛事',
            noCache: true,
            activeMenu: '/competition/jeopardy/index'
          }
        },
        {
          path: 'editTopic',
          component: () => import('@/views/competition/jeopardy/createMatch/topic/editTopic'),
          name: 'editJeopardyMatchTopic',
          hidden: true,
          meta: {
            title: '编辑赛题',
            noCache: true,
            activeMenu: '/competition/jeopardy/index'
          }
        },
        {
          path: 'addInetnet',
          component: () => import('@/views/competition/jeopardy/createMatch/internet/add'),
          name: 'addJeopardyInetnet',
          hidden: true,
          meta: {
            title: '增加网络1',
            noCache: true,
            activeMenu: '/competition/jeopardy/index'
          }
        }
        ]
      },

      {
        path: 'accredit',
        component: () => import('@/views/competition/jeopardy/accredit'),
        name: 'accreditJeopardyMatch',
        hidden: true,
        meta: {
          title: '授权管理',
          noCache: true,
          activeMenu: '/competition/jeopardy/index'
        }
      },
      {
        path: 'operation',
        component: () => import('@/views/itemBank/index'),

        redirect: '/competition/jeopardy/operation/index',
        name: 'operationJeopardyMatch',
        hidden: true,
        meta: {
          title: '竞赛运维',
          noCache: true,
          activeMenu: '/competition/jeopardy/index'
        },
        children: [{
          path: 'index',
          component: () => import('@/views/competition/jeopardy/operation'),
          name: 'operationJeopardyHome',
          hidden: true,
          meta: {
            title: '竞赛运维',
            noCache: true,
            activeMenu: '/competition/jeopardy/index'
          }
        },
        {
          path: 'editTopic',
          component: () => import('@/views/competition/jeopardy/operation/topic/addTopic'),
          name: 'editJeopardyQuestion',
          hidden: true,
          meta: {
            title: '赛题编辑',
            noCache: true,
            activeMenu: '/competition/jeopardy/index'
          }
        },
        {
          path: 'addTopic',
          component: () => import('@/views/competition/jeopardy/operation/topic/addTopic'),
          name: 'addJeopardyQuestion',
          hidden: true,
          meta: {
            title: '新建赛题',
            noCache: true,
            activeMenu: '/competition/jeopardy/index'
          }
        }
        ]

      }

      ]
    },
    {
      path: 'defense',
      component: () => import('@/views/itemBank/index'),
      // Parent router-view
      name: 'defenseMatch',
      meta: {
        title: '攻防赛',
        roles: ['admin', 'teacher']
      },
      redirect: '/competition/defense/index',
      children: [{
        path: 'index',
        component: () => import('@/views/competition/defense/index'), // Parent router-view
        name: 'defenseListMatch',
        meta: {
          title: '攻防赛'
        }
      },
      // {
      //   path: 'addDefense',
      //   component: () => import('@/views/itemBank/defense/addTopic'), // Parent router-view
      //   name: 'addDefenseMatch',
      //   hidden: true,
      //   meta: { title: '新增题目' }
      // },
      {
        path: 'createMatch',
        component: () => import('@/views/competition/defense/createMatch'),
        name: 'createMatch',
        hidden: true,
        meta: {
          title: '新建赛事',
          noCache: true,
          activeMenu: '/competition/defense/index'
        }
      },
      {
        path: 'editMatch',
        component: () => import('@/views/itemBank/index'),
        name: 'editDefenseMatchView',
        hidden: true,
        redirect: '/competition/defense/editMatch/editMatch',
        meta: {
          noCache: true,
          activeMenu: '/competition/defense/index'
        },
        children: [{
          path: 'editMatch',
          component: () => import('@/views/competition/defense/createMatch'),
          name: 'editDefenseMatch',
          hidden: true,
          meta: {
            title: '编辑赛事',
            noCache: true,
            activeMenu: '/competition/defense/index'
          }
        },
        {
          path: 'editTopic',
          component: () => import('@/views/competition/defense/createMatch/topic/editTopic'),
          name: 'editDefenseMatchTopic',
          hidden: true,
          meta: {
            title: '编辑赛题',
            noCache: true,
            activeMenu: '/competition/defense/index'
          }
        },
        {
          path: 'addInetnet',
          component: () => import('@/views/competition/defense/createMatch/internet/add'),
          name: 'addDefenseInetnet',
          hidden: true,
          meta: {
            title: '增加网络',
            noCache: true,
            activeMenu: '/competition/defense/index'
          }
        },
        {
          path: 'editInetnet',
          component: () => import('@/views/competition/defense/createMatch/internet/add'),
          name: 'editDefenseInetnet',
          hidden: true,
          meta: {
            title: '编辑网络',
            noCache: true,
            activeMenu: '/competition/defense/index'
          }
        }
        ]
      },
      {
        path: 'operation',
        component: () => import('@/views/competition/defense/operation'),
        name: 'operationDefenseMatch',
        hidden: true,
        meta: {
          title: '竞赛运维',
          noCache: true,
          activeMenu: '/competition/defense/index'
        }
      }
      ]
    },
    {
      path: 'newAD',
      component: () => import('@/views/itemBank/index'),
      // Parent router-view
      name: 'newADMatch',
      meta: {
        title: '新攻防赛',
        roles: ['admin', 'teacher']
      },
      redirect: '/competition/newAD/index',
      children: [{
        path: 'index',
        component: () => import('@/views/competition/newAD/index'), // Parent router-view
        name: 'newADListMatch',
        meta: {
          title: '新攻防赛'
        }
      },
      // {
      //   path: 'addNewAD',
      //   component: () => import('@/views/itemBank/newAD/addTopic'), // Parent router-view
      //   name: 'addNewADMatch',
      //   hidden: true,
      //   meta: { title: '新增题目' }
      // },
      {
        path: 'createMatch',
        component: () => import('@/views/competition/newAD/createMatch'),
        name: 'createNewADMatch',
        hidden: true,
        meta: {
          title: '新建赛事',
          noCache: true,
          activeMenu: '/competition/newAD/index'
        }
      },
      {
        path: 'editMatch',
        component: () => import('@/views/itemBank/index'),
        name: 'editNewADMatchView',
        hidden: true,
        redirect: '/competition/newAD/editMatch/editMatch',
        meta: {
          noCache: true,
          activeMenu: '/competition/newAD/index'
        },
        children: [{
          path: 'editMatch',
          component: () => import('@/views/competition/newAD/createMatch'),
          name: 'editNewADMatch',
          hidden: true,
          meta: {
            title: '编辑赛事',
            noCache: true,
            activeMenu: '/competition/newAD/index'
          }
        },
        {
          path: 'editTopic',
          // component: () => import('@/views/competition/newAD/createMatch/topic/editTopic'),
          component: () => import('@/views/itemBank/newAD/addTopic'), // Parent router-view
          name: 'editNewADMatchTopic',
          hidden: true,
          meta: {
            title: '编辑赛题',
            noCache: true,
            activeMenu: '/competition/newAD/index'
          }
        },
        {
          path: 'addInetnet',
          component: () => import('@/views/competition/newAD/createMatch/internet/add'),
          name: 'addNewADInetnet',
          hidden: true,
          meta: {
            title: '增加网络',
            noCache: true,
            activeMenu: '/competition/newAD/index'
          }
        },
        {
          path: 'editInetnet',
          component: () => import('@/views/competition/newAD/createMatch/internet/add'),
          name: 'editNewADInetnet',
          hidden: true,
          meta: {
            title: '编辑网络',
            noCache: true,
            activeMenu: '/competition/newAD/index'
          }
        }
        ]
      },
      {
        path: 'operation',
        component: () => import('@/views/competition/newAD/operation'),
        name: 'operationNewADMatch',
        hidden: true,
        meta: {
          title: '竞赛运维',
          noCache: true,
          activeMenu: '/competition/newAD/index'
        }
      }
      ]
    },
    {
      path: 'DevOps',
      component: () => import('@/views/itemBank/index'),
      // Parent router-view
      name: 'DevOpsMatch',
      meta: {
        title: '运维赛',
        roles: ['admin', 'teacher']
      },
      redirect: '/competition/DevOps/index',
      children: [{
        path: 'index',
        component: () => import('@/views/competition/DevOps/index'), // Parent router-view
        name: 'DevOpsListMatch',
        meta: {
          title: '运维赛'
        }
      },
      // {
      //   path: 'addDevOps',
      //   component: () => import('@/views/itemBank/newAD/addTopic'), // Parent router-view
      //   name: 'addDevOpsMatch',
      //   hidden: true,
      //   meta: { title: '新增题目' }
      // },
      {
        path: 'createMatch',
        component: () => import('@/views/competition/DevOps/createMatch'),
        name: 'createDevOpsMatch',
        hidden: true,
        meta: {
          title: '新建赛事',
          noCache: true,
          activeMenu: '/competition/DevOps/index'
        }
      },
      {
        path: 'editMatch',
        component: () => import('@/views/itemBank/index'),
        name: 'editDevOpsMatchView',
        hidden: true,
        redirect: '/competition/DevOps/editMatch/editMatch',
        meta: {
          noCache: true,
          activeMenu: '/competition/DevOps/index'
        },
        children: [{
          path: 'editMatch',
          component: () => import('@/views/competition/DevOps/createMatch'),
          name: 'editDevOpsMatch',
          hidden: true,
          meta: {
            title: '编辑赛事',
            noCache: true,
            activeMenu: '/competition/DevOps/index'
          }
        },
        {
          path: 'editTopic',
          component: () => import('@/views/competition/DevOps/createMatch/topic/editTopic'),
          name: 'editDevOpsMatchTopic',
          hidden: true,
          meta: {
            title: '编辑赛题',
            noCache: true,
            activeMenu: '/competition/DevOps/index'
          }
        },
        {
          path: 'addInetnet',
          component: () => import('@/views/competition/DevOps/createMatch/internet/add'),
          name: 'addDevOpsInetnet',
          hidden: true,
          meta: {
            title: '增加网络',
            noCache: true,
            activeMenu: '/competition/DevOps/index'
          }
        },
        {
          path: 'editInetnet',
          component: () => import('@/views/competition/DevOps/createMatch/internet/add'),
          name: 'editDevOpsInetnet',
          hidden: true,
          meta: {
            title: '编辑网络',
            noCache: true,
            activeMenu: '/competition/DevOps/index'
          }
        }
        ]
      },
      {
        path: 'operation',
        component: () => import('@/views/competition/DevOps/operation'),
        name: 'operationDevOpsMatch',
        hidden: true,
        meta: {
          title: '竞赛运维',
          noCache: true,
          activeMenu: '/competition/DevOps/index'
        }
      }
      ]
    },
    // {
    //   path: 'layered',
    //   component: () => import('@/views/itemBank/index'),
    //   // Parent router-view
    //   name: 'layeredMatch',
    //   meta: { title: '闯关赛' ,roles: ['admin','teacher']},
    //   redirect: '/competition/layered/index',
    //   children: [
    //     {
    //       path: 'index',
    //       component: () => import('@/views/competition/layered/index'), // Parent router-view
    //       name: 'layeredListMatch',
    //       meta: { title: '闯关赛',roles: ['admin','teacher'] }
    //     },
    //     // {
    //     //   path: 'addDefense',
    //     //   component: () => import('@/views/itemBank/layered/addTopic'), // Parent router-view
    //     //   name: 'addDefenseMatch',
    //     //   hidden: true,
    //     //   meta: { title: '新增题目', activeMenu: '/competition/layered/index' }
    //     // },
    //     {
    //       path: 'createMatch',
    //       component: () => import('@/views/competition/layered/createMatch'),
    //       name: 'createLayeredMatch',
    //       hidden: true,
    //       meta: { title: '新建赛事', noCache: true, activeMenu: '/competition/layered/index'  }
    //     },
    //     {
    //       path: 'editMatch',
    //       component: () => import('@/views/itemBank/index'),
    //       name: 'editLayeredMatchView',
    //       hidden: true,
    //       redirect: '/competition/layered/editMatch/editMatch',
    //       meta: { title: '编辑', noCache: true, activeMenu: '/competition/layered/index'  },
    //       children: [
    //         {
    //           path: 'editMatch',
    //           component: () => import('@/views/competition/layered/createMatch'),
    //           name: 'editLayeredMatch',
    //           hidden: true,
    //           meta: { title: '编辑赛事', noCache: true, activeMenu: '/competition/layered/index'  }
    //         },
    //         {
    //           path: 'editTopic',
    //           component: () => import('@/views/competition/layered/createMatch/topic/editTopic'),
    //           name: 'editLayeredMatchTopic',
    //           hidden: true,
    //           meta: { title: '编辑赛题', noCache: true, activeMenu: '/competition/layered/index'  }
    //         },
    //         {
    //           path: 'addInetnet',
    //           component: () => import('@/views/competition/layered/createMatch/internet/add'),
    //           name: 'addLayeredInetnet',
    //           hidden: true,
    //           meta: { title: '增加网络1', noCache: true, activeMenu: '/competition/layered/index'  }
    //         },
    //       ]
    //     },
    //
    //     // {
    //     //   path: 'accredit',
    //     //   component: () => import('@/views/competition/accredit'),
    //     //   name: 'accreditLayeredMatch',
    //     //   hidden: true,
    //     //   meta: { title: '授权管理', noCache: true, activeMenu: '/competition/layered/index'  }
    //     // },
    //     {
    //       path: 'operation',
    //       component: () => import('@/views/itemBank/index'),
    //
    //       redirect: '/competition/layered/operation/index',
    //       name: 'operationLayeredMatch',
    //       hidden: true,
    //       meta: { title: '竞赛运维', noCache: true, activeMenu: '/competition/layered/index'  },
    //       children: [
    //         {
    //           path: 'index',
    //           component: () => import('@/views/competition/layered/operation'),
    //           name: 'operationLayeredHome',
    //           hidden: true,
    //           meta: { title: '竞赛运维', noCache: true, activeMenu: '/competition/layered/index'  }
    //         },
    //         {
    //           path: 'editTopic',
    //           component: () => import('@/views/competition/layered/operation/topic/addTopic'),
    //           name: 'editLayeredQuestion',
    //           hidden: true,
    //           meta: { title: '赛题编辑', noCache: true, activeMenu: '/competition/layered/index'  }
    //         },
    //         {
    //           path: 'addTopic',
    //           component: () => import('@/views/competition/layered/operation/topic/addTopic'),
    //           name: 'addLayeredQuestion',
    //           hidden: true,
    //           meta: { title: '新建赛题', noCache: true, activeMenu: '/competition/layered/index'  }
    //         }
    //       ]
    //
    //     }
    //
    //   ]
    // },
    {
      path: 'rw',
      component: () => import('@/views/itemBank/index'),
      name: 'rwMatch',
      meta: {
        title: 'RealWorld竞赛',
        roles: ['admin', 'teacher']
      },
      redirect: '/competition/rw/index',
      children: [{
        path: 'index',
        component: () => import('@/views/competition/rw/index'), // Parent router-view
        name: 'rwListMatch',
        meta: {
          title: 'RealWorld竞赛'
        }
      },
      {
        path: 'createMatch',
        component: () => import('@/views/competition/rw/createMatch'),
        name: 'createRwMatch',
        hidden: true,
        meta: {
          title: '新建赛事',
          noCache: true,
          roles: ['admin'],
          activeMenu: '/competition/rw/index'
        }
      },
      {
        path: 'editMatch',
        component: () => import('@/views/itemBank/index'),
        name: 'editRwMatchView',
        hidden: true,
        redirect: '/competition/rw/editMatch/editMatch',
        meta: {
          noCache: true,
          roles: ['admin'],
          activeMenu: '/competition/rw/index'
        },
        children: [{
          path: 'editMatch',
          component: () => import('@/views/competition/rw/createMatch'),
          name: 'editRwMatch',
          hidden: true,
          meta: {
            title: '编辑赛事',
            noCache: true,
            activeMenu: '/competition/rw/index'
          }
        }]
      },

      {
        path: 'operation',
        component: () => import('@/views/itemBank/index'),

        redirect: '/competition/rw/operation/index',
        name: 'operationRwMatch',
        hidden: true,
        meta: {
          title: '竞赛运维',
          noCache: true,
          activeMenu: '/competition/rw/index'
        },
        children: [{
          path: 'index',
          component: () => import('@/views/competition/rw/operation'),
          name: 'operationRwHome',
          hidden: true,
          meta: {
            title: '竞赛运维',
            noCache: true,
            activeMenu: '/competition/rw/index'
          }
        },
        {
          path: 'editTopic',
          component: () => import('@/views/competition/rw/operation/topic/addTopic'),
          name: 'editRwQuestion',
          hidden: true,
          meta: {
            title: '赛题编辑',
            noCache: true,
            activeMenu: '/competition/rw/index'
          }
        },
        {
          path: 'applyRecord',
          component: () => import('@/views/competition/rw/operation/audit/applyRecord'),
          name: 'applyRecord',
          hidden: true,
          meta: {
            title: '战队申请记录',
            roles: ['referee'],
            noCache: true,
            activeMenu: '/competition/rw/index'
          }
        },
        {
          path: 'auditRecord',
          component: () => import('@/views/competition/rw/operation/audit/auditRecord'),
          name: 'auditRecord',
          hidden: true,
          meta: {
            title: '裁判审核记录',
            roles: ['referee'],
            noCache: true,
            activeMenu: '/competition/rw/index'
          }
        }
        ]

      }

      ]
    },
    // 渗透赛路由
    {
      path: 'penetration',
      component: () => import('@/views/itemBank/index'),
      // Parent router-view
      name: 'penetrationMatch',
      meta: {
        title: '渗透赛',
        roles: ['admin', 'teacher']
      },
      redirect: '/competition/penetration/index',
      children: [{
        path: 'index',
        component: () => import('@/views/competition/penetration/index'), // Parent router-view
        name: 'penetrationListMatch',
        meta: {
          title: '渗透赛'
        }
      },
      // {
      //   path: 'addDefense',
      //   component: () => import('@/views/itemBank/penetration/addTopic'), // Parent router-view
      //   name: 'addDefenseMatch',
      //   hidden: true,
      //   meta: { title: '新增题目' }
      // },
      {
        path: 'createMatch',
        component: () => import('@/views/competition/penetration/createMatch'),
        name: 'createPenetrationMatch',
        hidden: true,
        meta: {
          title: '新建赛事',
          noCache: true,
          activeMenu: '/competition/penetration/index'
        }
      },
      {
        path: 'editMatch',
        component: () => import('@/views/itemBank/index'),
        name: 'editPenetrationMatchView',
        hidden: true,
        redirect: '/competition/penetration/editMatch/editMatch',
        meta: {
          noCache: true,
          activeMenu: '/competition/penetration/index'
        },
        children: [{
          path: 'editMatch',
          component: () => import('@/views/competition/penetration/createMatch'),
          name: 'editPenetrationMatch',
          hidden: true,
          meta: {
            title: '编辑赛事',
            noCache: true,
            activeMenu: '/competition/penetration/index'
          }
        },
        {
          path: 'addInetnet',
          component: () => import('@/views/competition/penetration/createMatch/internet/add'),
          name: 'addPenetrationInetnet',
          hidden: true,
          meta: {
            title: '增加网络1',
            noCache: true,
            activeMenu: '/competition/penetration/index'
          }
        }
        ]
      },

      {
        path: 'accredit',
        component: () => import('@/views/competition/penetration/accredit'),
        name: 'accreditPenetrationMatch',
        hidden: true,
        meta: {
          title: '授权管理',
          noCache: true,
          activeMenu: '/competition/penetration/index'
        }
      },
      {
        path: 'operation',
        component: () => import('@/views/itemBank/index'),

        redirect: '/competition/penetration/operation/index',
        name: 'operationPenetrationMatch',
        hidden: true,
        meta: {
          title: '竞赛运维',
          noCache: true,
          activeMenu: '/competition/penetration/index'
        },
        children: [{
          path: 'index',
          component: () => import('@/views/competition/penetration/operation'),
          name: 'operationPenetrationHome',
          hidden: true,
          meta: {
            title: '竞赛运维',
            noCache: true,
            activeMenu: '/competition/penetration/index'
          }
        }
        ]

      }

      ]
    }
  ]
}

export default competitionRouter
