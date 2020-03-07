<template>
    <div class="train fillcontain">
        <head-top></head-top>
        <div class="padding-20">
            <el-form inline @submit.native.prevent>
                <el-form-item>
                    <el-input v-model.trim="searchData.globalName" placeholder="车次编号/开始地点/结束地点" class="input-width-230" @keyup.enter.native="search()"/>
                </el-form-item>
                <el-form-item>
                    <!-- 查询按钮 -->
                    <el-button type="primary" @click="search()" >搜索</el-button>
                    <!-- 重置按钮 -->
                    <el-button class="button" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
            <!-- 添加按钮 -->
            <el-button type="primary" @click="addAdminInfo">添加火车票</el-button>
            <!-- 下方表格 -->
            <customTable ref="customTable" :train-types="trainTypes" :table-cols="tableCols" :search-data.sync="searchData" :change-page="handleSizeChange" :on-edit="edit" search-method="getTrainList" delete-method="deleteTrain"/>
            <!-- 弹窗 -->
            <el-dialog
                :title="isCreate?'添加火车票信息':'编辑火车票信息'"
                :visible.sync="dialogVisible"
                width="60%"
                :before-close="handleClose">
                <el-form :model="form" :rules="rules" ref="dialogForm" label-width="120px">
                    <el-form-item label="车次类型" prop="Type">
                        <el-select v-model="form.Type" :disabled="!isCreate" placeholder="请选择车次类型">
                            <el-option
                            v-for="(item,key) in trainTypes"
                            :key="key"
                            :label="item"
                            :value="parseInt(key)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车次编号" prop="TrainCode">
                        <el-input v-model="form.TrainCode" :disabled="!isCreate" placeholder="请填写车次编号"></el-input>
                    </el-form-item>
                    <el-form-item label="开始/结束地点" prop="place">
                        <div style="display:flex;justify-content: space-between;align-items: center;">
                            <el-input v-model="form.StartPlace" placeholder="请填写开始地点"></el-input>
                            <span style="width:30px;height:1px;background-color:#000;margin:0px 10px;"></span>
                            <el-input v-model="form.EndPlace" placeholder="请填写结束地点"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="到达时间" prop="ArriveTime">
                        <el-date-picker
                        v-model="form.ArriveTime"
                        type="datetime"
                        placeholder="选择到达时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="发车时间" prop="DepartTime">
                        <el-date-picker
                            v-model="form.DepartTime"
                            type="datetime"
                            placeholder="选择发车时间">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <ticketStation ref="ticketStation" :form="form" :station-data="form.OverStations" :on-delete="removeStation" :table-cols="stationCols" @addStation="addStation"/>
                <ticketSeat ref="ticketSeat" :seat-types="seatTypes" :form="form" :seats-data="form.Seats" :on-delete="removeSeat" :table-cols="seatCols" @addSeats="addSeat"/>                
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
    import customTable from '@/components/table'
    import ticketStation from '@/components/ticketStation';
    import ticketSeat from '@/components/ticketSeat';
    const api = require('@/api/getData')
    export default {
        // 名称
        name: 'trainList',
        data(){
            const placeRule = (rule, value, callback) => {
                if (this.form.StartPlace == '') {
                    callback(new Error('请填写开始地点'));
                } else if (this.form.EndPlace == '') {
                    callback(new Error('请填写结束地点'));
                } else {
                    callback();
                }
            };
            return {
                trainTypes:{
                    1:'G-高铁',
                    2:'C-城际',
                    3:'Z-直达',
                    4:'T-特快',
                    5:'K-快速',
                },
                loading: false,
                tableData: [],
                searchData: {
                    pageSize: 10,
                    pageNo: 1,
                    globalName: ''
                },
                tableCols: [
                    { label: '车次编号', prop1: 'Type',prop2: 'TrainCode',isTrainCode:true},
                    { label: '开始地点', prop: 'StartPlace'},
                    { label: '结束地点', prop: 'EndPlace'},
                    { label: '列车座位详情', prop: 'SeatDes',width:'225px'},
                    { label: '经停站详情', prop: 'StopOverDes',width:'210px'},
                    { label: '创建时间', prop: 'CreateTime',formMinutes:true,width:'180px'}
                ],
                count: 0,
                isCreate: true,
                form: {
                    TrainCode: '',
                    StartPlace: '',
                    EndPlace: '',
                    Type: null,
                    ArriveTime:null,
                    DepartTime:null,
                    OverStations:[],
                    Seats: []
                },
                seatTypes: {
                    0:'硬座',
                    1:'硬卧',
                    2:'软卧',
                    3:'高级软卧'
                },
                // 经停站
                stationCols: [
                    { label: '车站名', prop: 'place',prop1: 'Place', place: true,width:'145px' },
                    { label: '到达/发车时间', prop: 'timeRange',prop1: 'ArriveTime',prop2: 'DepartTime', time: true }
                ],
                // 列车座位
                seatCols: [
                    { label: '类型', prop: 'Type',type: true,width:'160px'},
                    { label: '价格', prop: 'Price',price:true},
                    { label: '数量', prop: 'Quantity',quantity:true}
                ],
                dialogVisible: false,
                rules: {
                    Type: [
                        { type: 'number',required: true, message: '请选择车次类型', trigger: 'blur' }
                    ],
                    TrainCode: [
                        { required: true, message: '请填写车次编号', trigger: 'blur' }
                    ],
                    place: [
                        { required: true, validator:placeRule, trigger: 'blur' }
                    ],
                    ArriveTime: [
                        { type: 'date',required: true, message: '请选择到达时间', trigger: 'blur' }
                    ],
                    DepartTime: [
                        { type: 'date',required: true, message: '请选择发车时间', trigger: 'blur' }
                    ]
                }
            }
        },
    	components: {
            headTop,
            customTable,
            ticketStation,
            ticketSeat
    	},
        methods: {
            removeStation(index){
                this.form.OverStations.splice(index, 1);
            },
            addStation(){
                this.form.OverStations.push({
                    place: '',
                    timeRange: ''
                })
            },
            removeSeat(index){
                this.form.Seats.splice(index, 1);
            },
            addSeat(){
                this.form.Seats.push({
                    Type: null,
                    Price: null,
                    Quantity: null
                })
            },
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
                api['getTrainById']({id:row.Id}).then(res=>{
                    this.loading = false;
                    if(res.code == 1){
                        let data = res.data
                        data.ArriveTime = new Date(data.ArriveTime)
                        data.DepartTime = new Date(data.DepartTime)
                        this.form = res.data
                        this.isCreate = false
                        this.dialogVisible = true
                    } else {
                        this.tipsMessage(res.msg, 'error')
                    }
                }).catch(()=>{
                    this.loading = false;
                    this.tipsMessage(err.msg, 'error')
                })
            },
            addAdminInfo(){
                this.isCreate = true
                this.dialogVisible =true;
            },
            // 关闭弹窗
            handleClose(){
                this.resetForm();
                this.dialogVisible = false
            },
            // 弹窗提交
            submitForm(){
                this.$refs.dialogForm.validate((valid) => {
                    this.$refs.ticketStation.validateForm().then(res=>{
                        this.$refs.ticketSeat.validateForm().then(res1=>{
                            if (valid&&res&&res1) {
                                let form = Object.assign({},this.form)
                                form.Type = form.Type?1:0
                                this.loading = true
                                const method = this.isCreate?'insertTrain':'updateTrain'
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
                        })
                    })
                });
            },
            // 重置表单
            resetForm(){
                this.$refs.dialogForm.resetFields();
                this.$refs.ticketSeat.resetFields();
                this.$refs.ticketStation.resetFields();
                this.form = {
                    TrainCode: '',
                    StartPlace: '',
                    EndPlace: '',
                    Type: null,
                    ArriveTime:null,
                    DepartTime:null,
                    OverStations:[],
                    Seats: []
                }
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