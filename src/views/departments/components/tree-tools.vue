<template>
  <!-- 用了一个行列布局 -->
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%; margin-buttom: 10px"
    :class="{ buisness: isRoout }"
  >
    <!--列：标题【左侧】 -->
    <el-col :span="20">
      <span :class="{ depart: !isRoout, title: isRoout }">
        <i v-if="!isRoout" class="el-icon-s-custom"></i> {{ treenode.name }}
      </span>
    </el-col>
    <!--列：右侧 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col :class="{ topmang: isRoout, mang: !isRoout }">
          {{ treenode.manager }}
        </el-col>
        <!-- 下拉菜单 element -->
        <el-col>
          <!-- 【command】组件封装自带的指令 -->
          <el-dropdown @command="handleCommand">
            <span><i class="el-icon-edit"></i>操作</span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 添加 -->
              <el-dropdown-item command="add"> 添加子部门 </el-dropdown-item>
              <!-- 编辑 -->
              <el-dropdown-item v-if="!isRoout" command="edit">
                编辑部门
              </el-dropdown-item>
              <!-- 删除 -->
              <el-dropdown-item v-if="!isRoout" command="del">
                删除部门
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { deleteDepartmentById } from "@/api/departments";
import addDept from "./addDept.vue";
export default {
  name: "TreeTools",
  props: {
    treenode: {
      required: true,
      type: Object,
    },
    isRoout: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    addDept,
  },
  methods: {
    handleCommand(type) {
      if (type === "add") {
        this.$emit("open", this.treenode);
      } else if (type === "edit") {
        this.$emit("editDepts", this.treenode);
      } else {
        //删除
        this.$confirm("确定删除部门吗？")
          .then(() => {
            return deleteDepartmentById(this.treenode.id);
          })
          .then(() => {
            //删除成功，让父组件去重新获取数据
            this.$emit("delDepts");
            this.$message.success("删除成功");
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.depart {
  color: black;
  font-weight: bold;
  font-family: "楷体";
  font-size: 20px;
}
.title {
  font-size: 25px;
  font-family: "仿宋";
  font-weight: bold;
}
.buisness {
  margin-bottom: 10px;
}
.topmang {
  color: #016924;
  font-weight: bold;
}
.mang {
  color: #38d36c;
}
</style>
