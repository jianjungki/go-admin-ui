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
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :before-upload="beforeUpload"
                  :auto-upload="false"
                  :limit="1"
                  action="https://api-internal.wefile.com/internal/ocr/common"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip" style="margin-top: 20px;">由于资源有限，只能上传图片文件(jpg, png)</div>
                </el-upload>
                <div style="text-align:center;margin-top:30px">
                  <el-button type="success" round @click="onSubmit">分析页面</el-button>
                </div>
              </el-card>
            </el-row>
            <el-row :gutter="10" class="mb10">
              <el-card>
                <div class="block">
                  <el-image ref="imageList" :src="imageSrc" variant="image" :style="imageStyle" :preview-src-list="srcList" />
                </div>

              </el-card>
            </el-row>
          </el-col>

          <el-col :sm="24" :md="18">
            <el-card class="box-card">
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

          </el-col>
        </el-row>
      </template>
    </BasicLayout>
  </div>
</template>

<script>
export default {
  name: 'OCRv2',
  data() {
    return {
      fileList: [],
      srcList: [],
      imageSrc: '',
      markdownText: '',
      jsonText: '',
      imageStyle: '',
      activeName: 'json'
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
    onSubmit() {
      this.$refs.upload.submit()
      console.log('submit!')
    },
    // method to handle the success event
    handleSuccess(response, file, fileList) {
      console.log('File uploaded successfully:', response)
      this.jsonText = JSON.stringify(response.result, null, 2)
      this.imageStyle = 'width: 100%'
      this.imageSrc = response.imageLink
      this.srcList = new Array(response.imageLink)
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
