<template>
  <div class="ad_topic app-container">
    <!--第一步-->
    <div>
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
          <el-table-column align="center" prop="title" label="题目名称" />
          <el-table-column align="center" prop="image_name" label="镜像名称" />
          <el-table-column align="center" label="题目部署" width="300px">
            <template slot-scope="scope">
              <el-button
                v-waves
                class="filter-item"
                size="mini"
                type="success"
                @click="deployStatus(scope.row, 1)"
              >开机
              </el-button>
              <el-button
                v-waves
                class="filter-item"
                size="mini"
                type="danger"
                @click="deployStatus(scope.row, 2)"
              >关机
              </el-button>
              <el-button
                v-waves
                class="filter-item"
                size="mini"
                type="primary"
                @click="deployStatus(scope.row, 3)"
              >重置
              </el-button>
              <!--<el-button-->
              <!--v-waves-->
              <!--class="filter-item"-->
              <!--size="mini"-->
              <!--type="primary"-->
              <!--@click="upLoadFlag(scope.row)">上传flag-->
              <!--</el-button>-->
            </template>
          </el-table-column>
          <el-table-column align="center" label="部署情况">
            <template slot-scope="scope">
              <el-button
                v-waves
                class="filter-item"
                size="mini"
                type="primary"
                @click="showDeploy(scope.row)"
              >查看
              </el-button>
            </template>
          </el-table-column>

          <el-table-column align="center" label="开题部署" width="140px">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="2"
                :inactive-value="1"
                active-text="开题"
                inactive-text="关题"
                @change="opentTopic(scope.row)"
              />
            </template>
          </el-table-column>
          <!--<el-table-column align="center" label="下拉镜像">-->
          <!--<template slot-scope="scope">-->
          <!--<el-button-->
          <!--v-waves-->
          <!--class="filter-item"-->
          <!--size="mini"-->
          <!--type="primary"-->
          <!--@click="pullImage(scope.row)"-->
          <!--&gt;下拉-->
          <!--</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </div>

      <div class="footer">
        <!--<pagination-->
        <!--v-show="listTotal>0"-->
        <!--:total="listTotal"-->
        <!--:page.sync="listPage"-->
        <!--:limit.sync="listQuery.limit"-->
        <!--@pagination="getList"/>-->
        <!--<div class="btnBox">-->
        <!--<el-button type="primary" @click="step=2">下一步</el-button>-->
        <!--</div>-->
      </div>
    </div>

    <!--第二步-->
    <div v-if="step == 2">
      <el-alert
        title="题目部署情况运维"
        type="info"
        effect="dark"
        @close="step = 1"
      >
        <div class="filter-container">
          <!--表格 begin-->
          <el-table
            :data="deployList"
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
            <el-table-column align="center" prop="team_name" label="选手名称" />
            <!-- <el-table-column
              align="center"
              prop="team_name"
              label="昵称"
            /> -->
            <el-table-column
              align="center"
              prop="challenge_name"
              label="题目名称"
            />
            <el-table-column align="center" prop="status" label="部署状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 1">未创建</span>
                <span v-if="scope.row.status == 2">创建失败</span>
                <span v-if="scope.row.status == 3">创建成功</span>
                <span v-if="scope.row.status==4">运行中</span>
                <span v-if="scope.row.status==5">关闭</span>
                <span v-if="scope.row.status==6">错误</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="重新部署" width="230">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="deployStatus(scope.row, 3)"
                >重新部署</el-button
                >
                <!--<el-button type="primary"  @click="upLoadFlag(scope.row)" size="mini">上传flag</el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="footer">
          <pagination
            v-show="listTotal > 0"
            :total="listTotal"
            :page.sync="listPage"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          />
        </div>
      </el-alert>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  defenseFetchTopicList,
  defenseOpenTopic,
  showDefenseDeploy,
  defenseDeployStatus,
  defenseDeployUpload,
  pullImage
} from '@/api/match/DevOps'

export default {
  name: 'Index',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      value1: 0, // 开关题
      params: { event_id: this.$route.query.id },
      challenge_id: '',
      matchList: [],
      deployList: [],
      step: 1,
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
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    pullImage(row) {
      // 下拉镜像
      pullImage(this.params, { challenge_id: row.challenge_id }).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    // upLoadFlag(row) {//上传pushflag脚本
    //   let data = {
    //     team_id: row.team_id || 0,
    //     challenge_id: row.challenge_id || this.challenge_id
    //   }
    //   defenseDeployUpload(this.params, data).then(res => {
    //     if (res.data.success) {
    //       this.$message.success('操作成功')
    //       this.getList()
    //     }
    //   })
    // },
    deployStatus(row, a) {
      // 设置部署
      const data = {
        team_id: row.team_id || 0,
        challenge_id: row.challenge_id || this.challenge_id,
        action: a
      }
      defenseDeployStatus(this.params, data).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    showDeploy(row) {
      // 查看部署情况
      if (row) this.challenge_id = row.challenge_id

      showDefenseDeploy({
        event_id: this.params.event_id,
        challenge_id: this.challenge_id
      }).then((res) => {
        this.step = 2
        this.deployList = res.data
      })
    },
    opentTopic(row) {
      // 开关题
      defenseOpenTopic(this.params, {
        challenge_id: row.challenge_id,
        action: row.status
      }).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listPage - 1) * this.listQuery.limit + index + 1
    },

    handleSelectionChange(val) {
      this.userId = val
    },
    getList() {
      defenseFetchTopicList(this.params).then((res) => {
        this.matchList = res.data
        // this.listTotal = res.data.total
      })
      if (this.step == 2) {
        this.showDeploy()
      }
    },
    checkTable() {
      // 选择表格
    }
  }
}
</script>

<style scoped>
.footer {
  position: relative;
  min-height: 50px;
}

.header {
  position: relative;
  min-height: 50px;
  display: flex;
  align-items: center;
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
<style>
.ad_topic .el-alert__content {
  width: 100%;
}

.ad_topic .el-alert__content .el-table {
  margin-top: 20px;
}
</style>
