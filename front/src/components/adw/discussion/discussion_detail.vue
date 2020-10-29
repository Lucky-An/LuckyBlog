<template>
  <div class="dis_detail">
    <discussion_list
      :answerList_content="answerList_content"
      :answerList_cover="answerList_cover"
    >
      <div slot="other">
        <div class="ad_i_want_answer ad_write_something" @click="answer_box_show = true" v-if="!answer_box_show">我要回答</div>
        <div class="is_answer_box" v-else>
          <el-form :model="answerForm" :rules="rule" ref="answerForm" class="demo-ruleForm">
            <el-form-item prop="answer_content">
              <mavon-editor
                      class="height300"
                      :language="language"
                      :toolbars="toolbars"
                :ishljs = "true"
                v-model="answerForm.answer_content"/>
            </el-form-item>
            <el-form-item  prop="uuid" >
              <imgCode @sendImgCode="getImgCode"></imgCode>
            </el-form-item>
            <div class="mrg30T mrg30B text-center">
              <div class="cancel_answer" @click="answer_box_show = false">取消</div>
              <div class="goingAnswer cursor add_question_answer" @click="submitAnswer('answerForm')">提交</div>
            </div>
          </el-form>
        </div>
      </div>
    </discussion_list>
    <div class="all_answer">
      <div class="answer_number pad20T">
        全部回答
        <span class="number">(1条)</span>
      </div>
      <div>
        <div v-for="(item,i) in answerResult_cover" style="text-align:left;" class="result_wrap mrg10B pad20L pad20R">
          <q-content
            :content="answerResult_content[i]"
            :cover="item"
            :index="i"
            :hasCover="item.has_cover"
            @show_all="is_showAll"
          ></q-content>
          <q-handle :data="item" @showComment="getItem" :index="i" @changeLookBtn="getBtnStatus"></q-handle>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import discussion_list from './common/discussion_list'
  import imgCode from '@/components/common_components/img_code'
  import content from './common/question_content'
  import handle from './common/content_handle'
  import mavonOptions from '@/utils/mavonOptions'

  export default {
    name: 'discussion_detail',
    components:{
      'q-content':content,
      'q-handle':handle,
      'discussion_list':discussion_list,
      'imgCode':imgCode
    },
    data () {
      return {
        language:localStorage.lang=='EN'?'en':'zh-CN',
        toolbars: mavonOptions,//markdown编辑器的配置项
        answerList_content:[],
        answerList_cover:[],
        answerResult_content:[],
        answerResult_cover:[],
        answerForm:{
          answer_content:'',
          uuid:''
        },
        new_img_code:'',
        rule:{
          answer_content: [
            { required: true, message: '请输入文字', trigger: 'blur' },
          ],
          uuid:[
            { required: true, message: '请输入验证码', trigger: 'blur' },
          ],
        },
        answer_box_show:false
      }
    },
    created(){
      let data = [//问答列表
        {
          id:51,
          user_id:2,
          title: '测试测试',
          user_name: '小王',
          user_logo: 1,
          time: '2019-2-3',
          type: 1,
          is_thumb: true,
          thumb_number: 1,
          comment_number: 1,
          answer_number: 1,
          is_collect:true,
          is_current:true,
          topic:['flag格式','xctf'],
          has_cover:true,
          cover:'',
          content: `
                     <h3>访问过问过我很温和会问我英文因为文艺委员王伟业，访问过问过我很温和会问我英文因为文艺委员王伟业，访问过问过我很温和会问我英文因为文艺委员王伟业。访问过问过我很温和会问我英文因为文艺委员王伟业</h3>
                      <p><img src="/media/image/1ec44458f4c411e89cd5000c2945a46a.png" alt=""><br>这个题目TWCTF{Bliss by Charles O’Rear}到底有什么问题？<br>试了几个加下划线，把TWCTF换成别的也不对</p>
                      <p><img src="/media/image/1ec44458f4c411e89cd5000c2945a46a.png" alt=""><br>这个题目TWCTF{Bliss by Charles O’Rear}到底有什么问题？<br>试了几个加下划线，把TWCTF换成别的也不对</p>
                      <p><img src="/media/image/0496a364f4ab11e89cd5000c2945a46a.png" alt=""><img src="/media/image/1a8ea5ccf4ab11e89cd5000c2945a46a.png" alt=""><br>很明显，flag是不对的，引用外国ctf比赛的flag应当规定一个固定格式。</p>
                      `
        }
      ]
      let data2 = [//回答
        {
          id:51,
          user_id:2,
          user_name: '小王',
          user_logo: 1,
          time: '2019-2-3',
          type: 2,
          is_thumb: true,
          thumb_number: 1,
          comment_number: 1,
          answer_number: 1,
          is_collect:true,
          is_current:true,
          has_cover:false,
          cover:'',
          content: `
                     <h3>访问过问过我很温和会问我英文因为文艺委员王伟业，访问过问过我很温和会问我英文因为文艺委员王伟业，访问过问过我很温和会问我英文因为文艺委员王伟业。访问过问过我很温和会问我英文因为文艺委员王伟业</h3>
                      <p><img src="/media/image/1ec44458f4c411e89cd5000c2945a46a.png" alt=""><br>这个题目TWCTF{Bliss by Charles O’Rear}到底有什么问题？<br>试了几个加下划线，把TWCTF换成别的也不对</p>
                      `
        },
        {
          id:58,
          user_id:2,
          user_name: '小王',
          user_logo: 1,
          time: '2019-2-3',
          type: 2,
          is_thumb: true,
          thumb_number: 1,
          comment_number: 1,
          answer_number: 1,
          is_collect:true,
          is_current:true,
          has_cover:false,
          cover:'',
          content: `
                     <h3>访问过问过我很温和会问我英文因为文艺委员王伟业，访问过问过我很温和会问我英文因为文艺委员王伟业，访问过问过我很温和会问我英文因为文艺委员王伟业。访问过问过我很温和会问我英文因为文艺委员王伟业</h3>
                      <p><img src="/media/image/1ec44458f4c411e89cd5000c2945a46a.png" alt=""><br>这个题目TWCTF{Bliss by Charles O’Rear}到底有什么问题？<br>试了几个加下划线，把TWCTF换成别的也不对</p>
                      <p><img src="/media/image/1ec44458f4c411e89cd5000c2945a46a.png" alt=""><br>这个题目TWCTF{Bliss by Charles O’Rear}到底有什么问题？<br>试了几个加下划线，把TWCTF换成别的也不对</p>
                      <p><img src="/media/image/0496a364f4ab11e89cd5000c2945a46a.png" alt=""><img src="/media/image/1a8ea5ccf4ab11e89cd5000c2945a46a.png" alt=""><br>很明显，flag是不对的，引用外国ctf比赛的flag应当规定一个固定格式。</p>
                      `
        }
      ]
      //过滤图片，过滤html字数（重要）
      data.forEach((item,index)=>{
        item.showAll = false;
        item.showLookLabel = false;
        item.show_comment = false;
        item.content = item.content.replace(/<script.*?>.*?<\/script>/ig, '');
      })
      this.answerList_content = data;
      this.answerList_cover = data;
      this.answerList_content.forEach((item,index)=>{
        item.content = item.content.replace(/<(img).*?>/g, " [图片] ");
      })
      data2.forEach((item,index)=>{
        item.showAll = false;
        item.showLookLabel = false;
        item.show_comment = false;
        item.content = item.content.replace(/<script.*?>.*?<\/script>/ig, '');
      })
      this.answerResult_content = data2;
      this.answerResult_cover = data2;
      this.answerResult_content.forEach((item,index)=>{
        item.content = item.content.replace(/<(img).*?>/g, " [图片] ");
      })
    },
    methods:{
      submitAnswer(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            return false;
          }
        });
      },
      getImgCode(val){
        this.answerForm.uuid = val.img_code;
        this.new_img_code = val.img_auth_code;
      },
      getItem(item){
        this.answerResult_cover[item.index].show_comment = !item.status;
      },
      is_showAll(val){
        this.answerResult_cover[val.number].showLookLabel = val.status;
      },
      getBtnStatus(val){
        this.answerResult_cover[val.index].showAll = val.status;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ad_i_want_answer, .add_question_answer {
    width: 235px;
    height: 44px;
    background: url('~@/assets/img/button/big.png') no-repeat;
    background-size: 100% 100%;
    border-radius: 4px;
    margin: 40px auto 20px;
    line-height: 44px;
    text-align: center;
    color: white;
    font-size: 16px;
    cursor: pointer;
    display: block;
  }
  .cancel_answer {
    width: 100px;
    height: 44px;
    background-image: url('~@/assets/img/button/hui.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-color: none;
    border: none;
    border-radius: 4px;
    vertical-align: top;
    margin-right: 30px;
    text-align:center;
    color:white;
    line-height:44px;
    display: inline-block;
    cursor:pointer;
  }
  .add_question_answer {
    display: inline-block;
    margin: 0;
  }
  .goingAnswer {
    padding: 2px 10px;
    border: none;
  }
  .all_answer{
    width:100%;
    edge-angle()
    card_style()
    margin-top:20px;
    .result_wrap{
      border-bottom:1px solid borderColor;
      padding-bottom:10px;
      &:last-child{
        border-bottom:none;
      }
    }
    .answer_number{
      font-size:16px;
      color:white;
      padding-top:10px;
      .number{
        color:darkblue2;
      }
    }
  }
</style>

