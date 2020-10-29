<template>
  <div class="watch">
    <header class="myHeader">
      <!--中间logo-->
      <div class="logo_box">
        <img :src="logo" alt="">
      </div>
      <!--中间logoend-->
    </header>

    <div class="watch_box">
      <div class="title">
        观众席
        <span class="length">
          （当前有{{ list.length }}场进行中赛事可供查看）
        </span>
      </div>

      <ul class="watch_list">
        <li v-for="(item,index) in list" :key="index">
          <p class="index">
            {{ index+1 }}
          </p>
          <p class="name ellipsis">
            {{ item.name_zh }}
          </p>
          <p class="type">
            {{ type[item.type].name }}
          </p>
          <p class="button_box">
            <router-link
              :to="{
                path:type[item.type].rank,
                query:{
                  id:item.contest_id,
                  hash:item.hash,
                  watch:true,
                  type:item.type
                }
              }"
              target="_blank"
              style="margin-right: 15px;"
            >
              <el-button type="primary">排行榜</el-button>
            </router-link>
            <router-link
              :to="{
                path:type[item.type].trend,
                query:{
                  id:item.contest_id,
                  hash:item.hash,
                  watch:true,
                  type:item.type
                }
              }"
              target="_blank"
            >
              <el-button type="primary">趋势图</el-button>
            </router-link>
            <router-link
              v-if="item.type===1||item.type===2"
              :to="{
                path:type[item.type].attackRank,
                query:{
                  id:item.contest_id,
                  hash:item.hash,
                  watch:true,
                  type:item.type
                }
              }"
              target="_blank"
              style="margin-left: 15px;"
            >
              <el-button type="primary">攻击榜</el-button>
            </router-link>
          </p>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { getWatch } from '@/api/match'

export default {
  name: 'Match',
  data() {
    return {
      id: this.$route.query.id,
      logo: '',
      list: [],
      type: {
        // 7种路由地址，对应不同的竞赛模式 竞赛类型 1攻防 2新攻防 3运维 4解题 5闯关 6rw 7理论
        1: {
          name: '攻防赛',
          rank: '/attack/ranking',
          trend: '/attack/trend',
          attackRank: '/attack/attackRanking'
        },
        2: {
          name: '新攻防赛',
          rank: '/newAttack/ranking',
          trend: '/newAttack/trend',
          attackRank: '/newAttack/attackRanking'
        },
        3: {
          name: '运维赛',
          rank: '/devops/ranking',
          trend: '/devops/trend'
        },
        4: {
          name: '解题赛',
          rank: '/jad/ranking',
          trend: '/jad/trend'
        },
        5: {
          name: '闯关赛',
          rank: '/layered/ranking',
          trend: '/layered/trend'
        },
        6: {
          name: 'realword',
          rank: '/rw/ranking',
          trend: '/rw/trend'
        },
        7: {
          name: '理论赛',
          rank: '/theory/ranking',
          trend: '/theory/trend'
        },
        8: {
          name: '渗透赛',
          rank: '/inf/ranking',
          trend: '/inf/trend'
        }
      }
    }
  },
  created() {
    this.getWatch()
  },
  methods: {
    getWatch() {
      getWatch().then(res => {
        this.logo = res.data.logo
        this.list = res.data.list
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .watch {
    color: #fff;

    .myHeader {
      width: 100%;
      height: 100px;
      display: flex;
      background: url("~@/assets/common/tou.png");
      background-position: bottom;
      justify-content: center;
      z-index: 999;

      .logo_box {
        width: 495px;
        height: 100px;
        text-align: center;

        img {
          max-width: 380px;
          max-height: 100%;
        }
      }

      .system {
        position: absolute;
        right: 20px;
        height: 60px;
        line-height: 60px;
      }
    }

    .watch_box {
      padding: 56px 200px;
    }

    .title {
      padding-left: 28px;
      height: 60px;
      line-height: 60px;
      font-size: 24px;
      font-weight: bold;
      background: #242b75;
      margin-bottom: 20px;
      .length {
        font-size: 16px;
        font-weight: normal;
      }
    }

    .watch_list {
      padding: 0;
      li {
        padding: 0;
        margin: 0;
        list-style: none;
        height: 100px;
        line-height: 100px;
        background: #181b44;
        margin-bottom: 20px;
        display: flex;
        .index{
          width: 100px;
          text-align: center;
          font-size: 24px;
          font-weight: 700;
        }
        .name{
          flex: 1;
        }
        .type{
          width: 100px;
          font-size: 18px;
        }
        .button_box{
          flex: 1;
          text-align: center;
        }
      }

    }
  }
</style>
