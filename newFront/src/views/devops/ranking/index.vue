<template>
  <div>
    <div
      v-if="show_rank || matchData.public_rank"
      class="rank_box"
      style="position:relative;"
    >
      <!-- <fullScreen v-if="!is_login" /> -->
      <countDown style="float:right;margin-bottom:20px" />
      <slot name="other_nav" />
      <div>
        <!--分页 表格begin-->
        <!-- <el-table :data="rows" style="width: 100%" class="just_table" @row-click="tableClick"> -->
        <el-table
          :data="rows"
          style="width: 100%"
          class="just_table"
        >
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
                  <div>{{ (scope.$index+1)+pager.pageSize*(pager.currentPage-1) }}</div>
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
                      v-if="scope.row.obj_logo==''||scope.row.obj_logo==null"
                      class="obj_logo def_logo"
                    />
                    <span
                      v-else
                      class="obj_logo"
                      :style="'background:url('+scope.row.obj_logo+');background-size:cover;'"
                    />
                    <span
                      v-if="getStrNumber(scope.row.obj_name,18,13)"
                      class="marque_box"
                    >
                      <span>{{ scope.row.obj_name }}</span>
                    </span>
                    <span
                      v-else
                      class="marque_box"
                    >
                      <span class="marquee">{{ scope.row.obj_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.obj_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.obj_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.obj_name }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
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
                prop="sum_score"
                label="Score"
                min-width="50px"
              />
            </el-table-column>
          </el-table-column>
          <el-table-column>
            <el-table-column>
              <el-table-column
                label-class-name="th_del"
                prop="solved_count"
                label="Solved"
                min-width="100px"
              />
            </el-table-column>
          </el-table-column>

          <el-table-column
            v-for="(val,key,index1) in subject.rows[0]"
            :key="index1"
            label-class-name="sub_type"
            class-name="bor_l"
          >
            <template
              slot="header"
              slot-scope="scope"
            >
              <span
                class="type_span"
                :title="key"
              >{{ key }}</span>
            </template>
            <el-table-column
              v-for="(name,index2) in val"
              :key="index2"
              :label="name.task.title"
              label-class-name="sub_name"
              :class-name="index2==0?'bor_l':''"
            >
              <template
                slot="header"
                slot-scope="scope"
              >
                <span :title="name.task.title">{{ name.task.title }}</span>
              </template>
              <el-table-column
                label-class-name="score th_del"
                :label="matchData.integral_mode==1?name.task.score.toString():name.dynamic_score.toString()"
                :class-name="index2==0?'bor_l':''"
                min-width="40px"
              >
                <template slot-scope="scope">
                  <div
                    v-if="scope.row[name.id]"
                    class="rank_logo fcenter"
                  >
                    <span
                      class="rank_logo_pic pic_qi"
                      :class="{
                        'pic_1':scope.row[name.id]['rank']==1,
                        'pic_2':scope.row[name.id]['rank']==2,
                        'pic_3':scope.row[name.id]['rank']==3,
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
          <div
            v-if="$i18n.locale == 'zh'"
            class="page_info"
          >
            显示第 {{ (pager.currentPage-1)*pager.pageSize+1 }} 到第
            {{ pager.currentPage*pager.pageSize>pager.total?pager.total:pager.currentPage*pager.pageSize }} 条记录，总共
            {{ pager.total }} 条记录
          </div>
          <div
            v-else
            class="page_info"
          >
            Showing {{ (pager.currentPage-1)*pager.pageSize+1 }} through
            {{ pager.currentPage*pager.pageSize>pager.total?pager.total:pager.currentPage*pager.pageSize }} records for a total of
            {{ pager.total }} records.
          </div>
          <!--分页 begin-->
          <pagination
            v-show="pager.total>pager.pageSize"
            :total="pager.total"
            :page.sync="pager.currentPage"
            :limit.sync="pager.pageSize"
            :layout="pager.layout"
            @pagination="getTableData"
          />
        </div>

        <!--分页 end-->
        <!--弹窗 begin-->
        <!-- <el-dialog
          class="my-dialog"
          :title="$t('ranking.dialog.title_txt')"
          :visible.sync="dialogTableVisible"
          width="995px"
          @close="closeDia"
        > -->
        <el-dialog
          class="my-dialog"
          :title="$t('ranking.dialog.title_txt')"
          :visible.sync="dialogTableVisible"
          width="995px"
        >
          <div
            class="clearfix"
            style="border: 1px solid hsla(0,0%,100%,.1);"
          >
            <div
              v-if="show_randar"
              id="trend_chart"
              ref="trend_chart"
              class="trend_chart fl"
              style
            />
            <div
              class="table_full_width fl"
              :class="{'assign_w':show_randar}"
            >
              <el-table
                :data="gridData"
                class="userDetail scoreDetail"
              >
                <el-table-column
                  prop="username"
                  :label="$t('ranking.dialog.userName')"
                >
                  <template slot-scope="scope">
                    <div
                      class="ellipsis_txt"
                      style="display:block;"
                    >{{ scope.row.username }}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="task.title"
                  :label="$t('ranking.dialog.subName')"
                >
                  <template slot-scope="scope">
                    <div
                      class="ellipsis_txt"
                      style="display:block;"
                    >{{ scope.row.task.title }}</div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('ranking.dialog.subType')">
                  <template slot-scope="scope">
                    <div
                      class="ellipsis_txt"
                      style="display:block;"
                    >{{ the_rank_type=='layered' ? scope.row.task.level_name : scope.row.task.category_name }}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="score"
                  :label="$t('ranking.dialog.score')"
                  width="85"
                />
                <el-table-column
                  :label="$t('ranking.dialog.status')"
                  width="70"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.status==1? $t('dialog_list.effective'):$t('dialog_list.notEffective') }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="time"
                  :label="$t('ranking.dialog.subTime')"
                  width="160"
                />
              </el-table>

              <!--分页 begin-->
              <!-- <pagination
                v-show="detail.total>detail.pageSize"
                :total="detail.total"
                :page.sync="detail.currentPage"
                :limit.sync="detail.pageSize"
                :layout="detail.layout"
                @pagination="getradar"
              /> -->
              <pagination
                v-show="detail.total>detail.pageSize"
                :total="detail.total"
                :page.sync="detail.currentPage"
                :limit.sync="detail.pageSize"
                :layout="detail.layout"
                @pagination="getTableData"
              />
              <!--分页 end-->
            </div>
          </div>
        </el-dialog>
        <!--弹窗 end-->
      </div>
    </div>
    <!--<div v-else >-->
    <!--<img src="@/assets/img/kong.png" alt="">-->
    <!--</div>-->
  </div>
</template>

<script>
// import fullScreen from '@/components/match/common/small_part/fullScreen'
import pagination from '@/components/pagination'
import countDown from '@/components/countDown'
import { ranks, rank_tasks } from '@/api/devops'

import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('match')
import { getStrNumber } from '@/utils'

export default {
  name: 'CompetitionRank',
  components: {
    countDown,
    pagination
    // fullScreen
  },
  props: ['api', 'show_randar', 'the_rank_type', 'not_click_row'],
  // show_rank字段是当比赛详情没有返回是否公开排行榜时默认显示,
  // not_click_row点击行是否触发弹框事件，默认不返回false为,点击显示弹框。
  data() {
    return {
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
        total: 0, // 总共多少条
        layout: 'prev, pager, next'
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
  created() {
    this.getSubType()
    this.getTableData()
    // this.getDetail()
    this.rank_timer = setInterval(() => {
      if (this.matchData.remain_seconds > 0) {
        this.getDetail()
      } else {
        clearInterval(this.rank_timer)
      }
    }, 60000)
  },
  beforeDestroy() {
    clearInterval(this.rank_timer)
  },
  mounted() {},
  methods: {
    getDetail() {
      // 获取比赛信息
      let arg = ''
      if (this.$route.path.indexOf('devops') == -1) {
        arg = this.$route.query.hash
      } else {
        arg = {
          event_id: this.$route.query.event
        }
      }
      this.api
        .events(arg)
        .then(res => {
          const { data } = res
          this.matchData = data
          if (this.matchData.hasOwnProperty('public_rank')) {
            this.show_rank = this.matchData.hasOwnProperty('public_rank')
          }
          this.getSubType()
          this.getTableData()
        })
        .catch(error => {})
    },
    getTableData() {
      // 获取解题赛表格数据
      ranks({
        order: 'asc',
        offset: this.pager.pageSize * (this.pager.currentPage - 1),
        limit: this.pager.pageSize,
        evt: this.$route.query.hash
      })
        .then(res => {
          const { data } = res
          this.pager.total = data.total
          this.rows = data.rows
        })
        .catch(error => {})
    },
    getSubType() {
      // 获取解题赛题目类型
      rank_tasks({
        evt: this.$route.query.hash
      })
        .then(res => {
          const { data } = res
          this.subject = data
        })
        .catch(error => {})
    }
    // closeDia() {
    //   // 关闭弹窗清除个人技能图
    //   this.radarData = {
    //     indicator: [],
    //     val: []
    //   }
    //   this.detail.total = 0
    //   this.gridData = []
    // },
    // getradar(key, id) {
    //   // 获取用户技能
    //   this.detailQuery.limit = this.detail.pageSize
    //   this.detailQuery.offset =
    //     (this.detail.currentPage - 1) * this.detail.pageSize
    //   this.api
    //     .tasks_detail(this.detailQuery)
    //     .then((res) => {
    //       const { data } = res
    //       this.detail.total = data.total
    //       this.gridData = data.rows
    //     })
    //     .catch((error) => {})
    // },
    // // 初始化个人技能图
    // initEcharts() {
    //   const myChart = this.$echarts.init(this.$refs.trend_chart)
    //   // 图表文字颜色
    //   var textColors = '#3173fd'
    //   // 指定图表的配置项和数据
    //   const option = {
    //     radar: [
    //       {
    //         indicator: this.radarData.indicator,
    //         radius: 50, // 图形大小
    //         startAngle: 10, // 图形开始时的角度
    //         splitNumber: 3, // 环形个数
    //         shape: 'polygon', // 形状
    //         name: {
    //           formatter: '{value}',
    //           textStyle: {
    //             color: textColors
    //           }
    //         },
    //         splitArea: {
    //           areaStyle: {
    //             color: [],
    //             shadowColor: 'rgba(0, 0, 0, 0)',
    //             shadowBlur: 10
    //           }
    //         },
    //         axisLine: {
    //           lineStyle: {
    //             color: textColors,
    //             opacity: 0.5
    //           }
    //         },
    //         splitLine: {
    //           lineStyle: {
    //             color: 'rgba(255,255,255,.2)'
    //           }
    //         },
    //         axisLabel: {
    //           // lineStyle: {
    //           //   color: $('.radarPicture').css('border-color')
    //           // }
    //         }
    //       }
    //     ],
    //     calculable: true,
    //     series: [
    //       {
    //         type: 'radar',
    //         itemStyle: {
    //           emphasis: {
    //             lineStyle: {
    //               width: 1
    //             }
    //           }
    //         },
    //         data: [
    //           {
    //             value: this.radarData.val,
    //             areaStyle: {
    //               normal: {
    //                 color: textColors,
    //                 opacity: 0.25
    //               }
    //             },
    //             label: {
    //               normal: {
    //                 show: false,
    //                 formatter: function(params) {
    //                   return params.value
    //                 }
    //               }
    //             },
    //             lineStyle: {
    //               normal: {
    //                 color: textColors
    //               }
    //             },
    //             itemStyle: {
    //               normal: { color: textColors }
    //             }
    //           }
    //         ]
    //       }
    //     ]
    //   }
    //   // 使用刚指定的配置项和数据显示图表。

    //   myChart.setOption(option)
    // },

    // tableClick(row) {
    //   if (this.not_click_row) {
    //     return
    //   }
    //   // 点击表格
    //   this.userId = row.obj_id
    //   const obj = this.subject.rows[0]
    //   const totalScore = {}
    //   for (const key in obj) {
    //     totalScore[key] = {
    //       all: 0,
    //       solved: 0
    //     }
    //     obj[key].forEach((item, index) => {
    //       if (this.matchData.integral_mode == 1) {
    //         // 计分方式1是累加2是动态
    //         totalScore[key].all += item.task.score
    //       } else {
    //         totalScore[key].all += item.dynamic_score
    //       }
    //       if (row[item.id]) {
    //         totalScore[key].solved += row[item.id].score
    //       }
    //     })
    //     this.radarData.indicator.push({
    //       text: key,
    //       max: 100
    //     })
    //     const score = Math.round(
    //       (totalScore[key].solved / totalScore[key].all) * 100
    //     )
    //     this.radarData.val.push(score)
    //   }
    //   this.dialogTableVisible = true
    //   this.$nextTick(() => {
    //     if (this.show_randar) {
    //       this.initEcharts()
    //     }
    //     this.matchData.mode == 1
    //       ? (this.detailQuery.user = row.obj_id)
    //       : (this.detailQuery.team = row.obj_id)
    //     this.getradar()
    //   })
    // }
  },
  computed: {
    ...mapState(['match_data'])
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
// @import '~@/common/stylus/mixin.styl';

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
  padding: 30px 20px;

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
    table-layout: fixed !important;
  }

  .el-table__header {
    // 使表格兼容safari，不错位
    width: 100%;
    table-layout: fixed !important;
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
