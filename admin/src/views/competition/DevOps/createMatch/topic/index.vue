<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-select v-model="listQuery.status" class="filter-item" size="mini" placeholder="比赛公告">-->
      <!--<el-option label="全部题目状态" value=""/>-->
      <!--<el-option :value="1" label="公开"/>-->
      <!--<el-option :value="0" label="隐藏"/>-->
      <!--</el-select>-->
      <!--<el-input-->
      <!--v-model="listQuery.search"-->
      <!--placeholder="题目名称关键词搜索"-->
      <!--style="width: 150px;"-->
      <!--size="mini"-->
      <!--class="filter-item"/>-->
      <!--<el-button v-waves class="filter-item" type="primary"   size="mini" @click="getList">搜索-->
      <!--</el-button>-->
    </div>

    <div class="filter-container">
      <el-button
        type="success"
        size="mini"
        @click="showtopic"
      >
        导入题目</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="removeSub"
      > 删除</el-button>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
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
          prop="label"
          label="题目标签"
        >
          <template slot-scope="scope">
            <span
              v-for="(item, ind) in subTag"
              v-if="item.id == scope.row.label"
            >{{ item.cn_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="label"
          label="题目类型"
        >
          <template slot-scope="scope">
            <span
              v-for="(item, ind) in subType"
              v-if="item.id == scope.row.challenge_type"
            >{{ item.cn_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="ops_score"
          label="考察点分数"
        />
        <el-table-column
          align="center"
          prop="category_cn_name"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="editTopic(scope.row.id)"
            >编辑</el-button>
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

    <div class="btn_box topicStep_box">
      <el-button
        type="primary"
        @click="backStep"
      >上一步</el-button>

      <router-link :to="{ path: '/competition/DevOps/index' }">
        <el-button
          style="margin-left: 10px"
          type="primary"
        >完成</el-button>
      </router-link>

      <router-link :to="{ path: '/competition/DevOps/operation', query: { id: id } }">
        <el-button
          style="margin-left: 10px"
          type="warning"
        >竞赛运维</el-button>
      </router-link>
    </div>

    <!--选题弹窗-->
    <el-dialog
      :visible.sync="addDlg"
      class="addsub"
      title="选择题目"
      width="900px"
      @close="handleClose"
    >
      <div
        class="clearfix"
        style="margin-bottom: 20px"
      >
        <el-select
          v-model="topicQuery.label"
          class="filter-item"
          size="mini"
          placeholder="请选择题目标签"
          clearable
        >
          <el-option
            v-for="(item, index) in subTag"
            :key="index"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>

        <el-select
          v-model="topicQuery.challenge_type"
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

        <el-input
          v-model="topicQuery.title"
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
          :index="(topicQuery.page - 1) * topicQuery.per_page + 1"
          align="center"
          type="index"
          width="50"
          label="序号"
        />

        <el-table-column
          prop="title"
          label="题目名称"
        />

        <el-table-column
          prop="protocol"
          label="题目标签"
        >
          <template slot-scope="scope">
            <span
              v-for="(item, ind) in subTag"
              v-if="item.id == scope.row.label"
              :key="ind"
            >{{ item.cn_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="label"
          label="题目类型"
        >
          <template slot-scope="scope">
            <span
              v-for="(item, ind) in subType"
              v-if="item.id == scope.row.challenge_type"
              :key="ind"
            >{{ item.cn_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ops_score"
          label="考察点分数"
        />
      </el-table>

      <pagination
        v-show="subTotal>0"
        :total="subTotal"
        :page.sync="topicQuery.page"
        :limit.sync="topicQuery.per_page"
        @pagination="getImportList"/>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="sureImport"
        >确 定</el-button>
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
      <a
        v-for="item in fileList"
        :href="item"
        download
      >
        <el-button type="primary">{{ item }}</el-button>
      </a>
      <!--<el-checkbox-group v-model="downList" size="small">-->
      <!--<el-checkbox v-for="item in fileList" :label="item" border/>-->
      <!--</el-checkbox-group>-->
      <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button @click="choseDown = false">取 消</el-button>-->
      <!--<el-button type="primary" @click="download">确 定</el-button>-->
      <!--</div>-->
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
      <p v-for="item in flagList">{{ item }}</p>
    </el-dialog>
    <!--查看flag  end-->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  fetchDefenseTopicList,
  sureImportDefense,
  fetchTopicType,
  fetchDefenseImport,
  deleteSubDefense
} from '@/api/match/DevOps'
import { fetchType, fetchTags } from '@/api/itemBank/common'

export default {
  name: 'TopicManagement',
  directives: { waves },
  components: {
    Pagination
  },
  data() {
    return {
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
      hashs: [], // 选择的所有表格的项
      tableKey: 0,
      listTotal: 0, // 题目列表总条数
      subTotal: 0, // 导入题目弹窗总条数
      listLoading: false,
      listPage: 1, // 题目列表页码
      subPage: 1, // 导入题目弹窗页码
      topicQuery: {
        // 习题列表参数
        page: 1,
        per_page: this.$store.state.config.row,
        challenge_type: '',
        event_id: this.$route.query.id || sessionStorage['id'],
        label: '',
        title: ''
      },
      importData: {
        event: this.$route.query.id,
        hashs: []
      },
      id: this.$route.query.id || sessionStorage['id'],
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row
      },
      showInput: -1,
      timer: {},
      num: {}, // 轮询次数
      loading: []
    }
  },
  created() {
    this.getList()
    this.getType()
  },
  beforeDestroy() {
    for (const key in this.timer) {
      clearInterval(this.timer[key])
    }
  },
  methods: {
    nextStep() {
      this.$emit('nextStep')
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listPage - 1) * this.listQuery.limit + index + 1
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

    sureImport() {
      // 确定导入题目
      let params = { event_id: this.id },
        data = { ids: this.importData.hashs }
      sureImportDefense(params, data).then(res => {
        if (res.data.success) {
          this.addDlg = false
          this.getList()
        }
      })
    },
    handleChange(val) {
      this.importData.hashs = val.map(item => {
        return item.id
      })
    },
    showtopic() {
      // 展示导入题目列表
      this.addDlg = true
      // this.getTag()
      this.getImportList()
    },
    getImportList(page) {
      // 获取导入题目列表
      if (page === 1) this.topicQuery.page = page
      fetchDefenseImport(this.topicQuery).then(res => {
        this.subData = res.data.data
        this.subTotal = res.data.total
      })
    },
    removeSub() {
      // 删除题目
      const data = { ids: this.hashs },
        params = { event_id: this.id }

      if (this.hashs.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSubDefense(params, data).then(res => {
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
        path: '/competition/DevOps/editMatch/editTopic',
        query: {
          id: this.$route.query.id,
          task_id: id
        }
      })
    },
    getType() {
      fetchType({ type: 3 }).then(res => {
        this.subType = res.data
      })
      fetchTags({ type: 3 }).then(res => {
        this.subTag = res.data
      })
    },
    getList(id) {
      this.listQuery.offset = (this.listPage - 1) * this.listQuery.limit
      const params = {
        offset: this.listQuery.offset,
        limit: this.listQuery.limit,
        event_id: this.id
      }
      fetchDefenseTopicList(params).then(res => {
        if (id) this.closeLoading(id)
        const { data } = res
        this.matchList = data.rows
        this.listTotal = data.total
        if (this.listTotal <= this.listQuery.offset && this.listTotal != 0) {
          this.listQuery.offset = this.listQuery.offset - this.listQuery.limit
          this.getList()
        }
      })
    },
    checkTable(val) {
      // 选择表格
      this.hashs = val.map(item => {
        return item.id
      })
    },

    handleClose() {
      this.topicQuery.challenge_type = ''
      this.topicQuery.label = ''
      this.topicQuery.title = ''
      this.topicQuery.page = 1
      this.subData = []
      this.importData.hashs = []
    }
  }
}
</script>

<style scoped>
.addsub .pagination-container {
  padding-bottom: 0;
}

.topicStep_box {
  display: flex;

  justify-content: center;
  align-items: center;
}
</style>
