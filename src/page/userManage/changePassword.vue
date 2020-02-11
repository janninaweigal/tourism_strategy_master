<template>
    <div class="fillcontain">
        <head-top></head-top>
        <header class="admin_title">修改密码</header>
        <div class="admin_set">
            <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px">
                <el-form-item label="旧密码" prop="oldPwd">
                    <el-input v-model.number="form.oldPwd"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="pass">
                    <el-input type="password" v-model="form.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="form.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-loading.fullscreen.lock="loading" @click="submitForm()">提交</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
	import headTop from '@/components/headTop'
    import {mapState,mapActions} from 'vuex'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {changePwd} from '@/api/getData'
    export default {
        data(){
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else {
                    if (this.form.checkPass !== '') {
                        this.$refs.form.validateField('checkPass');
                    }
                    callback();
                }
            };
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                loading: false,
                rules: {
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    oldPwd: [
                        { required: true, message: '请填写旧密码', trigger: 'blur' }
                    ]
                },
                form: {
                    pass:'',
                    oldPwd:'',
                    checkPass:''
                }
            }
        },
    	components: {
    		headTop,
    	},
        methods: {
            submitForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        changePwd(this.form).then(res=>{
                            this.loading = false;
                            if(res.code == 1){
                                this.resetForm();
                                this.tipsMessage(res.msg, 'success')
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
            tipsMessage(txt, type) {
                // 消息提示
                this.$message({
                    message: txt,
                    type: type,
                    showClose: true,
                    duration: 3 * 1000
                });
            },
            resetForm() {
                this.$refs.form.resetFields();
            }
        },
    }
</script>

<style lang="less">
    @import '../../style/mixin';
    .admin_set{
        width: 60%;
        padding: 20px;
        background-color: #F9FAFC;
        min-height: 400px;
        margin: 20px auto 0;
        border-radius: 10px;
    }
    .admin_title{
        margin-top: 20px;
        .sc(24px, #666);
        text-align: center;
    }
</style>
