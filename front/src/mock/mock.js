// 引入mockjs
const Mock = require('mockjs');
// 获取 mock.Random 对象
const Random = Mock.Random;
// mock一组数据
const produceNewsData = ['crypto','web','pwn','mobile','misc','reverse']
const guide_data = {
  index:[
    {
      title:"description",
      content:{
        description_zh:"比赛介绍...",
        description_en:"......"
      },
    },
    {
      title:"competition_guide",
      content:{
        competition_guide_zh:"参赛指南...",
        competition_guide_en:"......"
      },
    },
    {
      title:"task_category",
      content: [
        "Mobile",
        "Pwn"
      ],
    },
    {
      title:"competition_rule",
      content:{
        competition_rule_zh:"竞赛规则....",
        competition_rule_en:"common rules ....."
      },
    },
    {
      title:"matters_needing_attention",
      content:{
        matters_needing_attention_zh:"注意事项....",
        matters_needing_attention_en:"matters_needing_attention ....."
      },
    },
    {
      title:"score_ranking",
      content:{
        score_ranking_zh:"得分排名...",
        score_ranking_en:"rankrank"
      },
    },
    {
      title:"reward",
      content:{
        reward_zh:"奖金......",
        reward_en:"rewardreward"
      },
    },
    {
      title:"contact_way",
      content:{
        contact_way_zh:"* [mou](http://mouapp.com/) \n" +
          "* [ace](http://ace.ajax.org/)\n" +
          "* [jquery](http://jquery.com)",
        contact_way_en:"* [mou](http://mouapp.com/) \n" +
          "* [ace](http://ace.ajax.org/)\n" +
          "* [jquery](http://jquery.com)"
      }
    },
    {
      title:"propositional_team",
      content:{
        propositional_team_zh:"命题单位",
        propositional_team_en:"mingtidanwei"
      },
    },
    {
      title:"company",
      content:{
        sponsor_url:["/media/xxx.png"],
        contractor_url:["/media/xxx.png"],
        strategy_url:["/media/xxx.png"]
      }
    }
  ],
  id: 48,
  is_international:true,
  name_zh: "xman冬令营",
  name_en: "xman^^",
  description: "",
  rule: "",
  mode: 1,
  integral_mode: 1,
  reward_mode: 0,
  status: 1,
  hash: "9cb76fce-b2dc-4d2f-82b7-61ddac3f7a01.event",
  logo: "",
  start_time: "2019-01-17 10:30:45",
  end_time: "2019-01-17 15:00:00",
  process: 0,
  can_submit_writeup: true,
  public_rank: true,
  remain_seconds: 15,
  all_seconds:30,
  server_time: "2019-01-11 05:56:26",
  competition_title_en: "",
  vice_name_zh: "初赛",
  vice_name_en: "firstblod",
  is_international:true,
  filter_basis: "",
  background_picture: "",
  choice_title: "选择题",
  choice_stage: "CTF题",
  cover: "",
  support_company:{
    support_company_zh:"北京赛宁网安科技有限公司...",
    support_company_url:"adworld.xctf.org.cn",
    support_company_en:"pingtaizhichengdanwei..."
  },
  "competition_provider":{
    competition_provider_zh:"供应商....",
    competition_provider_url:"供应商跳转url",
    competition_provider_en:"....."
  },
}
let notice_data={
  // data:[
  //   {
  //     id:1,
  //     create_time:'2018-12-29 20:23:12',
  //     is_task:0,
  //     notice:'比赛开始请答题',
  //     is_topped: true,
  //   },
  //   {
  //     id:2,
  //     create_time:'2018-12-30 20:23:12',
  //     is_task:1,
  //     notice:'苗苗解出了sewggwge题，获得一血',
  //     is_topped: false,
  //   },
  //   {
  //     id:3,
  //     create_time:'2018-12-30 20:23:12',
  //     is_task:1,
  //     notice:'马儿解出了sewggwge题，获得一血',
  //     is_topped: false,
  //   }
  // ]
}
const tips = {
  // data:[
  //   {
  //     create_time:"2018-12-30 20:12:12",
  //     event_task:75,
  //     id:3,
  //     is_topped:false,
  //     notice:"堆溢出，tcache",
  //     task:{
  //       category:2,
  //       category_name:"Pwn",
  //       hash:"d9ee420f-dca3-4ead-a42e-cb5f4daf2802.2",
  //       score:100,
  //       title:"pwn-store"
  //     }
  //   }
  // ]
}
const trend_data = {
  total:1,
  rows:[
    {
      obj_id:126,
      obj_name:"思涵理66afafqag色哥哥",
      obj_school:null,
      data:[
        {
          score:0,
          time:"2019-1-17 10:10:45"
        },
        {
          score:90,
          time:"2019-1-17 10:30:45"
        },
        {
          score:310,
          time:"2019-1-17 10:38:45"
        },
        {
          score:220,
          time:"2019-1-17 10:40:45"
        },
        {
          score:130,
          time:"2019-1-17 10:50:45"
        }
      ]
    },
    {
      obj_id:177,
      obj_name:"karina白白",
      obj_school:null,
      data:[
        {
          score:0,
          time:"2019-1-17 10:33:45"
        },
        {
          score:200,
          time:"2019-1-17 10:38:45"
        },
        {
          score:150,
          time:"2019-1-17 10:40:45"
        },
        {
          score:110,
          time:"2019-1-17 10:50:45"
        }
      ]
    },
    {
      obj_id:177,
      obj_name:"马儿",
      obj_school:null,
      data:[
        {
          score:0,
          time:"2019-1-17 10:30:45"
        },
        {
          score:620,
          time:"2019-1-17 10:36:45"
        },
        {
          score:390,
          time:"2019-1-17 10:45:45"
        },
        {
          score:260,
          time:"2019-1-17 10:52:45"
        }
      ]
    },
    {
      obj_id:177,
      obj_name:"金梅",
      obj_school:null,
      data:[
        {
          score:0,
          time:"2019-1-17 10:29:45"
        },
        {
          score:111,
          time:"2019-1-17 10:36:45"
        },
        {
          score:350,
          time:"2019-1-17 10:48:45"
        },
        {
          score:540,
          time:"2019-1-17 10:55:45"
        }
      ]
    }
  ]
}
const subAry={
  total:2,
  rows: [
    {
      name:'mobile',
      val: [
        {
          'id': 78,
          'event': 62,
          'seq': 11,
          'task_hash': '08308076-576a-426d-a051-14d1c987bdba.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'title_dsc': '前世姻缘',
            'event_name': 'XMAN冬令营赛题',
            'file_url': 1,
            'content': '传说：牛郎织女一见钟情，互相留下暗语，但是王母娘娘为了破坏这对感情，对牛郎织女两人的这段记忆进行修改，命运轮回，牛郎织女再次相见，当年的暗语或许是修订记忆的方法，你能帮他们找回记忆么？\n\n\nps：备用下载地址：https://pan.baidu.com/s/1q9SObo3HlexFCxkQCwGvCA',
            'public_official_writeup': false,
            'official_writeup': 0,
            'category': 6,
            'hash': '08308076-576a-426d-a051-14d1c987bdba.2',
            'score': 100,
            'is_dynamic_env': false,
            'url': null,
            'difficulty_rating': 0,
            'title': '前世姻缘',
            'category_name': 'Mobile',
            'lock': false,
            'event': 87,
            'markdown': null,
            'env_times': '4'
          },
          'dynamic_score': 952,
          'is_choice': false,
          'solved_count': 2,
          'has_solved': true,
          'notice_ary':[],
          'notice_count': 0,
          'top_solved': [{'repr_name': '李启飞'}, {'repr_name': 'dotsu'}]
        }, {
          'id': 79,
          'event': 62,
          'seq': 12,
          'task_hash': 'a64837f8-36c0-4074-9334-513b3ea7d5d1.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'title_dsc': '若隐若现',
            'event_name': 'XMAN冬令营赛题',
            'file_url': 1,
            'content': '可能你需要重新打包下apk\n\n\n\nps：备用下载地址：https://pan.baidu.com/s/1EnDIpFquO8sGgHEbzvZF-A',
            'public_official_writeup': false,
            'official_writeup': 0,
            'category': 6,
            'hash': 'a64837f8-36c0-4074-9334-513b3ea7d5d1.2',
            'score': 100,
            'is_dynamic_env': true,
            'url': null,
            'difficulty_rating': 0,
            'title': '若隐若现',
            'category_name': 'Mobile',
            'lock': false,
            'event': 87,
            'markdown': null,
            'env_times': '4'
          },
          'dynamic_score': 769,
          'is_choice': false,
          'solved_count': 7,
          'has_solved': false,'notice_ary':[],
          'notice_count': 0,
          'top_solved': [{'repr_name': 'p@ssw0rd'}, {'repr_name': 'pu1p'}, {'repr_name': 'G6'}]
        }, {
          'id': 80,
          'event': 62,
          'seq': 7,
          'task_hash': 'e9d1c391-3dca-4a2e-b4e1-c5db7bb1517a.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'title_dsc': '签到题',
            'event_name': 'XMAN冬令营赛题',
            'file_url': 1,
            'content': 'ps:网盘备用下载地址：https://pan.baidu.com/s/1505zH6bIrDXUADjVRnQ2Gg',
            'public_official_writeup': false,
            'official_writeup': 0,
            'category': 6,
            'hash': 'e9d1c391-3dca-4a2e-b4e1-c5db7bb1517a.2',
            'score': 100,
            'is_dynamic_env': false,
            'url': null,
            'difficulty_rating': 0,
            'title': '签到题',
            'category_name': 'Mobile',
            'lock': false,
            'event': 87,
            'markdown': null,
            'env_times': '4'
          },
          'dynamic_score': 344,
          'is_choice': false,
          'solved_count': 39,
          'has_solved': false,'notice_ary':[],
          'notice_count': 0,
          'top_solved': [{'repr_name': '王海'}, {'repr_name': 'tiandiwuji'}, {'repr_name': 'ly87238913'}]
        }, {
          'id': 81,
          'event': 62,
          'seq': 8,
          'task_hash': 'bd4a4d93-c7b4-4572-af72-9f9c7150a182.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'title_dsc': 'game',
            'event_name': 'XMAN冬令营赛题',
            'file_url': 1,
            'content': 'ps：网盘备用下载地址：https://pan.baidu.com/s/1OQ8UZzQR5wDh8ZHyvf1Jhw',
            'public_official_writeup': false,
            'official_writeup': 0,
            'category': 6,
            'hash': 'bd4a4d93-c7b4-4572-af72-9f9c7150a182.2',
            'score': 100,
            'is_dynamic_env': false,
            'url': null,
            'difficulty_rating': 0,
            'title': 'game',
            'category_name': 'Mobile',
            'lock': false,
            'event': 87,
            'markdown': null,
            'env_times': '4'
          },
          'dynamic_score': 1000,
          'is_choice': false,
          'solved_count': 0,
          'has_solved': false,'notice_ary':['堆溢出，tcache'],
          'notice_count': 1
        }, {
          'id': 82,
          'event': 62,
          'seq': 8,
          'task_hash': '066f78b0-ae02-4190-ad09-5028fab6b11b.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'title_dsc': 'EASY-APK1',
            'event_name': 'XMAN冬令营赛题',
            'file_url': 1,
            'content': 'ps:备用下载链接地址：https://pan.baidu.com/s/12tQObNt_GkO0h7ThS2iSew',
            'public_official_writeup': false,
            'official_writeup': 0,
            'category': 6,
            'hash': '066f78b0-ae02-4190-ad09-5028fab6b11b.2',
            'score': 100,
            'is_dynamic_env': false,
            'url': null,
            'difficulty_rating': 0,
            'title': 'EASY-APK1',
            'category_name': 'Mobile',
            'lock': false,
            'event': 87,
            'markdown': null,
            'env_times': '4'
          },
          'dynamic_score': 327,
          'is_choice': false,
          'solved_count': 42,
          'has_solved': false,'notice_ary':[],
          'notice_count': 0,
          'top_solved': [{'repr_name': 'Aryb1n'}, {'repr_name': '王海'}, {'repr_name': '李启飞'}]
        }
      ]
    },
    {
      name:'PWN',
      val: [
        {
          'id': 75,
          'event': 62,
          'seq': 8,
          'task_hash': 'd9ee420f-dca3-4ead-a42e-cb5f4daf2802.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'title_dsc': 'pwn-store',
            'event_name': 'XMAN冬令营赛题',
            'file_url': 1,
            'content': 'nc 39.105.216.229 9993\n\n\n\nps：备用下载链接地址：https://pan.baidu.com/s/17At9WqDLjHAcaTBkAyUabw',
            'public_official_writeup': false,
            'official_writeup': 0,
            'category': 2,
            'hash': 'd9ee420f-dca3-4ead-a42e-cb5f4daf2802.2',
            'score': 100,
            'is_dynamic_env': false,
            'url': null,
            'difficulty_rating': 0,
            'title': 'pwn-store',
            'category_name': 'Pwn',
            'lock': false,
            'event': 87,
            'markdown': null,
            'env_times': '4'
          },
          'dynamic_score': 1000,
          'is_choice': false,
          'solved_count': 0,
          'has_solved': false,'notice_ary':['堆溢出，tcache1','堆溢出，tcache2'],
          'notice_count': 1
        }, {
          'id': 76,
          'event': 62,
          'seq': 9,
          'task_hash': 'c8ef6901-b0e2-45be-986d-2e20503856b9.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'title_dsc': 'pwn-base',
            'event_name': 'XMAN冬令营赛题',
            'file_url': 1,
            'content': 'nc 39.105.216.229 9992\n\n\nps：备用下载地址：https://pan.baidu.com/s/18f45O4Dua3sE2GUtW0wNjg',
            'public_official_writeup': false,
            'official_writeup': 0,
            'category': 2,
            'hash': 'c8ef6901-b0e2-45be-986d-2e20503856b9.2',
            'score': 100,
            'is_dynamic_env': false,
            'url': null,
            'difficulty_rating': 0,
            'title': 'pwn-base',
            'category_name': 'Pwn',
            'lock': false,
            'event': 87,
            'markdown': null,
            'env_times': '4'
          },
          'dynamic_score': 833,
          'is_choice': false,
          'solved_count': 5,
          'has_solved': false,'notice_ary':[],
          'notice_count': 0,
          'top_solved': [{'repr_name': '李启飞'}, {'repr_name': 'eHackyd'}, {'repr_name': 'pu1p'}]
        }, {
          'id': 77,
          'event': 62,
          'seq': 10,
          'task_hash': '87b755e7-e6ad-40b3-8800-af459cc7b4d3.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'title_dsc': 'arm-pwn1',
            'event_name': 'XMAN冬令营赛题',
            'file_url': 1,
            'content': 'nc 39.105.216.229 9991\n\nps：备用下载地址：https://pan.baidu.com/s/1G64ULEpDuy_vqWY_KnAxQg',
            'public_official_writeup': false,
            'official_writeup': 0,
            'category': 2,
            'hash': '87b755e7-e6ad-40b3-8800-af459cc7b4d3.2',
            'score': 100,
            'is_dynamic_env': false,
            'url': null,
            'difficulty_rating': 0,
            'title': 'arm-pwn1',
            'category_name': 'Pwn',
            'lock': false,
            'event': 87,
            'markdown': null,
            'env_times': '4'
          },
          'dynamic_score': 714,
          'is_choice': false,
          'solved_count': 9,
          'has_solved': false,'notice_ary':[],
          'notice_count': 0,
          'top_solved': [{'repr_name': 'sunny'}, {'repr_name': 'M4x@10.0.0.55'}, {'repr_name': '李启飞'}]
        },
      ]
    }

  ]
}
const radar={
  "Mobile": 33.33,
  "Pwn": 47.55,
  "asd": 47.55,
  "vasd": 47.55,
  "asdv": 90.55,
}
const tableSubtype= {
  total:94,
  rows: [//题目列表
    {
      name: 'Pwn',
      val: [
        {
          'id': 75,
          'event': 62,
          'seq': 8,
          'task_hash': 'd9ee420f-dca3-4ead-a42e-cb5f4daf2802.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'category': 2,
            'category_name': 'Pwn',
            'score': 100,
            'hash': 'd9ee420f-dca3-4ead-a42e-cb5f4daf2802.2',
            'title': 'pwn-store'
          },
          'dynamic_score': 1000,
          'is_choice': false
        }, {
          'id': 76,
          'event': 62,
          'seq': 9,
          'task_hash': 'c8ef6901-b0e2-45be-986d-2e20503856b9.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'category': 2,
            'category_name': 'Pwn',
            'score': 100,
            'hash': 'c8ef6901-b0e2-45be-986d-2e20503856b9.2',
            'title': 'pwn-base'
          },
          'dynamic_score': 833,
          'is_choice': false
        }, {
          'id': 77,
          'event': 62,
          'seq': 10,
          'task_hash': '87b755e7-e6ad-40b3-8800-af459cc7b4d3.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'category': 2,
            'category_name': 'Pwn',
            'score': 100,
            'hash': '87b755e7-e6ad-40b3-8800-af459cc7b4d3.2',
            'title': 'arm-pwn1'
          },
          'dynamic_score': 714,
          'is_choice': false
        }]
    },
    {
      name: 'mobile',
      val: [
        {
          'id': 78,
          'event': 62,
          'seq': 11,
          'task_hash': '08308076-576a-426d-a051-14d1c987bdba.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'category': 6,
            'category_name': 'Mobile',
            'score': 100,
            'hash': '08308076-576a-426d-a051-14d1c987bdba.2',
            'title': '前世姻缘'
          },
          'dynamic_score': 952,
          'is_choice': false
        }, {
          'id': 79,
          'event': 62,
          'seq': 12,
          'task_hash': 'a64837f8-36c0-4074-9334-513b3ea7d5d1.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'category': 6,
            'category_name': 'Mobile',
            'score': 100,
            'hash': 'a64837f8-36c0-4074-9334-513b3ea7d5d1.2',
            'title': '若隐若现'
          },
          'dynamic_score': 769,
          'is_choice': false
        }, {
          'id': 80,
          'event': 62,
          'seq': 7,
          'task_hash': 'e9d1c391-3dca-4a2e-b4e1-c5db7bb1517a.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'category': 6,
            'category_name': 'Mobile',
            'score': 100,
            'hash': 'e9d1c391-3dca-4a2e-b4e1-c5db7bb1517a.2',
            'title': '签到题'
          },
          'dynamic_score': 344,
          'is_choice': false
        }, {
          'id': 81,
          'event': 62,
          'seq': 8,
          'task_hash': 'bd4a4d93-c7b4-4572-af72-9f9c7150a182.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'category': 6,
            'category_name': 'Mobile',
            'score': 100,
            'hash': 'bd4a4d93-c7b4-4572-af72-9f9c7150a182.2',
            'title': 'game'
          },
          'dynamic_score': 1000,
          'is_choice': false
        }, {
          'id': 82,
          'event': 62,
          'seq': 8,
          'task_hash': '066f78b0-ae02-4190-ad09-5028fab6b11b.2',
          'task_score': 0,
          'type': 2,
          'task': {
            'category': 6,
            'category_name': 'Mobile',
            'score': 100,
            'hash': '066f78b0-ae02-4190-ad09-5028fab6b11b.2',
            'title': 'EASY-APK1'
          },
          'dynamic_score': 327,
          'is_choice': false
        }]
    }
  ]
}
const tableData={
  total:94,
  rows:[
    {
    'obj_id': 7636,
    'obj_name': '李启飞',
    'obj_logo': 'userlogo/-5ecb24f8e204eeb1.jpg',
    'solved_count': 5,
    'sum_score': 3268,
    'obj_school': 'Lilac',
    '75': null,
    '76': {'solved': true, 'rank': 1},
    '77': {'solved': true, 'rank': 3},
    '78': {'solved': true, 'rank': 1},
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true, 'rank': 3}
  }, {
    'obj_id': 27095,
    'obj_name': 'dotsu',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 5,
    'sum_score': 3134,
    'obj_school': 'Whitzard',
    '75': null,
    '76': null,
    '77': {'solved': true},
    '78': {'solved': true, 'rank': 2},
    '79': {'solved': true},
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 22888,
    'obj_name': 'pu1p',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 5,
    'sum_score': 3018,
    'obj_school': 'Lilac',
    '75': null,
    '76': {'solved': true, 'rank': 3},
    '77': {'solved': true},
    '78': null,
    '79': {'solved': true, 'rank': 2},
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 843,
    'obj_name': 'ThTsOd',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 5,
    'sum_score': 2987,
    'obj_school': 'C4M31',
    '75': null,
    '76': {'solved': true},
    '77': {'solved': true},
    '78': null,
    '79': {'solved': true},
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 22406,
    'obj_name': 'p@ssw0rd',
    'obj_logo': 'user_logo/f626e11d7444402ba33347eedce1bf91.png',
    'solved_count': 3,
    'sum_score': 1478,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': {'solved': true, 'rank': 1},
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33339,
    'obj_name': 'G6',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 3,
    'sum_score': 1447,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': {'solved': true, 'rank': 3},
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 1108,
    'obj_name': 'abc',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 3,
    'sum_score': 1440,
    'obj_school': 'Dawn',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': {'solved': true},
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 32390,
    'obj_name': 'tomorrorning',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 3,
    'sum_score': 1440,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': {'solved': true},
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 590,
    'obj_name': 'sunny',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 3,
    'sum_score': 1420,
    'obj_school': 'S3c_N0t_B4d',
    '75': null,
    '76': null,
    '77': {'solved': true, 'rank': 1},
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 373,
    'obj_name': 'Aryb1n',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 3,
    'sum_score': 1401,
    'obj_school': 'BOI',
    '75': null,
    '76': null,
    '77': {'solved': true},
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true, 'rank': 1}
  }, {
    'obj_id': 9806,
    'obj_name': '天河水',
    'obj_logo': 'userlogo/f8b1bb0017f9480ba78fbea39f9b62e2.png',
    'solved_count': 3,
    'sum_score': 1385,
    'obj_school': 'ChaMd5安全团队',
    '75': null,
    '76': null,
    '77': {'solved': true},
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 920,
    'obj_name': 'eHackyd',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 1184,
    'obj_school': null,
    '75': null,
    '76': {'solved': true, 'rank': 2},
    '77': null,
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 221,
    'obj_name': 'F4CK\'s Team',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 1,
    'sum_score': 833,
    'obj_school': 'F4ck',
    '75': null,
    '76': {'solved': true},
    '77': null,
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': null
  }, {
    'obj_id': 17919,
    'obj_name': 'M4x@10.0.0.55',
    'obj_logo': 'userlogo/bb2fcd584b8b42d38c7c22248bb36930.jpg',
    'solved_count': 1,
    'sum_score': 735,
    'obj_school': '10.0.0.55',
    '75': null,
    '76': null,
    '77': {'solved': true, 'rank': 2},
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': null
  }, {
    'obj_id': 379,
    'obj_name': 'lometsj',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 1,
    'sum_score': 714,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': {'solved': true},
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': null
  }, {
    'obj_id': 800,
    'obj_name': '王海',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 697,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true, 'rank': 1},
    '81': null,
    '82': {'solved': true, 'rank': 2}
  }, {
    'obj_id': 766,
    'obj_name': 'ly87238913',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 674,
    'obj_school': 'GGsimida',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true, 'rank': 3},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 236,
    'obj_name': 'ddltxj',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': '2017rise',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 5869,
    'obj_name': '地水',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'dishui',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 19535,
    'obj_name': 'X-D7',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': '鲜花',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 954,
    'obj_name': 'Keenan',
    'obj_logo': 'https://account.xctf.org.cn/media/userlogo/ed562011c7074b6a92a2e50c3b452a5e.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'mirorim',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 25708,
    'obj_name': 'Kaller',
    'obj_logo': 'userlogo/fe3c98ab30454f22aa23fa11d153f44b.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'We_ax',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 21303,
    'obj_name': '哈哈哈哈哈哈哈',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': '406',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 961,
    'obj_name': 'trytrytry',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'Learner',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33252,
    'obj_name': 'starsdestinatio',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33295,
    'obj_name': 'return 0;',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 752,
    'obj_name': 'W1ngs',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'W1ngs2fly',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 622,
    'obj_name': 'w2t3rp2dd13r',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 32264,
    'obj_name': 'ISTARRYI',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 904,
    'obj_name': 'anthos',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 905,
    'obj_name': 'chrome123',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33289,
    'obj_name': 'WB_ADAM',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 832,
    'obj_name': 'risker',
    'obj_logo': 'user_logo/ed893a74cb934c6fae5dce7b04f7d9c9.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'NEX',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 14226,
    'obj_name': 'dongzhu',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'Ginkgo',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 24160,
    'obj_name': 'sucre',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'HRsafe',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 945,
    'obj_name': 'naivete',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'Covteam',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 25711,
    'obj_name': 'MELODYˇXIE',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 27202,
    'obj_name': 'Prowes5',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'R-Web',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33410,
    'obj_name': 'Bayerischen',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33398,
    'obj_name': 'quanmax',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33413,
    'obj_name': '鹿桥',
    'obj_logo': 'user_logo/6a85c5e6afdf4203b073acf81c280228.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 767,
    'obj_name': 'tiandiwuji',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 1,
    'sum_score': 354,
    'obj_school': 'dajiangyou',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true, 'rank': 2},
    '81': null,
    '82': null
  }, {
    'obj_id': 33400,
    'obj_name': 'Breezy',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 1,
    'sum_score': 344,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': null
  }, {
    'obj_id': 33194,
    'obj_name': 'rotpyrc',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 1,
    'sum_score': 327,
    'obj_school': 'Ever404',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 24883,
    'obj_name': '惊蛰',
    'obj_logo': 'userlogo/d0ba1ceb7013482f9e027a14a6a98e07.png',
    'solved_count': 1,
    'sum_score': 327,
    'obj_school': 'Lilac',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33369,
    'obj_name': '2.71828',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 1,
    'sum_score': 327,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33258,
    'obj_name': 'Starbow',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 1,
    'sum_score': 327,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': {'solved': true}
  },{
    'obj_id': 7636,
    'obj_name': '李启飞',
    'obj_logo': 'userlogo/-5ecb24f8e204eeb1.jpg',
    'solved_count': 5,
    'sum_score': 3268,
    'obj_school': 'Lilac',
    '75': null,
    '76': {'solved': true, 'rank': 1},
    '77': {'solved': true, 'rank': 3},
    '78': {'solved': true, 'rank': 1},
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true, 'rank': 3}
  }, {
    'obj_id': 27095,
    'obj_name': 'dotsu',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 5,
    'sum_score': 3134,
    'obj_school': 'Whitzard',
    '75': null,
    '76': null,
    '77': {'solved': true},
    '78': {'solved': true, 'rank': 2},
    '79': {'solved': true},
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 22888,
    'obj_name': 'pu1p',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 5,
    'sum_score': 3018,
    'obj_school': 'Lilac',
    '75': null,
    '76': {'solved': true, 'rank': 3},
    '77': {'solved': true},
    '78': null,
    '79': {'solved': true, 'rank': 2},
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 843,
    'obj_name': 'ThTsOd',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 5,
    'sum_score': 2987,
    'obj_school': 'C4M31',
    '75': null,
    '76': {'solved': true},
    '77': {'solved': true},
    '78': null,
    '79': {'solved': true},
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 22406,
    'obj_name': 'p@ssw0rd',
    'obj_logo': 'user_logo/f626e11d7444402ba33347eedce1bf91.png',
    'solved_count': 3,
    'sum_score': 1478,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': {'solved': true, 'rank': 1},
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33339,
    'obj_name': 'G6',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 3,
    'sum_score': 1447,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': {'solved': true, 'rank': 3},
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 1108,
    'obj_name': 'abc',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 3,
    'sum_score': 1440,
    'obj_school': 'Dawn',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': {'solved': true},
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 32390,
    'obj_name': 'tomorrorning',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 3,
    'sum_score': 1440,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': {'solved': true},
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 590,
    'obj_name': 'sunny',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 3,
    'sum_score': 1420,
    'obj_school': 'S3c_N0t_B4d',
    '75': null,
    '76': null,
    '77': {'solved': true, 'rank': 1},
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 373,
    'obj_name': 'Aryb1n',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 3,
    'sum_score': 1401,
    'obj_school': 'BOI',
    '75': null,
    '76': null,
    '77': {'solved': true},
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true, 'rank': 1}
  }, {
    'obj_id': 9806,
    'obj_name': '天河水',
    'obj_logo': 'userlogo/f8b1bb0017f9480ba78fbea39f9b62e2.png',
    'solved_count': 3,
    'sum_score': 1385,
    'obj_school': 'ChaMd5安全团队',
    '75': null,
    '76': null,
    '77': {'solved': true},
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 920,
    'obj_name': 'eHackyd',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 1184,
    'obj_school': null,
    '75': null,
    '76': {'solved': true, 'rank': 2},
    '77': null,
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 221,
    'obj_name': 'F4CK\'s Team',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 1,
    'sum_score': 833,
    'obj_school': 'F4ck',
    '75': null,
    '76': {'solved': true},
    '77': null,
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': null
  }, {
    'obj_id': 17919,
    'obj_name': 'M4x@10.0.0.55',
    'obj_logo': 'userlogo/bb2fcd584b8b42d38c7c22248bb36930.jpg',
    'solved_count': 1,
    'sum_score': 735,
    'obj_school': '10.0.0.55',
    '75': null,
    '76': null,
    '77': {'solved': true, 'rank': 2},
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': null
  }, {
    'obj_id': 379,
    'obj_name': 'lometsj',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 1,
    'sum_score': 714,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': {'solved': true},
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': null
  }, {
    'obj_id': 800,
    'obj_name': '王海',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 697,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true, 'rank': 1},
    '81': null,
    '82': {'solved': true, 'rank': 2}
  }, {
    'obj_id': 766,
    'obj_name': 'ly87238913',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 674,
    'obj_school': 'GGsimida',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true, 'rank': 3},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 236,
    'obj_name': 'ddltxj',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': '2017rise',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 5869,
    'obj_name': '地水',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'dishui',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 19535,
    'obj_name': 'X-D7',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': '鲜花',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 954,
    'obj_name': 'Keenan',
    'obj_logo': 'https://account.xctf.org.cn/media/userlogo/ed562011c7074b6a92a2e50c3b452a5e.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'mirorim',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 25708,
    'obj_name': 'Kaller',
    'obj_logo': 'userlogo/fe3c98ab30454f22aa23fa11d153f44b.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'We_ax',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 21303,
    'obj_name': '哈哈哈哈哈哈哈',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': '406',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 961,
    'obj_name': 'trytrytry',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'Learner',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33252,
    'obj_name': 'starsdestinatio',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33295,
    'obj_name': 'return 0;',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 752,
    'obj_name': 'W1ngs',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'W1ngs2fly',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 622,
    'obj_name': 'w2t3rp2dd13r',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 32264,
    'obj_name': 'ISTARRYI',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 904,
    'obj_name': 'anthos',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 905,
    'obj_name': 'chrome123',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33289,
    'obj_name': 'WB_ADAM',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 832,
    'obj_name': 'risker',
    'obj_logo': 'user_logo/ed893a74cb934c6fae5dce7b04f7d9c9.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'NEX',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 14226,
    'obj_name': 'dongzhu',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'Ginkgo',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 24160,
    'obj_name': 'sucre',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'HRsafe',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 945,
    'obj_name': 'naivete',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'Covteam',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 25711,
    'obj_name': 'MELODYˇXIE',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 27202,
    'obj_name': 'Prowes5',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': 'R-Web',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33410,
    'obj_name': 'Bayerischen',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33398,
    'obj_name': 'quanmax',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33413,
    'obj_name': '鹿桥',
    'obj_logo': 'user_logo/6a85c5e6afdf4203b073acf81c280228.jpg',
    'solved_count': 2,
    'sum_score': 671,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 767,
    'obj_name': 'tiandiwuji',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 1,
    'sum_score': 354,
    'obj_school': 'dajiangyou',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true, 'rank': 2},
    '81': null,
    '82': null
  }, {
    'obj_id': 33400,
    'obj_name': 'Breezy',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 1,
    'sum_score': 344,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': {'solved': true},
    '81': null,
    '82': null
  }, {
    'obj_id': 33194,
    'obj_name': 'rotpyrc',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 1,
    'sum_score': 327,
    'obj_school': 'Ever404',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 24883,
    'obj_name': '惊蛰',
    'obj_logo': 'userlogo/d0ba1ceb7013482f9e027a14a6a98e07.png',
    'solved_count': 1,
    'sum_score': 327,
    'obj_school': 'Lilac',
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33369,
    'obj_name': '2.71828',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 1,
    'sum_score': 327,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': {'solved': true}
  }, {
    'obj_id': 33258,
    'obj_name': 'Starbow',
    'obj_logo': '/static/adw/web/img/def_icon.jpg',
    'solved_count': 1,
    'sum_score': 327,
    'obj_school': null,
    '75': null,
    '76': null,
    '77': null,
    '78': null,
    '79': null,
    '80': null,
    '81': null,
    '82': {'solved': true}
  }]
}
const tableDetail={
  total:15,
  rows:[
    {
      'id': 236,
      'user': 7636,
      'team': null,
      'score': 874,
      'time': '2018-12-30 8:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': 'pwn-base',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': 'nc 39.105.216.229 9992\n\n\nps：备用下载地址：https://pan.baidu.com/s/18f45O4Dua3sE2GUtW0wNjg',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 2,
        'hash': 'c8ef6901-b0e2-45be-986d-2e20503856b9.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': 'pwn-base',
        'category_name': 'Pwn',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    }, {
      'id': 296,
      'user': 7636,
      'team': null,
      'score': 721,
      'time': '2018-12-30 8:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': 'arm-pwn1',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': 'nc 39.105.216.229 9991\n\nps：备用下载地址：https://pan.baidu.com/s/1G64ULEpDuy_vqWY_KnAxQg',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 2,
        'hash': '87b755e7-e6ad-40b3-8800-af459cc7b4d3.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': 'arm-pwn1',
        'category_name': 'Pwn',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    }, {
      'id': 245,
      'user': 7636,
      'team': null,
      'score': 999,
      'time': '2018-12-30 8:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': '前世姻缘',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': '传说：牛郎织女一见钟情，互相留下暗语，但是王母娘娘为了破坏这对感情，对牛郎织女两人的这段记忆进行修改，命运轮回，牛郎织女再次相见，当年的暗语或许是修订记忆的方法，你能帮他们找回记忆么？\n\n\nps：备用下载地址：https://pan.baidu.com/s/1q9SObo3HlexFCxkQCwGvCA',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 6,
        'hash': '08308076-576a-426d-a051-14d1c987bdba.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': '前世姻缘',
        'category_name': 'Mobile',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    }, {
      'id': 235,
      'user': 7636,
      'team': null,
      'score': 344,
      'time': '2018-12-30 8:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': '签到题',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': 'ps:网盘备用下载地址：https://pan.baidu.com/s/1505zH6bIrDXUADjVRnQ2Gg',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 6,
        'hash': 'e9d1c391-3dca-4a2e-b4e1-c5db7bb1517a.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': '签到题',
        'category_name': 'Mobile',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    }, {
      'id': 260,
      'user': 7636,
      'team': null,
      'score': 330,
      'time': '2018-12-30T12:02:44.922844+08:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': 'EASY-APK1',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': 'ps:备用下载链接地址：https://pan.baidu.com/s/12tQObNt_GkO0h7ThS2iSew',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 6,
        'hash': '066f78b0-ae02-4190-ad09-5028fab6b11b.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': 'EASY-APK1',
        'category_name': 'Mobile',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    },{
      'id': 236,
      'user': 7636,
      'team': null,
      'score': 874,
      'time': '2018-12-30 8:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': 'pwn-base',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': 'nc 39.105.216.229 9992\n\n\nps：备用下载地址：https://pan.baidu.com/s/18f45O4Dua3sE2GUtW0wNjg',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 2,
        'hash': 'c8ef6901-b0e2-45be-986d-2e20503856b9.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': 'pwn-base',
        'category_name': 'Pwn',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    }, {
      'id': 296,
      'user': 7636,
      'team': null,
      'score': 721,
      'time': '2018-12-30 8:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': 'arm-pwn1',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': 'nc 39.105.216.229 9991\n\nps：备用下载地址：https://pan.baidu.com/s/1G64ULEpDuy_vqWY_KnAxQg',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 2,
        'hash': '87b755e7-e6ad-40b3-8800-af459cc7b4d3.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': 'arm-pwn1',
        'category_name': 'Pwn',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    }, {
      'id': 245,
      'user': 7636,
      'team': null,
      'score': 999,
      'time': '2018-12-30 8:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': '前世姻缘',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': '传说：牛郎织女一见钟情，互相留下暗语，但是王母娘娘为了破坏这对感情，对牛郎织女两人的这段记忆进行修改，命运轮回，牛郎织女再次相见，当年的暗语或许是修订记忆的方法，你能帮他们找回记忆么？\n\n\nps：备用下载地址：https://pan.baidu.com/s/1q9SObo3HlexFCxkQCwGvCA',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 6,
        'hash': '08308076-576a-426d-a051-14d1c987bdba.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': '前世姻缘',
        'category_name': 'Mobile',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    }, {
      'id': 235,
      'user': 7636,
      'team': null,
      'score': 344,
      'time': '2018-12-30 8:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': '签到题',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': 'ps:网盘备用下载地址：https://pan.baidu.com/s/1505zH6bIrDXUADjVRnQ2Gg',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 6,
        'hash': 'e9d1c391-3dca-4a2e-b4e1-c5db7bb1517a.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': '签到题',
        'category_name': 'Mobile',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    }, {
      'id': 260,
      'user': 7636,
      'team': null,
      'score': 330,
      'time': '2018-12-30 8:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': 'EASY-APK1',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': 'ps:备用下载链接地址：https://pan.baidu.com/s/12tQObNt_GkO0h7ThS2iSew',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 6,
        'hash': '066f78b0-ae02-4190-ad09-5028fab6b11b.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': 'EASY-APK1',
        'category_name': 'Mobile',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    },{
      'id': 236,
      'user': 7636,
      'team': null,
      'score': 874,
      'time': '2018-12-30 8:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': 'pwn-base',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': 'nc 39.105.216.229 9992\n\n\nps：备用下载地址：https://pan.baidu.com/s/18f45O4Dua3sE2GUtW0wNjg',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 2,
        'hash': 'c8ef6901-b0e2-45be-986d-2e20503856b9.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': 'pwn-base',
        'category_name': 'Pwn',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    }, {
      'id': 296,
      'user': 7636,
      'team': null,
      'score': 721,
      'time': '2018-12-30 8:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': 'arm-pwn1',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': 'nc 39.105.216.229 9991\n\nps：备用下载地址：https://pan.baidu.com/s/1G64ULEpDuy_vqWY_KnAxQg',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 2,
        'hash': '87b755e7-e6ad-40b3-8800-af459cc7b4d3.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': 'arm-pwn1',
        'category_name': 'Pwn',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    }, {
      'id': 245,
      'user': 7636,
      'team': null,
      'score': 999,
      'time': '2018-12-30 8:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': '前世姻缘',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': '传说：牛郎织女一见钟情，互相留下暗语，但是王母娘娘为了破坏这对感情，对牛郎织女两人的这段记忆进行修改，命运轮回，牛郎织女再次相见，当年的暗语或许是修订记忆的方法，你能帮他们找回记忆么？\n\n\nps：备用下载地址：https://pan.baidu.com/s/1q9SObo3HlexFCxkQCwGvCA',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 6,
        'hash': '08308076-576a-426d-a051-14d1c987bdba.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': '前世姻缘',
        'category_name': 'Mobile',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    }, {
      'id': 235,
      'user': 7636,
      'team': null,
      'score': 344,
      'time': '2018-12-30 8:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': '签到题',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': 'ps:网盘备用下载地址：https://pan.baidu.com/s/1505zH6bIrDXUADjVRnQ2Gg',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 6,
        'hash': 'e9d1c391-3dca-4a2e-b4e1-c5db7bb1517a.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': '签到题',
        'category_name': 'Mobile',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    }, {
      'id': 260,
      'user': 7636,
      'team': null,
      'score': 330,
      'time': '2018-12-30 8:00',
      'status': 1,
      'username': '李启飞',
      'team_name': '',
      'task': {
        'title_dsc': 'EASY-APK1',
        'event_name': 'XMAN冬令营赛题',
        'file_url': null,
        'content': 'ps:备用下载链接地址：https://pan.baidu.com/s/12tQObNt_GkO0h7ThS2iSew',
        'public_official_writeup': false,
        'official_writeup': null,
        'category': 6,
        'hash': '066f78b0-ae02-4190-ad09-5028fab6b11b.2',
        'score': 100,
        'is_dynamic_env': false,
        'url': null,
        'difficulty_rating': 0,
        'title': 'EASY-APK1',
        'category_name': 'Mobile',
        'lock': false,
        'event': 87,
        'markdown': null,
        'env_times': '4'
      }
    }]
}
const personalData = {
  message: {
    username: "涛涛",
    email: "806250675@qq.com",
    logo: "/media/userlogo/62572e1f222247f18812c1fbdb8484cf.png",
    user_team: {
      team_name: "穿过风的旅行",
      team_token: null,
      team_member: [
        "涛涛"
      ]
    }
  },
  success: true
}
const signupUser = {
  total: 1,
  rows: [
    {
      id: 73,
      repr_name: "Zamo_mm",
      repr_logo: "/media/userlogo/go/62572e1f222247f18812c1fbdb8484cf.jpg",
      event_name: "xman冬令营",
      event: 48,
      token: "userdc783c6bd29346f76200eaa0a8bf7d9b",
      status: 1,
      time: "2018-12-29 03:56:56"
    }
  ]
}//个人注册信息
const signupTeam = {
  total: 1,
  rows: [
    {
      id: 73,
      repr_name: "Zamo_mm",
      repr_logo: "/media/userlogo/go/62572e1f222247f18812c1fbdb8484cf.jpg",
      event_name: "xman冬令营",
      event: 48,
      token: 'null',
      status: 1,
      time: "2018-12-29 03:56:56"
    }
  ]
}//团队注册信息
const teamList = {
  total:20,
  rows:[
    {
      id:10822,
      status:1,
      position:2,
      create_time:"2018-12-28 09:17:00",
      team_member_number:4,
      bind_phone:"",
      is_creator:true,
      current_user:false,
      user_id:21144,
      user_level:"新手",
      user_points:0,
      user_good_at:"-",
      username:"redhire",
      user_logo:"/static/adw/web/img/def_icon.jpg",
      competition_num:1,
      team_name:"给dalao递茶"
    },
    {
      id:396,
      status:1,
      position:1,
      create_time:"2018-12-28 09:16:28",
      team_member_number:4,
      is_creator:false,
      current_user:true,
      user_id:208,
      user_level:"新手",
      user_points:54.0,
      user_good_at:"web",
      username:"wcxxxxx",
      user_logo:"/media/user_logo/87c3df928d0345779f2c5bc600e64660.png",
      competition_num:1,
      team_name:"给dalao递茶"
    },
    {
      id:13068,
      status:1,
      position:3,
      create_time:"2018-12-28 09:17:07",
      team_member_number:4,
      is_creator:false,
      current_user:false,
      user_id:25337,
      user_level:"新手",
      user_points:0,
      user_good_at:"-",
      username:"愛夕",
      user_logo:"/media/userlogo/f30a92507927419ab39acee6b404615f.jpg",
      competition_num:0,
      team_name:"给dalao递茶"
    },
    {
      id:13068,
      status:1,
      position:3,
      create_time:"2018-12-28 09:17:07",
      team_member_number:4,
      is_creator:false,
      current_user:false,
      user_id:25337,
      user_level:"新手",
      user_points:0,
      user_good_at:"-",
      username:"愛夕",
      user_logo:"/media/userlogo/f30a92507927419ab39acee6b404615f.jpg",
      competition_num:0,
      team_name:"给dalao递茶"
    },
    {
      id:13068,
      status:1,
      position:3,
      create_time:"2018-12-28 09:17:07",
      team_member_number:4,
      is_creator:false,
      current_user:false,
      user_id:25337,
      user_level:"新手",
      user_points:0,
      user_good_at:"-",
      username:"愛夕",
      user_logo:"/media/userlogo/f30a92507927419ab39acee6b404615f.jpg",
      competition_num:0,
      team_name:"给dalao递茶"
    },
    {
      id:13068,
      status:1,
      position:3,
      create_time:"2018-12-28 09:17:07",
      team_member_number:4,
      is_creator:false,
      current_user:false,
      user_id:25337,
      user_level:"新手",
      user_points:0,
      user_good_at:"-",
      username:"愛夕",
      user_logo:"/media/userlogo/f30a92507927419ab39acee6b404615f.jpg",
      competition_num:0,
      team_name:"给dalao递茶"
    },
    {
      id:13068,
      status:1,
      position:3,
      create_time:"2018-12-28 09:17:07",
      team_member_number:4,
      is_creator:false,
      current_user:false,
      user_id:25337,
      user_level:"新手",
      user_points:0,
      user_good_at:"-",
      username:"愛夕",
      user_logo:"/media/userlogo/f30a92507927419ab39acee6b404615f.jpg",
      competition_num:0,
      team_name:"给dalao递茶"
    },
    {
      id:13068,
      status:1,
      position:3,
      create_time:"2018-12-28 09:17:07",
      team_member_number:4,
      is_creator:false,
      current_user:false,
      user_id:25337,
      user_level:"新手",
      user_points:0,
      user_good_at:"-",
      username:"愛夕",
      user_logo:"/media/userlogo/f30a92507927419ab39acee6b404615f.jpg",
      competition_num:0,
      team_name:"给dalao递茶"
    },
    {
      id:13068,
      status:1,
      position:3,
      create_time:"2018-12-28 09:17:07",
      team_member_number:4,
      is_creator:false,
      current_user:false,
      user_id:25337,
      user_level:"新手",
      user_points:0,
      user_good_at:"-",
      username:"愛夕",
      user_logo:"/media/userlogo/f30a92507927419ab39acee6b404615f.jpg",
      competition_num:0,
      team_name:"给dalao递茶"
    },
    {
      id:13068,
      status:1,
      position:3,
      create_time:"2018-12-28 09:17:07",
      team_member_number:4,
      is_creator:false,
      current_user:false,
      user_id:25337,
      user_level:"新手",
      user_points:0,
      user_good_at:"-",
      username:"愛夕",
      user_logo:"/media/userlogo/f30a92507927419ab39acee6b404615f.jpg",
      competition_num:0,
      team_name:"给dalao递茶"
    },
    ]
}
const passtoTeam = {
  total:2,
  rows:[
    {
      id:10822,
      status:1,
      position:2,
      create_time:"2018-12-28 09:17:00",
      team_member_number:4,
      bind_phone:"",
      is_creator:true,
      current_user:false,
      user_id:21144,
      user_level:"新手",
      user_points:0,
      user_good_at:"-",
      username:"redhire",
      user_logo:"/static/adw/web/img/def_icon.jpg",
      competition_num:1,
      team_name:"给dalao递茶"
    },
    {
      id:13068,
      status:1,
      position:3,
      create_time:"2018-12-28 09:17:07",
      team_member_number:4,
      is_creator:false,
      current_user:false,
      user_id:25337,
      user_level:"新手",
      user_points:0,
      user_good_at:"-",
      username:"愛夕",
      user_logo:"/media/userlogo/f30a92507927419ab39acee6b404615f.jpg",
      competition_num:0,
      team_name:"给dalao递茶"
    }
  ]
}
const applyList = {
  total:11,
  rows:[
    {
      name: '韩梅梅',
      logo:'',
      position:'队员',
      level:'大神',
      goodat:'pwn',
      score:800,
      message:'快同意我加入吧！'
    },
    {
      name: '韩梅梅',
      logo:'',
      position:'队员',
      level:'大神',
      goodat:'pwn',
      score:800,
      message:'156！'
    },
    {
      name: '韩梅梅',
      logo:'',
      position:'队员',
      level:'大神',
      goodat:'pwn',
      score:800,
      message:'快同意我加入吧！'
    },
    {
      name: '韩梅梅',
      logo:'',
      position:'队员',
      level:'大神',
      goodat:'pwn',
      score:800,
      message:'快同意我加入吧！'
    },
    {
      name: '韩梅梅',
      logo:'',
      position:'队员',
      level:'大神',
      goodat:'pwn',
      score:800,
      message:'快同意我加入吧！'
    },
    {
      name: '韩梅梅',
      logo:'',
      position:'队员',
      level:'大神',
      goodat:'pwn',
      score:800,
      message:'快同意我加入吧！'
    },
    {
      name: '韩梅梅',
      logo:'',
      position:'队员',
      level:'大神',
      goodat:'pwn',
      score:800,
      message:'快同意我加入吧！'
    },
    {
      name: '韩梅梅',
      logo:'',
      position:'队员',
      level:'大神',
      goodat:'pwn',
      score:800,
      message:'快同意我加入吧！'
    },
    {
      name: '韩梅梅',
      logo:'',
      position:'队员',
      level:'大神',
      goodat:'pwn',
      score:800,
      message:'快同意我加入吧！'
    },
    {
      name: '韩梅梅',
      logo:'',
      position:'队员',
      level:'大神',
      goodat:'pwn',
      score:800,
      message:'快同意我加入吧！'
    }
  ]
}
const teamGroupList = {
  total:80,
  rows:[
    {
      apply_count:6,
      create_time:"2015-11-07 09:04:44",
      glories:[],
      id:151710959,
      join_contest_number:31,
      logo_url:"/media/teamlogo/56f7c5152dfd4a8e844be125312d11b6.png",
      manifesto:"Nu1L",
      name:"Nu1L",
      notice:null,
      point:"1618.73",
      team_leader_name:"Veneno",
      team_member_number:33
    },
    {
      apply_count:6,
      create_time:"2015-11-07 09:04:44",
      glories:[],
      id:151710959,
      join_contest_number:31,
      logo_url:"/media/teamlogo/56f7c5152dfd4a8e844be125312d11b6.png",
      manifesto:"Nu1L",
      name:"Nu1L",
      notice:null,
      point:"1618.73",
      team_leader_name:"Veneno",
      team_member_number:33
    },
    {
      apply_count:6,
      create_time:"2015-11-07 09:04:44",
      glories:[],
      id:151710959,
      join_contest_number:31,
      logo_url:"/media/teamlogo/56f7c5152dfd4a8e844be125312d11b6.png",
      manifesto:"Nu1L",
      name:"Nu1L",
      notice:null,
      point:"1618.73",
      team_leader_name:"Veneno",
      team_member_number:33
    },
    {
      apply_count:6,
      create_time:"2015-11-07 09:04:44",
      glories:[],
      id:151710959,
      join_contest_number:31,
      logo_url:"/media/teamlogo/56f7c5152dfd4a8e844be125312d11b6.png",
      manifesto:"Nu1L",
      name:"Nu1L",
      notice:null,
      point:"1618.73",
      team_leader_name:"Veneno",
      team_member_number:33
    }
  ],
  apply_list:[]
}
// Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/user/api/person_detail/','get',personalData)//个人信息
Mock.mock('/api/event_signup_users','get',signupUser)//请求token
Mock.mock('/api/event/signup_teams','get',signupTeam)//请求token
Mock.mock('/logout','get')//退出
Mock.mock('/task/card', 'get', produceNewsData);//首页题板
Mock.mock('/match/guide', 'get', guide_data);//指南
// Mock.mock('/match/notice', 'get', notice_data);//公告
Mock.mock('/match/trend', 'get', trend_data);//趋势图
Mock.mock('/match/task', 'get', subAry);//答题
Mock.mock('/match/sub', 'get', tableSubtype);//排行榜题目类型
Mock.mock('/match/table', 'get', function (req) {

  var cs=JSON.parse(req.body);
  var ary=tableData.rows.slice(cs.offset,cs.offset+cs.limit)
  return {
    total:tableData.total,
    rows:ary
  }
});//排行榜表格
Mock.mock('/match/tabledetail', 'get', function (req) {

  var cs=JSON.parse(req.body);
  var ary=tableDetail.rows.slice(cs.offset,cs.offset+cs.limit)
  return {
    total:tableDetail.total,
    rows:ary
  }
});//排行榜表格
Mock.mock('/match/event_user_radar', 'get', radar);//表格技能图
Mock.mock('/match/task/card', 'post', function (req) {
  var cs=JSON.parse(req.body)
  if(cs.answer==1){
    return {
      "id": 253,
      "event_task": 38,
      "answer": "[\"flag{25105 26159 20667 36924}\"]",
      "is_solved": true
    }
  }else{
    return {
      "id": 253,
      "event_task": 38,
      "answer": "[\"flag{25105 26159 20667 36924}\"]",
      "is_solved": false
    };
  }

});//答题卡

Mock.mock('/task/panel', 'get', (options)=>{
  return produceNewsData;
});//首页题板
Mock.mock(RegExp('/match/guide' + ".*"), 'get', (options)=>{
  return guide_data;
});//指南

Mock.mock(RegExp('/match/notice' + ".*"), 'get',(options)=>{
  // console.log(notice_data,'我要传数据')
  return notice_data;
});//公告
Mock.mock(RegExp('/match/trend' + ".*"), 'get', (options)=>{

  return trend_data
});//趋势图
Mock.mock(RegExp('/match/tips' + ".*"), 'get', (options)=>{
  // console.log(options)
  return tips
});//提示消息

//攻防世界答题页面模拟数据
const task_list =  {
  total:22,
  list:[
    {
      id:1,
      name:'题目名称MM',
      score:1245,
      visit_number:1549,
      status:1//1是已答出，2是未达出
    },
    {
      id:2,
      name:'题目名称MM',
      score:1245,
      visit_number:149,
      status:1//1是已答出，2是未达出
    },
    {
      id:3,
      name:'是给我个尔特',
      score:45,
      visit_number:549,
      status:2//1是已答出，2是未达出
    },
    {
      id:1,
      name:'而呵呵尔特ergherherh',
      score:1245,
      visit_number:109,
      status:1//1是已答出，2是未达出
    },
    {
      id:1,
      name:'而和任何和而已人员让她ery',
      score:95,
      visit_number:1549,
      status:2//1是已答出，2是未达出
    },
    {
      id:1,
      name:'题目名称MM',
      score:1245,
      visit_number:1549,
      status:2//1是已答出，2是未达出
    },
    {
      id:1,
      name:'题目名称MM',
      score:1245,
      visit_number:1549,
      status:1//1是已答出，2是未达出
    },
    {
      id:1,
      name:'题目名称MM',
      score:1245,
      visit_number:1549,
      status:2//1是已答出，2是未达出
    },
    {
      id:1,
      name:'题目名称MM',
      score:1245,
      visit_number:1549,
      status:1//1是已答出，2是未达出
    },
    {
      id:1,
      name:'题目名称MM',
      score:1245,
      visit_number:1549,
      status:1//1是已答出，2是未达出
    },
    {
      id:1,
      name:'题目名称MM',
      score:1245,
      visit_number:1549,
      status:1//1是已答出，2是未达出
    },
    {
      id:1,
      name:'题目名称MM',
      score:1245,
      visit_number:1549,
      status:1//1是已答出，2是未达出
    },
    {
      id:1,
      name:'题目名称MM',
      score:1245,
      visit_number:1549,
      status:1//1是已答出，2是未达出
    },
    {
      id:1,
      name:'题目名称MM',
      score:1245,
      visit_number:1549,
      status:1//1是已答出，2是未达出
    },
    {
      id:1,
      name:'题目名称MM',
      score:1245,
      visit_number:1549,
      status:1//1是已答出，2是未达出
    },
    {
      id:1,
      name:'题目名称MM',
      score:1245,
      visit_number:1549,
      status:1//1是已答出，2是未达出
    },
    {
      id:1,
      name:'题目名称MM',
      score:1245,
      visit_number:1549,
      status:1//1是已答出，2是未达出
    },
    {
      id:1,
      name:'题目名称MM',
      score:1245,
      visit_number:1549,
      status:1//1是已答出，2是未达出
    },
  ]
}
Mock.mock(RegExp('/task/list' + ".*"),'get',(options)=>{
  return task_list
})

//攻防世界队伍接口模拟
//初始化获取所在队伍的人员列表数据
Mock.mock(RegExp('/api/team_users'+".*"),'get',()=>{
  return teamList;
})
//转让时候搜索关键词接口库
Mock.mock(RegExp('/x_person/api/team_user'+".*"),'get',()=>{
  return passtoTeam;
})
//入队申请
Mock.mock(RegExp('/apply/api/user'+".*"),'get',()=>{
  return applyList;
})
//战队大厅
Mock.mock(RegExp('/x_person/api/teams/'+".*"),'get',()=>{
  return teamGroupList;
})
//队伍主页系列接口
//队伍详情
const team_detail= {
  apply_count:0,
  create_time:"2018-04-20 09:16:13",
  glories:[],
  id:184002222,
  join_contest_number:5,
  logo_url:"/static/adw/web/img/def_icon.jpg",
  manifesto:"这个人很懒，什么都没有留下",
  name:"给dalao递茶",
  notice:null,
  point:"7.38",
  team_leader_name:"redhire",
  team_member_number:3
}
Mock.mock(RegExp('/x_person/api/teamdetail/'+".*"),'get',()=>{
  return team_detail;
})
const radar_data=[
  {
    type:["misc","pwn","web","reverse","crypto","mobile"],
    name:"wcxxxxx",
    value:[150,0,29,30,60,9]
  },
  {
    type:["misc","pwn","web","reverse","crypto","mobile"],
    name:"redhire",
    value:[0,150,10,5,15,20]
  },
  {
    type:["misc","pwn","web","reverse","crypto","mobile"],
    name:"愛夕",
    value:[0,66,9,0,22,101]
  }
  ]
Mock.mock(RegExp('/x_person/api/all_members_radar_data/'+".*"),'get',()=>{
  return radar_data;
})
const event_log ={
  total:12,
  rows:[
    {id:15087,
      team_score:"63.00",
      team_point:"0.41",
      rank:288,
      team_name:"给dalao递茶",
      event_name:"HITB-XCTF DUBAI CTF/BCTF 2018"
    },
    {
      id:14413,
      team_score:"658.00",
      team_point:"2.01",
      rank:69,
      team_name:"给dalao递茶",
      event_name:"XCTF分站赛—SCTF"
    },
    {
      id:13440,
      team_score:"89.00",
      team_point:"0.38",
      rank:207,
      team_name:"给dalao递茶",
      event_name:"XCTF分站赛——SUCTF全国赛"
    },
    {
      id:13838,
      team_score:"125.00",
      team_point:"0.76",
      rank:239,
      team_name:"给dalao递茶",
      event_name:"XCTF分站赛——RCTF国际赛"
    },
    {
      id:13511,
      team_score:"689.00",
      team_point:"3.81",
      rank:59,
      team_name:"给dalao递茶",
      event_name:"XCTF分站赛—— *CTF国际赛"
    },
    {
      id:13511,
      team_score:"689.00",
      team_point:"3.81",
      rank:59,
      team_name:"给dalao递茶",
      event_name:"XCTF分站赛—— *CTF国际赛"
    },
    {
      id:13511,
      team_score:"689.00",
      team_point:"3.81",
      rank:59,
      team_name:"给dalao递茶",
      event_name:"XCTF分站赛—— *CTF国际赛"
    },
    {
      id:13511,
      team_score:"689.00",
      team_point:"3.81",
      rank:59,
      team_name:"给dalao递茶",
      event_name:"XCTF分站赛—— *CTF国际赛"
    },{
      id:13511,
      team_score:"689.00",
      team_point:"3.81",
      rank:59,
      team_name:"给dalao递茶",
      event_name:"XCTF分站赛—— *CTF国际赛"
    },{
      id:13511,
      team_score:"689.00",
      team_point:"3.81",
      rank:59,
      team_name:"给dalao递茶",
      event_name:"XCTF分站赛—— *CTF国际赛"
    },{
      id:13511,
      team_score:"689.00",
      team_point:"3.81",
      rank:59,
      team_name:"给dalao递茶",
      event_name:"XCTF分站赛—— *CTF国际赛"
    },{
      id:13511,
      team_score:"689.00",
      team_point:"3.81",
      rank:59,
      team_name:"给dalao递茶",
      event_name:"XCTF分站赛—— *CTF国际赛"
    }
  ]
}
Mock.mock(RegExp('/adw/api/team_event_logss/'+".*"),'get',()=>{
  return event_log;
})
