<template>
    <div class="header_container">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-dropdown @command="handleCommand">
			<div class="userbox"><span class="username">{{adminInfo.username}}</span><img :src="imgUrl + adminInfo.avatar" class="avator"></div>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="statistics">首页</el-dropdown-item>
				<el-dropdown-item command="adminInfo">个人中心</el-dropdown-item>
				<el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
				<el-dropdown-item command="signout">退出</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
    </div>
</template>

<script>
	import {signout} from '@/api/getData'
	import {mapState} from 'vuex'

    export default {
    	data(){
    		return {
    			imgUrl: process.env.imgUrl
    		}
    	},
    	computed: {
    		...mapState(['adminInfo']),
    	},
		methods: {
			async handleCommand(command) {
				if (command == 'statistics') {
					this.$router.replace('/home');
				}else if(command == 'adminInfo'){
					this.$router.replace('/adminInfo');
				}else if(command == 'changePassword'){
					this.$router.replace('/changePassword');
				}else if(command == 'signout'){
					sessionStorage.removeItem('adminToken')
					this.$message({
						type: 'success',
						message: '退出成功'
					});
					this.$router.replace('/');
				}
			},
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.header_container{
		background-color: #EFF2F7;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
		.userbox{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.username{
			margin-right:20px;
			font-weight: bolder;
		}
	}
	.avator{
		.wh(36px, 36px);
		border-radius: 50%;
		margin-right: 37px;
		cursor: pointer;
	}
	.el-dropdown-menu__item{
        text-align: center;
    }
</style>
