<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="padding-20">
            <!-- 下方表格 -->
            <customTable :table-cols="tableCols" :search-data.sync="searchData" :change-page="handleSizeChange" :on-edit="edit" search-method="getAdminList" delete-method="deleteUser"/>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import CustomTable from '@/components/table';
    export default {
        // 名称
        name: 'adminList',
        data(){
            return {
                tableData: [],
                searchData: {
                    pageSize: 10,
                    pageNo: 1,
                    globalName: ''
                },
                tableCols: [
                    { label: '姓名', prop: 'Username'},
                    { label: '头像', prop: 'Avatar'},
                    { label: '邮箱', prop: 'Email'},
                    { label: '创建时间', prop: 'CreateTime',formMinutes:true}
                ],
                count: 0
            }
        },
    	components: {
            headTop,
            CustomTable 
    	},
        methods: {
            handleSizeChange(val) {
                this.searchData.pageNo = val;
            },
            edit(){

            }
        },
    }
</script>

<style lang="less">
	@import '../../style/mixin';
    .table_container{
        padding: 20px;
    }
</style>


