<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
        </template>
      </page-tools>
      <el-table :data="permissonList" style="width: 100%" border row-key="id">
        <el-table-column label="名称" prop="name"> </el-table-column>
        <el-table-column label="标识" prop="code" align="center"> </el-table-column>
        <el-table-column label="描述" prop="description" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button
              @click="addPermission(2, scope.row.id)"
              v-if="scope.row.type === 1"
              size="small"
              type="primary"
              plain
              >添加</el-button
            >
            <el-button size="small" type="warning" plain @click="editBtn(scope.row.id)">编辑</el-button>
            <el-button size="small" type="danger" plain @click="delBtn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 弹层 -->
      <el-dialog :title="showText" :visible.sync="dialogVisible">
        <el-form label-position="right" label-width="80px" :model="formData" :rules="rules" ref="dialogForm">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code"></el-input>
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description"></el-input>
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              inactive-value="0"
              active-value="1"
              v-model="formData.enVisible"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="btnOk">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getALLpermisson, delPermission, addPermission, getPermissionDetail, updatePermission } from '@/api/permission'
import { tranListToTreeDate } from '@/utils'
export default {
  data() {
    return {
      permissonList: [],
      dialogVisible: false,
      value: '',
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async getALLPermission() {
      this.permissonList = tranListToTreeDate(await getALLpermisson(), '0')
    },
    /* 删除 */
    delBtn(id) {
      this.$confirm('确认删除么？')
        .then(async () => {
          await delPermission(id)
        })
        .then(() => {
          this.$message.success('删除成功！')
          this.getALLPermission()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /* 增加 */
    addPermission(type, pid) {
      this.dialogVisible = true
      this.formData.type = type
      this.formData.pid = pid
    },
    /* 编辑 */
    async editBtn(id) {
      this.formData = await getPermissionDetail(id)
      this.dialogVisible = true
    },
    /* 确定按钮 */
    async btnOk() {
      await this.$refs.dialogForm.validate()
      if (this.formData.id) {
        await updatePermission(this.formData)
      } else {
        await addPermission(this.formData)
      }
      this.getALLPermission()
      this.$message.success('添加成功！')
      this.dialogVisible = false
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
    },
    /* 取消按钮 */
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.dialogForm.resetFields()
      this.dialogVisible = false
    }
  },
  created() {
    this.getALLPermission()
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  }
}
</script>

<style></style>
