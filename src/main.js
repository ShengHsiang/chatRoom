import Vue from 'vue'
import App from '@/chatRoom/Index.vue'
import utils from '@/common/js/utils';
import projectUtils from '@/chatRoom/js/utils';
import router from '@/chatRoom/js/router';
import store from '@/chatRoom/js/store';
import i18n from '@/chatRoom/lang'
import ElementUI from 'element-ui';
import api from '@/common/js/requestApi';
import md5 from 'md5';
// import apiUnifiedHandle from '@/chatRoom/js/apiUnifiedHandle.js'
import '@/common/js/date-zh-CN.js';
import '@/common/css/reset.css';
import '@/chatRoom/css/theme/element-variables.scss';
import '@/common/css/base.css';
import '@/chatRoom/css/project.scss';
// const $apiUnifiedHandle = apiUnifiedHandle()

/*公共资源挂载*/
for (var name in utils) {
  Vue.prototype['$' + name] = utils[name];
}
for (var name1 in projectUtils) {
  Vue.prototype['$' + name1] = projectUtils[name1];
}
Vue.prototype.$md5 = md5;
Vue.prototype.$api = api({ 'ElementUI': ElementUI });
/*全局引入ElementUI*/
Vue.use(ElementUI, { size: 'small' });

/*定义vue对象，挂载根组件*/
new Vue({
  el: '#app',
  i18n: i18n(Vue),
  router: router(Vue),
  store: store(Vue),
  render: h => h(App)
})
