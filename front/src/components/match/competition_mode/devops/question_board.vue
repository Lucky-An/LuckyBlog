<template>
  <div class="guide_wrap guide_wrap_devops" style="padding-left:0;padding-right:0;padding-top:0">
    <!--上传wreteUp-->
    <upload-writeup :matchInfo="matchInfo" competition="dev" @hasWriteupChange="hasWriteupChange"></upload-writeup>
    <el-row>
      <el-col :span="16" class="itemsWrapper">
        <el-tabs
          v-model="currentItem"
          type="card"
          @tab-click="handleTab1Click"
          class="itemsTabs"
          ref="itemsTabs"
        >
          <!-- 每道题目的详细信息 -->
          <el-tab-pane v-for="item in this.itemsData" :name="String(item.id)" :key="item.id">
            <span slot="label">{{item.name}}</span>
            <div class="itemContent">
              <span class="itemDescriptionTitle">{{$t('task.taskDescribe')+':'}}</span>
              <span v-if="isCN" class="itemDescriptionDetail">{{item.itemDescriptionDetail}}</span>
              <span v-else class="itemDescriptionDetail">{{item.itemDescriptionDetailEn}}</span>
              <span class="itemDescriptionTitle">{{$t('question.environmental_information')+':'}}</span>
              <el-table :data="item.environmentInfo" v-if="item.environmentInfo" style="width: 100%" :show-header="false">
                <el-table-column prop="index" label="姓名" width="60"></el-table-column>
                <el-table-column prop="key" label="日期" width="250"></el-table-column>
                <el-table-column prop="value" label="姓名" width="380"></el-table-column>
              </el-table>
              <span class="itemDescriptionTitle">{{$t('selfHelp_competition.down_annex')+':'}}</span>
              <a
                target="_blank"
                download
                class="el-button download_a el-button--primary downloadAcceBtn"
                :href="'/api/v1/ops/web/api/download_message/?event_id='+ event_id +'&challenge_id=' + item.id"
              >{{$t('selfHelp_competition.down_annex')}}</a>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <!-- 题目进度信息 -->
      <el-col :span="8" class="progressWrapper">
        <div class="progressTabsAndTitle">
          <div class="progressTabsTitle">{{$t('question.task_Ops_progress')}}</div>
          <el-tabs v-model="progressOwner" class="progressTabs">
            <el-tab-pane name="mine">
              <span slot="label">{{$t('question.my_progress')}}</span>
              <el-table
                max-height="405"
                :data="myProgress"
                :class="{'not_scroll_table':myProgress.length<=6,'scroll_table':myProgress.length>6}"
                style="width: 100%"
                class="myProgressTable"
                :border="false"
              >
                <el-table-column :label="currentName" header-align="center">
                  <el-table-column
                    v-if="isCN"
                    prop="name"
                    :label="$t('question.inspection_point')"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    v-else
                    prop="name_en"
                    :label="$t('question.inspection_point')"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column :label="$t('question.progress')" header-align="center">
                    <template slot-scope="scope">
                      <i
                        :class="[scope.row.solve ? 'icon-duihao-copy' : 'icon-peizhiguanli_quxiaoxiugai_chahao', 'iconfont']"
                      ></i>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="create_time"
                    :label="$t('question.resolved_time')"
                    header-align="center"
                  ></el-table-column>
                </el-table-column>
              </el-table>
              <div class="progressRelease">
                {{$t('question.my_progress_release')}}
                <i
                  class="icon-peizhiguanli_quxiaoxiugai_chahao iconfont"
                ></i>
                {{$t('question.unsolved')}}
                <i class="icon-duihao-copy iconfont"></i>
                {{$t('question.solved')}}。
              </div>
            </el-tab-pane>
            <el-tab-pane name="all">
              <span slot="label">{{$t('question.contest_progress')}}</span>
              <el-table :data="allProgress"
                        max-height="405"
                        :class="{'not_scroll_table':myProgress.length<=6,'scroll_table':myProgress.length>6}"
                        style="width: 100%">
                <el-table-column :label="currentName" header-align="center">
                  <el-table-column
                    v-if="isCN"
                    prop="name"
                    :label="$t('question.inspection_point')"
                    header-align="center"
                    :width="120"
                  ></el-table-column>
                  <el-table-column
                    v-else
                    prop="name_en"
                    :label="$t('question.inspection_point')"
                    header-align="center"
                    :width="120"
                  ></el-table-column>
                  <el-table-column :label="$t('question.progress')" header-align="center">
                    <template slot-scope="scope">
                      <el-progress :percentage="parseInt(scope.row.percent)"></el-progress>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
              <div class="progressRelease">{{$t('question.my_progress_release')}}</div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import {
  events,
  writeups,
  uploadWriteups,
  getItemInfo,
  getProgressInfo
} from "@/api/competitionMode/devopsMode";
import UploadWriteup from '@/components/match/common/small_part/uploadWriteup'
const { mapState } = createNamespacedHelpers("match");

export default {
  name: "question_board",
  components: {
    UploadWriteup
  },
  data() {
    return {
      currentItem: "",
      currentName: "",
      progressOwner: "mine",
      myProgress: [],
      allProgress: [],
      itemsData: [],
      writeUpVisible: false,
      hasWriteup: false,
      matchInfo: {},
      isCN: this.$i18n.locale=='CN',
      event_id: this.$route.query.event //竞赛id,
    };
  },
  created() {
    // 获取数据后处理成页面展示所需要的数据格式
    getItemInfo(this.event_id)
      .then(res => {
        if (res.status === 200) {
          let items = res.data;
          this.itemsData = items.map(el => {
            let obj = {};
            obj.id = el.challenge_id;
            obj.name = el.challenge_name;
            obj.itemDescriptionDetail = el.description;
            obj.itemDescriptionDetailEn = el.description_en;
            // 将对象转换为数组，便于表格展示
            let arr = [
              {
                key: this.$t("question.login_method"),
                value: this.$t("question.remote_SSH_connection"),
                index: "1"
              }
            ];
            let i = 1;
            for (var keys in el) {
              let attr = "";
              // 根据中英文环境，选择后端传递过来的中英文数据
              if (this.$i18n.locale=='CN') {
                switch (keys) {
                  case "ssh":
                    attr = this.$t("question.maintenance_host");
                    break;
                  case "name":
                    attr = this.$t("question.login_username");
                    break;
                  case "secret":
                    attr = this.$t("question.login_password");
                    break;
                  default:
                    continue;
                }
              } else {
                switch (keys) {
                  case "ssh":
                    attr = this.$t("question.maintenance_host");
                    break;
                  case "name":
                    attr = this.$t("question.login_username");
                    break;
                  case "secret_en":
                    attr = this.$t("question.login_password");
                    break;
                  default:
                    continue;
                }
              }
              arr.push({
                key: attr,
                value: el[keys],
                index: i + 1
              });
              i++;
            }
            obj.environmentInfo = arr;

            return obj;
          });
          // 将 id 与 name 都转换为 string，以防出现 bug
          if(items.length){
            this.currentItem = String(this["itemsData"][0]["id"]);
            this.currentName = String(this["itemsData"][0]["name"]);
            getProgressInfo(this.event_id,this.currentItem).then(res => {
              if (res.status === 200) {
                this.myProgress = res.data.self_process;
                this.allProgress = res.data.all_process;
              }
            });
          }
        }
      })
      this.getMatchInfo();
  },
  methods: {
    handleTab1Click(tab, event) {
      this.currentName = this["itemsData"][tab.index]["name"];
      getProgressInfo(this.event_id,this.currentItem)
        .then(res => {
          if (res.status === 200) {
            this.myProgress = res.data.self_process;
            this.allProgress = res.data.all_process;
          } else {
            this.$notify.error({
              customClass: "error_notify",
              title: this.$t("public.error"),
              message: this.$t("api_message.")
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$notify.error({
            customClass: "error_notify",
            title: this.$t("public.error"),
            message: this.$t("api_message.")
          });
        });
    },

    getWriteup() {
      //获取writeup
      writeups({
        evt: this.$route.query.event
      })
        .then(res => {
          if (res.data.has_writeup == 0) this.hasWriteup = false;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getMatchInfo() {
      //获取vux比赛信息
      this.matchInfo = this.match_data;
      if(typeof this.match_data.file_type=='string'){
        this.matchInfo.file_type = this.match_data.file_type.split(',')
      }
      if (this.match_data.can_submit_writeup) {
        this.getWriteup();
      }
    },
    hasWriteupChange(){
      this.hasWriteup = true;
    }
  },
  watch: {},
  computed: {
    ...mapState(["match_data"])
  },
  beforeMount() {},
  mounted() {}
};
</script>

<style lang="stylus">
@import '~@/common/stylus/mixin.styl';
.guide_wrap_devops {
  padding-top: 0;

  .itemsWrapper {
    padding-right:10px;

    .itemsTabs {
      .el-tabs__header.is-top {
        background-color: #1D2243;
        margin-bottom: 0px;
        border-bottom: 0px;
        height: 40px;

        .el-tabs__nav.is-top {
          border: 0px;

          .el-tabs__item.is-top.is-active {
            color: #fff;
            background-color: #191D34;
          }

          .el-tabs__item.is-top {
            border: 0px;
            margin-right: 10px;
            margin-left: 5px;
            margin-top: 5px;
            color: #9096a3;

            span {
              font-size: 18px;
            }
          }
        }
      }

      .el-tabs__content {
        background-color: #191D34;
        height: 65vh;
        min-height: 660px;

        .itemContent {
          padding: 38px 30px;
          color: #fff;
          font-size: 16px;
          text-align: left;

          &>span {
            display: block;
            margin-top: 10px;
          }

          .itemDescriptionTitle {
            color: lightblue;
            font-size: 22px;
            margin-bottom: 20px;
          }

          .itemDescriptionDetail {
            margin-bottom: 40px;
            line-height: 30px;
          }

          .el-table {
            min-width:600px!important;
            margin-bottom: 40px;

            &::before {
              height: 0;
              display: none;
              width: 0;
              background-color: transparent;
            }

            &::after {
              height: 0;
              display: none;
              width: 0;
            }

            .el-table__body-wrapper{
              tr.el-table__row {
                background-color: #191D34;

                td {
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }

  .progressWrapper {
    padding-left: 10px;

    .progressTabsAndTitle {
      .progressTabsTitle {
        width: 100%;
        height: 40px;
        margin-bottom: 0px;
        background-color: #1d2243;
        line-height: 60px;
        text-align: center;
        color: #fff;
        font-size: 18px;
        line-height: 40px;
      }

      .progressTabs {
        background-color: #191D34;
        padding: 10px;
        height: 65vh;
        min-height: 660px;

        .el-tabs__header.is-top {
          border: 0px;
          margin-bottom: 5px;

          .el-tabs__nav-wrap.is-top {
            border: 0px;

            &::after {
              background-color: #191D34;
            }

            .el-tabs__nav-scroll {
              display: flex;
              justify-content: center;

              .el-tabs__nav.is-top {
                .el-tabs__active-bar.is-top {
                }

                .el-tabs__item.is-top.is-active {
                  border: 0px;
                  color: lightblue;

                  span {
                  }
                }

                .el-tabs__active-bar.is-top {
                  background-color: lightblue;
                }

                .el-tabs__item.is-top {
                  border: 0px;
                  color: #fff;

                  span {
                  }
                }
              }
            }
          }
        }

        .el-tabs__content {
          padding: 10px;
          .el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover {
            border: 0;
            //overflow: visible;
            overflow-y: auto;

            &::before {
              height: 0;
              background-color: transparent;
            }

            tr {
              td, th {
                border: 1px solid rgba(255, 255, 255, 0.1);
              }
            }

            .el-table__header-wrapper {
              overflow: visible;

              .is-group.has-gutter {
                tr {
                  th.is-center {
                    color: #fff;
                    background-color: #191D34;
                    font-size: 18px;
                  }

                  th.is-leaf.is-center {
                    color: #fff;
                    background-color: #191D34;
                    font-size: 16px;
                  }

                  th {
                    td {
                      border: 1px solid rgba(255, 255, 255, 0.1);
                    }
                  }
                }
              }
            }

            .el-table__body-wrapper.is-scrolling-none {
              overflow: visible;

              .el-table__empty-block {
                background-color: #191D34;
              }

              tr.el-table__row {
                background-color: #191D34;
                font-size: 16px;
                color: #fff;

                td {
                  .el-progress-bar__outer {
                    background-color: #1d2243;

                    .el-progress-bar__inner {
                      background-color: #0b68f7;
                    }
                  }

                  .el-progress__text {
                    color: #fff;
                  }
                }
              }
            }
          }
          .not_scroll_table{
            border: 0;
            overflow: visible;
            overflow-y: visible!important;
          }
          .scroll_table{
            background:#191d34;
            thead th.gutter{
              display:none!important;
            }
          }
          .el-table {
            &::before {
              display: none;
            }
          }

          .el-table--border::after, .el-table--group::after, .el-table::before {
            display: none;
          }

          .progressRelease {
            width: 100%;
            margin-top: 30px;
            color: lightblue;
            font-size: 16px;
            text-align: left;
            padding: 5px;
            line-height: 28px;

            i {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
<style>
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: transparent !important;
}
.progressPic {
}

.submitWriteupDev > span > a {
  color: #fff;
}
.icon-peizhiguanli_quxiaoxiugai_chahao {
  font-size: 20px;
  color: red;
}
.icon-duihao-copy {
  font-size: 20px;
  color: green;
}

.downloadAcceBtn {
  color: #fff;
  padding:12px 20px;
  display:inline-block;
}
</style>

