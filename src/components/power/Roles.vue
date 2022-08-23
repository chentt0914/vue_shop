<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card卡片 -->
    <el-card>
      <!-- 添加用户按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row v-for="(item1, index1) in scope.row.children" :key="item1.id" :class="['borderB', index1 === 0 ? 'borderT' : '', 'vCenter']">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRoleRight(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <el-icon>
                  <CaretRight></CaretRight>
                </el-icon>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2, index2) in item1.children" :key="item2.id" :class="[index2 === 0 ? '' : 'borderT', 'vCenter']">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRoleRight(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRoleRight(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" size="small" :icon="Edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="small" :icon="Delete">删除</el-button>
            <el-button type="warning" size="small" :icon="Tools" @click="showDistributeDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加用户" @close="resetForm">
      <template #default>
        <el-form :model="formData" :rules="formRules" ref="form" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="formData.roleName" />
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="formData.roleDesc" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addNewRoles">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑用户的对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑角色" @close="resetEditForm">
      <el-form :model="editFormData" label-width="80px" ref="editformRef" :rules="editFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editFormData.roleName" />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editFormData.roleDesc" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editRole">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog v-model="distributeDialogVisible" title="分配权限" destroy-on-close>
      <!-- 树形控件 -->
      <el-tree :data="RightsTree" :props="defaultProps" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="distributeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addRights">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ArrowRight, Delete, Edit, Tools, CaretRight } from '@element-plus/icons-vue';
import { getRolesList } from '@/network/roles';
import { ElMessage, ElMessageBox } from 'element-plus';
import { removeRoleRight, findRole, addRoles, editRole, getRightsTree, addRights } from '@/network/roles';
export default {
  data() {
    return {
      ArrowRight,
      Delete,
      Edit,
      Tools,
      CaretRight,
      // 角色列表数据
      rolesList: [],

      //添加用户的对话框的显示和隐藏
      addDialogVisible: false,

      //添加用户的表单数据
      formData: {
        roleName: '',
        roleDesc: '',
      },

      // 添加用户表单规则
      formRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
        ],
      },

      // 显示编辑对话框的显示和隐藏
      editDialogVisible: false,

      //编辑表单数据
      editFormData: {
        roleId: 0,
        roleName: '',
        roleDesc: '',
      },

      //编辑表单规则
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
        ],
      },

      // 分配权限对话框
      distributeDialogVisible: false,

      //树形图
      RightsTree: [],
      defaultProps: {
        children: 'children',
        label: 'authName',
      },

      // 默认选中的节点ID数组值
      defKeys: [],

      roleId: '',
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    getRolesList() {
      getRolesList().then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) return ElMessage.error(res.data.meta.msg);
        this.rolesList = res.data.data;
      });
    },

    //删除角色指定权限
    removeRoleRight(role, right) {
      ElMessageBox.confirm('此操作将永久删除改文件, 是否继续?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          removeRoleRight({ roleId: role.id, rightId: right }).then(res => {
            console.log(res);
            if (res.data.meta.status !== 200) return ElMessage.error(res.data.meta.msg);
            // ElMessage.success(res.data.meta.msg);
            role.children = res.data.data;
          });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除',
          });
        });
    },

    //关闭添加用户对话框重置表单
    resetForm() {
      this.$refs.form.resetFields();
    },

    // 点击确定按钮验证表单  添加新用户
    addNewRoles() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        // 发送添加用户的网络请求
        addRoles({ roleName: this.formData.roleName, roleDesc: this.formData.roleDesc }).then(res => {
          console.log(res);
          if (res.data.meta.status !== 201) return ElMessage.error(res.data.meta.msg);
          ElMessage.success(res.data.meta.msg);
          // 关闭对话框
          this.addDialogVisible = false;
          // 刷新页面
          this.getRolesList();
        });
      });
    },

    // 点击编辑按钮显示编辑用户对话框
    showEditDialog(id) {
      // 根据ID查询角色
      findRole({ id }).then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) return ElMessage.error(res.data.meta.msg);
        this.editFormData = res.data.data;
        // console.log(this.editFormData);
      });
      this.editDialogVisible = true;
    },

    //关闭编辑对话框重置表单
    resetEditForm() {
      this.$refs.editformRef.resetFields();
    },

    // 按确认按钮编辑提交角色
    editRole() {
      this.$refs.editformRef.validate(valid => {
        if (!valid) return;
        editRole({ id: this.editFormData.roleId, roleName: this.editFormData.roleName, roleDesc: this.editFormData.roleDesc }).then(res => {
          console.log(res);
          if (res.data.meta.status !== 200) return ElMessage.error(res.data.meta.msg);
          // 刷新页面
          this.getRolesList();
          // 提示修改成功
          ElMessage.success(res.data.meta.msg);
          // 关闭对话框
          this.editDialogVisible = false;
        });
      });
    },

    // 展示分配权限对话框 获取权限数据
    showDistributeDialog(role) {
      this.roleId = role.id;
      getRightsTree().then(res => {
        console.log(res);
        if (res.data.meta.status !== 200) return ElMessage.error(res.data.meta.msg);
        this.RightsTree = res.data.data;

        this.defKeys = [];
        this.getLeafKeys(role, this.defKeys);

        this.distributeDialogVisible = true;
      });
    },

    // 递归获取三级权限的ID 并保存到defKeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafKeys(item, arr));
    },

    // 为角色添加权限
    addRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()];
      const rids = keys.join(',');
      addRights({ roleId: this.roleId, rids: rids }).then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) return ElMessage.error(res.data.meta.msg);

        ElMessage.success(res.data.meta.msg);
        this.getRolesList();
        this.distributeDialogVisible = false;
      });
    },
  },
};
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.borderB {
  border-bottom: 1px solid #eee;
}
.borderT {
  border-top: 1px solid #eee;
}
.vCenter {
  display: flex;
  align-items: center;
}
</style>
