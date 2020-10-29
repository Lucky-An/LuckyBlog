<template>
  <div class="match_box">
    <div class="filter-container">
      <div class="serchleft">
        <el-select
          v-model="listQuery.team_id"
          class="filter-item"
          size="mini"
          clearable
          :placeholder="$t('team.search.placeholder')"
        >
          <el-option v-for="(item, ind) in teams" :key="ind" :label="item.name" :value="item.id" />
        </el-select>
        <el-select
          v-model="listQuery.challenge_id"
          class="filter-item"
          size="mini"
          clearable
          :placeholder="$t('team.search.topicplaceholder')"
        >
          <el-option
            v-for="(item, ind) in tasks"
            :key="ind"
            :label="item.challenge_name"
            :value="item.challenge_id"
          />
        </el-select>
        <el-button class="filter-item" type="primary" size="mini" @click="getList($event,1)">{{ $t('team.search.btn') }}</el-button>

        <el-button
          type="primary"
          size="mini"
          class="goback"
          @click="goback"
        >{{ $t('task.returnView') }}</el-button>

        <el-button
          type="primary"
          size="mini"
          class="goback"
          @click="downloadFile"
        >{{ $t('attack.question_board.download_info') }}</el-button>

      </div>
    </div>

    <!--表格 begin-->
    <el-table :data="matchList">
      <el-table-column
        align="center"
        :label="$t('team.table.order')"
        type="index"
        :index="indexMethod"
        width="60px"
      />
      <el-table-column align="center" prop="nickname" :label="$t('team.table.team')" />

      <el-table-column
        v-for="(item,index) in keylist"
        :key="index"
        align="center"
        :prop="item"
        :label="item"
      />
    </el-table>
    <!--分页 begin-->
    <pagination
      :total="listTotal"
      :page.sync="listQuery.offset"
      :limit.sync="listQuery.limit"
      layout="prev, pager, next"
      @pagination="getList"
    />
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import { getChallengeIp, getEventTeam, challenge_data } from '@/api/attack'
import { downloadFile } from '@/api/common'
import { checkFileAvailable } from '@/utils/download'

export default {
  name: 'QuestionBoard',
  components: {
    pagination
  },
  data() {
    return {
      teams: [], // 队伍列表
      tasks: [], // 题目列表
      matchList: [],
      listTotal: 0, // 列表总条数
      keylist: [],
      vallist: [],
      listQuery: {
        event_id: this.$route.query.id,
        team_id: '',
        challenge_id: '',
        offset: 1,
        limit: 10
      }
    }
  },
  computed: {},
  created() {
    this.teamsType()
    this.getTaskData()
    this.getList()
  },
  methods: {
    changePagina(val) {
      this.listQuery.offset = (val.page - 1) * this.listQuery.limit
      this.getList()
    },
    getradar() {
      this.getList()
    },
    // 展示序号的方法
    indexMethod(index) {
      return (this.listQuery.offset - 1) * this.listQuery.limit + index + 1
    },
    // 获取队伍列表
    teamsType() {
      const data = {
        event_id: this.$route.query.id
      }
      getEventTeam(data).then((res) => {
        this.teams = res.data.data
      })
    },

    // 题目列表
    getTaskData() {
      challenge_data({
        event_id: this.$route.query.id
      })
        .then((res) => {
          if (!res.data.message) {
            this.tasks = res.data
          }
        })
        .catch((res) => {})
    },
    // 返回
    goback() {
      history.back()
    },
    // 登陆控制台
    console(id) {
      this.$router.push({
        path: '/tool/toolRedact',
        query: {
          uuid: id
        }
      })
    },
    // 获取列表
    getList(e, i) {
      // // 搜索时重置到第一页。
      if (i) this.listQuery.offset = 1
      getChallengeIp(this.listQuery).then((res) => {
        if (res.data.success) {
          this.keylist = res.data.challenge_list

          this.matchList = res.data.row
          this.listTotal = res.data.total
        }
      })
    },
    // 下载题目附件
    downloadFile(params, name) {
      downloadFile('/api/v1/att_def/web/api/download_message/', { event_id: this.$route.query.id }).then((res) => {
        checkFileAvailable(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.match_box {
  padding: 0 200px;
}
.el-select {
  margin-right: 10px;
}
.serchleft {
  margin: 20px 0;
}
.goback {
  float: right;
}
</style>

