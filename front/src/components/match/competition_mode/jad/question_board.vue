<template>
  <div class="match_box">
    <div class="no_sub" v-if="subAry.length==0">
      <img src="@/assets/img/context_gif.gif" alt />
    </div>

    <upload-writeup v-else :matchInfo="matchInfo" competition="jad" :hasWriteup="hasWriteup" @hasWriteupChange="hasWriteupChange">
      <!--答题tab begin-->
      <ul class="nav_tabs">
        <li
          v-for="(tab,index) in subAry"
          :class="[index==active?'active':'','tab_item fcenter'] "
          @click="handleTab(index)"
        >
          <span class="sun_type font_ellipsis fs26 specialFont">{{tab.name}}</span>

          <span class="hint-ss fs14">{{tab.trues}}/{{tab.length}}</span>
        </li>
      </ul>
      <!--答题tab end-->
      <task_card
        :task_ul="subAry[active].val"
        :matchInfo="matchInfo"
        :api="api"
        @successAnswer="getSubList(true)"
      ></task_card>
    </upload-writeup>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import task_card from "../../common/jieti_question_board";
import {
  getMatchInfos,
  writeups,
  submitFlags,
  submitReplayFlags,
  uploadWriteup,
  get_challenges,
  get_replay_challenges,
  downLoad_file,
  sence_url,
  addLogs,
  team_env
} from "@/api/competitionMode/solvingMode";
import UploadWriteup from "@/components/match/common/small_part/uploadWriteup";

const { mapState } = createNamespacedHelpers("match");

export default {
  name: "question_board",
  components: {
    task_card,
    UploadWriteup
  },
  data() {
    return {
      isCN: this.$i18n.locale=='CN',
      matchInfo: "",
      active: 0, //被点击的tab
      subAry: [], //数据
      writeUpVisible: false, //是否展示上传writeUp弹框
      cliData: { file: [] }, //被单击的数据
      hasWriteup: false,
      writeFile: "", //获取到的write文件
      token: null,
      event_id: this.$route.query.hash, //竞赛id,
      api: {
        getMatchInfos,
        writeups,
        submitFlags,
        submitReplayFlags,
        uploadWriteup,
        get_challenges,
        get_replay_challenges,
        downLoad_file,
        sence_url,
        addLogs,
        team_env
      }
    };
  },
  created() {
    this.getMatchInfo();
  },
  watch: {
    tips_notice(val, old) {
      //监听获取到的公共的题目公告。
      setTimeout(() => {
        this.getSubList(true);
      }, 1000);
    }
  },
  computed: {
    ...mapState(["match_data", "tips_notice"])
  },
  methods: {
    getMatchInfo() {
      //因为存储vuex是异步的,不知道什么时候请求完成，所以现在这个页面请求一次。
      this.api
        .getMatchInfos(this.event_id)
        .then(res => {
          let { data } = res;
          this.matchInfo = data;
          this.getSubList();
          if (data.can_submit_writeup) this.getWriteup();
        })
        .catch(error => {});
    },
    getWriteup() {
      //获取writeup
      this.api
        .writeups({
          evt: this.$route.query.event
        })
        .then(res => {
          if (res.data.has_writeup == 0){
            this.hasWriteup = false;
          }else{
            this.hasWriteup = true;
          }
        })
        .catch(error => {});
    },
    //切换tab
    handleTab(index) {
      this.active = index;
    },
    showSubmitWriteUp() {
      //点击展示writeUp
      this.writeUpVisible = true;
    },
    submitFile() {
      //上传文件
      // 创建一个form表单
      let formData = new FormData();
      let files = this.$refs.writeup.files;
      if (files.length == 0) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateform.file")
        });
        return;
      }
      let isJPG = false;

      this.matchInfo.file_type.forEach(item => {
        if (files[0].name.endsWith(item)) isJPG = true;
      });
      if (!isJPG) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateImg.file_err")
        });
        return false;
      }
      if (files[0].size / 1024 / 1024 > this.matchInfo.file_size) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateImg.big_size")
        });
        return;
      }
      formData.append("writeup", files[0]);
      formData.append("evt", this.$route.query.event);
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
      this.api
        .uploadWriteup(formData)
        .then(res => {
          loading.close();
          this.$refs.writeup.value = "";
          this.hasWriteup = true;
          this.$notify.success({
            title: this.$t("dialog_list.tips"),
            message: this.$t("task.writeup.upload_success")
          });
          this.writeUpVisible = false;
        })
        .catch(error => {});
    },
    getSubList(answer) {
      //获取题目列表
      let get_request = this.api.get_challenges;
      if (this.matchInfo.is_replay)
        get_request = this.api.get_replay_challenges;
      get_request({
        evt: this.matchInfo.hash
      })
        .then(res => {
          if (answer) {
            this.subAry = [];
          }
          let { data } = res;
          for (let key in data.rows[0]) {
            this.subAry.push({ name: key, val: data.rows[0][key] });
          }
          this.subAry.map(sub => {
            sub.length = sub.val.length;
            sub.trues = sub.val.filter(s => {
              return s.has_solved ? s : void 0;
            }).length;
            return sub;
          });
        })
        .catch(error => {});
    },
    hasWriteupChange(){
      this.hasWriteup = true;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~@/common/stylus/mixin.styl';

.match_box {
  min-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

.success_icon {
  font-size: 40px;
  margin-right: 20px;
  color: successcolor;
  vertical-align: middle;
}

.subject_box {
  position: relative;

  .token {
    transform: translate(0, -35px);
    width: 400px;
    margin: 0 auto -5px;
    background: url('~@/assets/img/token2.png') no-repeat center center;
    background-size: 100% 100%;
    color: fontColor-f;
    line-height: 45px;
    height: 60px;
    transition: 2s;
  }

  // tab begin
  .nav_tabs {
    align-items: center;
    height: 48px;
    border-top: 2px solid tableBorer;
    border-bottom: 2px solid tableBorer;
    display: flex;

    .active, .tab_item:hover {
    }

    .tab_item {
      position: relative;
      height: 60px;
      color: fontColor-f;
      max-width: 16.66%;
      flex: 1;
      margin-right: 10px;
      cursor: pointer;

      .sun_type {
        width: 130px;
        height: 40px;
        line-height: 40px;
      }

      .hint-ss {
        padding: 1px 6px;
        position: absolute;
        right: 0;
        top: 11px;
        border-radius: 12px !important;
        background: tabHintColot;
      }
    }
  }
}
</style>
<style lang="stylus" rel="stylesheet/stylus">
@media (max-width: 1300px) {
  .match_box {
    width: 1200px;
  }
}

@media (min-width: 1300px) and (max-width: 1650px) {
  .match_box {
    width: 1200px;
  }
}

@media (min-width: 1650px) {
  .match_box {
    width: 1400px;
  }
}
</style>
