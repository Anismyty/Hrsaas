<template>
  <!-- 弹层组件 -->
  <!-- title需要用到计算属性，判断新增还是编辑 -->
  <el-dialog :title="showTile" :visible="showDialog" @close="handleClose">
    <el-form
      :model="formData"
      label-position="right"
      label-width="120px"
      :rules="rules"
      ref="deptForm"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-10个字符"
        ></el-input>
      </el-form-item>

      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        ></el-input>
      </el-form-item>

      <!-- 下拉选框 -->
      <!-- 只有在聚焦的时候才去获取数据 -->
      <el-form-item label="部门负责人" prop="manager">
        <!-- 注册聚焦事件,【native】获取到原生事件 -->
        <el-select
          v-model="formData.manager"
          placeholder="请选择"
          style="width: 80%"
          @focus="getEmployeesSimple"
        >
          <el-option
            v-for="e in peoples"
            :key="e.id"
            :label="e.username"
            :value="e.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          type="textarea"
          style="width: 80%"
          :rows="3"
          placeholder="1-300个字符"
        ></el-input>
      </el-form-item>
    </el-form>

    <!-- 底部 -->
    <el-row slot="footer" class="dialog-footer">
      <el-col :span="24">
        <el-button @click="btnClose" size="small">取 消</el-button>
        <el-button type="primary" @click="btnOk" size="small">
          确 定
        </el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  inquiryDepartmentList,
  addDepartment,
  inqueryDepartmentById,
  modifyDepartmentById,
} from "@/api/departments";
import { getEmployeesSimple } from "@/api/employees";
export default {
  name: "",
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    //接收点击的当前节点的node
    treeNode: {
      type: Object,
      default: null,
    },
  },
  data() {
    //检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      let isRepeat = false;
      const { depts } = await inquiryDepartmentList();

      if (this.formData.id) {
        //编辑
        isRepeat = depts
          .filter(
            (e) => e.pid === this.treeNode.pid && e.id !== this.treeNode.id
          )
          .some((item) => item.name === value);
      } else {
        //新增
        //去找同级部门下有没有相同的部门名字
        //找到所有的子部门=>在找子部门里面名字有没有和填写的数据名字一样的
        isRepeat = depts
          .filter((e) => {
            return e.pid === this.treeNode.id;
          })
          .some((item) => item.name === value);
      }
      //如果为true，表示重复了
      isRepeat
        ? callback(new Error(`同级部门下已经存在${value}这个部门`))
        : callback();
    };
    //检查整个组织架构编码上是否重复
    const checkCodeRepeat = async (rule, value, callback) => {
      let isRepeat = false;
      const { depts } = await inquiryDepartmentList();
      if (this.formData.id) {
        isRepeat = depts
          .filter((e) => e.id !== this.treeNode.id)
          .some((e) => e.code === value && value);
      } else {
        isRepeat = depts.some((e) => {
          return e.code === value && value;
        });
      }
      isRepeat
        ? callback(new Error(`这个组织架构下已经存在${value}这个编码`))
        : callback();
    };
    return {
      //定义校验规则
      rules: {
        //部门名称同级禁止名称相同
        name: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur",
          },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkNameRepeat,
          },
        ],
        //部门编码在整个组织架构中不能重复
        code: [
          {
            required: true,
            message: "请输入部门编码",
            trigger: "blur",
          },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkCodeRepeat,
          },
        ],
        introduce: [
          {
            required: true,
            message: "请输入部门介绍",
            trigger: "blur",
          },
          {
            min: 1,
            max: 300,
            message: "长度在 1 到 300 个字符",
            trigger: "blur",
          },
        ],
        manager: [
          {
            required: true,
            message: "请选择部门",
            trigger: "blur",
          },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      // 定义表单数据
      formData: {
        name: "",
        code: "",
        introduce: "",
        manager: "",
      },
      peoples: [],
    };
  },
  computed: {
    showTile() {
      return this.formData.id ? "编辑部门" : "新增部门";
    },
  },
  methods: {
    handleClose() {
      (this.formData = {
        name: "",
        code: "",
        introduce: "",
        manager: "",
      }),
        this.$emit("close");
      //清除校验还有表单的数据
      this.$refs.deptForm.resetFields();
    },
    //获取员工简单信息
    async getEmployeesSimple() {
      try {
        this.peoples = await getEmployeesSimple();
      } catch (err) {
        console.log(err);
      }
    },
    btnOk() {
      this.$refs.deptForm.validate(async (isOk) => {
        if (isOk) {
          //区分新增和编辑
          if (this.formData.id) {
            //编辑
            await modifyDepartmentById(this.formData);
          } else {
            //新增
            await addDepartment({ ...this.formData, pid: this.treeNode.id });
          }

          this.$emit("close");
          this.$emit("addDept");
        }
      });
      //点击确定了，关闭弹窗的时候会自动执行btnClose事件
    },
    btnClose() {
      (this.formData = {
        name: "",
        code: "",
        introduce: "",
        manager: "",
      }),
        this.$emit("close");

      //清除之前的校验信息,【重置定义信息】
      this.$refs.deptForm.resetFields();
    },
    //根据ID获取表单详情【这个方法主要是给父组件进行调用】
    async getDeptDetail(id) {
      //不能直接使用this.treeNode.id,因为props是异步的
      this.formData = await inqueryDepartmentById(id);
    },
  },
};
</script>

<style></style>
