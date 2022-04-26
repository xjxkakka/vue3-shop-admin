<template>
  <Breadcrumb firstName="商品管理" secondName="添加商品"></Breadcrumb>
  <el-card>
    <el-alert title="添加商品信息" center type="info" show-icon :closable="false"/>

    <!--  进度条  -->
    <!--  下面这里-0 让他变成一个数字类型，因为两个地方要使用  -->
    <el-steps class="ElSteps" :space="200" :active="activeIndex - 0" align-center finish-status="success">
      <el-step title="基本信息"/>
      <el-step title="商品参数"/>
      <el-step title="商品属性"/>
      <el-step title="商品图片"/>
      <el-step title="商品内容"/>
      <el-step title="完成"/>
    </el-steps>
    <!--  tab栏区域  -->
    <el-form :model="addForm" ref="addFormRef" label-position="top"
             :rules="addFormRules" label-width="120px">
      <el-tabs :before-leave="handleBeforeLeave" v-model="activeIndex"
               @tab-click="handleTabClick" tab-position="left" class="demo-tabs">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"/>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"/>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number"/>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"/>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
                placeholder="请选择"
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="props"
                @change="handleChange"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <!--    渲染表单的ITEM项      -->
          <el-form-item :label="item.attr_name" v-for="(item,index) in manyTableData" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals" size="small">
              <el-checkbox class="checkboxFont" :label="tag" border v-for="(tag , i ) in item.attr_vals"/>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="(item,index) in onlyTableData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <!--     action 表示图片要上传到的后台API地址
                   list-type  图片预览的效果
                   headers 需要设置请求头 不然会无效token -->
          <!--          <el-upload
                        class="upload-demo"
                        :action="actionURL"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        list-type="picture"
                        :headers="headerObj"
                        :on-success="handleSuccess"
                    >
                      <el-button type="primary">点击上传图片</el-button>
                      <template #file="file">
                        {{ file }}
            </template>
          </el-upload>-->
          <el-upload :action="actionURL" :headers="headerObj"
                     :on-success="handleSuccess"
                     list-type="picture-card">
            <el-icon>
              <Plus/>
            </el-icon>

            <template #file="{ file }">
              <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
                <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in/></el-icon>
          </span>

          <span
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete/></el-icon>
          </span>
        </span>
              </div>
            </template>
          </el-upload>

        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <QuillEditor theme="snow" contentType="html" v-model:content="addForm.goods_introduce"/>
          <el-button type="primary" @click="add" style="margin-top: 15px;">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
  <!-- 图片预览 -->
  <el-dialog title="图片预览" v-model="dialogVisible" width="50%">
    <img w-full :src="dialogImageUrl" class="previewImg" alt="Preview Image"/>
  </el-dialog>
</template>

<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue'
import { onMounted, reactive, ref } from 'vue'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { reqGetCateAttrList, reqGetGoodsCateList } from '../../api'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { reqAddGoodsInfo } from '../../api/goods'
import { useRouter } from 'vue-router'

const router = useRouter()
onMounted(() => {
  // 商品分类列表
  reqGetGoodsCateList().then(res => {
    console.log(res)
    cateList.value = res.data
  })
})
// 进度条控制
const activeIndex = ref(0)
// 表单
const addForm = reactive({
  goods_name: '',
  goods_price: 0,
  goods_number: 0,
  goods_weight: 0,
  goods_cat: [1, 4, 23], // 商品分类的选中项
  goods_introduce: '',
  pics: [],
  attrs: ''
})

const cateList = ref([]); // 商品分类
const manyTableData = ref([]) // 商品参数的数据列表
const onlyTableData = ref([]) // 商品属性的数据列表
// 商品表单
const addFormRef = ref()
const addFormRules = reactive({
  goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
  goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
  goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
})


// 级联选择器
const props = {
  expandTrigger: 'hover',
  label: 'cat_name',
  value: 'cat_id',
}
const handleChange = (value) => {
  // 只能选择三级的，选项中有二级的直接过滤掉
  if (value.length !== 3) {
    addForm.goods_cat = []
  }
  console.log(value)
}
// tabs标签页 切换前校验
const handleBeforeLeave = (activeName, oldActiveName) => {
  // 如果返回false或者 Promise.reject 将停止切换
  if (activeName !== 0 && addForm.goods_cat.length !== 3) {
    ElMessage.error('请选择商品分类!')
    return false
  }
}
let flag = true
let flag2 = true
// 点击tabs标签页的事件
const handleTabClick = (pane) => {
  // 只有访问动态参数面板才发起请求，请求需要商品分类id，如果没选择商品分类 是切不过来的，
  if (activeIndex.value == 1) {
    if (flag) {
      reqGetCateAttrList(addForm.goods_cat[2], 'many').then(res => {
        console.log(res)
        // 处理参数
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        manyTableData.value = res.data
        console.log(manyTableData.value)
      })
      flag = false
    }

  } else if (activeIndex.value == 2) {
    if (flag2) {
      reqGetCateAttrList(addForm.goods_cat[2], 'only').then(res => {
        console.log(res)
        onlyTableData.value = res.data
        console.log(onlyTableData.value)
      })
      flag2 = false
    }
  }
}
// 图片处理
const actionURL = ref('http://127.0.0.1:8888/api/private/v1/upload')
// 设置请求头
const headerObj = { "Authorization": `${localStorage.getItem('token')}` }
// 图片上传成功后的操作
const handleSuccess = (response, uploadFile, uploadFiles) => {
  // console.log(response,uploadFile,uploadFiles)
  // console.log(response)
  // 现在上传成功只代表服务器存储了图片，现在需要拿到服务器返回的地址存储起来，发请求的时候需要带上
  addForm.pics.push({
    "pic": response.data.tmp_path
  })
  // console.log( addForm.pics)

}
// 图片预览需要用到的
const dialogVisible = ref(false)
const dialogImageUrl = ref('')

// 处理移除图片的操作
const handleRemove = (file) => {
  // 删除后更新表单中pics中的数据
  console.log(file)
  // 删除后拿到 tmp_path路径 根据这个路径删除
  addForm.pics = addForm.pics.filter(item => {
    return item.pic !== file.response.data.tmp_path
  })
  console.log(addForm.pics)
}

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

// 商品内容按钮
const add = () => {
  addFormRef.value.validate(valid => {
    if (!valid) {
      console.log(valid)
      ElMessage.error('请填写必要的表单项')
    } else {
      // 执行添加的业务逻辑
      // 处理 addForm.goods_cat 变成字符串但是直接变会报错，所以需要深拷贝一下form表单
      const form = JSON.parse(JSON.stringify(addForm))
      // 深拷贝后处理一下 goods_cat
      form.goods_cat = form.goods_cat.join(',')
      form.attrs = []
      // 处理动态参数
      manyTableData.value.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(',')
        }
        form.attrs.push(newInfo)
      })
      // 处理静态属性
      onlyTableData.value.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        form.attrs.push(newInfo)
      })
      console.log(form)
      reqAddGoodsInfo(form).then(res => {
        console.log(res)
        if (res.meta.status !== 201) {
          ElMessage.error('添加商品失败!')
        } else {
          ElMessage.success('添加商品成功!')
          router.push('/home/goods')
        }
      })
    }
  })
}
</script>

<style lang="scss">
.ElSteps {
  margin: 15px 0;
}

.checkboxFont {
  .el-checkbox__label {
    font-size: 15px !important;
    padding: 3px !important;
  }
}

.previewImg {
  //width: 100%;
}

.ql-editor {
  min-height: 300px !important;
}
</style>