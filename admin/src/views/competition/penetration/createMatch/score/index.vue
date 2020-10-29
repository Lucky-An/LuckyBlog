<template>
  <div class="app-container">
    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :data="dataList"
        border
      >
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column
          align="center"
          prop="title"
          label="题目名称"
        />
        <el-table-column
          align="center"
          label="题目类型"
        >
          <template slot-scope="scope">{{ topicType[scope.row.challenge_type - 1] }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="题目难度"
        >
          <template slot-scope="scope">{{ levelMap[scope.row.level] }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="题目属性"
        >
          <template slot-scope="scope">{{ serverTypeMap[scope.row.server_type] }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="image_name"
          label="镜像名称"
        />
        <el-table-column
          align="center"
          prop="flag_num"
          label="Flag 数量"
        />
        <el-table-column
          align="center"
          prop="score"
          label="总分值"
        />

        <el-table-column
          v-if="integral_mode === 1"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleConfig(scope.row)"
            >设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="btn_box topicStep_box">
      <el-button
        type="primary"
        @click="backStep"
      >上一步</el-button>
      <el-button
        type="primary"
        @click="handleDone"
      >完成</el-button>
      <router-link
        :to="{
          path:'/competition/penetration/operation/index',
          query:{id}
        }"
        style="margin-left: 10px;"
      >
        <el-button type="warning">竞赛运维</el-button>
      </router-link>

    </div>

    <!--选题弹窗-->
    <el-dialog
      :visible.sync="dialogVisible"
      title="设置分值"
      width="900px"
      @close="handleClose"
    >
      <el-form
        v-loading="loading"
        :model="formData"
        style="text-align:left;"
      >
        <el-form-item label="题目名称">{{ formData.title }}</el-form-item>
        <el-form-item label="题目类型">{{ topicType[formData.challenge_type - 1] }}</el-form-item>
        <el-form-item label="题目难度">{{ levelMap[formData.level] }}</el-form-item>
        <el-form-item label="题目属性">{{ serverTypeMap[formData.server_type] }}</el-form-item>
        <el-form-item label="计分方式">{{ integralMap[formData.integral_mode] }}</el-form-item>
        <el-form-item label="Flag 说明">
          <el-table
            :data="formData.flags"
            border
          >
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="50"
            />
            <el-table-column
              align="center"
              label="Flag类型"
            >
              <template slot-scope="scope">{{ flagMap[scope.row.flag_type] }}</template>
            </el-table-column>

            <el-table-column
              align="center"
              prop="content"
              label="考点备注"
            />

            <el-table-column
              align="center"
              label="分值设置"
            >
              <!-- <template slot-scope="scope">{{ scope.row.score }}</template> -->
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.score" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="handleScore"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import {
  getScoreList,
  fetchPenetrationInfo,
  getChallengeEventFlags,
  submitScore
} from '@/api/match/penetration'

export default {
  name: 'TopicManagement',

  directives: { waves },

  data() {
    const levelMap = ['初级', '中级', '高级']
    const serverTypeMap = ['非跳板机 ', '跳板机']
    const topicType = ['Web', 'Pwn', '实体设备']
    const integralMap = ['', '累加计分', '动态计分']
    const flagMap = ['Flag', '静态 Flag', '动态 Flag']
    return {
      id: this.$route.query.id,
      integral_mode: '',
      listLoading: false,
      dataList: [],
      dialogVisible: false,
      levelMap,
      serverTypeMap,
      topicType,
      formData: {
        title: '',
        challenge_type: '',
        level: '',
        server_type: '',
        integral_mode: '',
        flags: []
      },
      loading: false,
      integralMap,
      flagMap
    }
  },

  created() {
    (async() => {
      await this.getInfo()
      await this.getList()
    })()
  },

  methods: {
    getInfo() {
      // 获取比赛详情
      return fetchPenetrationInfo(this.id).then(res => {
        const { data } = res
        this.integral_mode = data.integral_mode
      })
    },

    getList() {
      return getScoreList({
        event_id: this.id,
        integral_type: this.integral_mode
      }).then(res => {
        const { data } = res
        this.dataList = data.rows
      })
    },

    handleConfig({ hash }) {
      this.loading = true
      this.dialogVisible = true
      getChallengeEventFlags({
        challenge_hash: hash
      }).then(res => {
        const { data } = res
        if (data.success) {
          for (const key in this.formData) {
            this.formData[key] = data.rows[key]
          }
          this.loading = false
        }
      })
    },

    handleClose() {
      for (const key in this.formData) {
        if (key === 'flags') {
          this.formData[key] = []
        } else {
          this.formData[key] = ''
        }
      }
    },

    handleScore() {
      const data = {
        scores: {}
      }
      this.formData.flags.forEach(el => {
        data.scores[el.flag_hash] = el.score
      })
      submitScore(data).then(res => {
        const { data } = res
        if (data.success) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.dialogVisible = false
          this.getList()
        }
      })
    },

    handleDone() {
      this.$router.push({
        path: '/competition/penetration/index'
      })
    },

    backStep() {
      this.$emit('backStep')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  text-align: center;
  .btn_box {
    display: inline-block;
    margin-top: 20px;
  }
}
</style>

