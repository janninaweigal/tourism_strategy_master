<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="padding-20">
            <el-form inline @submit.native.prevent>
                <el-form-item>
                    <el-input v-model.trim="searchData.globalName" placeholder="用户名" class="input-width-230" @keyup.enter.native="search()"/>
                </el-form-item>
                <el-form-item>
                    <!-- 查询按钮 -->
                    <el-button type="primary" @click="search()" >搜索</el-button>
                    <!-- 重置按钮 -->
                    <el-button class="button" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
            <!-- 添加按钮 -->
            <el-button type="primary" @click="addComment">添加反馈</el-button>
            <!-- 下方表格 -->
            <customTable ref="customTable" isCheckImg :table-cols="tableCols" :search-data.sync="searchData" :change-page="handleSizeChange" :on-edit="edit" search-method="getCommunityList" delete-method="deleteCommunity"/>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import customTable from '@/components/table';
    const api = require('@/api/getData')
    export default {
        // 名称
        name: 'Community',
        data(){
            return {
                loading: false,
                tableData: [],
                searchData: {
                    pageSize: 10,
                    pageNo: 1,
                    globalName: ''
                },
                tableCols: [
                    { label: '用户', prop: 'Username'},
                    { label: '内容', prop: 'Content'},
                    { label: '创建时间', prop: 'CreateTime',formMinutes:true}
                ],
                count: 0,
                isCreate: true
            }
        },
    	components: {
            headTop,
            customTable
    	},
        methods: {
            search(){
                this.$refs.customTable.search();
            },
            // 重置搜索条件
            reset() {
                this.searchData.globalName = '';
            },
            handleSizeChange(val) {
                this.searchData.pageNo = val;
            },
            edit(row){
                this.isCreate = false
                this.$router.replace({ path: '/communityInfo',query: { id: row.Id}});
            },
            addComment(){
                this.isCreate = true
                this.$router.replace({ path: '/communityInfo'});
            }
        },
    }
</script>


