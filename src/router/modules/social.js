import Layout from "@/layout";
export default {
  path: "/social", //一级路由地址
  name: "social_securitys", //后期做权限需要
  component: Layout,
  children: [
    {
      //这里不用写 表示 /employees 不但有layout布局，还有employees页面
      path: "",
      component: () => import("@/views/social"),
      meta: { title: "社保", icon: "table" },
    },
  ],
};
