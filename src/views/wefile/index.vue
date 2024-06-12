<template>
  <div>
    <BasicLayout>
      <template #wrapper>
        <!-- 主要内容区域 -->
        <el-row :gutter="20" class="mb10">
          <el-card class="block">

            <div style="text-align: center; font-size: 18px;">
              <p>北京信天邮科技有限公司</p>
              <p>智能文档处理方案提供商</p>
            </div>
          </el-card>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card>
              <div slot="header">公司</div>
              <div style="text-align: center; font-size: 16px; height: 350px">
                <p>北京信天邮科技有限公司成立于2017年，办公地点位于北京市朝阳区。</p>
                <p>公司为ABBYY中国区域合作伙伴，团队核心成员有15年企业软件服务领域经验，公司专注于解决企业文档处理的需求。</p>
                <p>WeFile®为北京信天邮科技的注册商标。</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card>
              <div slot="header">联系</div>
              <div style="text-align: center; font-size: 16px; height: 350px">
                <p>北京市朝阳区望京东园四区<br>2号楼中航产融大厦5层</p>
                <p>电话：0086-010-87327500</p>
                <p>邮件：contact@wefile.com</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card>
              <div slot="header">客户</div>
              <div style="text-align: center; font-size: 16px; height: 350px">
                <p>广西壮族自治区档案馆</p>
                <p>中国国际金融有限公司</p>
                <p>北京澜舟科技有限公司</p>
                <p>青岛远洋大亚物流公司</p>
                <p>创新工场---零一万物</p>
                <p>复旦大学</p>
                <p>中译语通</p>
                <p>......</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>
    </BasicLayout>
  </div>
</template>

    <style lang="scss" scoped>
      .list-group-item{
        padding: 18px 0;
      }
      .svg-icon{
        margin-right: 5px;
      }
    </style>
