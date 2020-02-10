<template>
    <div class="fillcontain strategyContainer">
        <head-top></head-top>
        <div class="padding-20">
            <el-page-header @back="goBack" :content="isCreate?'添加攻略信息':'编辑攻略信息'" style="margin-bottom:20px;">
            </el-page-header>
            <el-form ref="strategyForm" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="标题" prop="Title">
                    <el-input v-model.trim="form.Title"/>
                </el-form-item>
                <el-form-item label="地址" prop="Address">
                    <el-input v-model.trim="form.Address"/>
                </el-form-item>
                <el-form-item label="图片" prop="Pictures">
                    <!-- :on-change="preview" -->
                    <!--  -->
                    <!-- :auto-upload="false" -->
                    <el-upload
                        action="/uploadImg"
                        :limit="4"
                        ref="upload"
                        multiple
                        accept=".jpg, .png"
                        :on-remove="handleRemove"
                        :on-change="handleChange"
                        :on-preview="handlePicturePreview"
                        :on-success="handleUploadSuccess"
                        :headers="uploadHead()"
                        :on-exceed="handleExceed"
                        :file-list="form.Pictures"
                        list-type="picture-card">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,最多四张</div>
                    </el-upload>
                    
                </el-form-item>
                <el-form-item label="内容详情" prop="Content">
                    <quill-editor v-model="form.Content"
                        ref="editer"
                        :options="editorOption">
                    </quill-editor>
                    <el-button @click="previewContent">预 览</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-loading.fullscreen.lock="loading" @click="submitForm">提 交</el-button>
                </el-form-item>
            </el-form>
            <!-- 弹窗 -->
            <el-dialog
                title="预览内容详情"
                width="70%"
                :visible.sync="dialogVisible">
                <div v-html="content"></div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible=false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible=false">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog :visible.sync="imgVisible">
                <img :src="dialogImageUrl" width="100%" alt="">
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    const api = require('@/api/getData')
    import { quillEditor } from 'vue-quill-editor'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    export default {
        // 名称
        name: 'strategyInfo',
        data(){
            return {
                dialogVisible:false,
                imgVisible:false,
                content: '',
                editorOption: {theme:'snow'},
                isCreate: true,
                loading: false,
                form: {
                    Title: '',
                    Pictures: [],
                    Address: '',
                    Content: ''
                },
                formCopy: {},
                dialogImageUrl: '',
                dialogVisible: false,
                rules: {
                    Title: [
                        { required: true, message: '请填写标题', trigger: 'blur' }
                    ],
                    Address: [
                        { required: true, message: '请填写地址', trigger: 'blur' }
                    ],
                    Content: [
                        { required: true, message: '请填写内容', trigger: 'blur' }
                    ]
                }
            }
        },
        created(){
            const params = this.$route.query;
            if (params.id) {
                this.isCreate = false;
                api['getStrategyById']({id:params.id}).then(res=>{
                    if(res.code ==1){
                        let data = res.data
                        data.Pictures = JSON.parse(data.Pictures).pictures
                        this.form = data
                        this.formCopy = Object.assign({},data)
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
            headTop,
            quillEditor
    	},
        methods: {
            handlePicturePreview(file){
                this.dialogImageUrl = file.url;
                this.imgVisible = true;
            },
            handleRemove(file) {
                const fileList = [...this.form.Pictures]
                for(const index in fileList){
                    if(fileList[index].name==file.name){
                        fileList.splice(index, 1);
                        break;
                    }
                }
                this.$set(this.form,'Pictures',fileList)
            },
            handleUploadSuccess(response) {
                if(response.code!=1){
                    this.$refs.upload.abort()
                    this.tipsMessage(response.msg, 'error')
                }
            },
            submit(){
                let form = Object.assign({},this.form)
                // 重组name 和 url
                const newPictures = []
                for(const item of form.Pictures){
                    if(item.response&&response.data){
                        newPictures.push(item.response.data)
                    } else {
                        newPictures.push({
                            name:item.name,
                            url:item.url
                        })
                    }
                }
                form.Pictures = JSON.stringify({"pictures":newPictures})
                // form.Pictures = JSON.stringify({"pictures":form.Pictures})
                this.loading = true
                const method = this.isCreate?'insertStrategy':'updateStrategy'
                api[method](form).then(res=>{
                    this.loading = false;
                    if(res.code == 1){
                        this.resetForm();
                        this.$router.replace({ path: '/strategyList' });// 跳转到列表页
                        this.tipsMessage(res.msg, 'success')
                    } else {
                        this.tipsMessage(res.msg, 'error')
                    }
                }).catch(err=>{
                    this.loading = false;
                    this.tipsMessage(err.msg, 'error')
                })
            },
            handleExceed(){
                this.tipsMessage('最多上传四张', 'error')
            },
            // 上传图片token
            uploadHead() {
                const token = this.$store.state.adminInfo.token
                if (token) {
                    const headers = {
                        'Authorization': ['Bearer ', token].join('')
                    };
                    return headers;
                }
            },
            handleChange(file, fileList) {
               this.form.Pictures = fileList
            },
            // beforeAvatarUpload(file){
            //     if (this.isJpgOrPng(file.name) &&this.form.Pictures.length<=4) {
            //         return true;
            //     } else {
            //         this.$message.error("只能上传jpg/png文件,最多四张");
            //         return false;
            //     }
            // },
            // // 上传显示图片
            // preview(file, fileList) {
            //     const checkImage = this.beforeAvatarUpload(file);
            //     if (checkImage) {
            //         this.form.Pictures.push({
            //             url:file.url,
            //             name:file.name
            //         })
            //     }else {
            //         this.$refs.upload.abort()
            //     }
            // },
            // // 判断文件名后缀为JPG或PNG
            // isJpgOrPng(fileName) {
            //     const index = fileName.lastIndexOf('.');
            //     if (index !== -1) {
            //         const suffix = fileName.substring(index + 1).toLowerCase();
            //         if (suffix === 'jpg' || suffix === 'png') {
            //             return true;
            //         } else {
            //             return false
            //         }
            //     } else {
            //         return false
            //     }
            // },
            // 上传图片token
            uploadHead() {
                const token = this.$store.state.adminInfo.token
                if (token) {
                    const headers = {
                        'Authorization': ['Bearer ', token].join('')
                    };
                    return headers;
                }
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
                        this.$router.replace({ path: '/strategyList' });// 跳转到列表页
                    })
                } else {
                    this.resetForm()
                    this.$router.replace({ path: '/strategyList' });// 跳转到列表页
                }
            },
            resetForm(){
                this.$refs.strategyForm.resetFields();
                this.$refs.upload.clearFiles()
                this.form = {
                    Title: '',
                    Pictures: [],
                    Address: '',
                    Content: ''
                }
            },
            previewContent(){
                this.content = this.form.Content
                this.dialogVisible = true;
            },
            submitForm(){
                this.$refs.strategyForm.validate((valid) => {
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

<style>
    .strategyContainer .ql-editor{
        min-height: 300px
    }
</style>