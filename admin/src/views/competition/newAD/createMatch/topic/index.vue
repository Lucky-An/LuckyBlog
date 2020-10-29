<template>
  <div class="app-container">
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
          :index="indexMethod1"
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
          prop="challenge_type_name"
          label="题目类型"
        />

        <el-table-column
          align="center"
          prop="label_str"
          label="题目标签"
        />

        <el-table-column
          align="center"
          prop="category_cn_name"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
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

    <div class="btn_box topicStep_box">
      <el-button
        type="primary"
        @click="backStep"
      >上一步</el-button>

      <router-link :to="{path:'/competition/newAD/index'}">
        <el-button
          style="margin-left: 10px;"
          type="primary"
        >完成</el-button>
      </router-link>

      <router-link :to="{path:'/competition/newAD/operation',query:{id:id}}">
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
      title="选择题目"
      width="900px"
    >
      <div
        class="clearfix"
        style="margin-bottom: 20px;"
      >
        <el-select
          v-model="topicQuery.label"
          class="filter-item"
          size="mini"
          placeholder="题目标签"
          clearable
        >
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
          placeholder="题目类型"
          clearable
        >
          <el-option
            v-for="(item,ind) in subType"
            :key="ind"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>

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
        <!-- <el-table-column type="index" align="center" width="50"></el-table-column> -->
        <el-table-column
          prop="title"
          align="center"
          label="题目名称"
        />

        <el-table-column
          prop="label_name"
          align="center"
          label="题目标签"
        />

        <el-table-column
          prop="challenge_name"
          align="center"
          label="题目类型"
        />
      </el-table>

      <pagination
        v-show="subTotal>0"
        :total="subTotal"
        :page.sync="subPage"
        :limit.sync="topicQuery.limit"
        style="margin-top:10px;"
        @pagination="getImportList"
      />

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
        :key="item"
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
      <p
        v-for="item in flagList"
        :key="item"
      >{{ item }}</p>
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
} from '@/api/match/newAD'
import { fetchTags, fetchType } from '@/api/itemBank/common'

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
        offset: 0,
        limit: this.$store.state.config.row,
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
    indexMethod1(index) {
      return this.listQuery.offset + index * 1 + 1
    },
    indexMethod2(index) {
      return this.topicQuery.offset + index * 1 + 1
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
    getImportList() {
      // 获取导入题目列表
      this.topicQuery.offset = (this.subPage - 1) * this.topicQuery.limit
      fetchDefenseImport(this.topicQuery).then(res => {
        const { rows, total } = res.data
        this.subData = rows
        this.subTotal = total
        if (this.subTotal <= this.topicQuery.offset && this.subTotal != 0) {
          this.topicQuery.offset =
            this.topicQuery.offset - this.topicQuery.limit
          this.getImportList()
        }
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
        path: '/competition/newAD/editMatch/editTopic',
        query: {
          id: this.$route.query.id,
          task_id: id
        }
      })
    },
    getType() {
      fetchType({ type: 2 }).then(res => {
        this.subType = res.data
      })
      fetchTags({ type: 2 }).then(res => {
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
