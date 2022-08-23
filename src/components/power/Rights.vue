<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card卡片 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag class="ml-2" v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag class="ml-2" type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag class="ml-2" type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ArrowRight } from '@element-plus/icons-vue';
import { getRightsList } from '@/network/rights';
import { ElMessage } from 'element-plus';
export default {
  data() {
    return {
      ArrowRight,
      //权限列表
      rightsList: [],
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    getRightsList() {
      getRightsList().then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) return ElMessage.error(res.data.meta.msg);
        this.rightsList = res.data.data;
      });
    },
  },
};
</script>

<style scoped></style>
