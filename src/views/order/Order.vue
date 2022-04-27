<template>
  <!--  面包屑   -->
  <Breadcrumb firstName="订单管理" secondName="订单列表"></Breadcrumb>

  <el-card>
    <el-row>
      <el-col :span="8">
        <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch"/>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <!--  订单表格  -->
    <OrderTable :tableData="orderInfo.orderList"></OrderTable>
    <!--  分页区域  -->
    <el-pagination
        v-model:currentPage="queryInfo.pagenum"
        v-model:page-size="queryInfo.pagesize"
        :page-sizes="[10, 20, 30, 50]"
        layout="prev, pager, next, sizes, total, jumper"
        :total="orderInfo.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script setup>
import Breadcrumb from '@/components/Breadcrumb'
import OrderTable from './OrderTable'
import { Search } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import { reqGetOrderList } from '../../api/order'

// 查询的参数
const queryInfo = reactive({
  query: '',
  pagenum: 1,
  pagesize: 10
})
const handleSearch = ()=>{
  getOrderList()
}
const orderInfo = reactive({
  orderList: [],
  total: 0
})
onMounted(() => {
  getOrderList()
})
const getOrderList = () => {
  reqGetOrderList(queryInfo).then(res => {
    console.log(res)
    if (res.meta.status !== 200) {
      ElMessage.error('获取订单列表失败')
    } else {
      orderInfo.total = res.data.total
      orderInfo.orderList = res.data.goods
    }
  })
}
// 分页器
// 获取条数
const handleSizeChange = (val) => {
  queryInfo.pagesize = val
  getOrderList()
}
const handleCurrentChange = (val) => {
  queryInfo.pagenume = val
  getOrderList()

}

</script>

<style scoped>

</style>