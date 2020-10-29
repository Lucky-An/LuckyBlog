<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-select v-model="listQuery.type" class="filter-item" size="mini" placeholder="比赛公告">-->
      <!--<el-option label="全部题目状态" value=""/>-->
      <!--<el-option :value="2" label="查看黑盒安全测试题目"/>-->
      <!--<el-option :value="1" label="查看白盒安全测试题目"/>-->
      <!--</el-select>-->
      <el-input
        v-model="listQuery.search"
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
      <el-button type="success" size="mini" @click="getImportList">
        导入题目</el-button
        >
      <el-button type="danger" size="mini" @click="removeSub"> 删除</el-button>

      <!--<el-button type="success" size="mini" @click="publicSub"> 题目公开</el-button>-->
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
        @selection-change="checkTable"
      >
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

        <el-table-column align="center" prop="score" label="分值" />

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

    <el-dialog
      :visible.sync="addDlg"
      class="addsub"
      title="选择题目"
      width="900px"
      @close="handleClose"
    >
      <el-table
        :data="subData"
        border
        style="width: 100%; margin-bottom: 10px"
        @selection-change="handleChange"
      >
        <el-table-column align="center" type="selection" />

        <el-table-column
          :index="(subPage - 1) * topicQuery.limit + 1"
          align="center"
          type="index"
          width="50"
          label="序号"
        />

        <el-table-column prop="title" label="题目名称" align="center" />
        <el-table-column prop="category_name" label="题目类别" align="center" />
        <el-table-column prop="score" label="分值" align="center" />
      </el-table>

      <pagination
        v-show="subTotal > 0"
        :total="subTotal"
        :page.sync="subPage"
        :limit.sync="topicQuery.limit"
        @pagination="getImportList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureImport">确 定</el-button>
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
  fetchTopicList,
  sureImport,
  fetchImportList,
  publicSub,
  deleteSub,
  openSence,
  deleteSence,
  getSenceStatus
} from '@/api/match/realWord'

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
        offset: 1,
        limit: this.$store.state.config.row
      },
      importData: {
        event: this.$route.query.id,
        hashs: []
      },
      hash: this.$route.query.hash,
      listQuery: {
        search: '',
        offset: 0,
        limit: this.$store.state.config.row,
        type: ''
      },
      showInput: -1,
      timer: {},
      num: {}, // 轮询次数
      loading: []
    }
  },
  created() {
    this.getList()
  },
  beforeDestroy() {
    for (const key in this.timer) {
      clearInterval(this.timer[key])
    }
  },
  methods: {
    indexMethod(index) {
      // 展示序号的方法
      return (this.listQuery.offset - 1) * this.listQuery.limit + index + 1
    },
    backStep() {
      this.$emit('backStep')
    },
    openSence(hash, id, num) {
      // 开启容器
      this.loading.push(id)
      this.num[id] = 0 // 将题目id存储进去，用来判断该题目轮询了多少次
      clearInterval(this.timer[id])
      openSence(hash).then((res) => {
        if (res.data.status == 1) {
          this.timer[id] = setInterval(() => {
            this.getSenceStatushash(hash, id, num)
          }, 1000)
        }
      })
    },
    closeLoading(id) {
      // 清除loading
      this.loading = this.loading.filter((item) => {
        return item != id
      })
    },
    getSenceStatushash(hash, id, num) {
      // 轮询
      this.num[id]++
      if (this.num > 50) {
        // 如果次数大于50将该题目对应id 的num清零，代表开启失败
        clearInterval(this.timer[id])
        this.num[id] = 0
        this.$message.error('开启失败')
        this.getList(id)
      }
      getSenceStatus(hash)
        .then((res) => {
          const { data } = res
          if (data.status == 2) {
            clearInterval(this.timer[id])
            this.getList(id)
            this.$message.success('成功')
          }
        })
        .catch((error) => {
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
      deleteSence(hash).then((res) => {
        if (res.data.status == 1) {
          // 删除成功，初始化
          if (num) {
            // 这个num是用来判断进行的操作是重置还是删除。有值为重置，无值为删除。
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
    sureImport() {
      // 确定导入题目
      sureImport(this.hash, this.importData).then((res) => {
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
    getImportList() {
      // 获取导入题目列表
      this.topicQuery.offset = this.subPage
      fetchImportList(this.topicQuery, this.hash).then((res) => {
        if (res.data.success) {
          this.addDlg = true
          this.subData = res.data.rows
          this.subTotal = res.data.total
        }
      })
    },
    removeSub() {
      // 删除题目
      const params = {}
      params.hashs = this.hashs
      if (this.hashs.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSub(this.hash, params).then((res) => {
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
      params.hashs = this.hashs
      params.public = 1
      publicSub(this.hash, params).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    hideSUb() {
      // 隐藏题目
      const params = {}
      params.hashs = this.hashs
      params.public = 0
      publicSub(this.hash, params).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
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
    editTopic(id) {
      // 编辑题目
      this.$router.push({
        path: '/competition/rw/operation/editTopic',
        query: {
          hash: this.$route.query.hash,
          task_id: id
        }
      })
    },

    getList(id) {
      this.listQuery.offset = this.listPage
      fetchTopicList(this.hash, this.listQuery).then((res) => {
        if (id) this.closeLoading(id)
        const { data } = res
        this.matchList = data.rows
        this.listTotal = data.total
      })
    },
    checkTable(val) {
      // 选择表格
      this.hashs = val.map((item) => {
        return item.hash
      })
    },

    handleClose() {
      this.subPage = 1
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
