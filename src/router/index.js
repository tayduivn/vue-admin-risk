import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      hidden: true,
      component: () => import('@/views/dashboard/index'),
      meta: { title: '导航', icon: 'dashboard' }
    }]
  },

  {
    path: '/sourceRiskConfig',
    component: Layout,
    redirect: '/sourceRiskConfig/list',
    name: '信任源管理',
    meta: { title: '信任源管理', icon: 'source' },
    children: [
      {
        path: 'list',
        name: 'sourceRiskConfigList',
        component: () => import('@/views/sourceRiskConfig/list'),
        meta: { title: '信任源列表', icon: 'list' }
      },
      {
        path: 'insert',
        name: 'sourceRiskConfigInsert',
        component: () => import('@/views/sourceRiskConfig/insert'),
        meta: { title: '新增信任源', icon: 'save' }
      },
      {
        path: 'update',
        name: 'sourceRiskConfigUpdate',
        hidden: true,
        component: () => import('@/views/sourceRiskConfig/update'),
        meta: { title: '更新信任源', icon: 'save' }
      }
    ]
  },
  {
    path: '/sourceRiskProduct',
    component: Layout,
    redirect: '/sourceRiskProduct/list',
    name: '信任源风控服务管理',
    meta: { title: '信任源风控服务管理', icon: 'sourceRisk' },
    children: [
      {
        path: 'list',
        name: 'sourceRiskProductList',
        component: () => import('@/views/sourceRiskProduct/list'),
        meta: { title: '信任源风控服务列表', icon: 'list' }
      },
      {
        path: 'insert',
        name: 'sourceRiskProductInsert',
        component: () => import('@/views/sourceRiskProduct/insert'),
        meta: { title: '新增信任源风控服务', icon: 'save' }
      },
      {
        path: 'update',
        name: 'sourceRiskProductUpdate',
        hidden: true,
        component: () => import('@/views/sourceRiskProduct/update'),
        meta: { title: '更新信任源风控服务', icon: 'save' }
      }
    ]
  },
  {
    path: '/atomRiskProduct',
    component: Layout,
    redirect: '/atomRiskProduct/list',
    name: '原子风控服务管理',
    meta: { title: '原子风控服务管理', icon: 'atomRisk' },
    children: [
      {
        path: 'atomRiskTypeList',
        name: 'atomRiskTypeList',
        component: () => import('@/views/atomRiskType/list'),
        meta: { title: '原子风控项列表', icon: 'list' }
      },
      {
        path: 'list',
        name: 'atomRiskProductList',
        component: () => import('@/views/atomRiskProduct/list'),
        meta: { title: '原子风控服务列表', icon: 'list' }
      },
      {
        path: 'insert',
        name: 'Form1',
        component: () => import('@/views/atomRiskProduct/insert'),
        meta: { title: '新增原子风控服务', icon: 'save' }
      },
      {
        path: 'detail',
        name: 'atomRiskProductDetail',
        hidden: true,
        component: () => import('@/views/atomRiskProduct/detail'),
        meta: { title: '信任源风控服务详情', icon: 'save' }
      },
      {
        path: 'update',
        name: 'atomRiskProductUpdate',
        hidden: true,
        component: () => import('@/views/atomRiskProduct/update'),
        meta: { title: '更新信任源风控服务', icon: 'save' }
      }
    ]
  },
  {
    path: '/statistical',
    component: Layout,
    redirect: '/statistical/apiAccessRecordList',
    name: '统计管理',
    meta: { title: '统计管理', icon: 'statistical' },
    children: [
      {
        path: 'apiAccessRecordList',
        name: 'apiAccessRecordList',
        component: () => import('@/views/apiAccessRecord/list'),
        meta: { title: 'API风控服务记录', icon: 'list' }
      },
      {
        path: 'detail',
        name: 'apiAccessRecordDetail',
        hidden: true,
        component: () => import('@/views/apiAccessRecord/detail'),
        meta: { title: 'API风控服务记录详情', icon: 'save' }
      },
      {
        path: 'sourceRiskProductS',
        name: 'sourceRiskProductS',
        component: () => import('@/views/statistical/list'),
        meta: { title: '信任源服务统计', icon: 'sourceInfo' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
