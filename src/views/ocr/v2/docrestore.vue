<template>
  <div>
    <BasicLayout>
      <template #wrapper>
        <el-row :gutter="10" class="mb10">
          <el-card class="box-card" style="text-align:center">
            <p style="font-size:32px">
              图片转word
            </p>
            <div style="color:#787878">
              <p>
                高精度OCR识别
              </p>
              <p>适合手机拍照等任何质量的图片</p>
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
                  :auto-upload="false"
                  :limit="1"
                  :action="apiUrl"
                >
                  <el-button size="small" type="primary">上传图片</el-button>
                  <!-- <div slot="tip" class="el-upload__tip" style="margin-top: 20px;">由于资源有限，只能上传图片文件(jpg, png)</div> -->
                </el-upload>
                <el-input type="hidden" :value="imageSrc" name="url" />
                <div style="text-align:center;margin-top:30px">
                  <el-button type="success" round @click="onSubmit">处理图片</el-button>
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
                <el-image :src="imageSrc" :style="imageStyle" :preview-src-list="srcList" />
              </div>
            </el-card>
          </el-col>
          <el-col :sm="24" :md="9" style="text-align: center;line-height: 20px;">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>结果下载</span>
              </div>
              <div style="margin:30px 0">
                <el-link ref="downloadBtn" type="primary" :href="downloadLink" :disabled="isDisable">下载word文件</el-link>
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
  name: 'DocRestore',
  data() {
    return {
      fileList: [],
      apiUrl: 'https://api-internal.wefile.com/internal/ocr/doc_restore',

      downloadLink: '',
      srcList: [
        'https://converter-output.oss-cn-beijing.aliyuncs.com/inputs/微信图片_20240321151258.jpg'
      ],
      imageSrc: 'https://converter-output.oss-cn-beijing.aliyuncs.com/inputs/微信图片_20240321151258.jpg',

      jsonText: '',
      destSrc: '',
      destSrcList: [],
      imageStyle: '',
      activeName: 'json',
      isDisable: true,
      sampleList: [
        'https://converter-output.oss-cn-beijing.aliyuncs.com/inputs/微信图片_20240321151258.jpg',
        'https://converter-output.oss-cn-beijing.aliyuncs.com/inputs/微信图片_20240328125312.jpg'
      ]
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    beforeUpload(file) {
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPGorPNG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPGorPNG && isLt2M
    },
    clickImage(index) {
      console.log('click', index)
      this.imageSrc = this.sampleList[index]
      this.srcList = [this.sampleList[index]]
      this.destSrc = ''
      this.destSrcList = [this.destSrc]
    },
    onSubmit() {
      if (this.existUnuploadedFiles()) {
        this.$refs.upload.submit()
        console.log('submit file')
      } else {
        this.submitData()
        console.log('submit form')
      }

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
          var jsonObj = response.data
          this.jsonText = JSON.stringify(jsonObj.result, null, 2)
          this.downloadLink = jsonObj.downloadLink

          this.imageSrc = jsonObj.sourceLink
          this.srcList = [this.imageSrc]

          this.isDisable = false
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
      console.log('File uploaded successfully:', response)
      this.jsonText = JSON.stringify(response.result, null, 2)
      this.downloadLink = response.downloadLink

      this.imageSrc = response.sourceLink
      this.srcList = [this.imageSrc]

      this.isDisable = false
      this.$refs.upload.clearFiles()
    },
    // method to handle the error event
    handleError(err, file, fileList) {
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
