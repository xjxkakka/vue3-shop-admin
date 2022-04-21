<template>
  欢迎来到德莱联盟
  <el-button :icon="Search" circle/>
  <el-button type="primary" :icon="Edit" circle/>
  <el-button type="success" :icon="Check" circle/>
  <el-button type="info" :icon="Message" circle/>
  <el-button type="warning" :icon="Star" circle/>
  <el-button type="danger" :icon="Delete" circle/>
{{state.num}}


</template>

<script  setup>
import { Check, Delete, Edit, Message, Search, Star, } from '@element-plus/icons-vue'
import { reactive, toRefs ,ref } from 'vue'


const ruleFormRef = ref()
const ruleForm = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});
const state = reactive({
  num:1,
  type:['123']
});




</script>
<style scoped>

</style>