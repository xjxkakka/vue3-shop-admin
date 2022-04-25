<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{firstName}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{secondName}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
// setup中的props的使用    导入 defineProps
import {defineProps} from 'vue'

defineProps({
  firstName:{
    type:String
  },
  secondName:{
    type:String
  }
})
</script>

<style scoped>

</style>