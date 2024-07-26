<template>
  <div>
    <BasicLayout>
      <template #wrapper>
        <el-row :gutter="10" class="mb10">
          <el-col :sm="24" :md="6">
            <el-row :gutter="10" class="mb10">
              <el-card class="box-card">
                <el-upload
                  ref="upload"
                  style="margin:15px;text-align:center"
                  class="upload-demo"
                  :http-request="uploadFileWithToken"
                  :before-upload="beforeUpload"
                  :auto-upload="false"
                  :limit="1"
                  :action="apiUrl"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip" style="margin-top: 20px;">由于资源有限，只能上传图片文件(jpg, png)</div>
                </el-upload>
                <el-input type="hidden" :value="imageSrc" name="url" />
                <div style="text-align:center;margin-top:30px">
                  <el-button type="success" round @click="onSubmit">分析页面</el-button>
                </div>
              </el-card>
            </el-row>
            <el-row :gutter="10" class="mb10">
              <el-card>
                <el-tabs v-model="activeName" type="card">
                  <el-tab-pane label="JSON" name="json">
                    <el-card class="box-card">
                      <el-input
                        ref="json_resp"
                        type="textarea"
                        :value="jsonText"
                        disabled
                        readonly
                        rows="25"
                        style="width: 100%; height: 100%"
                      />
                    </el-card>
                  </el-tab-pane>
                </el-tabs>

              </el-card>
            </el-row>
          </el-col>

          <el-col :sm="20" :md="9" style="text-align: center;line-height: 20px;">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>上传原图</span>
              </div>
              <div>
                <el-image :src="imageSrc" :style="imageStyle" :preview-src-list="srcList" />
              </div>
            </el-card>
          </el-col>
          <el-col :sm="24" :md="9" style="text-align: center;line-height: 20px;">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>结果预览</span>
              </div>
              <div class="demo-image__error">
                <el-image :src="destSrc" :style="imageStyle" :preview-src-list="destSrcList">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </div>
            </el-card>
          </el-col>
          <el-col :sm="24" :md="18" style="text-align: center;line-height: 60px; margin-top:10px">
            <el-card class="box-card">
              <div v-for="(sample, index) in sampleList" :key="sample" class="block" style="padding:0px 50px;text-align:center">
                <el-image
                  style="height: 100px; float: left; padding:0px 10px;margin: 10px 0px 30px 0px;"
                  :src="sample"
                  fit="contain"
                  @click="clickImage(index)"
                />
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
import { getToken } from '@/utils/auth'
export default {
  name: 'CropEnhance',
  data() {
    return {
      fileList: [],
      apiUrl: 'https://api-internal.wefile.com/v1/internal/a/crop_enhance',

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
    async uploadFileWithToken(uploadRequest) {
      console.log('upload file with token')
      const formData = new FormData()
      formData.append('file', uploadRequest.file)

      try {
        // 创建 XMLHttpReadyState 对象
        const xhr = new XMLHttpRequest()

        xhr.open('POST', uploadRequest.action, true)
        xhr.setRequestHeader('Authorization', 'Bearer ' + getToken())

        // 监听 'progress' 事件，获取上传进度
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            // 触发自定义的 "on-progress" 事件，并把进度传递给父组件
            this.handleProgress(event)
          }
        }

        // 监听 'load' 事件，当请求成功完成时调用
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText)
            console.log(response)
            this.handleSuccess(response)
          } else {
            this.handleError(xhr.statusText)
          }
        }

        // 监听 'error' 事件，当请求失败时调用
        xhr.onerror = () => {
          this.handleError(xhr.statusText)
        }

        // 发送表单数据
        xhr.send(formData)
      } catch (err) {
        this.handleError(err)
      }
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
          this.destSrc = jsonObj.imageLink
          this.destSrcList = [this.destSrc]

          this.imageSrc = jsonObj.sourceLink
          this.srcList = [this.imageSrc]
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
      this.destSrc = response.imageLink
      this.destSrcList = [this.destSrc]

      this.imageSrc = response.sourceLink
      this.srcList = new Array(this.imageSrc)
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
