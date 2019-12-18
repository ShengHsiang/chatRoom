import Vue from 'vue'

const state = {
  me: {},
  chatter: {},
  userList: [],
};
const getters = {
  getChatter(state) {
    return state.chatter;
  },
  getUserList(state) {
    return state.userList
  },
  getUserMessage: (state) => {
    return state[state.chatter.userId]
  }
};
const mutations = {
  setMe(state, val) {
    state.me = val
  },
  setChatter(state, val) {
    if (val.hasOwnProperty("unread")) {
      delete val.unread
    }
    state.chatter = val;
  },
  setUserList(state, val) {
    val.map(item => item.isGroup = false)
    state.userList = val
  },
  setUser(state, val) {
    state.userList.push(val)
  },
  setUserMessage(state, msgObj) {
    state[msgObj.userId].push(msgObj)
  },
  setFirstUserMessage(state, msgObj) {
    Vue.set(state, msgObj.userId, [msgObj])
  },
  setGroupMessage(state, msgObj) {
    state[msgObj.groupId].push(msgObj)
  },
  setFirstGroupMessage(state, msgObj) {
    Vue.set(state, msgObj.groupId, [msgObj])
  },
  setGroup(state, groupObj) {
    state.userList.push(groupObj)
  }
};
const actions = {
  addUsers({ commit, state }, val) {
    val.isGroup = false
    if (state.userList.length === 0) {
      commit("setUser", val)
    } else {
      const user = state.userList.find(item => item.userId === val.userId)
      if (!user) {
        commit("setUser", val)
      }
    }
  },
  addGroup({ commit }, val) {
    const group = {
      userId: val.groupId,
      userName: val.groupName,
      nickName: val.groupName === "群聊" ? val.users.map(item => item.nickName).join(" ,") + " 的群聊" : val.groupName,
      users: val.users,
      isGroup: true
    }
    commit("setGroup", group)
  },
  sendUserMessage({ commit, state }, val) {
    const msgObj = {
      ...val,
      isMe: true
    }
    if (state.hasOwnProperty(val.userId)) {
      commit("setUserMessage", msgObj)
    } else {
      commit("setFirstUserMessage", msgObj)
    }
  },
  requestUserMessage({ commit, state }, val) {
    const msgObj = {
      userId: val.srcUserId,
      userName: val.srcUserName,
      nickName: val.srcNickName,
      msg: val.msg,
      isMe: false
    }
    if (state.hasOwnProperty(val.srcUserId)) {
      commit("setUserMessage", msgObj)
    } else {
      commit("setFirstUserMessage", msgObj)
    }
  },
  requestGroupMessage({ commit, state }, val) {
    let msgObj = {
      groupId: val.groupId,
      userId: val.srcUserId,
      userName: val.srcUserName,
      nickName: val.srcNickName,
      msg: val.msg,
      isMe: false
    }
    // 判断接收的讯息是不是自己发的
    if (val.srcUserId === state.me.userId) {
      msgObj.isMe = true
    }
    if (state.hasOwnProperty(val.groupId)) {
      commit("setGroupMessage", msgObj)
    } else {
      commit("setFirstGroupMessage", msgObj)
    }
  },
  setUnreadMessage({ commit, state }, id) {
    return new Promise((resolve, reject) => {
      if (state.userList.length === 0) {
        return
      }
      state.userList.forEach((item, index) => {
        if (state.chatter.hasOwnProperty("userId") && item.userId === state.chatter.userId) {
          return
        }
        if (item.userId === id) {
          const newobj = Object.assign({}, item, { unread: true })
          Vue.set(state.userList, index, newobj)
          resolve(newobj)
        }
      })
    })
  }
};
export default {
  namespaced: true,//用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  getters,
  mutations,
  actions
};