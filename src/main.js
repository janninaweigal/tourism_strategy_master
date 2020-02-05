import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
// 全局过滤器
import * as filters from './filters';

Vue.config.productionTip = false;

Vue.use(ElementUI);
// 注册全局过滤器
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
});
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
