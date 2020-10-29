<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.type_id"
        clearable
        class="filter-item"
        size="mini"
        placeholder="请选择题目类型"
      >
        <el-option label="判断" value="3" />
        <el-option label="单选" value="1" />
        <el-option label="多选" value="2" />
      </el-select>

      <el-select
        v-model="listQuery.tag_id"
        class="filter-item"
        size="mini"
        clearable
        placeholder="请选择题目标签"
      >
        <el-option
          v-for="(item, ind) in subTag"
          :key="ind"
          :label="item.cn_name"
          :value="item.id"
        />
      </el-select>

      <el-input
        v-model.trim="listQuery.search"
        size="mini"
        clearable
        placeholder="请输入题目名称"
        style="width: 200px"
        class="filter-item"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        size="mini"
        @click="getList(1)"
      >搜索
      </el-button>

      <div style="float: right">
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          size="mini"
          @click="showTagDlg(1)"
        >题目方向管理</el-button
        >
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          size="mini"
          @click="showTagDlg(2)"
        >题目标签管理</el-button
        >
      </div>
    </div>

    <div class="filter-container">
      <el-button type="success" size="mini" @click="addTopic"> 新增</el-button>
      <el-button type="danger" size="mini" @click="removeSub"> 删除</el-button>
      <el-button type="success" size="mini" @click="showImport = true">
        题目批量导入</el-button
        >
      <a
        href="/api/v1/theory/admin/tasks/choice/uploads/"
        download
        style="margin-left: 10px"
      >
        <el-button type="warning" size="mini"> 导入模板下载</el-button>
      </a>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table :data="matchList" border @selection-change="checkTable">
        <el-table-column align="center" type="selection" />
        <el-table-column
          :index="indexMethod"
          align="center"
          type="index"
          width="50"
          label="序号"
        />
        <el-table-column align="center" prop="title" label="题目名称">
          <template slot-scope="scope">
            <span style="text-align: left">{{
              scope.row.title.length > 20
                ? scope.row.title.substr(0, 20) + "..."
                : scope.row.title
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="type_name" label="题目类型" />
        <el-table-column align="center" prop="tag_name" label="题目标签" />

        <el-table-column align="center" prop="answer" label="答案" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="success"
              @click="editTopic(scope.row.hash)"
            >编辑
            </el-button>
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

    <!--题目方向 && 题目类型 begin-->
    <el-dialog
      :title="digTitle"
      :visible.sync="tagDlg"
      width="780px"
      @close="closetagDlg"
    >
      <el-form ref="form" label-width="0px">
        <el-form-item label="">
          <el-col :span="12">
            <el-input
              v-model.trim="tagQuery.cn_name"
              clearable
              placeholder="请输入名称"
            />
          </el-col>
          <el-col :span="4" style="margin-left: 30px">
            <el-button type="success" @click="addTagType">新增 </el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <div style="border: 1px solid rgb(240, 249, 235)">
        <el-tag
          v-for="tag in tagDlgAry"
          :key="tag.id"
          class="mytag"
          closable
          style="
            margin: 8px 20px;
            background: #fff;
            border-color: rgb(220, 220, 220);
            border-radius: 43px;
          "
          size="mini"
          @close="removeTagType(tag.id)"
        >
          <el-tooltip
            :content="tag.cn_name"
            class="item"
            effect="dark"
            placement="top-start"
          >
            <div
              style="
                display: inline-block;
                width: 80px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
              "
            >
              {{ tag.cn_name }}
            </div>
          </el-tooltip>
        </el-tag>
      </div>
    </el-dialog>

    <!--题目标签 && 题目类型 end-->

    <!--批量导入 begin-->
    <el-dialog
      :visible.sync="showImport"
      title="理论题批量导入"
      @close="closeImport"
    >
      <el-upload
        ref="upload"
        :limit="1"
        :on-exceed="handleExceed"
        :before-upload="beforeAvatarUpload"
        :http-request="uploadSectionFile"
        :file-list="fileList"
        :auto-upload="false"
        class="upload-demo"
        action=""
      >
        <el-button
          slot="trigger"
          size="small"
          type="primary"
        >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          @click="submitUpload"
        >上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">
          只能上传excel文件，且不超过1MB
        </div>
      </el-upload>

      <el-table :data="importList" border style="margin-top: 20px">
        <!--<el-table-column-->
        <!--:index="indexMethod"-->
        <!--align="center"-->
        <!--type="index"-->
        <!--width="50"-->
        <!--label="序号"/>-->
        <el-table-column prop="content" align="center" label="题目描述" />
        <el-table-column prop="type_name" align="center" label="题目类型" />
        <el-table-column
          v-for="(v, i) in importOption"
          :label="'答案' + v"
          :key="i"
          prop="address"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.option[v] }}
          </template>
        </el-table-column>

        <el-table-column prop="answer" align="center" label="标准答案" />
      </el-table>
      <div>
        <p v-for="i in errList" style="color: red; margin: 5px">{{ i }}</p>
      </div>
    </el-dialog>
    <!--批量导入 end-->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import clipboard from '@/directive/clipboard/index.js'
import {
  fetchTopicList,
  addCategorys,
  getCategorys,
  deleteCategorys,
  getTags,
  addTags,
  deleteTags,
  deleteSub
} from '@/api/itemBank/theory'
import Cookies from 'js-cookie'

export default {
  name: 'TopicManagement',
  directives: { waves, clipboard },
  components: {
    Pagination
  },
  data() {
    return {
      tagDlg: false,
      tagDlgAry: [], // 标签或类型数据
      digTitle: '', // 标签或类型管理标题
      tagtype: 1, // 打开的弹窗是什么 1方向 2标签
      tagIds: [], // 选择的标签的项
      tagQuery: {
        // 新增题目标签的参数
        cn_name: '',
        content: ''
      },
      headers: { 'X-CSRF-Token': Cookies.get('X-CSRF-Token') },
      subType: [], // 题目方向
      subTag: [], // 题目标签

      matchList: [], // 题目列表
      ids: [], // 选择的所有表格的项
      listTotal: 0, // 题目列表总条数
      listPage: 1, // 题目列表页码
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row,
        search: '', // 关键字
        tag_id: '', // 标签
        type_id: '' // 类型
      },

      showImport: false, // 批量导入
      fileList: [], // 文件上传的列表

      importList: [], // 批量导入成功后的数据
      importOption: [], // 倒入题目列表
      errList: [] // 导入错误列表
    }
  },
  created() {
    this.getCategorys()
    this.getTags()
    this.getList()
  },
  methods: {
    closeImport() {
      // 关闭导入题目弹窗
      this.fileList = []
      this.importList = []
      this.importOption = []
      this.errList = []
    },
    getTags() {
      // 获取题目标签
      getTags().then((res) => {
        this.subTag = res.data
      })
    },
    getCategorys() {
      // 获取题目方向
      getCategorys().then((res) => {
        this.subType = res.data
      })
    },
    closeUpload() {
      // 关闭导入弹窗初始化文件列表和导入成功的题目列表
      this.fileList = []
      this.importData = []
    },
    handleExceed() {
      this.$message.error('请先删除之前导入的文件')
    },
    beforeAvatarUpload(file) {
      // 导入之前的钩子函数
      const fileType = file.name.substr(file.name.lastIndexOf('.'))
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isLt2M) {
        this.$message.error('文件大小不能超过 1MB!')
      }
      return isLt2M
    },
    uploadSectionFile(param) {
      // 确认导入的钩子函数
      var fileObj = param.file
      // 接收上传文件的后台地址
      var FileController = '/api/v1/theory/admin/tasks/import/'
      // FormData 对象
      var form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      this.axios({
        url: FileController,
        method: 'post',
        data: form,
        headers: this.headers
      })
        .then((res) => {
          if (res.data.success) {
            this.$message.success('上传成功')
            this.importOption = res.data.options
            this.importList = res.data.data
            this.errList = []
          } else {
            this.errList = res.data.message_zh
            this.$message.error(res.data.message)
          }
        })
        .catch((res) => {})
    },
    submitUpload() {
      // 批量导入-确定上传文件
      this.$refs.upload.submit()
    },

    indexMethod(index) {
      // 展示序号的方法
      return (this.listPage - 1) * this.listQuery.limit + index + 1
    },
    getTag() {
      // 获取题目标签
      getTags().then((res) => {
        this.tagAry = res.data
        this.tagDlgAry = res.data
      })
    },
    getType() {
      // 获取题目方向
      getCategorys().then((res) => {
        this.subType = res.data
        this.tagDlgAry = res.data
      })
    },
    checkTag(val) {
      // 选择标签表格
      this.tagIds = val.map((item) => {
        return item.id
      })
    },
    removeTagType(id) {
      // 删除标签
      const params = { ids: [] }
      params.ids.push(id)
      if (params.ids.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.tagtype == 1) {
            deleteCategorys(params).then((res) => {
              if (res.data.success) {
                this.$message.success('删除成功')
                this.getType()
              }
            })
          }
          if (this.tagtype == 2) {
            deleteTags(params).then((res) => {
              if (res.data.success) {
                this.$message.success('删除成功')
                this.getTag()
                this.getTags()
              }
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    closetagDlg() {
      this.tagQuery = {
        cn_name: '',
        content: ''
      }
    },
    addTagType() {
      // 增加标签
      if (this.tagQuery.cn_name.length > 30) {
        this.$message.error('名称长度应限制在30字以内')
        return
      }
      // 增加标签
      if (this.tagQuery.cn_name === '') {
        this.$message.error('请输入名称')
        return
      }
      if (this.tagtype == 1) {
        addCategorys(this.tagQuery).then((res) => {
          if (res.data.success) {
            this.tagQuery = {
              cn_name: '',
              content: ''
            }
            this.$message.success('新增成功')
            this.getType()
          }
        })
      }
      if (this.tagtype == 2) {
        addTags(this.tagQuery).then((res) => {
          if (res.data.success) {
            this.tagQuery = {
              cn_name: '',
              content: ''
            }
            this.$message.success('新增成功')
            this.getTag()
            this.getTags()
          }
        })
      }
    },
    showTagDlg(num) {
      // 展示弹窗
      this.tagtype = num
      if (num == 1) {
        this.digTitle = '题目方向管理'
        this.tagDlgAry = this.subType
        this.getType()
      } else {
        this.digTitle = '题目标签管理'
        this.tagDlgAry = this.tagAry
        this.getTag()
      }

      this.tagDlg = true
    },
    removeSub() {
      // 删除题目
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
          deleteSub(params).then((res) => {
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

    addTopic() {
      // 新增赛题
      this.$router.push({
        path: '/itemBank/theory/addTheory',
        query: { type: this.$route.name }
      })
    },
    editTopic(id) {
      // 编辑题目
      this.$router.push({
        path: '/itemBank/theory/editTheory',
        query: {
          task_id: id,
          type: this.$route.name
        }
      })
    },
    getList(page) {
      if (page === 1) this.listPage = page

      this.listQuery.offset = this.listPage
      fetchTopicList(this.listQuery).then((res) => {
        const { data } = res
        this.matchList = data.rows
        this.listTotal = data.total

        if (
          this.listTotal <=
            this.listQuery.offset * this.listQuery.limit -
              this.listQuery.limit &&
          this.listTotal != 0
        ) {
          this.listQuery.offset = this.listQuery.offset - 1
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
