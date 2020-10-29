<template>
    <div class="wrap_size">
        <div class="select_type posRelative">
            <input type="hidden" name="this_page" value="">
            <router-link to="/task" class="go_back" style="left:0;">{{$t('task.returnSelectTask')}}</router-link>
            <div class="the_topic_type" :class="task_type">
                {{task_type}}
            </div>
        </div>
        <div v-loading="loading" v-if="task_list.length">
            <ul class="gf-box clearfix min_topic_height">
                <li class="tasks" :class="{'answered':item.has_solved}" v-for="(item,i) in task_list">
                    <div class="film">
                        <div class="item_task">
                            <div :title="item.task_title" class="card_title ellipsis_txt">
                                {{item.task_title}}
                            </div>
                            <div class="task_data">
                                <span class="task_score">{{item.taskDynamicPoint}} {{$t('task.score')}}</span><br/>
                                <span class="task_visiter">{{item.solved_count}}{{$t('task.solved')}}</span>
                            </div>
                        </div>
                    </div>
                    <span class="topic_number" v-text="getIndex(i+1)"></span>
                    <router-link
                            :to="{path:'/task/answer',query: {type: task_type,number:type_number,grade:task_grade,id:item.task_id}}"
                            class="go_answer"></router-link>
                </li>
            </ul>
        </div>
        <div v-else class="text-center" style="padding-top:150px;">
            <img src="@/assets/img/kong.png" alt="">
        </div>
        <div style="margin-top:30px;">
            <v-page
                    v-show="pager.total>pager.pageSize"
                    :total="pager.total"
                    :page.sync="pager.currentPage"
                    :limit.sync="pager.pageSize"
                    :layout="pager.layout"

                    @pagination="get_task"
            ></v-page>
        </div>
    </div>
</template>

<script>
  import page from '@/components/common_components/pagination'


  export default {
    components: {
      'v-page': page
    },
    name: 'list',
    data () {
      return {
        task_type: '',
        task_grade: '',
        type_number: '',
        task_list: [],
        loading: true,
        pager: {//页码
          currentPage: 1,//当前第几页
          pageSize: 18,//每页多少条
          total: 0,//总共多少条
          layout: 'prev, pager, next',
        },
      }
    },
    created () {
      this.task_type = this.$route.query.type
      this.task_grade = this.$route.query.grade
      this.type_number = this.$route.query.number
      this.get_task()
    },
    methods: {
      get_task () {
        this.$http.get('/api/tasks/' + this.task_type + '/' + this.task_grade, {
          params: {
            offset: (this.pager.currentPage - 1) * this.pager.pageSize,
            limit: this.pager.pageSize
          }
        }).then((res) => {
          this.loading = false
          this.task_list = res.data.rows
          this.pager.total = res.data.total
        })
        .catch((err) => {

        })
      },
      getIndex (i) {

        let num = (this.pager.currentPage - 1) * this.pager.pageSize + i
        if (num < 10) {
          return '00' + num
        } else if (num >= 10 && num < 100) {
          return '0' + num
        } else {
          return num
        }
      }
    },
    computed: {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .select_type
        position: relative;
        padding-top: 30px;

        .go_back
            width: 160px;
            height: 50px;
            background: url('~@/assets/img/button/go_back.png') no-repeat;
            background-size: 100% 100%;
            position: absolute;
            left: 120px;
            top: 30px;
            padding-left: 50px;
            line-height: 50px;
            font-size: 14px;
            color: #fff;

        .the_topic_type
            width: 692px;
            height: 55px;
            background: url('~@/assets/img/answer/title_icos.png') no-repeat;
            background-size: 100% 100%;
            text-align: center;
            line-height: 55px;
            font-size: 26px;
            margin: 0 auto;
            color: #9DC2FF;
            font-family: myfont;

            &:before
                content: '';
                display: inline-block;
                vertical-align: middle;
                width: 36px;
                height: 36px;
                margin-right: 10px;

        .web:before
            background: url('~@/assets/img/answer/web_ico.png') no-repeat;
            background-size: 100% 100%;

        .crypto:before
            background: url('~@/assets/img/answer/crypto_ico.png') no-repeat;
            background-size: 100% 100%;

        .mobile:before
            background: url('~@/assets/img/answer/mobile_ico.png') no-repeat;
            background-size: 100% 100%;

        .misc:before
            background: url('~@/assets/img/answer/misc_ico.png') no-repeat;
            background-size: 100% 100%;

        .pwn:before
            background: url('~@/assets/img/answer/pwn_ico.png') no-repeat;
            background-size: 100% 100%;

        .reverse:before
            background: url('~@/assets/img/answer/re_ico.png') no-repeat;
            background-size: 100% 100%;

    .gf-box
        margin-top: 30px;
        text-align: left

        .tasks
            display: inline-block;
            position: relative;
            cursor: pointer;

            .go_answer
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;

            .film
                width: 100%;
                height: 100%;
                background: url('~@/assets/img/answer/tiban.png') no-repeat;
                background-size: 100% 100%;

                .item_task
                    .card_title
                        text-align: center;
                        color: white;
                        padding: 0 10px;

                    .task_data
                        text-align: center;

                        .task_score, .task_visiter
                            padding-left:10px;
                            padding-right:10px;
                            color: lightblue;
                            background: rgba(0, 0, 0, .5);
                            display: inline-block;
                            border-radius: 12px;
                            margin-bottom: 4px;

                            &:before
                                width: 17px;
                                height: 16px;
                                display: inline-block;
                                content: '';
                                clear: both;
                                margin-right: 4px;
                                vertical-align: -2px;

                        .task_score
                            &:before
                                background: url('~@/assets/img/answer/fes.png') no-repeat center center;

                        .task_visiter
                            &:before
                                background: url('~@/assets/img/answer/ren.png') no-repeat center center;

            .topic_number
                background: url('~@/assets/img/answer/label.png');
                background-size: 100% 100%;
                position: absolute;
                left: 0;
                top: 0;
                color: white;
                text-align: center;

        .answered
            .film
                background: url('~@/assets/img/answer/tiban1.png');
                background-size: 100% 100%;

                .task_score, .task_visiter
                    color: #e7de77 !important;

                .task_score
                    &:before
                        background: url('~@/assets/img/answer/fsh.png') no-repeat center center !important;

                .task_visiter
                    &:before
                        background: url('~@/assets/img/answer/ren1.png') no-repeat center center !important;

            .topic_number
                background: url('~@/assets/img/answer/label2.png');
                background-size: 100% 100%;

        .tasks:nth-child(6n+1), .tasks:nth-child(1)
            margin-left: 0 !important;

        .tasks:nth-child(6n)
            margin-right: 0 !important;

    @media (max-width: 1300px)
        .tasks
            width: 165px;
            height: 115px;
            margin: 13px 19px;

            .topic_number
                width: 30px;
                height: 22px;
                line-height: 18px;
                font-size: 12px;

            .film
                .item_task
                    .card_title
                        margin: 26px 0 14px;
                        font-size: 14px;

                    .task_score, .task_visiter
                        height: 20px;
                        line-height: 20px;

    @media (min-width: 1300px) and (max-width: 1500px)
        .tasks
            width: 176px;
            height: 120px;
            margin: 13px 17px;

            .topic_number
                width: 30px;
                height: 22px;
                line-height: 18px;
                font-size: 12px;

            .film
                .item_task
                    .card_title
                        margin: 26px 0 14px;
                        font-size: 14px;

                    .task_score, .task_visiter
                        height: 20px;
                        line-height: 20px;

    @media (min-width: 1500px) and (max-width: 1800px)
        .tasks
            width: 208px;
            height: 140px;
            margin: 16px 18px;

            .topic_number
                width: 36px;
                height: 28px;
                line-height: 22px;
                font-size: 14px;

            .film
                .item_task
                    .card_title
                        margin: 30px 0 15px;
                        font-size: 16px;

                    .task_score, .task_visiter
                        height: 24px;
                        line-height: 24px;

    @media (min-width: 1800px)
        .tasks
            width: 230px;
            height: 150px;
            margin: 20px 20px;

            .topic_number
                width: 36px;
                height: 28px;
                line-height: 22px;
                font-size: 14px;

            .film
                .item_task
                    .card_title
                        margin: 30px 0 15px;
                        font-size: 16px;

                    .task_score, .task_visiter
                        height: 24px;
                        line-height: 24px;
</style>

