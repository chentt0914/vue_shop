<template>
  <el-config-provider :locale="locale">
    <div id="app">
      <router-view></router-view>
    </div>
  </el-config-provider>
</template>

<script>
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
export default {
  name: 'app',
  components: {},
  data() {
    return {
      locale: zhCn,
    };
  },
};
</script>
<style></style>
