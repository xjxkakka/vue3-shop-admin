<template>
  <div class="common-layout">
    <el-container>
      <!--头部-->
      <el-header>
        <div class="top-title">
          <img src="../assets/logo.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse?'64px':'200px'">
          <LeftNav @changeAside="isCollapse = !isCollapse"></LeftNav>
        </el-aside>
        <!--中间-->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import LeftNav from '../components/LeftNav'
import { ref } from 'vue'

export default {
  name: "Home",
  components: { LeftNav },
  setup () {
    const router = useRouter()
    // 控制折叠 根据状态来改变宽度
    const isCollapse = ref(false)
    // 退出登录
    const logout = () => {
      localStorage.removeItem("token")
      router.push('/login')
    }
    return { logout ,isCollapse}
  }
}
</script>

<style lang="scss" scoped>
.common-layout {
  .el-container {
    height: 100vh;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;

    .top-title {
      display: flex;
      align-items: center;

      img {
        height: 30px;
        width: 30px;
      }

      span {
        font-size: 20px;
        margin-left: 20px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    // 给宽度变化添加过渡效果
    transition: width 0.28s;
  }

  .el-main {
    background-color: #eaedf1;
  }
}
</style>