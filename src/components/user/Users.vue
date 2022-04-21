<template>
  <!--面包屑导航区域-->
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!--  卡片视图区域-->
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <!--        当点击搜索按钮的是执行 getUserList 方法 清空的时候也执行-->
        <el-input
            v-model="query"
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            @clear="getUserList"
        >
          <template #append>
            <el-button @click="getUserList">
              <template #icon>
                <el-icon>
                  <search/>
                </el-icon>
              </template>
            </el-button>
          </template>
        </el-input>
      </el-col>

      <el-col :span="4">
        <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!--    点击添加用户 弹出对话框-->

    <el-dialog
        v-model="dialogVisible"
        title="添加用户"
        width="50%"
        @close="handleClose"
    >

      <el-form
          ref="ruleFormRef"
          :model="addForm"
          :rules="addRules"
          label-width="120px"
          class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile"/>
        </el-form-item>
      </el-form>

      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUser"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>

    <!--表格-->
    <el-table :data="userList" border stripe style="width: 100%">
      <el-table-column align="center" type="index" label="#" width="50"/>
      <el-table-column prop="username" label="姓名"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="mobile" label="电话"/>
      <el-table-column prop="role_name" label="角色"/>
      <el-table-column align="center" label="状态">
        <template #default="{row}">
          <el-switch v-model="row.mg_state" @change="userStateChanged(row)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{row}">
          <!--修改按钮-->
          <el-button type="primary" @click="showEditDialog(row.id)">
            <template #icon>
              <el-icon>
                <edit/>
              </el-icon>
            </template>
          </el-button>

          <!--删除按钮-->
          <el-button type="danger" @click="removeUserById(row.id)">
            <template #icon>
              <el-icon>
                <Delete/>
              </el-icon>
            </template>
          </el-button>
          <!--分配角色按钮  enterable 鼠标离开按钮后隐藏,不关掉会挡住上一个-->
          <el-tooltip
              class="box-item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
          >
            <el-button type="warning" @click="setRole(row)">
              <template #icon>
                <el-icon>
                  <Setting/>
                </el-icon>
              </template>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--    分页-->
    <el-pagination
        v-model:currentPage="pagenum"
        v-model:page-size="pagesize"
        :page-sizes="[1, 2, 5, 10]"
        layout="prev, pager, next, sizes, total, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </el-card>
  <!--修改用户信息对话框-->
  <el-dialog
      v-model="editdialogVisible"
      title="修改用户"
      width="50%"
      @close="editDialogClosed"
  >
    <el-form :model="editForm" label-width="120px" ref="editFormRef" :rules="addRules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editForm.username" disabled/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"/>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editdialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editUserInfo"
        >确认</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- 分配角色的对话框 -->
  <el-dialog
      v-model="setRoleDialogVisible"
      title="提示"
      width="50%"
      @close="setRoleDialogClosed"
  >
    <div class="userInfo">
      <p>当前的用户:<span>{{ userInfo.username }}</span></p>
      <p>当前的角色:<span>{{ userInfo.role_name }}</span></p>
      <p>分配新角色:
        <el-select :popper-append-to-body="false" popper-class="changeDialog_select-popper"
            v-model="selectedRoleId"  placeholder="请选择" size="large">
          <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
          />
        </el-select>

      </p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
        >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { Search, Edit, Delete, Setting } from '@element-plus/icons-vue'
import {
  reqAddUser, reqChangeRoles,
  reqChangeState,
  reqDeleteUserInfo,
  reqEditUserInfo,
  reqUserDetail,
  reqUserInfo,
  reqUserList
} from '../../api'
import { onMounted, reactive, ref, toRefs } from 'vue'

export default {
  name: "Users",
  components: { Search, Edit, Delete, Setting },
  setup () {
    onMounted(() => {
      getUserList();
    })
    // 自定义校验 S
    // 验证邮箱的规则
    const checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-0_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback()
      }
      callback(new Error('请输入一个合法的邮箱'))
    }
    // 校验手机号码
    const checkMobile = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        // 合法的手机号码
        return callback()
      }
      callback(new Error('请输入一个合法的手机号码'))
    }
    // 自定义校验 E

    const state = reactive({
      userList: [],
      total: 0,
      // 控制对话框
      dialogVisible: false,
      // 添加表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单校验这里没有写自定义方法校验，如果写自定义方法一定要把方法写在前面不然获取不到
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '密码的长度在3-10个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }

        ],
      },
      // 修改按钮的对话框控制
      editdialogVisible: false,
      editForm: {},
      // 分配角色权限
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      roleList:[],
      // 已选中的id值
      selectedRoleId:''
    })
    // 获取用户列表的参数对象
    const queryInfo = reactive({
      query: '',
      pagenum: 1,
      pagesize: 2
    })
    const getUserList = () => {
      reqUserList(queryInfo).then(res => {
        console.log('初次渲染数据', res)
        if (res.meta.status !== 200) {
          return ElMessage.error('获取用户列表失败!')
        }
        state.userList = res.data.users
        state.total = res.data.total
      })
    }
    // 分页S
    // 显示条数
    const handleSizeChange = (val) => {
      queryInfo.pagesize = val
      getUserList();
      console.log(`${val} 条数据`)
    }
    // 点击第几页
    const handleCurrentChange = (val) => {
      queryInfo.pagenum = val
      getUserList();
      console.log(`当前第: ${val}页`)
    }
    // 分页E
    // 用户状态更新
    const userStateChanged = (row) => {
      console.log(row)
      reqChangeState(row.id, row.mg_state).then(res => {
        console.log(res)
        if (res.meta.status !== 200) {
          // 如果不等于200滑块也发生了变化就重置回去并且提示用户
          row.mg_state = !row.mg_state
          return ElMessage.erroe('更新用户状态失败')
        }
        // 提示成功
        ElMessage.success('更新用户状态成功!')
      })
    }
    // 对话框S
    // 表单
    const ruleFormRef = ref(null);
    // 关闭时清空数据
    const handleClose = () => {
      ruleFormRef.value.resetFields();
    }
    // 点击确认
    const addUser = () => {
      // 判断表单是否通过校验
      ruleFormRef.value.validate((valid) => {
        if (!valid) return
        // 发起添加用户网络请求
        reqAddUser(state.addForm).then(res => {
          console.log(res)
          if (res.meta.status !== 201) ElMessage.error('创建失败')

          // 创建成功
          ElMessage.success('创建成功');
          state.dialogVisible = false
          // 重新发请求渲染
          getUserList();
        })

      })
    }
    // 对话框E

    // 三个点击按钮方法 S
    const editFormRef = ref(null)
    // 修改按钮
    const showEditDialog = (id) => {
      reqUserDetail(id).then(res => {
        console.log(res)
        if (res.meta.status !== 200) {
          state.editdialogVisible = false;
          return ElMessage.error('获取用户信息失败！')
        } else {
          state.editForm = res.data
          state.editdialogVisible = true
        }
      })
    }
    // 修改按钮的表单操作
    const editDialogClosed = () => {
      editFormRef.value.resetFields();
    }
    // 修改按钮 提交表单的操作
    const editUserInfo = () => {
      editFormRef.value.validate((valid) => {
        if (!valid) ElMessage.error('提交表单失败')
        // 发请求
        reqEditUserInfo(state.editForm.id,
            { email: state.editForm.email, mobile: state.editForm.mobile }).then(res => {
          // console.log(res)
          if (res.meta.status !== 200) {
            return ElMessage.error('修改用户信息失败！')
          } else {
            // 关闭对话框
            state.editdialogVisible = false
            // 刷新数据
            getUserList();
            // 提示修改成功
            ElMessage.success('更新用户信息成功!');
          }
        })
      })
    }
    // 删除按钮
    const removeUserById = (id) => {
      ElMessageBox.confirm(
          '此操作将永久删除该用户，是否继续?',
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        // 发请求
        reqDeleteUserInfo(id).then(res => {
          console.log(res)
          if (res.meta.status !== 200) new Promise.reject('删除失败')
          ElMessage({
            type: 'success',
            message: '删除成功！',
          })
          // 重新发起请求渲染
          getUserList();
        }).catch(() => {
          ElMessage({
            type: 'info',
            message: '删除失败！',
          })
        })

      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '删除失败！',
        })
      })
    }

    // 分配角色
    const setRole = (row) => {
      console.log(row)
      state.userInfo = row

      // 在展示对话框之前，获取所有角色的列表
      reqUserInfo().then(res=>{
        state.roleList = res.data
      })
      state.setRoleDialogVisible = true
    }
    // 对话框的确认按钮
    const saveRoleInfo = ()=>{
      reqChangeRoles(state.userInfo.id,state.selectedRoleId).then(res=>{
        if(res.meta.status!==200){
          ElMessage.error('更新角色失败!')
        }else{
          ElMessage.success('更新角色成功!')
          getUserList()
          state.setRoleDialogVisible = false
        }
      })
    }
    const setRoleDialogClosed = ()=>{
      state.selectedRoleId = ''
      state.userInfo = {}
    }
    // 三个点击按钮方法 E
    return {
      ...toRefs(state), ...toRefs(queryInfo),
      handleSizeChange,
      userStateChanged, removeUserById, setRole,setRoleDialogClosed,
      getUserList, ruleFormRef, editFormRef, editUserInfo,saveRoleInfo,
      handleCurrentChange, handleClose, addUser, showEditDialog, editDialogClosed
    }
  }
}
</script>

<style lang="scss" >
.userInfo {
  font-size: 15px;

  p {
    line-height: 40px;
  }

  span {
    margin-left: 10px;
  }
}
.changeDialog_select-popper{
  z-index: 1000!important;
  top: auto !important;
  left: auto !important;
}
</style>