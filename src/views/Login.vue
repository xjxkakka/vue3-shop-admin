<template>
  <div class="login_container">
    <div class="login_box">
      <h1>登录</h1>
      <el-form :model="form" class="login_form" :rules="rules"  ref="formRef">
        <!--  prop是校验规则需要使用到的 -->
        <el-form-item prop="username">
          <el-input size="large" v-model="form.username" placeholder="请输入账号">
            <template #prefix>
              <i class="iconfont icon-users"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="large" v-model="form.password" placeholder="请输入密码" type="password">
            <template #prefix>
              <i class="iconfont icon-3702mima"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" >登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive ,ref } from 'vue'
import { reqLogin } from '../api'
import { useRouter } from 'vue-router'

export default {
  name: "Login",
  setup () {
    const router = useRouter();
    // 获取表单
    const formRef = ref(null)
    const form = reactive({
      username: 'admin',
      password: '123456'
    })

    const rules = reactive({
      username: [
        { required: true, message: '请输入登录名称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入登录密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
      ]
    })
    // 重置表单
    const resetForm = () => {
      // console.log(formRef.value)
      if (!formRef.value) return
      formRef.value.resetFields()
    }
    // 提交表单预校验
    const submitForm = () => {
      if (!formRef.value) return
      formRef.value.validate((valid) => {
        if (valid) {
          reqLogin(form).then(res=>{
            console.log(res)
            if (res.meta.status !== 200) return  ElMessage.error('登录失败!')
            ElMessage.success('登录成功！')
            localStorage.setItem("token",res.data.token)
            router.push('/home')
          })
          console.log('submit!',valid)
        } else {
          console.log('error submit!',valid)
          return false
        }
      })
    }
    return { form, rules ,formRef,resetForm,submitForm }
  }
}
</script>

<style lang="scss">
.login_container {
  background-color: #2b4b6b;
  height: 100vh;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    h1 {
      font-size: 25px;
      text-align: center;
      line-height: 50px;
    }

    .login_form {
      position: absolute;
      left: 50%;
      top: 57%;
      transform: translate(-50%, -50%);
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;

      .el-input__prefix {
        left: 10px;
      }

      .el-form-item__content {
        justify-content: center;
      }
    }
  }
}

</style>