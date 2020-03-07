<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="padding-20">
            <el-form inline @submit.native.prevent>
                <el-form-item>
                    <el-input v-model.trim="searchData.globalName" placeholder="商品名称" class="input-width-230" @keyup.enter.native="search()"/>
                </el-form-item>
                <el-form-item>
                    <!-- 查询按钮 -->
                    <el-button type="primary" @click="search()" >搜索</el-button>
                    <!-- 重置按钮 -->
                    <el-button class="button" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
            <!-- 添加按钮 -->
            <el-button type="primary" @click="addAdminInfo">添加商品</el-button>
            <!-- 下方表格 -->
            <customTable ref="customTable" isCheckImg :table-cols="tableCols" :search-data.sync="searchData" :change-page="handleSizeChange" :on-edit="edit" search-method="getGoodsList" delete-method="deleteGoods"/>
            <!-- 弹窗 -->
            <el-dialog
                :title="isCreate?'添加商品信息':'编辑商品信息'"
                :visible.sync="dialogVisible"
                :before-close="handleClose">
                <el-form :model="form" :rules="rules" ref="dialogForm" label-width="100px">
                    <el-form-item label="商品名称" prop="Name">
                        <el-input v-model="form.Name"></el-input>
                    </el-form-item>
                    <el-form-item label="价格" prop="Price">
                        <el-input v-model="form.Price"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="Photo">
                        <upload-img :image-path="form.Photo" @uploadAvatar="uploadAvatar"/>
                    </el-form-item>
                    <el-form-item label="是否自营">
                        <el-switch
                            v-model="form.Type"
                            active-text="自营"
                            inactive-text="非自营">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="物品状态" prop="Status">
                        <el-radio-group v-model="form.Status">
                            <el-radio :label="1">上架</el-radio>
                            <el-radio :label="2">销售</el-radio>
                            <el-radio :label="3">下架</el-radio>
                        </el-radio-group>
                        <el-input v-if="[1,2,0].indexOf(form.Status)!=-1" v-model="form.Num" placeholder="请填写物品数量"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="Detail">
                        <el-input type="textarea" :rows="5" v-model.trim="form.Detail"/>
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
    import uploadImg from '@/components/uploadImg';
    const api = require('@/api/getData')
    export default {
        // 名称
        name: 'goodsList',
        data(){
            const statusRule = (rule, value, callback) => {
                if (value==null) {
                    callback(new Error('请选择物品状态'));
                } else {
                    if(value==3){
                        callback();
                    } else {
                        this.form.Num?callback():callback(new Error('请填写物品数量'));
                    }
                }
            };
            return {
                loading: false,
                tableData: [],
                searchData: {
                    pageSize: 10,
                    pageNo: 1,
                    globalName: ''
                },
                tableCols: [
                    { label: '商品名称', prop: 'Name'},
                    { label: '图片', prop: 'Photo',isAvatar: true},
                    { label: '价格', prop: 'Price'},
                    { label: '类别', prop: 'Type',goodType: true},
                    { label: '物品状态', prop: 'Status',goodStatus: true},
                    { label: '数量', prop: 'Num'},
                    { label: '描述', prop: 'Detail'},
                    { label: '创建时间', prop: 'CreateTime',formMinutes:true,width:'180px'}
                ],
                count: 0,
                isCreate: true,
                form: {
                    Name: '',
                    Photo: '',
                    Price: '',
                    Type: false,
                    Status: null,
                    Num: '',
                    Detail:''
                },
                dialogVisible: false,
                rules: {
                    Name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                        { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                    ],
                    Photo: [
                        { required: true, message: '请上传图片', trigger: 'blur' }
                    ],
                    Price: [
                        { required: true, message: '请填写价格', trigger: 'blur' }
                    ],
                    Status: [
                        { required: true, validator:statusRule, trigger: 'change' }
                    ],
                    Detail: [
                        { required: true, message: '请填写描述', trigger: 'blur' }
                    ]
                }
            }
        },
    	components: {
            headTop,
            customTable,
            uploadImg
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
                const form = Object.assign({},row)
                form.Type = form.Type ==1
                form.Photo = process.env.imgUrl + form.Photo
                this.isCreate = false
                this.form = form
                this.dialogVisible = true
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
                    if (valid) {
                        let form = Object.assign({},this.form)
                        form.Type = form.Type?1:0
                        this.loading = true
                        const method = this.isCreate?'insertGoods':'updateGoods'
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
            },
            // 重置表单
            resetForm(){
                this.$refs.dialogForm.resetFields();
                this.form = {
                    Name: '',
                    Photo: '',
                    Price: '',
                    Type: false,
                    Status: null,
                    Num: '',
                    Detail:''
                }
            },
            uploadAvatar(file){
                // 实例化FormData对象
                const reader = new FileReader();
                reader.readAsDataURL(file.raw);
                reader.onloadend = ()=> {
                    this.form.Photo = reader.result
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


