<template>
  <div class="taskcon">
    <!-- 调用倒计时 -->
    <PlayerInfo style="margin-top: 30px" :show-round="true" />
    <div class="listcon" />
    <card>
      <div slot="task_body" slot-scope="scope">
        <div
          class="status"
          :class="{
            status1: scope.now_item.status == 1,
            status2: scope.now_item.status == 2,
            status3: scope.now_item.status == 3,
            status4: scope.now_item.status == 4,
            status5: scope.now_item.status == 5,
          }"
        >
          <span v-if="scope.now_item.status == 5" class>
            <!--异常-->
            <img src="@/assets/attack/icon5.png" alt class="img_status">
          </span>
          <span v-if="scope.now_item.status == 4" class>
            <!--异常-->
            <img src="@/assets/attack/icon4.png" alt class="img_status">
          </span>
          <span v-if="scope.now_item.status == 3" class>
            <!--异常-->
            <img src="@/assets/attack/icon3.png" alt class="img_status">
          </span>
          <span v-if="scope.now_item.status == 2">
            <!--正常-->
            <img src="@/assets/attack/icon2.png" alt class="img_status">
          </span>
          <span v-if="scope.now_item.status == 1">
            <!--未开放-->
            <img src="@/assets/attack/icon1.png" alt class="img_status">
          </span>
          <div
            class="path_button"
            :class="{
              cando: scope.now_item.status == 2 || scope.now_item.status == 3,
              notdo:
                scope.now_item.status == 1 ||
                scope.now_item.status == 4 ||
                scope.now_item.status == 5,
            }"
            @click="submit_path_box(scope.now_item)"
          >
            {{ $t("attack.question_board.submit_path") }}
          </div>
          <div v-if="scope.now_item.status == 1" class="look_something">
            <span style="cursor: not-allowed">{{
              $t("attack.question_board.download_file")
            }}</span>
            <br>
            <span class="fanga" style="cursor: not-allowed">{{
              $t("attack.question_board.look_packages")
            }}</span>
            <br>
            <span class="fanga" style="cursor: not-allowed">{{
              $t("attack.question_board.look_path")
            }}</span>
          </div>
          <div v-else class="look_something">
            <a
              :href="
                api.get_attachment +
                  '?event_id=' +
                  match_id +
                  '&challenge_id=' +
                  scope.now_item.challenge_id
              "
              download
            >{{ $t("attack.question_board.download_file") }}</a>
            <br>
            <span class="fanga" @click="view_flow(scope.now_item, 0)">{{
              $t("attack.question_board.look_packages")
            }}</span>
            <br>
            <span class="fanga" @click="view_path(scope.now_item, 0)">{{
              $t("attack.question_board.look_path")
            }}</span>
          </div>
        </div>
      </div>
    </card>
    <ClickHere :mac="false" />

    <!--提交补丁查看弹框-->
    <el-dialog
      class="my-dialog view_path view_flow"
      width="900px"
      :title="
        now_look.challenge_name + $t('attack.question_board.paths.submit_path')
      "
      :visible.sync="path_visible"
    >
      <el-table
        id="view_flow_table"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column label=" " type="index" width="50" />
        <el-table-column
          prop="name"
          :label="$t('attack.question_board.path_table.submitter')"
          width="120"
        />
        <el-table-column
          prop="round"
          :label="$t('attack.question_board.path_table.submit_file')"
        />
        <el-table-column
          prop="create_time"
          :label="$t('attack.question_board.path_table.submit_time')"
          width="180"
        />
        <el-table-column
          prop="status"
          :label="$t('attack.question_board.path_table.submit_status')"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status == 4" style="color: #337aff">{{
              $t("attack.question_board.paths.success")
            }}</span>
            <span v-else-if="scope.row.status == 0" style="color: #ce091e">{{
              $t("attack.question_board.paths.undetected")
            }}</span>
            <span v-else style="color: #ce091e">{{
              $t("attack.question_board.paths.fail")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="md5value"
          :label="$t('attack.question_board.path_table.md5')"
        />
      </el-table>
      <div style="text-align: center; margin-top: 15px">
        <pagination
          v-show="pager.total > pager.pageSize"
          :total="pager.total"
          :page.sync="pager.currentPage"
          :limit.sync="pager.pageSize"
          :layout="pager.layout"
          @pagination="view_path(now_look, 1)"
        />
      </div>
    </el-dialog>

    <!--流量包查看弹框-->
    <el-dialog
      class="my-dialog view_flow"
      width="700px"
      :title="
        now_look.challenge_name + $t('attack.question_board.paths.look_flow')
      "
      :visible.sync="flow_visible"
    >
      <el-table
        id="view_flow_table"
        :data="flowData"
        style="width: 100%"
        border
      >
        <el-table-column label=" " type="index" width="100" />
        <el-table-column
          prop="file"
          :label="$t('attack.question_board.flow_table.flow_file')"
        />
        <el-table-column
          prop="time"
          :label="$t('attack.question_board.flow_table.open_time')"
          width="180"
        />
        <el-table-column
          prop="download"
          :label="$t('attack.question_board.flow_table.download')"
          width="140"
        >
          <template slot-scope="scope">
            <span style="color: #337aff">
              <a
                :href="
                  api.get_tcp +
                    '?event_id=' +
                    match_id +
                    '&challenge_id=' +
                    now_look.challenge_id +
                    '&packages=' +
                    scope.row.file
                "
                :download="scope.row.file"
                style="color: #3160ca"
              >{{ $t("attack.question_board.paths.download") }}</a>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 15px">
        <pagination
          v-show="pager.total > pager.pageSize"
          :total="pager.total"
          :page.sync="pager.currentPage"
          :limit.sync="pager.pageSize"
          :layout="pager.layout"
          @pagination="view_flow(now_look, 1)"
        />
      </div>
    </el-dialog>

    <el-dialog
      class="my-dialog submit_flag"
      width="720px"
      :title="
        now_look.challenge_name + $t('attack.question_board.paths.path_list')
      "
      :visible.sync="flag_visible"
      center
    >
      <el-form>
        <el-form-item
          :label="$t('attack.question_board.paths.path_list') + ':'"
        >
          <div class="select_path">
            <el-button type="primary">{{
              $t("selfHelp_competition.chose_file")
            }}</el-button>
            <input id type="file" name @change="changeTpc">
          </div>
          {{ file_name }}
        </el-form-item>

        <el-form-item :label="$t('attack.question_board.paths.rule') + ':'">{{
          path_rules
        }}</el-form-item>
      </el-form>

      <span slot="footer" class="submit_handle">
        <el-button
          size="small"
          type="primary"
          class="confirm_btn"
          @click="submitTcp"
        >
          {{ $t("question.submit")
          }}<!--提交-->
        </el-button>

        <el-button
          size="small"
          class="cancel_btn"
          @click="flag_visible = false"
        >
          {{ $t("modal.cancel") }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PlayerInfo from '@/components/PlayerInfo'
import ClickHere from '@/components/ClickHere'
import pagination from '@/components/pagination'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('match')
import card from './card'

// import menuNav from '@/components/match/common/small_part/challenge_menu.vue'

import {
  patch_rule,
  submitApath,
  get_attachment,
  get_tcp,
  tcpdumpStatus,
  getPathData
} from '@/api/newAD'
export default {
  name: 'QuestionBoard',
  components: {
    PlayerInfo,
    card,
    ClickHere,
    pagination
    // questionBoard,
    // menuNav
  },
  data() {
    return {
      // download_task_info:download_task_info + "?event_id=" + this.$route.query.event,
      api: {
        get_attachment,
        get_tcp
      },
      task_data: [],
      flag_data: {},
      attack_data: [],
      match_id: this.$route.query.id,
      getDataTimer: null,
      now_look: '',
      flag_visible: false,
      file_name: '',
      path_rules: '',
      flow_visible: false,
      path_visible: false,
      flowData: [],
      pager: {
        // 页码
        currentPage: 1, // 当前第几页
        pageSize: 5, // 每页多少条
        total: 0, // 总共多少条
        layout: 'prev, pager, next'
      },
      tableData: []
    }
  },
  computed: {
    ...mapState(['userInformation', 'team_data'])
  },
  beforeDestroy() {
    clearInterval(this.getDataTimer)
  },
  methods: {
    submit_path_box(item) {
      if (item.status == 1 || item.status == 2 || item.status == 3) {
        patch_rule({
          event_id: this.match_id,
          challenge_id: item.challenge_id
        }).then((res) => {
          this.path_rules = res.data.rule
          this.flag_visible = true
          this.now_look = item
        })
      }
    },

    changeTpc(e) {
      this.file_name = e.target.files[0].name
      this.f = new FormData()
      this.f.append('file', e.target.files[0])
    },

    submitTcp() {
      if (this.f == null) {
        this.$notify.error({
          customClass: 'error_notify',
          title: this.$t('public.error'),
          message: this.$t('validateform.file')
        })
        return
      }
      submitApath(
        'event_id=' +
          this.match_id +
          '&challenge_id=' +
          this.now_look.challenge_id,
        this.f
      ).then((res) => {
        if (res.data.success) {
          this.$notify.success({
            title: this.$t('dialog_list.tips'),
            message: this.$t('writeup.upload_success')
          })
          this.flag_visible = false
          setTimeout(() => {
            $("input[type='file']").val('')
            this.f = null
            this.file_name = this.$t('selfHelp_competition.chose_file')
          }, 300)
        }
      })
    },
    view_flow(item, onOff) {
      if (!onOff) {
        this.pager.currentPage = 1
        this.pager.total = 0
      }
      tcpdumpStatus({
        event_id: this.match_id,
        challenge_id: item.challenge_id,
        offset: this.pager.pageSize * (this.pager.currentPage - 1),
        limit: this.pager.pageSize
      }).then((res) => {
        if (res.data.success) {
          this.flowData = res.data.data.rows
          this.pager.total = res.data.data.total
          this.flow_visible = true
        }
      })
      this.now_look = item
    },

    view_path(item, onOff) {
      if (!onOff) {
        this.pager.currentPage = 1
        this.pager.total = 0
      }
      getPathData({
        event_id: this.match_id,
        challenge_id: item.challenge_id,
        offset: this.pager.pageSize * (this.pager.currentPage - 1),
        limit: this.pager.pageSize
      }).then((res) => {
        if (res.data.success) {
          this.tableData = res.data.data.rows
          this.pager.total = res.data.data.total
          this.path_visible = true
        }
      })
      this.now_look = item
    }
  }
}
</script>

<style lang='scss' scoped>
.taskcon {
  width: 80%;
  min-width: 1366px;
  margin: 0 auto;
  .submit_flag {
    margin-top: 15px;
    font-size: 14px;
    line-height: 20px;
    * {
      font-size: 16px;
    }

    input[type="text"] {
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 5px;
      height: 40px;
      width: 400px;
      color: rgba(255, 255, 255, 0.8);
      background: none;
      padding: 0 15px;

      &:focus {
        outline: none;
      }
    }

    .select_path {
      width: 128px;
      height: 40px;
      margin-left: 15px;
      display: inline-block;
      position: relative;

      // button {
      //   width: 128px;
      //   height: 40px;
      //   background: lightblue;
      //   color: #fff;
      //   border-radius: 5px;
      //   text-align: center;
      //   border: none;
      // }

      input[type="file"] {
        width: 128px;
        height: 40px;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
      }
    }

    .fanga {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>

<style lang="scss">
.taskcon {
  .view_flow #view_flow_table {
    border-color: rgba(255, 255, 255, 0.1);
    border-right: none;
    border-bottom: none;
    .el-table__header-wrapper thead th {
      border-color: rgba(255, 255, 255, 0.1);
      border-left: none;
      background-color: #1e264a;
    }
  }
}
</style>
