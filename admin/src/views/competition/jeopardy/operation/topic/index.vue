<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.type"
        class="filter-item"
        size="mini"
        placeholder="请选择题目类型"
        clearable
      >
        <el-option
          v-for="(item, ind) in subType"
          :key="ind"
          :label="item.cn_name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.public"
        class="filter-item"
        size="mini"
        placeholder="请选择题目状态"
        clearable
      >
        <el-option :value="1" label="公开" />
        <el-option :value="0" label="隐藏" />
      </el-select>
      <el-input
        v-model.trim="listQuery.search"
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
        @click="getList"
      >搜索
      </el-button>
    </div>

    <div class="filter-container">
      <el-button type="success" size="mini" @click="showtopic">
        导入题目</el-button
        >
      <!--<el-button type="success" size="mini" @click="addTopic"> 新增</el-button>-->
      <el-button type="danger" size="mini" @click="removeSub"> 删除</el-button>
      <el-button type="success" size="mini" @click="publicSub">
        题目公开</el-button
        >
      <el-button type="danger" size="mini" @click="hideSUb">
        题目隐藏</el-button
        >
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        ref="multipleTable"
        :key="tableKey"
        :data="matchList"
        border
        fit
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="checkTable"
      >
        <el-table-column align="center" type="selection" />
        <el-table-column
          :index="(listQuery.offset - 1) * listQuery.limit + 1"
          align="center"
          type="index"
          width="50"
          label="序号"
        />
        <el-table-column align="center" prop="title" label="题目名称" />
        <el-table-column
          align="center"
          prop="category_cn_name"
          label="题目类型"
        />
        <el-table-column align="center" prop="score" label="题目分值" />
        <el-table-column align="center" label="附件">
          <template slot-scope="scope">
            <el-button
              v-waves
              v-if="scope.row.file.length > 0"
              class="filter-item"
              size="mini"
              type="warning"
              @click="showDownload(scope.row)"
            >下载附件
            </el-button>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="题目环境">
          <template slot-scope="scope">
            <span v-if="scope.row.is_dynamic_env">
              <span v-if="scope.row.is_share == 0">独享</span>
              <span v-if="scope.row.is_share == 1">共享</span>
            </span>

            <span v-else>无</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="public" label="公开/隐藏">
          <template slot-scope="scope">
            <span v-if="scope.row.public == 0">隐藏</span>
            <span v-if="scope.row.public == 1">公开</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="solved_count" label="解题次数" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="success"
              @click="editTopic(scope.row.id)"
            >编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal > 0"
      :total="listTotal"
      :page.sync="listQuery.offset"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :visible.sync="addDlg"
      class="addsub"
      title="加入题目"
      width="900px"
    >
      <div style="margin-bottom: 20px">
        <el-select
          v-model="topicQuery.tag"
          class="filter-item"
          size="mini"
          placeholder="请选择题目标签"
        >
          <el-option
            v-for="(item, index) in subTag"
            :key="index"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="topicQuery.category"
          class="filter-item"
          size="mini"
          placeholder="请选择题目类型"
        >
          <el-option
            v-for="(item, ind) in subType"
            :key="ind"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
        <div style="float: right">
          <el-input
            v-model.trim="topicQuery.title"
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
            @click="getImportList"
          >搜索
          </el-button>
        </div>
      </div>
      <el-table
        :data="subData"
        border
        style="width: 100%"
        @selection-change="handleChange"
      >
        <el-table-column align="center" type="selection" />
        <el-table-column
          :index="(topicQuery.offset - 1) * topicQuery.limit + 1"
          align="center"
          type="index"
          width="50"
          label="序号"
        />
        <el-table-column prop="title" align="center" label="题目名称" />

        <el-table-column prop="tag_cn_name" align="center" label="题目标签" />

        <el-table-column
          prop="category_cn_name"
          align="center"
          label="题目类型"
        />
      </el-table>

      <pagination
        v-show="subTotal > 0"
        :total="subTotal"
        :page.sync="topicQuery.offset"
        :limit.sync="topicQuery.limit"
        @pagination="getImportList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureImportJeopardy">确 定</el-button>
        <el-button @click="addDlg = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--选择下载文件  begin-->
    <el-dialog
      :visible.sync="choseDown"
      class="addsub"
      title="下载附件"
      width="900px"
      @close="closeDown"
    >
      <template v-if="fileList.file">
        <el-row style="padding-left: 50px; font-size: 18px">
          <el-col :span="3"> 题目名称： </el-col>
          <el-col :span="8">
            {{ fileList.title }}
          </el-col>
        </el-row>
        <!-- 单文件附件下载 -->
        <el-row
          v-if="fileList.file.length < 2"
          style="
            padding-left: 50px;
            font-size: 18px;
            margin: 50px 0;
            line-height: 28px;
          "
        >
          <el-col :span="3"> 附件名称： </el-col>
          <el-tooltip
            :content="
              fileList.file[0].split('/')[
                fileList.file[0].split('/').length - 1
              ]
            "
            class="item"
            effect="dark"
            placement="top-start"
          >
            <el-col
              :span="6"
              class="threePoint"
            >
              {{
                fileList.file[0].split("/")[
                  fileList.file[0].split("/").length - 1
                ]
              }}
            </el-col>
          </el-tooltip>
          <a
            :href="fileList.file[0]"
            style="margin-left: 50px"
            download
          >
            <!-- 锚点2 -->
            <el-button
              type="primary"
              size="mini"
            > 下载 </el-button>
          </a>
        </el-row>
        <!-- 单文件附件下载结束 -->
        <el-row
          v-for="(item, index) in fileList.file"
          v-else
          :key="index"
          style="
            padding-left: 50px;
            font-size: 18px;
            margin: 30px 0;
            line-height: 28px;
          "
        >
          <el-col :span="3"> 附件{{ index + 1 }}名称： </el-col>
          <el-tooltip
            :content="item.split('/')[item.split('/').length - 1]"
            class="item"
            effect="dark"
            placement="top-start"
          >
            <el-col
              :span="6"
              class="threePoint"
            >
              {{ item.split("/")[item.split("/").length - 1] }}
            </el-col>
          </el-tooltip>
          <a
            :href="item"
            style="margin-left: 50px"
            download
          >
            <el-button
              type="primary"
              size="mini"
            > 下载 </el-button>
          </a>
        </el-row>
      </template>
    </el-dialog>
    <!--选择下载文件  end-->

    <!--查看flag  begin-->
    <el-dialog
      :visible.sync="diaFlag"
      class="addsub"
      title="查看flag"
      width="900px"
      @close="closeDown"
    >
      <p v-for="item in flagList" :key="item">{{ item }}</p>
    </el-dialog>
    <!--查看flag  end-->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  fetchJeopardyTopicList,
  fetchJeopardyTag,
  sureImportJeopardy,
  fetcheopardyTopicType,
  fetchJeopardyImport,
  publicJeopardySub,
  deleteJeopardySub,
  matchJeopardyInfo
} from '@/api/match/jeopardy'

export default {
  name: 'TopicManagement',
  directives: { waves },
  components: {
    Pagination
  },
  data() {
    return {
      id: this.$route.query.id,
      newscore: '', // 新的分数
      subType: [], // 题目类型
      subTag: [], // 习题集
      textarea: '',
      addDlg: false,
      choseDown: false,
      diaFlag: false,
      fileList: [], // 文件列表
      flagList: [], // flagList
      downList: [],
      subData: [], // 题目列表
      matchList: [], // 题目列表
      ids: [], // 选择的所有表格的项
      tableKey: 0,
      listTotal: 0, // 题目列表总条数
      subTotal: 0, // 导入题目弹窗总条数
      listLoading: false,
      topicQuery: {
        // 习题列表参数
        offset: 1,
        limit: this.$store.state.config.row,
        tag: '',
        category: '',
        title: '',
        event: this.$route.query.id
      },
      importData: {
        event: this.$route.query.id,
        hashs: []
      },
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row,
        event: this.$route.query.id,
        search: '',
        public: '',
        type: ''
      },
      showInput: -1,

      is_share: false, // false或0  独享 true或1 共享
      integral_mode: '' // 积分方式
    }
  },
  created() {
    matchJeopardyInfo({ evt_hash: this.$route.query.hash }).then((info) => {
      this.is_share = info.data.is_share
      this.integral_mode = info.data.integral_mode
    })
    this.getList()
    this.getType()
  },
  methods: {
    sureImportJeopardy() {
      // 确定导入题目
      sureImportJeopardy(this.importData).then((res) => {
        if (res.data.success) {
          this.addDlg = false
          this.getList()
        }
      })
    },
    handleChange(val) {
      this.importData.hashs = val.map((item) => {
        return item.hash
      })
    },
    showtopic() {
      // 展示导入题目列表
      this.addDlg = true
      this.getTag()
      this.getImportList()
    },
    getImportList() {
      // 获取导入题目列表
      fetchJeopardyImport(this.topicQuery).then((res) => {
        this.subData = res.data.rows
        this.subTotal = res.data.total
      })
    },
    removeSub() {
      // 删除题目
      const params = {}
      params.ids = this.ids
      params.event = this.id
      if (this.ids.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteJeopardySub(params).then((res) => {
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
    publicSub() {
      // 公开题目
      const params = {}
      params.ids = this.ids
      params.public = 1
      publicJeopardySub(params).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    hideSUb() {
      // 隐藏题目
      const params = {}
      params.ids = this.ids
      params.public = 0
      publicJeopardySub(params).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    closeDown() {
      // 关闭下载弹框
      this.fileList = []
      this.downList = []
    },
    // 展示下载弹框
    showDownload(fileList) {
      this.choseDown = true
      this.fileList = fileList
    },
    download() {
      this.downList.forEach((item) => {
        window.location.href = item
      })
      this.choseDown = false
    },
    addTopic() {
      // 新增赛题
      this.$router.push({
        path: '/competition/jeopardy/operation/addTopic',
        query: { id: this.$route.query.id }
      })
    },
    editTopic(id) {
      // 编辑题目
      this.$router.push({
        path: '/competition/jeopardy/operation/editTopic',
        query: {
          id: this.$route.query.id,
          hash: this.$route.query.hash,
          task_id: id
        }
      })
    },
    getType() {
      fetcheopardyTopicType().then((res) => {
        this.subType = res.data
      })
    },
    getTag() {
      fetchJeopardyTag().then((res) => {
        this.subTag = res.data
      })
    },
    getList(id) {
      fetchJeopardyTopicList(this.listQuery).then((res) => {
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
    }
  }
}
</script>

<style scoped>
  .threePoint {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
