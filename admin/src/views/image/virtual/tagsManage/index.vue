<template>
  <div class="app-container competition_box tag_manage_wrapper">
    <div class="container_bg">
      <el-tree
        :data="tagTree"
        :props="defaultProps"
        default-expand-all
        style="margin:0 auto;"
        @node-click="handleNodeClick"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span
            :class="{'dingCeng':node.label=='顶层节点'}"
            :title="node.label"
            class="nodeName"
          >{{ node.label }}</span>
          <span :class="{'no_delete':data.children}">
            <!-- <el-button type="text" size="mini" @click="() => addTag(data)">增加节点</el-button>
            <el-button type="text" size="mini" @click="() => editTag(data)">编辑该节点</el-button>-->
            <span
              :class="{'firstTag':data.id==0}"
              class="fang_button_link"
              style="margin-right:20px;"
              @click="addTag(data,node)"
            >增加节点</span>
            <span v-if="!data.id==0" class="fang_button_link" @click="editTag(data,node)">编辑节点</span>
            <span
              v-if="!data.children&&!data.id==0"
              class="fang_button_link"
              type="text"
              size="mini"
              style="color: #F56C6C;margin-left:20px;"
              @click="() => removeTag(node, data)"
            >删除节点</span>
          </span>
        </span>
      </el-tree>

      <el-dialog
        v-el-drag-dialog
        :visible.sync="addDig"
        width="680px"
        title="标签管理"
        append-to-body
        @close="closeDia"
      >
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="120px"
          style="padding:0 25px;"
        >
          <el-form-item label="镜像标签" prop="name">
            <el-input
              v-model.trim="form.name"
              maxlength="12"
              show-word-limit
              placeholder="请输入镜像标签名称，只能包含汉字、数字、字母、下划线"
            />
          </el-form-item>
          <el-form-item label="镜像标签描述">
            <el-input
              v-model.trim="form.description"
              maxlength="256"
              show-word-limit
              placeholder="请输入镜像标签描述"
            />
          </el-form-item>
          <el-form-item v-if="addData.name!=='顶层节点'" label="父节点名称">
            <span style="color:#0090fc;">{{ addData.parentName }}</span>
          </el-form-item>

          <el-form-item class="from_submit_btn" style="margin-left:-90px;">
            <el-button type="primary" @click="submitTag('form')">确定</el-button>
            <el-button @click="addDig=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getTagList,
  submitTag,
  removeTag,
  patchTag
} from '@/api/match/property'
import elDragDialog from '@/directive/el-dragDialog'

export default {
  name: 'TagsManage',
  directives: { elDragDialog },

  data() {
    return {
      addDig: false, //
      addData: {}, // 添加标签时所选择的数据
      tagTree: [],
      form: {
        name: '', // 标签名称
        parent_id: 0, // 父级id
        description: '' // 描述
      },
      tag_id: '', // 编辑的tagid
      rules: {
        name: [
          { required: true, message: '请输入镜像标签名称', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            message: '镜像标签名称只能包含汉字、数字、字母、下划线'
          }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  created() {
    this.getTagList()
  },

  methods: {
    closeDia() {
      this.form = {
        name: '', // 标签名称
        parent_id: 0, // 父级id
        description: '' // 描述
      }
      this.addData = {}
      this.tag_id = ''
    },

    removeTag(node, data) {
      removeTag(data.id).then((res) => {
        if (res.data.success) {
          this.$message.success('删除成功')
          this.getTagList()
        }
      })
    },

    addTag(data, node) {
      if (data.level > 10) {
        this.$message.error('不建议树形结构等级超过十级~')
        return
      }
      this.addDig = true
      this.addData = data
      this.addData.parentName = data.name
    },

    editTag(data, node) {
      this.addDig = true
      this.addData = data
      this.addData.parentName = node.parent.data.name
        ? node.parent.data.name
        : '顶层节点'
      this.form.name = data.name
      this.form.description = data.description
      this.tag_id = data.id
    },

    submitTag(formName) {
      // 保存标签
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tag_id) {
            delete this.form.parent_id
            patchTag(this.tag_id, this.form).then((res) => {
              if (res.data.success) {
                this.addDig = false
                this.getTagList()
              }
            })
          } else {
            submitTag(this.form).then((res) => {
              if (res.data.success) {
                this.addDig = false
                this.getTagList()
              }
            })
          }
        }
      })
    },

    getTagList() {
      // 获取全部镜像标签
      getTagList().then((res) => {
        this.tagTree = this.initData(res.data.data)
        this.tagTree.unshift({ id: 0, name: '顶层节点' })
      })
    },

    handleNodeClick(obj, node, self) {
      this.form.parent_id = obj.id + ''
    },

    initData(list) {
      // 将数组转为树形结构
      const temp = {}
      const tree = []
      for (const i of list) {
        i.id = String(i.id)
        temp[i.id] = i
      }
      for (const i in temp) {
        if (temp[i].parent_id) {
          if (!temp[temp[i].parent_id].children) {
            temp[temp[i].parent_id].children = []
          }
          temp[temp[i].parent_id].children.push(temp[i])
        } else {
          tree.push(temp[i])
        }
      }
      return tree
    }
  }
}
</script>

<style lang='scss'>
.no_delete {
  margin-right: 80px;
  display: inline-block;
}
.tag_manage_wrapper {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    .nodeName {
      white-space: nowrap;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
    }
  }
  .el-tree {
    width: 1000px;
    padding: 20px;
  }
}
.firstTag {
  margin-right: 160px !important;
}
.dingCeng {
  margin-left: -30px;
}
</style>
