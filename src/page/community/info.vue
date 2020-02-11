<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="padding-20">
            <el-page-header @back="goBack" :content="isCreate?'添加反馈信息':'编辑反馈信息'" style="margin-bottom:20px;">
            </el-page-header>
            <el-form ref="commentForm" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="反馈" prop="Content">
                    <el-input type="textarea" :row="10" v-model="form.Content" placeholder="请填写反馈"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-loading.fullscreen.lock="loading" @click="submitForm">提 交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    const api = require('@/api/getData')
    export default {
        // 名称
        name: 'commentInfo',
        data(){
            return {
                isCreate: true,
                loading: false,
                form: {
                    Content: ''
                },
                formCopy: {},
                rules: {
                    Content: [
                        { required: true, message: '请填写反馈', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted(){
            const params = this.$route.query;
            if (params.id) {
                this.isCreate = false;
                api['getCommunityById']({id:params.id}).then(res=>{
                    if(res.code ==1){
                        this.form = res.data
                        this.formCopy = Object.assign({},res.data)
                        this.tipsMessage(res.msg, 'success')
                    } else {
                        this.tipsMessage(res.msg, 'error')
                    }
                })
            } else {
                this.isCreate = true;
                this.formCopy = Object.assign({},this.form)
            }
        },
    	components: {
            headTop
    	},
        methods: {
            submit(){
                let form = Object.assign({},this.form)
                this.loading = true
                const method = this.isCreate?'insertCommunity':'updateCommunity'
                api[method](form).then(res=>{
                    this.loading = false;
                    if(res.code == 1){
                        this.resetForm();
                        this.$router.replace({ path: '/community' });// 跳转到列表页
                        this.tipsMessage(res.msg, 'success')
                    } else {
                        this.tipsMessage(res.msg, 'error')
                    }
                }).catch(err=>{
                    this.loading = false;
                    this.tipsMessage(err.msg, 'error')
                })
            },
            goBack() {
                let flag = false
                const originForm = this.formCopy
                const form = this.form
                for(const key in form){
                    if(form[key] instanceof Array){
                        if(originForm[key].length!=form[key].length){
                            flag = true;
                            break;
                        }
                    } else if(originForm[key]!=form[key]){
                        flag = true;
                        break;
                    }
                }
                if(flag){
                    this.$confirm('填写的数据会丢失，是否确认返回？', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        closeOnClickModal: false
                    }).then(() => {
                        this.resetForm()
                        this.$router.replace({ path: '/community' });// 跳转到列表页
                    })
                } else {
                    this.resetForm()
                    this.$router.replace({ path: '/community' });// 跳转到列表页
                }
            },
            resetForm(){
                this.$refs.commentForm.resetFields();
                this.form = {
                    Content: ''
                }
            },
            submitForm(){
                this.$refs.commentForm.validate((valid) => {
                    if (valid) {
                        this.submit();
                    } else {
                        return false;
                    }
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
            }
        },
    }
</script>