<template>
  <div class=" paper">

    <nav class="">
      <div class="paper_info">
        <span v-if="!edit&&showUser">
          姓名：{{ username }}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          得分：{{ sum_score }}分
        </span>
        <span>
          题目总数量：{{ radioList.length + checkBoxList.length + judgeList.length }}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          试卷总分：{{ Number.parseFloat((judgeScore + radioScore + checkBoxScore).toPrecision(12)) }}分
        </span>
        <el-button
          v-waves
          v-if="edit"
          style="float: right;"
          class="filter-item"
          type="primary"
          size="mini"
          @click="submitPaper">保存
        </el-button>
      </div>
    </nav>

    <!--单选题 begin-->
    <div class="sub_box">
      <div class="title">
        一、单选题（共 {{ radioList.length }} 题，共 {{ Number.parseFloat(( radioScore ).toPrecision(12)) }} 分）
      </div>
      <div v-for="(v,i) in radioList" class="content clearfix">

        <div class="topic">

          <div class="sub_title clearfix">

            <span>{{ i+1 }}、[ 单选 ]
              <span v-if="showUser">
                <b> 用户答案：</b>{{ v.question }} &nbsp;
                <b>正确答案：</b>{{ v.answer }}
              </span>
            </span>
            <span class="sub_score">
              本题 <el-input-number
                v-if="edit"
                v-model="v.point"
                :min="1"
                :max="100"
                :precision="1"
                size="mini"
                label="描述文字"
                @change="handleChange(v)"/>
              <span v-else>{{ v.point }}</span> 分
              <el-button v-if="edit" type="danger" icon="el-icon-delete" circle size="mini" @click="deleteTopic(v)"/>
            </span>
          </div>

          <div class="ql-snow">
            <span class="topic_content ql-editor" v-html="v.content_html"/>
          </div>

          <!--<span v-if="v.file" class="file"><b>题目附件：</b>-->
          <!--<a :href="v.file" download><el-button v-waves v-if="edit" type="success" size="mini">下载</el-button></a>-->
          <!--</span>-->

          <p v-for="(ans,k) in v.option_html" class="opation">
            <el-tag size="mini" effect="plain">
              选项{{ k }}
            </el-tag> &nbsp;
            <span class="ql-snow">
              <span class="ql-editor" v-html="ans"/>
            </span>
          </p>
        </div>

      </div>

    </div>
    <!--单选题 end-->

    <!--多选题 begin-->
    <div class="sub_box">
      <div class="title">
        二、多选题（共 {{ checkBoxList.length }} 题，共 {{ Number.parseFloat(( checkBoxScore ).toPrecision(12)) }} 分）
      </div>
      <div v-for="(v,i) in checkBoxList" class="content clearfix">
        <div class="topic">

          <div class="sub_title clearfix">

            <span>{{ i+1 }}、[ 多选 ]
              <span v-if="showUser">
                <b> 用户答案：</b>{{ v.question }} &nbsp;
                <b>正确答案：</b>{{ v.answer }}
              </span>
            </span>
            <span class="sub_score">
              本题 <el-input-number
                v-if="edit"
                v-model="v.point"
                :min="1"
                :max="100"
                :precision="1"
                size="mini"
                label="描述文字"
                @change="handleChange(v)"/>
              <span v-else>{{ v.point }}</span> 分
              <el-button v-if="edit" type="danger" icon="el-icon-delete" circle size="mini" @click="deleteTopic(v)"/>
            </span>
          </div>

          <div class="ql-snow">
            <span class="topic_content ql-editor" v-html="v.content_html"/>
          </div>

          <!--<span v-if="v.file" class="file"><b>题目附件：</b>-->
          <!--<a :href="v.file" download><el-button v-waves v-if="edit" type="success" size="mini">下载</el-button></a>-->
          <!--</span>-->

          <p v-for="(ans,k) in v.option_html" class="opation">
            <el-tag size="mini" effect="plain">
              选项{{ k }}
            </el-tag> &nbsp;
            <span class="ql-snow">
              <span class="ql-editor" v-html="ans"/>
            </span>
          </p>
        </div>
      </div>
    </div>
    <!--多择题 end-->

    <!--判断题 begin-->
    <div class="sub_box">
      <div class="title">
        三、判断题（共 {{ judgeList.length }} 题，共 {{ Number.parseFloat(( judgeScore ).toPrecision(12)) }} 分）
      </div>

      <div v-for="(v,i) in judgeList" class="content clearfix">
        <div class="topic">
          <div class="sub_title clearfix">

            <span>{{ i+1 }}、[ 判断 ]
              <span v-if="showUser">
                <b> 用户答案：</b>{{ v.question }} &nbsp;
                <b>正确答案：</b>{{ v.answer }}
              </span>
            </span>

            <span class="sub_score">
              本题 <el-input-number
                v-if="edit"
                v-model="v.point"
                :min="1"
                :max="100"
                :precision="1"
                size="mini"
                label="描述文字"
                @change="handleChange(v)"/>

              <span v-else>{{ v.point }}</span> 分
              <el-button v-if="edit" type="danger" icon="el-icon-delete" circle size="mini" @click="deleteTopic(v)"/>
            </span>
          </div>

          <div class="ql-snow">
            <span class="topic_content ql-editor" v-html="v.content_html"/>
          </div>

          <!--<span v-if="v.file" class="file"><b>题目附件：</b>-->
          <!--<a :href="v.file" download><el-button v-waves v-if="edit" type="success" size="mini">下载</el-button></a>-->
          <!--</span>-->

          <p v-for="(ans,k) in v.option_html" class="opation">
            <el-tag size="mini" effect="plain">
              选项{{ k }}
            </el-tag> &nbsp;
            <span class="ql-snow">
              <span class="ql-editor" v-html="ans"/>
            </span>

          </p>
        </div>

      </div>
    </div>

    <!--判断题 end-->
  </div>
</template>

<script>
import waves from '@/directive/waves'
import 'tui-editor/dist/tui-editor-contents.css' //

export default {
  name: 'Index',
  directives: { waves },
  props: {
    judgeList: Array,
    radioList: Array,
    checkBoxList: Array,
    judgeScore: Number,
    radioScore: Number,
    checkBoxScore: Number,
    sum_score: Number,
    username: String,
    hash: String,
    edit: {
      default: false,
      type: Boolean
    },
    showUser: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    deleteTopic(val) { // 删除试卷中的题目
      this.$emit('deleteTopic', val)
    },
    handleChange(v) {
      // type_id 1单选 2多选 3判断
      if (v.type_id === 1) {
        // this.$emit('update:radioList')
        this.$emit('getSore', this.radioList, 'radioScore')
      }
      if (v.type_id === 2) {
        // this.$emit('update:checkBoxList')
        this.$emit('getSore', this.checkBoxList, 'checkBoxScore')
      }
      if (v.type_id === 3) {
        // this.$emit('update:judgeList')
        this.$emit('getSore', this.judgeList, 'judgeScore')
      }
    },
    submitPaper() {
      this.$emit('submitPaper')
    }
  }
}
</script>

<style scoped>
  .paper {
    width: 100%;
    background: #fff;
    border: 1px solid #afafaf;
  }

  .paper nav {
    line-height: 28px;
    padding: 20px 20px 0;
  }

  .paper_info {
    display: flex;
    justify-content: space-between;
  }

  .sub_box {
    padding: 20px;
  }

  .content {
    padding: 10px;
    margin-top: 10px;
    font-size: 13px;
    color: #757575;
    letter-spacing: 2px;
    display: flex;
    border: 1px solid #a0a0a0;
  }

  .topic {
    flex: 1;
  }

  .opation {
    display: flex;
    margin: 10px 0;
  }

  .sub_title {
    position: relative;
    line-height: 28px;
    margin-bottom: 5px;
  }

  .sub_score {
    display: inline-block;
    color: #000;
    float: right;
  }

  .file {
    display: inline-block;
    height: 28px;
    margin: 10px 0;
  }
</style>
<style>
  .paper .el-input-number--mini {
    width: 60px !important;
  }

  .paper .el-input-number--mini .el-input-number__decrease, .paper .el-input-number--mini .el-input-number__increase {
    width: 17px;
    font-size: 12px;
  }

  .paper .el-input-number--mini .el-input__inner {
    padding-left: 18px;
    padding-right: 18px;
  }

  .paper p {
    margin: 0;
  }
  .paper .ql-editor {
    padding: 0;
  }
</style>
