<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="table-card">
        <el-tabs v-model="activeName">
          <!-- 第一个标签页 -->
          <el-tab-pane label="角色管理" name="first">
            <!-- 按钮 -->
            <el-button size="small" type="primary" @click="addStaff"> +新增角色 </el-button>
            <!-- table表格 -->
            <el-table :data="staffList" border style="width: 100%; margin: 20px 0">
              <!-- 第一列 -->
              <el-table-column type="index" label="序号" width="180" align="center"></el-table-column>
              <!-- 第二列 -->
              <el-table-column prop="name" label="角色" width="180" align="center"></el-table-column>
              <!-- 第三列 -->
              <el-table-column prop="description" label="描述" align="center"></el-table-column>
              <!-- 第四列 -->
              <el-table-column label="操作" align="center" width="300">
                <!-- 组件自带功能，结构传入的数据 -->
                <template slot-scope="{ row }">
                  <el-button type="success" size="small" @click="assign(row.id)">分配权限</el-button>
                  <el-button type="primary" size="small" @click="editStaff(row.id)"> 编辑 </el-button>
                  <el-button type="danger" size="small" @click="delStaff(row.id)"> 删除 </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 底部分页 -->
            <el-row type="flex" justify="center">
              <el-pagination
                layout="prev, pager, next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- 第二个标签页 -->
          <el-tab-pane label="公司信息" name="second">
            <!-- 头部警告 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 表单区域 -->
            <el-form label-position="right" label-width="80px" :model="companyInofo" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input v-model="companyInofo.name" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyInofo.companyAddress" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司邮箱">
                <el-input v-model="companyInofo.mailbox" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="companyInofo.remarks" disabled style="width: 400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 弹出层 -->
      <el-dialog :title="roleForm.id ? '编辑角色' : '新增角色'" width="50%" :visible="showDialog" @close="btnCancel">
        <el-form label-position="right" label-width="80px" :model="roleForm" :rules="rules" ref="formRule">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="btnCancel">取消</el-button>
          <el-button type="primary" @click="btnOk">确定</el-button>
        </span>
      </el-dialog>
      <!-- 权限分配弹出层 -->
      <el-dialog :visible.sync="showPromise" title="分配权限" @close="perCancel">
        <el-tree
          :default-checked-keys="defaultList"
          :check-strictly="true"
          show-checkbox
          :data="perData"
          :props="defaultProps"
          node-key="id"
          ref="perTree"
        ></el-tree>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="mini" @click="perOK">确定</el-button>
            <el-button type="warning" size="mini" @click="perCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAllStaff, inqueryCompanyById, delStaffByID, editStaffById, getStaffById, addStaff } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getALLpermisson, assignPer } from '@/api/permission'
import { tranListToTreeDate } from '@/utils'
export default {
  name: 'setting',
  data() {
    return {
      activeName: 'first',
      staffList: [],
      companyInofo: {
        name: '浙江奇妙鱼童装有限公司',
        place: '浙江温州梦幻隧道第五斗55号',
        email: 'a11225475@gmail.com',
        tips: '神奇的服装公司，给你不一样的体验'
      },
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空' }]
      },
      showDialog: false,
      showPromise: false,
      perData: [],
      defaultProps: {
        label: 'name'
      },
      perUserId: null,
      defaultList: []
    }
  },
  methods: {
    async getAllStaff(params) {
      const { total, rows } = await getAllStaff(params)
      this.staffList = rows
      this.page.total = total
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getAllStaff(this.page)
    },
    async getCompanyInfo() {
      this.companyInofo = await inqueryCompanyById(this.companyId)
    },
    //删除角色
    delStaff(id) {
      this.$confirm('确认删除改角色么')
        .then(() => {
          delStaffByID(id)
        })
        .then(() => {
          if (this.staffList.length === 1) {
            this.page.page -= 1
          }
          this.getAllStaff(this.page)
          this.$message.success('删除角色成功')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //新增角色
    addStaff() {
      this.showDialog = true
    },
    //编辑角色
    async editStaff(id) {
      //数据回血
      this.roleForm = await getStaffById(id)
      this.showDialog = true
    },
    // 弹层的按钮
    async btnOk() {
      try {
        await this.$refs.formRule.validate()
        if (this.roleForm.id) {
          //编辑
          await editStaffById(this.roleForm)
        } else {
          //新增
          await addStaff(this.roleForm)
        }
        this.getAllStaff(this.page)
        this.$message.success('更新数据成功')
        this.showDialog = false
      } catch (err) {
        console.log(err)
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.formRule.resetFields()
      this.showDialog = false
    },
    /* 分配权限 */
    async assign(id) {
      this.perUserId = id
      const { permIds } = await getStaffById(id)
      this.defaultList = permIds
      const result = await getALLpermisson()
      this.perData = tranListToTreeDate(result, '0')
      this.showPromise = true
    },
    async perOK() {
      /* 调用树的方法，可以获得树上获得选中的数据组成的数组 */
      const choseArr = this.$refs.perTree.getCheckedKeys()
      await assignPer({ id: this.perUserId, permIds: choseArr })
      this.$message.success('分配权限成功！')
      this.showPromise = false
      this.defaultList = []
    },
    perCancel() {
      this.showPromise = false
      this.perUserId = null
      this.defaultList = []
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getAllStaff(this.page)
    this.getCompanyInfo()
  }
}
</script>

<style lang="scss" scoped>
.table-card {
  padding: 30px 20px;
  font-size: 14px;
}
</style>
