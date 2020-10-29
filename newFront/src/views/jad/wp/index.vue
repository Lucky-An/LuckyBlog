<template>
  <div class="wp_box">
    <countDown class="countDown" />
    <div class="up_box clearfix">
      <span class="fl">{{ $t('writeup.selectFile') }}</span>
      <div class="upload fl">
        <UploadFile
          ref="UploadFile"
          :file.sync="data.file"
          :file-type="['pdf','docx','PDF','DOCX']"
          :file-size="20*1024*1024"
          class="UploadFile"
        />
        <el-button
          size="mini"
          type="primary"
          @click="uploadWp"
        >{{ $t('writeup.upload') }}</el-button>
      </div>
      <!--上传要求-->
      <span class="fr format">{{ $t('writeup.wp_format') }}</span>
    </div>

    <wpInfo
      :list="list"
      @removeWp="removeWp"
    />
  </div>
</template>

<script>
import wpInfo from '@/components/wpInfo'
import UploadFile from '@/components/UploadFile'
import { getWP, removeWp, uploadWp } from '@/api/jad'
import countDown from '@/components/countDown'

export default {
  name: 'NoticeList',
  components: { wpInfo, UploadFile, countDown },
  data() {
    return {
      list: [], // 公告列表
      data: {
        event_id: this.$route.query.id,
        file: ''
      }
    }
  },
  created() {
    this.getWP()
  },
  methods: {
    // 获取wp
    getWP() {
      getWP({
        event_id: this.$route.query.id,
        evt: this.$route.query.hash
      }).then(res => {
        this.list = res.data.data
      })
    },
    // 删除wp
    removeWp() {
      removeWp({ event_id: this.data.event_id }, this.$route.query.hash).then(
        res => {
          this.getWP()
          this.$notify.success({
            customClass: 'success_notify',
            title: this.$t('public.handle_success'),
            message: this.$t('public.handle_success')
          })
        }
      )
    },
    // 上传wp
    uploadWp() {
      if (this.data.file === '') {
        this.$message.error('请选择文件')
        return
      }
      const fm = new FormData()
      for (const k in this.data) {
        fm.append(k, this.data[k])
      }
      uploadWp(fm, this.$route.query.hash).then(res => {
        if (res.data.success) {
          this.getWP()
          // this.data.file = ''
          this.$refs.UploadFile.clearFiles()
          this.$notify.success({
            customClass: 'success_notify',
            title: this.$t('public.handle_success'),
            message: this.$t('public.handle_success')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.countDown {
  float: right;
  margin-bottom: 20px;
}
.wp_box {
  margin-top: 15px;
  padding: 0 200px;

  .up_box {
    clear: both;

    color: #abaeba;
    font-size: 14px;
    line-height: 32px;
    margin-bottom: 20px;
    .upload {
      width: 30%;
      height: 30px;
      margin-left: 15px;
      display: flex;
      align-content: center;
      .UploadFile {
        margin-right: 15px;
      }
      .el-button--mini {
        height: 28px;
        margin-top: 2px;
      }
    }
    .format {
      display: inline-block;
      width: 490px;
      line-height: 17px;
    }
  }
}
</style>
