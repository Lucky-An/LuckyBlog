(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-05795010"],{"77ad":function(t,e,a){"use strict";var n=a("1c8b"),r=a("a719"),i=a("74e7"),c=a("e1d6"),h=a("d88d"),o=a("da10"),s=a("1bbd"),d=a("90fb"),u=a("1ea7"),p=a("ff9c"),f=u("slice"),k=p("slice",{ACCESSORS:!0,0:0,1:2}),m=d("species"),l=[].slice,v=Math.max;n({target:"Array",proto:!0,forced:!f||!k},{slice:function(t,e){var a,n,d,u=o(this),p=h(u.length),f=c(t,p),k=c(void 0===e?p:e,p);if(i(u)&&(a=u.constructor,"function"!=typeof a||a!==Array&&!i(a.prototype)?r(a)&&(a=a[m],null===a&&(a=void 0)):a=void 0,a===Array||void 0===a))return l.call(u,f,k);for(n=new(void 0===a?Array:a)(v(k-f,0)),d=0;f<k;f++,d++)f in u&&s(n,d,u[f]);return n.length=d,n}})},a522:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("taskHeader",{attrs:{nav:t.nav}}),a("router-view")],1)},r=[],i=a("b0aa"),c={name:"Match",components:{taskHeader:i["a"]},data:function(){return{id:this.$route.query.id,nav:[{path:"/newAttack/guide",name:this.$t("header.match.guide"),type:"guide"},{path:"/newAttack/notice",name:this.$t("header.match.notice"),type:"notice"},{path:"/newAttack/task",name:this.$t("header.match.questionBoard"),type:"task"},{path:"/newAttack/ranking",name:this.$t("header.match.ranking"),type:"ranking"},{path:"/newAttack/attackRanking",name:this.$t("header.match.attack"),type:"newAttackRanking"},{path:"/newAttack/trend",name:this.$t("header.match.trend"),type:"trend"}]}},created:function(){this.getMathInfo()},methods:{getMathInfo:function(){var t={event_id:this.$route.query.id,evt:this.$route.query.hash};this.$store.dispatch("match/getNewADMatchInfos",t)}}},h=c,o=a("9ca4"),s=Object(o["a"])(h,n,r,!1,null,"1dbb8fea",null);e["default"]=s.exports}}]);