<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="padding-20">
            <el-form inline @submit.native.prevent>
                <el-form-item label="全局搜索">
                    <el-input v-model.trim="searchData.globalName" placeholder="用户名/邮箱" class="input-width-230" @keyup.enter.native="search()"/>
                </el-form-item>
                <el-form-item>
                    <!-- 查询按钮 -->
                    <el-button type="primary" @click="search()" >搜索</el-button>
                    <!-- 重置按钮 -->
                    <el-button class="button" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
            <!-- 添加按钮 -->
            <el-button type="primary" @click="addAdminInfo">添加用户</el-button>
            <!-- 下方表格 -->
            <customTable ref="customTable" :table-cols="tableCols" :search-data.sync="searchData" :change-page="handleSizeChange" :on-edit="edit" search-method="getUserList" delete-method="deleteUser"/>
            <!-- 弹窗 -->
            <el-dialog
                :title="isCreate?'添加用户信息':'编辑用户信息'"
                :visible.sync="dialogVisible"
                :before-close="handleClose">
                <el-form :model="form" :rules="rules" ref="dialogForm" label-width="100px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="是否管理员">
                        <el-switch
                            v-model="form.isAdmin"
                            active-text="管理员"
                            inactive-text="普通用户">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="头像">
                        <upload-img :image-url="form.avatar" @uploadAvatar="uploadAvatar"/>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" disabled v-model="desc"></el-input>
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
        name: 'adminList',
        data(){
            const isAdminRule = (rule, value, callback) => {
                if (value !=null) {
                    callback();
                } else {
                    callback(new Error('请选择是否管理员'));
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
                    { label: '姓名', prop: 'Username'},
                    { label: '头像', prop: 'Avatar',isAvatar: true},
                    { label: '邮箱', prop: 'Email'},
                    { label: '是否管理员', prop: 'IsAdmin',isAdmin: true},
                    { label: '创建时间', prop: 'CreateTime',formMinutes:true}
                ],
                count: 0,
                isCreate: true,
                desc: '密码默认123，修改密码请到个人中心修改',
                form: {
                    username: '',
                    email: '',
                    avatar: '',
                    isAdmin: false
                },
                dialogVisible: false,
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
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
                this.isCreate = false
                this.form.id = row.Id
                this.form.username = row.Username
                this.form.email = row.Email
                this.form.avatar = process.env.LOCAL_API + row.Avatar
                this.form.isAdmin = row.isAdmin ==1
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
                        if(form.avatar){
                            const reg=new RegExp(process.env.LOCAL_API,"gmi");
                            if(form.avatar.indexOf(process.env.LOCAL_API)!=-1){
                                form.avatar = form.avatar.replace(reg,'')
                            }
                        }
                        this.loading = true
                        const method = this.isCreate?'insertUser':'updateUser'
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
                    username: '',
                    email: '',
                    avatar: '',
                    isAdmin: false
                }
            },
            uploadAvatar(file){
                this.form.avatar = file.url
                // 实例化FormData对象
                const reader = new FileReader();
                reader.readAsDataURL(file.raw);
                reader.onloadend = ()=> {
                    this.form.file = reader.result
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

<style lang="less">
</style>
