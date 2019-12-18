<template>
  <section class="chat-room_wrap">
    <nav class="chat-room-control_wrap">
      <div class="avatar">{{user.nickName}}</div>
    </nav>
    <div class="chat-room-userList_wrap">
      <div class="userList-header">
        <el-input v-model="headerInput" placeholder="搜寻" class="userList-header_input"></el-input>
        <el-button icon="el-icon-plus" @click="handleAddGroupDialogOpen({title: '创建群组'})"></el-button>
      </div>
      <div class="userList-item_wrap">
        <template v-for="user in userList">
          <div
            class="userList-item"
            :class="{'selected': chatter.userId === user.userId}"
            :key="user.userId"
            @click="selectChatter(user)"
          >
            <div>{{ user.nickName }}</div>
            <div class="userList-item_hasMessage" v-if="user.unread"></div>
          </div>
        </template>
      </div>
    </div>
    <div class="chat-room-message_wrap">
      <div class="message-header_wrap">
        <div class="message-header_text">{{chatter.nickName}}</div>
        <div class="message-header_setting" v-if="chatter.isGroup">
          <el-icon class="el-icon-setting"></el-icon>
        </div>
      </div>
      <div class="message-content_wrap" ref="content">
        <template v-for="(item, index) in userMessage">
          <div class="message-content" :class="{'isMe': item.isMe}" :key="index">
            <div class="message-box">
              <div class="userName">
                <!-- {{item.nickName.charAt(0)}} -->
                <el-icon class="el-icon-user-solid"></el-icon>
              </div>
              <div class="userMessage_wrap">
                <div class="userMessage_userName" v-if="chatter.isGroup">{{item.nickName}}</div>
                <div class="userMessage_msg">{{item.msg}}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="message-input_wrap">
        <textarea class="input-box" v-model="message"></textarea>
      </div>
      <div class="message-btn_wrap">
        <el-button class="btn" @click="handleSendMessage">发送</el-button>
      </div>
    </div>

    <v-add-group-dialog ref="addGroupDialog" @add="handleAddGroup"></v-add-group-dialog>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import vAddGroupDialog from "./AddGroupDialog";

export default {
  name: "chat-room",
  components: { vAddGroupDialog },
  props: ["user"],
  data() {
    return {
      message: "",
      messageList: [],
      headerInput: ""
    };
  },
  computed: {
    ...mapGetters("user", {
      userList: "getUserList",
      chatter: "getChatter",
      userMessage: "getUserMessage"
    })
  },
  watch: {
    userMessage: {
      immediate: true,
      handler: function(newVal, oldVal) {
        this.$nextTick(() => {
          this.$refs.content.scrollTop = this.$refs.content.scrollHeight;
        });
      }
    }
  },
  created() {
    this.getOnlineUserList();
    this.getUnreadMessage();
  },
  mounted() {
    // 绑定enter事件
    // this.enterKeyup();
  },
  destroyed() {
    // 销毁enter事件
    // this.enterKeyupDestroyed();
  },
  methods: {
    getOnlineUserList() {
      this.$emit("event", 19);
    },
    getUnreadMessage() {
      this.$emit("event", 23);
    },
    selectChatter(chatter) {
      this.$store.commit("user/setChatter", chatter);
    },
    handleSendMessage() {
      // 判断有无输入
      if (this.message) {
        // 判断是否是群组消息
        if (!this.chatter.isGroup) {
          // 普通消息
          const send_obj = {
            dstUserId: this.chatter.userId,
            msg: this.message
          };
          this.$emit("event", 3, send_obj);
          this.$store.dispatch("user/sendUserMessage", {
            userId: send_obj.dstUserId,
            userName: "我",
            nickName: "我",
            msg: send_obj.msg
          });
        } else {
          // 群组消息
          const send_obj = {
            groupId: this.chatter.userId,
            msg: this.message
          };
          this.$emit("event", 15, send_obj);
          // this.$store.dispatch("user/sendUserMessage", {
          //   userId: send_obj.groupId,
          //   userName: "我",
          //   nickName: "我",
          //   msg: send_obj.msg
          // });
        }
        this.message = "";
      }
    },
    handleAddGroupDialogOpen(params) {
      this.$refs.addGroupDialog.handleOpen(params);
    },
    handleAddGroup(data) {
      if (!data.groupName) {
        delete data.groupName;
      }
      this.$emit("event", 7, data);
    }
    // enterKey(event) {
    //   const componentName = this.$options.name;
    //   if (componentName == "chat-room") {
    //     const code = event.keyCode
    //       ? event.keyCode
    //       : event.which
    //       ? event.which
    //       : event.charCode;
    //     if (code == 13) {
    //       event.preventDefault();
    //       if (this.message) {
    //         this.handleSendMessage();
    //       }
    //     }
    //   }
    // },
    // enterKeyupDestroyed() {
    //   document.removeEventListener("keyup", this.enterKey);
    // },
    // enterKeyup() {
    //   document.addEventListener("keyup", this.enterKey);
    // }
  }
};
</script>

<style lang="scss" scoped>
.chat-room_wrap {
  width: 1000px;
  height: 700px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid $--border-color-base;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  display: flex;

  .chat-room-control_wrap {
    width: 60px;
    height: 100%;
    padding: 10px;
    background-color: $--color-text-primary;
    display: flex;
    align-items: flex-end;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #ccc;
      font-size: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .chat-room-userList_wrap {
    width: 270px;
    height: 100%;
    background-color: #fff;
    border-right: 1px solid $--border-color-base;
  }

  .chat-room-message_wrap {
    width: calc(1000px - 60px - 270px);
  }
}

.chat-room-userList_wrap {
  .userList-header {
    height: 60px;
    background-color: #f9f9f9;
    border-bottom: 1px solid $--border-color-lighter;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .userList-header_input {
      width: 170px;
    }
  }
  .userList-item_wrap {
    height: calc(100% - 60px);

    .userList-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
      padding: 10px 20px;
      border-bottom: 1px solid $--border-color-lighter;
      cursor: pointer;

      &.selected {
        background-color: $--border-color-light;
      }
    }

    .userList-item_hasMessage {
      width: 10px;
      height: 10px;
      background-color: red;
      border-radius: 50%;
    }
  }
}

.chat-room-message_wrap {
  .message-header_wrap {
    height: 60px;
    background-color: #f9f9f9;
    border-bottom: 1px solid $--border-color-base;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .message-header_text {
  }
  .message-header_setting {
    font-size: 18px;
    cursor: pointer;
    &:hover {
      color: lighten($color: #000000, $amount: 40%);
    }
  }
  .message-content_wrap {
    height: calc(700px - 60px - 150px);
    overflow-x: hidden;
    overflow-y: auto;
    padding: 20px;
  }

  .message-content {
    display: flex;
    margin-bottom: 20px;

    // 自己讯息的样式
    &.isMe {
      justify-content: flex-end;

      .message-box {
        flex-direction: row-reverse;
      }
      .userName {
        margin-right: 0px;
        margin-left: 10px;
      }
      .userMessage_userName {
        text-align: right;
      }
      .userMessage_msg {
        &::after {
          top: 10px;
          right: -10px;
          left: auto;
          border-top-color: transparent;
          border-right-color: transparent;
          border-bottom-color: transparent;
          border-left-color: $--color-success;
        }
      }
    }

    .message-box {
      display: flex;
    }

    .userName {
      color: $--color-text-regular;
      width: 35px;
      height: 35px;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ccc;
      margin-right: 10px;
      font-size: 16px;
    }
    .userMessage_wrap {
    }
    .userMessage_userName {
      font-size: 8px;
      color: #a7a7a7;
    }
    .userMessage_msg {
      max-width: 300px;
      padding: 10px;
      background-color: $--color-success;
      border-radius: 6px;
      position: relative;
      word-wrap: break-word;
      word-break: break-all;
      /* overflow: hidden; */
      &::after {
        position: absolute;
        content: "";
        top: 10px;
        left: -10px;
        width: 0;
        height: 0;
        border-width: 5px;
        border-style: solid;
        border-top-color: transparent;
        border-right-color: $--color-success;
        border-bottom-color: transparent;
        border-left-color: transparent;
      }
    }
  }

  .message-input_wrap {
    border-top: 1px solid $--border-color-base;
    height: 100px;
    padding: 10px;
    .input-box {
      width: 100%;
      height: 100%;
      outline: none;
      border: none;
      font-size: 16px;
    }
  }

  .message-btn_wrap {
    height: 50px;
    padding: 10px 20px;
    display: flex;
    justify-content: flex-end;
    .btn {
      width: 100px;
    }
  }
}
</style>