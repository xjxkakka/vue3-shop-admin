<template>
  <Breadcrumb firstName="商品管理" secondName="商品列表"></Breadcrumb>
  <el-card>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-input
            v-model="reqInfo.queryGoods.query"
            size="large"
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            @clear="handleReset"
        >
          <template #append>
            <el-button :icon="Search" @click="getGoodsListData"/>
          </template>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" size="large" @click="goAddpage">添加商品</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%" border>
      <el-table-column type="index" label="#" width="80" align="center"/>
      <el-table-column prop="goods_name" label="商品名称"/>
      <el-table-column prop="goods_price" label="商品价格(元)" align="center" width="180"/>
      <el-table-column prop="goods_weight" label="商品重量" align="center" width="180"/>
      <el-table-column label="创建时间" width="180" align="center">
        <template #default="{row}">
          {{ formatTime(row.add_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="{row}">
          <el-button type="primary" :icon="Edit" @click="handleEdit(row.goods_id)"></el-button>
          <el-button type="danger" :icon="Delete" @click="handleDelete(row.goods_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页区域  -->
    <el-pagination
        v-model:currentPage="reqInfo.queryGoods.pagenum"
        v-model:page-size="reqInfo.queryGoods.pagesize"
        :page-sizes="[10, 20, 30, 50]"
        layout="prev, pager, next, sizes, total, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </el-card>

</template>

<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue'
import { Search, Edit, Delete } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import { reqDeleteGoodsInfo, reqGoodsList } from '../../api/goods'
import { useRouter } from 'vue-router'

const router = useRouter()
// 清空输入框
const handleReset = ()=>{
  reqInfo.queryGoods.query = ''
  getGoodsListData()
}
const goAddpage = ()=>{
  router.push('/home/add')
}
onMounted(() => {
  getGoodsListData()
})
// 发请求需要用到的参数
const reqInfo = reactive({
  // 商品列表数据
  queryGoods: {
    query: '',// 查询参数
    pagenum: 1,// 当前页面
    pagesize: 10,// 查询条数
  }
})
const getGoodsListData = () => {
  reqGoodsList(reqInfo.queryGoods).then(res => {
    console.log(res)
    if (res.meta.status === 200) {
      tableData.value = res.data.goods
      total.value = res.data.total
    }
  })
}
// 表格 S
const tableData = ref([])
// 处理时间
const formatTime = (time) => {
  const date = new Date(time)
  const year = date.getFullYear() <10?`0${date.getFullYear()}`:date.getFullYear()
  const Month = date.getMonth() <9?`0${date.getMonth()+1}`:date.getMonth()
  const day = date.getDate() <10?`0${date.getDate()}`:date.getDate()
  const hours = date.getHours() <10?`0${date.getHours()}`:date.getHours()
  const min = date.getMinutes() <10?`0${date.getMinutes()}`:date.getMinutes()
  const seconds = date.getSeconds() <10?`0${date.getSeconds()}`:date.getSeconds()
  return `${year}-${Month}-${day} ${hours}:${min}:${seconds}`
}

// 删除按钮
const handleDelete = (id)=>{
  ElMessageBox.confirm(
      '此次操作将永久删除数据，是否继续？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        reqDeleteGoodsInfo(id).then(res=>{
          if (res.meta.status === 200 ){
            getGoodsListData()
            ElMessage.success('删除成功!')
          }
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })

}
// 编辑按钮
// 表格 E
// 分页器 S
// 总条数
const total = ref(0)
// 获取条数
const showSize = ref(10)
const handleSizeChange = (val) => {
  reqInfo.queryGoods.pagesize = val
  getGoodsListData()
}
const handleCurrentChange = (val) => {
  reqInfo.queryGoods.pagenume = val
  getGoodsListData()

}
// 分页器 E
const handleEdit = (id)=>{
  console.log(id)
  ElMessage.warning('该功能正在开发中!')
}

</script>

<style scoped>

</style>