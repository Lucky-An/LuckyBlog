<template>
  <div class="app-container rank_box">
    <countDown class="countDown" />
    <div v-if="show_rank || matchData.public_rank" style="position: relative">
      <div>
        <!--分页 表格begin-->
        <el-table :data="rows" style="width: 100%" class="just_table">
          <!--排名-->
          <el-table-column>
            <el-table-column>
              <el-table-column
                label-class-name="th_del"
                class-name="bor_l1"
                label="Rank"
                width="50"
              >
                <template slot-scope="scope">
                  <div>
                    {{
                      scope.$index +
                        1 +
                        pager.pageSize * (pager.currentPage - 1)
                    }}
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>

          <!--用户名-->
          <el-table-column>
            <el-table-column>
              <el-table-column
                label-class-name="th_del"
                label="Name"
                width="180"
              >
                <template slot-scope="scope">
                  <div class="user_name fcenter">
                    <span
                      v-if="scope.row.logo == '' || scope.row.logo == null"
                      class="obj_logo def_logo"
                    />
                    <span
                      v-else
                      class="obj_logo"
                      :style="
                        'background:url(' +
                          scope.row.logo +
                          ');background-size:cover;'
                      "
                    />
                    <span
                      v-if="getStrNumber(scope.row.name, 18, 13)"
                      class="marque_box"
                    >
                      <span>{{ scope.row.name }}</span>
                    </span>
                    <span v-else class="marque_box">
                      <span
                        class="marquee"
                      >{{ scope.row.name }} &nbsp;&nbsp;&nbsp;&nbsp;{{
                        scope.row.name
                      }}
                        &nbsp;&nbsp;&nbsp;&nbsp;{{
                          scope.row.name
                        }}
                        &nbsp;&nbsp;&nbsp;&nbsp;{{
                          scope.row.name
                        }}
                      &nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </span>
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>

          <el-table-column>
            <el-table-column>
              <el-table-column
                label-class-name="th_del"
                prop="score"
                label="Score"
                min-width="50px"
              />
            </el-table-column>
          </el-table-column>
          <el-table-column>
            <el-table-column>
              <el-table-column
                label-class-name="th_del"
                prop="solved_num"
                label="Solved"
              />
            </el-table-column>
          </el-table-column>

          <!--多层级的表格题目-->
          <el-table-column
            v-for="(val, key, index1) in subject"
            v-if="subject.total !== 0"
            :key="index1"
            label-class-name="sub_type"
            class-name="bor_l"
          >
            <template slot="header" slot-scope="scope">
              <span class="type_span" :title="key">{{ key }}</span>
            </template>
            <el-table-column
              v-for="(task, index2) in val"
              :key="index2"
              :label="task.task_name"
              label-class-name="sub_name"
              :class-name="index2 == 0 ? 'bor_l' : ''"
            >
              <template slot="header" slot-scope="scope">
                <span :title="task.task_name">{{ task.task_name }}</span>
              </template>
              <el-table-column
                v-for="(flag, index3) in task.points"
                label-class-name="score th_del"
                :label="flag.score.toString()"
                :class-name="index3 == 0 ? 'bor_l' : ''"
                min-width="40px"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row[flag.id]" class="rank_logo fcenter">
                    <span
                      class="rank_logo_pic pic_qi"
                      :class="{
                        pic_1: scope.row[flag.id]['blood'] == 1,
                        pic_2: scope.row[flag.id]['blood'] == 2,
                        pic_3: scope.row[flag.id]['blood'] == 3,
                      }"
                    />
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table>
        <!--分页 表格end-->
        <div style="position: relative">
          <div v-if="$i18n.locale == 'zh'" class="page_info">
            显示第 {{ (pager.currentPage - 1) * pager.pageSize + 1 }} 到第
            {{
              pager.currentPage * pager.pageSize > pager.total
                ? pager.total
                : pager.currentPage * pager.pageSize
            }}
            条记录，总共 {{ pager.total }} 条记录
          </div>
          <div v-else class="page_info">
            Showing {{ (pager.currentPage - 1) * pager.pageSize + 1 }} through
            {{
              pager.currentPage * pager.pageSize > pager.total
                ? pager.total
                : pager.currentPage * pager.pageSize
            }}
            records for a total of {{ pager.total }} records.
          </div>
          <!--分页 begin-->
          <pagination
            v-show="pager.total > pager.pageSize"
            :total="pager.total"
            :page.sync="pager.currentPage"
            :limit.sync="pager.pageSize"
            @pagination="getRank"
          />
        </div>
        <!--分页 end-->
      </div>
    </div>
    <!--<div v-else >-->
    <!--<img src="@/assets/img/kong.png" alt="">-->
    <!--</div>-->
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import countDown from '@/components/countDown'
import { mapGetters } from 'vuex'
import { getStrNumber } from '@/utils'
import { getRank, getRankTask } from '@/api/inf'

export default {
  name: 'CompetitionRank',
  components: {
    pagination,
    countDown
  },
  // show_rank字段是当比赛详情没有返回是否公开排行榜时默认显示,
  data() {
    return {
      id: this.$route.query.id,
      is_login: localStorage.isUserLogin,
      getStrNumber,
      rank_timer: null,
      subject: {
        // 题目列表
        rows: []
      },
      rows: [
        // 排行榜列表
      ],
      gridData: [
        // 被点击的列表
      ],
      pager: {
        // 页码
        currentPage: 1, // 当前第几页
        pageSize: 50, // 每页多少条
        total: 0, // 总共多少条
        layout: 'prev, pager, next'
      },
      matchData: {}, // 比赛详细信息
      detail: {
        // 表格详细信息页码
        currentPage: 1, // 当前第几页
        pageSize: 10, // 每页多少条
        total: 0 // 总共多少条
      },
      dialogTableVisible: false, // 表格弹窗
      radarData: {
        // 个人技能参数
        indicator: [],
        val: []
      },
      detailQuery: {
        // 获取个人详情发送的参数
        evt: this.$route.query.event,
        limit: 1,
        offset: 0
      },
      userId: '', // 点击的用户id
      eventHash: '', // 赛事hash,
      show_rank: true
    }
  },
  computed: {
    ...mapGetters(['config', 'user'])
  },
  created() {
    this.getRankTask()
    this.getRank()

    // this.rank_timer = setInterval(() => {
    //   if (this.matchData.remain_seconds > 0) {
    //     this.getRankTask()
    //     this.getTableData()
    //   } else {
    //     clearInterval(this.rank_timer)
    //   }
    // }, 60000)
  },
  beforeDestroy() {
    clearInterval(this.rank_timer)
  },
  mounted() {},
  methods: {
    // 获取解题赛题目类型
    getRank() {
      const params = {
        offset: this.pager.pageSize * (this.pager.currentPage - 1),
        limit: this.pager.pageSize,
        event_id: this.id
      }
      getRank(params).then((res) => {
        const { data } = res
        this.pager.total = data.total || this.pager.total
        this.rows = data.rows || this.rows
      })
    },
    // 获取解题赛排行榜表头
    getRankTask() {
      getRankTask({ event_id: this.id }).then((res) => {
        const { data } = res
        this.subject = data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.screen_handle {
  position: absolute;
  right: 28px;
  top: 20px;
}
</style>
<style lang="scss">
.table_full_width {
  width: 100%;
}

.assign_w {
  width: 680px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.width100 {
  width: 100%;
}

.rank_box {
  padding: 0 30px 80px 30px;

  // 清除表格公共样式
  .rank_logo_pic {
    width: 27px;
    height: 27px;
    display: inline-block;
    background-position: center center;
    background-size: auto 100%;
    background-repeat: no-repeat;
  }

  .pic_qi {
    background-image: url("~@/assets/match/qz.png");
  }

  .pic_1 {
    background-image: url("~@/assets/match/1.png");
  }

  .pic_2 {
    background-image: url("~@/assets/match/2.png");
  }

  .pic_3 {
    background-image: url("~@/assets/match/3.png");
  }

  .el-table__body {
    // 使表格兼容safari，不错位
    width: 100%;
    table-layout: fixed;
  }

  .el-table__header {
    // 使表格兼容safari，不错位
    width: 100%;
    table-layout: fixed;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: #396494;
  }

  .el-table td,
  .el-table th {
    padding: 3px 0;
  }

  .el-table--border,
  .el-table--group {
    border: none;
  }

  .el-table thead.is-group th,
  .el-table,
  .el-table__expanded-cell,
  .el-table th,
  .el-table tr {
    background: none;
  }

  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border-right: 1px solid #053a66;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #053a66;
  }

  .el-table--border th,
  .el-table__fixed-right-patch,
  .el-table__expanded-cell,
  .el-table th {
    border: none;
  }

  .el-table .cell,
  .el-table th div,
  .el-table--border td:first-child .cell,
  .el-table--border th:first-child .cell,
  .el-table .cell,
  .el-table th div {
    padding: 0;
    text-align: center;
  }

  .el-table,
  .el-table th {
    color: #fff;
  }

  .el-table th {
    padding: 0;
    overflow: visible;
  }

  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background: none;
  }

  // 开始自己的样式
  .el-table td,
  .el-table thead .cell {
    background: #0d1927;
  }

  .el-table .bor_l1 {
    border-left: 1px solid #053a66;
  }

  .bor_l,
  th.bor_l div {
    border-left: 2px solid #053a66;
  }

  div.sub_type .type_span {
    transform: skew(-45deg);
    font-size: 18px;
  }

  div.sub_name span {
    font-size: 14px;
    color: #fff;
    transform: skew(-45deg, 0deg) rotate(45deg);
    display: block;
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
  }

  th div.sub_type {
    transform: skew(45deg) translate(-110px);
    border-right: 1px solid #053a66;
    border-top: 1px solid #053a66;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  th div.sub_name {
    transform: skew(45deg) translate(-45px);
    border-right: 1px solid #053a66;
    border-top: 1px solid #053a66;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-table thead th.th_del {
    border-top: 1px solid #053a66;
    border-right: 1px solid #053a66;
  }

  div.th_del {
    border: none;
    font-size: 14px;
    height: 35px;
    line-height: 35px;
  }

  .score {
    color: #026bd4;
    font-weight: bold;
  }

  // 设置tbody样式
  .user_name {
    img {
      width: 30px;
      height: 30px;
      margin-right: 8px;
      border-radius: 50%;
    }

    .marque_box {
      width: 120px;
      overflow: hidden;
      text-align: left;

      .marquee {
        display: table-cell;
      }
    }
  }

  .rank_logo img {
    height: 27px;
  }

  .el-dialog__header {
    border-bottom: none;
  }

  // 分页的样式
  .pagination_box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-input__inner {
    background: #0d1927;
    border: 1px solid #053a66;
    color: #fff;
  }

  .el-pagination .btn-next,
  .el-pagination .btn-prev,
  .el-pager li {
    background: none;
    color: #fff;
  }

  .el-pager li.active {
    color: #409eff;
  }

  .el-pagination button:disabled {
    color: #c0c4cc;
  }

  .el-pagination__jump,
  .el-pagination__total {
    color: #fff;
  }

  .page_info {
    line-height: 50px;
    color: #fff;
    position: absolute;
    top: 0;
    left: 30px;
    font-size: 14px;
  }

  .trend_chart {
    width: 250px;
    height: 250px;
    padding-right: 25px;
    margin-right: 25px;
  }

  .userDetail {
    min-height: 250px;
  }
}

.obj_logo {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: inline-block;
  vertical-align: middle;
  margin-right: 2px;
}

.def_logo {
  background: url("~@/assets/match/def_icon.jpg") no-repeat;
  background-size: 100% 100%;
}

.solving_type .scoreDetail {
  .el-table__row .cell {
    color: #9395a1;
    padding: 0 5px;
  }
}
</style>
