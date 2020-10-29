import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import {setStorage, getStorage} from '../utils/storage'

Vue.use(VueRouter)
import store from '../store/public/match'

import {
  matchStatus,
} from "@/api/competitionMode/theoryMode";
import {
  events,
} from "@/api/competitionMode/solvingMode";
import {
  eventData,
} from "@/api/competitionMode/attackMode";
import {
  eventData_newAttack,
} from "@/api/competitionMode/newAttackMode";
import {
  getMatchInfos,
} from "@/api/competitionMode/layeredMode";
import {
  dev_matchStatus,
} from "@/api/competitionMode/devopsMode";
import {
  rw_matchStatus,
} from "@/api/competitionMode/rwMode";
/* *
* 路由说明：
* crumbs参数为是否显示面包屑。
*/
//解题赛
const match_jad = {//解题赛
    path: 'match/jeopardy',
    component: resolve => require(['@/components/match/competition_mode/jad/home'],resolve),
    // name:"match",
    children: [
      {
        path: 'guide',
        component: resolve => require(['@/components/match/common/competition_introduce'],resolve),
        name: 'solving_guide',
        meta: {
          title: 'header.match.guide'
        }
      },
      {
        path: 'notice',
        component: resolve => require(['@/components/match/competition_mode/jad/notice'],resolve),
        name: 'solving_notice',
        meta: {
          title: 'header.match.notice'
        }
      },
      {
        path: 'contest_challenge',
        component: resolve => require(['@/components/match/competition_mode/jad/question_board'],resolve),
        name: 'solving_questionBoard',
        meta: {
          title: 'header.match.questionBoard'
        }
      },
      {
        path: 'ranking',
        component: resolve => require(['@/components/match/competition_mode/jad/ranking'],resolve),
        name: 'solving_matchRanking',
        meta: {
          title: 'header.match.ranking',
          requiresAuth: true,
        }
      },
      {
        path: 'trend',
        component: resolve => require(['@/components/match/competition_mode/jad/trend'],resolve),
        name: 'solving_trend',
        meta: {
          title: 'header.match.trend',
          requiresAuth: true,
        }
      }
    ],
    meta: {
      sponor_auth: true,
    },
    beforeEnter: (to, from, next) => {
      if (to.query.hash) {
        events(to.query.hash)
          .then(res=>{
            store.state.match_data = res.data;
            next()
          })
      } else {
        next('/competition')
      }
    }
  }

//闯关赛/层级赛
const match_layered = {//解题赛
  path: 'match/layered',
  component: resolve => require(['@/components/match/competition_mode/layered/home'],resolve),
  // name:"match",
  children: [
    {
      path: 'guide',
      component: resolve => require(['@/components/match/common/competition_introduce'],resolve),
      name: 'layered_guide',
      meta: {
        title: 'header.match.guide'
      }
    },
    {
      path: 'notice',
      component: resolve => require(['@/components/match/competition_mode/layered/notice'],resolve),
      name: 'layered_notice',
      meta: {
        title: 'header.match.notice'
      }
    },
    {
      path: 'contest_challenge',
      component: resolve => require(['@/components/match/competition_mode/layered/question_board'],resolve),
      name: 'layered_questionBoard',
      meta: {
        title: 'header.match.questionBoard'
      }
    },
    {
      path: 'ranking',
      component: resolve => require(['@/components/match/competition_mode/layered/ranking'],resolve),
      name: 'layered_matchRanking',
      meta: {
        title: 'header.match.ranking',
        requiresAuth: true,
      }
    },
    {
      path: 'trend',
      component: resolve => require(['@/components/match/competition_mode/layered/trend'],resolve),
      name: 'layered_trend',
      meta: {
        title: 'header.match.trend',
        requiresAuth: true,
      }
    }
  ],
  meta: {
    sponor_auth: true,
  },
  beforeEnter: (to, from, next) => {
    if (to.query.hash) {
      getMatchInfos(to.query.hash)
        .then(res=>{
          store.state.match_data = res.data;
          next()
        })
    } else {
      next('/competition')
    }
  }
}

//传统攻防赛
const match_attack = {
    path: 'match/attack',
    component: resolve => require(['@/components/match/competition_mode/attack/home'],resolve),
    // name:"match",
    children: [
      {
        path: 'guide',
        component: resolve => require(['@/components/match/common/competition_introduce'],resolve),
        name: 'attack_guide',
        meta: {
          title: 'header.match.guide'
        }
      },
      {
        path: 'notice',
        component: resolve => require(['@/components/match/competition_mode/attack/notice'],resolve),
        name: 'attack_notice',
        meta: {
          title: 'header.match.notice'
        }
      },
      {
        path: 'contest_challenge',
        component: resolve => require(['@/components/match/competition_mode/attack/question_board'],resolve),
        name: 'attack_questionBoard',
        meta: {
          title: 'header.match.questionBoard'
        }
      },
      {
        path: 'ranking',
        component: resolve => require(['@/components/match/competition_mode/attack/ranking'],resolve),
        name: 'attack_matchRanking',
        meta: {
          title: 'header.match.ranking',
          requiresAuth: true,
        }
      },
      {
        path: 'attackRanking',
        component: resolve => require(['@/components/match/competition_mode/attack/attack_ranking'],resolve),
        name: 'attack_attackRanking',
        meta: {
          title: 'header.match.attack',
          requiresAuth: true,
        }
      },
      {
        path: 'trend',
        component: resolve => require(['@/components/match/competition_mode/attack/trend'],resolve),
        name: 'attack_trend',
        meta: {
          title: 'header.match.trend',
          requiresAuth: true,
        }
      }
    ],
    meta: {
      sponor_auth: true,
    },
    beforeEnter: (to, from, next) => {
      if (to.query.event) {
        eventData({
          event_id:to.query.event
        })
          .then(res=>{
            store.state.match_data = res.data;
            next()
          })
      } else {
        next('/competition')
      }
    }
  }

//新攻防赛
const match_new_attack = {
  path: 'match/new_attack',
  component: resolve => require(['@/components/match/competition_mode/new_attack/home'],resolve),
  // name:"match",
  children: [
    {
      path: 'guide',
      component: resolve => require(['@/components/match/common/competition_introduce'],resolve),
      name: 'new_attack_guide',
      meta: {
        title: 'header.match.guide'
      }
    },
    {
      path: 'notice',
      component: resolve => require(['@/components/match/competition_mode/new_attack/notice'],resolve),
      name: 'new_attack_notice',
      meta: {
        title: 'header.match.notice'
      }
    },
    {
      path: 'contest_challenge',
      component: resolve => require(['@/components/match/competition_mode/new_attack/question_board'],resolve),
      name: 'new_attack_questionBoard',
      meta: {
        title: 'header.match.questionBoard'
      }
    },
    {
      path: 'ranking',
      component: resolve => require(['@/components/match/competition_mode/new_attack/ranking'],resolve),
      name: 'new_attack_matchRanking',
      meta: {
        title: 'header.match.ranking',
        requiresAuth: true,
      }
    },
    {
      path: 'attackRanking',
      component: resolve => require(['@/components/match/competition_mode/new_attack/attack_ranking'],resolve),
      name: 'new_attack_attackRanking',
      meta: {
        title: 'header.match.attack',
        requiresAuth: true,
      }
    },
    {
      path: 'trend',
      component: resolve => require(['@/components/match/competition_mode/new_attack/trend'],resolve),
      name: 'new_attack_trend',
      meta: {
        title: 'header.match.trend',
        requiresAuth: true,
      }
    }
  ],
  meta: {
    sponor_auth: true,
  },
  beforeEnter: (to, from, next) => {
    if (to.query.event) {
      eventData_newAttack({
        event_id:to.query.event
      })
        .then(res=>{
          store.state.match_data = res.data;
          next()
        })
    } else {
      next('/competition')
    }
  }
}

//运维赛
const match_devops = {
  path: 'match/devops',
  component: resolve => require(['@/components/match/competition_mode/devops/home'],resolve),
  // name:"match",
  children: [
    {
      path: 'guide',
      component: resolve => require(['@/components/match/common/competition_introduce'],resolve),
      name: 'devops_guide',
      meta: {
        title: 'header.match.guide'
      }
    },
    {
      path: 'notice',
      component: resolve => require(['@/components/match/competition_mode/devops/notice'],resolve),
      name: 'devops_notice',
      meta: {
        title: 'header.match.notice'
      }
    },
    {
      path: 'contest_challenge',
      component: resolve => require(['@/components/match/competition_mode/devops/question_board'],resolve),
      name: 'devops_questionBoard',
      meta: {
        title: 'header.match.questionBoard'
      }
    },
    {
      path: 'ranking',
      component: resolve => require(['@/components/match/competition_mode/devops/ranking'],resolve),
      name: 'devops_matchRanking',
      meta: {
        title: 'header.match.ranking',
        requiresAuth: true,
      }
    },
    {
      path: 'trend',
      component: resolve => require(['@/components/match/competition_mode/devops/trend'],resolve),
      name: 'devops_trend',
      meta: {
        title: 'header.match.trend',
        requiresAuth: true,
      }
    }
  ],
  meta: {
    sponor_auth: true,
  },
  beforeEnter: (to, from, next) => {
    if (to.query.event) {
      dev_matchStatus({
        event_id:to.query.event
      })
        .then(res=>{
          store.state.match_data = res.data;
          next()
        })
    } else {
      next('/competition')
    }
  }
}

//realWorld CTF赛
const match_rw = {//rw赛
  path: 'match/realWorld',
  component: resolve => require(['@/components/match/competition_mode/rw/home'],resolve),
  // name:"match",
  children: [
    {
      path: 'guide',
      component: resolve => require(['@/components/match/common/competition_introduce'],resolve),
      name: 'rw_guide',
      meta: {
        title: 'header.match.guide'
      }
    },
    {
      path: 'notice',
      component: resolve => require(['@/components/match/competition_mode/rw/notice'],resolve),
      name: 'rw_notice',
      meta: {
        title: 'header.match.notice'
      }
    },
    {
      path: 'contest_challenge',
      component: resolve => require(['@/components/match/competition_mode/rw/question_board'],resolve),
      name: 'rw_questionBoard',
      meta: {
        title: 'header.match.questionBoard'
      }
    },
    {
      path: 'ranking',
      component: resolve => require(['@/components/match/competition_mode/rw/ranking'],resolve),
      name: 'rw_matchRanking',
      meta: {
        title: 'header.match.ranking',
        requiresAuth: true,
      }
    },
    {
      path: 'trend',
      component: resolve => require(['@/components/match/competition_mode/rw/trend'],resolve),
      name: 'rw_trend',
      meta: {
        title: 'header.match.trend',
        requiresAuth: true,
      }
    }
  ],
  meta: {
    sponor_auth: true,
  },
  beforeEnter: (to, from, next) => {
    if (to.query.hash) {
      rw_matchStatus(to.query.hash)
        .then(res=>{
          store.state.match_data = res.data;
          next()
        })
    } else {
      next('/competition')
    }
  }
}

//裁判路由配置
//realWorld裁判路由配置
const referee_rw = {
  path: 'referee/realWorld',
  component: resolve => require(['@/components/match/referee/realWorld/home'],resolve),
  // name:"match",
  children: [
    {
      path: 'examine',
      component: resolve => require(['@/components/match/referee/realWorld/examine'],resolve),
      name: 'rw_referee',
      meta: {
        title: 'header.match.referee'
      }
    },
    {
      path: 'ranking',//直接调用realWorld的排行榜组件就可以
      component: resolve => require(['@/components/match/competition_mode/rw/ranking'],resolve),
      name: 'referee_matchRanking',
      meta: {
        title: 'header.match.ranking'
      }
    },
  ],
  meta: {
    sponor_auth: true,
  },
  beforeEnter: (to, from, next) => {
    if (to.query.event) {
      next()
    } else {
      next('/404')
    }
  }
}

//理论赛
const match_theory = {//理论赛
  path: 'match/theory',
  component: resolve => require(['@/components/match/competition_mode/theory/home'],resolve),
  // name:"match",
  children: [
    {
      path: 'guide',
      component: resolve => require(['@/components/match/common/competition_introduce'],resolve),
      name: 'theory_guide',
      meta: {
        title: 'header.match.guide'
      }
    },
    {
      path: 'contest_challenge',
      component: resolve => require(['@/components/match/competition_mode/theory/question_board'],resolve),
      name: 'theory_questionBoard',
      meta: {
        title: 'header.match.questionBoard',
      },
    }
  ],
  meta: {
    sponor_auth: true,
  },
  beforeEnter: (to, from, next) => {
    if (to.query.hash) {
      matchStatus(to.query.hash)
        .then(res=>{
          if((res.data.is_submit&&res.data.process==0)||(res.data.process==2&&!res.data.is_review)){//已经交卷但比赛未结束
            next('/competition')
          }else{
            store.state.match_data = res.data;
            next()
          }
        })
    } else {
      next('/competition')
    }
  }
}

//ad5攻防平台路由
const ad5_routes = [
  {
    path: '/',
    component: resolve => require(['@/components/ad5/base'],resolve),
    redirect: '/competition',
    name:"index",
    // redirect:'personal',
    children: [
      {
        path: 'tools',
        component: resolve => require(['@/components/ad5/tools/index'],resolve),
        name: 'tools',
        meta: {
          title: 'header.tools',
        }
      },
      {
        path: 'competition',
        component: resolve => require(['@/components/ad5/competition/competition_list'],resolve),
        // name:"common",
        name: 'competition_list',
        meta: {
          title: 'header.competition.competition'
        }
      },
      {
        path: 'personal',
        component: resolve => require(['@/components/ad5/personal/index'],resolve),
        // name:"personal",
        name: 'home',
        meta: {
          title: 'header.personal.home'
        }
      },
    ]
  },
  {
    path: '/login',
    component: resolve => require(['@/components/ad5/login/login'],resolve),
    name: 'login',
    meta: {
      title: 'header.login'
    }
  },
  {
    path:'/ad5',
    component:resolve => require(['@/components/ad5/competition/match_home'],resolve),
    name:'ad5',
    children:[
      match_jad,//解题赛
      match_attack,//传统攻防赛
      match_new_attack,//新攻防赛
      match_devops,//运维赛
      match_layered,//闯关赛
      match_theory,//理论赛
      match_rw,//realWorld赛
      referee_rw,//rw裁判席
      {
        path: 'match/total_ranking',
        component: resolve => require(['@/components/match/total_ranking/total_ranking'],resolve),
        name:"total_ranking",
        meta: {
          requiresAuth: true,
          title: 'header.match.ranking',
        }
      },
      {
        path: 'match/spectator',
        component: resolve => require(['@/components/match/spectator/spectator'],resolve),
        name:"spectator",
        meta: {
          requiresAuth: true,
          title: 'header.match.spectator',
        }
      }
    ]
  },
  {
    path: '/404',
    component: resolve => require(['@/components/error/404'],resolve),
    name: 'error-404',
    meta: {
      title: '404'
    }
  },
  {
    path: '/500',
    component: resolve => require(['@/components/error/500'],resolve),
    name: 'error-500',
    meta: {
      title: '500'
    }
  },
  {path: '*', component: resolve => require(['@/components/error/404'],resolve)}
]

//攻防世界路由
const routes = [
  {
    path: '/',
    component: resolve => require(['@/components/adw/index/index'],resolve),
    // name:"index",
    // redirect:'personal',
    children: [
      {
        path:'',
        component:resolve => require(['@/components/adw/start/start'],resolve),
        name:'start',
        meta: {
          requiresAuth: true,
          title: 'dialog_list.home',
        }
      },
      {
        path:'strategy',
        component:resolve => require(['@/components/adw/information/strategy'],resolve),
        name:'strategy',
        meta: {
          title: 'dialog_list.play_info',
          requiresAuth:true,
        }
      },
      {
        path:'system_notice',
        component:resolve => require(['@/components/adw/information/system_notice'],resolve),
        name:'systemNotice',
        meta: {
          title: 'dialog_list.sys_notice',
          requiresAuth:true,
        }
      },
      {
        path: 'task',
        component: resolve => require(['@/components/adw/task/task'],resolve),
        children: [
          {
            path: '/',
            component: resolve => require(['@/components/adw/task/task_board'],resolve),
            name: 'task_board',
            meta: {
              title: 'header.task.answer',
            }
          },
          {
            path: 'task_list',
            component: resolve => require(['@/components/adw/task/task_list'],resolve),
            name: 'task_list',
            meta: {
              title: 'header.task.taskList'
            }
          },
          {
            path: 'answer',
            component: resolve => require(['@/components/adw/task/answer'],resolve),
            name: 'answer',
            meta: {
              title: 'header.task.taskBoard'
            }
          },
          {
            path: 'writeup',
            component: resolve => require(['@/components/adw/task/writeup'],resolve),
            name: 'writeup',
            meta: {
              title: 'header.task.writeup'
            }
          }
        ]
      },
      //竞赛相关路由
      {
        path: 'competition',
        component: resolve => require(['@/components/adw/competition/competition'],resolve),
        // name:"common",
        children: [
          {
            path: '/',
            component: resolve => require(['@/components/adw/competition/competition_list'],resolve),
            name: 'competition_list',
            meta: {
              title: 'header.competition.competition'
            }
          },
          {
            path: 'detail',
            component: resolve => require(['@/components/adw/competition/competition_detail'],resolve),
            name: 'competition_detail',
            meta: {
              title: 'header.competition.competitionDetail',
              sponor_auth: true,
            }
          },
          {
            path: 'manageCenter',
            component: resolve => require(['@/components/adw/competition/manage/manageCenter'],resolve),
            name: 'manageCenter',
            meta: {
              title: 'header.competition.competitionDetail',
              create_match: true,
            }
          },
          {
            path: 'createMatch',
            component: resolve => require(['@/components/adw/competition/manage/createMatch'],resolve),
            name: 'createMatch',
            meta: {
              title: 'header.competition.createCompetition',
              create_match: true,
            },

          },
          {
            path: 'editMatch',
            component: resolve => require(['@/components/adw/competition/manage/createMatch'],resolve),
            name: 'editMatch',
            hidden: true,
            meta: {title: 'header.competition.edit_event', create_match: true,}
          },
          {
            path: 'manage',
            component: resolve => require(['@/components/adw/competition/manage'],resolve),
            redirect: '/common/manageCenter',
            name: 'manage',
            meta: {
              title: 'selfHelp_competition.contest_manage', crumbs: true, create_match: true,
            },
            children: [
              {
                path: 'accreditUser',
                component: () => import('../components/adw/competition/manage/accreditUser'),
                name: 'accreditUser',
                hidden: true,
                meta: {title: 'selfHelp_competition.acc_user', crumbs: true, create_match: true,}
              },
              {
                path: 'accreditTeam',
                component: () => import('../components/adw/competition/manage/accreditTeam'),
                name: 'accreditTeam',
                meta: {title: 'selfHelp_competition.acc_team', crumbs: true, create_match: true,},
              },
              {
                path: 'team',
                component: () => import('../components/adw/competition/competition'),
                redirect: '/common/manage/accreditTeam',
                meta: {
                  title: 'selfHelp_competition.acc_team', crumbs: true, create_match: true,
                },
                children: [

                  {
                    path: 'veterans',
                    component: () => import('../components/adw/competition/manage/accreditUser'),
                    name: 'veterans',
                    meta: {title: 'team.team_members', crumbs: true, create_match: true,}
                  },
                ]
              },

              {
                path: 'operation',
                component: () => import('../components/adw/competition/manage/operation'),
                name: 'operationMatch',
                hidden: true,
                meta: {title: 'selfHelp_competition.match_opera', crumbs: true, create_match: true,}
              },
              {
                path: 'operation',
                component: () => import('../components/adw/competition/competition'),
                redirect: '/common/manage/operation',
                meta: {
                  title: 'selfHelp_competition.match_opera', crumbs: true, create_match: true,
                },
                children: [

                  {
                    path: 'editTopic',
                    component: () => import('../components/adw/competition/manage/editTopic'),
                    name: 'editTopic',
                    hidden: true,
                    meta: {title: 'header.competition.edit_contest', crumbs: true, create_match: true,}
                  },
                  {
                    path: 'addTopic',
                    component: () => import('../components/adw/competition/manage/editTopic'),
                    name: 'addTopic',
                    hidden: true,
                    meta: {title: 'selfHelp_competition.add_topic', crumbs: true, create_match: true,}
                  },
                  {
                    path: 'extractTopics',
                    component: () => import('../components/adw/competition/manage/extractTopics'),
                    name: 'extractTopics',
                    hidden: true,
                    meta: {title: 'selfHelp_competition.Question', crumbs: true, create_match: true,}
                  }
                ]
              },

            ]
          },
        ],
      },
      {
        path: 'team',
        component: resolve => require(['@/components/adw/team/team'],resolve),
        // name:"team",
        children: [
          {
            path: 'list',
            component: resolve => require(['@/components/adw/team/team_list'],resolve),
            name: 'teamList',
            meta: {
              title: 'header.team.teamList'
            }
          },
          {
            path: 'homepage',
            component: resolve => require(['@/components/adw/team/team_homepage'],resolve),
            name: 'teamHomepage',
            meta: {
              title: 'header.team.teamHomepage'
            },
            beforeEnter: function (to, from, next) {
              if (!localStorage.isUserLogin) {
                next('/login')
              } else {
                const user_data = getStorage('isUserLogin', 'object')
                if (user_data.team.has_team) {
                  next()
                } else {
                  next('/team/list')
                }
              }
            }
          },
          {
            path: 'detail',
            component: resolve => require(['@/components/adw/team/detail'],resolve),
            name: 'home_detail',
            meta: {
              title: 'header.team.teamDetail'
            }
          },
        ],
      },
      {
        path: 'personal',
        component: resolve => require(['@/components/adw/personal/personal'],resolve),
        // name:"personal",
        children: [
          {
            path: '/',
            component: resolve => require(['@/components/adw/personal/home'],resolve),
            name: 'home',
            meta: {
              title: 'header.personal.home'
            }
          },
          {
            path: 'record',
            component: resolve => require(['@/components/adw/personal/AnswerRecord'],resolve),
            name: 'AnswerRecord',
            meta: {
              title: 'header.personal.answerRecord'
            }
          },
          {
            path: 'detail',
            component: resolve => require(['@/components/adw/personal/detail'],resolve),
            name: 'detail',
            meta: {
              title: 'header.personal.personalData'
            }
          },
        ]
      },
      {
        path: 'ranking',
        component: resolve => require(['@/components/adw/ranking/ranking'],resolve),
        // name:"ranking",
        children: [
          {
            path: 'specialrank',
            component: resolve => require(['@/components/adw/ranking/specialrank'],resolve),
            name: 'specialrank',
            meta: {
              title: 'header.ranking.special'
            }
          },
          {
            path: 'ctfrank',
            component: resolve => require(['@/components/adw/ranking/ctfrank'],resolve),
            name: 'ctfrank',
            meta: {
              title: 'header.ranking.ctf'
            }
          }
        ]
      },
      {
        path: 'discussion',
        component: resolve => require(['@/components/adw/discussion/discussion_base'],resolve),
        // name:"discussionBase",
        children: [
          {
            path: '/',
            component: resolve => require(['@/components/adw/discussion/discussion'],resolve),
            name: 'discussion',
            meta: {
              title: 'header.discussion.discussion'
            },
          },
          {
            path: 'detail',
            component: resolve => require(['@/components/adw/discussion/discussion_detail'],resolve),
            name: 'discussion_detail',
            meta: {
              title: 'header.discussion.discussion_detail'
            },
          },
          {
            path: 'question',
            component: resolve => require(['@/components/adw/discussion/my_question'],resolve),
            name: 'question',
            meta: {
              title: 'header.discussion.question'
            }
          },
          {
            path: 'article',
            component: resolve => require(['@/components/adw/discussion/my_article'],resolve),
            name: 'article',
            meta: {
              title: 'header.discussion.article'
            }
          },
          {
            path: 'advice',
            component: resolve => require(['@/components/adw/discussion/my_advice'],resolve),
            name: 'advice',
            meta: {
              title: 'header.discussion.advice'
            }
          },
          {
            path: 'collect',
            component: resolve => require(['@/components/adw/discussion/my_collect'],resolve),
            name: 'collect',
            meta: {
              title: 'header.discussion.collect'
            }
          },
          {
            path: 'reward',
            component: resolve => require(['@/components/adw/discussion/my_reward'],resolve),
            name: 'reward',
            meta: {
              title: 'header.discussion.reward'
            }
          }
        ]
      },
      {
        path: 'message',
        component: resolve => require(['@/components/adw/message/message'],resolve),
        name: 'message',
        meta: {
          title: 'header.message'
        }
      },
    ]
  },/*攻防世界路由开始*/
  {
    path: '/login',
    component: resolve => require(['@/components/adw/login/login'],resolve),
    name: 'login',
    meta: {
      title: 'header.login'
    }
  },
  {
    path: '/register',
    component: resolve => require(['@/components/adw/login/register'],resolve),
    name: 'register',
    meta: {
      title: 'login.register',
      requiresAuth: true,
    }
  },
  {
    path: '/resetPassword',
    component: resolve => require(['@/components/adw/login/resetPassword'],resolve),
    name: 'resetPassword',
    meta: {
      title: 'login.update',
      requiresAuth: true,
    }
  },
  {
    path: '/changePassword',
    component:resolve => require(['@/components/adw/login/changePassword'],resolve),
    name: 'changePassword',
    meta: {
      title: 'login.set',
      requiresAuth: true,
    }
  },
  {
    path:'/adw',
    component:resolve => require(['@/components/adw/competition/adw_match_home'],resolve),
    name:'adw',
    children:[
      match_jad,
      match_attack,
      match_new_attack,
      match_devops,
    ]
  },
  {
    path: '/404',
    component: resolve => require(['@/components/error/404'],resolve),
    name: 'error-404',
    meta: {
      title: '404'
    }
  },
  {
    path: '/500',
    component: resolve => require(['@/components/error/500'],resolve),
    name: 'error-500',
    meta: {
      title: '500'
    }
  },
  {path: '*', component: resolve => require(['@/components/error/404'],resolve)}
]

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'tab-active',//当前router添加的class类
  routes:ad5_routes
})

// 添加路由守卫,没登录的跳登录页面，登录成功后存储一个本地值,退出登录时候再把存储本地的值清掉
router.beforeEach((to, from, next) => {


  (async function loginDefault () {

    //如果要去的是[竞赛管理router]的话，说明可能是从后台跳转过来的，异步请求用户信息来模拟登陆，让页面不跳转到登录页
    if(to.name=='manageCenter')await axios.get('/api/personal/reload_profile').then(res => {
      if (res.data.success) {
        setStorage('isUserLogin', res.data.user_data)
      }
    })

    const isLogin = localStorage.isUserLogin ? true : false;

    if (to.path == '/login') {
      next()
      return
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
      next()
    } else {
      if (isLogin) {
        let user_auth = JSON.parse(localStorage.isUserLogin).user
        if (user_auth.is_temp) {
          if (!to.matched.some(record => record.meta.sponor_auth)) {
            //next('/common/detail?id='+user_auth.event)
            next('/common/detail?id=2')
            return
          }
        }

        if (user_auth.classes == 1) {//如果角色等于1是普通用户，则不可访问竞赛管理页面
          if (to.matched.some(record => record.meta.create_match)) {
            next('')
            return
          }
        }
        next()
      } else {
        next('/login')
      }
    }
  })()
})

export default router

