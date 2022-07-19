<template>
  <div>
    <UploadExcel :onSuccess="onSuccess" />
  </div>
</template>

<script>
import { addEmployeesBatch } from '@/api/employees'
export default {
  methods: {
    async onSuccess({ header, results }) {
      /* 得到excel表格传入的转化格式 【中文】 */
      const userRules = {
        手机号: 'mobile',
        姓名: 'username',
        入职日期: 'timeOfEntry',
        转正日期: 'correctionTime',
        工号: 'workNumber'
      }
      /* 将中文对应的值给英文对应的值 */
      let afterResults = []
      results.forEach((item) => {
        let userInfo = {}
        Object.keys(item).forEach((e) => {
          if (userRules[e] === 'timeOfEntry' || userRules[e] === 'correctionTime') {
            /* 数据只能接收时间格式，不能是字符串 */
            userInfo[userRules[e]] = new Date(this.formatDate(item[e], '/'))
          } else {
            userInfo[userRules[e]] = item[e]
          }
        })
        afterResults.push(userInfo)
      })
      await addEmployeesBatch(afterResults)
      this.$message.success('导入excel成功！')
      this.$router.go(-1)
    },
    /* 转换excel表格的时间 */
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style></style>
