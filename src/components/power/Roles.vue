<template>
  <!--面包屑导航区域-->
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!--  卡片视图区域-->
  <el-card>
    <!--添加角色按钮区域   用el-row 主要让他占满一行-->
    <el-row>
      <el-col>
        <el-button type="primary" @click="state.dialogFormVisible = true">添加角色</el-button>
      </el-col>
    </el-row>

    <el-dialog v-model="state.dialogFormVisible" @close="handleClose"
               :title="state.rolesForm.roleId?'编辑角色':'添加角色'">
      <el-form :model="state.rolesForm" ref="ruleFormRef">
        <el-form-item label="角色名称" label-width="140px" prop="roleName">
          <el-input v-model="state.rolesForm.roleName"/>
        </el-form-item>
        <el-form-item label="角色描述" label-width="140px" prop="roleDesc">
          <el-input v-model="state.rolesForm.roleDesc"/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addRoles()"
        >确认</el-button>
      </span>
      </template>
    </el-dialog>

    <!--    角色列表区域-->
    <!--    row-key="id"  需要加上这个不然展开的权限删除后会自动折叠起来-->
    <el-table :data="state.rolesList" border stripe row-key="id">
      <!--展开列-->
      <el-table-column type="expand">
        <template #default="{row}">
          <el-row v-for="(item,i) in row.children" :key="item.id"
                  :class="['bdbottom',i === 0 ?'bdtop':'']" class="rights-wrap vcenter">
            <!--  一级权限  -->
            <el-col :span="5">
              <el-tag
                  size="large"
                  closable
                  @close="removeRightById(row,item.id)"
              >
                {{ item.authName }}
              </el-tag>
              <el-icon>
                <caret-right/>
              </el-icon>
            </el-col>
            <!--            二级权限    -->
            <el-col :span="19">
              <el-row v-for="(item2,i2) in item.children" :key="item2.id"
                      :class="[i2 === 0?'':'bdtop','vcenter']">
                <el-col :span="6">
                  <el-tag
                      size="large"
                      closable
                      type="success"
                      @close="removeRightById(row,item2.id)"
                  >
                    {{ item2.authName }}
                  </el-tag>
                  <el-icon>
                    <caret-right/>
                  </el-icon>
                </el-col>
                <!--                三级权限    -->
                <el-col :span="18">
                  <el-tag
                      size="large"
                      closable
                      type="warning"
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      @close="removeRightById(row,item3.id)"
                  >
                    {{ item3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

        </template>
      </el-table-column>
      <!--索引列-->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button type="primary" :icon="Edit" @click="editRolesInfo(row.id)">编辑</el-button>
          <el-button type="danger" :icon="Delete" @click="deleteRolesInfo(row.id)">删除</el-button>
          <el-button type="warning" :icon="Setting" @click="showSetRightDialog(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!--  分配权限对话框   -->
  <el-dialog
      v-model="state.rightsDialogVisible"
      title="提示"
      width="50%"
      @close="state.defKeys = []"
  >
    <!--    data 数据源   props树形控件的属性绑定对象-->
    <!--     show-checkbox 添加单选框
             default-expand-all 默认展开全部
             node-key 唯一标识
             default-checked-keys 默认勾选节点 传数组 里面放id进来
             -->
    <el-tree :data="state.rightsList" node-key="id" ref="treeRef"
             default-expand-all show-checkbox :default-checked-keys="state.defKeys"
             :props="state.TreeProps"/>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.rightsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="allotRights"
        >确认</el-button>
      </span>
    </template>
  </el-dialog>


</template>

<script setup>
import { Delete, Edit, Setting, CaretRight } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import {
  reqAddRoles,
  reqDeleteRolesInfo,
  reqDeleteRolesRights,
  reqEditRolesInfo, reqGetRightsTree,
  reqGetRolesList, reqRolesAuthorization,
  reqRolesInfo
} from '../../api'

const state = reactive({
  // 权限管理菜单
  rolesList: [],
  dialogFormVisible: false,
  rolesForm: {
    roleId: '',
    roleName: '',
    roleDesc: ''
  },
  // 权限的数据列表
  rightsList: [],
  rightsDialogVisible: false,
  // 树形控件的属性绑定对象
  TreeProps: {
    label: 'authName',
    children: 'children'
  },
  // 默认选中的节点Id值数组
  defKeys: [],

})
// 表单
const ruleFormRef = ref();
onMounted(() => {
  // 获取所有的权限
  getRolesList();
})
// 获取权限列表
const getRolesList = () => {
  reqGetRolesList().then(res => {
    if (res.meta.status !== 200) {
      ElMessage.error('获取权限列表失败!')
    }
    state.rolesList = res.data
  })
}

// 添加角色确认按钮
const addRoles = () => {
  // 如果有ID代表是编辑，没有就是添加
  if (state.rolesForm.roleId) {
    reqEditRolesInfo(state.rolesForm.roleId, state.rolesForm).then(res => {
      console.log(res)
      if (res.meta.status !== 200) {
        state.dialogFormVisible = false
        return ElMessage.error('修改失败！')
      }
      getRolesList();
      state.dialogFormVisible = false
      ElMessage.success('修改成功！')
    })
  } else {
    reqAddRoles(state.rolesForm).then(res => {
      console.log(res)
      if (res.meta.status !== 201) {
        state.dialogFormVisible = false
        return ElMessage.error('添加失败！')
      }
      getRolesList();
      state.dialogFormVisible = false
      ElMessage.success('添加成功！')
    })
  }
}
// 弹窗每次消失都会清空表单
const handleClose = () => {
  state.rolesForm = {
    roleId: '',
    roleName: '',
    roleDesc: ''
  }
}

// 编辑按钮
const editRolesInfo = (id) => {
  reqRolesInfo(id).then(res => {
    console.log(res)
    if (res.meta.status !== 200) {
      return ElMessage.error('获取失败,请稍后再试！')
    } else {
      state.rolesForm.roleName = res.data.roleName
      state.rolesForm.roleDesc = res.data.roleDesc
      state.rolesForm.roleId = res.data.roleId
      state.dialogFormVisible = true
    }
  })
}
// 删除按钮
const deleteRolesInfo = (id) => {
  reqDeleteRolesInfo(id).then(res => {
    console.log(res)
    if (res.meta.status !== 200) {
      ElMessage.error('删除失败请稍后再试！')
    } else {
      getRolesList();
      ElMessage.success('删除成功！')
    }
  })
}
// 根据id删除权限
const removeRightById = (row, rightId) => {
  ElMessageBox.confirm(
      '此次操作将永久删除该权限，还要继续吗?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        reqDeleteRolesRights(row.id, rightId).then(res => {
          if (res.meta.status !== 200) {
            ElMessage({
              type: 'error',
              message: '删除失败，请稍后再试！',
            })
          } else {
            // 不要重新获取数据，会刷新页面不停留在当前页，返回的数据是一些权限，直接赋值给他
            row.children = res.data
            ElMessage({
              type: 'success',
              message: '删除成功',
            })
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

// 分配权限对话框
const showSetRightDialog = (row) => {
  reqGetRightsTree().then(res => {
    if (res.meta.status !== 200) {
      ElMessage.error('获取权限数据失败！')
    } else {
      // 提前传好ID，发请求需要
      rolesId.value = row.id
      /*// 重置数组  不然会冲突   这里的调用已放对话框关闭处执行放在这里有bug
      state.defKeys = []*/
      getLeafKeys(row, state.defKeys);
      state.rightsList = res.data
      state.rightsDialogVisible = true

    }
  })
}
// 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
const getLeafKeys = (node, arr) => {
// 首先判断当前 node 节点不包含 children 属性，则是三级节点
  if (!node.children) {
    // 执行到这里代表来到了我们想到的地方,拿到id
    return arr.push(node.id)
  } else {
    // 现在遍历第一层
    node.children.forEach(item => {
      //  重新调用自己 直到没有children节点就结束
      getLeafKeys(item, arr)
    })
  }
}

// 树形 tree
const treeRef = ref()
// 角色id 发请求需要携带
let rolesId = ref(0);
// 点击树形 对话框 确认按钮
const allotRights = () => {
  const keys = [
    ...treeRef.value.getCheckedKeys(),
    ...treeRef.value.getHalfCheckedKeys()
  ]
  // 获取所以三级节点勾选上的id
  // console.log(treeRef.value.getCheckedKeys())
  // 获取所有一级 二级 节点 选中的 id
  // console.log(treeRef.value.getHalfCheckedKeys())

  // 拼接数组发给后台，后台要求的格式
  const idStr = keys.join(',')
  console.log(rolesId.value,idStr)
  reqRolesAuthorization(Number(rolesId.value),idStr).then(res=>{
    if (res.meta.status !== 200){
      ElMessage.error('分配权限失败!')
    }else{
      ElMessage.success('分配权限成功!')
      getRolesList();
      state.rightsDialogVisible = false
    }
  })
}
</script>

<style lang="scss" scoped>

.rights-wrap {
  margin: 0 50px;

  .el-tag {
    margin: 7px;
    font-size: 15px;
    height: 40px;
  }
}


.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>