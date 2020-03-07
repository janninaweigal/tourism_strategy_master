<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="padding-20">
            <el-form inline @submit.native.prevent>
                <el-form-item>
                    <el-input v-model.trim="searchData.globalName" placeholder="景点" class="input-width-230" @keyup.enter.native="search()"/>
                </el-form-item>
                <el-form-item>
                    <!-- 查询按钮 -->
                    <el-button type="primary" @click="search()" >搜索</el-button>
                    <!-- 重置按钮 -->
                    <el-button class="button" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
            <!-- 添加按钮 -->
            <el-button type="primary" @click="addTouristSpot">添加景点</el-button>
            <!-- 下方表格 -->
            <customTable ref="customTable" :table-cols="tableCols" :search-data.sync="searchData" :change-page="handleSizeChange" :on-edit="edit" search-method="getTouristSpotList" delete-method="deleteTouristSpot"/>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import customTable from '@/components/table';
    const api = require('@/api/getData')
    export default {
        // 名称
        name: 'touristSpot',
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
                    { label: '景点名称', prop: 'Name'},
                    { label: '图片', prop: 'Pictures',pictures: true},
                    { label: '地址', prop: 'Address'},
                    { label: '描述', prop: 'Detail'},
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
                this.$router.replace({ path: '/touristSpotInfo',query: { id: row.Id}});
            },
            addTouristSpot(){
                this.isCreate = true
                this.$router.replace({ path: '/touristSpotInfo'});
            }
        },
    }
</script>


