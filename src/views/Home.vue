<template>
  <el-container class="home">
    <!-- 头部 -->
    <el-header>
      <div class="left">
        <img src="@/assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧部分 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="collapse" @click="toggleCollapse">|||</div>
        <el-menu active-text-color="#409eff" background-color="#333744" text-color="#fff" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activedPath">
          <!-- 一级菜单 -->
          <el-sub-menu :index="'' + items.id" v-for="items in menuList" :key="items.id">
            <template #title>
              <!-- 图标 -->
              <el-icon :class="menuIcon[items.id]"></el-icon>
              <!-- 文字 -->
              <span>
                {{ items.authName }}
              </span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + children.path" v-for="children in items.children" :key="children.id" @click="keepState('/' + children.path)">
              <el-icon><Grid /></el-icon>
              <span>{{ children.authName }}</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主体部分 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { GetAside } from '../network/home';
import { ElMessage } from 'element-plus';
export default {
  data() {
    return {
      menuList: [],
      menuIcon: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
      activedPath: '',
    };
  },
  created() {
    this.getMenuList();
    // 进入新页面保存
    this.activedPath = localStorage.getItem('activedPath');
  },
  methods: {
    // 登出
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    },

    // 获取菜单列表
    getMenuList() {
      GetAside().then(res => {
        if (res.data.meta.status !== 200) return ElMessage.success(res.data.meta.msg);
        // console.log(res.data.data);
        this.menuList = res.data.data;
        // console.log(this.menuList);
      });
    },

    // 菜单折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },

    //保存活跃的二级菜单状态
    keepState(activedPath) {
      // 活跃二级菜单路径保存到本地存储
      localStorage.setItem('activedPath', activedPath);
      // 当前页面保存
      this.activedPath = activedPath;
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #373d41;
    padding-left: 0;
    font-size: 20px;
    color: #fff;
    .left {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .collapse {
      color: #fff;
      text-align: center;
      letter-spacing: 2px;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
