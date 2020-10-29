<template>
  <div class="guide_wrap" style="padding:0">
    <div class="task_list">
      <!--小于6个题目的展示-->
      <ul class="clearfix" v-if="task_data.length<=6">
        <li v-for="item in task_data" :class="{
            'liStatus1':item.status==1,
            'liStatus2':item.status==2,
            'liStatus3':item.status==3,
            'liStatus4':item.status==4,
            'liStatus5':item.status==5,
            }">
          <div class="title">
            {{item.challenge_name}}
          </div>
          <slot name="task_body" :now_item="item"></slot>
        </li>
        <li v-for="other_item in (6-task_data.length)"
          class="liStatus1"
            style="text-align:center"
        >
          <img src="@/assets/img/ad5/attack/nosome.png" alt="" style="margin-top:30%;width:55%;margin-bottom:20px;">
          <span style="color:#5f648e;width:100%;display:inline-block;font-size:14px;">{{$t('attack.question_board.no_more_question')}}</span>
        </li>
      </ul>
      <!--大于6个题目的展示-->
      <div v-else>
        <span class="prev_btn" :class="{'dis_prev':this.list_number>=0}" @click="prev_handle"></span>
        <div class="min_7">
          <ul class="one_line">
            <li v-for="item in task_data" :class="{
            'liStatus1':item.status==3,
            'liStatus2':item.status==2,
            'liStatus3':item.status==1||item.status==4||item.status==5,
            }">
              <div class="title">
                {{item.challenge_name}}
              </div>
              <slot name="task_body" :now_item="item"></slot>
            </li>
          </ul>
        </div>
        <span class="next_btn" :class="{'dis_next':Math.abs(this.list_number)==n}" @click="next_handle"></span>
      </div>
    </div>
    <div class="attack_info">
      <el-row :gutter="20">
        <el-col :span="15">
          <div class="grid-content bg-purple attack_match_info" >
            <panelBox :title="$t('attack.question_board.match_info')">
              <!--<span class="download_task_info" slot="other_button" @click="download_file">-->
                <!--<span class="el-icon-download" style="vertical-align: middle"></span>-->
                <!--<span >{{$t('attack.question_board.download_info')}}</span>-->
              <!--</span>-->
              <a :href="download_url" download class="download_task_info" slot="other_button">
                <span class="el-icon-download" style="vertical-align: middle"></span>
                <span >{{$t('attack.question_board.download_info')}}</span>
              </a>
              <div class="table_wraps" slot="content_begin">
                <div v-if="JSON.stringify(flag_data)=='{}'" style="color:#fff;">
                  {{$t('el.table.emptyText')}}
                </div>
                <div v-else>
                  <div class="tables">
                    <div>
                      <span>{{$t('attack.question_board.name')}}</span>
                      <span>{{flag_data.name}}</span>
                    </div>
                    <div>
                      <span>Token</span>
                      <span>{{flag_data.token}}</span>
                    </div>
                    <div>
                      <span>{{$t('attack.question_board.url')}}</span>
                      <span>{{flag_data.submit_url}}</span>
                    </div>
                    <div>
                      <span>{{$t('attack.question_board.type')}}</span>
                      <span>{{flag_data.method}}</span>
                    </div>
                    <div>
                      <span>{{$t('attack.question_board.mode')}}</span>
                      <span>{{flag_data.format}}</span>
                    </div>
                  </div>
                  <div class="write_flags clearfix">
                    <input type="text" :placeholder="$t('attack.question_board.enter_flag')" v-model="is_flag">
                    <button class="submit_Flag" @click="send_the_flag">
                      {{$t('modal.submit')}}
                    </button>
                  </div>
                </div>
              </div>
            </panelBox>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="grid-content bg-purple attack_view_list"  >
            <panelBox :title="$t('attack.question_board.attacked_list')">
              <ul slot="content_begin" class="view_list" v-if="attack_data.length">
                <li v-for="item in attack_data">
                  {{$t('attack.question_board.user')}} <span class="blues">{{item.attack_name}}</span> {{$t('attack.question_board.attack')}} <span class="blues">{{item.challenge_name}}</span> <time class="blues" style="float:right;">{{item.time}}</time>
                </li>
              </ul>
              <div slot="content_begin" class="view_list"  v-else>
                <div style="color:#fff;margin:30px;">
                  {{$t('el.table.emptyText')}}
                </div>
              </div>
            </panelBox>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import panelBox from '@/components/match/common/small_part/panelBox.vue'
  export default {
    name: 'attack_question_board',
    components: {
      panelBox,
    },
    props:['team_data','task_data','flag_data','attack_data','download_url','submit_url'],
    data(){
      return{
        list_number:0,
        list_width:0,
        n:0,
        marginR:0,
        is_flag:'',
        match_id:this.$route.query.event
      }
    },
    methods:{
      download_file(){
        // this.download_url({event_id:this.match_id})
        //   .then(res=>{
        //     // console.log(res.headers['content-disposition'].split('  '),'res')
        //     let disposition = res.headers['content-disposition'];
        //     console.log(res.headers['content-disposition'])
        //     const fileName = decodeURI(disposition.substring(disposition.indexOf('filename=') + 9,disposition.length));
        //     console.log(fileName,'fileName')
        //     const content = res.data;
        //     console.log(res.data,6585)
        //     const blob = new Blob([content],{type:'application.zip'});
        //     if('download' in document.createElement('a')){
        //       const elink = document.createElement('a')
        //       elink.download = fileName;
        //       elink.style.display = 'none'
        //       elink.href = URL.createObjectURL(blob)
        //       document.body.appendChild(elink);
        //       elink.click()
        //       URL.revokeObjectURL(elink.href)
        //       document.body.removeChild(elink)
        //     }else{
        //       navigator.msSaveBlob(blob,fileName)
        //     }
        //   })
      },
      send_the_flag(){
        if(this.is_flag==''){
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('selfHelp_competition.fell_flag'),
          });
        }else{
          this.submit_url('event_id='+this.match_id,{
           flag:this.is_flag
          })
            .then(res=>{
              if(res.data.success){
                this.$notify.success({
                  title:this.$t('dialog_list.tips'),
                  message:this.$t('api_message.submit_success'),
                });
              }
            })
            .catch(res=>{
            })
        }
      },
      prev_handle(){
        if(this.list_number<0){
          this.list_number++;
        }
        this.change_left()
      },
      next_handle(){
        if(Math.abs(this.list_number)<this.n){
          this.list_number--;
        }
        this.change_left()
      },
      change_left(){
        $('.one_line').css('left',this.list_number*(this.list_width+Number(this.marginR))+'px')
      },
      line_width(){
        this.marginR = $('.task_list li').eq(0).css("marginRight").split('px')[0]
        let p = 6;
        this.n = this.task_data.length-p;
        this.list_width = $('.task_list li').width();
        let w = this.list_width*this.task_data.length+this.marginR*(this.task_data.length-1)+'px';
        $('.one_line').eq(0).width(w);
      }
    },
    mounted(){
      if(this.task_data.length>6){
        this.line_width();
      }
      window.onresize=()=>{
        if(this.task_data.length>6){
          this.line_width();
          this.change_left();
        }
      }
    },
    watch:{
      task_data(val,old){
        if(val.length>6){
          this.$nextTick(()=>{
            this.line_width();
          })
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
   .download_task_info{
     cursor:pointer;
   }
</style>
