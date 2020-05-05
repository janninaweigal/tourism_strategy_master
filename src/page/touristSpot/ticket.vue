<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="padding-20">
            <el-form inline @submit.native.prevent>
                <el-form-item>
                    <el-input v-model.trim="searchData.globalName" placeholder="景点名称" class="input-width-230" @keyup.enter.native="search()"/>
                </el-form-item>
                <el-form-item>
                    <!-- 查询按钮 -->
                    <el-button type="primary" @click="search()" >搜索</el-button>
                    <!-- 重置按钮 -->
                    <el-button class="button" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
            <!-- 添加按钮 -->
            <el-button type="primary" @click="addTouristSpotTicket">添加景点门票</el-button>
            <!-- 下方表格 -->
            <customTable ref="customTable" :table-cols="tableCols" :search-data.sync="searchData" :change-page="handleSizeChange" :on-edit="edit" search-method="getTouristSpotTicketList" delete-method="deleteTouristSpotTicket" @appointUser="getAppointUser"/>
            <el-dialog
                title="预约人数"
                :visible.sync="appointDialog"
                width="60%">
                <el-table
                    v-loading="appointLoading" 
                    :data="appointUserList"
                    style="width: 100%">
                    <el-table-column
                        prop="Username"
                        label="姓名">
                    </el-table-column>
                    <el-table-column
                        prop="Avatar"
                        label="头像">
                        <template slot-scope="scope">
                            <img :src="imgUrl + scope.row.Avatar" width="40px" height="40px"/>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="Email"
                        label="邮箱">
                    </el-table-column>
                    <el-table-column
                        prop="IsAdmin"
                        label="是否管理员">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.IsAdmin==1?'管理员':'普通用户'" placement="top">
                            <el-switch
                                :value="scope.row.IsAdmin== 1"
                                disabled>
                            </el-switch>
                        </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="appointDialog = false">取 消</el-button>
                    <el-button type="primary" @click="appointDialog = false">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 弹窗 -->
            <el-dialog
                :title="isCreate?'添加景点门票':'编辑景点门票'"
                :visible.sync="dialogVisible">
                <el-form :model="form" :rules="rules" ref="dialogForm" label-width="110px">
                    <el-form-item label="景点名称" prop="touristSpotId">
                        <el-select v-model="form.touristSpotId" :disabled="!isCreate" placeholder="请选择景点名称">
                            <el-option
                            v-for="item in touristSpotList"
                            :key="item.Id"
                            :label="item.Name"
                            :value="parseInt(item.Id)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="门票类型" prop="type">
                        <el-radio-group v-model="form.type">
                            <el-radio :label="parseInt(1)">儿童票</el-radio>
                            <el-radio :label="parseInt(2)">成人票</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="价格" prop="price">
                        <el-input v-model="form.price"></el-input>
                    </el-form-item>
                    <el-form-item label="票数" prop="num">
                        <el-input v-model="form.num"></el-input>
                    </el-form-item>
                    <el-form-item label="是否预约模式" prop="status">
                        <el-switch
                            v-model="form.status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="预约时间" v-if="form.status==1">
                        <el-date-picker
                            v-model="form.appointTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择预约时间">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" v-loading.fullscreen.lock="loading" @click="submitForm">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import customTable from '@/components/table';
    import {dateformat} from '@/filters/index.js'
    const api = require('@/api/getData')
    export default {
        // 名称
        name: 'touristSpotTicket',
        data(){
            const statusRule = (rule, value, callback) => {
                if (this.form.status) {
                    if(this.form.status == 1 && !this.form.appointTime){
                        callback(new Error('请选择预约时间'));
                    }else{
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const typeRule = (rule, value, callback) => {
                if (this.form.type) {
                    callback();
                } else {
                    callback(new Error('请选择门票类型'));
                }
            };
            return {
                imgUrl: process.env.imgUrl,
                loading: false,
                appointLoading: false,
                tableData: [],
                searchData: {
                    pageSize: 10,
                    pageNo: 1,
                    globalName: ''
                },
                appointDialog: false,
                appointUserList: [],
                tableCols: [
                    { label: '景点名称', prop: 'Name'},
                    { label: '图片', prop: 'Pictures',pictures: true},
                    { label: '门票类型', prop: 'Type',ticketType: true},
                    { label: '门票数', prop: 'Num'},
                    { label: '预约人数', prop: 'AppointUserIds',appointUserNum: true},
                    { label: '是否预约', prop: 'Status',isSwitch: true},
                    { label: '预约时间', prop: 'AppointTime',formMinutes:true},
                    { label: '创建时间', prop: 'CreateTime',formMinutes:true}
                ],
                count: 0,
                isCreate: true,
                dialogVisible: false,
                form: {
                    touristSpotId: null,
                    type: null,
                    num: null,
                    price: null,
                    status: null,
                    appointTime: null
                },
                rules: {
                    touristSpotId: [
                        { type: 'number',required: true, message: '请选择景点名称', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, validator:typeRule, trigger: 'blur' }
                    ],
                    num: [
                        { required: true, message: '请输入票数', trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: '请输入价格', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, validator:statusRule, trigger: 'blur' }
                    ]
                },
                touristSpotList: []
            }
        },
    	components: {
            headTop,
            customTable
        },
        created(){
            api['getAllTouristSpot']({}).then(res=>{
                if(res.code == 1){
                    this.touristSpotList = res.data
                } else {
                    this.tipsMessage(res.msg, 'error')
                }
            }).catch(err=>{
                this.tipsMessage(err.msg, 'error')
            })
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
            // 预约人数
            getAppointUser(userIds){
                this.appointDialog = true
                this.appointLoading = true;
                api["getAppointUsers"]({userIds:userIds}).then(res=>{
                    this.appointLoading = false;
                    if(res.code == 1){
                        this.appointUserList = res.data
                        this.tipsMessage(res.msg, 'success')
                    } else {
                        this.tipsMessage(res.msg, 'error')
                    }
                }).catch(err=>{
                    this.loading = false;
                    this.tipsMessage(err.msg, 'error')
                })
            },
            tipsMessage(txt, type) {
                // 消息提示
                this.$message({
                    message: txt,
                    type: type,
                    showClose: true,
                    duration: 3 * 1000
                });
            },
            edit(row){
                const form = Object.assign(row)
                this.isCreate = false
                this.form.id = form.Id
                this.form.touristSpotId = parseInt(form.TouristSpotId);
                this.form.type = form.Type;
                this.form.num = form.Num;
                this.form.price = form.Price;
                this.form.status = form.Status;
                this.form.appointTime = dateformat(form.AppointTime,'YYYY-MM-DD HH:mm:ss');
                this.dialogVisible = true;
            },
            addTouristSpotTicket(){
                this.isCreate = true
                this.resetForm();
                this.dialogVisible = true;
            },
            // 关闭弹窗
            handleClose(){
                this.resetForm();
                this.dialogVisible = false
            },
            resetForm(){
                this.form = {
                    touristSpotId: null,
                    type: 0,
                    num: null,
                    price: null,
                    status: null,
                    appointTime: null
                }
            },
            // 弹窗提交
            submitForm(){
                this.$refs.dialogForm.validate((valid) => {
                    if (valid) {
                        let form = Object.assign({},this.form)
                        this.loading = true
                        if(form.status!=1){
                            form.appointTime = null
                        }
                        const method = this.isCreate?'insertTouristSpotTicket':'updateTouristSpotTicket'
                        api[method](form).then(res=>{
                            this.loading = false;
                            if(res.code == 1){
                                this.resetForm();
                                this.dialogVisible = false
                                this.tipsMessage(res.msg, 'success')
                                this.search();
                            } else {
                                this.tipsMessage(res.msg, 'error')
                            }
                        }).catch(err=>{
                            this.loading = false;
                            this.tipsMessage(err.msg, 'error')
                        })
                    } else {
                        return false;
                    }
                });
            }
        },
    }
</script>


