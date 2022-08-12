<template>
  <div class="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    },
  },
};
</script>

<style lang="scss" scoped></style>
