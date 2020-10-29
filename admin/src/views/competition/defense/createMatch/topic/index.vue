<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="success" size="mini" @click="showtopic">导入题目</el-button>

      <el-button type="danger" size="mini" @click="removeSub">删除</el-button>
      <el-button type="success" size="mini" @click="setscore">题目分值设置</el-button>
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
        <el-table-column align="center" type="selection" />
        <el-table-column :index="indexMethod" align="center" type="index" width="50" label="序号" />
        <el-table-column align="center" prop="title" label="题目名称" />
        <el-table-column align="center" prop="challenge_type_name" label="题目类型" />
        <!-- <el-table-column align="center" prop="attach_file" label="附件">
          <template slot-scope="scope">
            <span v-if="scope.row.attach_file=='无'">无</span>
            <a v-else :href="scope.row.wp_official" download>
              <el-button v-waves class="filter-item" size="mini" type="warning">下载</el-button>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="title"
          label="flag"/>
        <el-table-column
          align="center"
          prop="title"
        label="环境"/>-->
        <el-table-column align="center" prop="score" label="题目分值" />
        <!-- <el-table-column
          align="center"
          prop="start_method"
        label="启动方式"/>-->
        <el-table-column align="center" prop="category_cn_name" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editTopic(scope.row.id)">编辑</el-button>
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

    <div class="btn_box topicStep_box">
      <el-button type="primary" @click="backStep">上一步</el-button>

      <router-link :to="{path:'/competition/defense/index'}">
        <el-button style="margin-left: 10px;" type="primary">完成</el-button>
      </router-link>

      <el-button style="margin-left: 10px;" type="warning" @click="nextStep">竞赛运维</el-button>
    </div>

    <!--添加弹窗-->
    <el-dialog :visible.sync="addDlg" class="addsub" title="选择题目" width="900px">
      <div class="clearfix" style="margin-bottom: 20px;">
        <el-select v-model="topicQuery.label" class="filter-item" clearable size="mini" placeholder="请选择题目标签">
          <!-- <el-option label="全部标签" value=""/> -->
          <el-option
            v-for="(item,index) in subTag"
            :key="index"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="topicQuery.challenge_type"
          class="filter-item"
          size="mini"
          clearable
          placeholder="请选择题目类型"
        >
          <!-- <el-option label="全部题目类型" value=""/> -->
          <el-option
            v-for="(item,ind) in subType"
            :key="ind"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
        <el-button v-waves class="filter-item" type="primary" size="mini" @click="getImportList">搜索</el-button>
      </div>
      <el-table :data="subData" border style="width: 100%" @selection-change="handleChange">
        <el-table-column align="center" type="selection" />
        <el-table-column :index="indexMethod2" align="center" width="50px" label="序号" type="index" />

        <el-table-column prop="title" label="题目名称" />
        <el-table-column prop="protocol" label="题目标签">
          <template slot-scope="scope">
            <span
              v-for="(item,ind) in subTag"
              v-if="item.id==scope.row.label"
              :key="ind"
            >{{ item.cn_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="label" label="题目类型">
          <template slot-scope="scope">
            <span
              v-for="(item,ind) in subType"
              v-if="item.id==scope.row.challenge_type"
              :key="ind"
            >{{ item.cn_name }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :total="subTotal"
        :page.sync="topicQuery.limit"
        :limit.sync="topicQuery.offset"
        style="margin-top:20px"
        @pagination="getImportList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureImport">确 定</el-button>
        <el-button @click="addDlg = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--题目分值设置弹窗-->
    <el-dialog :visible.sync="scorevis" class="addsub" title="题目分值设置" width="900px">
      <!-- <div class="clearfix" style="margin-bottom: 20px;">
        <el-input
          v-model.trim="inpscore"
          placeholder="请输入题目分值"
          style="width: 260px;"
          size="mini"
          class="filter-item"
        />
      </div> -->
      <el-table :data="scorelist" border style="width: 100%" @selection-change="handleChange">
        <el-table-column type="index" width="60px" label="序号" />
        <el-table-column prop="title" label="题目名称" />
        <el-table-column prop="score" label="题目分值">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.score" size="mini"/>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subsetscore">确 定</el-button>
        <el-button @click="scorevis = false">取 消</el-button>
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
      <a v-for="item in fileList" :href="item" download>
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
  defenseChangeScore,
  defenseScoreSet,
  fetchDefenseImport,
  deleteSubDefense
} from '@/api/match/defense'
import { fetchType, fetchTags } from '@/api/itemBank/common'

export default {
  name: 'TopicManagement',
  directives: { waves },
  components: {
    Pagination
  },
  data() {
    return {
      inpscore: '', // 题目设置分数的输入框
      scorelist: [], // 题目分值列表
      newscore: '', // 新的分数
      subType: [], // 题目类型
      subTag: [], // 习题集
      textarea: '',
      addDlg: false,
      choseDown: false,
      diaFlag: false,
      scorevis: false,
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
        offset: 10, // 每页多少条
        limit: 0, // 当前第几页
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
    indexMethod2(index) {
      // 展示序号的方法
      return (this.topicQuery.limit - 1) * this.topicQuery.offset + index + 1
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listQuery.offset - 1) * this.listQuery.limit + index + 1
    },
    // 点击题目分值设计
    setscore() {
      if (this.hashs.length <= 0) {
        return
      }
      this.inpscore = ''
      this.scorevis = true
      this.scorelist = []
      defenseChangeScore(this.id, { ids: this.hashs }).then((res) => {
        if (res.data.success) {
          this.scorelist = res.data.data
        }
      })
    },
    subsetscore() {
      // if (this.inpscore == "") {
      //   return;
      // }
      // for (var i = 0; i < this.scorelist.length; i++) {
      //   this.scorelist[i].score = this.inpscore;
      // }
      defenseScoreSet(this.id, this.scorelist).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.scorevis = false
          this.getList()
        }
      })
    },
    nextStep() {
      this.$router.push({
        path: '/competition/defense/operation',
        query: {
          id: this.$route.query.id
        }
      })
    },

    backStep() {
      this.$emit('backStep')
    },

    closeLoading(id) {
      // 清除loading
      this.loading = this.loading.filter((item) => {
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
      sureImportDefense(params, data).then((res) => {
        if (res.data.success) {
          this.addDlg = false
          this.getList()
        }
      })
    },
    handleChange(val) {
      this.importData.hashs = val.map((item) => {
        return item.id
      })
    },
    showtopic() {
      // 展示导入题目列表
      this.addDlg = true
      // this.getTag()
      this.getImportList()
    },
    getImportList() {
      // 获取导入题目列表
      // this.topicQuery.offset = this.subPage

      // let params = { event_id: this.id }

      fetchDefenseImport(this.topicQuery).then((res) => {
        // this.subData = res.row
        this.subData = res.data.row
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
          deleteSubDefense(params, data).then((res) => {
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
      this.downList.forEach((item) => {
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
        path: '/competition/defense/editMatch/editTopic',
        query: {
          id: this.$route.query.id,
          task_id: id
        }
      })
    },
    getType() {
      fetchType({ type: 1 }).then((res) => {
        this.subType = res.data
      })
      fetchTags({ type: 1 }).then((res) => {
        this.subTag = res.data
      })
    },
    getList(id) {
      this.listQuery.offset = this.listPage
      const params = {
        offset: this.listQuery.offset,
        limit: this.listQuery.limit,
        event_id: this.id
      }
      fetchDefenseTopicList(params).then((res) => {
        if (id) this.closeLoading(id)
        const { data } = res
        this.matchList = data.rows
        this.listTotal = data.total
        // if (this.listTotal <= this.listQuery.offset && this.listTotal != 0) {
        //   this.listQuery.offset = this.listQuery.offset - this.listQuery.limit;
        //   this.getList();
        // }
      })
    },
    checkTable(val) {
      // 选择表格
      this.hashs = val.map((item) => {
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

.topicStep_box {
  display: flex;

  justify-content: center;
  align-items: center;
}
</style>
