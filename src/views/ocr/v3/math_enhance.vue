<template>
  <el-col>
    <el-row style="text-align: center;">
      <section>
        <h2>
          公式增强识别
        </h2>
        <div style="color:#787878">
          <p>
            将图片内的公式识别出来, 并且以mathml呈现
          </p>
          <p>适合试卷和论文的识别</p>
        </div>
        <br>
      </section>
      <div class="upload-container">
        <el-upload
          ref="upload"
          class="upload-demo"
          drag
          :disabled="disable"
          action="https://api-internal.wefile.com/ocr/combine?format=docx"
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
            <el-progress :text-inside="true" :stroke-width="2" :percentage="uploadPercentage" />
          </div>
          <div v-if="isUploaded" class="upload-success">
            <i class="el-icon-download" style="font-size:30px; margin: 10px" />
            <div class="el-uploadtext">文件转换成功！</div>
            <br>
            <div>
              <el-button type="primary" style="font-size:20px; margin-right:20px" @click="downloadFile">下载转换后的文件</el-button>
              <el-button type="warning" style="font-size:20px;margin: 10px" @click="reUpload">继续转换</el-button>
            </div>
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
      disable: false,
      fileUrl: '', // 存储上传后的文件 URL
      fileName: ''
    }
  },
  methods: {
    reUpload() {
      this.uploadPercentage = 0
      this.isUploaded = false
      this.disable = false
      this.fileUrl = ''
      this.fileName = ''
    },
    beforeUpload(file) {
      this.fileName = file.name
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
      this.disable = true
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
    saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename)
      } else {
        const link = document.createElement('a')
        const body = document.querySelector('body')
        link.href = window.URL.createObjectURL(blob)
        link.download = filename // 修改文件名
        link.style.display = 'none'
        body.appendChild(link)
        link.click()
        body.removeChild(link)
        window.URL.revokeObjectURL(link.href)
      }
    },
    getBlob(url) { // url:是文件在oss上的地址
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'// 请求类型是blob类型
        xhr.crossOrigin = '*' // 解决跨域问题
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response)
          }
        }
        xhr.send()
      })
    },
    removeFileExtension(fileName) {
      const lastDotIndex = fileName.lastIndexOf('.')
      if (lastDotIndex === -1) return fileName // 如果没有点号，则返回原文件名
      return fileName.substring(0, lastDotIndex)
    },
    downloadFile() {
      this.getBlob(this.fileUrl).then(res => { // url:文件在oss上的地址
        var fileBaseName = this.removeFileExtension(this.fileName)
        this.saveAs(res, fileBaseName + '.md') // filename:文件名，可自定义
      })
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
