<template>
  <div class="task_list_box">
    <div>
      <!--是否可以查看全部比赛，如果可以，展示竞赛筛选框-->
      <div class="filter_group clearfix">
        <!--<el-radio-group v-if="config.show_all_evt" v-model="query.type" class="fr" size="medium" @change="changeType">-->
        <!--<el-radio-button :label="1">{{ $t('ad5.onlyMe') }}</el-radio-button>-->
        <!--<el-radio-button :label="0">{{ $t('ad5.onlyAll') }}</el-radio-button>-->
        <!--</el-radio-group>-->
      </div>

      <!--竞赛列表-->
      <div class="task_list">
        <div v-for="item in list" :key="item.hash" class="task">
          <!--封面和竞赛状态-->
          <div class="cover_box">
            <img :src="item.cover || cover" alt>
            <p
              class="math_lable"
              :class="{
                blues: item.process == 0,
                huang: item.process == 1,
                hui: item.process == 2,
              }"
              v-text="label_status(item.process)"
            />
          </div>

          <!--竞赛信息-->
          <div class="content">
            <!--竞赛标题-->
            <p class="title">
              <!--竞赛名称-->
              <span class="competition_name ellipsis">{{
                $i18n.locale == "en" ? item.name_en : item.name_zh
              }}</span>
              <!--竞赛图标-->
              <span class style="position: relative; top: -4px">
                <span v-if="item.type == 1" class="match_type attack">
                  <span class="icon" />
                  <span class="label_txt">{{ $t("ad5.mode.attack") }}</span>
                </span>
                <span v-if="item.type == 2" class="match_type new_attack">
                  <span class="icon" />
                  <span class="label_txt">{{ $t("ad5.mode.newAttack") }}</span>
                </span>
                <span v-if="item.type == 3" class="match_type devops">
                  <span class="icon" />
                  <span class="label_txt">{{ $t("ad5.mode.devops") }}</span>
                </span>
                <span v-if="item.type == 4" class="match_type jad">
                  <span class="icon" />
                  <span class="label_txt">{{ $t("ad5.mode.jad") }}</span>
                </span>
                <span v-if="item.type == 5" class="match_type layered">
                  <span class="icon" />
                  <span class="label_txt">{{ $t("ad5.mode.layered") }}</span>
                </span>
                <span v-if="item.type == 6" class="match_type rw">
                  <span class="icon" />
                  <span class="label_txt">{{ $t("ad5.mode.rw") }}</span>
                </span>
                <span v-if="item.type == 7" class="match_type theory">
                  <span class="icon" />
                  <span class="label_txt">{{ $t("ad5.mode.theory") }}</span>
                </span>
                <span v-if="item.type == 8" class="match_type inf">
                  <span class="icon" />
                  <span class="label_txt">{{ $t("ad5.mode.inf") }}</span>
                </span>
              </span>
            </p>
            <!--竞赛信息-->
            <p class="info">
              <span>
                {{ $t("competition.competitionMode") }}：
                <span v-if="item.mode == 1">{{
                  $t("competition.personal")
                }}</span>
                <span v-else>{{ $t("competition.team") }}</span>
              </span>
            </p>
            <p class="info">
              <span>
                {{ $t("competition.startTime") }}：
                <span>{{ item.start_time }} ——</span>
                <span>{{ item.end_time }}</span>
              </span>
            </p>
            <div class="info">
              <div class="brief_info">
                {{ $t("competition.introduce") + "：" }}
                {{
                  $i18n.locale == "en"
                    ? item.description_en
                    : item.description_zh
                }}
              </div>
            </div>
          </div>

          <!--参加比赛按钮-->
          <div class="btn_box">
            <!--0:进行中，1:未开始，2:结束-->
            <p
              class="btn"
              :class="{
                not_begin: item.process == 1,
                is_begin: item.process == 0,
                is_end: item.process == 2,
              }"
              @click="goMatch(item)"
            >
              <span v-if="item.process == 2">{{
                $t("ad5.competition_review")
              }}</span>
              <span v-if="item.process == 0">{{
                $t("ad5.into_competition")
              }}</span>
              <span
                v-if="item.process == 1"
                class="join_btn search_competition_btn"
              >{{ $t("ad5.coming_soon2") }}</span>
            </p>
          </div>
        </div>
      </div>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="page"
        :limit.sync="query.limit"
        @pagination="changePagina"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList, checkAuth } from '@/api/match'
import pagination from '@/components/pagination'

export default {
  name: 'IndexHAHAHAH',
  components: {
    pagination
  },
  data() {
    return {
      list: [], // 竞赛列表
      cover: require('@/assets/match/cover.jpg'), // 默认竞赛封面
      query: {
        limit: 3,
        offset: 0,
        type: 1, // 0展示全部 1展示自己
        search: ''
      },
      total: 0,
      page: 1,
      routers: {
        // 7种路由地址，对应不同的竞赛模式 竞赛类型 1攻防 2新攻防 3运维 4解题 5闯关 6rw 7理论
        1: '/attack/guide',
        2: '/newAttack/guide',
        3: '/devops/guide',
        4: '/jad/guide',
        5: '/layered/guide',
        6: '/rw/guide',
        7: '/theory/guide',
        8: '/inf/guide'
      },
      timer: null
    }
  },
  computed: {
    ...mapGetters(['config', 'user'])
  },
  created() {
    this.getList()
    this.timer = setInterval(() => {
      this.getList()
    }, 1000 * 60 * 5)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    getList() {
      this.query.offset = (this.page - 1) * this.query.limit
      getList(this.query).then((res) => {
        const { data } = res
        this.total = data.total
        this.list = data.rows
      })
    },
    // 将html 转为正常格式的字符串
    delHtmlTag(item) {
      let str =
        this.$i18n.locale === 'zh' ? item.description_zh : item.description_en
      str = this.$marked(str)
      str = str.replace(/<\/?[^>]*>/g, '') // 去除HTML tag
      str = str.replace(/[ | ]*\n/g, '\n') // 去除行尾空白
      // str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
      str = str.replace(/&nbsp;/gi, '') // 去掉&nbsp;
      return str
      // return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
    },
    // 去往比赛
    goMatch(item) {
      // item.type 竞赛类型 1攻防 2新攻防 3运维 4解题 5闯关 6rw 7理论
      // 若果比赛可以回顾  或 比赛没有提交，可以进入比赛
      const { role } = this.user
      const toMatch = () => {
        const routeUrl = this.$router.resolve({
          path:
            role === 'Referee'
              ? '/referee/realWorld/examine'
              : this.routers[item.type],
          query: {
            id: item.id,
            hash: item.hash,
            type: item.type
          }
        })
        window.open(routeUrl.href)
      }
      if (
        (item.process == 2 && item.is_review) ||
        (item.process == 0 && !item.is_submit) ||
        item.type !== 7
      ) {
        if (item.type === 4) {
          checkAuth({
            evt: item.hash
          }).then((res) => {
            const { success, message } = res.data
            if (success) {
              toMatch()
            } else {
              this.$notify.error({
                customClass: 'error_notify',
                title: this.$t('public.error'),
                message: this.$t('api_message' + message)
              })
            }
          })
        } else {
          toMatch()
        }
      } else {
        this.tips_user(item)
      }
    },
    //  比赛未开始的提示信息
    tips_user(item) {
      let tip_message = ''
      if (item.process == 1) {
        tip_message = this.$t('competition.notBegun')
      }
      if (item.process == 0 && item.is_submit) {
        tip_message = this.$t('ad5.theory.notReview1')
      }
      if (item.process == 2 && !item.is_review) {
        tip_message = this.$t('ad5.theory.notReview2')
      }
      this.$alert(
        '<div style="margin-top:20px;">' + tip_message + '</div>',
        this.$t('dialog_list.tips'),
        {
          customClass: 'public_confirm public_confirm_sm small_tips',
          showConfirmButton: false,
          center: true,
          closeOnClickModal: true,
          dangerouslyUseHTMLString: true
        }
      )
    },
    changeType() {
      this.query.offset = 0
      this.getList()
    },
    changePagina(val) {
      this.query.offset = (val.page - 1) * this.query.limit
      this.getList()
    },
    // 竞赛状态
    label_status(status) {
      if (status == 0) {
        return this.$t('competition.doing')
      } else if (status == 1) {
        return this.$t('competition.before2')
      } else {
        return this.$t('competition.close')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.task_list_box {
  padding: 0 200px;

  .filter_group {
    height: 36px;
    margin-bottom: 20px;
  }

  /*竞赛列表*/
  .task_list {
    .task {
      padding: 20px;
      display: flex;
      background: linear-gradient(
        rgba(36, 42, 103, 0.8),
        rgba(23, 27, 67, 0.8)
      );
      margin-bottom: 25px;

      .cover_box {
        position: relative;
        width: 260px;
        height: 158px;
        border-radius: 6px;

        img {
          width: 100%;
          height: 100%;
        }

        .math_lable {
          position: absolute;
          left: 0;
          bottom: 0;
          line-height: 30px;
          text-align: center;
          width: 100%;
          color: #fff;
        }

        .huang {
          background: rgba(246, 162, 1, 0.6);
        }

        .blues {
          background: rgba(48, 116, 253, 0.6);
        }

        .hui {
          background: rgba(68, 68, 68, 0.8);
        }
      }

      /*竞赛信息*/
      .content {
        flex: 1;
        padding: 0 40px;
        color: #fff;
        overflow: hidden;

        .title {
          height: 30px;
          line-height: 30px;
          margin-bottom: 12px;

          .competition_name {
            font-size: 18px;
            height: 24px;
            max-width: 70%;
            overflow: hidden;
            white-space: nowrap;
            display: inline-block;
          }

          .match_type {
            margin-left: 10px;
            position: relative;
            display: inline-block;
            height: 30px;
          }

          .icon {
            display: inline-block;
            width: 30px;
            height: 30px;
            position: absolute;
            left: 0;
            top: -1px;
          }

          .label_txt {
            padding: 4px 8px 4px 36px;
            display: inline-block;
            border-radius: 20px;
            font-size: 14px;
            line-height: 14px;
          }

          .jad {
            .icon {
              background: url("~@/assets/match/jieti.png");
              background-size: 100% 100%;
            }

            .label_txt {
              background: rgba(80, 87, 255, 0.6);
              border: 1px solid #5057ff;
            }
          }

          .attack {
            .icon {
              background: url("~@/assets/match/chuantgf.png");
              background-size: 100% 100%;
            }

            .label_txt {
              background: rgba(246, 162, 1, 0.6);
              border: 1px solid rgba(246, 162, 1, 1);
            }
          }

          .new_attack {
            .icon {
              background: url("~@/assets/match/xingongf.png");
              background-size: 100% 100%;
            }

            .label_txt {
              background: rgba(255, 131, 71, 0.6);
              border: 1px solid rgba(255, 131, 71, 1);
            }
          }

          .devops {
            .icon {
              background: url("~@/assets/match/yunw.png");
              background-size: 100% 100%;
            }

            .label_txt {
              background: rgba(2, 166, 159, 0.6);
              border: 1px solid rgba(2, 166, 159, 1);
            }
          }

          .layered {
            .icon {
              background: url("~@/assets/match/layered.png");
              background-size: 100% 100%;
            }

            .label_txt {
              background: rgba(0, 84, 255, 0.2);
              border: 1px solid rgba(0, 84, 255, 1);
            }
          }

          .rw {
            .icon {
              background: url("~@/assets/match/realWorld.png");
              background-size: 100% 100%;
            }

            .label_txt {
              background: rgba(0, 84, 255, 0.2);
              border: 1px solid rgba(0, 84, 255, 1);
            }
          }

          .theory {
            .icon {
              background: url("~@/assets/match/theory.png");
              background-size: 100% 100%;
            }

            .label_txt {
              background: rgba(255, 125, 98, 0.3);
              border: 1px solid rgba(255, 125, 98, 1);
            }
          }

          .inf {
            .icon {
              background: url("~@/assets/match/xingongf.png");
              background-size: 100% 100%;
            }

            .label_txt {
              background: rgba(255, 125, 98, 0.3);
              border: 1px solid rgba(255, 125, 98, 1);
            }
          }
        }

        .info {
          color: rgb(170, 174, 186);
          font-size: 14px;
          margin-bottom: 8px;
          .brief_info {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            line-clamp: 4;
            -webkit-box-orient: vertical;
          }
        }
      }

      /*竞赛按钮*/
      .btn_box {
        width: 150px;

        .btn {
          margin: 20px auto;
          cursor: pointer;
          width: 140px;
          height: 36px;
          line-height: 36px;
          text-align: center;
        }
        .not_begin {
          background: #3074fd;
          color: #fff;
        }
        .is_begin {
          background: url("~@/assets/match/big_list_btn.png");
          background-size: 100% 100%;
          color: #fff;
        }
        .is_end {
          background: #2c326e;
          color: #fff;
        }
      }
    }
  }
}
</style>
