/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemDevOps = {
  path: '/systemDevOps',
  component: Layout,
  redirect: '/systemDevOps/mac',
  name: 'systemDevOps',
  meta: {
    title: '系统运维',
    icon: 'tab'
  },
  children: [{
    path: 'vpn',
    component: () => import('@/views/systemDevOps/VPN/manage'), // Parent router-view
    name: 'VPNmanage',
    hidden: true,
    meta: {
      title: 'VPN管理',
      roles: ['admin', 'teacher']
    }
  },
  {
    path: 'vpnDetail',
    component: () => import('@/views/systemDevops/VPN/detail'), // Parent router-view
    name: 'VPNdetail',
    hidden: true,
    meta: {
      title: 'VPN详情',
      roles: ['admin', 'teacher']
    }
  },
  {
    path: 'mac',
    component: () => import('@/views/systemDevops/MAC/manage'), // Parent router-view
    name: 'MACmanage',
    meta: {
      title: 'MAC管理',
      roles: ['admin', 'teacher']
    }
  },
  {
    path: 'macDetail',
    component: () => import('@/views/systemDevops/MAC/detail'), // Parent router-view
    name: 'MACdetail',
    hidden: true,
    meta: {
      title: 'MAC详情',
      roles: ['admin', 'teacher'],
      activeMenu: '/systemDevOps/mac'
    }
  },
  // {
  //   path: 'example',
  //   component: () => import('@/views/systemDevops/example'), // Parent router-view
  //   name: 'systemDevOpsExample',
  //   meta: {
  //     title: '实例管理',
  //     roles: ['admin', 'teacher']
  //   }
  // },
  {
    path: 'colony',
    component: () => import('@/views/systemDevops/colony'), // Parent router-view
    name: 'systemDevOpsColony',
    meta: {
      title: '集群管理',
      roles: ['admin']
    }
  }
    // {
    //   path: 'internet',
    //   component: () => import('@/views/systemDevOps/internet'), // Parent router-view
    //   name: 'systemDevOpsInternet',
    //   meta: { title: '网络管理', roles: ['admin', 'teacher'] }
    // }

  ]
}

export default systemDevOps
