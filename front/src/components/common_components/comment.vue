<template>
  <div class="comment">
    <div class="all_moment">
      <span class="all_moment_title">{{$t('comment.allComment')}}</span>
      <span class="moment_number">
        （{{pager.total+$t('comment.item')}}）
      </span>
      <button class="send_comment_btn" @click="emitComment">{{$t('comment.comments')}}</button>
    </div>
    <div class="comment_content"  v-if="show_comment_text">
      <v-replay  class="mrg20T"
                @setId="resetId"
                :taskId = "task_id"
                 :userId = "user_id"
                :replay_data="new_one_level"
                 rep_id=""
                @updateComment="uploadComment"
                ></v-replay>
    </div>
    <div class="other_comment">
      <ul class="comment_list" v-if="comment_list.length">
        <li class="floor comment_first_floor" v-for="(item,i) in comment_list">
          <div class="first_line">
            <v-comment :replay_data="item" @replayId="p_replay_box" @add_like="add_thump" @deleteHandle="getAllComment"></v-comment>
            <v-replay v-if="item.id==pid"
                      @setId="resetId"
                      :taskId = "task_id"
                      :userId = "user_id"
                      :replay_data="item"
                      :rep_id="item.user_id"
                      @updateComment="uploadComment"
                      ></v-replay>
          </div>
          <ul class="second_line" v-if="item.children.length">
            <div v-if="item.children.length<2">
              <li v-for="(child,child_i) in item.children" >
                <div>
                  <v-comment :replay_data="child" @replayId="p_replay_box" @add_like="add_thump" @deleteHandle="getAllComment"></v-comment>
                  <v-replay v-if="child.id==pid"
                            @setId="resetId"
                            :replay_data="item"
                            :rep_id="child.user_id"
                            :taskId = "task_id"
                            :userId = "user_id"
                            @updateComment="uploadComment"
                            ></v-replay>
                </div>
              </li>
            </div>
            <div v-else>
              <div v-if="showTwoList.indexOf(item.id)!==-1">
                <li >
                  <div>
                    <v-comment :replay_data="item.children[0]" @replayId="p_replay_box" @add_like="add_thump" @deleteHandle="getAllComment"></v-comment>
                    <v-replay v-if="item.children[0].id==pid"
                              @setId="resetId"
                              :replay_data="item"
                              :rep_id="item.children[0].user_id"
                              :taskId = "task_id"
                              :userId = "user_id"
                              @updateComment="uploadComment"
                              ></v-replay>
                  </div>
                </li>
                <li >
                  <div>
                    <v-comment :replay_data="item.children[1]" @replayId="p_replay_box" @add_like="add_thump" @deleteHandle="getAllComment"></v-comment>
                    <v-replay v-if="item.children[1].id==pid"
                              @setId="resetId"
                              :replay_data="item"
                              :rep_id="item.children[1].user_id"
                              :taskId = "task_id"
                              :userId = "user_id"
                              @updateComment="uploadComment"
                              ></v-replay>
                  </div>
                </li>
              </div>
              <div v-else>
                <li v-for="(child,child_i) in item.children" >
                  <div>
                    <v-comment :replay_data="child" @replayId="p_replay_box" @add_like="add_thump" @deleteHandle="getAllComment"></v-comment>
                    <v-replay v-if="child.id==pid"
                              @setId="resetId"
                              :replay_data="item"
                              :rep_id="child.user_id"
                              :taskId = "task_id"
                              :userId = "user_id"
                              @updateComment="uploadComment"
                              ></v-replay>
                  </div>
                </li>
              </div>
            </div>
            <div >
              <div v-if="item.children.length>2">
                <span class="fl change_box"
                        v-if="item.showAll"
                        @click="showAllReplay(item,i)"
                  >{{$i18n.locale=='CN'? "共"+item.replay_number+"条回复" : "Total "+item.replay_number+" replies"}}</span>
                  <span class="fr change_box" style="text-decoration: none;" v-else @click="hideAllReplay(item,i)">
                    <span >{{$t('comment.retract')}}</span>
                    <span class="el-icon-caret-top"></span>
                  </span>
              </div>
            </div>
          </ul>
        </li>
      </ul>
      <div v-else style="padding-top:60px;text-align:center;">
        <img src="@/assets/img/kong.png" alt="">
      </div>
    </div>
    <div style="margin-top:30px;">
      <v-page
              v-show="pager.total>pager.pageSize"
              :total="pager.total"
              :page.sync="pager.currentPage"
              :limit.sync="pager.pageSize"
              :layout="pager.layout"

              @pagination="getAllComment"
      ></v-page>
    </div>
  </div>
</template>

<script>
  import imgCode from '@/components/common_components/img_code'
  import page from '@/components/common_components/pagination'

  export default {
    components: {
      "v-page":page,
      "v-comment": {
        props: ['replay_data'],
        template: `
              <div>
                <div class="comment_main">
                  <span class="human_icon" :style="{backgroundImage: 'url('+ replay_data.logo +')',backgroundSize:'cover' }"></span>
                  <div class="comment_detail">
                    <div class="line1">
                      <span class="human_name">
                        {{replay_data.replay_name}}
                        <span v-if="!replay_data.replayed_name==null||!replay_data.replayed_name==''">
                          <span class="rep">{{$t('comment.replay_btn')}}</span>
                          {{replay_data.replayed_name}}
                        </span>
                      </span>
                      <span class="comment_time">{{replay_data.time | dateformat2}}</span>
                    </div>
                    <div class="comment_txt">{{replay_data.content}}</div>
                  </div>
                </div>
                <div class="comment_handle">
                  <span class="replay" @click="show_replay_box(replay_data)">
                    <i class="iconfont icon-huifu"></i>
                    <span>{{$t('comment.replay_btn')}}</span>
                  </span>
                  <span class="appreciate" :class="{'appreciate_active':replay_data.is_thump}" @click="comment_like(replay_data)">
                    <i class="iconfont icon-dianzan"></i>
                    <span>{{replay_data.thump}}</span>
                  </span>
                  <span class="delete" v-if="replay_data.is_myself" @click="deleteComment">
                    <i class="el-icon-delete"></i>
                    <span>{{$t('comment.del')}}</span>
                  </span>
                </div>
              </div>
        `,
        methods: {
          show_replay_box (item) {
            this.$emit('replayId', item.id);
          },
          comment_like(data){
            this.$emit('add_like',data)
          },
          deleteComment(){
            this.$confirm(this.$t('comment.del_tips'), this.$t('dialog_list.tips'), {
              confirmButtonText: this.$t('modal.confirm'),
              cancelButtonText: this.$t('modal.cancel'),
              customClass:'public_confirm public_confirm_sm no_head',
              type: 'warning'
            }).then(() => {
              this.$http.delete('/api/tasks/task_comment/'+this.replay_data.id)
                .then((res)=>{
                  if(res.data.success){
                    this.$emit('deleteHandle');
                    this.$notify.success({
                      title:this.$t('dialog_list.tips'),
                      message:this.$t('comment.success'),
                    });
                    // this.$message({
                    //   message:this.$t('common.success'),
                    //   type: 'success'
                    // });
                  }
                })
                .catch((err)=>{

                })
            }).catch(() => {
              this.$notify.info({
                title:this.$t('dialog_list.tips'),
                message:this.$t('comment.cancel'),
              });
              // this.$message({
              //   type: 'info',
              //   message: this.$t('common.cancel')
              // });
            });
          }
        }
      },
      'v-replay': {
        components:{
          "v-imgCode":imgCode,
        },
        props: ['index','uidImg','taskId','replay_data','rep_id','userId'],
        data () {
          return {
            new_data: '',
            ruleForm: {
              desc: '',
              uuid:''
            },
            new_img_code:'',
            rules: {
              desc: [
                {required: true, message: this.$t('comment.comment_tips'), trigger: 'blur'}
              ],
              uuid: [
                {required: true, message: this.$t('validateform.code'), trigger: 'blur'}
              ]
            }
          }
        },
        template: `
                <div class="replay_main replay_box">
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" @submit.native.prevent>
                      <el-form-item  prop="desc">
                        <el-input type="textarea" v-model="ruleForm.desc" rows="1" :placeholder="$t('comment.comment_tips')"></el-input>
                      </el-form-item>
                      <el-form-item  prop="uuid" >
                        <v-imgCode @sendImgCode="getImgCode" ref="imgCode"></v-imgCode>
                      </el-form-item>
                      <el-form-item>
                        <el-button class="send_btn pad0A fr mrg0R" @click="submitForm('ruleForm')">{{$t('comment.comment_btn')}}</el-button>
                        <el-button  class="cancel pad0A fr mrg30R" @click="clearId">{{$t('modal.cancel')}}</el-button>
                      </el-form-item>
                    </el-form>
                </div>
              `,
        methods: {
          clearId () {
            if(this.replay_data.is_one_level){
              this.$emit('setId', {
                status:1
              })
            }else{
              this.$emit('setId', {
                status:2
              })
            }

          },
          submitForm (formName) {
            this.$refs.imgCode.initUUid();
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.$http.post('/api/tasks/task_comment',{
                  content:this.ruleForm.desc,
                  task_id:this.taskId,
                  parent_id:this.replay_data.id,
                  image_code:this.ruleForm.uuid,
                  image_code_id:this.new_img_code,
                  user_id:this.userId,
                  replayed_id:this.rep_id
                })
                  .then((res)=>{
                    if(res.data.success){
                      this.$emit('updateComment')
                      this.ruleForm.desc = '';
                    }
                  })
                  .catch((err)=>{
                  })
              } else {
                return false;
              }
            })
          },
          getImgCode(val){
            this.ruleForm.uuid = val.img_code;
            this.new_img_code = val.img_auth_code;
          }
        }
      }
    },
    name: 'comment',
    props:['task_id','user_id','getUrl'],
    data(){
      return{
        pager: {//页码
          currentPage: 1,//当前第几页
          pageSize: 15,//每页多少条
          total: 0,//总共多少条
          layout: 'prev, pager, next',
          class:'bluepage'
        },
        new_one_level:{
          children:[],
          content:"",
          id:"",
          is_thump:false,
          logo:"",
          parent_id:"",
          replay_name:"",
          replay_number:0,
          replayed_id:"",
          replayed_name:"",
          thump:0,
          time:"",
          user_id:"",
          is_one_level:true
        },
        ruleForm: {
          content:'',
        },
        rules: {
          content: [
            { required: true, message: this.$t('comment.comment_tips'), trigger: 'blur' }
          ]
        },
        show_comment_text:false,
        pid:'',
        showTwoList:[],
        comment_list:{},
      }
    },
    created(){
      this.getAllComment();
    },
    methods:{
      getAllComment(){
        this.$http.get(this.getUrl+this.task_id,{
          limit:this.pager.pageSize,
          offset:(this.pager.currentPage-1)*this.pager.pageSize,
        })
          .then((res)=>{
            this.comment_list = res.data.rows;
            this.pager.total = res.data.total;
            this.comment_list.forEach((item)=>{
              item.new_replay = [];
              if(item.children.length>2){
                this.showTwoList.push(item.id);
                item.showAll = true;
              }
            })
          })
          .catch((err)=>{

          })
      },
      uploadComment(){
        this.getAllComment();
        this.pid = '';
        this.show_comment_text = false;
        this.$notify.success({
          title:this.$t('dialog_list.tips'),
          message:this.$t('comment.add_success'),
        });
        // this.$message({
        //   message:this.$t('common.add_success'),
        //   type: 'success'
        // });
      },
      emitComment(){
        this.show_comment_text = true;
      },
      p_replay_box(val){
        this.pid = val;
      },
      resetId(val){
        if(val.status==1){
          this.show_comment_text = false;
        }else{
          this.pid = '';
        }
      },
      showAllReplay(item,i){
        var index = this.showTwoList.indexOf(item.id);
        if (index > -1) {
          this.showTwoList.splice(index, 1);
        }
        this.comment_list[i].showAll = false;
      },
      hideAllReplay(item,i){
        var index = this.showTwoList.indexOf(item.id);
        if (index == -1) {
          this.showTwoList.push(item.id)
        }
        this.comment_list[i].showAll = true;
      },
      add_thump(val){//点赞
        if(val.is_thump){
          return;
        }
        this.$http.post('/api/tasks/task_comment_like',{
          is_up:true,
          comment_id:val.id
        })
          .then((res)=>{
            if(res.data.success){
              val.is_thump = true;
              val.thump++;
            }
          })
          .catch((err)=>{

          })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.comment
  .all_moment
    border-bottom:1px solid borderColor;
    padding-bottom:18px;
    padding-top:18px;
    position:relative;
    .all_moment_title
      color:white;
      font-size:22px;
    .moment_number
      font-size:14px;
      color:darkblue2;
    .send_comment_btn
      confirm-btn-md()
      position:absolute;
      right:0;
      top:5px;
      cursor:pointer;
  .comment_content
    width:100%;
    .send_comment
      width:100%;
      padding:20px 26px 0;
  .other_comment
    .comment_list
      text-align:left;
      .floor
        border-bottom:1px solid borderColor;
        padding-top:8px;
      .comment_first_floor
        padding-bottom:10px;
        .second_line
          background:#121f30;
          margin-left:46px;
          padding:14px 14px 20px;
          margin-bottom:10px;
          .all_replay_tips
            color:white;
            font-size:14px;
            cursor:pointer;

</style>
<style lang="stylus" rel="stylesheet/stylus">
  .first_line,.second_line {
    .rep{
      color:darkblue2;
    }
    .change_box{
      color:darkblue2;
      text-decoration:underline;
      cursor:pointer;
    }
    .comment_main {
      position: relative;
    }

    .human_icon {
      width: 45px;
      height: 45px;
      background-size: cover;
      background-position: center center;
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 0;
      border: 1px solid rgba(255, 255, 255, .3)
    }

    .comment_detail {
      padding: 3px 65px 0;
    }

    .line1 {
      margin-bottom: 5px;
    }

    .human_name {
      color: white;
      font-size: 16px;
      margin-right: 12px;
    }

    .comment_time {
      font-size: 14px;
      color: darkblue2;
    }

    .comment_txt {
      font-size: 14px;
      color: darkblue2;
      line-height: 20px;
      word-wrap: break-word;
    }

    .comment_handle {
      padding-top: 20px;
    }

    .replay, .appreciate,.delete {
      color: darkblue2;
      cursor:pointer;
    }
    .appreciate_active{
      color:lightblue;
    }
    span {
      font-size: 14px;
    }

    .replay,.appreciate {
      margin-right: 20px;
    }

    .replay_main {
      padding-top: 10px;
    }
  }
  .replay_box{
    textarea,input{
      width:100%;
      resize:none;
      card_style();
      border-radius:5px;
      color:white;
      padding:10px;
      outline:none;
      &:hover{
        border-color:lightblue!important;
      }
    }
      .send{
      text-align:right
      margin-top:10px;}
      .send_btn,.cancel{
      width:104px;
      height:28px;
      line-height:28px;
      border:none;
      cursor:pointer;}
      .send_btn{
      color:white;
      set_bg('button/lan1.png');
      margin-right:15px;}
      .cancel{
      color:darkblue2;
      set_bg('button/lan.png');}
  }
.second_line{
  margin-top:20px;
  li{
    border-bottom:1px solid borderColor;
    margin-bottom:9px;
    padding-bottom:9px;
    .comment_handle{
      padding-top:8px;
    }
  }
}
</style>
