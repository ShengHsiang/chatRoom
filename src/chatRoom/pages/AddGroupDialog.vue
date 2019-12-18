<template>
  <!-- 外层dialog -->
  <el-dialog
    :title="params.title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @closed="handleCancel"
    width="500px"
  >
    <div class="dialog-content_wrap">
      <el-form ref="form" :model="form" :label-width="formLabelWidth" class="dialog-form_wrap">
        <el-form-item label="添加用户">
          <el-select v-model="form.userIds" multiple class="dialog-form_item">
            <el-option
              v-for="user in users"
              :key="user.userId"
              :label="user.nickName"
              :value="user.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="群组名称">
          <el-input v-model.trim="form.groupName" class="dialog-form_item"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer_wrap">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isBtnLoading">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      // 调用 dialog 开启方法传递的参数
      params: {
        title: "我是默认标题",
        record: null
      },
      // dialog 开启
      dialogVisible: false,
      isBtnLoading: false,

      // 表单的 label 宽度
      formLabelWidth: "90px",

      // 新增类型的表单
      form: {
        userIds: [],
        groupName: ""
      }
    };
  },
  computed: {
    ...mapGetters("user", {
      userList: "getUserList"
    }),
    users() {
      return this.userList.filter(item => !item.isGroup)
    }
  },
  watch: {
    params: function() {
      const { record } = this.params;
      if (record) {
        // 修改 form 数据
        this.form = Object.assign({}, this.form, record);
      }
    }
  },
  methods: {
    /**
     * @description: dialog 的打开事件 -> 合并参数
     */
    handleOpen(params) {
      this.dialogVisible = true;
      if (params) {
        this.params = Object.assign({}, this.params, params);
      }
    },
    /**
     * @description: dialog 的关闭事件
     */
    handleCancel() {
      // 重置 form 表单 ＆ 参数
      this.form = this.$options.data().form;
      this.params = this.$options.data().params;
      this.dialogVisible = false;
    },
    /**
     * @description: 弹出框确认提交事件
     */
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.isBtnLoading = true;
          new Promise(resolve => {
            resolve(this.form);
          })
            .then(res => {
              this.$emit("add", res);
              this.handleCancel();
            })
            .catch(err => {
              console.error(err);
            })
            .finally(() => (this.isBtnLoading = false));
        } else {
          this.$message.warning("请检查相关数据，再进行提交操作！");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-content_wrap {
  margin-top: -10px;
  padding: 0 20px;
}
.dialog-form_wrap {
  min-height: 200px;

  .dialog-form_item {
    width: 90%;
  }
}
.dialog-footer_wrap {
  display: flex;
  justify-content: flex-end;
}
</style>