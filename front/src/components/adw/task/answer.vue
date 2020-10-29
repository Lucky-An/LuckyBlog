<template>
  <div class="wrap_size question_answer_box">
    <div class="sheet_top clearfix">
      <router-link class="go_back2 fl"
                   :to="{path:'/task/task_list',query: {type: task_type,number:task_number,grade:task_grade}}">
        {{$t('task.returnView')}}
      </router-link>
      <div class="fl past_time" v-cloak>
        <span id="write_time">{{$t('task.taskConsumeTime')}}:
          <span class="font18" v-html="use_time"></span>
        </span>
        <i class="star_ico"></i>
      </div>
      <div class="fr clearfix get_reward">
        <div class="someScore fl mrg30R">
          <i class="scoreIco mrg5R"></i>
          <span class="mrg5R">{{task_type}}</span>
          <span> {{$t('task.taskScore')}}:</span>
          <span class="score_num yellow">{{task_data.points}}{{$t('task.score')}}</span>
        </div>
        <div class="this_score fl">
          <i class="jinbi mrg5R"></i>
          <span class="this_type">{{$t('task.taskGold')}}:</span>
          <span class="money_num yellow">{{task_data.coin}}{{$t('task.number')}}</span>
        </div>
      </div>
    </div>
    <div class="important_content clearfix">
      <div class="answer_wrap">
        <div class="answer_box_parent">
          <div class="answer_box_child" v-loading="loading">
            <div class="mes_bg" v-if="!onOff" @click="show_message"></div>
            <div class="task_name">{{task_data.name}}</div>
            <div class="task_difficulty bottom_spacing">
              <span class="task_inner_label">{{$t('task.taskDifficulty')}}：</span>
              <span class="diff_num" :class="taskWeight"></span>
            </div>
            <div class="task_source bottom_spacing">
              <span class="task_inner_label">{{$t('task.taskSource')}}：</span>
              <span v-if="task_data.tag==null">{{$t('task.none')}}</span>
              <span class="task_source_icon" v-else>{{task_data.tag}}</span>
            </div>
            <div class="task_describe bottom_spacing">
              {{$t('task.taskDescribe')}}：<span :class="{'describe_txt':addDes}">{{task_data.description==null||task_data.description=='' ? $t('task.none') : task_data.description}}</span>
            </div>
            <div class="task_scene bottom_spacing">
              <span class="task_inner_label" v-show="!task_data.is_dynamic_env">{{$t('task.taskScene')}}：</span>
              <sence ref="sence"
                     :task_hash="task_data.task_hash"
                     url_front="/api/env/"
                     v-if="task_data.is_dynamic_env"></sence>
              <span v-show="!task_data.is_dynamic_env">{{$t('task.none')}}</span>
            </div>
            <div class="task_attachment bottom_spacing">
              <span class="task_inner_label">{{$t('task.taskAttachment')}}：</span>
              <span class="attachment_list" v-if="task_data.attach!==null">
                <a :href="attach" download class="topic_attach" v-for="(attach,i) in task_data.attach">{{$t('question.attach')+i}}</a>
              </span>
              <span v-else>{{$t('task.none')}}</span>
            </div>
            <div class="task_handle">
              <span v-if="task_data.has_writeup">
                <button type="button"
                        class="look_writeup"
                        @click="getWriteup"
                        v-if="!task_data.best_writeup==null">
                        {{$t('task.optimumWriteup')}}
                  <span>
                    {{task_data.best_writeup.length>8 ? task_data.best_writeup.substring(0,8)+'…' : task_data.best_writeup}}
                  </span>
                    {{$t('task.provide')}}
                </button>
                <button type="button" class="look_writeup" @click="getWriteup"
                        v-else>{{$t('task.writeup.lookWriteup')}}</button>
              </span>
              <button type="button" class="task_advice" @click="visibleAdvice=true">{{$t('task.advice.taskAdvice')}}
              </button>
            </div>
            <div class="submit_answer" v-if="!task_data.has_solved">
              <el-form :model="ruleForm"
                       :rules="rules"
                       ref="ruleForm"
                       class="demo-ruleForm"
                       @submit.native.prevent
              >
                <el-form-item prop="name">
                  <el-input v-model="ruleForm.name" placeholder="flag.." class="write_input"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')" class="submit_flag">{{$t('modal.submit')}}
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="has_solved_btn" v-else>
              <div class="has_solved">
                {{$t('task.questionSolved')}}
              </div>
            </div>
            <span class="view_comments " v-if="task_data.has_solved||task_data.has_ask_writeup">
              <span v-if="view_status" @click="hide_comment">
                <i class="el-icon-arrow-up"></i>
                <span>{{$t('comment.hide_comment')}}</span>
              </span>
              <span v-else @click="show_comment">
                <i class="el-icon-arrow-down"></i>
                <span>{{$t('comment.look_comments')}}</span>
              </span>
            </span>
          </div>
          <div class="upload_wp" v-if="task_data.has_solved&&task_data.need_writeup">
            <p class="describe">{{$t('task.rememberUpload')}}</p>
            <p class="btn" @click="showUpload">{{$t('task.upload_now')}}</p>
          </div>
        </div>
        <div class="comment_wrap" v-if="view_status">
          <comment
                  :task_id="now_id"
                  :user_id="user_id"
                  getUrl="/api/tasks/task_comment/"
          ></comment>
        </div>
      </div>
      <div class="message_wrap" v-if="onOff">
        <div class="message_box_parent">
          <div class="message_box_child">
            <div class="real_time_title">
              {{$t('task.message')}}
            </div>
            <div class="message_content_wrap">
              <ul class="message_content">
                <li v-for="item in message">
                  <div class="message" v-html="$i18n.locale=='EN' ? item.content_en : item.content">
                  </div>
                  <div style="text-align:right;">
                    <time>{{item.date}}</time>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="banner_box">
          <el-carousel>
            <el-carousel-item v-for="item,index in banner" :key="index" style="width:100%;height:100%;">
              <a :href="item.link" target="_blank">
                <img :src="item.img" alt="" style="width:100%;height:100%;">
              </a>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="pull_message" @click="hide_message"></div>
      </div>
    </div>
    <el-dialog
            :title="$t('task.answer_success_tips')"
            :visible.sync="dialogVisible"
            width="740px"
            custom-class="ad_public_modal success_answer">
      <div class="task_star">
        <span style="vertical-align: middle;">{{$t('task.difficulty')}}</span>
        <span class="star" v-for="item in task_data.weight_score"></span>
      </div>
      <div class="task_group">
        <div class="use_time">
          <span>{{$t('task.consume')}}:</span>
          <span>{{ answer_time | dateformat()}}</span>
        </div>
        <div class="get_score">
          <span>{{$t('task.taskScore')}}:</span>
          <span>{{successed_data.points}}</span>
        </div>
        <div class="get_gold">
          <span>{{$t('task.gold')}}:</span>
          <span class="get_animate">{{successed_data.coin}}</span>
        </div>
      </div>
      <div class="additional">
        <div class="label">{{$t('task.additional')}}</div>
        <div class="additional_box">
          <img class="click_box" @click="get_some_reward" v-if="showimg" src="@/assets/img/answer/click_get.png"
               alt="">
          <div class="main gold_parent" v-if="showgold">
            <div class="item1">
              <div class="kodai">
                <img src="../../../../static/img/jb/kd2.png" class="full"/>
                <img src="../../../../static/img/jb/kd1.png" class="empty"/>
              </div>
              <div class="clipped-box"></div>
            </div>
            <p id="html"></p>
          </div>
          <div class="get_reward">
            <img src="@/assets/img/answer/jinbi1.png" alt="">
            <div class="add_reward">
              <span>{{$t('task.goldAdd')}}</span>
              <span class="reward_gold">{{reward_coin}}</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="task_data.need_writeup" @click="showUpload">{{$t('task.writeup.uploadWriteup')}}</el-button>
        <el-button type="primary" @click="goComment">{{$t('task.comment_show')}}</el-button>
        <el-button type="primary" v-if="successed_data.next_task!==null" @click="reloadView" class="mrg30L">{{$t('task.next')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
            :title="$t('task.advice.taskAdvice')"
            :visible.sync="visibleAdvice"
            width="640px"
            custom-class="ad_public_modal ordinary">
      <el-form :model="adviceForm" :rules="adviceRules" ref="adviceForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="$t('task.advice.suggestion')" prop="advice">
          <el-input type="textarea" v-model="adviceForm.advice" :placeholder="$t('task.advice.writeAdvice')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('validatePhone.code')" prop="uuid" class="mrg15T">
          <img_code @sendImgCode="getImgCode" ref="changs"></img_code>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAdvice('adviceForm')">{{$t('modal.submit')}}</el-button>
        <el-button type="primary" @click="visibleAdvice=false" class="mrg30L">{{$t('modal.cancel')}}</el-button>
      </span>
    </el-dialog>

    <!--上传wp弹窗 begin-->
    <el-dialog
            :title="$t('task.writeup.uploadWriteup')"
            :visible.sync="writeupShow"
            width="700px"
            custom-class="ad_public_modal writeup">
      <div class="task_info clearfix">
        <div class="clearfix">
          <div class="task_title">
            {{$t('task.taskTitle')}}：{{upload_writeup.task_name}}
          </div>
          <div class="task_star ">
            <span>{{$t('task.difficulty')}}</span>
            <span class="star" v-for="item in upload_writeup.task_weight"></span>
          </div>
        </div>
        <el-form :model="writeupForm" :rules="writeupRules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="Writeup" prop="file">
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    :http-request="uploadFile"
                    :limit="1"
                    :on-remove="remove"
                    :on-change="changes"
                    accept='.png,.pdf,.md'
                    action="customize"
                    :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary" style="margin-left:0;" class="btn">
                {{$t('task.writeup.selectFile')}}
              </el-button>
              <div slot="tip" class="el-upload__tip">{{$t('task.writeup.upload_rule')}}</div>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('validatePhone.imgValidate')" prop="image_code" style="margin-bottom:-20px;">
            <img_code @changeCode="changeCode" @sendImgCode="getImgCode1" ref="imgCode"></img_code>
          </el-form-item>
        </el-form>
        <el-input
                style="margin-top:20px;"
                :placeholder="$t('task.writeup.upload_tips')"
                maxlength="20"
                v-model="upload_writeup.thinking">
        </el-input>
        <div class="gold_tips">
          <span>{{$t('task.writeup.uploader_txt')}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="writeupShow = false">{{$t('modal.cancel')}}</el-button>
        <el-button type="primary" @click="submitUpload('ruleForm')">{{$t('modal.submit')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {genClips, jbPao, pao_animate} from '@/utils/goldAnimate'
  import {setStorage, getStorage} from '@/utils/storage'
  import {dateformat} from '@/utils/dateformat'
  import sence from '@/components/common_components/sence'
  import comment from '@/components/common_components/comment'
  import {createNamespacedHelpers} from 'vuex'
  import img_code from '@/components/common_components/img_code'

  const {mapMutations} = createNamespacedHelpers('match')

  export default {
    name: 'answer',
    inject: ['reload'],
    components: {
      sence,
      comment,
      img_code
    },
    data () {
      return {
        upload_writeup: {
          task_name: '',
          task_weight: 0,
          upload_writeup_price: 0,
          attach_url: '',
          thinking: '',
        },
        writeupForm: {
          image_code_id: '',
          image_code: '',
          event: this.$route.query.event,
          file: '',
        },
        writeupRules: {
          image_code: [
            {required: true, message: this.$t('dialog_list.write_img_code'), trigger: 'blur'},
          ],
          file: [
            {required: true, message: this.$t('task.writeup.uploadWriteup'), trigger: 'change'}
          ],
        },
        banner: [
          {
            img: '../../../../static/img/b1.png',
            link: 'https://gongce.xctf.org.cn/'
          },
          {
            img: '../../../../static/img/b2.png',
            link: 'https://qiangwangbei.xctf.org.cn/'
          }
        ],
        user_id: getStorage('isUserLogin', 'object').user.id,
        loading: true,
        task_data: {},
        showimg: true,
        showgold: false,
        dialogVisible: false,
        visibleAdvice: false,
        writeupShow: false,//上传wp弹窗
        task_type: '',
        task_id: '',
        now_id: '',
        task_number: '',
        task_grade: '',
        use_time: '',
        ruleForm: {
          name: '',
        },
        can_todo: false,
        rules: {
          name: [
            {required: true, message: this.$t('task.writeAnswer'), trigger: 'submit'},
          ],
        },
        onOff: true,
        message: [],
        writeUp: {
          buyed: true,
          coin: 50,
        },
        reward_coin: 0,
        answer_time: 0,
        timer: null,
        message_timer: null,
        view_status: false,
        successed_data: {},
        adviceForm: {
          advice: '',
          uuid: '',
          code: ''
        },
        adviceRules: {
          advice: [
            {required: true, message: this.$t('task.advice.writeAdvice'), trigger: 'submit'},
          ],
          uuid: [
            {required: true, message: this.$t('validatePhone.placeholder'), trigger: 'submit'},
          ],
        },
      }
    },
    created () {
      this.initView()
      this.get_message()
      let that = this
      this.message_timer = setInterval(() => {
        that.get_message()
        if (that.message.length > 15) {
          that.message.pop()
        }
      }, 15000)
    },
    beforeDestroy () {
      if (this.task_data.is_dynamic_env) {
        this.$refs.sence.initTimer()
      }
      clearInterval(this.message_timer)
      clearInterval(this.timer)
      this.setData({show_now_task: true})
    },
    methods: {
      ...mapMutations(['setData']),
      showUpload () {
        this.writeupShow = true
        this.$http.get('/api/tasks/' + this.$route.query.id)
        .then((res) => {
          if (res.data.success) {
            this.upload_writeup.task_name = res.data.message.name
            this.upload_writeup.task_weight = Math.round(res.data.message.weight_score)
            this.upload_writeup.upload_writeup_price = res.data.message.upload_writeup_price
          }
        })
        .catch((err) => {

        })
      },
      uploadFile (params) {
        const _file = params.file
        const isLt2M = _file.size / 1024 / 1024 < 2
        let isJPG
        if (_file.type === 'image/png' || _file.type === 'application/pdf') {
          isJPG = true
        } else if (_file.name.endsWith('.md')) {
          isJPG = true
        } else {
          isJPG = false
        }
        // 通过 FormData 对象上传文件
        var formData = new FormData()
        formData.append('writeup', _file)
        if (!isJPG) {
          this.$notify.error({
            customClass: 'error_notify',
            title: this.$t('public.error'),
            message: this.$t('validateImg.md'),
          })
          return false
        }
        if (!isLt2M) {
          this.$notify.error({
            customClass: 'error_notify',
            title: this.$t('public.error'),
            message: this.$t('validateImg.md_size'),
          })
          return false
        }
        formData.append('image_code_id', this.writeupForm.image_code_id)
        formData.append('image_code', this.writeupForm.image_code)
        formData.append('task_id', this.$route.query.id)
        formData.append('thinking', this.upload_writeup.thinking)
        this.$http.post('/api/tasks/writeups', formData).then(ress => {
          let res = ress.data
          if (res.success) {
            this.$notify.success({
              title: this.$t('dialog_list.tips'),
              message: this.$t('task.writeup.upload_success'),
            })
            this.writeupShow = false
            this.writeupForm.file = ''
            this.writeupForm.image_code_id = ''
            this.writeupForm.image_code = ''
            this.upload_writeup.thinking = ''
            this.$refs.imgCode.clearUUid()
            this.$refs.upload.clearFiles()
          }
        })
      },
      submitUpload (formName) {
        this.$refs.imgCode.initUUid()
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$refs.upload.submit()
          } else {
            return false
          }
        })
      },
      changeCode (val) {//切换验证码
        this.writeupForm.image_code_id = val.img_auth_code
      },
      getImgCode1 (val) {
        this.writeupForm.image_code = val.img_code
        this.writeupForm.image_code_id = val.img_auth_code
      },
      changes (file) {
        this.writeupForm.file = file
      },
      remove () {
        this.writeupForm.file = ''
        this.$refs.upload.clearFiles()
      },
      initView () {
        this.setData({show_now_task: false})
        this.task_type = this.$route.query.type
        this.task_number = this.$route.query.number
        this.task_id = this.$route.query.id
        this.now_id = this.$route.query.id
        this.task_grade = this.$route.query.grade
        this.$http.get('/api/tasks/' + this.task_id)
        .then((res) => {
          if (res.data.success) {
            this.task_data = res.data.message
            this.task_data.weight_score = Math.round(this.task_data.weight_score)
            if (this.task_data.has_solved) {
              this.view_status = true
            }
            if (this.task_data.is_dynamic_env) {
              this.$nextTick(() => {
                this.$refs.sence.runSence_get()
              })
            }
            let s = parseInt(res.data.message.use_time) * 1000
            this.use_time = dateformat(s)
            if (!res.data.message.has_solved) {
              this.timer = setInterval(() => {
                s += 1000
                this.use_time = dateformat(s)
              }, 1000)
            }
            this.loading = false
          }
        })
        .catch((err) => {

        })
      },
      reloadView () {
        this.$router.push({
          path: '/task/answer',
          query: {
            type: this.task_type,
            number: this.task_number,
            grade: this.task_grade,
            id: this.successed_data.next_task
          }
        })
        // this.initView();
        // this.dialogVisible = false;
        this.reload()
      },
      animateScroll (element, speed) {
        let rect = element.getBoundingClientRect()
        //获取元素相对窗口的top值，此处应加上窗口本身的偏移
        let top = window.pageYOffset + rect.top
        let currentTop = 0
        let requestId

        //采用requestAnimationFrame，平滑动画
        function step (timestamp) {
          currentTop += speed
          if (currentTop <= top) {
            window.scrollTo(0, currentTop)
            requestId = window.requestAnimationFrame(step)
          } else {
            window.cancelAnimationFrame(requestId)
          }
        }

        window.requestAnimationFrame(step)
      },
      show_comment () {
        this.view_status = true
        setTimeout(() => {
          this.animateScroll(document.getElementsByClassName('comment_wrap')[0], 60)
        }, 200)
      },
      hide_comment () {
        this.view_status = false
      },
      goComment () {
        this.dialogVisible = false
        this.show_comment()
      },
      get_message () {
        let message_maxid = localStorage.answer_message_maxId ? getStorage('answer_message_maxId', 'string') : 0//获取实时消息最大id;
        this.$http.get('/api/tasks/messages/' + message_maxid)
        .then((res) => {
          if (res.data.length) {
            res.data.forEach((item) => {
              item.content += ',' + this.$t('task.consume') + dateformat(item.seconds * 1000)
              item.content_en += ',' + this.$t('task.consume') + dateformat(item.seconds * 1000)
            })
            this.message = (res.data).concat(this.message)
            setStorage('answer_message_maxId', res.data[0].id)//把最大id存到storage;
          }
        })
        .catch((err) => {

        })
      },
      get_some_reward () {
        this.$http.get('/api/tasks/extra_coin', {
          params: {
            task_id: this.$route.query.id
          }
        })
        .then((res) => {
          if (res.data.success) {
            this.reward_coin = res.data.message
            this.showimg = false
            this.showgold = true
            setTimeout(() => {
              genClips()
            }, 500)
            setTimeout(() => {
              jbPao(() => {
                setTimeout(function () {
                  $('.main').css('display', 'none')
                  $('.get_reward').css('display', 'block')
                  pao_animate($('.get_animate'), $('.reward_gold'))
                }, 1200)
              })
            }, 1200)
          }
        })
        .catch((err) => {

        })
      },
      getImgCode (val) {
        this.adviceForm.uuid = val.img_code
        this.adviceForm.code = val.img_auth_code
      },
      submitAdvice (formName) {
        this.$refs.changs.initUUid()
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/api/tasks/suggest', {
              task_id: this.task_id,
              content: this.adviceForm.advice,
              image_code: this.adviceForm.uuid,
              image_code_id: this.adviceForm.code
            })
            .then((res) => {
              if (res.data.success) {
                this.$notify.success({
                  title: this.$t('dialog_list.tips'),
                  message: this.$t('api_message.' + res.data.message),
                })
                this.visibleAdvice = false
                this.adviceForm.code = ''
                this.adviceForm.uuid = ''
                this.adviceForm.advice = ''
                this.$refs.changs.clearUUid()
              }
            })
            .catch((err) => {

            })
          } else {
            return false
          }
        })
      },
      getWriteup () {
        const h = this.$createElement
        if (this.task_data.has_ask_writeup) {
          this.$msgbox({
            title: '',
            message: h('p', null, this.$t('task.writeup.isBuyedWriteup')),
            showCancelButton: true,
            customClass: 'public_confirm public_confirm_sm no_head',
            confirmButtonText: this.$t('task.writeup.lookWriteup'),
            cancelButtonText: this.$t('modal.cancel'),
            center: true
          }).then(({value}) => {
            window.open('/task/writeup?type=' + this.task_type + '&id=' + this.task_id);

            // this.$router.push({path:'/task/writeup', query:{ type:this.task_type,id: this.task_id }});
          })
          .catch((err) => {

          })
        } else {
          this.$msgbox({
            title: '',
            message: h('p', null, [
              h('p', null, [
                h('span', null, this.$t('task.writeup.writeupMessage1')),
                h('span', {style: 'color:#f3d707'}, this.task_data.writeup_price + this.$t('task.gold')),
                h('span', null, this.$t('task.writeup.writeupMessage2'))
              ]),
              h('span', null, this.$t('task.writeup.writeupMessage3'))
            ]),
            showCancelButton: true,
            customClass: 'public_confirm public_confirm_sm no_head',
            confirmButtonText: this.$t('task.writeup.lookWriteup'),
            cancelButtonText: this.$t('modal.cancel'),
            center: true
          }).then(({value}) => {
            this.$http.get('/api/tasks/writeups/' + this.task_id)
            .then((res) => {
              if (res.data.success) {
                this.$notify.success({
                  title: this.$t('dialog_list.tips'),
                  message: this.$t('task.writeup.buyedSuccess'),
                })
                setTimeout(() => {
                  // this.$router.push({path:'/task/writeup', query:{ type:this.task_type,number:this.task_number,id: this.task_id }});
                  this.reload()
                  window.open('/task/writeup?type=' + this.task_type + '&id=' + this.task_id + '&number=' + this.task_number)
                }, 1500)
              }
            })
            .catch((err) => {

            })
          })
        }
      },
      submitForm (formName) {
        const h = this.$createElement
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let status = 0
            this.$http.post('/api/tasks/answers', {
              task_id: this.task_id,
              answer: this.ruleForm.name
            })
            .then((res) => {
              if (!res.data.success) {
                this.$msgbox({
                  title: '',
                  message: h('p', null, [
                    h('p', {style: 'color:#fff;font-size:16px;font-weight:bold'}, this.$t('task.answer_error_tips')),
                    h('p', {style: 'color:#f3d707;font-style:italic;font-size:18px;font-weight:bold'}, this.$t('task.keepTrying'))
                  ]),
                  showCancelButton: false,
                  showConfirmButton: false,
                  customClass: 'public_confirm public_confirm_md no_head',
                  center: true
                }).then(({value}) => {
                })
              } else {
                clearInterval(this.timer)
                this.successed_data = res.data.message
                this.task_data.has_solved = true
                this.task_id = res.data.message.next_task
                this.answer_time = res.data.message.seconds * 1000
                this.dialogVisible = true
                this.ruleForm.name = ''
              }
            })
            .catch((err) => {

            })
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      hide_message () {
        this.onOff = !this.onOff
        $(this).addClass('mes_bg')
        $('.message_wrap').width(0)
        $('.answer_wrap').css('width', '100%')
      },
      show_message () {
        this.onOff = !this.onOff
        $(this).removeClass('mes_bg')
        $('.message_wrap').css('width', '22%')
        $('.answer_wrap').css('width', '75%')
      }
    },
    mounted () {
    },
    computed: {
      taskWeight () {
        return 'diff_num' + this.task_data.weight_score
      },
      addDes () {
        if (this.task_data.description == null || this.task_data.description == '') {
          return false
        } else {
          return true
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .question_answer_box
    .task_info
      padding: 0 50px;

    .task_title
      float: left;
      font-size: 16px;

    .task_star
      margin-bottom: 25px;
      font-size: 16px;
      float: left;
      margin-left: 40px;

      .star
        width: 14px;
        height: 13px;
        background: url('~@/assets/img/answer/xingxing1.png') no-repeat;
        background-size: 100% 100%;
        display: inline-block;
        vertical-align: middle;

    .upload-demo
      text-align: left;

    .gold_tips
      color: placeholderColor;
      text-align: left;
      margin-top: 20px;

      .gold
        color: color-yellow;
        font-weight: bold;
        font-size: 18px;


    .sheet_top
      .go_back2
        background: url('~@/assets/img/button/go_back2.png') no-repeat;
        background-size: 100% 100%;
        font-size: 14px;
        color: #fff;
        margin-right: 30px;

      .past_time
        background: url('~@/assets/img/answer/layer.png') no-repeat 40px;
        background-size: 100% 100%;
        position: relative;
        text-align: left;
        color: white;
        padding-left: 100px;

        .star_ico
          background: url('~@/assets/img/answer/4jiao.png') no-repeat;
          background-size: 100% 100%;
          position: absolute;
          left: 0;
          top: -14px;

      .get_reward
        float: right;

        .someScore
          margin-right: 30px;
          color: white;

          .scoreIco
            width: 33px;
            height: 33px;
            display: inline-block;
            vertical-align: -11px;
            background: url('~@/assets/img/integral_icon.png') no-repeat;
            background-size: 100% auto;
            margin-right: 5px;

          .score_num
            font-size: 20px;
            vertical-align: -2px;
            color: color-yellow;

        .this_score
          color: white;

          .jinbi
            width: 33px;
            height: 33px;
            display: inline-block;
            vertical-align: -11px;
            margin-right: 5px;
            background: url('~@/assets/img/coin_icon.png') no-repeat;
            background-size: 100% 100%;

          .money_num
            font-size: 20px;
            vertical-align: -2px;
            color: color-yellow;


    .important_content
      .answer_wrap
        float: left;
        width: 75%;
        color: white;
        font-size: 16px;

        .answer_box_parent
          background-color: #0d1927;
          border: 1px solid borderColor;
          position: relative;

          .answer_box_child
            width: 100%;
            height: 100%;
            edge-angle()
            padding: 20px;
            text-align: left;
            position: relative;

            .mes_bg
              width: 15px;
              height: 47px;
              background: #053A66;
              border-top-right-radius: 3px;
              border-bottom-right-radius: 3px;
              position: absolute;
              right: 0;
              top: 40%;
              cursor: pointer;
              background: url('~@/assets/img/answer/jian.png') no-repeat;
              background-size: 100% 100%;
              transform: rotate(180deg);

            .task_inner_label
              color: white;
              display: inline-block;
              vertical-align: middle;

            .task_name
              font-size: 24px;
              width: 70%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: inline-block;
              color: white;

            .task_difficulty
              .diff_num
                width: 224px;
                height: 32px;
                display: inline-block;
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position: -9px 0;
                vertical-align: middle;

            .task_source
              .task_source_icon
                height: 22px;
                line-height: 20px;
                padding: 0 14px;
                border: 1px solid #1390ff;
                color: #1390ff;
                display: inline-block;
                font-size: 12px;
                border-radius: 3px;
                margin-right: 5px;

            .task_describe
              .describe_txt
                color: #789ecb;
                font-size: 14px;

            .task_attachment
              .attachment_list
                vertical-align: middle;
                display: inline-block;

                .topic_attach
                  height: 26px;
                  line-height: 26px;
                  background: #053a66;
                  text-align: center;
                  padding: 0 12px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  margin: 4px 12px 2px 0;
                  display: inline-block;
                  font-size: 14px;
                  color: #789ecb !important;
                  border-radius: 5px;
                  transition: .3s;

            .task_handle
              position: absolute;
              right: 10px;
              top: 10px;

              button
                padding: 4px 15px;
                background: url('~@/assets/img/button/lv.png') no-repeat;
                background-size: 100% 100%;
                border: none;
                color: #00ffb7;
                margin-left: 8px;
                cursor: pointer;

                &:hover
                  background: url('~@/assets/img/button/lv1.png') no-repeat;
                  background-size: 100% 100%;
                  color: white;

            .submit_answer
              position: absolute;
              margin: 0 auto;
              left: 0;
              right: 0;
              text-align: center;

              .submit_flag
                text-align: center;
                color: fontSkyblue;
                background: url('~@/assets/img/button/an.png') no-repeat;
                background-size: 100% 100%
                border: none;
                padding: 0;

                &:hover
                  color: white;

            .has_solved_btn
              position: absolute;
              bottom: 15%;
              width: 100%;

              .has_solved
                width: 200px;
                height: 45px;
                line-height: 45px;
                set_bg('button/solved.png');
                text-align: center;
                color: #07cf8b;
                margin: 0 auto;

            .view_comments
              width: 118px;
              height: 26px;
              line-height: 26px;
              text-align: center;
              color: white;
              font-size: 14px;
              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
              background: lightblue;
              position: absolute;
              right: 14px;
              bottom: 0;
              cursor: pointer;

          .upload_wp
            position: absolute;
            bottom: 75px;
            right: 10px;
            width: 180px
            height: 113px
            background: url("~@/assets/img/answer/upload_WP.png") no-repeat;

            .describe
              margin-top: 60px;
              color: #0993FE;
              font-size: 12px;

            .btn
              display inline-block;
              margin: 0 auto;
              width: 90px;
              height: 20px;
              line-height: 20px;
              background: #0993FE;
              color: #fff;
              border-radius: 4px;
              font-size: 12px;
              margin-top: 10px
              cursor: pointer;

        .comment_wrap
          margin-top: 20px;
          margin-bottom: 80px;
          padding: 20px;
          edge-angle()
          card_style()

      .message_wrap
        float: right;
        width: 22%;
        position: relative;

        .pull_message
          width: 15px;
          height: 47px;
          background: #053A66;
          border-radius: 3px;
          background: url('~@/assets/img/answer/jian.png') no-repeat;
          background-size: 100% 100%;
          position: absolute;
          left: -15px;
          top: 40%;
          cursor: pointer;

        .banner_box
          border: 1px solid borderColor;
          margin-top: 10px

        .message_box_parent
          background-color: #0d1927;
          border: 1px solid borderColor;

          .message_box_child
            width: 100%;
            height: 100%;
            edge-angle()
            padding: 0 10px;

            .real_time_title
              color: lightblue;
              font-size: 16px;
              line-height: 40px;
              border-bottom: 1px solid lightblue;
              text-align: left;

              &:before
                content: '';
                display: inline-block;
                width: 20px;
                height: 20px;
                background: url('~@/assets/img/answer/mess.png') no-repeat;
                background-size: 100% 100%;
                vertical-align: middle;
                margin-left: 17px;
                margin-right: 5px;

            .message_content_wrap
              width: 100%;
              height: calc(100% - 41px);

              .message_content
                width: 100%;
                height: 100%;
                overflow: hidden;

                li
                  padding: 10px;
                  border-bottom: 1px solid #233041;

                  .message
                    text-align: left;
                    color: fontSkyblue;
                    font-size: 14px;
                    line-height: 20px;
                    margin-bottom: 5px;

                  time
                    color: fontSkyblue

    @media (max-width: 1300px)
      .sheet_top
        margin-top: 24px;
        margin-bottom: 15px;

        .go_back2
          width: 105px;
          height: 40px;
          padding-left: 48px;
          line-height: 40px;

        .past_time
          width: 360px;
          line-height: 34px;
          height: 40px;

          .star_ico
            width: 60px;
            height: 60px;

      .important_content
        .answer_wrap
          .bottom_spacing
            margin-bottom: 10px;

          .answer_box_parent
            height: 550px;

            .task_name
              margin-bottom: 15px;

            .task_describe
              .describe_txt
                line-height: 20px;

            .submit_answer
              width: 580px;
              bottom: 20px;
              height: 95px;

              .submit_flag
                width: 160px;
                height: 36px;
                line-height: 36px;

        .message_wrap
          .message_box_parent
            height: 430px;

          .banner_box, .el-carousel
            height: 110px;
    @media (min-width: 1300px) and (max-width: 1500px)
      .sheet_top
        margin-top: 24px;
        margin-bottom: 15px;

        .go_back2
          width: 105px;
          height: 40px;
          padding-left: 48px;
          line-height: 40px;

        .past_time
          width: 360px;
          line-height: 34px;
          height: 40px;

          .star_ico
            width: 60px;
            height: 60px;

      .important_content
        .answer_wrap
          .bottom_spacing
            margin-bottom: 10px;

          .answer_box_parent
            height: 570px;

            .task_name
              margin-bottom: 15px;

            .task_describe
              .describe_txt
                line-height: 20px;

            .submit_answer
              width: 580px;
              bottom: 15px;
              height: 95px;

              .submit_flag
                width: 160px;
                height: 36px;
                line-height: 36px;

        .message_wrap
          .message_box_parent
            height: 430px;

          .banner_box, .el-carousel
            height: 130px;
    @media (min-width: 1500px) and (max-width: 1800px)
      .sheet_top
        margin-top: 28px;
        margin-bottom: 20px;

        .go_back2
          width: 120px;
          height: 50px;
          padding-left: 56px;
          line-height: 50px;

        .past_time
          width: 400px;
          line-height: 46px;
          height: 50px;

          .star_ico
            width: 77px;
            height: 77px;

      .important_content
        .answer_wrap
          .bottom_spacing
            margin-bottom: 20px;

          .answer_box_parent
            height: 641px;

            .task_describe
              .describe_txt
                line-height: 24px;

            .task_name
              margin-bottom: 30px;

            .submit_answer
              width: 740px;
              bottom: 30px;
              height: 116px;

              .submit_flag
                width: 208px;
                height: 40px;
                line-height: 40px;

        .message_wrap
          .message_box_parent
            height: 500px;

          .banner_box, .el-carousel
            height: 131px;
    @media (min-width: 1800px)
      .sheet_top
        margin-top: 28px;
        margin-bottom: 20px;

        .go_back2
          width: 120px;
          height: 50px;
          padding-left: 56px;
          line-height: 50px;

        .past_time
          width: 400px;
          line-height: 46px;
          height: 50px;

          .star_ico
            width: 77px;
            height: 77px;

      .important_content
        .answer_wrap
          .bottom_spacing
            margin-bottom: 20px;

          .answer_box_parent
            height: 700px;

            .task_describe
              .describe_txt
                line-height: 24px;

            .task_name
              margin-bottom: 30px;

            .submit_answer
              width: 740px;
              bottom: 30px;
              height: 116px;

              .submit_flag
                width: 208px;
                height: 40px;
                line-height: 40px;

        .message_wrap
          .message_box_parent
            height: 525px;

          .banner_box, .el-carousel
            height: 165px;
</style>
<style lang="stylus">
  .el-carousel__container
    height: 100% !important;

  .success_answer
    .el-dialog__header
      padding-top: 55px;
      padding-bottom: 5px;

      .el-dialog__title
        color: #03cb73 !important;
        font-size: 32px;

    .el-dialog__body
      font-size: 16px;

      .task_star
        margin-bottom: 25px;

        .star
          width: 14px;
          height: 14px;
          background: url('~@/assets/img/answer/xingxing1.png') no-repeat;
          background-size: 100% 100%;
          display: inline-block;
          vertical-align: middle;

      .task_group
        .use_time
          color: #ef7628;
          margin-right: 50px;
          display: inline-block;

          &:before
            content: '';
            display: inline-block;
            clear both;
            width: 31px;
            height: 35px;
            background: url('~@/assets/img/answer/timer.png') no-repeat;
            background-size: 100% 100%;
            vertical-align: middle;
            margin-right: 6px;

        .get_score
          margin-right: 50px;
          display: inline-block;

          &:before
            content: '';
            display: inline-block;
            clear both;
            width: 35px;
            height: 35px;
            background: url('~@/assets/img/integral_icon.png') no-repeat;
            background-size: 100% 100%;
            vertical-align: middle;
            margin-right: 6px;

        .get_gold
          display: inline-block;
          position: relative;

          &:before
            content: '';
            display: inline-block;
            clear both;
            width: 35px;
            height: 35px;
            background: url('~@/assets/img/coin_icon.png') no-repeat;
            background-size: 100% 100%;
            vertical-align: middle;
            margin-right: 6px;

      .additional
        margin: 30px 0 0;

        .label
          color: #03cb73;
          font-size: 18px;
          margin-bottom: 10px;

        .additional_box
          width: 215px;
          height: 150px;
          set_bg('/answer/fujia.png')
          margin: 0 auto;
          text-align: center;
          position: relative;

          .click_box
            margin-top: 25px;
            cursor: pointer;

          .gold_parent
            width: 100%;
            position: absolute;
            left: 0;
            top: 7px;

          .get_reward
            display: none;

            img
              margin: 0 auto;
              display: block;
              width: 100px;

            .add_reward
              margin-top: -12px;

              .reward_gold
                color: color-yellow;
                font-weight: bold;
                font-size: 20px;
                vertical-align: -1px;

    .el-dialog__footer
      padding-top: 5px;
</style>


