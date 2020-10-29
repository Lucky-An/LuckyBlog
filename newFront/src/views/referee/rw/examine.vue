<template>
  <div class="guide_wrap referee" style="padding-top: 0">
    <div class="examine">
      <div class="task_tabs basic">
        <el-tabs type="border-card">
          <el-tab-pane :label="$t('ad5.referee.examine')">
            <div class="reload_btn" @click="reload_examine_list()">
              {{ $t("ad5.referee.table.reload") }}
            </div>
            <el-table
              v-loading="loadingList"
              border
              :data="examineList"
              :class="{ first_line: pager.currentPage == 1 }"
            >
              <el-table-column
                type="index"
                width="100"
                :label="$t('ad5.challenge_task_index')"
                align="center"
              >
                <template slot-scope="scope">
                  <span v-text="indexMethod(scope.$index, pager)" />
                </template>
              </el-table-column>
              <el-table-column
                prop="team_name"
                :label="$t('ad5.referee.table.challenge_team')"
                align="center"
              />
              <el-table-column
                prop="event_task_name"
                :label="$t('ad5.referee.table.apply_task')"
                align="center"
              />
              <el-table-column
                prop="time"
                :label="$t('ad5.referee.table.apply_time')"
                align="center"
              />
              <el-table-column
                prop="request_count"
                :label="$t('ad5.referee.table.apply_count')"
                align="center"
              />
              <el-table-column
                prop="status"
                :label="$t('ad5.referee.table.status')"
                align="center"
              >
                <template slot-scope="scope">
                  <div v-if="scope.$index == 0 && pager.currentPage == 1">
                    {{ $t("ad5.referee.table.is_challenge") }}
                  </div>
                  <div v-else>{{ $t("ad5.referee.table.soon_challenge") }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="username"
                width="250"
                :label="$t('ad5.referee.table.handle')"
                align="center"
              >
                <template slot-scope="scope">
                  <div class="pass" @click="pass_item(scope.row)">
                    {{ $t("ad5.referee.table.examine_pass") }}
                  </div>
                  <div class="no_pass" @click="not_pass_item(scope.row)">
                    {{ $t("ad5.referee.table.examine_not_pass") }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="pager.total > pager.pageSize"
              :total="pager.total"
              :page.sync="pager.currentPage"
              :limit.sync="pager.pageSize"
              :layout="pager.layout"
              style="margin: 0 auto; margin-top: 15px"
              @pagination="get_examine_list"
            />
          </el-tab-pane>
          <el-tab-pane :label="$t('ad5.referee.examine_record')">
            <el-table v-loading="loadingList" border :data="applyList">
              <el-table-column
                align="center"
                type="index"
                width="100"
                :label="$t('ad5.challenge_task_index')"
              >
                <template slot-scope="scope">
                  <span v-text="indexMethod(scope.$index, pager2)" />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="team_name"
                :label="$t('ad5.referee.table.team_name')"
              />
              <el-table-column
                align="center"
                prop="event_task_name"
                :label="$t('ad5.referee.table.apply_task')"
              />
              <el-table-column
                align="center"
                prop="time"
                :label="$t('ad5.referee.table.apply_time')"
              />
              <el-table-column
                align="center"
                prop="request_count"
                :label="$t('ad5.referee.table.apply_count')"
              />
            </el-table>
            <pagination
              v-show="pager2.total > pager2.pageSize"
              :total="pager2.total"
              :page.sync="pager2.currentPage"
              :limit.sync="pager2.pageSize"
              :layout="pager2.layout"
              style="margin: 0 auto; margin-top: 15px"
              @pagination="get_apply_list"
            />
          </el-tab-pane>
          <el-tab-pane :label="$t('ad5.referee.apply_record')">
            <el-table v-loading="loadingList" border :data="examine_record">
              <el-table-column
                align="center"
                type="index"
                width="100"
                :label="$t('ad5.challenge_task_index')"
              >
                <template slot-scope="scope">
                  <span v-text="indexMethod(scope.$index, pager3)" />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="team_name"
                :label="$t('ad5.referee.table.challenge_team')"
              />
              <el-table-column
                align="center"
                prop="event_task_name"
                :label="$t('ad5.referee.table.apply_task')"
              />
              <el-table-column
                align="center"
                prop="time"
                :label="$t('ad5.referee.table.examine_time')"
              />
              <el-table-column
                align="center"
                prop="request_count"
                :label="$t('ad5.referee.table.apply_count')"
              />
              <el-table-column
                align="center"
                prop="request_count"
                :label="$t('ad5.referee.table.examine_result')"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.status">
                    {{ $t("ad5.referee.table.pass") }}
                  </span>
                  <span v-else class="not_to_pass">{{
                    $t("ad5.referee.table.not_pass")
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="auditor_name"
                :label="$t('ad5.referee.table.examine_person')"
              />
            </el-table>
            <pagination
              v-show="pager3.total > pager3.pageSize"
              :total="pager3.total"
              :page.sync="pager3.currentPage"
              :limit.sync="pager3.pageSize"
              :layout="pager3.layout"
              style="margin: 0 auto; margin-top: 15px"
              @pagination="get_examine_record"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog
      class="my-dialog cancel_diglog"
      :title="$t('ad5.referee.dialog.examine_handle')"
      width="480px"
      :visible.sync="examineONoff"
    >
      <!--1为通过2为不通过-->
      <div>
        <div class="item_line">
          <span>{{ $t("ad5.referee.table.challenge_team") }}：</span>
          <span>{{ now_examine.team_name }}</span>
        </div>
        <div class="item_line">
          <span>{{ $t("ad5.referee.dialog.challenge_task") }}：</span>
          <span>{{ now_examine.event_task_name }}</span>
        </div>
        <div class="item_line">
          <span>{{ $t("ad5.referee.table.examine_result") }}：</span>
          <span v-if="handle_type == 1" class="to_pass">{{
            $t("ad5.referee.table.examine_pass")
          }}</span>
          <span v-else class="not_to_pass">{{
            $t("ad5.referee.table.examine_not_pass")
          }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          style="padding: 10px 25px; margin-right: 25px"
          @click="submitExamine"
        >{{ $t("modal.confirm") }}</el-button>
        <el-button style="padding: 10px 25px" @click="examineONoff = false">{{
          $t("modal.cancel")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import { examine, to_examine, examine_logs, apply_logs } from '@/api/examine'
export default {
  name: 'Examine',
  components: {
    pagination
  },
  data() {
    return {
      handle_type: 2,
      examineONoff: false,
      hash: this.$route.query.hash,
      examineList: [],
      applyList: [],
      examine_record: [],
      loadingList: true,
      pager: {
        // 页码
        currentPage: 1, // 当前第几页
        pageSize: 10, // 每页多少条
        total: 0, // 总共多少条
        layout: 'prev, pager, next',
        class: 'bluepage'
      },
      pager2: {
        // 页码
        currentPage: 1, // 当前第几页
        pageSize: 10, // 每页多少条
        total: 0, // 总共多少条
        layout: 'prev, pager, next',
        class: 'bluepage'
      },
      pager3: {
        // 页码
        currentPage: 1, // 当前第几页
        pageSize: 10, // 每页多少条
        total: 0, // 总共多少条
        layout: 'prev, pager, next',
        class: 'bluepage'
      },
      now_examine: {}
    }
  },
  created() {
    this.get_examine_list()
    this.get_apply_list()
    this.get_examine_record()
  },
  methods: {
    get_apply_list() {
      this.loadingList = true
      apply_logs(this.hash, {
        offset: this.pager2.pageSize * (this.pager2.currentPage - 1),
        limit: this.pager2.pageSize
      }).then((res) => {
        this.applyList = res.data.rows
        this.pager2.total = res.data.total
        this.loadingList = false
      })
    },
    get_examine_record() {
      this.loadingList = true
      examine_logs(this.hash, {
        offset: this.pager3.pageSize * (this.pager3.currentPage - 1),
        limit: this.pager3.pageSize
      }).then((res) => {
        this.examine_record = res.data.rows
        this.pager3.total = res.data.total
        this.loadingList = false
      })
    },
    pass_item(item) {
      // 审核通过操作
      this.handle_type = 1
      this.examineONoff = true
      this.now_examine = item
    },
    not_pass_item(item) {
      // 审核不通过操作
      this.handle_type = 0
      this.examineONoff = true
      this.now_examine = item
    },
    submitExamine() {
      to_examine(this.hash, {
        // 点击审核通过/不通过按钮事件
        challenge_id: this.now_examine.id,
        is_valid: this.handle_type
      }).then((res) => {
        if (res.data.success) {
          this.$notify({
            title: this.$t('dialog_list.tips'),
            message: this.$t('api_message.operation_success')
          })
          this.get_examine_list()
          this.examineONoff = false
        }
      })
    },
    reload_examine_list() {
      this.pager.currentPage = 1
      this.get_examine_list()
    },
    get_examine_list() {
      // 获取审核列表
      this.loadingList = true
      examine(this.hash, {
        offset: this.pager.pageSize * (this.pager.currentPage - 1),
        limit: this.pager.pageSize
      }).then((res) => {
        this.examineList = res.data.rows
        this.pager.total = res.data.total
        this.loadingList = false
      })
    },
    indexMethod(index, tar) {
      console.log(index, tar, 56)
      return (tar.currentPage - 1) * tar.pageSize + index + 1
    }
  }
}
</script>

<style lang="scss" scoped>
.guide_wrap {
  margin: 0 auto;
  padding: 25px;
  margin-top: 25px;
}
@media (max-width: 1650px) {
  .guide_wrap {
    width: 1200px;
  }
  .match_top,
  .match_title {
    width: 1200px;
  }
  .match_top {
    margin: 0 auto;
  }
}
@media (min-width: 1650px) {
  .guide_wrap {
    width: 1400px;
  }
  .match_top,
  .match_title {
    width: 1400px;
  }
  .match_top {
    margin: 0 auto;
  }
}
</style>

<style lang="scss">
.referee {
  width: 1400px;
  .examine {
    position: relative;

    .task_tabs {
      margin-bottom: 25px;
      font-size: 16px;
    }

    .task_tabs .el-tabs--border-card {
      background: #13193d;
      border: none;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      .el-tab-pane {
        color: #a9afbd;
        text-align: left;
        padding: 15px;
        .el-table {
          background: none;
          border: 2px solid #6870b8;
          thead tr th {
            border-left: none;
          }
        }
      }
    }

    .task_tabs .el-tabs--border-card .el-tabs__header {
      background: #20275b;
      border-bottom: none;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      .el-tabs__nav-scroll {
        padding-top: 6px;
        padding-left: 30px;
        .el-tabs__item.is-active {
          background: #13193d;
          border-top: 2px solid #0080ff;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          color: #0080ff;
          border-right: none;
          border-left: none;
          height: 40px;
        }
      }
    }

    .task_tabs .el-tabs--border-card .el-tabs__header .el-tabs__item.is-active {
      background: #13193d;
      border-top: 2px solid #0080ff;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      color: #0080ff;
    }

    .task_tabs .el-tabs--border-card .el-tabs__header .el-tabs__item {
      color: #fff;
      font-weight: bold;
      padding: 0 50px;
      line-height: 45px;
      border: none;
      font-size: 16px;
      vertical-align: middle;
    }

    .basic {
      // .first_line tr {
      //   &:nth-child(1) {
      //     td {
      //       height: 80px;
      //       line-height: 80px;
      //       background: #2346a0;
      //     }
      //   }
      // }

      .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: #396494;
      }

      .pass,
      .no_pass {
        padding: 3px 16px;
        display: inline-block;
        margin: 2px;
        cursor: pointer;
      }

      .pass {
        border: 1px solid #0080ff;
        border-radius: 3px;
        background: linear-gradient(rgba(0, 0, 0, 0), #1742a8); /* 标准的语法 */
      }

      .no_pass {
        border: 1px solid #f43940;
        border-radius: 3px;
        background: linear-gradient(rgba(0, 0, 0, 0), #892b43); /* 标准的语法 */
      }
    }
  }

  .el-pagination {
    text-align: center;
  }

  .item_line {
    padding: 8px 80px;
    font-size: 16px;

    span:first-child {
      margin-right: 8px;
      display: inline-block;
    }

    span:nth-child(2) {
      color: #0080ff;
    }
  }

  .not_to_pass {
    color: #e92c4a !important;
  }

  .task_tabs .el-tabs__content {
    overflow: visible;
  }

  .reload_btn {
    padding: 7px 20px;
    background: #0080ff;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    position: absolute;
    right: 8px;
    top: -35px;
    z-index: 2;
    color: #fff;
    cursor: pointer;
  }
}
</style>
