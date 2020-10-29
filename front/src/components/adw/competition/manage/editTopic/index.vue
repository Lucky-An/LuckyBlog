<template>
  <div class="createMatchTopic_box form_parent_style">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm">
      <el-form-item :label="$t('selfHelp_competition.topic_name')" prop="title" >
        <el-input :placeholder="$t('selfHelp_competition.fell_topic_name')"  style="width: 200px;" v-model="ruleForm.title"/>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.score_type')">
        <span>{{ mathMode.integral_mode==2?$t('selfHelp_competition.dyn_score'):$t('selfHelp_competition.cum_score') }}</span>
      </el-form-item>
      <el-form-item v-show="mathMode.integral_mode==1" :label="$t('selfHelp_competition.topic_score')" prop="score">
        <!--<el-input :disabled='source==2' v-model="ruleForm.score"/>-->
        <el-input-number :disabled='source==2' v-model="ruleForm.score" :min="100" :step="10" :max="1000"></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.topic_type')" prop="category_id">
        <el-select :disabled='source==2'  v-model="ruleForm.category_id" class="filter-item" placeholder="题目类型">
          <el-option v-for="item,index in subType" :key="index" :label="item.cn_name" :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('selfHelp_competition.topic_cont')" prop="resource">
        <mavon-editor
                class="height300"
                :language="language"
                :toolbars='toolbars'
                :ishljs = "true"
                codeStyle='vs2015'
                v-model=" ruleForm.content"/>
      </el-form-item>
      <el-form-item :label="$t('selfHelp_competition.flag_form')">
        <el-select
          :disabled="true"
          v-model="ruleForm.is_dynamic_flag"
          @change="handleType">
          <el-option :value="0" :label="$t('selfHelp_competition.flag_static')"/>
          <el-option :value="2" :label="$t('selfHelp_competition.dyc_flag_dyc')"/>
          <el-option :value="1" :label="$t('selfHelp_competition.random_flag')"/>
          <el-option :value="3" :label="$t('selfHelp_competition.dyc_flag_static')"/>
        </el-select>
      </el-form-item>



      <div v-if="ruleForm.is_dynamic_flag==0">
        <el-form-item :label="$t('selfHelp_competition.topic_atta')">
          <span v-if="enclosureAry[0]!=1">
             <a :href="ruleForm.file[0]" download><el-button type="success" size="mini">{{$t('selfHelp_competition.topic_atta')}}</el-button></a>
            <!--<el-button type="danger" size="mini" @click="removeEnc(0)">删除附件</el-button>-->
          </span>
          <div v-for="(item,index) in enclosureAry" v-show='source!=2'>
            <el-input
                    disabled
                    type="input"
                    v-model="attaName"
                    style="width: 50%;"
                    :placeholder="$t('validateform.file')"/>
            <span  class="up_file def_btn">
              {{$t('selfHelp_competition.chose_file')}}
              <input @change="chosefile($event,'attaName')" class="file_item" :ref="'enclosure'+index" type="file">
              <span class="descrip">{{$t('selfHelp_competition.only_zip')}}</span>
            </span>

          </div>
        </el-form-item>
        <el-form-item :label="$t('selfHelp_competition.topic_flag')" prop="score">

          <el-input
                  :disabled='source==2'
            v-for="item,index in falgAry"
            v-model="item.flag"
            type="input"
                  :key="index"
            :placeholder="$t('selfHelp_competition.fell_flag')"/>
        </el-form-item>
        <el-form-item :label="$t('selfHelp_competition.pulblic')">
          <el-switch :disabled='source==2'  v-model="ruleForm.public"/>
        </el-form-item>
        <el-form-item :label="$t('selfHelp_competition.topic_WP')">
          <div v-show="ruleForm.official_writeup">
            <a :href="ruleForm.official_writeup" download>
              <el-button type="success" size="mini">{{$t('selfHelp_competition.topic_WP')}}</el-button>
            </a>
            <!--<el-button type="danger" size="mini" @click="removeWriteup">删除wp</el-button>-->
          </div>
          <span v-show='source!=2'>
                       <el-input
                               disabled
                               v-model="wpName"
                               type="input"
                               style="width: 50%;"
                               :placeholder="$t('validateform.file')"/>
            <span  class="up_file def_btn">
              {{$t('selfHelp_competition.chose_file')}}
              <input @change="chosefile($event,'wpName')" class="file_item" ref="writeUp" type="file">
              <span class="descrip">{{$t('selfHelp_competition.only_pdf')}}</span>
            </span>
          </span>
        </el-form-item>
        <el-form-item class="text-center">
          <el-button type="primary" class="cancelSubmit" @click="goBack">{{$t('modal.cancel')}}</el-button>
          <el-button type="primary" class="createSubmit mrg30R" @click="submitForm">{{$t('modal.submit')}}</el-button>
        </el-form-item>
      </div>




      <div v-if="ruleForm.is_dynamic_flag==2">
        <el-form-item :label="$t('selfHelp_competition.topic_atta')">
          <div  v-show='source!=2'>
            <el-button type="success" size="mini" icon="el-icon-plus" @click="addEnc"/>
          </div>
          <div class="randomBox">
            <div class="uploadBox">
              <div v-for="(item,index) in enclosureAry" class="mb10">
                <div v-show="item!=1">
                  <!--<a :href="item" download>-->
                    <el-button type="success" size="mini">{{$t('selfHelp_competition.topic_atta')}}</el-button>
                  <!--</a>-->
                </div>
                <div v-show='source!=2'>
                  <input :ref="'enclosure'+index" type="file">
                </div>
              </div>
            </div>
            <div class="flagBox">
              <div v-for="item,index in falgAry" class="mb10"  v-show='index!=falgAry.length-1' :key="index">
                flag:
                <el-input v-model="item.flag" width="300px" :disabled='source==2'/>
                <!--<el-button type="danger" size="mini" icon="el-icon-close" @click="removeEnc(index)"/>-->
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('selfHelp_competition.pulblic')">
          <el-switch  :disabled='source==2' v-model="ruleForm.public"/>
        </el-form-item>
        <el-form-item :label="$t('selfHelp_competition.topic_WP')">
          <div v-show="ruleForm.official_writeup">
            <!--<a :href="ruleForm.official_writeup" download>-->
              <el-button type="success" size="mini">{{$t('selfHelp_competition.topic_WP')}}</el-button>
            <!--</a>-->
            <!--<el-button type="danger" size="mini" @click="removeWriteup">删除wp</el-button>-->
          </div>
          <span v-show='source!=2'>
            <input ref="writeUp" type="file">{{$t('selfHelp_competition.only_pdf')}}
          </span>
        </el-form-item>
        <el-form-item class="text-center">
          <el-button type="primary" class="cancelSubmit" @click="goBack">{{$t('modal.cancel')}}</el-button>
          <el-button type="primary" class="createSubmit mrg30R" @click="submitForm">{{$t('modal.submit')}}</el-button>

        </el-form-item>
      </div>




      <div v-if="ruleForm.is_dynamic_flag==1">
        <el-form-item :label="$t('selfHelp_competition.topic_atta')">

          <div v-if="enclosureAry[0]!=1">
            <a :href="ruleForm.file[0]" download>
              <el-button type="success" size="mini">{{$t('selfHelp_competition.topic_atta')}}</el-button>
            </a>
            <!--<el-button type="danger" size="mini" @click="removeEnc(0)">删除附件</el-button>-->

          </div>
          <div v-for="(item,index) in enclosureAry" v-show='source!=2'>
            <input :ref="'enclosure'+index" type="file">{{$t('selfHelp_competition.only_zip')}}
          </div>
        </el-form-item>
        <el-form-item label="docker compose file">
          <el-input
            :rows="4"
            :disabled='source==2'
            v-model="ruleForm.docker_compose_file"
            type="textarea"
            :placeholder="$t('selfHelp_competition.enter_cont')"/>
        </el-form-item>
        <el-form-item :label="$t('selfHelp_competition.dyc_flag_script')">
          <div v-if="ruleForm.push_flag_script">
            <a :href="ruleForm.push_flag_script" download>
              <el-button type="success" size="mini">{{$t('selfHelp_competition.flag_script')}}</el-button>
            </a>
            <!--<el-button type="danger" size="mini" @click="removeScript">删除脚本</el-button>-->
          </div>
        </el-form-item>
        <el-form-item :label="$t('selfHelp_competition.topic_sence')">

          <el-radio :disabled='source==2' v-model="ruleForm.is_share" :label="0">{{$t('selfHelp_competition.Exclusive')}}</el-radio>
          <el-radio :disabled='source==2' v-model="ruleForm.is_share" :label="1">{{$t('selfHelp_competition.shared')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('selfHelp_competition.pulblic')">
          <el-switch v-model="ruleForm.public"/>
        </el-form-item>
        <el-form-item :label="$t('selfHelp_competition.topic_WP')">
          <div v-show="ruleForm.official_writeup">
            <a :href="ruleForm.official_writeup" download>
              <el-button type="success" size="mini">{{$t('selfHelp_competition.topic_WP')}}</el-button>
            </a>
            <!--<el-button type="danger" size="mini" @click="removeWriteup">删除wp</el-button>-->
          </div>
          <span v-show='source!=2'>
            <input ref="writeUp" type="file">{{$t('selfHelp_competition.only_pdf')}}
          </span>
        </el-form-item>
        <el-form-item class="text-center">
          <el-button type="primary" class="cancelSubmit" @click="goBack">{{$t('modal.cancel')}}</el-button>
          <el-button type="primary" class="createSubmit mrg30R" @click="submitForm">{{$t('modal.submit')}}</el-button>
        </el-form-item>
      </div>


      <div v-if="ruleForm.is_dynamic_flag==3">
        <el-form-item :label="$t('selfHelp_competition.topic_atta')">

          <div v-if="enclosureAry[0]!=1">
            <a :href="ruleForm.file[0]" download>
              <el-button type="success" size="mini">{{$t('selfHelp_competition.topic_atta')}}</el-button>
            </a>
            <!--<el-button type="danger" size="mini" @click="removeEnc(0)">删除附件</el-button>-->

          </div>
          <span v-for="(item,index) in enclosureAry" v-if="source!=2">
            <input :ref="'enclosure'+index" type="file">{{$t('selfHelp_competition.only_zip')}}
          </span>
        </el-form-item>
        <el-form-item label="docker compose file">
          <el-input
                  :disabled='source==2'
                  :rows="4"
                  v-model="ruleForm.docker_compose_file"
                  type="textarea"
                  :placeholder="$t('selfHelp_competition.enter_cont')"/>
        </el-form-item>
        <el-form-item :label="$t('selfHelp_competition.topic_flag')">
          <el-input
                  :disabled='source==2'
                  v-for="item,index in falgAry"
                  v-model="item.flag"
                  type="input"
                  :key="index"
                  :placeholder="$t('selfHelp_competition.fell_flag')"/>
        </el-form-item>
        <el-form-item  :label="$t('selfHelp_competition.topic_sence')">

          <el-radio :disabled='source==2' v-model="ruleForm.is_share" :label="0">{{$t('selfHelp_competition.Exclusive')}}</el-radio>
          <el-radio :disabled='source==2' v-model="ruleForm.is_share" :label="1">{{$t('selfHelp_competition.shared')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('selfHelp_competition.pulblic')">
          <el-switch  :disabled='source==2'   v-model="ruleForm.public" />
        </el-form-item>
        <el-form-item :label="$t('selfHelp_competition.topic_WP')">
          <div v-if="ruleForm.official_writeup">
            <a :href="ruleForm.official_writeup" download>
              <el-button type="success" size="mini">{{$t('selfHelp_competition.topic_WP')}}</el-button>
            </a>
            <!--<el-button type="danger" size="mini" @click="removeWriteup">删除wp</el-button>-->
          </div>
          <span  v-if="source!=2">
            <input ref="writeUp" type="file">{{$t('selfHelp_competition.only_pdf')}}
          </span>
        </el-form-item>
        <el-form-item class="text-center">
          <el-button type="primary" class="cancelSubmit" @click="goBack">{{$t('modal.cancel')}}</el-button>
          <el-button type="primary" class="createSubmit mrg30R" @click="submitForm">{{$t('modal.submit')}}</el-button>
        </el-form-item>
      </div>
    </el-form>

  </div>
</template>

<script>
  import mavonOptions from '@/utils/mavonOptions'

export default {
  data() {
    return {
      language:localStorage.lang=='EN'?'en':'zh-CN',
      attaName:'',//题目附件名称
      wpName:'',//wp名称
      toolbars: mavonOptions,//markdown编辑器的配置项
      task_id: this.$route.query.task_id,
      source: '',//题目来源
      mathMode:{},
      showEn: true,
      falgType: '1',
      subType: [],
      enclosureAry: [1],
      falgAry: [{ flag: '' }],
      ruleForm: {
        score: 0,
        file: [],
        answer: [],
        official_writeup: null,
        event_id: this.$route.query.id,
        title: '', // 题目名称
        category_id: 1, // 题目类型id
        content: '', // 题目内容
        is_dynamic_flag: 0, // 是否是动态环境
        is_share: 0, // 是否共享
        docker_compose_file: '', // docker_compose_file
        public: 1, // public
        push_flag_script: '' // push falg
      },
      rules: {
        title: [
          { required: true, message: this.$t('selfHelp_competition.fell_topic_name'), trigger: 'blur' },
          { min: 2, max: 30, message: this.$t('selfHelp_competition.lang_err'), trigger: 'blur' }
        ],
        score: [
          {  required: true, trigger: 'blur' }
        ],
        category_id: [
          { type: 'number', required: true, message: '请选择题目类型', trigger: 'change' }
        ]
      },
      mdStyle:'code-dark'
    }
  },
  created() {
    this.getSubType()
    this.getMode()
    if (this.task_id) this.subInfo()
  },
  methods: {
    chosefile(e,name){//选择文件的回调函数
      if(this[name]=e.target.files[0]){
        this[name]=e.target.files[0].name;
      }else{
        this[name]='';
      }

    },
    goBack(){
      history.back();
    },
    getMode() {
      this.$http.get('/api/sponsor/event_mode/'+this.$route.query.id).then(res => {
        this.mathMode = res.data
      })
    },
    // removeWriteup() {
    //   this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     deleteWriteup(this.task_id).then(res => {
    //       if (res.data.success) {
    //         this.ruleForm.official_writeup = null
    //       }
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     })
    //   })
    // },
    subInfo() { // 题目信息回显
      this.$http.get('/api/sponsor/event_tasks/' +this.task_id).then(res => {

        for(const k in this.ruleForm){
          this.ruleForm[k]=res.data[k]
          if(k=='public'){
            if(res.data[k]==1){
              this.ruleForm[k]=true
            }else{
              this.ruleForm[k]=false
            }
          }
        }
        this.source=res.data.source;

        if (res.data.answer.length > 0) {
          this.falgAry = res.data.answer.map(item => {
            return { flag: item }
          })
        }

        if (res.data.file.length > 0) {
          this.enclosureAry = res.data.file.map(item => {
            return item
          })
        }

        if (this.ruleForm.is_dynamic_flag == 2) {
          this.falgAry.push({ flag: '' })
          this.enclosureAry.push(1)
        }
      })
    },
    handleType(val) { // 切换环境的时候初始化
      // if (val === 0) {
      //   this.falgAry = [{ flag: '' }]
      //   this.ruleForm.file = []
      //   this.enclosureAry = [1]
      //   this.ruleForm.push_flag_script = ''
      // } else if (val === 1) {
      //   this.falgAry = [{ flag: '' }]
      //   this.ruleForm.file = []
      //   this.enclosureAry = [1]
      // } else {
      //   this.falgAry = [{ flag: '' }]
      //   this.ruleForm.file = []
      //   this.enclosureAry = [1]
      //   this.ruleForm.push_flag_script = ''
      //   this.ruleForm.docker_compose_file = ''
      // }
    },
    getSubType() { // 获取题目类型
      this.$http.get('/api/sponsor/task_category').then(res => {
        this.subType = res.data
      })
    },
    checkFormat(flie, key, name) {
      const AllImgExt = name
      const extName = flie.name.substring(flie.name.lastIndexOf('.')).toLowerCase()
      if (AllImgExt.indexOf(extName) == -1) {
        this.$notify.error({
          customClass:'error_notify',
          title:this.$t('public.error'),
          message:key + this.$t('selfHelp_competition.must_be') + name,
        });
        // this.$message.error(key + ' 必须是' + name)
        return false
      } else {
        return true
      }
    },
    onSubmit() {
      const AllImgExt = '.zip'
      const fm = new FormData()
      const formData = JSON.parse(JSON.stringify(this.ruleForm))
      delete formData.answer
      delete formData.file
      delete formData.official_writeup
      delete formData.source;
      delete formData.is_share;

      if(this.falgAry[0].flag===''){
        this.$notify.error({
          customClass:'error_notify',
          title:this.$t('public.error'),
          message:this.$t('selfHelp_competition.fill_flag'),
        });
        return
      }


      if(this.source!=2){//如果是题就只传两个参数
        for (let i = 0; i < this.enclosureAry.length; i++) {
          if (this.enclosureAry[i] !== 1 && formData.is_dynamic_flag === 2 && this.falgAry[i].flag.length <= 0) {

            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message:'flag必须和文件对应',
            });
            // this.$message.error('flag必须和文件对应')
            return
          } else {
            if (formData.is_dynamic_flag === 2 && this.$refs['enclosure' + i][0].files.length < 1 && this.falgAry[i].flag.length > 0) {
              this.$notify.error({
                customClass:'error_notify',
                title:this.$t('public.error'),
                message:'flag必须和文件对应',
              });
              // this.$message.error('flag必须和文件对应')
              return
            }

            if (this.$refs['enclosure' + i][0].files.length > 0) {
              if (!this.checkFormat(this.$refs['enclosure' + i][0].files[0], this.$t('selfHelp_competition.topic_atta'), '.zip')) {
                return
              }
              if (this.$refs['enclosure' + i][0].files[0].size>8*1024*1024) {
                this.$notify.error({
                  customClass:'error_notify',
                  title:this.$t('public.error'),
                  message:this.$t('selfHelp_competition.writeup_size'),
                });
                // this.$message.error('文件大小不应超过8M');
                return
              }
              fm.append('file' + i, this.$refs['enclosure' + i][0].files[0])
            }
          }
        }

        if (this.$refs['writeUp'].files.length > 0) {
          if (!this.checkFormat(this.$refs['writeUp'].files[0], 'writeUp', '.pdf.png.md')) {
            return
          }
          if (this.$refs['writeUp'].files[0].size>8*1024*1024) {
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message:this.$t('selfHelp_competition.writeup_size'),
            });
            // this.$message.error('文件大小不应超过8M');
            return
          }
          fm.append('official_writeup', this.$refs['writeUp'].files[0])
        }

        for (let i = 0; i < this.falgAry.length; i++) {
          if (this.enclosureAry[i] == 1) {
            if (formData.is_dynamic_flag == 2 && this.$refs['enclosure' + i][0].files.length > 0 && this.falgAry[i].flag == '') {
              this.$notify.error({
                customClass:'error_notify',
                title:this.$t('public.error'),
                message:'flag必须和文件对应',
              });
              // this.$message.error('flag必须和文件对应')
              return
            }
          }

          if (this.falgAry[i].flag.length > 0) {
            fm.append('flag' + i, this.falgAry[i].flag)
          }
        }
        for (const key in formData) {
          if(key=='public'){
            fm.append(key, formData[key] ? 1:0)
          }else{
            fm.append(key, formData[key])
          }
        }

      }else{
        for (const key in formData) {
          if(key=='public'){
            fm.append(key, formData[key] ? 1:0)
          }else{
            fm.append(key, formData[key])
          }
        }

        fm.title = formData.title
        fm.content = formData.content
      }

      fm.append('event_id', this.$route.query.id)
      if (this.task_id) {
        this.$http.patch('/api/sponsor/event_tasks/'+this.task_id, fm,{loading:true}).then(res => {
          if (res.data.success) {
            this.$router.push({
              path: '/common/manage/operation',
              query: { id: this.$route.query.id }
            })
          }
        }).catch(res => {

        })
      } else {
        this.$http.post('/api/sponsor/event_tasks',fm,{loading:true}).then(res => {
          if (res.data.success) {
            this.$router.push({
              path: '/common/manage/operation',
              query: { id: this.$route.query.id }
            })
          }

        }).catch(res => {

        })
      }
    },
    addEnc() {
      this.enclosureAry.push(1)
      this.falgAry.push({ flag: '' })
    },
    // removeEnc(index) { // 点击删除
    //   this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     if (this.enclosureAry[index] == 1) {
    //       this.$refs['enclosure' + index][0].value = ''
    //     }
    //     if (this.enclosureAry[index] != 1) {
    //       deleteFile(this.task_id, index).then(res => {
    //         if (this.ruleForm.is_dynamic_flag == 2) {
    //           this.enclosureAry.splice(index, 1)
    //           this.falgAry.splice(index, 1)
    //         } else {
    //           this.enclosureAry = [1]
    //         }
    //       })
    //     }
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     })
    //   })
    // },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.onSubmit()
        } else {
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('selfHelp_competition.writeError'),
          });
          // this.$message.error('请核验所填写的信息')
          return false
        }
      })
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>

<style>
  .randomBox {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .randomBox .uploadBox {
    width: 300px;
  }

  .randomBox .flagBox {
    flex: 1;
  }

  .randomBox .flagBox .el-input {
    width: 70%;
  }

  .flex-align {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .flex-align span {
    display: inline-block;
    margin: 0 10px;
  }

  .createMatchTopic_box {
    width: 90%;
    min-width: 600px;
    margin:0 auto;
  }

  .createMatchTopic_box .el-input-number__increase,  .createMatchTopic_box .el-input-number__decrease {
    color: #fff;
    background: #0d223d;
    border-left: 1px solid #053a66;
    border-right: 1px solid #053a66;
  }
  .createMatchTopic_box .el-input-number.is-disabled .el-input-number__increase,  .createMatchTopic_box .el-input-number.is-disabled .el-input-number__decrease {
    color: #fff;
    background: #0d223d;
    border-left: 1px solid #053a66;
    border-right: 1px solid #053a66;
  }
  .createMatchTopic_box .te-switch-button {
    vertical-align: top;
  }
  .createMatchTopic_box .up_file, .createMatchTopic_box .up_file:hover {
    text-align: center;
    display: inline-block;
    width: 140px;
    height: 40px;
    line-height: 40px;
    position: relative;
    vertical-align: top;
  }
  .createMatchTopic_box .file_item {
    position: absolute;
    opacity: 0;
    left: 0;
    top: 0;
    width: 140px;
    height: 30px;
  }
  .createMatchTopic_box .descrip{
    text-align: left;
    display: inline-block;
    width: 340px;
    position: absolute;
    left: 145px;
    color: #f76464;
  }
</style>
