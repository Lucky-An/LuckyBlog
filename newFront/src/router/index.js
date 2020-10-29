import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [{
  path: '/login',
  meta: {
    title: '登录'
  },
  component: () => import('@/views/login/index')
},
// 总决赛排行榜，不登录也可以访问
{
  path: '/finals',
  meta: {
    title: '排行榜'
  },
  component: () => import('@/views/finals/index')
},
// 观众席，不登录也可以访问
{
  path: '/watchvhdsufvgsduigdsugvguisdgvusidviusdv',
  meta: {
    title: '观众席'
  },
  component: () => import('@/views/watch/index')
},
{
  path: '/',
  component: () => import('@/views/match/index'),
  redirect: '/match/taskList'
},
{
  path: '/match',
  component: () => import('@/views/match/index'),
  redirect: '/match/taskList',
  children: [{
    path: 'taskList',
    component: () => import('@/views/match/taskList'),
    meta: {
      title: '竞赛'
    }
  },
  {
    path: 'tools',
    component: () => import('@/views/match/tools'),
    meta: {
      title: '工具库'
    }
  },
  {
    path: 'toolDetail',
    component: () => import('@/views/match/tools/detail'),
    meta: {
      title: '工具库详情'
    }
  },
  {
    path: 'leaks',
    component: () => import('@/views/match/leaks'),
    meta: {
      title: '漏洞库'
    }
  },
  {
    path: 'personal',
    component: () => import('@/views/match/personal'),
    meta: {
      title: '个人中心'
    }
  }
  ]
},
// 攻防赛路由
{
  path: '/attack',
  component: () => import('@/views/attack/index'),
  redirect: '/attack/guide',
  children: [{
    path: 'guide',
    component: () => import('@/views/attack/guide'),
    meta: {
      title: '指南'
    }
  },
  {
    path: 'notice',
    component: () => import('@/views/attack/notice'),
    meta: {
      title: '公告'
    }
  },
  {
    path: 'task',
    component: () => import('@/views/attack/task'),
    meta: {
      title: '赛题'
    }
  },
  {
    path: 'environment',
    component: () => import('@/views/attack/task/card/environment'),
    meta: {
      title: '查看比赛信息'
    }
  },
  {
    path: 'ranking',
    component: () => import('@/views/attack/ranking/index'),
    meta: {
      title: '排行榜'
    }
  },
  {
    path: 'attackRanking',
    component: () => import('@/views/attack/attackRanking'),
    meta: {
      title: '攻击榜'
    }
  },
  {
    path: 'trend',
    component: () => import('@/views/attack/trend'),
    meta: {
      title: '趋势'
    }
  },
  {
    path: 'wp',
    component: () => import('@/views/attack/wp'),
    meta: {
      title: 'WP'
    }
  }
  ]
},
// 新攻防路由
{
  path: '/newAttack',
  component: () => import('@/views/newAD/index'),
  redirect: '/newAttack/guide',
  children: [{
    path: 'guide',
    component: () => import('@/views/newAD/guide'),
    meta: {
      title: '指南'
    }
  },
  {
    path: 'notice',
    component: () => import('@/views/newAD/notice'),
    meta: {
      title: '公告'
    }
  },
  {
    path: 'task',
    component: () => import('@/views/newAD/task'),
    meta: {
      title: '赛题'
    }
  },
  {
    path: 'ranking',
    component: () => import('@/views/newAD/ranking/index'),
    meta: {
      title: '排行榜'
    }
  },
  {
    path: 'attackRanking',
    component: () => import('@/views/newAD/attackRanking'),
    meta: {
      title: '攻击榜'
    }
  },
  {
    path: 'trend',
    component: () => import('@/views/newAD/trend'),
    meta: {
      title: '趋势'
    }
  },
  {
    path: 'wp',
    component: () => import('@/views/newAD/wp'),
    meta: {
      title: 'WP'
    }
  }
  ]
},
// 运维赛路由
{
  path: '/devops',
  component: () => import('@/views/devops/index'),
  redirect: '/devops/guide',
  children: [{
    path: 'guide',
    component: () => import('@/views/devops/guide'),
    meta: {
      title: '指南'
    }
  },
  {
    path: 'notice',
    component: () => import('@/views/devops/notice'),
    meta: {
      title: '公告'
    }
  },
  {
    path: 'task',
    component: () => import('@/views/devops/task'),
    meta: {
      title: '赛题'
    }
  },
  {
    path: 'ranking',
    component: () => import('@/views/devops/ranking/index'),
    meta: {
      title: '排行'
    }
  },
  {
    path: 'trend',
    component: () => import('@/views/devops/trend'),
    meta: {
      title: '趋势'
    }
  },
  {
    path: 'wp',
    component: () => import('@/views/devops/wp'),
    meta: {
      title: '上传'
    }
  }
  ]
},
// 解题赛路由
{
  path: '/jad',
  component: () => import('@/views/jad/index'),
  redirect: '/jad/guide',
  children: [{
    path: 'guide',
    component: () => import('@/views/jad/guide'),
    meta: {
      title: '指南'
    }
  },
  {
    path: 'notice',
    component: () => import('@/views/jad/notice'),
    meta: {
      title: '公告'
    }
  },
  {
    path: 'task',
    component: () => import('@/views/jad/task'),
    meta: {
      title: '赛题'
    }
  },
  {
    path: 'ranking',
    component: () => import('@/views/jad/ranking'),
    meta: {
      title: '排行榜'
    }
  },
  {
    path: 'attackRanking',
    component: () => import('@/views/match/taskList/index'),
    meta: {
      title: '攻击榜'
    }
  },
  {
    path: 'trend',
    component: () => import('@/views/jad/trend'),
    meta: {
      title: '趋势'
    }
  },
  {
    path: 'wp',
    component: () => import('@/views/jad/wp'),
    meta: {
      title: '上传'
    }
  }
  ]
},
// 闯关赛路由
{
  path: '/layered',
  component: () => import('@/views/match/index'),
  redirect: '/layered/guide',
  children: [{
    path: 'guide',
    component: () => import('@/views/match/taskList/index'),
    meta: {
      title: '指南'
    }
  },
  {
    path: 'notice',
    component: () => import('@/views/match/taskList/index'),
    meta: {
      title: '公告'
    }
  },
  {
    path: 'task',
    component: () => import('@/views/match/taskList/index'),
    meta: {
      title: '赛题'
    }
  },
  {
    path: 'ranking',
    component: () => import('@/views/match/taskList/index'),
    meta: {
      title: '排行'
    }
  },
  {
    path: 'attackRanking',
    component: () => import('@/views/match/taskList/index'),
    meta: {
      title: '攻击榜'
    }
  },
  {
    path: 'trend',
    component: () => import('@/views/match/taskList/index'),
    meta: {
      title: '趋势'
    }
  },
  {
    path: 'wp',
    component: () => import('@/views/match/taskList/index'),
    meta: {
      title: '上传'
    }
  }
  ]
},
// rw路由
{
  path: '/rw',
  component: () => import('@/views/rw/index'),
  redirect: '/rw/guide',
  children: [{
    path: 'guide',
    component: () => import('@/views/rw/guide'),
    meta: {
      title: '指南'
    }
  },
  {
    path: 'notice',
    component: () => import('@/views/rw/notice'),
    meta: {
      title: '公告'
    }
  },
  {
    path: 'task',
    component: () => import('@/views/rw/task'),
    meta: {
      title: '赛题'
    }
  },
  {
    path: 'ranking',
    component: () => import('@/views/rw/ranking'),
    meta: {
      title: '排行'
    }
  },
  {
    path: 'trend',
    component: () => import('@/views/rw/trend'),
    meta: {
      title: '趋势'
    }
  }
  ]
},

// 裁判路由配置
// realWorld裁判路由配置
{
  path: '/referee/realWorld',
  component: resolve => require(['@/views/referee/rw/index'], resolve),
  // name:"match",
  children: [{
    path: 'examine',
    component: resolve => require(['@/views/referee/rw/examine'], resolve),
    name: 'rw_referee',
    meta: {
      title: '裁判席'
    }
  },
  {
    path: 'ranking',
    component: () => import('@/views/rw/ranking'),
    meta: {
      title: '排行'
    }
  }
  ]
},

// 理论赛路由
{
  path: '/theory',
  component: () => import('@/views/theory/index'),
  redirect: '/theory/guide',
  children: [{
    path: 'guide',
    component: () => import('@/views/theory/guide'),
    meta: {
      title: '指南'
    }
  },
  {
    path: 'task',
    component: () => import('@/views/theory/task'),
    meta: {
      title: '赛题'
    }
  }

  ]
},
// 渗透赛路由
{
  path: '/inf',
  component: () => import('@/views/inf/index'),
  redirect: '/inf/guide',
  children: [{
    path: 'guide',
    component: () => import('@/views/inf/guide'),
    meta: {
      title: '指南'
    }
  },
  {
    path: 'notice',
    component: () => import('@/views/inf/notice'),
    meta: {
      title: '公告'
    }
  },
  {
    path: 'task',
    component: () => import('@/views/inf/task'),
    meta: {
      title: '答题'
    }
  },
  {
    path: 'ranking',
    component: () => import('@/views/inf/ranking'),
    meta: {
      title: '排行'
    }
  },
  {
    path: 'trend',
    component: () => import('@/views/inf/trend'),
    meta: {
      title: '趋势'
    }
  },
  {
    path: 'wp',
    component: () => import('@/views/inf/wp'),
    meta: {
      title: 'WP'
    }
  }
  ]
},

{
  path: '/404',
  component: () => import('@/views/404')
},

// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404'
}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
