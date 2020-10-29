<template>
  <div class="app-container">
    <!--<div class="filter-container">-->
    <!--<el-select v-model="listQuery.type" class="filter-item" size="mini" placeholder="题目类型">-->
    <!--<el-option label="全部题目类型" value=""/>-->
    <!--<el-option v-for="item,ind in subType" :key="ind"  :label="item.cn_name" :value="item.id"/>-->
    <!--</el-select>-->
    <!--<el-select v-model="listQuery.status" class="filter-item" size="mini" placeholder="比赛公告">-->
    <!--<el-option label="全部题目状态" value=""/>-->
    <!--<el-option :value="1" label="公开"/>-->
    <!--<el-option :value="0" label="隐藏"/>-->
    <!--</el-select>-->
    <!--<el-input-->
    <!--v-model="listQuery.search"-->
    <!--placeholder="请输入题目名称"-->
    <!--style="width: 150px;"-->
    <!--size="mini"-->
    <!--class="filter-item"/>-->
    <!--<el-button v-waves class="filter-item" type="primary"   size="mini" @click="getList">搜索-->
    <!--</el-button>-->

    <!--<div style="float: right;">-->
    <!--<el-button v-waves class="filter-item" type="primary"   size="mini">题目类型管理</el-button>-->
    <!--</div>-->
    <!--</div>-->

    <div class="filter-container">
      <el-button type="success" size="mini" @click="showtopic"> 导入题目</el-button>
      <!--<el-button type="success" size="mini" @click="addTopic"> 新增</el-button>-->
      <el-button type="danger" size="mini" @click="removeSub"> 删除</el-button>
      <el-button type="success" size="mini" @click="getSetScoreList"> 题目分值设置</el-button>
      <!--<el-button type="danger" size="mini" @click="hideSUb"> 题目隐藏</el-button>-->
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
        @selection-change="checkTable">
        <el-table-column
          align="center"
          type="selection"/>
        <el-table-column
          align="center"
          prop="title"
          label="题目名称"/>
        <el-table-column
          align="center"
          prop="category_cn_name"
          label="类型"/>
        <!--<el-table-column-->
        <!--align="center"-->
        <!--prop="origin"-->
        <!--label="题目来源"/>-->
        <el-table-column
          align="center"
          label="附件">
          <template slot-scope="scope">
            <el-button
              v-waves
              v-if="scope.row.file.length>0"
              class="filter-item"
              size="mini"
              type="success"
              @click="showDownload(scope.row.file)">下载附件
            </el-button>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="is_dynamic_flag"
          label="题目Flag形式">
          <template slot-scope="scope">
            <span v-if="scope.row.is_dynamic_flag==0">静态flag</span>
            <span v-if="scope.row.is_dynamic_flag==1">动态flag</span>
            <span v-if="scope.row.is_dynamic_flag==2">随机flag</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="is_dynamic_flag"
          label="环境">
          <template slot-scope="scope">
            <span v-if="scope.row.is_share==0">独享</span>
            <span v-if="scope.row.is_share==1">共享</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--align="center"-->
        <!--prop="score"-->
        <!--label="当前分值" width="200">-->
        <!--<template slot-scope="scope">-->
        <!--<div v-if="scope.row.integral_mode==1">-->
        <!--<span v-if="showInput!=scope.$index">-->
        <!--{{scope.row.score}}-->
        <!--<el-button v-waves size="mini" @click="showEditScore(scope.row.score,scope.$index)">编辑</el-button>-->
        <!--</span>-->
        <!--<span v-else>-->
        <!--<el-input-->
        <!--v-model="newscore"-->
        <!--placeholder="分值"-->
        <!--style="width: 55px;"-->
        <!--size="mini"/>-->
        <!--<el-button v-waves type="primary" size="mini" plain @click="saveNewscore(scope.row.id)">保存</el-button>-->
        <!--</span>-->

        <!--</div>-->
        <!--<div v-else>{{scope.row.score}}</div>-->

        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--align="center"-->
        <!--prop="event_mode"-->
        <!--label="计分方式">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{ scope.row.integral_mode==1?'累加计分':'动态计分' }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          align="center"
          label="环境">
          <template slot-scope="scope">
            <!--<el-button v-waves class="filter-item" size="mini" type="success" @click="editNoice">共享</el-button>-->
            <span>无</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="score"
          label="当前分值"/>
        <!--<el-table-column-->
        <!--align="center"-->
        <!--label="flag">-->
        <!--<template slot-scope="scope">-->
        <!--<el-button v-waves class="filter-item" size="mini" type="success" @click="showflag(scope.row.answer)">查看-->
        <!--</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--align="center"-->
        <!--prop="public"-->
        <!--label="状态">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{ scope.row.public?'公开':'隐藏' }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--align="center"-->
        <!--label="讨论">-->
        <!--<template slot-scope="scope">-->
        <!--<el-button v-waves class="filter-item" size="mini" type="success" disabled>查看</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--align="center"-->
        <!--label="容器"-->
        <!--width="240">-->
        <!--<template slot-scope="scope">-->
        <!--<div v-if="!scope.row.is_share">-->
        <!--暂无-->
        <!--</div>-->
        <!--<div v-else>-->
        <!--<el-button v-if="!scope.row.dynamic_env_status" class="  selfServer-btn-green" size="mini" type="success"-->
        <!--@click="openSence(scope.row.parent_hash,scope.row.id)"-->
        <!--:loading="loading.includes(scope.row.id)">开启容器-->
        <!--</el-button>-->
        <!--<span v-else>-->
        <!--<el-button class="filter-item selfServer-btn-yellow" size="mini" type="warning"-->
        <!--@click="resetSence(scope.row.parent_hash,scope.row.id)"-->
        <!--:loading="loading.includes(scope.row.id)">重置容器</el-button>-->
        <!--<el-button class="filter-item selfServer-btn-red mrg10L" size="mini" type="danger"-->
        <!--@click="closeSence(scope.row.parent_hash,scope.row.id)"-->
        <!--:loading="loading.includes(scope.row.id)">关闭容器</el-button>-->
        <!--</span>-->
        <!--</div>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button v-waves class="filter-item" size="mini" type="success" @click="editTopic(scope.row.id)">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal>0"
      :total="listTotal"
      :page.sync="listPage"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>

    <div class="btn_box topicStep_box">
      <el-button type="primary" @click="backStep">上一步</el-button>
      <el-button type="primary" @click="nextStep">下一步</el-button>
    </div>

    <!--选题弹窗-->
    <el-dialog :visible.sync="addDlg" class="addsub" title="加入题目" width="900px">
      <div style="margin-bottom: 20px;">

        <el-select v-model="topicQuery.tag" class="filter-item" size="mini" placeholder="比赛公告">
          <el-option label="全部习题集" value=""/>
          <el-option v-for="item,index in subTag" :key="index" :label="item.cn_name" :value="item.id"/>
        </el-select>
        <el-select v-model="topicQuery.category" class="filter-item" size="mini" placeholder="">
          <el-option label="全部题目类型" value=""/>
          <el-option v-for="(item,ind) in subType" :key="ind" :label="item.cn_name" :value="item.id"/>
        </el-select>
        <div style="float: right;">
          <el-input
            v-model.trim="topicQuery.title"
            placeholder="题目名称"
            style="width: 150px;"
            size="mini"
            class="filter-item"/>
          <el-button
            v-waves
            class="filter-item"
            type="primary"

            size="mini"
            @click="getImportList">搜索
          </el-button>

        </div>
      </div>
      <el-table
        :data="subData"
        border
        style="width: 100%"
        @selection-change="handleChange">
        <el-table-column
          align="center"
          type="selection"/>
        <el-table-column
          prop="title"
          label="题目名称"/>
        <el-table-column
          prop="tag_cn_name"
          label="题目标签"/>
        <el-table-column
          prop="category_cn_name"
          label="分类"/>
          <!--<el-table-column-->
          <!--prop="score"-->
          <!--label="分数"/>-->
      </el-table>

      <pagination
        v-show="subTotal>0"
        :total="subTotal"
        :page.sync="subPage"
        :limit.sync="topicQuery.limit"
        @pagination="getImportList"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureImportJeopardy">确 定</el-button>
        <el-button @click="addDlg = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--批量修改分数-->
    <el-dialog :visible.sync="diaSetScore" class="addsub" title="批量修改分数">
      <el-table
        :data="setScoreList"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          prop="title"
          label="题目名称"/>
        <el-table-column
          prop="score"
          align="center"
          label="分数">
          <template slot-scope="scope">
            <el-input-number v-model="editData[scope.row.id]" :min="-1000" :max="100000" label="描述文字"/>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="subTotal>0"
        :total="subTotal"
        :page.sync="subPage"
        :limit.sync="topicQuery.limit"
        @pagination="getImportList"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setScore">确 定</el-button>
        <el-button @click="diaSetScore = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--选择下载文件  begin-->
    <el-dialog :visible.sync="choseDown" class="addsub" title="下载附件" width="900px" @close="closeDown">
      <a v-for="item in fileList" :href="item" download style="margin: 10px;">
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
    <el-dialog :visible.sync="diaFlag" class="addsub" title="查看flag" width="900px" @close="closeDown">
      <p v-for="item in flagList">{{ item }}</p>
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
  deleteJeopardySub,
  getSetScoreList,
  editTaskScore
} from '@/api/match/layered'

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
      ids: [], // 选择的所有表格的项
      tableKey: 0,
      listTotal: 0, // 题目列表总条数
      subTotal: 0, // 导入题目弹窗总条数
      listLoading: false,
      listPage: 1, // 题目列表页码
      subPage: 1, // 导入题目弹窗页码
      topicQuery: {// 习题列表参数
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
      editData: {

      }
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
    getSetScoreList() {
      const params = {}
      params.ids = this.ids
      getSetScoreList(this.$route.query.id, params).then(res => {
        this.diaSetScore = true
        this.setScoreList = res.data

        const data = {}
        res.data.forEach(item => {
          data[item.id] = item.score
        })
        this.editData = JSON.parse(JSON.stringify(data))
      })
    },
    setScore() { // 整体设置分数
      const data = {
        data: this.editData
      }
      editTaskScore(this.$route.query.id, data).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.diaSetScore = false
          this.getList()
        }
      })
    },
    nextStep() {
      this.$emit('nextStep',)
    },
    indexMethod(index) { // 展示序号的方法
      return (this.listQuery.offset - 1) * this.listQuery.limit + index + 1
    },
    backStep() {
      this.$emit('backStep')
    },
    openSence(hash, id, num) { // 开启容器
      this.loading.push(id)
      this.num[id] = 0// 将题目id存储进去，用来判断该题目轮询了多少次
      clearInterval(this.timer[id])
      openSence(hash).then(res => {
        if (res.data.status == 1) {
          this.timer[id] = setInterval(() => {
            this.getSenceStatushash(hash, id, num)
          }, 1000)
        }
      })
    },
    closeLoading(id) { // 清除loading
      this.loading = this.loading.filter(item => {
        return item != id
      })
    },
    getSenceStatushash(hash, id, num) { // 轮询
      this.num[id]++
      if (this.num > 50) { // 如果次数大于50将该题目对应id 的num清零，代表开启失败
        clearInterval(this.timer[id])
        this.num[id] = 0
        this.$message.error('开启失败')
        this.getList(id)
      }
      getSenceStatus(hash).then(res => {
        const { data } = res
        if (data.status == 2) {
          clearInterval(this.timer[id])
          this.getList(id)
          this.$message.success('成功')
        }
      }).catch(error => {
        // 如果出现错误，接口会返回403，所以只好在catch里面操作
        // showError(error);
        if (error.response.status == 403) {
          this.closeLoading(id)
          clearInterval(this.timer[id])
          this.$message.error(error.response.data.message)
        }
      })
    },
    closeSence(hash, id, num) {
      this.loading.push(id)
      deleteSence(hash).then(res => {
        if (res.data.status == 1) {
          // 删除成功，初始化
          if (num) { // 这个num是用来判断进行的操作是重置还是删除。有值为重置，无值为删除。
            this.openSence(hash, id, num)
          } else {
            this.getList(id)
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    showEditScore(score, ind) {
      this.newscore = score
      this.showInput = ind
    },
    sureImportJeopardy() { // 确定导入题目
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
    showtopic() { // 展示导入题目列表
      this.addDlg = true
      this.getTag()
      this.getImportList()
    },
    getImportList() { // 获取导入题目列表
      this.topicQuery.offset = (this.subPage - 1) * this.topicQuery.limit
      fetchJeopardyImport(this.topicQuery).then(res => {
        this.subData = res.data.rows
        this.subTotal = res.data.total
      })
    },
    removeSub() { // 删除题目
      const params = {}
      params.ids = this.ids
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
    closeDown() { // 关闭下载弹框
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
    addTopic() { // 新增赛题
      this.$router.push({
        path: '/competition/addTopic',
        query: { id: this.$route.query.id }
      })
    },
    editTopic(id) { // 编辑题目
      this.$router.push({
        path: '/competition/layered/editMatch/editTopic',
        query: {
          id: this.$route.query.id,
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
        this.subTag = res.data.rows
      })
    },
    getList(id) {
      this.listQuery.offset = (this.listPage - 1) * this.listQuery.limit
      fetchJeopardyTopicList(this.listQuery).then(res => {
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
    checkTable(val) { // 选择表格
      this.ids = val.map(item => {
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
