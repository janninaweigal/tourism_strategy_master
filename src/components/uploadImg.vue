<template>
    <div class="uploadContainer">
        <img v-if="imageUrl" width="160px" height="160px" :src="imageUrl">
        <el-upload
            class="avatar-uploader"
            action=""
            :auto-upload="false"
            :headers="uploadHead()"
            :show-file-list="false"
            :on-change="onchange">
                <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
    export default {
        props: {
            // 图片地址
            imageUrl: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
            }
        },
        methods: {
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
            onchange(file,filesList) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!this.isJpgOrPng(file.name)) {
                    this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
                    return;
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                    return;
                }
                this.$emit('uploadAvatar',file)
            },
            // 判断文件名后缀为JPG或PNG
            isJpgOrPng(fileName) {
                const index = fileName.lastIndexOf('.');
                if (index !== -1) {
                    const suffix = fileName.substring(index + 1).toLowerCase();
                    if (suffix === 'jpg' || suffix === 'png') {
                    return true;
                    } else {
                    return false
                    }
                } else {
                    return false
                }
            }
        }
    }
</script>

<style lang="less">
    .uploadContainer{
        text-align: left
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
</style>
