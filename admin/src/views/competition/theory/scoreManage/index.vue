<template>
  <div class="competition_box">
    <div class="manageTip">
      <div class="title">管理提示:</div>
      <div>
        <p>
          1.竞赛平台提供手动批量发卷功能。
        </p>
        <p>
          2.竞赛开始前请执行【批量发卷】，系统将依据试卷最终确认的题目进行批量分发，检测和查验操作。试卷题目、参赛人员的变动请务必重复此操作进行竞赛数据的更新。
        </p>
        <p>
          3.竞赛结束后请执行【核查积分】，系统将对已登录的全部用户成绩再次进行查验，核算总分。
        </p>
      </div>
    </div>
    <!--表格搜索 begin-->
    <div class="filter-container">
      <el-button
        v-waves
        class="filter-item"
        size="mini"
        type="warning"
        @click="generation"
      >批量发卷
      </el-button>

      <el-button
        v-waves
        class="filter-item"
        size="mini"
        type="danger"
        @click="forceSubmit"
      >核查积分
      </el-button>

      <div
        style="
          display: inline-block;
          width: 4px;
          height: 28px;
          background-color: #bdbdbd;
          vertical-align: top;
          margin: 0 20px;
        "
      />

      <el-input
        v-model.trim="listQuery.search"
        size="mini"
        placeholder="请输入账号"
        style="width: 200px"
        class="filter-item"
      />
      <el-button
        v-waves
        class="filter-item"
        size="mini"
        type="primary"
        @click="getList"
      >搜索
      </el-button>

      <div style="float: right">
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          size="mini"
          @click="canExport"
        >批量导出试卷</el-button
        >

        &nbsp;

        <a
          :href="'/api/v1/theory/admin/evts/' + hash + '/scores/users/export/'"
          download
        >
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            size="mini"
          >批量导出成绩</el-button
          >
        </a>
      </div>
    </div>

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
      <!--<el-table-column-->
      <!--align="center"-->
      <!--type="selection"/>-->
      <el-table-column
        :index="indexMethod"
        align="center"
        type="index"
        width="50"
        label="序号"
      />
      <el-table-column align="center" prop="obj_uname" label="账号" />

      <el-table-column align="center" prop="obj_name" label="昵称" />

      <el-table-column align="center" prop="sum_score" label="分数" />

      <el-table-column align="center" prop="max_time" label="交卷时间" />

      <el-table-column align="center" prop="end_time" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status == 1 ? "已提交" : "未提交" }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            v-waves
            v-if="!scope.row.is_sponsor"
            class="filter-item"
            size="mini"
            type="success"
            @click="inspect(scope.row)"
          >检查
          </el-button>
          <a
            v-if="scope.row.status"
            :href="
              '/api/v1/theory/admin/evts/' +
                hash +
                '/scores/users/' +
                scope.row.obj_id +
                '/export/'
            "
            download
          >
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="warning"
            >导出
            </el-button>
          </a>
        </template>
      </el-table-column>
    </el-table>

    <!--分页 begin-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  scoreList,
  fetchJeopardyInfo,
  fetchUserList,
  forceSubmit,
  generation,
  inspect,
  exportAll,
  pollingDownPdf
} from '@/api/match/theory'
import { Loading } from 'element-ui'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { setStorage } from '@/utils/storage'

export default {
  name: 'IndexVue',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      hash: this.$route.query.hash, // 竞赛id
      tableKey: 0,
      total: 0,
      listLoading: false,
      page: 1,
      userGroup: {}, // 用户分组
      listQuery: {
        search: '', // 竞赛名称
        limit: this.$store.state.config.row,
        offset: 0
      },
      matchList: [],
      ids: [], // 选中的表格id
      timer: null,
      num: 0, // 新增镜像时候轮次的次数
      loadingId: null, // 存储loadingID
      exportTime: 0
    }
  },
  created() {
    this.getList()
    this.getUserGroup()
    // 获取比赛信息用以展示在面包屑
    if (this.$route.query.hash) {
      fetchJeopardyInfo(this.$route.query.hash).then((res) => {
        this.$store.dispatch('changeMatchName', res.data.name_zh)
      })
    }
  },
  beforeDestroy() {
    // 离开时清除面包屑面包屑
    this.$store.dispatch('changeMatchName', '')
  },
  methods: {
    canExport() {
      // 是否可以导入pdf
      exportAll(this.hash, { time: true }).then((res) => {
        if (res.data.success) {
          this.exportTime = res.data.time_num
          if (res.data.path) {
            window.location.href = res.data.path
          } else {
            this.exportAll()
          }
        }
      })
    },
    exportAll() {
      this.$confirm(
        `文档导出过程需要${this.exportTime}~${
          this.exportTime + 2
        }分钟，请您耐心等待。`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.loadingId = Loading.service({
            lock: true,
            text: '保存中',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          exportAll(this.hash).then((res) => {
            if (res.data.success) {
              this.timer = setInterval(() => {
                this.pollingDownPdf()
              }, 1000)
            } else {
              this.loadingId.close()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    pollingDownPdf() {
      pollingDownPdf(this.hash).then((res) => {
        if (res.data.success && res.data.path) {
          this.loadingId.close()
          clearInterval(this.timer)
          window.location.href = res.data.path
        } else if (!res.data.success) {
          this.loadingId.close()
          clearInterval(this.timer)
        }
        this.num++
      })
    },
    generation() {
      // 分发试卷
      this.$confirm('确认分发试卷？')
        .then((_) => {
          generation(this.hash).then((res) => {
            if (res.data.success) {
              this.$message.success('分发试卷成功')
              this.getList()
            }
          })
        })
        .catch((_) => {})
    },
    forceSubmit() {
      // 强制交卷
      this.$confirm('确认强制交卷？')
        .then((_) => {
          forceSubmit(this.hash).then((res) => {
            if (res.data.success) {
              this.getList()
              this.$message.success('强制交卷成功')
            }
          })
        })
        .catch((_) => {})
    },
    inspect(row) {
      // 检查成绩
      this.$router.push({
        path: '/competition/theory/inspect',
        query: {
          hash: this.hash,
          id: row.obj_id
        }
      })
    },
    getUserGroup() {
      // 获取用户分组
      fetchUserList(this.hash).then((res) => {
        this.userGroup = res.data.data
      })
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.page - 1) * this.listQuery.limit + index + 1
    },
    getList() {
      // 获取表格
      this.listQuery.offset = this.page
      scoreList(this.hash, this.listQuery).then((res) => {
        this.matchList = res.data.rows
        this.total = res.data.total

        // if(this.total<=this.listQuery.offset&&this.total!=0){
        //   this.listQuery.offset=this.listQuery.offset-this.listQuery.limit;
        //   this.getList()
        // }
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
.competition_box {
  padding: 0 20px;
}

.manageTip {
  background: #f6f6f6;
  padding: 10px;
  display: flex;
  margin-bottom: 20px;
}

.manageTip .title {
  font-size: 20px;
  margin-right: 10px;
}

.manageTip p {
  margin: 3px;
}
</style>
