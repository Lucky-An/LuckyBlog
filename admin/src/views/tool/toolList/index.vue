<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="success" size="mini" @click="addTool"> 新增</el-button>
      <el-button type="danger" size="mini" @click="removeTool"> 删除</el-button>
      <el-button type="success" size="mini" @click="isShowTool(1)">
        公开</el-button
        >
      <el-button type="danger" size="mini" @click="isShowTool(0)">
        隐藏</el-button
        >

      <div style="float: right">
        <el-button
          class="filter-item"
          type="primary"
          size="mini"
          @click="typeManage"
        >分类管理</el-button
        >
      </div>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table :data="listData" border @selection-change="checkTable">
        <el-table-column align="center" type="selection" />
        <el-table-column
          :index="indexMethod"
          align="center"
          type="index"
          width="50"
          label="序号"
        />
        <el-table-column align="center" prop="name" label="工具名称" />
        <el-table-column align="center" prop="label_name" label="工具分类" />
        <el-table-column align="center" prop="system_type_name" label="支持平台"/>
        <el-table-column align="center" prop="edition" label="版本号" />
        <el-table-column align="center" prop="tool_size" label="大小" />
        <el-table-column align="center" prop="upload_time" label="上传时间" />
        <el-table-column align="center" prop="name" label="语言">
          <template slot-scope="scope">
            {{ scope.row.language == 0 ? "中文" : "其他" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="收费模式">
          <template slot-scope="scope">
            {{ scope.row.charge == 0 ? "免费" : "付费" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="公开/隐藏">
          <template slot-scope="scope">
            {{ scope.row.status == 0 ? "隐藏" : "公开" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              class="filter-item"
              size="mini"
              type="success"
              @click="editTopic(scope.row.id)"
            >编辑
            </el-button>

            <a
              :href="'/api/v1/common/admin/tool_download/?id=' + scope.row.id"
              download
            >
              <el-button
                class="filter-item"
                size="mini"
                type="warning"
              >下载
              </el-button>
            </a>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal > 0"
      :total="listTotal"
      :page.sync="listPage"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :visible.sync="editTag"
      title="分类管理"
      width="600px"
      @close="closetagDlg"
    >
      <el-form ref="form" :model="tagQuery" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="label">
          <el-input
            v-model.trim="tagQuery.label"
            style="width: 80%"
            placeholder="请输入分类名称"
          />
          <el-button type="primary" @click="addTag">新增</el-button>
        </el-form-item>
      </el-form>
      <el-alert
        :title="'分类管理 详情'"
        :closable="false"
        type="success"
        center
      />
      <div style="border: 1px solid rgb(240, 249, 235)">
        <el-tag
          v-for="tag in tagList"
          :key="tag.id"
          class="mytag"
          closable
          style="margin: 20px 20px"
          size="mini"
          @close="removeTag(tag.id)"
        >
          <el-tooltip
            :content="tag.label"
            class="item"
            effect="dark"
            placement="top-start"
          >
            <div
              style="
                display: inline-block;
                width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              {{ tag.label }}
            </div>
          </el-tooltip>
        </el-tag>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  fetchToolList,
  isShowTool,
  remove,
  getTag,
  addTag,
  romoveTag
} from '@/api/tool'

export default {
  name: 'Config',
  components: {
    Pagination
  },
  data() {
    return {
      editTag: false, // 类型管理弹框
      tagName: '', // 类型名称
      tagList: [], // 类型管理列表
      listData: [], // 工具库列表
      ids: [], // 选择的所有表格的项
      listTotal: 0, // 题目列表总条数
      listPage: 1, // 题目列表页码
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row
      },
      tagIds: [],
      tagQuery: {
        label: '',
        description: ''
      },
      rules: {
        label: [
          { required: true, message: '请填写类型名称', trigger: 'blur' },
          { max: 10, message: '类型名称限制在十个字以内', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getTag()
  },
  methods: {
    closetagDlg() {
      // 关闭添加工具库弹窗
      this.tagQuery = {
        label: '',
        description: ''
      }
    },
    checkTag(val) {
      // 选择表格
      this.tagIds = val.map((item) => {
        return item.id
      })
    },
    removeTag(id) {
      // 删除标签
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          romoveTag({ ids: [id] }).then((res) => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.typeManage()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addTag() {
      // 增加标签
      if (this.tagQuery.label === '') {
        this.$message.error('请输入分类名称')
        return
      }
      addTag(this.tagQuery).then((res) => {
        if (res.data.success) {
          this.tagQuery = {
            label: '',
            description: ''
          }
          this.$message.success('操作成功')
          this.typeManage()
        }
      })
    },
    typeManage() {
      this.editTag = true
      this.getTag()
    },
    getTag() {
      getTag().then((res) => {
        this.tagList = res.data.rows
      })
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listPage - 1) * this.listQuery.limit + index + 1
    },
    isShowTool(status) {
      // 公开 隐藏工具
      const params = { ids: this.ids, status }
      isShowTool(params).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    removeTool() {
      // 删除
      const params = {}
      params.ids = this.ids
      if (this.ids.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove({ ids: this.ids }).then((res) => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    addTool() {
      // 新增工具
      this.$router.push({
        path: '/tool/addTool'
      })
    },
    editTopic(id) {
      // 编辑工具
      this.$router.push({
        path: '/tool/editTool',
        query: {
          id: id
        }
      })
    },
    getList() {
      this.listQuery.offset = (this.listPage - 1) * this.listQuery.limit
      fetchToolList(this.listQuery).then((res) => {
        const { data } = res
        this.listData = data.rows
        this.listTotal = data.total

        if (this.listTotal <= this.listQuery.offset && this.listTotal != 0) {
          this.listQuery.offset = this.listQuery.offset - this.listQuery.limit
          this.getList()
        }
      })
    },
    checkTable(val) {
      // 选择表格
      this.ids = val.map((item) => {
        return item.id
      })
    }
  }
}
</script>

<style scoped>
.addsub .pagination-container {
  padding: 0;
}

.dict-secong-trans {
  text-decoration: underline;
  color: #4395ff;
}

.bm {
  padding-bottom: 20px;
  border-bottom: 1px solid #bbb;
}

.fcenter {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
