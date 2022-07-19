import Layout from '@/layout'
export default {
  path: '/approvals', //一级路由地址
  name: 'approvals', //后期做权限需要
  component: Layout,
  children: [
    {
      //这里不用写 表示 /employees 不但有layout布局，还有employees页面
      path: '',
      component: () => import('@/views/approvals'),
      meta: { title: '审批', icon: 'tree-table' }
    }
  ]
}
