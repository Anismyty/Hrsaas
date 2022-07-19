/* 
负责全局注册的组件
*/
import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UplpadExcel'
import ImageUpload from '@/components/ImageUpload'
import Print from 'vue-print-nb'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.use(Print)
  }
}
