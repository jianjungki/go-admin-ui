<template>
  <div>
    <BasicLayout>
      <template #wrapper>
        <!-- 主要内容区域 -->
        <el-row :gutter="20" class="mb10">
          <el-card class="block">
            <div slot="header">WeFile</div>
            <div style="text-align: center; font-size: 24px;">
              <p>智能文档处理方案提供商</p>
              <p>使用OCR、NLP等人工智能技术将大量纸质文档进行数字化</p>
            </div>
          </el-card>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card>
              <div slot="header">公司</div>
              <div style="text-align: center; font-size: 24px; height: 350px">
                <p>ABBYY全系列产品销售北京信天邮科技有限公司成立于2017年，办公地点位于北京市朝阳区。</p>
                <p>公司为ABBYY中国区域合作伙伴，团队核心成员有15年行业工作经验，公司专注于解决企业文档处理的需求。</p>
                <p>WeFile®为北京信天邮科技的注册商标。</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card>
              <div slot="header">联系</div>
              <div style="text-align: center; font-size: 24px; height: 350px">
                <p>86-010-87327500</p>
                <p>contact@wefile.com</p>
                <p>北京市朝阳区望京东园四区2号楼中航产融大厦5层101室</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card>
              <div slot="header">合作伙伴</div>
              <div style="text-align: center; font-size: 24px; height: 350px">
                <p />
                <p />
                <p />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>
    </BasicLayout>
  </div>
</template>

<script>
</script>

    <style lang="scss" scoped>
      .list-group-item{
        padding: 18px 0;
      }
      .svg-icon{
        margin-right: 5px;
      }
    </style>
