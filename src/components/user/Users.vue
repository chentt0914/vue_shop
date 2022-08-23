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
            <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUsersList">
              <template #append>
                <el-button :icon="Search" @click="getUsersList"></el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4"><el-button type="primary" @click="dialogVisible = true">添加用户</el-button></el-col>
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
          <!-- 操作栏 -->
          <el-table-column label="操作" width="180px">
            <template v-slot="scope">
              <!-- 修改按钮 -->
              <el-button type="primary" :icon="Edit" size="small" @click="showEditDialog(scope.row.id)" />
              <!-- 删除按钮 -->
              <el-button type="danger" :icon="Delete" size="small" @click="removeUser(scope.row.id)" />
              <!-- 分配角色按钮 -->
              <el-tooltip class="box-item" effect="dark" content="分配角色" placement="top" enterable>
                <el-button type="warning" :icon="Tools" size="small" @click="distributeRoles(scope.row)" />
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

    <!-- 添加用户的对话框 -->
    <el-dialog v-model="dialogVisible" title="添加用户" @close="resetForm">
      <template #default>
        <el-form :model="formData" :rules="formRules" ref="form" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="formData.password" type="password" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" />
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="formData.mobile" maxlength="11" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addNewUser">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog v-model="editDialogVisible" title="修改用户" @close="resetEditForm">
      <template #default>
        <el-form :model="editFormData" :rules="editFormRules" ref="formRef">
          <el-form-item label="用户名">
            <el-input v-model="editFormData.username" disabled />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editFormData.email" />
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editFormData.mobile" maxlength="11" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editUser">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog v-model="distributeDialogVisible" title="分配角色" @close="resetDistributeForm">
      <div>当前的用户：{{ userInfo.username }}</div>
      <div class="role">当前的角色：{{ userInfo.role_name }}</div>
      <div>
        分配新角色：
        <el-select v-model="selectedRoleId" class="m-2" placeholder="请选择" size="small">
          <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id" />
        </el-select>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="distributeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addRoles">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowRight, Search, Edit, Delete, Tools } from '@element-plus/icons-vue';
import { GetUsers, ChangeuserState, Adduser, Finduser, Edituser, removeUser, getRolesList, addRoles } from '@/network/user';

export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([A-z0-9]{3,18})(\w|\-)+@[A-z0-9]+\.([A-z]{2,3})$/;
      if (regEmail.test(value)) {
        return callback();
      } else {
        callback(new Error('请输入正确的邮箱'));
      }
    };
    var checkMobile = (rule, value, callback) => {
      const regEmail = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regEmail.test(value)) {
        return callback();
      } else {
        callback(new Error('请输入正确的手机号'));
      }
    };
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

      // 添加用户的对话框的显示和隐藏
      dialogVisible: false,

      // 添加用户的表单数据
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加用户的表单验证规则
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 6 到 16 个字符', trigger: 'blur' },
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkMobile }],
      },

      // 修改用户的对话框的显示和隐藏
      editDialogVisible: false,

      // 修改用户的表单数据
      editFormData: {},

      // 修改用户的表单验证规则
      editFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkMobile }],
      },

      //分配角色对话框的显示和隐藏
      distributeDialogVisible: false,

      // 分配角色的用户信息
      userInfo: [],

      // 角色信息
      roleList: [],

      // 被选中的角色id
      selectedRoleId: '',
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    // 获取用户列表
    getUsersList() {
      GetUsers(this.queryInfo).then(res => {
        // console.log(res);
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

    // 修改用户状态
    changeUserState(userInfo) {
      // console.log(userInfo);
      ChangeuserState({ uId: userInfo.id, type: userInfo.mg_state }).then(res => {
        console.log(res);
        if (res.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state;
          return ElMessage.error(res.data.meta.msg);
        }
        ElMessage.success(res.data.meta.msg);
      });
    },

    //关闭添加用户对话框重置表单
    resetForm() {
      this.$refs.form.resetFields();
    },

    // 点击确定按钮验证表单
    addNewUser() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        // 发送添加用户的网络请求
        Adduser(this.formData).then(res => {
          console.log(res);
          if (res.data.meta.status !== 201) return ElMessage.error(res.data.meta.msg);
          ElMessage.success(res.data.meta.msg);
          // 关闭对话框
          this.dialogVisible = false;
          // 刷新页面
          this.getUsersList();
        });
      });
    },

    // 展示编辑对话框
    showEditDialog(id) {
      //根据ID查询用户信息
      Finduser({ id }).then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) return ElMessage.error(res.data.meta.msg);
        this.editFormData = res.data.data;
        // console.log(this.editFormData);
      });

      this.editDialogVisible = true;
    },

    // 重置编辑对话框
    resetEditForm() {
      this.$refs.formRef.resetFields();
    },

    // 点击确定按钮验证表单修改用户信息
    editUser() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        Edituser(this.editFormData).then(res => {
          console.log(res);
          if (res.data.meta.status !== 200) return ElMessage.error(res.data.meta.msg);
          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新页面
          this.getUsersList();
          // 提示修改成功
          ElMessage.success(res.data.meta.msg);
        });
      });
    },

    //删除用户
    removeUser(id) {
      ElMessageBox.confirm('此操作将永久删除用户信息，是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          removeUser({ id }).then(res => {
            // console.log(res);
            if (res.data.meta.status !== 200) return ElMessage.error(res.data.meta.msg);
            ElMessage.success(res.data.meta.msg);
            this.getUsersList();
          });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除',
          });
        });
    },

    // 分配角色
    distributeRoles(userInfo) {
      this.userInfo = userInfo;

      getRolesList().then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) return ElMessage.error(res.data.meta.msg);
        this.roleList = res.data.data;
      });
      this.distributeDialogVisible = true;
    },

    // 分配用户角色
    addRoles() {
      addRoles({ id: this.userInfo.id, rid: this.selectedRoleId }).then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) return ElMessage.error(res.data.meta.msg);
        ElMessage.success(res.data.meta.msg);

        this.getUsersList();
        this.distributeDialogVisible = false;
      });
    },

    // 重置对话框
    resetDistributeForm() {
      this.selectedRoleId = '';
      this.userInfo.id = {};
    },
  },
};
</script>

<style scoped>
.role {
  margin: 20px 0;
}
</style>
