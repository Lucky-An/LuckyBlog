<template>
    <div class="discussion_list">
        <div>
            <div v-for="(item,i) in answerList_cover" class="oneof_box" style="position:relative;">
            <span class="interlocution_come_from">
                <span>来自话题:</span>
                <span class="inLine mrg10R" v-for="topic in item.topic">{{topic}}</span>
            </span>
                <div class="font20 mrg10B">
                    <span class="article_type_label" v-text="item.type==1?'问':'答'"></span>
                    <div class="title">
                        <router-link class="ellipsis_txt" style="color: #fff;font-weight: bold;"
                                     to="/discussion/detail">{{item.title}}
                        </router-link>
                    </div>
                    <q-content
                            :content="answerList_content[i]"
                            :cover="item"
                            :index="i"
                            :hasCover="item.has_cover"
                            @show_all="is_showAll"
                    ></q-content>
                    <q-handle :data="item" @showComment="getItem" :index="i" @changeLookBtn="getBtnStatus"></q-handle>
                </div>
                <div class="comment_wrap" v-if="item.show_comment">
                    <!--<common-->
                    <!--task_id="20"-->
                    <!--:user_id="user_id"-->
                    <!--getUrl="/api/tasks/task_comment/"-->
                    <!--&gt;</common>-->
                    <span>11</span>
                </div>
                <slot name="other"></slot>
            </div>
        </div>
        <v-page
                v-show="pager.total>pager.pageSize"
                :total="pager.total"
                :page.sync="pager.currentPage"
                :limit.sync="pager.pageSize"
                :layout="pager.layout"

                @pagination="get_list"


        ></v-page>
    </div>
</template>

<script>
  import {setStorage, getStorage} from '@/utils/storage'
  import content from './question_content'
  import handle from './content_handle'
  import page from '@/components/common_components/pagination'
  import comment from '@/components/common_components/comment'

  export default {
    name: 'discussion_list',
    components: {
      'q-content': content,
      'q-handle': handle,
      'v-page': page,
      'comment': comment
    },
    props: ['answerList_content', 'answerList_cover'],
    data () {
      return {
        user_id: getStorage('isUserLogin', 'object').user.id,
        pager: {//页码
          currentPage: 1,//当前第几页
          pageSize: 15,//每页多少条
          total: 0,//总共多少条
          layout: 'prev, pager, next',
        },
      }
    },
    created () {

    },
    methods: {
      get_list () {
      },
      sizeChange (val) {//接收组件传递出的每页条数
        this.pager.pageSize = val
      },
      currentChange (val) {//接收组件传递出的页码
        this.pager.currentPage = val
      },
      is_showAll (val) {
        this.answerList_cover[val.number].showLookLabel = val.status
      },
      getItem (item) {
        this.answerList_cover[item.index].show_comment = !item.status
      },
      getBtnStatus (val) {
        this.answerList_cover[val.index].showAll = val.status
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .discussion_list {
        width: 100%
        text-align: left;

        .oneof_box {
            border: 1px solid #152E4A;
            background: url('~@/assets/img/bian.png') left top no-repeat, url('~@/assets/img/bian2.png') right top no-repeat, url('~@/assets/img/bian3.png') left bottom no-repeat, url('~@/assets/img/bian4.png') right bottom no-repeat;
            background-color: #0d1927;
            padding: 20px 30px 5px;
            position: relative;
            margin-bottom: 20px;

            .interlocution_come_from {
                color: #47779A;
                margin-bottom: 20px;
                display: inline-block;
            }

            .ellipsis_txt {
                white-space: nowrap;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
            }

            .article_type_label {
                width: 24px;
                height: 24px;
                background: #1390FF;
                color: white;
                line-height: 24px;
                text-align: center;
                border-radius: 4px;
                font-size: 14px;
                display: inline-block;
                vertical-align: 3px;
            }

            .title {
                width: calc(100% - 100px);
                display: inline-block;
            }
        }
    }
</style>
