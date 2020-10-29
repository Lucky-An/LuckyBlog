<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="monitorData.task_id"
        clearable
        style="vertical-align: top"
        size="mini"
        placeholder="请选择题目名称"
      >
        <el-option
          v-for="item in topicList"
          :key="item.id"
          :value="item.id"
          :label="item.title"
        />
      </el-select>
      <el-select
        v-model="monitorData.id"
        clearable
        style="vertical-align: top"
        size="mini"
        placeholder="请选择选手名称"
      >
        <el-option
          v-for="(item,index) in teamList"
          :key="index"
          :value="item.obj_id"
          :label="item.obj_name"
        />
      </el-select>
      <el-input
        v-model.trim="monitorData.search"
        clearable
        placeholder="请输入选手名称"
        style="width: 200px"
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
    </div>
    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :data="matchList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          :index="indexMethod"
          align="center"
          width="50px"
          label="序号"
          type="index"
        />
        <el-table-column align="center" prop="name" label="选手名称" />

        <el-table-column align="center" prop="title" label="题目名称" />
        <el-table-column align="center" prop="image_name" label="题目镜像" />
        <el-table-column
          align="center"
          prop="expose_ip"
          width="100"
          label="题目IP"
        />

        <el-table-column align="center" prop="solved_count" label="Flag类型">
          <template slot-scope="scope">
            <span>{{ scope.row.flag_type == 0 ? "静态" : scope.row.flag_type == 1 ? "动态" : "随机"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="solved_count" label="Flag查看">
          <template slot-scope="scope">
            <el-button
              :disabled="!scope.row.flag"
              size="mini"
              type="success"
              @click="lookFlag(scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="is_solved"
          width="100"
          label="解答状态"
        />
        <el-table-column align="center" prop="solved_count" label="远程监控">
          <template slot-scope="scope">
            <el-button
              :disabled="!scope.row.lvp_remote_desktop"
              size="mini"
              type="primary"
              @click="lookRemote(scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="footer">
      <pagination
        v-show="listTotal > 0"
        :total="listTotal"
        :page.sync="monitorData.page"
        :limit.sync="monitorData.per_page"
        @pagination="getList"
      />
    </div>
    <el-dialog
      :visible.sync="showFlag"
      title="查看Flag"
      width="30%"
      @close="resetFlag"
    >
      <el-form label-width="80px">
        <el-form-item label="题目名称:">
          <span>{{ lookFlagData.name }}</span>
        </el-form-item>
        <el-form-item label="Flag:">
          <span>{{ lookFlagData.flag }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  getMonitorList,
  getAllTipick,
  getAllPlayer
} from '@/api/match/jeopardy'

export default {
  name: 'Index',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      params: { event_id: this.$route.query.id },
      monitorData: {
        evt_hash: this.$route.query.hash,
        id: '',
        task_id: '',
        search: '',
        per_page: 10,
        page: 1
      },
      matchList: [], //
      teamList: [], // 所有队伍
      topicList: [], // 所有队伍
      listTotal: 0,
      listPage: 1,
      scorePage: 1,
      scoreQuery: {
        order: 'asc',
        event: '',
        user: ''
      },
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row,
        search: '',
        order: 'asc',
        event: this.$route.query.id
      },
      lookFlagData: {
        name: '',
        flag: ''
      },
      showFlag: false
    }
  },
  created() {
    this.getList()
    this.getTopic()
    this.getTeam()
  },
  methods: {
    resetFlag() {
      this.lookFlagData = { name: '', flag: '' }
    },
    lookFlag(row) {
      this.showFlag = true
      this.lookFlagData.name = row.title
      this.lookFlagData.flag = row.flag
    },
    lookRemote(row) {
      window.open(row.lvp_remote_desktop)
    },
    getTopic() {
      getAllTipick({ evt_hash: this.$route.query.hash }).then((res) => {
        this.topicList = res.data.data
      })
    },
    getTeam() {
      getAllPlayer({ evt_hash: this.$route.query.hash }).then((res) => {
        this.teamList = res.data.data
      })
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listPage - 1) * this.listQuery.limit + index + 1
    },
    handleSelectionChange(val) {
      this.userId = val
    },
    getList(page) {
      if (typeof page === 'number') this.monitorData.page = page
      getMonitorList(this.monitorData).then((res) => {
        if (res.data.success !== false) {
          this.matchList = res.data.data
        }
      })
    }
  }
}
</script>

<style scoped>
.footer {
  position: relative;
  min-height: 50px;
}

.btnBox {
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  right: 16px;
  top: 0;
}
</style>
