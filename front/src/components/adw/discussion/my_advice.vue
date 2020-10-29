<template>
  <div class="dis_detail">
    <div >
      <div  v-for="(item,i) in answerResult_cover" style="text-align:left;" class="all_answer mrg10B pad20A pad5T">
        <q-content
          :content="answerResult_content[i]"
          :cover="item"
          :index="i"
          :hasCover="item.has_cover"
          @show_all="is_showAll"
        ></q-content>
        <q-handle :data="item" @showComment="getItem" :index="i" @changeLookBtn="getBtnStatus"></q-handle>
        <div class="clearfix mrg10T text-left whiteC">
          <div class="clearfix posRelative col-sm-12  nofr mrg10B comment_level2 mrg10T comment_main">
            <div class="portrait humanIco2 ">
              <a class="fl humanIco" style="background:url(/static/adw/web/img/def_icon.jpg)no-repeat;background-size:cover;">

              </a>
            </div>
            <div class="commentText" style="padding-left:30px;">
              <div class="comment-content pad5T pad10L">
                <p class="mrg20B">
                  <span class="font28 mrg20R weight">
                      <span class="u_name"></span>
                      <span class="font14 def_blue2">回复</span>
                      <span class="def_blue2 weight">涛涛</span>
                  </span>
                  <span class="font12 comment_time">2018-11-26 13:27:39</span>
                </p>
                <p class="content font14 c333 comment_inner mrg5T">
                  不错不错
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import content from './common/question_content'
  import handle from './common/content_handle'

  export default {
    name: 'my_advice',
    components:{
      'q-content':content,
      'q-handle':handle,
    },
    data () {
      return {
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
      let data2 = [//回答
        {
          id:51,
          user_id:2,
          user_name: '小王',
          user_logo: 1,
          time: '2019-2-3',
          type: 3,
          is_thumb: true,
          thumb_number: 1,
          comment_number: 1,
          answer_number: 1,
          is_collect:true,
          is_current:true,
          has_cover:false,
          cover:'',
          content: `
                      <p><img src="/media/image/1ec44458f4c411e89cd5000c2945a46a.png" alt=""><br>这个题目TWCTF{Bliss by Charles O’Rear}到底有什么问题？<br>试了几个加下划线，把TWCTF换成别的也不对</p>
                      `
        },
        {
          id:58,
          user_id:2,
          user_name: '小王',
          user_logo: 1,
          time: '2019-2-3',
          type: 3,
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
        },
        {
          id:68,
          user_id:2,
          user_name: '小王',
          user_logo: 1,
          time: '2019-2-3',
          type: 3,
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
                      `
        }
      ]
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
  .all_answer{
    width:100%;
    edge-angle()
    card_style()
    margin-top:20px;
    .answer_number{
      font-size:16px;
      color:white;
      padding-top:10px;
      .number{
        color:darkblue2;
      }
    }
  }
  .humanIco2{
    vertical-align middle;
    margin-right:20px;
  }
  .humanIco {
      width: 30px;
      height: 30px;
      border: 1px solid rgba(255,255,255,.2);
      border-radius: 50%;
      display: inline-block;
      overflow: hidden;
      position: absolute;
      left: 0;
    }
  .def_blue2{
    color:darkblue2;
  }
</style>

