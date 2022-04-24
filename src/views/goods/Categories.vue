<template>
  <!--面包屑导航区域-->
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!--  卡片视图区域  -->
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      </el-col>
    </el-row>
    <!--  表格  -->
    <el-table :data="cateData.cateList" border style="width: 100%"
              row-key="cat_id"
    >
      <el-table-column type="index" label="#" width="60"/>
      <el-table-column prop="cat_name" label="分类名称" width="180">
        <template #default="{row}">

        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template #default="{row}">
          <el-icon v-if="!row.cat_deleted" style="color:lightgreen">
            <circle-check-filled/>
          </el-icon>
          <el-icon v-else style="color:red">
            <circle-close-filled/>
          </el-icon>
        </template>
      </el-table-column>
      <!--    排序    -->
      <el-table-column label="排序">
        <template #default="{row}">
          <el-tag v-if="row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="row.cat_level === 1">二级</el-tag>
          <el-tag v-else>三级</el-tag>
        </template>
      </el-table-column>
      <!--   操作    -->
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button type="primary" :icon="Edit" @click="handleEditCate(row.cat_id)">编辑</el-button>
          <el-button type="danger" :icon="Delete" @click="handleDelCate(row.cat_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页区域  -->
    <el-pagination
        v-model:currentPage="state.queryInfo.pagenum"
        v-model:page-size="state.queryInfo.pagesize"
        :page-sizes="[3, 5, 7, 9]"
        layout="prev, pager, next, sizes, total, jumper"
        :total="cateData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
    <!--  添加分类的对话框  -->
    <el-dialog
        v-model="state.dialogVisible"
        :title="categoryForm.Edit?'编辑分类':'添加分类'"
        width="50%"
        @close="addCateDialogClosed"
    >
      <el-form
          ref="ruleFormRef"
          :model="categoryForm"
          :rules="categoryRules"
          label-width="120px"
          class="demo-ruleForm"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="categoryForm.cat_name"/>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
              v-model="categoryForm.selectedKeys"
              :options="categoryForm.parentCateList"
              :props="categoryForm.props"
              @change="handleChange"
              placeholder="请选择"
              clearable
              popper-class="changeDialog_cascader-popper"
          />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addCate"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>
  </el-card>

</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import {
  reqAddCateList,
  reqDeleteCateList,
  reqEditCateInfo,
  reqGetCategoryList,
  reqGetCateInfo,
  reqGetParentCateList
} from '../../api'
import { CircleCheckFilled, CircleCloseFilled, Edit, Delete } from '@element-plus/icons-vue'

onMounted(() => {
  getCateList();
})
// 控制组件状态和接口数据
const state = reactive({
  // 查询条件
  queryInfo: {
    type: 3,
    pagenum: 1,
    pagesize: 5
  },
  dialogVisible: false, // 对话框
})
// 商品分类数据
const cateData = reactive({
  // 商品分类的数据列表，默认为空
  cateList: [],
  // 总条数
  total: 0,
})
// 获取商品分类数据
const getCateList = () => {
  reqGetCategoryList(state.queryInfo).then(res => {
    console.log(res)
    if (res.meta.status !== 200) {
      ElMessage.error('获取商品分类失败!')
    } else {
      // 数据列表，赋值给cateList
      cateData.cateList = res.data.result
      // 为总条数赋值
      cateData.total = res.data.total

    }
  })
}
// 编辑和删除按钮 S
const handleDelCate = (id)=>{
  console.log(id)
  reqDeleteCateList(id).then(res=>{
    // console.log(res)
    if (res.meta.status == 200){
      ElMessage.success('删除成功!')
      getCateList()
    }
  })
}
// 编辑按钮
const handleEditCate = (id)=>{
  reqGetCateInfo(id).then(res=>{
    // console.log(res)
    categoryForm.cat_name = res.data.cat_name
    categoryForm.cat_pid = res.data.cat_pid
    categoryForm.cat_level = res.data.cat_level
    categoryForm.cat_id = res.data.cat_id
    categoryForm.Edit = true
    state.dialogVisible = true
  })
}
// 编辑和删除按钮 E

// 分页 S
// 当前页显示条数
const handleSizeChange = (val) => {
  state.queryInfo.pagesize = val
  getCateList()
}
// 当前点击第几页
const handleCurrentChange = (val) => {
  state.queryInfo.pagenum = val
  getCateList()
}
// 分页 E

// 点击添加分类
const showAddCateDialog = () => {
  state.dialogVisible = true
  getParentCateList()
}
// 添加分类表单 S
// 表单数据源
const categoryForm = reactive({
  cat_name: '', // 将要添加的分类的名称
  cat_pid: 0, // 父级分类的id
  cat_level: 0, // 分类的等级，默认要添加的是1级分类
  cat_id:0, // 修改时需要id
  parentCateList: [], // 父级分类列表
  selectedKeys: [], // 选中的父级分类的ID数组
  // 数据配置
  props: {
    expandTrigger: 'hover',
    // 默认显示value但是我们的数据不是value需要配置
    value: 'cat_id',
    label: 'cat_name',
    checkStrictly: true
  },
  Edit:false,// 区分修改还是添加
})
const ruleFormRef = ref()
const categoryRules = reactive({
  cat_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
  ],
})

// 获取父级分类的数据列表  因为会有添加 所以不能只获取一次每次点击按钮都调用一次
const getParentCateList = () => {
  reqGetParentCateList().then(res => {
    categoryForm.parentCateList = res.data
  })
}
const handleChange = (value) => {
  // value返回选中的id数组
  // 这里的思路 如果不选分类，自己就是最外层的 如果选了就是选中的子分类
  //  0就是最外层，1就是一级分类下的，2就是2级分类下的
  if (value.length > 0) {
    // 设置父级分类的id
    categoryForm.cat_pid = value[value.length - 1]
    // 为当前分类的等级赋值
    categoryForm.cat_level = value.length
  } else {
    // 设置父级分类的id
    categoryForm.cat_pid = 0
    // 为当前分类的等级赋值
    categoryForm.cat_level = 0

  }
}
const addCate = () => {
  ruleFormRef.value.validate(valid => {
    if (!valid) return
    const data = { cat_name: categoryForm.cat_name, cat_pid: categoryForm.cat_pid, cat_level: categoryForm.cat_level }
    if (categoryForm.Edit){
      reqEditCateInfo(categoryForm.cat_id,{ cat_name: categoryForm.cat_name}).then(res=>{
        // console.log(res)
        if (res.meta.status !== 200) {
          ElMessage.error('修改分类失败！')
        } else {
          ElMessage.success('修改分类成功！')
          getCateList()
          state.dialogVisible = false
        }
      })
      categoryForm.Edit = false
    }else{
      reqAddCateList(data).then(res => {
        if (res.meta.status !== 201) {
          ElMessage.error('添加分类失败！')
        } else {
          ElMessage.success('添加分类成功！')
          getCateList()
          state.dialogVisible = false
        }
      })
    }


  })
}
// 监听对话框的关闭时间，重置表单
const addCateDialogClosed = () => {
  ruleFormRef.value.resetFields()
  categoryForm.selectedKeys = []
  categoryForm.cat_pid = 0
  categoryForm.cat_level = 0
  categoryForm.cat_name = ''
  categoryForm.Edit = false

}
// 添加分类表单 E
</script>

<style lang="scss">
.changeDialog_cascader-popper {
  z-index: 10000 !important;

}
</style>