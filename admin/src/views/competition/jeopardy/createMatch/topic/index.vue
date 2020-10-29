<template>
  <div class="app-container jad_topic">
    <div class="filter-container">
      <el-button
        type="success"
        size="mini"
        @click="showtopic"
      >导入题目</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="removeSub"
      >删除</el-button>
      <el-button
        v-if="integral_mode===1"
        type="success"
        size="mini"
        @click="getSetScoreList"
      >题目分值设置</el-button>
    </div>

    <div class="filter-container">
      <el-table
        v-loading="listLoading"
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
        <el-table-column
          align="center"
          type="selection"
        />

        <el-table-column
          :index="indexMethod"
          align="center"
          type="index"
          width="50"
          label="序号"
        />

        <el-table-column
          align="center"
          prop="title"
          label="题目名称"
        />
        <el-table-column
          align="center"
          prop="category_cn_name"
          label="题目类型"
        />
        <el-table-column
          align="center"
          label="题目附件"
        >
          <template slot-scope="scope">
            <el-button
              v-waves
              v-if="scope.row.file.length>0"
              class="filter-item"
              size="mini"
              type="warning"
              @click="showDownload(scope.row.file)"
            >下载</el-button>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="is_dynamic_flag"
          label="Flag 形式"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.is_dynamic_flag==0">静态</span>
            <span v-if="scope.row.is_dynamic_flag==1">动态</span>
            <span v-if="scope.row.is_dynamic_flag==2">随机</span>
            <span v-if="scope.row.is_dynamic_flag==3">静态</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="is_dynamic_flag"
          label="题目环境 "
        >
          <template slot-scope="scope">
            <span v-if="scope.row.is_dynamic_env">
              <span v-if="scope.row.is_share==0">独享</span>
              <span v-if="scope.row.is_share==1">共享</span>
            </span>

            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="score"
          label="题目分值"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="success"
              @click="editTopic(scope.row.id)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal>0"
      :total="listTotal"
      :page.sync="listPage"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <p style="color: red;font-size: 18px;margin-top: 20px;text-align: center;margin: 10px;">竞赛开始前，一定要先去竞赛运维中初始化网络，否则无法正常比赛。</p>

    <div class="btn_box topicStep_box">
      <el-button
        type="primary"
        @click="backStep"
      >上一步</el-button>

      <router-link :to="{path:'/competition/jeopardy/index'}">
        <el-button
          style="margin-left: 10px;"
          type="primary"
        >完成</el-button>
      </router-link>

      <router-link :to="{path:'/competition/jeopardy/operation',query:{id:id,hash:$route.query.hash}}">
        <el-button
          style="margin-left: 10px;"
          type="warning"
        >竞赛运维</el-button>
      </router-link>
    </div>

    <!--选题弹窗-->
    <el-dialog
      :visible.sync="addDlg"
      class="addsub"
      title="导入题目"
      width="900px"
    >
      <div style="margin-bottom: 20px;">
        <el-select
          v-model="topicQuery.tag"
          class="filter-item"
          size="mini"
          clearable
          placeholder="请选择题目标签"
        >
          <!-- <el-option label="全部习题集" value /> -->
          <el-option
            v-for="(item,index) in subTag"
            :key="index"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="topicQuery.category"
          class="filter-item"
          size="mini"
          clearable
          placeholder="请选择题目类型"
        >
          <!-- <el-option label="全部题目类型" value /> -->
          <el-option
            v-for="(item,ind) in subType"
            :key="ind"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
        <div style="float: right;">
          <el-input
            v-model.trim="topicQuery.title"
            placeholder="题目名称"
            style="width: 150px;"
            size="mini"
            class="filter-item"
          />
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            size="mini"
            @click="getImportList"
          >搜索</el-button>
        </div>
      </div>
      <el-table
        :data="subData"
        border
        style="width: 100%"
        @selection-change="handleChange"
      >
        <el-table-column
          align="center"
          type="selection"
        />

        <el-table-column
          :index="indexMethod2"
          align="center"
          type="index"
          width="50"
          label="序号"
        />

        <el-table-column
          prop="title"
          align="center"
          label="题目名称"
        />

        <el-table-column
          prop="tag_cn_name"
          align="center"
          label="题目标签"
        />

        <el-table-column
          prop="category_cn_name"
          align="center"
          label="题目类型"
        />
        <!-- <el-table-column prop="category_cn_name" label="题目分值">
          <template slot-scope="scope">{{ integral_mode==1?100:1000 }}</template>
        </el-table-column>-->
      </el-table>

      <pagination
        v-show="subTotal>0"
        :total="subTotal"
        :page.sync="subPage"
        :limit.sync="topicQuery.limit"
        @pagination="getImportList"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="sureImportJeopardy"
        >确 定</el-button>
        <el-button @click="addDlg = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--批量修改分数-->
    <el-dialog
      :visible.sync="diaSetScore"
      class="addsub"
      title="批量修改分数"
    >
      <el-table
        :data="setScoreList"
        border
        style="width: 100%"
      >
        <el-table-column
          align="center"
          prop="title"
          label="题目名称"
        />
        <el-table-column
          prop="score"
          align="center"
          label="分数"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="editData[scope.row.id]"
              :min="-1000"
              :max="100000"
              label="描述文字"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- <pagination
        v-show="setScoreList.length>0"
        :total="setScoreList.length"
        :page.sync="subPage"
        :limit.sync="topicQuery.limit"
        @pagination="getImportList"
      /> -->
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="setScore"
        >确 定</el-button>
        <el-button @click="diaSetScore = false">取 消</el-button>
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
      <a
        v-for="item in fileList"
        :href="item"
        download
      >
        <el-button
          type="primary"
          style="margin-bottom: 10px;"
        >{{ item }}</el-button>
      </a>
    </el-dialog>
    <el-dialog
      :visible.sync="diaFlag"
      class="addsub"
      title="查看flag"
      width="900px"
      @close="closeDown"
    >
      <p v-for="item in flagList">{{ item }}</p>
    </el-dialog>
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
  deleteJeopardySub,
  getSenceStatus,
  getSetScoreList,
  editTaskScore,
  fetchJeopardyInfo
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
      listPage: 1, // 题目列表页码
      subPage: 1, // 导入题目弹窗页码
      topicQuery: {
        // 习题列表参数
        offset: 0,
        limit: this.$store.state.config.row,
        tag: '',
        category: '',
        title: '',
        order: 'asc',
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
        status: '',
        order: 'asc',
        type: ''
      },
      showInput: -1,
      timer: {},
      num: {}, // 轮询次数
      loading: [],

      diaSetScore: false, // 编辑分数弹窗
      setScoreList: [],
      editData: {},
      integral_mode: ''
    }
  },
  created() {
    this.getList()
    this.getType()
    this.matchInfo()
  },
  beforeDestroy() {
    for (const key in this.timer) {
      clearInterval(this.timer[key])
    }
  },
  methods: {
    getSetScoreList() {
      const params = {}
      params.ids = this.ids
      getSetScoreList(this.$route.query.id, params).then(res => {
        if (res.data.success) {
          this.diaSetScore = true
          this.setScoreList = res.data.data

          const data = {}
          res.data.data.forEach(item => {
            data[item.id] = item.score
          })
          this.editData = JSON.parse(JSON.stringify(data))
        }
      })
    },
    setScore() {
      // 整体设置分数
      const data = {
        data: this.editData
      }
      editTaskScore(this.$route.query.id, data).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.diaSetScore = false
          this.getList()
        } else {
          this.$message.error(res.data.meesage_zh)
        }
      })
    },
    nextStep() {
      this.$emit('nextStep')
    },
    backStep() {
      this.$emit('backStep')
    },
    closeLoading(id) {
      // 清除loading
      this.loading = this.loading.filter(item => {
        return item != id
      })
    },

    showEditScore(score, ind) {
      this.newscore = score
      this.showInput = ind
    },
    sureImportJeopardy() {
      // 确定导入题目
      sureImportJeopardy(this.importData).then(res => {
        if (res.data.success) {
          this.addDlg = false
          this.getList()
        }
      })
    },
    handleChange(val) {
      this.importData.hashs = val.map(item => {
        return item.hash
      })
    },
    matchInfo() {
      // 展示导入题目列表
      fetchJeopardyInfo(this.topicQuery.event).then(res => {
        this.integral_mode = res.data.integral_mode
      })
    },
    showtopic() {
      //       topicQuery: {
      //   // 习题列表参数
      //   offset: 0,
      //   limit: this.$store.state.config.row,
      //   tag: '',
      //   category: '',
      //   title: '',
      //   order: 'asc',
      //   event: this.$route.query.id
      // },
      this.topicQuery.tag = ''
      this.topicQuery.category = ''
      this.topicQuery.title = ''
      this.addDlg = true
      this.getTag()
      this.getImportList()
    },
    getImportList() {
      // 获取导入题目列表
      this.topicQuery.offset = this.subPage
      // this.topicQuery.offset = (this.subPage - 1) * this.topicQuery.limit;
      fetchJeopardyImport(this.topicQuery).then(res => {
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
      }).then(() => {
        deleteJeopardySub(params).then(res => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showflag(list) {
      this.diaFlag = true
      this.flagList = list
    },
    closeDown() {
      // 关闭下载弹框
      this.fileList = []
      this.downList = []
    },
    showDownload(fileList) {
      this.choseDown = true
      this.fileList = fileList
    },
    download() {
      this.downList.forEach(item => {
        window.location.href = item
      })
      this.choseDown = false
    },
    addTopic() {
      // 新增赛题
      this.$router.push({
        path: '/competition/addTopic',
        query: { id: this.$route.query.id }
      })
    },
    editTopic(id) {
      // 编辑题目
      this.$router.push({
        path: '/competition/jeopardy/editMatch/editTopic',
        query: {
          id: this.$route.query.id,
          hash: this.$route.query.hash,
          task_id: id
        }
      })
    },
    getType() {
      fetcheopardyTopicType().then(res => {
        this.subType = res.data
      })
    },
    getTag() {
      fetchJeopardyTag().then(res => {
        this.subTag = res.data
      })
    },
    getList(id) {
      this.listQuery.offset = this.listPage
      fetchJeopardyTopicList(this.listQuery).then(res => {
        if (id) this.closeLoading(id)
        const { data } = res
        this.matchList = data.rows
        this.listTotal = data.total
      })
    },
    checkTable(val) {
      // 选择表格
      this.ids = val.map(item => {
        return item.id
      })
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listPage - 1) * this.listQuery.limit + index + 1
    },
    indexMethod2(index) {
      // 展示序号的方法
      return (this.topicQuery.offset - 1) * this.topicQuery.limit + index + 1
    }
  }
}
</script>

<style scoped>
.addsub .pagination-container {
  padding: 0;
}

.topicStep_box {
  display: flex;

  justify-content: center;
  align-items: center;
}
</style>
<style>
.jad_topic .pagination-container {
  padding: 5px;
}
</style>
