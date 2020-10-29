/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const imageRouter = {
  path: '/image',
  component: Layout,
  meta: {
    title: '资源管理',
    icon: '光盘',
    roles: ['Organizer']
  },
  redirect: '/image/virtual',
  name: 'imageParent',
  children: [
    { // 虚拟镜像管理
      path: 'virtual',
      component: () => import('@/views/image/virtual'), // Parent router-view
      name: 'virtual',
      meta: {
        title: '虚拟镜像管理'
      },
      redirect: '/image/virtual',
      children: [{
        path: '',
        component: () => import('@/views/image/virtual/list/index'), // Parent router-view
        name: 'virtualList',
        meta: {
          title: '虚拟镜像管理'
        }
      },
      {
        path: 'create',
        component: () => import('@/views/image/virtual/create'), // Parent router-view
        name: 'createVirtual',
        meta: {
          title: '新增',
          activeMenu: '/image/virtual',
          roles: ['Admin', 'Organizer']
        },
        hidden: true
      },
      {
        path: 'edit',
        component: () => import('@/views/image/virtual/create'), // Parent router-view
        name: 'editVirtual',
        meta: {
          title: '编辑',
          activeMenu: '/image/virtual',
          roles: ['Admin', 'Organizer']
        },
        hidden: true
      },
      {
        path: 'tags-manage',
        component: () => import('@/views/image/virtual/tagsManage'), // Parent router-view
        name: 'TagsManage',
        meta: {
          title: '标签管理',
          activeMenu: '/image/virtual',
          roles: ['Admin', 'Organizer']
        },
        hidden: true
      }, {
        path: 'image-console',
        component: () => import('@/views/image/virtual/list/imageConsole'), // Parent router-view
        name: 'ImageConsole',
        meta: {
          title: '控制台',
          activeMenu: '/image/virtual',
          roles: ['Admin', 'Organizer']
        },
        hidden: true
      }
      ]
    },
    { // 实体设备管理
      path: 'entity',
      component: () => import('@/views/image/virtual'), // Parent router-view
      name: 'entity',
      meta: {
        title: '实体设备管理'
      },
      redirect: '/image/entity',
      children: [
        {
          path: '',
          component: () => import('@/views/image/entity/list'), // Parent router-view
          name: 'entityList',
          meta: {
            title: '实体设备管理'
          }
        },
        {
          path: 'add',
          component: () => import('@/views/image/entity/add'), // Parent router-view
          name: 'addEntity',
          meta: {
            title: '新增',
            activeMenu: '/image/entity'
          },
          hidden: true
        },
        {
          path: 'edit',
          component: () => import('@/views/image/entity/add'), // Parent router-view
          name: 'editEntity',
          meta: {
            title: '编辑',
            activeMenu: '/image/entity'
          },
          hidden: true
        }
      ]
    },
    { // 配置文件管理
      path: 'config',
      component: () => import('@/views/image/virtual'), // Parent router-view
      name: 'config',
      meta: {
        title: '配置文件管理'
      },
      redirect: '/image/config',
      children: [
        {
          path: '',
          component: () => import('@/views/image/config/list'), // Parent router-view
          name: 'configList',
          meta: {
            title: '配置文件管理'
          }
        },
        {
          path: 'add',
          component: () => import('@/views/image/config/add'), // Parent router-view
          name: 'addConfig',
          meta: {
            title: '新增',
            activeMenu: '/image/config'
          },
          hidden: true
        },
        {
          path: 'edit',
          component: () => import('@/views/image/config/add'), // Parent router-view
          name: 'editConfig',
          meta: {
            title: '编辑',
            activeMenu: '/image/config'
          },
          hidden: true
        }
      ]
    }
    // { // 镜像格式转换
    //   path: 'imageFormat',
    //   component: () => import('@/views/image/imageFormat'), // Parent router-view
    //   name: 'imageFormat',
    //   meta: {
    //     title: '镜像格式转换'
    //   },
    //   redirect: '/image/imageFormat',
    //   children: [{
    //       path: '',
    //       component: () => import('@/views/image/imageFormat/list'), // Parent router-view
    //       meta: {
    //         title: '镜像格式转换'
    //       }
    //     },
    //     {
    //       path: 'create',
    //       component: () => import('@/views/image/imageFormat/add'), // Parent router-view
    //       name: 'createImageFormat',
    //       meta: {
    //         title: '新增',
    //         activeMenu: '/image/imageFormat'
    //       },
    //       hidden: true
    //     },
    //     {
    //       path: 'edit',
    //       component: () => import('@/views/image/imageFormat/add'), // Parent router-view
    //       name: 'editImageFormat',
    //       meta: {
    //         title: '编辑',
    //         activeMenu: '/image/imageFormat'
    //       },
    //       hidden: true
    //     }
    //   ]
    // },
    // { // 应用工具管理
    //   path: 'tool',
    //   component: () => import('@/views/image'), // Parent router-view
    //   name: 'toolImage',
    //   meta: {
    //     title: '应用工具管理'
    //   },
    //   redirect: '/image/tool/list',
    //   children: [{
    //       path: 'list',
    //       component: () => import('@/views/image/tool/list'), // Parent router-view
    //       meta: {
    //         title: '应用工具管理'
    //       }
    //     },
    //     {
    //       path: 'create',
    //       component: () => import('@/views/image/tool/create'), // Parent router-view
    //       name: 'createTool',
    //       meta: {
    //         title: '新增',
    //         activeMenu: '/image/tool/list'
    //       },
    //       hidden: true
    //     },
    //     {
    //       path: 'createnext',
    //       component: () => import('@/views/image/tool/create/indexnext'), // Parent router-view
    //       name: 'createnextTool',
    //       meta: {
    //         title: '新增',
    //         activeMenu: '/image/tool/list'
    //       },
    //       hidden: true
    //     },
    //     {
    //       path: 'edit',
    //       component: () => import('@/views/image/tool/create'), // Parent router-view
    //       name: 'editToolImage',
    //       meta: {
    //         title: '编辑',
    //         activeMenu: '/image/tool/list'
    //       },
    //       hidden: true
    //     }, {
    //       path: 'editnext',
    //       component: () => import('@/views/image/tool/create/indexnext'), // Parent router-view
    //       name: 'editnextTool',
    //       meta: {
    //         title: '编辑',
    //         activeMenu: '/image/tool/list'
    //       },
    //       hidden: true
    //     }
    //   ]
    // }
  ]

}

export default imageRouter
