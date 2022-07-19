<template>
  <div>
    <!-- 图片上传组件 -->
    <el-upload
      action="#"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :on-change="change"
      :on-preview="preview"
      :on-remove="remove"
      :limit="1"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
      :http-request="request"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width: 180px"></el-progress>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
/* 实际开发不建议那么写，有泄露的风险 */
var COS = require('cos-js-sdk-v5')
const cos = new COS({
  SecretId: 'AKIDfEZmswoSxW0SuFUfdNstjOq30jLsGRP8',
  SecretKey: 'YqrmeXM2UheMsBShmhPtCIAoFSQ8duz3'
})
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      currentID: null,
      //进度条百分比
      percent: 0,
      showPercent: false,
      name: ''
    }
  },
  methods: {
    /* 上传文件前检查 */
    beforeUpload(file) {
      /* 检查文件类型 */
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式！')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 检查通过一定要返回true
      this.currentID = file.uid
      this.showPercent = true
      return true
    },
    /* 上传操作 */
    request(params) {
      this.name = params.file.name
      cos.putObject(
        {
          Bucket: 'personresours-1312955690', //填入您自己的存储桶，必须字段
          Region: 'ap-shanghai', // 存储桶所在地域，例如ap-beijing，必须字段
          Key: params.file.name, //存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
          StorageClass: 'STANDARD', //固定写法【标准】
          Body: params.file, // 上传文件对象
          //进度的回调函数
          onProgress: (progressData) => {
            this.percent = progressData.percent * 100
          }
        },
        (err, data) => {
          if (!err && data.statusCode === 200) {
            // 此时说明文件上传成功
            this.fileList = this.fileList.map((item) => {
              if (item.uid === this.currentID) {
                /* upload属性为后期服务 */
                return { url: 'http://' + data.Location, upload: true }
              } else {
                return item
              }
            })
          }
          setTimeout(() => {
            this.showPercent = false
            this.percent = 0
          }, 2000)
        }
      )
    },
    /* 添加图片 */
    change(file, fileList) {
      this.fileList = fileList.map((item) => item)
    },
    /* 移除图片 */
    remove(file, fileList) {
      if (this.name !== '') {
        cos.deleteObject(
          {
            Bucket: 'personresours-1312955690' /* 填入您自己的存储桶，必须字段 */,
            Region: 'ap-shanghai' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
            Key: this.name
          },
          function (err, data) {}
        )
        this.name = ''
      }

      this.fileList = this.fileList.filter((img) => img.uid !== file.uid)
    },
    /* 预览图片 */
    preview(file) {
      this.dialogImageUrl = file.url
      //   console.log(file)
      this.dialogVisible = true
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  }
}
</script>

<style>
.disabled .el-upload {
  display: none !important;
}
</style>
