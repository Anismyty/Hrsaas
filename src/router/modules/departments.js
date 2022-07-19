import Layout from '@/layout'
export default {
  path: '/departments', //一级路由地址
  name: 'departments', //后期做权限需要
  component: Layout,
  children: [
    {
      //这里不用写 表示 /employees 不但有layout布局，还有employees页面
      path: '',
      component: () => import('@/views/departments'),
      meta: { title: '组织架构', icon: 'tree' }
    }
  ]
}
