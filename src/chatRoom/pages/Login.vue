<template>
  <div class="login_wrap">
    <h1 class="login-title">聊天室登录</h1>
    <el-form
      :model="form"
      status-icon
      ref="form"
      label-width="100px"
      label-position="top"
      class="login-form"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input type="text" v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="handleSubmit">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        userName: "",
        password: ""
      }
    };
  },
  mounted() {
    // 绑定enter事件
    this.enterKeyup();
  },
  destroyed() {
    // 销毁enter事件
    this.enterKeyupDestroyed();
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit("event", 1, this.form);
        } else {
          console.log("校验错误！");
        }
      });
    },
    enterKey(event) {
      const componentName = this.$options.name;
      if (componentName == "Login") {
        const code = event.keyCode
          ? event.keyCode
          : event.which
          ? event.which
          : event.charCode;
        if (code == 13) {
          this.handleSubmit();
        }
      }
    },
    enterKeyupDestroyed() {
      document.removeEventListener("keyup", this.enterKey);
    },
    enterKeyup() {
      document.addEventListener("keyup", this.enterKey);
    }
  }
};
</script>

<style lang="scss" scoped>
.login_wrap {
  width: 350px;
  min-height: 350px;
  border-radius: 6px;
  background-color: #f0f0f0;
  border: $--border-color-base 1px solid;
}

.login-title {
  padding: 15px;
  text-align: center;
  color: #fff;
  background-color: #303133;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  margin-bottom: 0px;
  font-size: 24px;
}

.login-form {
  padding: 10px 20px;
}

.login-btn {
  margin-top: 20px;
  width: 100%;
  font-size: 16px;
}
</style>