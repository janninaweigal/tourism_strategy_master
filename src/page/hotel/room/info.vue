<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="padding-20">
            <el-page-header @back="goBack" :content="isCreate?'添加房间信息':'编辑房间信息'" style="margin-bottom:20px;">
            </el-page-header>
            <el-form ref="roomForm" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="酒店" prop="HotelId">
                    <el-select v-model="form.HotelId" style="width:55%" clearable filterable placeholder="请选择酒店">
                        <el-option
                        v-for="item in hotels"
                        :key="item.Id"
                        :label="item.Name"
                        :value="item.Id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="房间号" prop="RoomCode">
                    <el-input v-model.trim="form.RoomCode" placeholder="请填写房间号"/>
                </el-form-item>
                <el-form-item label="图片" prop="Pictures">
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
                <el-form-item label="床型" prop="BedType">
                    <el-radio-group v-model="form.BedType">
                        <el-radio :label="1">单人床</el-radio>
                        <el-radio :label="2">双人床</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="价格" prop="Price">
                    <el-input v-model.number="form.Price" placeholder="请填写价格"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-loading.fullscreen.lock="loading" @click="submitForm">提 交</el-button>
                </el-form-item>
            </el-form>
            <el-dialog :visible.sync="dialogVisible">
                <img :src="dialogImageUrl" width="100%" alt="">
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    const api = require('@/api/getData')
    export default {
        // 名称
        name: 'hotelInfo',
        data(){
            return {
                hotels: [],
                isCreate: true,
                loading: false,
                dialogImageUrl: '',
                dialogVisible: false,
                form: {
                    HotelId: null,
                    RoomCode: '',
                    Pictures: [],
                    BedType:null,
                    Price: null
                },
                formCopy: {},
                rules: {
                    HotelId: [
                        { required: true, message: '请选择酒店', trigger: 'blur' }
                    ],
                    RoomCode: [
                        { required: true, message: '请填写房间号', trigger: 'blur' }
                    ],
                    BedType: [
                        { required: true, message: '请选择床型', trigger: 'blur' }
                    ],
                    Price: [
                        { required: true, message: '请填写价格', trigger: 'blur' }
                    ]
                }
            }
        },
        created(){
            api['getAllHotel']().then(res=>{
                if(res.code ==1){
                    this.hotels= res.data
                }
            })
        },
        mounted(){
            const params = this.$route.query;
            if (params.id) {
                this.isCreate = false;
                api['getRoomById']({id:params.id}).then(res=>{
                    if(res.code ==1){
                        let data = res.data
                        data.Pictures = JSON.parse(data.Pictures).pictures.map(item=>{
                            item.url = process.env.imgUrl+item.url;
                            return item;
                        })
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
            headTop
    	},
        methods: {
            handlePicturePreview(file){
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
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
                let newPictures = []
                for(let item of form.Pictures){
                    if(item.response&&item.response.data){
                        let data = item.response.data;
                        data.url = data.url.slice(data.url.indexOf('images'))
                        newPictures.push(data)
                    } else {
                        newPictures.push({
                            name:item.name,
                            url:item.url.slice(item.url.indexOf('images'))
                        })
                    }
                }
                form.Pictures = JSON.stringify({"pictures":newPictures})
                this.loading = true
                const method = this.isCreate?'insertRoom':'updateRoom'
                api[method](form).then(res=>{
                    this.loading = false;
                    if(res.code == 1){
                        this.resetForm();
                        this.$router.replace({ path: '/roomList' });// 跳转到列表页
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
                        this.$router.replace({ path: '/roomList' });// 跳转到列表页
                    })
                } else {
                    this.resetForm()
                    this.$router.replace({ path: '/roomList' });// 跳转到列表页
                }
            },
            resetForm(){
                this.$refs.roomForm.resetFields();
                this.$refs.upload.clearFiles()
                this.form = {
                    HotelId: null,
                    RoomCode: '',
                    Pictures: [],
                    BedType:null,
                    Price: ''
                }
            },
            submitForm(){
                this.$refs.roomForm.validate((valid) => {
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