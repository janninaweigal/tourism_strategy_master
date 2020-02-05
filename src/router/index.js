import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
	{
		path: '/',
		component: resolve => require(['@/page/login'], resolve),
		meta: {
			title: '用户登陆'
		}
	},
	{
		path: '/home',
		component: resolve => require(['@/page/home'], resolve),
		meta: {
			title: '首页'
		},
		children: [{
			path: '',
			component: resolve => require(['@/page/statistics'], resolve),
			meta: {
				title: '主页统计'
			}
		},
		// userManage 人员管理
		{
			path: '/userList',
			component: resolve => require(['@/page/userManage/userList'], resolve),
			meta: ['人员管理','用户列表']
		},{
			path: '/adminList',
			component: resolve => require(['@/page/userManage/adminList'], resolve),
			meta: ['人员管理','管理员列表']
		},{
			path: '/adminInfo',
			component: resolve => require(['@/page/userManage/adminInfo'], resolve),
			meta: {
				title: '个人信息'
			}
		},
		// 旅行必备
		{
			path: '/goodsList',
			component: resolve => require(['@/page/goods/index'], resolve),
			meta: ['旅行必备','商品列表']
		},{
			path: '/goodsOrder',
			component: resolve => require(['@/page/goods/order'], resolve),
			meta: ['旅行必备','交易订单']
		},
		// 攻略信息
		{
			path: '/trategyList',
			component: resolve => require(['@/page/strategy/index'], resolve),
			meta: ['攻略信息','攻略列表']
		},
		// 车票管理
		{
			path: '/train',
			component: resolve => require(['@/page/ticketManage/train'], resolve),
			meta: ['车票管理','火车票']
		},
		// 旅游景点
		{
			path: '/touristSpot',
			component: resolve => require(['@/page/touristSpot/index'], resolve),
			meta: ['旅游景点','景点列表']
		},
		// 酒店管理
		{
			path: '/hotelList',
			component: resolve => require(['@/page/hotel/index'], resolve),
			meta: ['酒店管理','酒店列表']
		},{
			path: '/hotelOrder',
			component: resolve => require(['@/page/hotel/order'], resolve),
			meta: ['酒店管理','交易订单']
		},
		// 社区服务
		{
			path: '/community',
			component: resolve => require(['@/page/community/index'], resolve),
			meta: ['社区服务','问题反馈']
		}
	]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
