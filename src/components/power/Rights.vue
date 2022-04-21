<template>
  <!--面包屑导航区域-->
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!--  卡片视图区域-->
  <el-card>
    <el-table :data="state.rightsList" stripe style="width: 100%" border>
      <el-table-column type="index" label="#" width="80" align="center"/>
      <el-table-column prop="authName" label="权限名称"/>
      <el-table-column prop="path" label="路径"/>
      <el-table-column  label="权限等级">
        <template #default="{row}">
          <el-tag v-if="row.level == 0 ">一级</el-tag>
          <el-tag type="success" v-else-if="row.level == 1">二级</el-tag>
          <el-tag type="warning" v-else-if="row.level == 2">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { reqGetRightsList } from '../../api'

const state = reactive({
  // 权限管理菜单
  rightsList: [],
})
onMounted(() => {
  // 获取所有的权限
  getRightsList();
})
// 获取权限列表
const getRightsList = () => {
  reqGetRightsList().then(res => {
    if (res.meta.status !== 200) {
      ElMessage.error('获取权限列表失败!')
    }
    state.rightsList = res.data
  })
}

</script>

<style lang="scss" scoped>

</style>