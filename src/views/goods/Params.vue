<template>
  <!--  面包屑   -->
  <Breadcrumb firstName="商品管理" secondName="参数列表"></Breadcrumb>

  <!-- 卡片视图区域 -->
  <el-card>
    <!--  警告区域  -->
    <el-alert title="注意：只允许为第三级分类设置相关参数" :closable="false" type="warning"/>

    <!--  选中商品分类区域  -->
    <el-row class="cat_opt">
      <el-col>
        <span style="margin-right: 10px">选中商品分类:</span>
        <!--    选中商品分类的级联选择框    -->
        <el-cascader
            v-model="selectedCateKeys"
            :options="cateData.cateList"
            :props="props"
            @change="handleChange"
            placeholder="请选择"
        />
      </el-col>
    </el-row>

    <!--  tab 标签页区域  -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <!--   添加动态参数的面板   -->
      <el-tab-pane label="动态参数" name="many">
        <!--   添加参数的按钮     -->
        <el-button type="primary" :disabled="isBtnDisabled" @click="dialogVisible = true">添加参数</el-button>
        <!--    动态参数表格    -->
        <!--    要加上row-key 不然有bug    -->
        <el-table :data="tableData" style="width: 100%" border   row-key="attr_id">
          <!--     展开行     -->
          <el-table-column type="expand" width="80">
            <template #default="{row}" >
              <div class="tag-wrap">
                <el-tag
                    v-for="(tag,index) in row.attr_vals"
                    :key="index"
                    class="mx-1"
                    closable
                    style="margin-right: 10px"
                    @close="handleTagClose(row,index)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                    v-if="row.inputVisible"
                    ref="InputRef"
                    v-model="row.inputValue"
                    class="ml-1 w-20 input-new-tag"
                    size="small"
                    @keyup.enter="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)"
                />
                <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(row)">
                  + 新的标签
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" width="80"/>
          <el-table-column prop="attr_name" label="参数名称"/>
          <el-table-column label="操作">
            <template #default="{row}">
              <el-button type="primary" :icon="Edit" @click="handleEdit(row.attr_id)">编辑</el-button>
              <el-button type="danger" :icon="Delete" @click="handleDelete(row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--   添加静态属性的面板   -->
      <el-tab-pane label="静态属性" name="only">
        <!--    添加属性的按钮    -->
        <el-button type="primary" :disabled="isBtnDisabled" @click="dialogVisible = true">添加属性</el-button>
        <!--    静态参数表格    -->
        <el-table :data="tableData" style="width: 100%" border row-key="attr_id">
          <!--     展开行     -->
          <el-table-column type="expand" width="80">
            <template #default="{row}" >
              <div class="tag-wrap">
                <el-tag
                    v-for="(tag,index) in row.attr_vals"
                    :key="index"
                    class="mx-1"
                    closable
                    style="margin-right: 10px"
                    @close="handleTagClose(row,index)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                    v-if="row.inputVisible"
                    ref="InputRef"
                    v-model="row.inputValue"
                    class="ml-1 w-20 input-new-tag"
                    size="small"
                    @keyup.enter="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)"
                />
                <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(row)">
                  + 新的标签
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" width="80"/>
          <el-table-column prop="attr_name" label="参数名称"/>
          <el-table-column label="操作">
            <template #default="{row}">
              <el-button type="primary" :icon="Edit" @click="handleEdit(row.attr_id)">编辑</el-button>
              <el-button type="danger" :icon="Delete" @click="handleDelete(row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  <!--  添加面板  -->
  <el-dialog
      v-model="dialogVisible"
      :title="`添加${tableTitle}`"
      width="50%"
      @close="handleClose"
  >
    <el-form
        ref="ruleFormRef"
        :model="addForm"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
    >
      <el-form-item :label="`${tableTitle}:`" prop="attr_name">
        <el-input v-model="addForm.attr_name"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addParams"
        >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
  <!--  修改面板  -->
  <el-dialog
      v-model="EditdialogVisible"
      :title="`编辑${tableTitle}`"
      width="50%"
      @close="handleEditClose"
  >
    <el-form
        ref="EditFormRef"
        :model="EditForm"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
    >
      <el-form-item :label="`${tableTitle}:`" prop="attr_name">
        <el-input v-model="EditForm.attr_name"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="EditdialogVisible = false">取消</el-button>
        <el-button type="primary" @click="EditParams"
        >确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import Breadcrumb from '../../components/Breadcrumb'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import {
  reqAddCateParams,
  reqDelParams,
  reqEditParams,
  reqGetCateAttrList,
  reqGetGoodsCateList,
  reqQueryParams
} from '../../api'

// 商品分类数据
const cateData = reactive({
  cateList: [], // 商品分类列表
})
onMounted(() => {
  getCateList()
})
// 获取 选中的商品分类列表
const getCateList = () => {
  reqGetGoodsCateList().then(res => {
    console.log(res)
    cateData.cateList = res.data
  })
}
// 获取参数列表的数据
const getParamsData = () => {
  if (cateId.value !== null){
    reqGetCateAttrList(cateId.value, activeName.value).then(res => {
      console.log(res)
      // 返回的标签是一个字符串，标签提前处理好变成一个数组
      res.data.forEach(item=>{
        if (item.attr_vals.length>1){
          item.attr_vals = item.attr_vals.split(',')
        }
        // 给数据添加两个参数控制 tag 显示隐藏以及 内容
        item.inputVisible = false
        item.inputValue = ''
      })
      tableData.value = res.data
      console.log(tableData.value)
    })
  }

}
// 修改编辑提交参数 封装 含TAG修改
const EditAndDelParams = (catId,attrId,data)=>{
  reqEditParams(catId,attrId,data).then(res=>{
    if (res.meta.status !== 200){
      ElMessage.error('修改参数失败!')
    }else{
      ElMessage.success('修改参数成功!')

    }
  })
}
// 级联选择框 S
const props = reactive({
  expandTrigger: 'hover',
  value: 'cat_id',
  label: 'cat_name'
})
// 选中的值，返回一个数组
const selectedCateKeys = ref([])
// 当前选中的三级分类的ID
const cateId = computed(() => {
  return selectedCateKeys.value[2] || null
})
// 级联选择发生变化执行，返回选中的数组
const handleChange = (value) => {
  // 只能选中三级分类其他的都不能选中 如果数组长度不对直接重置
  if (value.length !== 3) {
    selectedCateKeys.value = []
    // 如果选中不是三级分类会保留上一次数据，要清空
    tableData.value = []

  } else {
    // 发请求
    getParamsData()

  }
}
// 级联选择框 E

// tab标签 S
const activeName = ref('many')
const tableData = ref([])
const dialogVisible = ref(false)
const tableTitle = computed(() => {
  return activeName.value === 'many' ? '动态参数' : '静态属性'
})
// 表单
const addForm = reactive({
  attr_name: ''
})
const ruleFormRef = ref()
const validateName = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(`请输入${tableTitle.value}名称`))
  } else {
    callback()
  }
}
const rules = reactive({
  attr_name: [{ required: true, validator: validateName, trigger: 'blur' }],
})
const handleClose = () => {
  // 共用组件一定要写下面这两个
  ruleFormRef.value.resetFields()
  addForm.attr_name = ''
}
// 选中了三级分类才能点击按钮
const isBtnDisabled = computed(() => {
  return selectedCateKeys.value.length !== 3
})
const handleClick = (tab, event) => {
  // console.log(tab.props.label, event)
  // 点击切换的时候也发送请求
  getParamsData()
}
// 添加dialog 确认按钮
const addParams = () => {
  ruleFormRef.value.validate(valid => {
    if (!valid) return
    reqAddCateParams(cateId.value, { attr_name: addForm.attr_name, attr_sel: activeName.value }).then(res => {
      if (res.meta.status !== 201) {
        ElMessage.error('添加参数失败！')
      } else {
        ElMessage.success('添加参数成功！')
        // 重新发请求
        getParamsData()
        dialogVisible.value = false
      }
    })
  })
}
// tab标签 E
// 编辑按钮和面板 S
const EditdialogVisible = ref(false)
const EditFormRef = ref()
const EditForm = reactive({
  attr_name: '',
  attr_id: ''
})
const handleEditClose = () => {
  // 共用组件一定要写下面这两个
  EditFormRef.value.resetFields()
  EditForm.attr_name = ''
}
const handleEdit = (attrId) => {
  // 发送查询请求  第一个参数三级分类ID,第二个参数产品id，第三个参数静态还是动态
  reqQueryParams(cateId.value, attrId, { attr_sel: activeName.value }).then(res => {
    console.log(res)
    EditdialogVisible.value = true
    EditForm.attr_name = res.data.attr_name
    EditForm.attr_id = res.data.attr_id

  })
}
// 点击编辑按钮
const EditParams = () => {
  //  第一个参数三级分类ID,第二个参数产品id,第三个参数请求体 attr_name,attr_sel
  const data = {
    attr_name: EditForm.attr_name,
    attr_sel: activeName.value
  }
  EditAndDelParams(cateId.value, EditForm.attr_id, data)
  /*reqEditParams(cateId.value, EditForm.attr_id, data).then(res => {
    if (res.meta.status !== 200) {
      ElMessage.error('修改失败!')
    } else {
      getParamsData()
      ElMessage.success('修改成功!')
      EditdialogVisible.value = false

    }
  })*/
}
// 删除按钮
const handleDelete = (id)=>{
  ElMessageBox.confirm(
      '此操作将永久删除该参数，是否继续？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        reqDelParams(cateId.value, id).then(res => {
          console.log(res)
          if (res.meta.status !== 200) {
            ElMessage.error('删除失败!')
          } else {
            getParamsData()
            ElMessage.success('删除成功!')
          }
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除！',
        })
      })

}
// 编辑按钮和面板 E
// 标签TAG  S
const InputRef = ref()

const handleTagClose = (row,index) => {
  // 进来先删除数据
  row.attr_vals.splice(index,1)
  const data = {
    attr_name:row.attr_name,
    attr_sel:row.attr_sel,
    // 传回去是一个字符串
    attr_vals:  row.attr_vals.join(',')
  }
  EditAndDelParams(row.cat_id, row.attr_id, data)
  console.log(row,index)
}

const showInput = (row) => {
  row.inputVisible = true
  nextTick(() => {
    InputRef.value.focus()
  })
}

const handleInputConfirm = (row) => {
  // 不合法直接返回出去
  if (row.inputValue.trim().length === 0) {
    row.inputVisible = false
    row.inputValue = ''
  }else{
      // 合法数据发请求
    // 首先在原数据上更新，不要重新发请求 不然会刷新页面
    // 如果返回的参数是空的话，默认是字符串，所以我要判断一下
    if (typeof row.attr_vals == 'string'){
      row.attr_vals = []
      row.attr_vals.push(row.inputValue)
    }else{
      row.attr_vals.push(row.inputValue)
    }
    const data = {
      attr_name:row.attr_name,
      attr_sel:row.attr_sel,
      // 传回去是一个字符串
      attr_vals:  row.attr_vals.join(',')
    }
    // 原数据添加后发请求
    EditAndDelParams(row.cat_id,row.attr_id,data)
   /* reqEditParams(row.cat_id,row.attr_id,data).then(res=>{
      if (res.meta.status !== 200){
        ElMessage.error('修改参数失败!')
      }else{
        ElMessage.success('修改参数成功!')

      }
    })*/
    row.inputVisible = false
    row.inputValue = ''
  }

}
// 标签TAG  E
</script>

<style lang="scss">
.cat_opt {
  margin: 15px 0;
}
.tag-wrap{
  padding-left: 80px !important;
  .el-tag{
    margin-right: 20px;
  }
}
.input-new-tag{
  width: 120px;
}
</style>