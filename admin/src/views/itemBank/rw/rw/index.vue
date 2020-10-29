<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="key"
        placeholder="请输入题目名称"
        style="width: 150px"
        size="mini"
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

      <!-- <div style="float: right;">
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          size="mini"
          @click="showTagDlg(1)"
        >题目类型管理</el-button>
        <el-button v-waves class="filter-item" type="primary" size="mini" @click="showTagDlg(2)">题目标签管理</el-button>
      </div> -->
    </div>

    <div class="filter-container">
      <el-button type="success" size="mini" @click="addTopic"> 新增</el-button>
      <el-button type="danger" size="mini" @click="removeSub"> 删除</el-button>
      <!--<el-button type="success" size="mini" @click="publicSub(1)"> 题目公开</el-button>-->
      <!--<el-button type="danger" size="mini" @click="publicSub(0)"> 题目隐藏</el-button>-->
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
        <el-table-column align="center" prop="title" label="题目名称" />

        <el-table-column align="center" prop="category_name" label="题目类型" />

        <el-table-column align="center" prop="score" label="题目分值" />

        <el-table-column align="center" label="题目附件">
          <template slot-scope="scope">
            <a v-if="scope.row.file" :href="scope.row.file" download>
              <el-button
                v-waves
                class="filter-item"
                size="mini"
                type="primary"
              >下载附件</el-button
              >
            </a>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          label="WriteUp"
        >
          <template slot-scope="scope">
            <a
              v-if="scope.row.official_writeup"
              :href="scope.row.official_writeup"
              download
            >
              <el-button
                v-waves
                class="filter-item"
                size="mini"
                type="warning"
              >下载WP</el-button>
            </a>
            <span v-else>无</span>
          </template>
        </el-table-column> -->

        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              v-waves
              size="mini"
              type="success"
              @click="editTopic(scope.row.id)"
            >编辑
            </el-button>
            <!-- <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="danger"
              @click="removeSub([scope.row.id])"
            >删除
            </el-button> -->
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
            <el-button type="success" @click="addTagType">新增</el-button>
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import clipboard from '@/directive/clipboard/index.js'
import {
  fetchTopicList,
  topicPublic,
  publicSub,
  deleteSub,
  wpPublic,
  shareSence,
  fetchFlag,
  showTalking
} from '@/api/itemBank/realWord'
import {
  fetchTags,
  fetchType,
  AddLabel,
  DeleteType,
  DeleteLabel,
  AddType
} from '@/api/itemBank/common'

export default {
  name: 'TopicManagement',
  directives: { waves, clipboard },
  components: {
    Pagination
  },
  data() {
    return {
      matchList: [], // 题目列表
      ids: [], // 选择的所有表格的项
      listTotal: 0, // 题目列表总条数
      listPage: 1, // 题目列表页码
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row,
        key: '' // 关键字
      },
      key: '',

      tagDlg: false, // 标签或类型弹窗
      tagDlgAry: [], // 标签或类型数据
      tagtype: 1, // 打开的弹窗是什么 1类型 2标签
      tagIds: [], // 选择的标签的项
      digTitle: '', // 标签或类型管理标题
      tagQuery: {
        cn_name: '',
        content: '',
        type: 4
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkTag(val) {
      // 选择表格
      this.tagIds = val.map((item) => {
        return item.id
      })
    },
    closetagDlg() {
      this.tagQuery = {
        cn_name: '',
        content: '',
        type: 4
      }
    },
    showTagDlg(num) {
      // 展示弹窗
      this.tagtype = num

      if (num == 1) {
        this.digTitle = '题目类型管理'
        this.tagDlgAry = this.subType
        this.getType()
      } else {
        this.digTitle = '题目标签管理'
        this.tagDlgAry = this.tagAry
        this.getTag()
      }

      this.tagDlg = true
    },
    removeTagType(id) {
      // 删除标签
      const params = { ids: [id], type: 4 }
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
            params.type = 'rw'
            DeleteType(params).then((res) => {
              if (res.data.success) {
                this.$message.success('删除成功')
                this.getType()
              }
            })
          }
          if (this.tagtype == 2) {
            DeleteLabel(params).then((res) => {
              if (res.data.success) {
                this.$message.success('删除成功')
                this.getTag()
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
    getType() {
      // 获取题目类型
      // type  1:ad  2:jad  3:ops  4:rw  5:jeopardy
      fetchType({ type: 4 }).then((res) => {
        this.subType = res.data
        this.tagDlgAry = res.data
      })
    },
    getTag() {
      // 获取题目标签
      fetchTags().then((res) => {
        this.tagAry = res.data
        this.tagDlgAry = res.data
      })
    },
    addTagType() {
      // 新增标签
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
        AddType(this.tagQuery).then((res) => {
          if (res.data.success) {
            this.tagQuery = {
              cn_name: '',
              content: '',
              type: 4
            }
            this.$message.success('新增成功')
            this.getType()
          }
        })
      }
      if (this.tagtype == 2) {
        AddLabel(this.tagQuery).then((res) => {
          if (res.data.success) {
            this.tagQuery = {
              cn_name: '',
              content: '',
              type: 4
            }
            this.$message.success('新增成功')
            this.getTag()
          }
        })
      }
    },
    removeSub(data) {
      // 删除题目
      const params = {}
      // 如果data有长度，那么是单个删除，没有长度说明是vue事件默认参数，所以是多个删除
      if (data.length === 1) {
        params.ids = data
      } else {
        params.ids = this.ids
      }

      if (params.ids.length <= 0) {
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
    publicSub(num) {
      // 公开题目
      const params = {}
      params.ids = this.ids
      params.public = num
      topicPublic(params).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    addTopic() {
      // 新增赛题
      this.$router.push({
        path: '/itemBank/rw/addRW',
        query: { type: this.$route.name }
      })
    },
    editTopic(id) {
      // 编辑题目
      this.$router.push({
        path: '/itemBank/rw/editRW',
        query: {
          task_id: id,
          type: this.$route.name
        }
      })
    },
    getList(flag) {
      // this.listQuery.offset = (this.listPage - 1) * this.listQuery.limit
      if (flag == 1) {
        this.listQuery.key = this.key
        this.listPage = 1
      }
      this.listQuery.offset = this.listPage - 1 + 1
      fetchTopicList(this.listQuery).then((res) => {
        const { data } = res
        this.matchList = data.rows
        this.listTotal = data.total
      })
    },
    checkTable(val) {
      // 选择表格
      this.ids = val.map((item) => {
        return item.id
      })
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listPage - 1) * this.listQuery.limit + index + 1
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
