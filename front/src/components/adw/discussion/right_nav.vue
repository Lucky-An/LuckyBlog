<template>
    <div id="user_nav">
        <div class="nav_box">
            <ul>
                <li>
                    <router-link to="/discussion/question"><i class="icon wtw"></i>我的提问</router-link>
                </li>
                <!--<li>-->
                    <!--<router-link to="/discussion/article"><i class="icon wtw"></i>我的文章</router-link>-->
                <!--</li>-->
                <li>
                    <router-link to="/discussion/advice"><i class="icon jiany"></i>我的建议</router-link>
                </li>
                <li>
                    <router-link to="/discussion/collect"><i class="icon wsc"></i>我的收藏</router-link>
                </li>
                <!--<li>-->
                    <!--<router-link to="/discussion/reward"><i class="icon wtw"></i>我的奖励</router-link>-->
                <!--</li>-->
            </ul>
        </div>
        <div id="topic">
            <div class="title">讨论话题</div>
            <ul>
                <li>
                    <span class="topic_name">hake</span>
                    <span class="topic_num">500</span>
                </li>
                <li>
                    <span class="topic_name">ctf大事情</span>
                    <span class="topic_num">500</span>
                </li>
                <li>
                    <span class="topic_name">安全赛事阿里巴巴</span>
                    <span class="topic_num">999+</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'right_nav'
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    #user_nav {
        width: 260px
        float: right

        .icon {
            width: 28px;
            height: 28px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 8px;
        }

        .wtw {
            background: url('~@/assets/img/wtw.png') no-repeat center center;
            background-size: 100% 100%;
        }

        .jiany {
            background: url('~@/assets/img/jiany.png') no-repeat center center;
            background-size: 100% 100%;
        }

        .wsc {
            background: url('~@/assets/img/wsc.png') no-repeat center center;
            background-size: 100% 100%;
        }

        .nav_box {
            width: 100%;
            border: 1px solid #152E4A;
            position: relative;
            padding: 15px 30px;
            margin-bottom: 30px;
            edge-angle()
            background-color: #0d1927;

            li {
                width: 100%;
                height: 60px;
                line-height: 60px;
                color: white;
                display: inline-block;
                text-align left
                a {
                    color: white
                }
            }
            li:hover a{
                color: #1390FF;
            }
        }

        #topic {
            text-align: left;

            .title {
                padding-left: 12px;
                border-left: 4px solid #1482FE;
                font-size: 22px;
                margin-bottom: 20px;
                color: white;
                height: 31px
                line-height 31px
            }

            li {
                border: 1px solid #47779A;
                color: #47779A;
                border-radius: 19px;
                display: inline-block;
                margin-right: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                padding: 4px 10px;
                .topic_name {
                    max-width: 90px;
                    display: inline-block;
                    white-space: nowrap;
                    overflow: hidden;
                    vertical-align: middle;
                    text-overflow: ellipsis;
                    font-size 14px;
                    color: #337ab7;
                }

                .topic_num {
                    padding: 0 5px;
                    height: 17px;
                    line-height: 18px;
                    background: #1390FF;
                    color: white;
                    font-size: 12px;
                    border-radius: 10px;
                    display: inline-block;
                }
            }
            li:hover{
                border-color: #1390FF;
            }
            li:hover .topic_name{
                color: #1390FF;
            }
        }

        .tab-active {
            color:lightblue!important;
        }
    }
</style>
