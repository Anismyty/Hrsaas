<template>
  <el-dialog :visible="dialogVisible" title="新增员工" @close="btnCancel">
    <!-- 表单 -->
    <el-form :rules="rules" :model="userInfo" label-position="right" label-width="120px" ref="formPannel">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="userInfo.username" placeholder="请输入姓名" style="width: 50%" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="userInfo.mobile" placeholder="请输入手机号" style="width: 50%" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker type="date" placeholder="请选择日期" v-model="userInfo.timeOfEntry" style="width: 50%" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="userInfo.formOfEmployment" style="width: 50%" placeholder="请选择">
          <el-option v-for="e in EmployeeEnum.hireType" :key="e.id" :label="e.value" :value="e.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="userInfo.workNumber" placeholder="请输入工号" style="width: 50%" />
      </el-form-item>
      <!-- 点击部门，展示一个组织架构的树 -->
      <el-form-item label="部门" prop="departmentName">
        <el-cascader
          v-model="userInfo.departmentName"
          :options="departmentOption"
          :props="departRule"
          @focus="getDepartmentList"
          style="width: 50%"
          placeholder="请选择"
          :show-all-levels="false"
          v-loading="loading"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="转正时间" prop="timeOfEntry">
        <el-date-picker type="date" placeholder="选择日期" v-model="userInfo.correctionTime" style="width: 50%" />
      </el-form-item>
    </el-form>
    <!-- 表单 -->

    <!-- 在tempalte标签上v-slot:footer -->
    <el-row slot="footer" class="dialog-footer">
      <el-col :span="24">
        <el-button @click="btnCancel" size="small"> 取 消 </el-button>
        <el-button type="primary" @click="btnOk" size="small"> 确 定 </el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { inquiryDepartmentList } from '@/api/departments'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployees } from '@/api/employees'
//引入递归方法
import { tranListToTreeDate } from '@/utils'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      /* 响应数据 */
      userInfo: {
        username: '',
        mobile: '',
        timeOfEntry: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        correctionTime: ''
      },
      /* 校验规则 */
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户名为1-4位' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      //联级接收的树形数据
      departmentOption: [],
      //联级框配置
      departRule: {
        value: 'name',
        label: 'name',
        //是否严格的遵守父子节点不互相关联
        checkStrictly: true,
        expandTrigger: 'hover',
        //是否返回完整节点数据
        emitPath: false
      },
      loading: false,
      //聘用形式
      EmployeeEnum
    }
  },
  methods: {
    //获得部门数据
    async getDepartmentList() {
      this.loading = true
      const { depts } = await inquiryDepartmentList()
      this.departmentOption = tranListToTreeDate(depts, '')
      this.loading = false
    },
    async btnOk() {
      try {
        await this.$refs.formPannel.validate()
        await addEmployees(this.userInfo)
        //通知父组件【实例】更新数据【新方法】
        this.$parent.getEmployeesList && this.$parent.getEmployeesList()
        this.$parent.dialogVisible = false
      } catch (err) {
        console.log(err)
      }
    },
    btnCancel() {
      this.userInfo = {
        username: '',
        mobile: '',
        timeOfEntry: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        correctionTime: ''
      }
      //移除校验
      this.$refs.formPannel.resetFields()
      //【update:dialogVisible】跟sync有关联
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style></style>
