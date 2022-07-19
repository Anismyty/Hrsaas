<template>
  <div class="tabs">
    <!--closable这里说明home是不能关闭的-->
    <el-tag
      style="margin-right: 10px; cursor: pointer"
      :key="tag.name"
      size="small"
      v-for="(tag, index) in tabsList"
      :closable="tag.fullPath !== '/dashboard'"
      :disable-transitions="false"
      @close="handleClose(tag, index)"
      @click="changeMenu(tag)"
      :effect="$route.fullPath === tag.fullPath ? 'dark' : 'plain'"
    >
      {{ tag.title }}
    </el-tag>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    //获取vuex的标签集合数据
    ...mapGetters(['tabsList'])
  },
  methods: {
    //关闭标签
    handleClose(tag, index) {
      let length = this.tabsList.length - 1
      //vuex调方法的另一种写法
      this.$store.commit('app/closeTab', tag)
      // 如果关闭的标签不是当前路由的话，就不跳转
      if (tag.fullPath !== this.$route.fullPath) {
        return
      }
      // 关闭的标签是最右边的话，往左边跳转一个
      if (index === length) {
        this.$router.push({ path: this.tabsList[index - 1].fullPath })
      } else {
        // 否则往右边跳转
        this.$router.push({ path: this.tabsList[index].fullPath })
      }
    },
    changeMenu(item) {
      this.$router.push({ path: item.fullPath })
      this.$store.commit('app/selectMenu', item)
    }
  }
}
</script>

<style></style>
