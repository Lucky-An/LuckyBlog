<template>
  <div class="dis_content">
      <discussion_list
        :answerList_content="answerList_content"
        :answerList_cover="answerList_cover"
      ></discussion_list>
  </div>
</template>

<script>
  import discussion_list from './common/discussion_list'

  export default {
    components:{
      'discussion_list':discussion_list,
    },
    name: 'discussion',
    data(){
      return {
        answerList_content:[],
        answerList_cover:[],
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
        },
        {
          id:50,
          user_id:2,
          title: '测试测试',
          user_name: '小王',
          user_logo: 1,
          time: '2019-2-3',
          type: 1,
          is_thumb: false,
          thumb_number: 1,
          comment_number: 1,
          answer_number: 1,
          is_collect:false,
          is_current:false,
          topic:['flag格式','xctf'],
          has_cover:true,
          cover:'',
          content: `
                     <h3>访问过问过我很温和会问我英文因为文艺委员王伟业，访问过问过我很温和会问我英文因为文艺委员王伟业，访问过问过我很温和会问我英文因为文艺委员王伟业。访问过问过我很温和会问我英文因为文艺委员王伟业</h3>
                      <p><img src="/media/image/1ec44458f4c411e89cd5000c2945a46a.png" alt=""><br>这个题目TWCTF{Bliss by Charles O’Rear}到底有什么问题？<br>试了几个加下划线，把TWCTF换成别的也不对</p>
                      <p><img src="/media/image/1ec44458f4c411e89cd5000c2945a46a.png" alt=""><br>这个题目TWCTF{Bliss by Charles O’Rear}到底有什么问题？<br>试了几个加下划线，把TWCTF换成别的也不对</p>
                      <p><img src="/media/image/0496a364f4ab11e89cd5000c2945a46a.png" alt=""><img src="/media/image/1a8ea5ccf4ab11e89cd5000c2945a46a.png" alt=""><br>很明显，flag是不对的，引用外国ctf比赛的flag应当规定一个固定格式。</p>
                      `
        },
        {
          id:45,
          user_id:2,
          title: '测试测试',
          user_name: '小王',
          user_logo: 1,
          time: '2019-2-3',
          type: 1,
          is_thumb: false,
          thumb_number: 1,
          comment_number: 1,
          answer_number: 1,
          is_collect:false,
          is_current:false,
          topic:['flag格式','xctf'],
          has_cover:false,
          cover:'',
          content: `
                   <h3>访问过问过我很温和会问我英文因为文艺委员王伟业，访问过问过我很温和会问我英文因为文艺委员王伟业，访问过问过我很温和会问我英文因为文艺委员王伟业。访问过问过我很温和会问我英文因为文艺委员王伟业</h3>
                    <p><img src="/media/image/1ec44458f4c411e89cd5000c2945a46a.png" alt=""><br>这个题目TWCTF{Bliss by Charles O’Rear}到底有什么问题？<br>试了几个加下划线，把TWCTF换成别的也不对</p>
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
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
