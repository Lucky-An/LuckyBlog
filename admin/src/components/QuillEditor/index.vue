<template>
  <div class="quillcon">
    <el-upload
      :class="{hide:hide}"
      :on-success="handleSuccess"
      :show-file-list="false"
      name="logo"
      accept="['jpg', 'jpeg', 'png']"
      action="/api/v1/common/admin/upload"
    >
      <el-button v-if="!listType" :id="ref" size="small" class="ivu-btn" type="primary">点击上传</el-button>
    </el-upload>
    <!-- <el-input v-show="false" :value="value" @change="onEditorChange" /> -->
    <quill-editor
      :ref="ref"
      :id="id"
      :value="value"
      :options="editorOption"
      @blur="onEditorBlur($event,ref)"
      @focus="onEditorFocus($event,ref)"
      @ready="onEditorReady($event,ref)"
      @change="onEditorChange($event,ref)"
    />
  </div>
</template>

<script>
// require styles

import { quillEditor } from 'vue-quill-editor'
import defaultOptions from './defaultOptions'

export default {
  name: 'QuillEditor',
  components: { quillEditor },
  model: {
    prop: 'value',
    event: 'input'
  },
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
    },
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: false,
      default() {
        return (
          'markdown-editor-' +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + '')
        )
      }
    },
    holder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ref: 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''),
      dialogImageUrl: '',
      dialogVisible: false,
      hide: false,
      editorOption: {
        placeholder: this.holder,
        modules: {
          toolbar: {
            container: defaultOptions, // 工具栏
            handlers: {
              image: (value) => {
                if (value) {
                  document.querySelector(`#${this.ref}`).click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      }
    }
  },
  mounted() {},
  methods: {
    handleSuccess(res) {
      // 获取富文本组件实例
      var quill = this.$refs[this.ref].quill
      // 如果上传成功
      if (res.success) {
        // 获取光标所在位置
        const length = quill.getSelection().index
        // 插入图片，res为服务器返回的图片链接地址
        quill.insertEmbed(length, 'image', res.path)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        // 提示信息，需引入Message
        // Message.error('图片插入失败')
      }
    },
    onEditorBlur(quill, ref) {},
    onEditorFocus(quill, ref) {},
    onEditorReady(quill, ref) {},
    onEditorChange({ quill, html, text }, ref) {
      this.$emit('input', html)
    }
  }
}
</script>
<style scoped>
.ql-container {
  height: calc(100% - 50px);
}
>>>.ql-toolbar {
  line-height: 1.15;
}
.ivu-btn{
display: none;
}

>>>.quill-editor{
  height:247px;
  margin-top:-30px;
  /* margin-bottom:40px; */
}
.quillcon{
  height: 300px;
  margin-bottom: 15px;
}
>>>.ql-editor.ql-blank::before {
    color: #c0c4cc;
    content: attr(data-placeholder);
    font-style: inherit;
    left: 15px;
    pointer-events: none;
    position: absolute;
    right: 15px;
    font-family: Arial;
    font-size: 14px;
}
</style>
