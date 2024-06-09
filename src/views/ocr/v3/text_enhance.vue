<template>
  <el-col>
    <el-row :gutter="10" class="mb10">
      <el-card class="box-card" style="text-align:center">
        <p style="font-size:32px">
          PDF转Word
        </p>
        <div style="color:#787878">
          将图片、PDF转换为可编辑的Word文档
        </div>
      </el-card>
    </el-row>
    <el-row>
      <div class="upload-container">
        <el-upload
          ref="upload"
          class="upload-demo"
          drag
          action="https://api-internal.wefile.com/ocr/text_combine"
          :before-upload="beforeUpload"
          :on-progress="handleProgress"
          :on-error="handleError"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :show-file-list="false"
        >
          <div v-if="!isUploaded && uploadPercentage == 0" class="upload-placeholder">
            <i class="el-icon-upload" />
            <div class="el-upload__text"><em>点击上传文件</em><br>或将图片、PDF拖到此处</div>
            <div class="el-upload__tip">最大文件为30M</div>
          </div>
          <div v-if="!isUploaded && uploadPercentage > 0" class="progress-container">
            <div class="el-upload__text">文件处理中...</div>
            <el-progress :text-inside="true" :stroke-width="26" :percentage="uploadPercentage" />
          </div>
          <div v-if="isUploaded" class="upload-success">
            <i class="el-icon-check" />
            <div class="el-upload__text">文件转换成功！</div>
            <el-button type="primary" style="font-size:20px" @click="downloadFile">下载转换后的文件</el-button>
          </div>
        </el-upload>

      </div>
    </el-row>
  </el-col>
</template>

<script>
export default {
  data() {
    return {
      uploadPercentage: 0,
      isUploaded: false,
      fileUrl: '' // 存储上传后的文件 URL
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt30M = file.size / 1024 / 1024 < 30
      if (!isLt30M) {
        this.$message.error('上传文件大小不能超过 30MB!')
      }
      return isLt30M
    },
    handleProgress(event, file, fileList) {
      this.uploadPercentage = Math.round((event.loaded / event.total) * 100)
    },
    handleSuccess(response, file, fileList) {
      this.isUploaded = true
      this.fileUrl = response.exportDownloadList['DOCX']
    },
    handleError(file, fileList) {
      this.uploadPercentage = 0
      this.isUploaded = false
      this.$message.error(`文件 ${file.name} 上传失败。`)
    },
    handleRemove(file, fileList) {
      this.uploadPercentage = 0
      this.isUploaded = false
    },
    downloadFile() {
      window.open(this.fileUrl, '_blank')
    }
  }
}
</script>

  <style scoped>
  .el-upload__text{
    margin-bottom: 15px;
    margin-top: 10px;
    font-size: 20px;
  }
  .el-upload__tip{
    font-size: 14px;
    color:#787878;
  }
  .upload-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .upload-demo {
    width: 80%;
    height: 500px;
    border: 2px dashed #d9d9d9;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    text-align: center;
    transition: border 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .upload-placeholder, .upload-success{
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .progress-container{
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  </style>
  <style scoped>

  /deep/ .el-progress-bar{
    height: 100px;
    width: 500px;
  }

  /deep/ .el-upload .el-upload-dragger{
    height: 500px;
  }
  /deep/ .el-upload{
    height: 500px;
  }
  </style>
