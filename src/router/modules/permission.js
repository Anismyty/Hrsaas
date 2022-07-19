import Layout from "@/layout";
export default {
  path: "/permission", //一级路由地址
  name: "permission",//后期做权限需要
  component: Layout,
  children: [
    {
      //这里不用写 表示 /employees 不但有layout布局，还有employees页面
      path: "",
      component: () => import("@/views/permission"),
      meta: { title: "权限管理", icon: "lock" },
    },
  ],
};
