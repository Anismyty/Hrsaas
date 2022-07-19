import Layout from '@/layout'
export default {
  path: '/employees', //一级路由地址
  name: 'employees', //后期做权限需要
  component: Layout,
  children: [
    {
      //这里不用写 表示 /employees 不但有layout布局，还有employees页面
      path: '',
      component: () => import('@/views/employees'),
      meta: { title: '员工管理', icon: 'people' }
    },
    {
      path: 'detail/:id?', //？含义表示可传可不传
      component: () => import('@/views/employees/components/detail'),
      hidden: true,
      meta: { title: '员工详情' }
    },
    {
      path: 'print/:id?',
      component: () => import('@/views/employees/print'),
      hidden: true,
      meta: { title: '员工打印' }
    }
  ]
}
