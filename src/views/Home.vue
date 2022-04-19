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
        <!--左侧-->
        <el-aside width="200px">Aside</el-aside>
        <!--中间-->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: "Home",
  setup () {
    const router = useRouter()
    // 退出登录
    const logout = ()=>{
      localStorage.removeItem("token")
      router.push('/login')
    }
    return {logout}
  }
}
</script>

<style lang="scss" scoped>
.common-layout{
  .el-container{
    height: 100vh;
  }
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color:white;
    .top-title{
      display: flex;
      align-items: center;
      img{
        height: 30px;
        width: 30px;
      }
      span{
        font-size: 20px;
        margin-left: 20px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
  }
  .el-main{
    background-color: #eaedf1;
  }
}
</style>