<template>
  <main class="main-container">
    <v-login @event="handleRequest" v-if="!user"></v-login>
    <transition name="fade">
      <v-chat-room v-if="user" @event="handleRequest" :user="user"></v-chat-room>
    </transition>
    <!-- <el-button @click="initWebSocket">连接</el-button> -->
  </main>
</template>

<script>
import vLogin from "./Login";
import vChatRoom from "./ChatRoom";

export default {
  name: "main-app",
  components: { vLogin, vChatRoom },
  data() {
    return {
      websock: null,
      user: null,
      intervalId: null
    };
  },
  created() {
    // 初始化 websocket
    this.initWebSocket();
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
    clearInterval(this.intervalId); //取消心跳
  },
  methods: {
    initWebSocket() {
      //初始化weosocket
      const wsuri = "ws://192.168.18.96:8000";
      // const wsuri = "ws://localhost:8000";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      this.$message.success("与服务器连接成功！");
      // 发送心跳
      this.intervalId = setInterval(() => {
        this.handleRequest(17);
      }, 5000);
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      this.handleResponse(redata);
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(JSON.stringify(Data));
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
      clearInterval(this.intervalId); //取消心跳
    },
    handleRequest(command, data = {}) {
      const newData = { ...data, command };
      switch (command) {
        // 登录事件
        case 1:
          this.websocketsend(newData);
          break;
        // 发送消息
        case 3:
          this.websocketsend(newData);
          break;
        // 创建群组请求
        case 7:
          this.websocketsend(newData);
          break;
        // 加入群组请求
        case 11:
          this.websocketsend(newData);
          break;
        // 發送群組消息
        case 15:
          this.websocketsend(newData);
          break;
        // 心跳
        case 17:
          this.websocketsend(newData);
          break;
        // 获取所有在线用户
        case 19:
          this.websocketsend(newData);
          break;
        // 获取漫游消息
        case 23:
          this.websocketsend(newData);
          break;
      }
    },
    handleResponse(data) {
      // 心跳回应，跳过不处理
      if (data.command === 18) {
        return;
      }
      if (data.success) {
        switch (data.command) {
          case 2:
            this.user = data.userSession;
            this.$store.commit("user/setMe", data.userSession);
            break;
          case 4:
            this.$store.dispatch("user/requestUserMessage", data);
            this.$store.dispatch("user/setUnreadMessage", data.srcUserId);
            break;
          case 8:
            this.$store.dispatch("user/addGroup", data);
            break;
          case 16:
            this.$store.dispatch("user/requestGroupMessage", data);
            this.$store.dispatch("user/setUnreadMessage", data.groupId);
            break;
          case 20:
            this.$store.commit("user/setUserList", data.userSessions);
            break;
          case 21:
            this.$store.dispatch("user/addUsers", data.userSession);
            break;
          case 24:
            if (data.hasData) {
              data.userMsgList.forEach(item => {
                this.$store.dispatch("user/addUsers", item.srcUser);
                item.msgList.forEach(el => {
                  this.$store.dispatch("user/requestUserMessage", el);
                  this.$store.dispatch("user/setUnreadMessage", el.srcUserId);
                });
              });
            }
            break;
        }
      } else {
        this.$message.error(`${data.errMsg}`);
      }
    },
    handleUnreadMessage() {}
  }
};
</script>

<style lang="scss">
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  min-height: 750px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
