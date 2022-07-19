<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="登陆账户设置" name="first">
            <el-form
              label-position="right"
              label-width="80px"
              :model="userInfo"
              style="margin-left: 400px; margin-top: 30px"
              :rules="rules"
              ref="userForm"
            >
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input
                  placeholder="请输入修改的密码"
                  v-model="userInfo.password2"
                  style="width: 300px"
                  type="password"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveInfo">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情" name="second">
            <!-- 组件使用方法一： -->
            <!-- <UserInfo /> -->
            <!-- 组件使用方法二 -->
            <!-- 需要定义变量 -->
            <!-- 动态组件，可以用按钮切换组件 -->
            <component :is="UserInfo" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息" name="third">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserBaseInfo, saveUserInfo } from '@/api/employees'
import UserInfo from './UserInfo.vue'
import JobInfo from './JobInfo.vue'
export default {
  name: 'detail',
  components: { UserInfo, JobInfo },
  data() {
    return {
      UserInfo,
      activeName: 'first',
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUerInfo() {
      const res = await getUserBaseInfo(this.userId)
      this.userInfo = { ...this.userInfo, ...res }
    },
    saveInfo() {
      this.$refs.userForm
        .validate()
        .then(async () => {
          await saveUserInfo({ ...this.userInfo, password: this.userInfo.password2 })
          this.$message.success('修改用户信息成功！')
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  created() {
    this.getUerInfo()
  }
}
</script>

<style lang="less" scoped></style>
