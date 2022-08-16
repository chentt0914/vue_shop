<template>
  <div class="login">
    <div class="login-box">
      <!-- 头部 -->
      <div class="header">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!-- 表单 -->
      <el-form class="login-form" label-width="0px" :model="form" :rules="rules" ref="resetForm">
        <el-form-item prop="username">
          <el-input prefix-icon="Avatar" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="Lock" v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="btn">
            <el-button type="primary" @click="checkForm">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Login } from '@/network/login';
import { ElMessage } from 'element-plus';

export default {
  name: 'Login',
  data() {
    return {
      //表单数据绑定对对象
      form: {
        username: 'admin',
        password: '123456',
      },
      //表单的验证规则对象
      rules: {
        //验证用户名
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
        ],
        // 验证密码
        password: [
          { required: true, message: '请选择活动区域', trigger: 'change' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    // 表单重置
    resetForm() {
      this.$refs.resetForm.resetFields();
    },
    // 登录验证
    checkForm() {
      this.$refs.resetForm.validate(async valid => {
        if (!valid) return;
        // 登录请求
        Login(this.form).then(res => {
          console.log(res);
          if (res.data.meta.status == 200) {
            ElMessage.success(res.data.meta.msg);
            localStorage.setItem('token', res.data.data.token);
            this.$router.push('/home');
          } else {
            ElMessage.error(res.data.meta.msg);
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: #2b4b6b;
  .login-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #fff;
    .header {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      border-radius: 50%;
      padding: 10px;
      border: 1px solid #eee;
      background-color: #fff;
      box-shadow: 0 0 10px #ddd;
      img {
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login-form {
      width: 100%;
      position: absolute;
      bottom: 0;
      padding: 0 20px;
      box-sizing: border-box;
      .btn {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
