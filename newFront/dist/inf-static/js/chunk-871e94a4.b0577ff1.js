(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-871e94a4"],{"130f":function(t,n,e){"use strict";var i=e("a25c"),a=e.n(i);a.a},"4bc1":function(t,n,e){t.exports=e.p+"inf-static/img/kong.a3873aa8.png"},"4fab":function(t,n,e){"use strict";e.r(n);var i=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"app-container guide_box"},[e("guide",{attrs:{guide:t.guide}})],1)},a=[],c=e("304a"),o={name:"NoticeList",components:{guide:c["a"]},data:function(){return{guide:""}},created:function(){this.getMatchInfo()},methods:{getMatchInfo:function(){var t=this;this.$store.dispatch("match/getjadInfo",this.$route.query.hash).then((function(n){"en"==t.$i18n.locale?t.guide=n.competition_guide_html_en:t.guide=n.competition_guide_html_zh}))}}},u=o,s=(e("130f"),e("9ca4")),d=Object(s["a"])(u,i,a,!1,null,"868d5070",null);n["default"]=d.exports},a25c:function(t,n,e){}}]);