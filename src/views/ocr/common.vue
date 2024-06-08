<template>
  <div>
    <BasicLayout>
      <template #wrapper>
        <el-row :gutter="10" class="mb10">
          <el-card class="box-card" style="text-align:center">
            <p style="font-size:32px">
              通用转换-版面还原
            </p>
            <div style="color:#787878">
              <p>
                将图片版面还原为Office等格式
              </p>
              <p>适合较清晰图片的识别</p>
            </div>
          </el-card>
        </el-row>
        <el-row :gutter="10" class="mb10">
          <el-col :sm="24" :md="6">
            <el-row :gutter="10" class="mb10">
              <el-card class="box-card" style="text-align:center">

                <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
                  <el-upload
                    action="return false"
                    style="margin:15px"
                    class="upload-demo"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :on-change="handleFileChange"
                    :before-upload="beforeUpload"
                    :auto-upload="false"
                  >
                    <!-- <div slot="tip" class="el-upload__tip" style="margin-top: 20px;">由于资源有限，只能上传图片文件(jpg, png)</div> -->
                    <el-button size="small" type="primary">上传图片</el-button>
                  </el-upload>
                  <el-form-item style="margin: 30px 0" label="识别语言">
                    <el-select v-model="sizeForm.languageSelected" filterable placeholder="请选择语言">
                      <el-option
                        v-for="item in languageOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item style="text-align:left; margin: 30px 0" label="输出类型">
                    <el-checkbox-group v-model="sizeForm.formatSelected" style="margin:0 20px">
                      <el-checkbox v-for="item in formatOptions" :key="item.value" style="width:80px" :label="item.label"> {{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <div style="text-align:center;margin-top:30px">
                    <el-button type="success" round @click="submitForm()">处理图片</el-button>
                  </div>
                </el-form>
              </el-card>
            </el-row>
          </el-col>

          <el-col :sm="24" :md="18">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>输出结果</span>
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

  name: 'MixOcr',
  data() {
    return {
      fileList: [],
      srcList: [],
      languageOptions: [
        { label: '阿拉伯语（沙特阿拉伯）', value: 'Arabic' },
        { label: '简体中文', value: 'ChinesePRC' },
        { label: '繁体中文', value: 'ChineseTaiwan' },
        { label: '荷兰语', value: 'Dutch' },
        { label: '荷兰语（比利时）', value: 'DutchBelgian' },
        { label: '英语', value: 'English' },
        { label: '法语', value: 'French' },
        { label: '德语', value: 'German' },
        { label: '德语（新的拼写规则）', value: 'GermanNewSpelling' },
        { label: '希伯来语', value: 'Hebrew' },
        { label: '意大利语', value: 'Italian' },
        { label: '日语', value: 'Japanese' },
        { label: '朝鲜语', value: 'Korean' },
        { label: '波兰语', value: 'Polish' },
        { label: '葡萄牙语（巴西）', value: 'PortugueseBrazilian' },
        { label: '葡萄牙语', value: 'PortugueseStandard' },
        { label: '俄语', value: 'Russian' },
        { label: '西班牙语', value: 'Spanish' },
        { label: '土耳其语', value: 'Turkish' },
        { label: '乌克兰语', value: 'Ukrainian' },
        { label: '阿布哈兹语', value: 'Abkhaz' },
        { label: '阿迪格语', value: 'Adyghe' },
        { label: '南非荷兰语', value: 'Afrikaans' },
        { label: '阿古尔语', value: 'Agul' },
        { label: '阿尔巴尼亚语', value: 'Albanian' },
        { label: '阿尔泰语', value: 'Altaic' },
        { label: '亚美尼亚语（东部）', value: 'ArmenianEastern' },
        { label: '亚美尼亚语（格拉巴）', value: 'ArmenianGrabar' },
        { label: '亚美尼亚语（西部）', value: 'ArmenianWestern' },
        { label: '阿瓦尔语', value: 'Awar' },
        { label: '艾玛拉语', value: 'Aymara' },
        { label: '阿塞拜疆语（西里尔）', value: 'AzeriCyrillic' },
        { label: '阿塞拜疆语（拉丁）', value: 'AzeriLatin' },
        { label: '孟加拉语', value: 'Bangla' },
        { label: '巴什基尔语', value: 'Bashkir' },
        { label: '巴斯克语', value: 'Basque' },
        { label: '白俄罗斯语', value: 'Belarusian' },
        { label: '本巴语', value: 'Bemba' },
        { label: '布莱克福特语', value: 'Blackfoot' },
        { label: '布列塔尼语', value: 'Breton' },
        { label: '布哥图语', value: 'Bugotu' },
        { label: '保加利亚语', value: 'Bulgarian' },
        { label: '缅甸语', value: 'Burmese' },
        { label: '布里亚特语', value: 'Buryat' },
        { label: '加泰隆语', value: 'Catalan' },
        { label: '查莫罗语', value: 'Chamorro' },
        { label: '车臣语', value: 'Chechen' },
        { label: '楚克其语', value: 'Chukcha' },
        { label: '楚瓦什语', value: 'Chuvash' },
        { label: '科西嘉语', value: 'Corsican' },
        { label: '克里米亚鞑靼语', value: 'CrimeanTatar' },
        { label: '克罗地亚语', value: 'Croatian' },
        { label: '克罗语', value: 'Crow' },
        { label: '捷克语', value: 'Czech' },
        { label: '丹麦语', value: 'Danish' },
        { label: '达尔格瓦语', value: 'Dargwa' },
        { label: '东干语', value: 'Dungan' },
        { label: '爱斯基摩语（西里尔）', value: 'EskimoCyrillic' },
        { label: '爱斯基摩语（拉丁）', value: 'EskimoLatin' },
        { label: '爱沙尼亚语', value: 'Estonian' },
        { label: '鄂温语', value: 'Even' },
        { label: '鄂温克语', value: 'Evenki' },
        { label: '法罗语', value: 'Faeroese' },
        { label: '法尔西语', value: 'Farsi' },
        { label: '斐济语', value: 'Fijian' },
        { label: '芬兰语', value: 'Finnish' },
        { label: '弗里西亚语', value: 'Frisian' },
        { label: '弗留利语', value: 'Friulian' },
        { label: '苏格兰盖尔语', value: 'GaelicScottish' },
        { label: '加告兹语', value: 'Gagauz' },
        { label: '加利西亚语', value: 'Galician' },
        { label: '干达语', value: 'Ganda' },
        { label: '格鲁吉亚语', value: 'Georgian' },
        { label: '德语（卢森堡）', value: 'GermanLuxembourg' },
        { label: '希腊语', value: 'Greek' },
        { label: '瓜拉尼语', value: 'Guarani' },
        { label: '哈尼语', value: 'Hani' },
        { label: '豪萨语', value: 'Hausa' },
        { label: '夏威夷语', value: 'Hawaiian' },
        { label: '匈牙利语', value: 'Hungarian' },
        { label: '冰岛语', value: 'Icelandic' },
        { label: '印度尼西亚语', value: 'Indonesian' },
        { label: '印古什语', value: 'Ingush' },
        { label: '爱尔兰语', value: 'Irish' },
        { label: '卡巴尔达语', value: 'Kabardian' },
        { label: '卡尔梅克语', value: 'Kalmyk' },
        { label: '恰伊-巴尔卡尔语', value: 'KarachayBalkar' },
        { label: '卡拉卡尔帕克人', value: 'Karakalpak' },
        { label: '卡舒比语', value: 'Kasub' },
        { label: '卡瓦语', value: 'Kawa' },
        { label: '哈萨克语', value: 'Kazakh' },
        { label: '哈卡斯语', value: 'Khakas' },
        { label: '汉特语', value: 'Khanty' },
        { label: '吉库犹语', value: 'Kikuyu' },
        { label: '吉尔吉斯语', value: 'Kirgiz' },
        { label: '刚果语', value: 'Kongo' },
        { label: '韩国语（韩文字母）', value: 'KoreanHangul' },
        { label: '科尔雅克语', value: 'Koryak' },
        { label: '克佩勒语', value: 'Kpelle' },
        { label: '库梅克语', value: 'Kumyk' },
        { label: '库尔德语', value: 'Kurdish' },
        { label: '拉克语', value: 'Lak' },
        { label: '萨米语（拉皮什）', value: 'Lappish' },
        { label: '拉丁语', value: 'Latin' },
        { label: '拉脱维亚语', value: 'Latvian' },
        { label: '拉脱维亚哥特式', value: 'LatvianGothic' },
        { label: '莱兹吉语', value: 'Lezgin' },
        { label: '立陶宛语', value: 'Lithuanian' },
        { label: '卢巴语', value: 'Luba' },
        { label: '马其顿语', value: 'Macedonian' },
        { label: '马达加斯加语', value: 'Malagasy' },
        { label: '马来语（马来西亚）', value: 'Malay' },
        { label: '马林凯语', value: 'Malinke' },
        { label: '马耳他语', value: 'Maltese' },
        { label: '曼西语', value: 'Mansi' },
        { label: '毛利语', value: 'Maori' },
        { label: '马里语', value: 'Mari' },
        { label: '玛雅语', value: 'Maya' },
        { label: '苗语', value: 'Miao' },
        { label: '米南卡堡语', value: 'Minankabaw' },
        { label: '莫霍克语', value: 'Mohawk' },
        { label: '蒙古语', value: 'Mongol' },
        { label: '摩尔多瓦语', value: 'Mordvin' },
        { label: '那瓦特语', value: 'Nahuatl' },
        { label: '勒勒茨语', value: 'Nenets' },
        { label: '尼夫赫语', value: 'Nivkh' },
        { label: '诺盖语', value: 'Nogay' },
        { label: '挪威语（博克马尔）', value: 'NorwegianBokmal' },
        { label: '挪威语（尼诺斯克）', value: 'NorwegianNynorsk' },
        { label: '尼昂加语', value: 'Nyanja' },
        { label: '奥杰布瓦语', value: 'Ojibway' },
        { label: '旧式斯拉夫语', value: 'OldSlavonic' },
        { label: '奥塞梯语', value: 'Ossetic' },
        { label: '帕皮阿门托语', value: 'Papiamento' },
        { label: '托克皮辛语', value: 'PidginEnglish' },
        { label: '拼音', value: 'Pinyin' },
        { label: '奥克语', value: 'Provencal' },
        { label: '凯楚阿语（玻利维亚）', value: 'Quechua' },
        { label: '利托-罗曼诸语', value: 'RhaetoRomanic' },
        { label: '罗马尼亚语', value: 'Romanian' },
        { label: '罗马尼亚语 （摩尔瓦多）', value: 'RomanianMoldavia' },
        { label: '吉普赛语', value: 'Romany' },
        { label: '卢旺达语', value: 'Ruanda' },
        { label: '隆迪语', value: 'Rundi' },
        { label: '俄语（旧式拼写）', value: 'RussianOldSpelling' },
        { label: '俄语带重音标记', value: 'RussianWithAccent' },
        { label: '萨摩亚语', value: 'Samoan' },
        { label: '塞尔库普语', value: 'Selkup' },
        { label: '塞尔维亚语（西里尔）', value: 'SerbianCyrillic' },
        { label: '塞尔维亚语（拉丁）', value: 'SerbianLatin' },
        { label: '修纳语', value: 'Shona' },
        { label: '达科他语', value: 'Sioux' },
        { label: '斯洛伐克语', value: 'Slovak' },
        { label: '斯洛文尼亚语', value: 'Slovenian' },
        { label: '索马里语', value: 'Somali' },
        { label: '索布语', value: 'Sorbian' },
        { label: '科萨语', value: 'Sotho' },
        { label: '巽他語', value: 'Sunda' },
        { label: '斯瓦希利语', value: 'Swahili' },
        { label: '斯瓦齐语', value: 'Swazi' },
        { label: '瑞典语', value: 'Swedish' },
        { label: '塔巴萨兰语', value: 'Tabassaran' },
        { label: '塔加洛语', value: 'Tagalog' },
        { label: '塔希提语', value: 'Tahitian' },
        { label: '塔吉克语', value: 'Tajik' },
        { label: '鞑靼语', value: 'Tatar' },
        { label: '泰国语', value: 'Thai' },
        { label: '景颇语', value: 'Tinpo' },
        { label: '汤加语', value: 'Tongan' },
        { label: '茨瓦纳语', value: 'Tswana' },
        { label: '侗族语', value: 'Tun' },
        { label: '土库曼语（西里尔）', value: 'Turkmen' },
        { label: '土库曼语（拉丁）', value: 'TurkmenLatin' },
        { label: '图瓦语', value: 'Tuvin' },
        { label: '乌德穆尔特语', value: 'Udmurt' },
        { label: '维吾尔语（西里尔）', value: 'UighurCyrillic' },
        { label: '维吾尔语（拉丁）', value: 'UighurLatin' },
        { label: '乌兹别克语（西里尔）', value: 'UzbekCyrillic' },
        { label: '乌兹别克语（拉丁）', value: 'UzbekLatin' },
        { label: '越南语', value: 'Vietnamese' },
        { label: '宿务语', value: 'Visayan' },
        { label: '威尔士语', value: 'Welsh' },
        { label: '沃洛夫语', value: 'Wolof' },
        { label: '科萨语', value: 'Xhosa' },
        { label: '雅库特语', value: 'Yakut' },
        { label: '依地语', value: 'Yiddish' },
        { label: '萨巴特克语', value: 'Zapotec' },
        { label: '祖鲁语', value: 'Zulu' },
        { label: '挪威语', value: 'Norwegian' },
        { label: '世界语', value: 'Esperanto' },
        { label: '伊多语', value: 'Ido' },
        { label: '国际语', value: 'Interlingua' },
        { label: '西方语', value: 'Occidental' },
        { label: 'Basic', value: 'Basic' },
        { label: 'C/C++', value: 'C++' },
        { label: 'MICR (CMC-7)', value: 'CMC7' },
        { label: '简单的化学式', value: 'Chemistry' },
        { label: 'COBOL', value: 'Cobol' },
        { label: '数字', value: 'Digits' },
        { label: 'MICR (E-13B)', value: 'E13B' },
        { label: 'Fortran', value: 'Fortran' },
        { label: 'Java', value: 'Java' },
        { label: 'MRZ', value: 'MRZ' },
        { label: '简单数学公式', value: 'Mathematical' },
        { label: 'OcrA', value: 'OcrA' },
        { label: 'OcrB', value: 'OcrB' },
        { label: 'Pascal', value: 'Pascal' },
        { label: '英语音标', value: 'TranscriptionEnglish' }],
      formatOptions: [
        { label: 'DOCX', value: 'OFF_DOCX' },
        { label: 'XLS', value: 'OFF_XLS' },
        { label: 'RTF', value: 'OFF_RTF' },
        { label: 'XML', value: 'OFF_XML' },
        { label: 'PDF', value: 'OFF_PDF' },
        { label: 'TXT', value: 'OFF_Text' },
        { label: 'HTML', value: 'OFF_HTML' },
        { label: 'XPS', value: 'OFF_XPS' },
        { label: 'XLSX', value: 'OFF_XLSX' },
        { label: 'ALTO', value: 'OFF_ALTO' },
        { label: 'EPUB', value: 'OFF_EPUB' },
        { label: 'PPTX', value: 'OFF_PPTX' }
      ],
      imageSrc: '',
      markdownText: '',
      jsonText: '',
      imageStyle: '',
      activeName: 'json',
      sizeForm: {
        languageSelected: '',
        formatSelected: [],
        file: null
      },
      showList: {}
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleFileChange(file) {
      this.sizeForm.file = file.raw
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    submitForm() {
      // Prepare the form data
      const data = new FormData()
      data.append('languages', this.sizeForm.languageSelected)
      data.append('exportList', this.sizeForm.formatSelected)
      if (this.sizeForm.file) {
        data.append('file', this.sizeForm.file)
      }

      // Send the request
      axios.post('https://api-internal.wefile.com/ocr/common', data)
        .then(response => {
          // Handle response
          console.log('File and form data have been uploaded successfully.', response.data)
          this.showList = response.data.exportDownloadList
        })
        .catch(error => {
          // Handle error
          console.error('There was an error uploading the file and form data:', error)
        })
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
      console.log('submit!')
    },
    // method to handle the success event
    handleSuccess(response, file, fileList) {
      console.log('File uploaded successfully:', response)
      this.markdownText = response.markdownText
      this.jsonText = JSON.stringify(response.positionList, null, 2)
      this.imageStyle = 'width: 100%'
      this.imageSrc = response.imageLink
      this.srcList = new Array(response.imageLink)
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
