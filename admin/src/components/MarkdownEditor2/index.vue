<template>
  <div class="markdown_box">
    <mavon-editor
      :toolbars="options"
      v-model="newValue"
      :subfield="subfield"
      :default-open="defaultOpen"
      :toolbars-flag="toolbarsFlag"
      :autofocus="false"
      language
    />
  </div>
</template>

<script>
import defaultOptions from './defaultOptions'

export default {
  name: 'MarkdownEditor',

  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default() {
        return defaultOptions
      }
    },
    mode: {
      type: String,
      default: 'markdown'
    },
    height: {
      type: String,
      required: false,
      default: '300px'
    },
    language: {
      type: String,
      required: false,
      default: 'zh-CN' // https://github.com/nhnent/tui.editor/tree/master/src/js/langs
    },
    subfield: {
      type: Boolean,
      default: true
    },
    defaultOpen: {
      type: String,
      default: ''
    },
    toolbarsFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      editor: null
    }
  },
  computed: {
    editorOptions() {
      const options = Object.assign({}, defaultOptions, this.options)
      return options
    },
    newValue: {
      get: function() {
        return this.value
      },
      set: function(value) {
        this.$emit('input', value)
      }
    }
  },
  watch: {
    value: function(newValue, oldValue) {
      // 每当str的值改变则发送事件update:word , 并且把值传过去
      this.$emit('update:word', newValue)
    }
  },
  methods: {}
}
</script>
<style>
.markdown_box .v-note-wrapper {
  z-index: 998;
}
</style>

<style lang="scss">
// .markdown_box {
//   .v-note-wrapper.markdown-body {
//     background-color: #1a1d2c;
//     .v-note-op {
//       background-color: #232c48 !important;
//       border-bottom: 1px solid #232c48;
//       button,
//       .op-icon {
//         color: #ffffff !important;
//         .op-header.popup-dropdown {
//           // background-color: #232c48;
//           border-color: #232c48;
//           .dropdown-item {
//             color: #ffffff;
//             &:hover {
//               background: #0090fc;
//             }
//           }
//         }
//         &:hover {
//           background: #0090fc;
//         }
//       }
//       button.op-icon.selected {
//         background: #0090fc;
//       }
//     }
//     .v-note-panel {
//       .v-note-edit {
//         background-color: #2a3762 !important;
//         .content-input-wrapper {
//           background-color: #2a3762 !important;
//           .auto-textarea-input {
//             background-color: #2a3762 !important;
//             color: #ffffff;
//             &::placeholder {
//               color: #ffffff;
//             }
//           }
//         }
//       }
//       .v-note-show {
//         .v-show-content {
//           color: #ffffff;
//         }
//       }
//     }
//   }
//   .markdown-body table tr {
//     background: none;
//   }
//   .markdown-body pre {
//     background: #565656;
//   }
// }
// .v-show-content {
//   background-color: #2a3762 !important;
// }
</style>
