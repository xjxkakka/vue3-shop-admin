<template>
  <div class="toggle-button" @click="toggleCollapse">|||</div>
  <!--  unique-opened 只允许展开一个菜单
        collapse-transition 是否开启折叠动画
        router 开启路由模式,以index为path路径
        default-active	 默认高亮地址
        -->
  <el-menu
      active-text-color="#409bff"
      background-color="#333744"
      class="el-menu-vertical-demo"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="DefaultActive"
  >
    <!--    一级菜单-->
    <!--    index 只接收字符串-->
    <el-sub-menu :index="item.id + ''" v-for="item in menuList" :key="item.id">
      <!--      一级菜单模板-->
      <template #title>
        <!--        图标-->
        <i :class="iconsObj[item.id]"></i>
        <!--        文本-->
        <span>{{ item.authName }}</span>
      </template>

      <!-- 二级菜单-->
      <el-menu-item  :index="subItem.path + ''" v-for="subItem in item.children" :key="subItem.id">
        <template #title>
          <!--        图标-->
          <el-icon>
            <Menu/>
          </el-icon>
          <!--        文本-->
          <span>{{ subItem.authName }}</span>
        </template>
      </el-menu-item>

    </el-sub-menu>

  </el-menu>
</template>

<script>
import { Menu } from '@element-plus/icons-vue'
import { computed, onMounted, reactive, toRefs } from 'vue'
import { reqGetMenuList } from '../api'
import { useRouter,useRoute } from 'vue-router'

export default {
  name: "LeftNav",
  components: { Menu },
  emits:['changeAside'],
  setup (props,ctx) {
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      // 左侧菜单数据
      menuList: [],
      // 导航栏图标 数据写好遍历
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao',
      },
      // 是否 折叠
      isCollapse: false
    })
    onMounted(() => {
      getMenuList();

    })
    // 计算默认高亮
    const DefaultActive = computed(()=>{
      return route.name
    })
    const getMenuList = () => {
      reqGetMenuList().then(res => {
        // console.log(res)
        // 不成功弹窗
        if (res.meta.status !== 200) {
          return ElMessage.error(res.meta.msg)
        } else {
          state.menuList = res.data
          // console.log(state.menuList)
        }
      })
    }
    const handleOpen = (key, keyPath) => {
      // console.log(key, keyPath)
    }
    const handleClose = (key, keyPath) => {
      // console.log(key, keyPath)
    }
    // 点击控制 是否折叠
    const toggleCollapse = () => {
      state.isCollapse = !state.isCollapse
      // 控制元素的宽度在父组件所以写个自定义事件
      ctx.emit('changeAside')
    }

    return { ...toRefs(state),DefaultActive, handleOpen,handleClose ,toggleCollapse}
  }
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
  // 去掉边框处理小细节
  border-right: none;

  .iconfont {
    margin-right: 10px;
  }
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #FFF;
  text-align: center;
  // 设置每个字符之间的间距
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>