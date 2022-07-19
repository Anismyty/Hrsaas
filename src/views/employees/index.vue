<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 头部 -->
      <PageTools :showBefore="true">
        <!-- 记录 -->
        <span slot="before">共{{ page.total }}条记录</span>
        <!-- 按钮 -->
        <div slot="after">
          <el-button size="small" type="danger" @click="exportData">普通Excel导出</el-button>
          <el-button size="small" type="info" @click="exportData2">复杂表头Excel导出</el-button>
          <el-button size="small" type="success" @click="$router.push({ path: '/import' })">Excel导入</el-button>
          <el-button size="small" type="primary" @click="dialogVisible = true"> 新增员工 </el-button>
        </div>
      </PageTools>

      <!-- table面板 -->
      <el-card class="tabel-pannel">
        <el-table :data="tableData" style="width: 100%" border v-loading="loading">
          <el-table-column type="index" prop="date" label="序号" width="50" align="center" />
          <el-table-column sortable prop="username" label="姓名" width="100" align="center" />
          <el-table-column label="头像" width="100" align="center">
            <template slot-scope="scope">
              <img
                @click="showQCode(scope.row.staffPhoto)"
                class="avator"
                v-imagerror="defaultImg"
                :src="scope.row.staffPhoto"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column sortable prop="mobile" label="手机号" align="center" />
          <el-table-column sortable prop="workNumber" label="工号" align="center" />
          <el-table-column
            prop="formOfEmployment"
            sortable
            label="聘用形式"
            :formatter="formatEmployment"
            align="center"
          />
          <el-table-column sortable prop="departmentName" label="部门" align="center" />
          <el-table-column sortable prop="timeOfEntry" label="入职时间" align="center">
            <!-- 作用插槽方法1-->
            <template slot-scope="scope">
              {{ scope.row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column sortable label="状态" width="80">
            <!-- 作用插槽方法2-->
            <template v-slot="scope">
              <el-switch
                :value="scope.row.enableState === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column width="300" label="操作" align="center">
            <!-- 作用插槽方法3 【直接解构】-->
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push({ path: `/employees/detail/${row.id}` })"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="getRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-row type="flex" justify="center">
          <el-pagination
            layout="prev, pager, next"
            :total="page.total"
            :current-page="page.page"
            :page-size="page.pagesize"
            @current-change="change"
          />
        </el-row>
      </el-card>
      <!-- table面板 -->

      <!-- 弹出框 -->
      <!-- sync修饰符是子组件改变父组件的语法糖 -->
      <AddEmployee :dialogVisible.sync="dialogVisible" />
      <!-- 二维码 -->
      <el-dialog title="二维码" :visible.sync="showCode" style="width: 30%">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas"></canvas>
        </el-row>
      </el-dialog>
      <!-- 分配角色 -->
      <el-dialog title="分配角色" :visible.sync="rolePart">
        <el-row>
          <el-checkbox-group v-model="targetRole">
            <el-checkbox v-for="(e, i) in allRoles" :key="i" :label="e.id" border style="margin-top: 10px">
              {{ e.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-row>
        <el-row slot="footer" class="dialog-footer">
          <el-col :span="24">
            <el-button @click="btnCancel" size="small"> 取 消 </el-button>
            <el-button type="primary" @click="btnOk" size="small"> 提 交 </el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import defaultImg from '@/assets/common/head.jpg'
import { getEmployees, delEmployees, getUserBaseInfo, assignRole } from '@/api/employees'
import { getAllStaff } from '@/api/setting'
//引入枚举数据
import EmployeENum from '@/api/constant/employees'
import { formatDate } from '@/filters'
//组件
import AddEmployee from './components/addEmployee.vue'
let QRCode = require('qrcode')
export default {
  name: 'Employees',
  data() {
    return {
      defaultImg,
      chose1: true,
      tableData: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      loading: false,
      dialogVisible: false,
      showCode: false, //二维码弹层
      allRoles: [],
      targetRole: [],
      rolePart: false,
      roleId: null
    }
  },
  components: { AddEmployee },
  methods: {
    async getEmployeesList() {
      this.loading = true
      const { total, rows } = await getEmployees(this.page)
      this.page.total = total
      this.tableData = rows
      this.loading = false
    },
    //页码
    change(newPage) {
      this.page.page = newPage
      this.getEmployeesList()
    },
    //格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      //需要把cellValue进行枚举
      let obj = EmployeENum.hireType.find((e) => e.id === Number(cellValue))
      return obj ? obj.value : '未知'
    },
    //删除
    async delEmployee(id) {
      try {
        await this.$confirm('确定删除该员工么？')
        await delEmployees(id)
        this.$message.success('删除员工成功')
        if (this.tableData.length === 1) {
          this.page.page -= 1
        }
        this.getEmployeesList()
      } catch (err) {
        console.log(err)
      }
    },
    /* 导出excel文件 */
    /* 【简单】 */
    /* 1.格式化请求数据 */
    formatInfo(headers, rows) {
      return rows.map((item) => {
        return Object.keys(headers).map((title) => {
          /* 判断字段 */
          if (headers[title] === 'timeOfEntry' || headers[title] === 'correctionTime') {
            return formatDate(item[headers[title]])
          } else if (headers[title] === 'formOfEmployment') {
            const obj = EmployeENum.hireType.find((target) => target.id === Number(item[headers[title]]))
            return obj ? obj.value : '未知'
          }
          return item[headers[title]]
        })
      })
    },
    /* 2.导出行为 */
    exportData() {
      const headers = {
        手机号: 'mobile',
        姓名: 'username',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async (excel) => {
        const { rows } = await getEmployees({ page: 1, size: this.page.total })
        /* 修改数据的结构 */
        /* excel是引入文件的导出对象 */
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data: this.formatInfo(headers, rows),
          filename: '员工信息'
        })
      })
    },
    /* 【复杂】 */
    exportData2() {
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async (excel) => {
        const { rows } = await getEmployees({ page: 1, size: this.page.total })
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        /* 合并单元格 */
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        /* 修改数据的结构 */
        /* excel是引入文件的导出对象 */
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data: this.formatInfo(headers, rows),
          filename: '员工信息',
          multiHeader,
          merges
        })
      })
    },
    /* 二维码*/
    showQCode(url) {
      if (url) {
        this.showCode = true
        /* 这个函数表示前面的函数执行完毕才会执行里面的代码 */
        this.$nextTick(() => {
          QRCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户还未上传头像！')
      }
    },
    /* 分配角色 */
    /* 获取所有角色列表 */
    async getAllRole() {
      const { rows } = await getAllStaff()
      this.allRoles = rows
    },
    async getRole(id) {
      this.roleId = id
      this.rolePart = true
      const { roleIds } = await getUserBaseInfo(id)
      if (roleIds === null) {
        console.log(1)
      } else {
        this.targetRole = roleIds
      }
    },
    btnCancel() {
      this.rolePart = false
      this.targetRole = []
      this.roleId = null
    },
    async btnOk() {
      await assignRole({ id: this.roleId, roleIds: this.targetRole })
      this.$message.success("更新角色成功！")
      this.rolePart = false
      this.targetRole = []
      this.roleId = null
    }
  },
  created() {
    this.getEmployeesList()
    this.getAllRole()
  }
}
</script>

<style lang="scss" scoped>
.tabel-pannel {
  padding: 10px 10px;
  font-size: 14px;
}
.avator {
  width: 50px;
  height: 50px;
  border-radius: 50px;
}
</style>
