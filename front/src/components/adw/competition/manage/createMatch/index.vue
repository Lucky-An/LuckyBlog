<template>
  <div class=" create_match_box guide_wrap form_parent_style">
    <div class="form_title">
      {{$t('selfService.create_match_title')}}
    </div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="190px" class="demo-ruleForm">
      <el-form-item :label="$t('selfHelp_competition.contest_name')" prop="name_zh">
        <el-input v-model="ruleForm.name_zh" :placeholder="$t('selfHelp_competition.name_first')"/>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.vice_name')" prop="vice_name_zh">
        <el-input v-model="ruleForm.vice_name_zh" :placeholder="$t('selfHelp_competition.name_senced')"/>
      </el-form-item>

      <el-form-item :label="$t('selfHelp_competition.startTime_end')"  required>
        <el-col :span="11">
          <el-form-item prop="start_time">
            <el-date-picker
                    v-model="ruleForm.start_time"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    :placeholder="$t('selfHelp_competition.chose_start_tiem')"
                    style="width: 100%;"/>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="line" style="text-align: center">-</el-col>
        <el-col :span="11">
          <el-form-item prop="end_time">
            <el-date-picker
                    v-model="ruleForm.end_time"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    :placeholder="$t('selfHelp_competition.chose_end_tiem')"
                    style="width: 100%;"/>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item :label="$t('selfHelp_competition.cover')">
        <img :src="ruleForm.cover" class="def_img" alt="">
        <span class="upload_box">
          <span class="up_file">{{$t('selfHelp_competition.upload_pic')}}
            <input ref="cover" @change="uploadImg($event,'cover')" class="file_item" type="file">
          </span>
          <br>
          <span class="describe">{{$t('selfHelp_competition.descrip')}}</span>
        </span>
      </el-form-item>

      <!--赛事logo-->
      <el-form-item label="logo">
        <img :src="ruleForm.logo" class="def_img" alt="">
        <span class="upload_box">
          <span class="up_file">{{$t('selfHelp_competition.upload_pic')}}
            <input ref="logo" @change="uploadImg($event,'logo')" class="file_item" type="file">
          </span>
          <br>
          <span class="describe">{{$t('selfHelp_competition.descrip')}}</span>
        </span>
      </el-form-item>
      <el-form-item label="url">
        <el-input v-model="ruleForm.url" disabled/>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.sponsor')">
        <el-input v-model="ruleForm.sponsor_zh" :placeholder="$t('selfHelp_competition.fill_sponsor')"/>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.proposition')">
        <el-input v-model="ruleForm.propositional_team_zh" :placeholder="$t('selfHelp_competition.fill_proposition')"/>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.brief')"  prop="description_zh">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars='toolbars'
                :ishljs="true"
                :codeStyle="mdStyle"
                v-model=" ruleForm.description_zh"/>
      </el-form-item>

      <el-form-item :label="$t('selfHelp_competition.entry_type')" prop="mode">
        <el-select v-model="ruleForm.mode">
          <el-option :value="1" :label="$t('selfHelp_competition.self_match')"/>
          <el-option :value="2" :label="$t('selfHelp_competition.team_match')"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.match_type')" prop="competition_type">
        <el-select v-model="ruleForm.competition_type" disabled>
          <el-option :value="1" :label="$t('selfHelp_competition.business_match')"/>
          <el-option :value="2" :label="$t('selfHelp_competition.XCTF')"/>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('selfHelp_competition.tournament_type')" prop="type">
        <el-select v-model="ruleForm.type" disabled>
          <el-option :value="6"  :label="$t('selfHelp_competition.invitation')"/>
          <el-option :value="7"   :label="$t('selfHelp_competition.open_tournament')"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.score_type')">
        <el-select v-model="ruleForm.integral_mode">
          <el-option :value="1" :label="$t('selfHelp_competition.cum_score')"/>
          <el-option :value="2" :label="$t('selfHelp_competition.dyn_score')"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.reward_score')">
        <el-select v-model="ruleForm.reward_mode">
          <el-option :value="0" :label="$t('selfHelp_competition.no')"/>
          <el-option :value="1" :label="$t('selfHelp_competition.extra_bonus')"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.pulblic')">
        <el-switch v-model="ruleForm.public"/>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.guide')" prop="competition_guide_zh">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars='toolbars'
                :ishljs="true"
                v-model=" ruleForm.competition_guide_zh"/>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.rules')" prop="competition_rule_zh">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars='toolbars'
                :ishljs="true"
                v-model=" ruleForm.competition_rule_zh"/>
      </el-form-item>
      <!--注意事项-->
      <el-form-item :label="$t('selfHelp_competition.attention')" prop="matters_needing_attention_zh">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars='toolbars'
                :ishljs="true"
                v-model="ruleForm.matters_needing_attention_zh"/>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.ranking')"  prop="score_ranking_zh">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars='toolbars'
                :ishljs="true"
                v-model=" ruleForm.score_ranking_zh"/>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.bonus')" prop="reward_zh">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars='toolbars'
                :ishljs="true"
                v-model=" ruleForm.reward_zh"/>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.contact_type')"  prop="contact_way_zh">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars="toolbars"
                :ishljs="true"
                v-model=" ruleForm.contact_way_zh"/>
      </el-form-item>

      <!--支撑单位-->
      <el-form-item :label="$t('selfHelp_competition.Support_img')">
        <img :src="ruleForm.competition_company_url" class="def_img" alt="">

        <span class="upload_box">
          <span class="up_file">{{$t('selfHelp_competition.upload_pic')}}<input ref="competition_company_url"
                                           @change="uploadImg($event,'competition_company_url')" class="file_item"
                                           type="file"></span>
          <br>
          <span class="describe">{{$t('selfHelp_competition.descrip')}}</span>
        </span>
      </el-form-item>

      <!--赞助商-->
      <el-form-item :label="$t('selfHelp_competition.sponsorPictures')">
        <img :src="ruleForm.support_company_url" class="def_img" alt="">

        <span class="upload_box">
          <span class="up_file">{{$t('selfHelp_competition.upload_pic')}}<input ref="support_company_url"
                                           @change="uploadImg($event,'support_company_url')" class="file_item"
                                           type="file"></span>
          <br>
          <span class="describe">{{$t('selfHelp_competition.descrip')}}</span>
        </span>
      </el-form-item>

      <!--承办方-->
      <el-form-item :label="$t('selfHelp_competition.contractorPictures')">
        <img :src="ruleForm.competition_provider_url" class="def_img" alt="">

        <span class="upload_box">
          <span class="up_file">{{$t('selfHelp_competition.upload_pic')}}<input ref="competition_provider_url"
                                           @change="uploadImg($event,'competition_provider_url')" class="file_item"
                                           type="file"></span>
          <br>
          <span class="describe">{{$t('selfHelp_competition.descrip')}}</span>
        </span>
      </el-form-item>
<!--参赛范围-->
      <el-form-item :label="$t('selfHelp_competition.matchscope')">
      <el-select v-model="ruleForm.is_international">
      <el-option :value="false" :label="$t('selfHelp_competition.homeMatch')"/>
      <el-option :value="true" :label="$t('selfHelp_competition.internationalMatch')"/>
      </el-select>
      </el-form-item>

      <div v-show="showEn">
      <p style="text-align: center;color: #fff;font-size: 18px;margin: 20px;">{{$t('selfHelp_competition.bottom_en_info')}}</p>
        <!--赛事名称英文-->
      <el-form-item :label="$t('selfHelp_competition.en_name')" prop="name_en">
      <el-input v-model="ruleForm.name_en" :placeholder="$t('selfHelp_competition.en_name')"/>
      </el-form-item>
        <!--赛事副名称英文-->
      <el-form-item :label="$t('selfHelp_competition.en_name2')" prop="vice_name_en">
      <el-input v-model="ruleForm.vice_name_en" :placeholder="$t('selfHelp_competition.en_name2_please')"/>
      </el-form-item>
        <!--赛事主办方英文-->
      <el-form-item :label="$t('selfHelp_competition.sponsor_en')" >
      <el-input v-model="ruleForm.sponsor_en" :placeholder="$t('selfHelp_competition.sponsor_en_p')"/>
      </el-form-item>
        <!--赛事命题方英文-->
      <el-form-item :label="$t('selfHelp_competition.propositional_team_en')">
      <el-input v-model="ruleForm.propositional_team_en" :placeholder="$t('selfHelp_competition.propositional_team_en_p')"/>
      </el-form-item>
        <!--赛事简介英文-->
      <el-form-item :label="$t('selfHelp_competition.description_en')" prop="description_en">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars="toolbars"
                :ishljs="true"
                v-model=" ruleForm.description_en"/>
      </el-form-item>
        <!--参赛指南英文-->
      <el-form-item :label="$t('selfHelp_competition.competition_guide_en')" prop="competition_guide_en">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars="toolbars"
                :ishljs="true"
                v-model=" ruleForm.competition_guide_en"/>
      </el-form-item>
        <!--竞赛规则英文-->
      <el-form-item :label="$t('selfHelp_competition.competition_rule_en')" prop="competition_rule_en">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars="toolbars"
                :ishljs="true"
                v-model=" ruleForm.competition_rule_en"/>
      </el-form-item>
        <!--注意事项英文-->
      <el-form-item :label="$t('selfHelp_competition.matters_needing_attention_en')" prop="matters_needing_attention_en">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars="toolbars"
                :ishljs="true"
                v-model=" ruleForm.matters_needing_attention_en"/>
      </el-form-item>
        <!--得分排名英文-->
      <el-form-item :label="$t('selfHelp_competition.score_ranking_en')" prop="score_ranking_en">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars="toolbars"
                :ishljs="true"
                v-model=" ruleForm.score_ranking_en"/>
      </el-form-item>
        <!--竞赛奖金英文-->
      <el-form-item :label="$t('selfHelp_competition.reward_en')" prop="reward_en">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars="toolbars"
                :ishljs="true"
                v-model=" ruleForm.reward_en"/>
      </el-form-item>
        <!--联系方式英文-->
      <el-form-item :label="$t('selfHelp_competition.contact_way_en')" prop="contact_way_en">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars="toolbars"
                :ishljs="true"
                v-model=" ruleForm.contact_way_en"/>
      </el-form-item>
      </div>

      <el-form-item class="text-center">
        <el-button type="primary" @click="showEn=!showEn" class="createSubmit">{{$t('selfHelp_competition.show_en_info')}}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" class="createSubmit">{{$t('question.submit')}}
        </el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import {setStorage, getStorage} from '@/utils/storage'
  import mavonOptions from '@/utils/mavonOptions'

  export default {
    data () {
      return {
        language:localStorage.lang=='EN'?'en':'zh-CN',
        toolbars: mavonOptions,//markdown编辑器的配置项
        showEn: false,
        ruleForm: {
          cover: require('@/assets/img/defImg.png'),
          competition_company_url: require('@/assets/img/defImg.png'),
          logo: require('@/assets/img/defImg.png'),
          support_company_url: require('@/assets/img/defImg.png'),
          competition_provider_url: require('@/assets/img/defImg.png'),
          name_zh: '', // 赛事中文名称
          vice_name_zh: '', // 赛事副标题中文
          start_time: '', // 开始时间
          end_time: '', // 结束时间
          sponsor_zh: '', // 主办方中文
          propositional_team_zh: '', // 命题团队中文
          description_zh: '', // 赛事介绍中文
          competition_type: 1, // 赛事类型
          mode: 1, //	参赛方式
          type: 6, //	比赛类型
          integral_mode: 1, // 积分方式
          reward_mode: 1, // 奖励方式
          public: true, // 是否公开
          competition_guide_zh: '', // 参赛指南中文
          competition_rule_zh: '', // 竞赛规则中文
          matters_needing_attention_zh: '', // 注意事项中文
          score_ranking_zh: '', // 得分排名中文
          reward_zh: '', // 竞赛奖金中文
          contact_way_zh: '', // 联系方式中文
          url: '', // url
          is_international: false, //	是否为国际赛
          name_en: '', // 赛事英文文名称
          vice_name_en: '', // 赛事副-标题英文
          sponsor_en: '', // 主办方英文
          propositional_team_en: '', // 命题团队英文
          description_en: '', // 赛事介绍英文
          competition_guide_en: '', // 参赛指南英文
          competition_rule_en: '', // 竞赛规则英文
          matters_needing_attention_en: '', // 注意事项英文
          score_ranking_en: '', // 得分排名英文
          reward_en: '', // 竞赛奖金英文
          contact_way_en: ''// 联系方式英文
        },
        rules: {
          name_zh: [
            {required: true, message: this.$t('selfHelp_competition.name_first'), trigger: 'blur'},
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          start_time: [
            {type: 'string', required: true, message: this.$t('selfHelp_competition.chose_start_tiem'), trigger: 'change'}
          ],
          end_time: [
            {type: 'string', required: true, message: this.$t('selfHelp_competition.chose_end_tiem'), trigger: 'change'}
          ],
          sponsor_zh: [
            {required: true, message: this.$t('selfHelp_competition.fill_sponsor'), trigger: 'blur'},
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          propositional_team_zh: [
            {required: true, message: this.$t('selfHelp_competition.fill_proposition'), trigger: 'blur'},
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          description_zh: [
            {required: true, message: this.$t('selfHelp_competition.fill_brief'), trigger: 'blur'},
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          mode: [
            {required: true, message: this.$t('selfHelp_competition.lang_greater'), trigger: 'change'}
          ],
          competition_type: [
            {required: true, message:this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          type: [
            {required: true, message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          competition_guide_zh: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          competition_rule_zh: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          matters_needing_attention_zh: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          score_ranking_zh: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          reward_zh: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          contact_way_zh: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          name_en: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          vice_name_en: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          sponsor_en: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          propositional_team_en: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          description_en: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          competition_guide_en: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          competition_rule_en: [
            {min: 2, message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          matters_needing_attention_en: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          score_ranking_en: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          reward_en: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ],
          contact_way_en: [
            {min: 2,  message: this.$t('selfHelp_competition.lang_greater'), trigger: 'blur'}
          ]

        },
        id: this.$route.query.id,
        mdStyle: 'code-dark',
        saveInfo: 1,//离开页面的原因是不是保存成功
        user_auth: (getStorage('isUserLogin', 'object')).user,
      }
    },
    created () {
      let data = getStorage('create_match_info', 'object');
      if (data) this.ruleForm = data;

      if (this.user_auth.classes == 3) {
        this.ruleForm.competition_type = 1
        this.ruleForm.type = 6
      }
      if (this.user_auth.classes == 2) {
        this.ruleForm.competition_type = 2
        this.ruleForm.type = 7
      }


      if (this.id) this.getInfo()
    },
    beforeRouteLeave (to, from, next) {//离开页面之前保存
      if (this.id) {
        next()
        return
      }

      if (!this.saveInfo) {
        next()
        return
      }

      this.$confirm(this.$t('selfHelp_competition.is_save'),  this.$t('selfHelp_competition.give_up'), {
        customClass: 'public_confirm public_confirm_sm text-center',
        confirmButtonText: this.$t('modal.confirm'),
        cancelButtonText: this.$t('modal.cancel'),
      }).then(() => {
        this.ruleForm.cover= require('@/assets/img/defImg.png');
        this.ruleForm.competition_company_url= require('@/assets/img/defImg.png');
        this.ruleForm.logo= require('@/assets/img/defImg.png');
        this.ruleForm.support_company_url= require('@/assets/img/defImg.png');
        this.ruleForm.competition_provider_url= require('@/assets/img/defImg.png');

        setStorage('create_match_info', this.ruleForm)//离开页面保存竞赛信息
        next()
      }).catch(() => {
        localStorage.removeItem('create_match_info');
        next()
      })
    },
    mounted(){
      window.scrollTo(0, 0);
    },
    methods: {
      uploadImg (e, type) {//实现图片预览
        var file = e.target.files[0]
        if (!file.type.includes('image')) {
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message: this.$t('selfHelp_competition.photoErr'),
          });
          // this.$message.error('请确保文件为图像类型')
          return false
        }
        var reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = (e) => {
          this.ruleForm[type] = e.target.result
        }
      },
      getInfo () { // 获取比赛详情
        this.$http.get('/api/sponsor/evts/' + this.id).then(res => {
          for (const key in this.ruleForm) {
            if (res.data[key]) this.ruleForm[key] = res.data[key]
          }
          this.ruleForm.public = res.data.public;
          this.ruleForm.reward_mode = res.data.reward_mode;
        })
      },
      onSubmit () {
        const fm = new FormData()
        const cover = this.$refs.cover.files
        const competition_company_url = this.$refs.competition_company_url.files
        const logo = this.$refs.logo.files
        const support_company_url = this.$refs.support_company_url.files
        const competition_provider_url = this.$refs.competition_provider_url.files
        const imgSize = 1024 * 1024
        const AllImgExt = '.jpg|.png'
        const formData = JSON.parse(JSON.stringify(this.ruleForm))
        delete formData.cover
        delete formData.competition_company_url
        delete formData.logo
        delete formData.support_company_url
        delete formData.competition_provider_url

        for (const key in formData) {
          fm.append(key, formData[key])
        }
        if (cover.length > 0) {
          const extName = cover[0].name.substring(cover[0].name.lastIndexOf('.')).toLowerCase()// （把路径中的所有字母全部转换为小写）
          if (AllImgExt.indexOf(extName) == -1) {
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message: this.$t('selfHelp_competition.photoErr'),
            });
            // this.$message.error('封面图片必须是jpg或者png')
            return
          }
          if (cover[0].size > imgSize) {
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message: this.$t('selfHelp_competition.photo_size'),
            });
            // this.$message.error('封面图片大小不能超过1M')
            return
          }
          fm.append('cover', cover[0])
        }
        if (competition_company_url.length > 0) {
          const extName = competition_company_url[0].name.substring(competition_company_url[0].name.lastIndexOf('.')).toLowerCase()// （把路径中的所有字母全部转换为小写）
          if (AllImgExt.indexOf(extName) == -1) {
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message: this.$t('selfHelp_competition.photoErr'),
            });
            // this.$message.error('支撑单位图片必须是jpg或者png')
            return
          }
          if (competition_company_url[0].size > imgSize) {
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message:this.$t('selfHelp_competition.photo_size'),
            });
            // this.$message.error('支撑单位图片大小不能超过1M')
            return
          }
          fm.append('competition_company_url', competition_company_url[0])
        }
        if (logo.length > 0) {
          const extName = logo[0].name.substring(logo[0].name.lastIndexOf('.')).toLowerCase()// （把路径中的所有字母全部转换为小写）
          if (AllImgExt.indexOf(extName) == -1) {
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message: this.$t('selfHelp_competition.photoErr'),
            });
            // this.$message.error('支撑单位图片必须是jpg或者png')
            return
          }
          if (logo[0].size > imgSize) {
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message:this.$t('selfHelp_competition.photo_size'),
            });
            // this.$message.error('支撑单位图片大小不能超过1M')
            return
          }
          fm.append('logo', logo[0])
        }
        //赞助商
        if (support_company_url.length > 0) {
          const extName = support_company_url[0].name.substring(support_company_url[0].name.lastIndexOf('.')).toLowerCase()// （把路径中的所有字母全部转换为小写）
          if (AllImgExt.indexOf(extName) == -1) {
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message: this.$t('selfHelp_competition.photoErr'),
            });
            // this.$message.error('支撑单位图片必须是jpg或者png')
            return
          }
          if (support_company_url[0].size > imgSize) {
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message:this.$t('selfHelp_competition.photo_size'),
            });
            // this.$message.error('支撑单位图片大小不能超过1M')
            return
          }
          fm.append('support_company_url', support_company_url[0])
        }

        //主办方
        if (competition_provider_url.length > 0) {
          const extName = competition_provider_url[0].name.substring(competition_provider_url[0].name.lastIndexOf('.')).toLowerCase()// （把路径中的所有字母全部转换为小写）
          if (AllImgExt.indexOf(extName) == -1) {
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message: this.$t('selfHelp_competition.photoErr'),
            });
            // this.$message.error('支撑单位图片必须是jpg或者png')
            return
          }
          if (competition_provider_url[0].size > imgSize) {
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message:this.$t('selfHelp_competition.photo_size'),
            });
            // this.$message.error('支撑单位图片大小不能超过1M')
            return
          }
          fm.append('competition_provider_url', competition_provider_url[0])
        }
        if (this.id) {
          this.$http.patch('/api/sponsor/evts/' + this.id, fm,{loading:true}).then(res => {
            if (res.data.success) {

              this.$router.push({
                path: '/common/manage/',
                query: { id: this.$route.query.id }
              })
            }
          })
        } else {
          this.$http.post('/api/sponsor/evts', fm,{loading:true}).then(res => {
            if (res.data.success) {

              //下面是创建竞赛成功提示框
              this.$confirm(  this.$t('selfHelp_competition.createMatchSuccess'),this.$t('api_message.operation_success'), {
                customClass: 'public_confirm public_confirm_sm text-center',
                cancelButtonText: this.$t('modal.cancel'),
              }).then(() => {
                this.saveInfo = 0
                localStorage.removeItem('create_match_info')
                this.$router.push({
                  path: '/common/manage/'
                })
              }).catch(() => {
                this.saveInfo = 0
                localStorage.removeItem('create_match_info')
                this.$router.push({
                  path: '/common/manage/'
                })
              })


            }
          })
        }
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.onSubmit()
          } else {
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message:this.$t('selfHelp_competition.writeError'),
            });
            // this.$message.error('填写信息有误')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .create_match_box {
    width: 90%;
    min-width: 600px;


    .te-switch-button {
      vertical-align: top;
    }

    .up_file {
      text-align: center;
      display: inline-block;
      width: 140px;
      height: 30px;
      line-height: 30px;
      background: url('~@/assets/img/button/an.png');
      background-size: 100% 100%;
      position: relative;
    }

    .file_item {
      position: absolute;
      opacity: 0;
      left: 0;
      top: 0;
      width: 140px;
      height: 30px;
      cursor:pointer;
    }

    .def_img {
      width: 150px
      height: 100px
      margin-right: 40px
    }

    .upload_box {
      display: inline-block;
      margin-top: 18px
    }

    .describe {
      font-size: 12px;
      color: #334962;
      position: relative;
      top: -10px
    }

    .createSubmit {
      margin-top: 90px
    }
  }
</style>

