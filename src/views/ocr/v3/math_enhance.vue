<template>
  <div>
    <BasicLayout>
      <template #wrapper>
        <el-row :gutter="10" class="mb10">
          <el-card class="box-card" style="text-align:center">
            <p style="font-size:32px">
              公式增强识别
            </p>
            <div style="color:#787878">
              <p>
                将图片内的公式识别出来, 并且以mathml呈现
              </p>
              <p>适合试卷和论文的识别</p>
            </div>
          </el-card>
        </el-row>
        <el-row :gutter="10" class="mb10">
          <el-col :sm="20" :md="6">
            <el-row :gutter="10" class="mb10">
              <el-card class="box-card">
                <el-upload
                  ref="upload"
                  style="margin:15px;text-align:center"
                  class="upload-demo"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :before-upload="beforeUpload"
                  :on-change="handleChange"
                  :action="apiUrl"
                  :file-list="fileList"
                >
                  <el-button size="small" type="primary">上传图片</el-button>
                </el-upload>
                <div style="text-align:center;margin-bottom:8px">
                  <span>或</span>
                </div>
                <div style="text-align: center;float:left;margin-bottom:15px">
                  <el-input :value="imageSrc" placeholder="https://baidu.com/test.jpg" size="medium" style="float:left">
                    <template slot="prepend">图片链接</template>
                  </el-input>
                </div>
                <div style="text-align: center;margin-bottom:15px">
                  <el-button size="small" type="primary" round @click="submitFunc">
                    确定
                  </el-button>
                </div>

              </el-card>
            </el-row>
          </el-col>

          <el-col :sm="20" :md="9" style="text-align: center;line-height: 20px;">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>原图预览</span>
              </div>
              <div>
                <el-image :src="imageSrc" :style="imageStyle" />
              </div>
            </el-card>
          </el-col>
          <el-col :sm="24" :md="9" style="text-align: center;line-height: 20px;">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>结果下载</span>
              </div>
              <div>
                <div v-for="(value, key) in showList" :key="key" style="text-align:center;margin:30px 0">
                  <el-link type="primary" :href="value">{{ key }}下载</el-link>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>
    </BasicLayout>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'MathEnhance',
  data() {
    return {
      fileList: [],
      apiUrl: 'https://api-internal.wefile.com/ocr/combine',

      downloadLink: '',
      srcList: [
        'https://ocr-exmaple.oss-cn-beijing.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240504170819.jpg'
      ],
      imageSrc: 'https://ocr-exmaple.oss-cn-beijing.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240504170819.jpg',
      markdownText: '',
      jsonText: '',
      imageStyle: '',
      activeName: 'json',
      showList: {}
      // loadingProcess: false
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      this.imageSrc = file.url
      console.log(file)
    },
    handleChange(file, fileList) {
      fileList = []
      // 检查是否选择了文件
      if (!file) {
        console.log('file file is none')
        this.imageSrc = ''
        return
      }
      // 使用FileReader来读取文件内容
      const reader = new FileReader()
      reader.onload = (e) => {
        // 文件读取完成后，更新imageUrl以显示在el-image中
        this.imageSrc = e.target.result
      }
      reader.readAsDataURL(file.raw)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    beforeUpload(file) {
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt50M = file.size / 1024 / 1024 < 50

      if (!isJPGorPNG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt50M) {
        this.$message.error('上传头像图片大小不能超过 50MB!')
      }
      return isJPGorPNG && isLt50M
    },
    cancelRunning() {
      this.$refs.upload.abort()
      this.loadingProcess = false
      this.fileList = []
    },
    submitFunc() {
      if (this.existUnuploadedFiles()) {
        this.$refs.upload.submit()
        console.log('submit file')
      } else {
        this.submitData()
        console.log('submit form')
      }
      // this.loadingProcess = true
      console.log('submit!')
    },
    submitData() {
      const formData = new FormData()
      formData.append('url', this.imageSrc)
      axios.post(this.apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          // 处理响应
          console.log('Data submitted:', response.data)
          this.showList = response.data.exportDownloadList

          this.imageSrc = response.data.imageLink
          this.srcList = [this.imageSrc]

          this.isDisable = false

          // this.loadingProcess = false
        })
        .catch(error => {
          // 处理错误
          console.error('Submission error:', error)
        })
    },
    existUnuploadedFiles() {
      const { uploadFiles } = this.$refs.upload
      const unuploadedFiles = uploadFiles.filter(file => file.status !== 'success')
      if (unuploadedFiles.length > 0) {
        return true
      } else {
        return false
      }
    },
    // method to handle the success event
    handleSuccess(response, file, fileList) {
      console.log('Data submitted:', response)
      this.showList = response.exportDownloadList

      this.imageSrc = response.imageLink
      this.srcList = [this.imageSrc]

      this.isDisable = false
      this.$refs.upload.clearFiles()
      this.loadingProcess = false
    },
    // method to handle the error event
    handleError(err, file, fileList) {
      this.loadingProcess = false
      console.error('Error uploading file:', err)
    }
  }
}
</script>

  <style lang="scss" scoped>
    .list-group-item{
      padding: 18px 0;
    }
    .svg-icon{
      margin-right: 5px;
    }
  </style>
