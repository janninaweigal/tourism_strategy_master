<template>
    <div class="fillcontain">
        <head-top></head-top>
        <header class="admin_title">个人中心</header>
        <div class="admin_set">
            <ul>
                <li>
                    <span>姓名：{{adminInfo.username}}</span>
                </li>
                <li>
                    <span>注册时间：{{ adminInfo.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
                </li>
                <li>
                    <span>更换头像：</span>
                    <img :src="baseImgPath + adminInfo.avatar" class="avatar">
                    <el-upload
                        action="/upladAvatar"
                        ref="upload"
                        accept=".jpg, .png"
                        :show-file-list="false"
                        :headers="uploadHead()"
                        :before-upload="beforeImgUpload"
                        :on-success="handleUploadSuccess">
                        <el-button>更换头像</el-button>
                        </el-upload>
                    </el-form-item>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
	import headTop from '@/components/headTop'
    import {mapState,mapActions} from 'vuex'
    import {baseUrl, baseImgPath} from '@/config/env'

    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
            }
        },
    	components: {
    		headTop,
    	},
        computed: {
            ...mapState(['adminInfo']),
        },
        methods: {
            ...mapActions(['saveAdminInfo']),
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
            handleUploadSuccess(res, file) {
                if (res.code == 1) {
                    this.adminInfo.avatar = res.data.name;
                    this.saveAdminInfo(this.adminInfo);
                    this.$message.success(res.msg);
                }else{
                    this.$message.error(res.msg);
                }
            },
            beforeImgUpload(file) {
                const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isRightType) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isRightType && isLt2M;
            },
        },
    }
</script>

<style lang="less">
	@import '../../style/mixin';
    .admin_set{
        width: 60%;
        background-color: #F9FAFC;
        min-height: 400px;
        margin: 20px auto 0;
        border-radius: 10px;
        ul > li{
            padding: 20px;
            text-align: center;
            span{
                color: #666;
            }
        }
    }
    .admin_title{
        margin-top: 20px;
        .sc(24px, #666);
        text-align: center;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        margin-top: 10px;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
        margin: 10px auto;
    }
</style>
