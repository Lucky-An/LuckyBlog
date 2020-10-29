<template>
  <div class="jad_box">
    <!-- 调用倒计时 -->
    <PlayerInfo style="margin-top:30px" />
    <!-- 没有题目时显示图片 -->
    <div
      v-if="subAry.length==0"
      class="no_sub"
    >
      <img
        src="@/assets/jad/context_gif.gif"
        alt
      >
    </div>
    <!--答题tab begin-->
    <div
      v-if="subAry.length>0"
      class="listcon"
    >
      <ul class="nav_tabs">
        <li
          v-for="(tab,index) in subAry"
          :key="index"
          :class="[index==active?'active':'','tab_item fcenter'] "
          @click="handleTab(index)"
        >
          <span class="sun_type ellipsis fs26 specialFont">{{ tab.name }}</span>
          <span class="hint-ss fs14">{{ tab.trues }}/{{ tab.length }}</span>
        </li>
      </ul>
      <!--答题tab end-->
      <div v-if="subAry.length>0">
        <!-- 判断题目列表长度是否引用列表组件 -->
        <card
          :task_ul="subAry[active].msg"
          :match-info="match"
          hide_some="true"
          @successAnswer="getSubList(true)"
        />
      </div>
    </div>
    <ClickHere />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ClickHere from '@/components/ClickHere'
import card from './card'
import {
  getMatchInfos,
  getChallenges,
  getReplaChallenges,
  writeups
} from '@/api/jad'
import PlayerInfo from '@/components/PlayerInfo'

export default {
  name: 'QuestionBoard',
  components: {
    ClickHere,
    card,
    PlayerInfo
  },
  data() {
    return {
      files: '',
      isCN: this.$i18n.locale == 'zh',
      active: 0, // 被点击的tab
      subAry: [], // 数据
      writeUpVisible: false, // 是否展示上传writeUp弹框
      cliData: { file: [] }, // 被单击的数据
      hasWriteup: false,
      writeFile: '', // 获取到的write文件
      token: null,
      event_id: this.$route.query.hash // 竞赛id,
    }
  },
  watch: {
    // tips_notice(val, old) {
    //   // 监听获取到的公共的题目公告。
    //   setTimeout(() => {
    //     this.getSubList(true)
    //   }, 1000)
    // }
  },
  computed: {
    ...mapGetters(['config', 'match'])
  },
  created() {
    this.$store
      .dispatch('match/getjadInfo', this.$route.query.hash)
      .then(res => {
        const data = res
        this.getSubList()
        if (data.can_submit_writeup) this.getWriteup()
      })
  },
  methods: {
    getWriteup() {
      // 获取writeup
      writeups({
        evt: this.$route.query.event
      })
        .then(res => {
          if (res.data.has_writeup == 0) {
            this.hasWriteup = false
          } else {
            this.hasWriteup = true
          }
        })
        .catch(error => {})
    },
    // 切换tab
    handleTab(index) {
      this.active = index
    },
    // 获取题目列表
    getSubList(answer) {
      let get_request = getChallenges // 非复盘列表
      if (this.match.is_replay) {
        get_request = getReplaChallenges
      } // 复盘列表
      get_request({
        evt: this.match.hash
      }).then(res => {
        if (answer) {
          this.subAry = []
        }
        const { data } = res
        for (const key in data.rows[0]) {
          this.subAry.push({ name: key, msg: data.rows[0][key] })
        }
        this.subAry.map(sub => {
          sub.length = sub.msg.length
          sub.trues = sub.msg.filter(s => {
            return s.has_solved ? s : void 0
          }).length
          return sub
        })
      })
    },
    hasWriteupChange() {
      this.hasWriteup = true
    }
  }
}
</script>

<style lang="scss" scoped>
.jad_box {
  width: 80%;
  margin: 0 auto;
  min-width: 1366px;
}
.success_icon {
  font-size: 40px;
  margin-right: 20px;
  color: successcolor;
  vertical-align: middle;
}
.nav_tabs {
  padding: 0;
  li {
    list-style: none;
    color: #fff;
    display: flex;
    justify-content: center;
  }
  align-items: center;
  height: 48px;
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0;
  .tab_item {
    position: relative;
    color: #fff;
    max-width: 16.66%;
    flex: 1;
    margin-right: 10px;
    cursor: pointer;
    margin-bottom: -2px;

    .sun_type {
      width: 55%;
      height: 40px;
      line-height: 40px;
      display: inline-block;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .hint-ss {
      padding: 1px 6px;
      position: absolute;
      border-radius: 12px;
      background: #f95d5e;
      right: 12px;
      top: 5px;
      color: #fff;
    }
  }
  .active {
    color: #fff;
    background: none;
    border-radius: 0;
    border-bottom: 4px solid #0080ff;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
}
.no_sub {
  text-align: center;
  margin-top: 5%;
}
.listcon {
  margin-top: 20px;
}
#submitWriteup-text {
  margin-top: -20px;
  margin-bottom: 20px;
  color: #fff;
}
.btn {
  cursor: pointer;
  padding: 7px 15px;
  display: inline-block;
  text-align: center;
  text-decoration: none;
  font-style: normal;
  color: #fff;
  background-blend-mode: normal, normal;
  background: #0080ff;
  border-radius: 5px;
  border: none;
  margin: 0 10px;
}
</style>
