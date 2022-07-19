<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <el-tabs>
          <el-tab-pane label="组织架构">
            <div class="content">
              <!-- 头部组件 -->
              <TreeTools :treenode="company" :isRoout="true" @open="open" />
              <!-- data:数据；props:解析数据的属性选择 -->
              <el-tree :props="defaultProps" class="filter-tree" :data="DepartmentsList" default-expand-all ref="tree">
                <!-- slot-scope='obj' 接收传递给插槽的数据 -->
                <!-- 插槽内容会循环多次【根据data数据】 -->
                <TreeTools
                  slot-scope="{ data }"
                  :treenode="data"
                  @delDepts="getDepartmentsList"
                  @open="open"
                  @editDepts="editDepts"
                />
              </el-tree>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 弹层放这里 -->
      <!-- 给组件添加ref,就可以得到组件实例，也可以得到挂载在上面的方法 -->
      <addDept
        @close="showDialog = false"
        :showDialog="showDialog"
        :treeNode="node"
        @addDept="getDepartmentsList"
        ref="addDept"
      />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { inquiryDepartmentList } from '@/api/departments'
import { tranListToTreeDate } from '@/utils/index'
import addDept from './components/addDept.vue'

export default {
  name: 'Departments',
  components: {
    TreeTools,
    addDept
  },
  data() {
    return {
      filterText: '',
      DepartmentsList: [],
      company: { name: '浙江奇妙鱼童装有限公司', manager: '负责人', id: '' },
      defaultProps: {
        label: 'name'
      },
      showDialog: false,
      //记录点击添加按钮当前字节点的node
      node: null
    }
  },

  methods: {
    async getDepartmentsList() {
      try {
        const { depts } = await inquiryDepartmentList()
        //将depts转化为树形结构【用递归】
        this.DepartmentsList = tranListToTreeDate(depts, '')
      } catch (err) {
        console.log(err)
      }
    },
    open(node) {
      this.showDialog = true
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      //调用子组件的方法
      this.$refs.addDept.getDeptDetail(node.id)
    }
  },

  created() {
    this.getDepartmentsList()
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 0px 20px;
  font-size: 14px;
}
.content {
  padding: 30px 150px;
}
.el-tree {
  ::v-deep .el-tree-node {
    margin-top: 10px;
  }
}
</style>
