(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-17b8041e"],{"3af3":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("taskHeader",{attrs:{nav:t.nav}}),a("router-view")],1)},r=[],i=a("b0aa"),c={name:"Match",components:{taskHeader:i["a"]},data:function(){return{id:this.$route.query.id,nav:[{path:"/rw/guide",name:this.$t("header.match.guide"),type:"guide"},{path:"/rw/notice",name:this.$t("header.match.notice"),type:"notice"},{path:"/rw/task",name:this.$t("header.match.questionBoard"),type:"task"},{path:"/rw/ranking",name:this.$t("header.match.ranking"),type:"ranking"},{path:"/rw/trend",name:this.$t("header.match.trend"),type:"trend"}]}},created:function(){this.getMathInfo()},methods:{getMathInfo:function(){this.$store.dispatch("match/getRwMatchInfos",this.$route.query.hash)}}},o=c,h=a("9ca4"),s=Object(h["a"])(o,n,r,!1,null,"380fa3f1",null);e["default"]=s.exports},"77ad":function(t,e,a){"use strict";var n=a("1c8b"),r=a("a719"),i=a("74e7"),c=a("e1d6"),o=a("d88d"),h=a("da10"),s=a("1bbd"),d=a("90fb"),u=a("1ea7"),f=a("ff9c"),p=u("slice"),l=f("slice",{ACCESSORS:!0,0:0,1:2}),m=d("species"),v=[].slice,w=Math.max;n({target:"Array",proto:!0,forced:!p||!l},{slice:function(t,e){var a,n,d,u=h(this),f=o(u.length),p=c(t,f),l=c(void 0===e?f:e,f);if(i(u)&&(a=u.constructor,"function"!=typeof a||a!==Array&&!i(a.prototype)?r(a)&&(a=a[m],null===a&&(a=void 0)):a=void 0,a===Array||void 0===a))return v.call(u,p,l);for(n=new(void 0===a?Array:a)(w(l-p,0)),d=0;p<l;p++,d++)p in u&&s(n,d,u[p]);return n.length=d,n}})}}]);