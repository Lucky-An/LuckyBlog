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
      <el-button
        v-if="!listType"
        size="mini"
        type="primary"
      >选择文件
      </el-button>
      <i v-else class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" width="100%" alt="" >
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
    file: {
      immediate: true,
      handler: function(newValue, old) {
        // 是字符串类型，并且长度大于0  可能是编辑回显
        if (typeof newValue === 'string' && newValue.length > 0) {
          const arr = newValue.split('/')
          this.fileList = [{ name: arr[arr.length - 1], url: newValue }]
          this.hide = true
          // 是字符串类型，并且长度等于0  可能是v-if 隐藏了，清空文件列表
        } else if (typeof newValue === 'string' && newValue.length === 0) {
          this.clearFiles()
          // 是object，说明是文件类型，放进文件列表，当传的是图片时，放入列表会展示不出来图片。
        } else if (
          Object.prototype.toString.call(newValue) === '[object File]' &&
          this.listType !== 'picture-card'
        ) {
          this.fileList = [newValue]
          this.hide = true
        }
      }
    }
  },
  methods: {
    // 父组件调用清除文件的方法
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
        this.$message.error('文件格式不符合要求')
        return
      }
      if (raw.size > this.fileSize) {
        this.$refs[this.ref].clearFiles()
        this.$message.error('文件大小不符合要求')
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
