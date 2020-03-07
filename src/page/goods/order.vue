<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="padding-20">
            <el-form inline @submit.native.prevent>
                <el-form-item>
                    <el-input v-model.trim="searchData.globalName" placeholder="商品订单号" class="input-width-230" @keyup.enter.native="search()"/>
                </el-form-item>
                <el-form-item>
                    <!-- 查询按钮 -->
                    <el-button type="primary" @click="search()" >搜索</el-button>
                    <!-- 重置按钮 -->
                    <el-button class="button" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
            <!-- 下方表格 -->
            <customTable ref="customTable" :table-cols="tableCols" :search-data.sync="searchData" :is-edit="false" :is-delete="false" :on-look="look" isCheck :change-page="handleSizeChange" search-method="getGoodsOrderList"/>
            <!-- 弹窗 -->
            <el-dialog
                title="订单详情"
                :visible.sync="dialogVisible">
                <el-form :model="form" ref="dialogForm" label-width="100px">
                    <el-form-item label="商品名称" prop="Name">
                        <el-input v-model="form.Name" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="Photo">
                        <img :src="form.Photo" width="60px" height="60px"/>
                    </el-form-item>
                    <el-form-item label="价格" prop="Price">
                        <el-input v-model="form.Price" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="支付宝用户号" prop="Seller_Id">
                        <el-input v-model="form.Seller_Id" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="商品订单号" prop="Out_Trade_No">
                        <el-input v-model="form.Out_Trade_No" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="Name">
                        <el-input v-model="form.Name" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="Phone">
                        <el-input v-model="form.Phone" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="Address">
                        <el-input v-model="form.Address" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="支付总额" prop="Total_Amount">
                        <el-input v-model="form.Total_Amount" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="CreateTime">
                        <el-input v-model="form.CreateTime" readonly></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeForm()">取 消</el-button>
                    <el-button type="primary" @click="closeForm()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import customTable from '@/components/table';
    import {dateformat} from '@/filters/index'
    const api = require('@/api/getData')
    export default {
        // 名称
        name: 'goodsOrderList',
        data(){
            return {
                dialogVisible: false,
                tableData: [],
                searchData: {
                    pageSize: 10,
                    pageNo: 1,
                    globalName: ''
                },
                form: {},
                tableCols: [
                    { label: '商品订单号', prop: 'Out_Trade_No'},
                    { label: '支付宝用户号', prop: 'Seller_Id'},
                    { label: '商品名称', prop: 'GoodsName'},
                    { label: '图片', prop: 'Photo',isAvatar: true},
                    { label: '价格', prop: 'Price'},
                    { label: '数量', prop: 'Quantity'},
                    { label: '支付总额', prop: 'Total_Amount'},
                    { label: '创建时间', prop: 'CreateTime',formMinutes:true,width:'180px'}
                ],
                count: 0
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
            closeForm(){
                this.form = {};
                this.dialogVisible = false
            },
            look(row){
                const form = Object.assign({},row)
                form.Photo = process.env.imgUrl + form.Photo
                form.CreateTime = dateformat(form.CreateTime,'YYYY-MM-DD HH:mm:ss')
                this.form = form
                this.dialogVisible = true
            },
            tipsMessage(txt, type) {
                // 消息提示
                this.$message({
                    message: txt,
                    type: type,
                    showClose: true,
                    duration: 3 * 1000
                });
            }
        },
    }
</script>


