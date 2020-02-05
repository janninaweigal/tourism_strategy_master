<template>
	<div class="manage_page fillcontain">
		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="min-height: 100%; background-color: #324057;">
				<el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
					<el-menu-item index="home"><i class="el-icon-menu"></i>首页</el-menu-item>
					<el-submenu index="2">
						<template slot="title"><i class="el-icon-document"></i>人员管理</template>
						<el-menu-item index="userList">用户列表</el-menu-item>
						<el-menu-item index="adminList">管理员列表</el-menu-item>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title"><i class="el-icon-plus"></i>旅行必备</template>
						<el-menu-item index="goodsList">商品列表</el-menu-item>
						<el-menu-item index="goodsOrder">交易订单</el-menu-item>
					</el-submenu>
					<el-submenu index="4">
						<template slot="title"><i class="el-icon-edit"></i>攻略信息</template>
						<el-menu-item index="trategyList">攻略列表</el-menu-item>
					</el-submenu>
					<el-submenu index="5">
						<template slot="title"><i class="el-icon-star-on"></i>车票管理</template>
						<el-menu-item index="train">火车票</el-menu-item>
					</el-submenu>
					<el-submenu index="5">
						<template slot="title"><i class="el-icon-star-on"></i>旅游景点</template>
						<el-menu-item index="touristSpot">景点列表</el-menu-item>
					</el-submenu>
					<el-submenu index="6">
						<template slot="title"><i class="el-icon-star-on"></i>酒店管理</template>
						<el-menu-item index="hotelList">酒店列表</el-menu-item>
						<el-menu-item index="hotelOrder">交易订单</el-menu-item>
					</el-submenu>
					<el-submenu index="7">
						<template slot="title"><i class="el-icon-setting"></i>社区服务</template>
						<el-menu-item index="community">问题反馈</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto;">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
    export default {
		computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			}
		},
    }
</script>


<style lang="less" scoped>
	@import '../style/mixin';
</style>
