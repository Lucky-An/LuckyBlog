(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-78cc121f"],{"1cdd":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"app-container guide_box"},[n("guide",{attrs:{guide:t.guide}})],1)},a=[],c=n("304a"),o={name:"NoticeList",components:{guide:c["a"]},data:function(){return{guide:""}},created:function(){this.getMatchInfo()},methods:{getMatchInfo:function(){var t=this;this.$store.dispatch("match/getRwMatchInfos",this.$route.query.hash).then((function(e){"en"==t.$i18n.locale?t.guide=e.competition_guide_html_en:t.guide=e.competition_guide_html_zh}))}}},u=o,s=(n("9ce6"),n("9ca4")),d=Object(s["a"])(u,i,a,!1,null,"343a6a6c",null);e["default"]=d.exports},"4bc1":function(t,e,n){t.exports=n.p+"inf-static/img/kong.a3873aa8.png"},"9ce6":function(t,e,n){"use strict";var i=n("f0aa"),a=n.n(i);a.a},f0aa:function(t,e,n){}}]);