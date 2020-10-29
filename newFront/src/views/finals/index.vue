<template>
  <div class="finals">
    <div class="video_box">
      <video
        autoplay
        muted
        loop="loop"
        style="width:100%; height:100%; object-fit: fill;position:absolute;left:0;top:0;z-index:0"
      >
        <source src="@/assets/media/new.mp4">
      </video>
    </div>

    <header class="myHeader">
      <!--中间logo-->
      <div class="logo_box">
        <img :src="logo" alt="">
      </div>
      <!--中间logoend-->
      <div class="system">
        <switchLanguage />
      </div>
    </header>

    <div class="rank_box">
      <el-table
        class="threestyle"
        :data="score"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          width="100"
          :label="$t('ad5.personal.rank')"
          align="center"
          class-name="bor_l1"
        />
        <el-table-column
          class-name="namelie"
          :label="$t('ad5.referee.table.team_name')"
          width="300"
        >
          <template slot-scope="scope">
            <div class="user_name fcenter" style="height:36px;justify-content:left;">
              <span
                v-if="scope.row.team_logo"
                class="obj_logo"
                :style="'background:url('+scope.row.team_logo+');background-size:cover;background-position:center center;'"
              />
              <span
                v-else-if="scope.row.obj_logo"
                class="obj_logo"
                :style="'background:url('+scope.row.obj_logo+');background-size:cover;background-position:center center;'"
              />
              <span v-else class="obj_logo def_logo" />
              <span v-if="getStrNumber(scope.row.name,20,15)" class="marque_box">
                <span>{{ scope.row.name }}</span>
              </span>
              <span v-else class="marque_box">
                <span class="marquee">{{ scope.row.name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.name }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-for="item in table_header"
          :key="item.name"
          align="center"
          :label="$i18n.locale=='zh' ? item.title_zh : item.title_en"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[item.type] ? scope.row[item.type] : 0 }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="all_score"
          :label="$t('ad5.referee.table.sum_score')"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import { getFinals } from '@/api/match'
import { getStrNumber } from '@/utils'
import switchLanguage from '@/components/switchLanguage'

export default {
  name: 'Index',
  components: {
    switchLanguage
  },
  data() {
    return {
      logo: '',
      table_header: [],
      score: [],
      getStrNumber,
      timer: null
    }
  },
  created() {
    setInterval(() => {
      this.timer = this.getList()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    getList() {
      getFinals().then(res => {
        const { data } = res
        this.logo = data.logo
        this.nav_name = data.nav_name
        this.score = data.score
        data.nav_name.forEach((item) => {
          for (var attr in item) {
            this.table_header.push({
              type: attr,
              title_zh: item[attr].zh,
              title_en: item[attr].en
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .finals {
    position: relative;

    .video_box {
      min-width: 1366px;
      width: 100%;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      z-index: -1;

      video {
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
    }

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

    .rank_box {
      padding: 56px 200px;
      .obj_logo {
        width: 30px;
        height: 28px;
        border-radius:50%;
        border: 1px solid rgba(255, 255, 255, .1);
        display: inline-block;
        margin-top: -5px;
        margin-right: 8px;
      }

      .def_logo {
        background: url('~@/assets/match/def_icon.jpg');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center center;
      }

      .marque_box {
        display: inline-block;
        width: 230px;
        overflow: hidden;
        text-align: left;
      }
    }
  }
</style>
<style lang="scss">
  .threestyle {
    color: #fff;
    font-size: 16px;
   thead tr {
      background: rgba(4,136,245,.8);
    }
    th.is-leaf{
      border: none;
    }
    thead tr th {
      background: none;
    }
    tr td {
      background: rgba(0,11,52,.8);
    }
    tr td:not(.namelie) * {
      font-size: 18px;
      font-weight: bold;
    }

    tr:nth-child(1) td * {
      color: #ffc120;
      font-weight: bold;
      font-size: 20px;
      font-style: italic;
    }

    tr:nth-child(2) td * {
      color: #b9e0ff;
      font-weight: bold;
      font-size: 20px;
      font-style: italic
    }

    tr:nth-child(3) td * {
      color: #e57c5e;
      font-weight: bold;
      font-size: 20px;
      font-style: italic
    }

    tr:nth-child(1) td:nth-child(1) {
      padding: 0 ;

      .cell div {
        height: 40px;
        background: url('~@/assets/match/1.png') no-repeat center center;
        color: rgba(0, 0, 0, 0);
      }
    }

    tr:nth-child(2) td:nth-child(1) {
      padding: 0 ;

      .cell div {
        height: 30px;
        background: url('~@/assets/match/2.png') no-repeat center center;
        color: rgba(0, 0, 0, 0)
      }
    }

    tr:nth-child(3) td:nth-child(1) {
      padding: 0 ;

      .cell div {
        height: 30px;
        background: url('~@/assets/match/3.png') no-repeat center center;
        color: rgba(0, 0, 0, 0)
      }
    }
  }
</style>
