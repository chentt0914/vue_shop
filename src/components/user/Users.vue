<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 搜索框  添加用户-->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" class="input-with-select">
              <template #append>
                <el-button :icon="Search"></el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4"><el-button type="primary">添加用户</el-button></el-col>
        </el-row>
        <!-- 用户列表 -->
        <el-table :data="userList" stripe :border="true">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="mobile" label="电话" />
          <el-table-column prop="role_name" label="角色" />
          <el-table-column label="状态">
            <template v-slot="scope">
              <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template v-slot="scope">
              <el-button type="primary" :icon="Edit" size="small" />
              <el-button type="danger" :icon="Delete" size="small" />
              <el-tooltip class="box-item" effect="dark" content="分配角色" placement="top" enterable>
                <el-button type="warning" :icon="Tools" size="small" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          :locale="locale"
          v-model:currentPage="queryInfo.pagenum"
          v-model:page-size="queryInfo.pagesize"
          :page-sizes="[1, 3, 7, 9]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { ArrowRight, Search, Edit, Delete, Tools } from '@element-plus/icons-vue';
import { GetUsers, ChangeuserState } from '@/network/user';

export default {
  data() {
    return {
      // 用户列表参数
      queryInfo: {
        query: '',
        // 页数
        pagenum: 1,
        // 每页个数
        pagesize: 2,
      },
      Search,
      ArrowRight,
      Edit,
      Delete,
      Tools,

      userList: [],
      total: 0,
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    // 获取用户列表
    getUsersList() {
      GetUsers(this.queryInfo).then(res => {
        console.log(res);
        if (res.data.meta.status !== 200) return ElMessage.error(res.data.meta.msg);
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    // 改变每页个数
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      // 刷新页面数据
      this.getUsersList();
    },
    // 改变页码
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      //刷新页面数据
      this.getUsersList();
    },
    changeUserState(userInfo) {
      console.log(userInfo);
      ChangeuserState({ uId: userInfo.id, type: userInfo.mg_state }).then(res => {
        console.log(res);
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
