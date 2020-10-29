<template>
  <div class="app-container">
    <el-form label-width="250px">
      <el-form-item :label="$t('selfHelp_competition.is_ranking')">
        <el-switch v-model="query.public_rank" :active-value="1" :inactive-value="0"/>
      </el-form-item>

      <el-form-item :label="$t('selfHelp_competition.is_wp')">
        <el-switch v-model="query.can_submit_writeup" :active-value="1" :inactive-value="0"/>
      </el-form-item>
      <el-form-item label="url">
        {{query.url}}
      </el-form-item>
      <!--<el-form-item label="是否开启复盘">-->
        <!--<el-switch :disabled="process!=2" v-model="query.is_replay" :active-value="1" :inactive-value="0" />-->
        <!--&nbsp;&nbsp;&nbsp;比赛结束才可以复盘-->
      <!--</el-form-item>-->

      <!--<el-form-item v-if="query.is_replay==1&&competition_type==1" label="复盘起止时间">-->
        <!--<el-date-picker-->
          <!--v-model="query.replay_start_time"-->
          <!--type="datetime"-->
          <!--value-format="yyyy-MM-dd HH:mm:ss"-->
          <!--placeholder="选择日期时间"/>-->
        <!-- - -->
        <!--<el-date-picker-->
          <!--v-model="query.replay_end_time"-->
          <!--type="datetime"-->
          <!--value-format="yyyy-MM-dd HH:mm:ss"-->
          <!--placeholder="选择日期时间"/>-->
      <!--</el-form-item>-->

      <!--<el-form-item label="开启题目讨论">-->
        <!--<el-switch v-model="query.delivery" :active-value="1" :inactive-value="0" disabled/>-->
      <!--</el-form-item>-->

      <!--<el-form-item label="态势状态">-->
        <!--<div>功能暂未开放</div>-->
      <!--</el-form-item>-->

      <!--<el-form-item label="态势展示">-->
        <!--<el-button type="success" size="mini" disabled>查看</el-button>-->
      <!--</el-form-item>-->
      <el-form-item :label="$t('selfHelp_competition.match_status')" class="matchStatus">
        <span v-show="process==1">{{$t('selfHelp_competition.no_start')}}</span>
        <span v-show="process==0">{{$t('selfHelp_competition.processing')}}</span>
        <span v-show="process==2">{{$t('selfHelp_competition.over')}}</span>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.match_control')" class="matchStatus">
        <span v-if="process==1">{{$t('selfHelp_competition.no_start')}}</span>
        <span v-else-if="process==0">
          {{query.status==1? $t('selfHelp_competition.processing'):$t('selfHelp_competition.suspended')}}&nbsp;&nbsp;&nbsp;
          <el-button v-show="query.status==2" type="success" size="mini" @click="handleSwitch(1)">{{$t('selfHelp_competition.match_continue')}}</el-button>
          <el-button v-show="query.status==1" type="danger" size="mini" @click="handleSwitch(2)">{{$t('selfHelp_competition.match_suspend')}}</el-button>
        </span>
        <span v-else="process==2">{{$t('selfHelp_competition.over')}}</span>

      </el-form-item>

      <el-form-item>
        <div class="fcenter common_btn_md" style="margin-top:50px;">
          <el-button type="primary" @click="submitForm">{{$t('question.submit')}}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getStorage, setStorage } from '@/utils/storage'

export default {
  name: 'MatchStatus',
  data() {
    return {
      id: this.$route.query.id,
      process: 1,
      competition_type: 1, // 1商业 2xctf
      query: {
        can_submit_writeup: 1,
        status: 1, // 比赛控制
        public_rank: 1, // 是否显示排名
        // delivery: 0, // 开启题目讨论
        replay_start_time: '',
        replay_end_time: '',
        is_replay: 0,
        url:'',
      }

    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.query.can_submit_writeup = getStorage('match_info', 'object').can_submit_writeup
      this.query.status = getStorage('match_info', 'object').status
      this.query.public_rank = getStorage('match_info', 'object').public_rank
      this.query.is_replay = getStorage('match_info', 'object').is_replay
      this.query.replay_start_time = getStorage('match_info', 'object').replay_start_time
      this.query.replay_end_time = getStorage('match_info', 'object').replay_end_time
      this.query.url = getStorage('match_info', 'object').url
      this.process = getStorage('match_info', 'object').process
      this.competition_type = getStorage('match_info', 'object').competition_type
    },
    submitForm() {
      this.$http.patch('/api/sponsor/event_state/' +this.id, this.query).then(res => {
        const { data } = res
        if (data.success) {
          this.$http.get('/api/sponsor/event_state/'+this.$route.query.id).then(res => {
            setStorage('match_info', res.data)
            this.initData()
            this.$notify.success({
              title:this.$t('dialog_list.tips'),
              message:this.$t('select_address.success'),
            });
          })
        } else {
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message: this.$t('api_message.'+res.message),
          });
          // this.$alert('请求异常', '警告', { confirmButtonText: '确定' })
        }
      })
    },
    handleSwitch(key) {
      this.query.status = key;
    }
  }

}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .fcenter {
    display: flex;
    align-items: center;
    justify-content: center;
    button{
      match-confirmbtn-md()
      padding:0
    }
  }
  .matchStatus span{
    color:lightblue
  }
</style>
