<template>
  <el-table :data="tableData" stripe style="width: 100%;margin-top: 15px" border>
    <el-table-column type="index" label="#" width="80" align="center"/>
    <el-table-column prop="order_number" label="订单编号" align="center"/>
    <el-table-column prop="order_price" label="订单价格" width="150" align="center"/>
    <el-table-column prop="pay_status" label="是否付款" align="center" width="150">
      <template #default="{row}">
        <el-tag v-if="row.pay_status !== '0'" class="ml-2" type="success">已付款</el-tag>
        <el-tag v-else class="ml-2" type="danger">未付款</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="is_send" label="是否发货" align="center" width="150"/>
    <el-table-column label="下单时间" width="180" align="center">
      <template #default="{row}">
        {{ formatTime((row.create_time*1000)) }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" width="180">
      <template #default="{row}">
        <el-button type="primary" :icon="Edit" @click="showBox"/>
        <el-button type="success" :icon="AddLocation" @click="progressVisible = true"/>

      </template>
    </el-table-column>
  </el-table>

  <!-- 编辑对话框 -->
  <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="50%"
      @close="handleClose"
  >
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
    >
      <el-form-item label="省市区/县" prop="address1">
        <el-cascader
            v-model="ruleForm.address1"
            :options="cityData"
            :props="props"
            @change="handleChange"
            placeholder="请选择城市"
            popper-class="changeDialog_cascader-popper"
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="address2">
        <el-input v-model="ruleForm.address2"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
        >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
    <!-- 物流进度假数据 -->
  <el-dialog
      v-model="progressVisible"
      title="Tips"
      width="50%"
  >
    <el-timeline>
      <el-timeline-item
          v-for="(activity, index) in progressInfo.data"
          :key="index"
          :timestamp="activity.time"
      >
        {{ activity.context }}
      </el-timeline-item>
    </el-timeline>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="progressVisible = false">取消</el-button>
        <el-button type="primary" @click="progressVisible = false"
        >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { Edit, AddLocation } from '@element-plus/icons-vue'
import { defineProps, reactive, ref } from 'vue'
// 导入地图的JS文件
import cityData from './citydata'

defineProps({
  tableData: {
    type: Array,
    default: []
  }
})
// 处理时间
const formatTime = (time) => {
  const date = new Date(time)
  const year = date.getFullYear() < 10 ? `0${date.getFullYear()}` : date.getFullYear()
  const Month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth()
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
  return `${year}-${Month}-${day} ${hours}:${min}:${seconds}`
}
const showBox = () => {
  dialogVisible.value = true
}
// 对话框
const dialogVisible = ref(false)
const handleClose = () => {
  ruleFormRef.value.resetFields()
  ruleForm.address1 = []
  ruleForm.address2 = ''
}
const ruleFormRef = ref()
const ruleForm = reactive({
  address1: [],
  address2: '',
})
const rules = reactive({
  address1: [{ required: true, message: '请选择地区', trigger: 'blur' }],
  address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
})
// 级联选择器
// 这里没有使用这个来接收，使用表单的来接收了
const selectValue = ref([])
const props = {
  expandTrigger: 'hover',
}
// 改变后执行的函数，返回选中的值
const handleChange = (value) => {
  console.log(value)
}
// 假数据物流进度
const progressInfo = reactive(
    {
      "data": [
        {
          "time": "2018-05-10 09:39:00",
          "ftime": "2018-05-10 09:39:00",
          "context": "已签收,感谢使用顺丰,期待再次为您服务",
          "location": ""
        },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        },
        {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }
      ],
      "meta": { "status": 200, "message": "获取物流信息成功！" }
    }
)
const progressVisible = ref(false)
</script>

<style lang="scss" >
.demo-ruleForm{
  .el-cascader {
    width: 100% !important;
  }
}
.changeDialog_cascader-popper {
  z-index: 10000 !important;
}

</style>