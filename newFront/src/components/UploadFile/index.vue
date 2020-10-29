<template>
  <div>
    <el-upload
      :ref="ref"
      :class="{ my_hide: hide }"
      :list-type="listType"
      :file-list="fileList"
      :auto-upload="false"
      :on-preview="handlePictureCardPreview"
      :on-change="handleEditChange"
      :on-remove="handleRemove"
      action="#"
    >
      <el-button v-if="!listType" size="mini" type="primary">{{
        $t("writeup.selectFile")
      }}</el-button>
      <i v-else class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadFile',
  props: {
    file: {
      default: ''
    },
    listType: {
      type: String,
      default: ''
    },
    fileType: {
      type: Array,
      default: () => {
        return []
      }
    },
    fileSize: {
      type: Number,
      default: 10 * 1024 * 1024 // 默认10M
    }
  },
  data() {
    return {
      ref:
        'markdown-editor-' +
        +new Date() +
        ((Math.random() * 1000).toFixed(0) + ''),
      dialogImageUrl: '',
      dialogVisible: false,
      hide: false,
      fileList: []
    }
  },
  watch: {
    file(newValue) {
      console.log('newValue: ', newValue)
      if (typeof newValue === 'string' && newValue.length > 0) {
        this.fileList.push({ name: newValue, url: newValue })
        this.hide = true
      } else if (!newValue) {
        this.$refs[this.ref].clearFiles()
        this.hide = false
      }
    }
  },
  methods: {
    // 父组件调用清楚文件的方法
    clearFiles() {
      this.fileList = []
      this.hide = false
    },
    // 监听删除事件
    handleRemove(file, fileList) {
      this.hide = fileList.length
      this.$emit('update:file', '')
    },
    // 上传图片预览
    handlePictureCardPreview(file) {
      if (this.listType === 'picture-card') {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      }
    },
    // 选择文件触发的方法
    handleEditChange(file, fileList) {
      const { raw } = file
      let isNorm = this.fileType.some((item) => {
        return raw.name.toLowerCase().endsWith(item)
      })
      if (this.fileType.length === 0) isNorm = true
      if (!isNorm) {
        this.$refs[this.ref].clearFiles()
        this.$notify.error({
          customClass: 'error_notify',
          title: this.$t('public.error'),
          message: this.$t('writeup.file_format_err')
        })
        return
      }
      if (raw.size > this.fileSize) {
        this.$refs[this.ref].clearFiles()
        this.$message.error({
          customClass: 'error_notify',
          title: this.$t('public.error'),
          message: this.$t('writeup.file_size_err')
        })
        return
      }

      this.$emit('update:file', file.raw)
      this.hide = fileList.length
    }
  }
}
</script>
<style>
.my_hide .el-upload {
  display: none;
}
</style>
