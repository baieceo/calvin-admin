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
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/perm',
    component: Layout,
    redirect: '/perm/list',
    name: 'Perm',
    meta: { title: '角色管理', icon: 'user' },
    children: [
      {
        path: 'list',
        name: 'PermList',
        component: () => import('@/views/perm/index'),
        meta: { title: '权限管理', icon: 'table' }
      }
    ]
  },

  {
    path: '/role',
    component: Layout,
    redirect: '/role/list',
    name: 'Role',
    meta: { title: '角色管理', icon: 'user' },
    children: [
      {
        path: 'list',
        name: 'RoleList',
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'table' }
      }
    ]
  },

  {
    path: '/account',
    component: Layout,
    redirect: '/account/list',
    name: 'Account',
    meta: { title: '账户管理', icon: 'user' },
    children: [
      {
        path: 'list',
        name: 'AccountList',
        component: () => import('@/views/account/index'),
        meta: { title: '账户列表', icon: 'table' }
      }
    ]
  },

  {
    path: '/message',
    component: Layout,
    redirect: '/message/list',
    name: 'Message',
    meta: { title: '留言管理', icon: 'user' },
    children: [
      {
        path: 'list',
        name: 'MessageList',
        component: () => import('@/views/message/index'),
        meta: { title: '留言列表', icon: 'table' }
      }
    ]
  },

  {
    path: '/apply',
    component: Layout,
    redirect: '/apply/list',
    name: 'Apply',
    meta: { title: '申请管理', icon: 'user' },
    children: [
      {
        path: 'list',
        name: 'ApplyList',
        component: () => import('@/views/apply/index'),
        meta: { title: '申请列表', icon: 'table' }
      }
    ]
  },

  {
    path: '/cms',
    component: Layout,
    redirect: '/cms/type/list',
    name: 'Cms',
    meta: { title: 'CMS管理', icon: 'user' },
    children: [
      {
        path: 'type/list',
        name: 'CmsTypeList',
        component: () => import('@/views/cms/type/list/index'),
        meta: { title: '分类列表', icon: 'table' }
      },
      {
        path: 'type/create',
        name: 'CmsTypeCreate',
        hidden: true,
        component: () => import('@/views/cms/type/item/index'),
        meta: { title: '创建分类', icon: 'table' }
      },
      {
        path: 'type/modify/:id',
        name: 'CmsTypeModify',
        hidden: true,
        component: () => import('@/views/cms/type/item/index'),
        meta: { title: '编辑分类', icon: 'table' }
      },
      {
        path: 'type/viewer/:id',
        name: 'CmsTypeViewer',
        hidden: true,
        component: () => import('@/views/cms/type/item/index'),
        meta: { title: '查看分类', icon: 'table' }
      },


      {
        path: 'page/list',
        name: 'CmsPageList',
        component: () => import('@/views/cms/page/list/index'),
        meta: { title: '页面列表', icon: 'table' }
      },
      {
        path: 'page/create',
        name: 'CmsPageCreate',
        hidden: true,
        component: () => import('@/views/cms/page/item/index'),
        meta: { title: '创建页面', icon: 'table' }
      },
      {
        path: 'page/modify/:id',
        name: 'CmsPageModify',
        hidden: true,
        component: () => import('@/views/cms/page/item/index'),
        meta: { title: '编辑页面', icon: 'table' }
      },
      {
        path: 'page/viewer/:id',
        name: 'CmsPageViewer',
        hidden: true,
        component: () => import('@/views/cms/page/item/index'),
        meta: { title: '查看页面', icon: 'table' }
      },

      {
        path: 'resource',
        name: 'CmsResourceList',
        component: () => import('@/views/cms/resource/index'),
        meta: { title: '资源管理', icon: 'table' }
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
