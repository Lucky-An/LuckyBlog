(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4aa8d0af"],{"1bee":function(n,a,t){"use strict";t.d(a,"a",(function(){return e}));var e=function(n){var a,t,e,s,i=parseInt(n/864e5),c=parseInt(n%864e5/36e5),o=parseInt(n%36e5/6e4),r=n%6e4/1e3;localStorage.lang&&"zh"!=localStorage.lang?(a="Day",t=":",e=":",s=""):(a="天",t="时",e="分",s="秒");var p="",u="",l="";0!==i&&(p=i+'<span class="time_margin">'+a+"</span>"),u=0==c?0==i?"":'0<span class="time_margin">'+t+"</span>":c+'<span class="time_margin">'+t+"</span>",l=0==o?0==i&&0==c?"":'0<span class="time_margin">'+e+"</span>":o+'<span class="time_margin">'+e+"</span>";var m=r+'<span class="time_margin">'+s+"</span>";return p+u+l+m}},"37b2":function(n,a,t){"use strict";t.r(a);var e=function(){var n=this,a=n.$createElement,t=n._self._c||a;return t("div",{staticClass:"app-container notice_box"},[t("countDown"),t("notice",{attrs:{list:n.list}})],1)},s=[],i=t("c11e"),c=t("30b2"),o=t("9e0c"),r={name:"NoticeList",components:{notice:i["a"],countDown:c["a"]},data:function(){return{list:[]}},created:function(){this.getNotice()},methods:{getNotice:function(){var n=this;Object(o["b"])({event_id:this.$route.query.id}).then((function(a){n.list=a.data}))}}},p=r,u=t("9ca4"),l=Object(u["a"])(p,e,s,!1,null,"74356daa",null);a["default"]=l.exports},"4bc1":function(n,a,t){n.exports=t.p+"inf-static/img/kong.a3873aa8.png"}}]);