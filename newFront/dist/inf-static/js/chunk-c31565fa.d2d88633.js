(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c31565fa"],{"076f":function(t,n,a){},"1bee":function(t,n,a){"use strict";a.d(n,"a",(function(){return e}));var e=function(t){var n,a,e,s,i=parseInt(t/864e5),c=parseInt(t%864e5/36e5),r=parseInt(t%36e5/6e4),o=t%6e4/1e3;localStorage.lang&&"zh"!=localStorage.lang?(n="Day",a=":",e=":",s=""):(n="天",a="时",e="分",s="秒");var u="",p="",l="";0!==i&&(u=i+'<span class="time_margin">'+n+"</span>"),p=0==c?0==i?"":'0<span class="time_margin">'+a+"</span>":c+'<span class="time_margin">'+a+"</span>",l=0==r?0==i&&0==c?"":'0<span class="time_margin">'+e+"</span>":r+'<span class="time_margin">'+e+"</span>";var f=o+'<span class="time_margin">'+s+"</span>";return u+p+l+f}},4590:function(t,n,a){"use strict";var e=a("076f"),s=a.n(e);s.a},"4bc1":function(t,n,a){t.exports=a.p+"inf-static/img/kong.a3873aa8.png"},"70e0":function(t,n,a){"use strict";a.r(n);var e=function(){var t=this,n=t.$createElement,a=t._self._c||n;return a("div",{staticClass:"notice_box"},[a("notice",{attrs:{list:t.list}})],1)},s=[],i=a("c11e"),c=a("632a"),r={name:"NoticeList",components:{notice:i["a"]},data:function(){return{list:[]}},created:function(){this.getNotice()},methods:{getNotice:function(){var t=this;Object(c["g"])({event_id:this.$route.query.id},this.$route.query.hash).then((function(n){t.list=n.data}))}}},o=r,u=(a("4590"),a("9ca4")),p=Object(u["a"])(o,e,s,!1,null,"0235ec23",null);n["default"]=p.exports}}]);