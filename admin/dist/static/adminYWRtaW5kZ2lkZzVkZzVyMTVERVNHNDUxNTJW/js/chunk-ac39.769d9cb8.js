(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-ac39"],{VzsX:function(t,e,n){},jmN2:function(t,e,n){"use strict";n.r(e);var a=n("Mz3J"),i=n("ZySA"),s=n("gyXm"),r=n("sJDp"),l={name:"Config",directives:{waves:i.a,clipboard:s.a},components:{Pagination:a.a},data:function(){return{type:{1:"攻防赛",2:"新攻防",3:"运维赛",4:"解题赛",6:"RW",7:"理论赛",8:"渗透赛"},matchList:[],ids:[],listTotal:0,listPage:1,listQuery:{page:1,per_page:this.$store.state.config.row,type:"",management_type:"vpn",name:""}}},created:function(){this.getList()},methods:{getList:function(t){var e=this;1===t&&(this.listQuery.page=t),Object(r.g)(this.listQuery).then(function(t){var n=t.data;e.matchList=n.data,e.listTotal=n.total})},detail:function(){},checkTable:function(t){this.ids=t.map(function(t){return t.id})}}},o=(n("oRi4"),n("ZrdR")),c=Object(o.a)(l,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"app-container"},[n("div",{staticClass:"filter-container"},[n("el-select",{staticClass:"filter-item",attrs:{clearable:"",size:"mini",placeholder:"请选择竞赛类型"},model:{value:t.listQuery.type,callback:function(e){t.$set(t.listQuery,"type",e)},expression:"listQuery.type"}},t._l(t.type,function(t,e){return n("el-option",{key:e,attrs:{value:e,label:t}})})),t._v(" "),n("el-input",{staticClass:"filter-item",staticStyle:{width:"200px"},attrs:{placeholder:"请输入竞赛名称",size:"mini"},model:{value:t.listQuery.name,callback:function(e){t.$set(t.listQuery,"name","string"==typeof e?e.trim():e)},expression:"listQuery.name"}}),t._v(" "),n("el-button",{directives:[{name:"waves",rawName:"v-waves"}],staticClass:"filter-item",attrs:{type:"primary",size:"mini"},on:{click:function(e){t.getList(1)}}},[t._v("搜索\n    ")])],1),t._v(" "),n("div",{staticClass:"filter-container"},[n("el-table",{attrs:{data:t.matchList,border:""},on:{"selection-change":t.checkTable}},[n("el-table-column",{attrs:{index:(t.listQuery.page-1)*t.listQuery.per_page+1,align:"center",label:"序号",type:"index",width:"50"}}),t._v(" "),n("el-table-column",{attrs:{align:"center",prop:"event_name",label:"竞赛名称"}}),t._v(" "),n("el-table-column",{attrs:{align:"center",width:"250px",label:"竞赛类型"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n          "+t._s(t.type[e.row.identity_type])+"\n        ")]}}])}),t._v(" "),n("el-table-column",{attrs:{align:"center",width:"250px",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("router-link",{attrs:{to:{path:"/systemDevOps/vpnDetail",query:{name:e.row.event_name,id:e.row.event_id}}}},[n("el-button",{attrs:{type:"primary",size:"mini"}},[t._v("详情管理")])],1)]}}])})],1)],1),t._v(" "),n("pagination",{directives:[{name:"show",rawName:"v-show",value:t.listTotal>0,expression:"listTotal>0"}],attrs:{total:t.listTotal,page:t.listQuery.page,limit:t.listQuery.per_page},on:{"update:page":function(e){t.$set(t.listQuery,"page",e)},"update:limit":function(e){t.$set(t.listQuery,"per_page",e)},pagination:t.getList}})],1)},[],!1,null,"2e73fda4",null);c.options.__file="index.vue";e.default=c.exports},oRi4:function(t,e,n){"use strict";var a=n("VzsX");n.n(a).a},sJDp:function(t,e,n){"use strict";n.d(e,"g",function(){return i}),n.d(e,"f",function(){return s}),n.d(e,"d",function(){return r}),n.d(e,"c",function(){return l}),n.d(e,"e",function(){return o}),n.d(e,"b",function(){return c}),n.d(e,"a",function(){return u});var a=n("t3Un");function i(t){return Object(a.a)({url:"/api/v1/common/admin/system/events",method:"get",params:t})}function s(t,e){return Object(a.a)({url:"/api/v1/common/admin/system/"+t+"/vpn",method:"get",params:e})}function r(t,e){return Object(a.a)({url:"/api/v1/common/admin/system/"+t+"/vpn",method:"post",data:e})}function l(t,e){return Object(a.a)({url:"/api/v1/common/admin/system/"+t+"/mac",method:"get",params:e})}function o(t,e){return Object(a.a)({url:"/api/v1/common/admin/system/"+t+"/mac",method:"delete",data:e})}function c(t){return Object(a.a)({url:"/api/v1/common/admin/system/clusters",method:"get",params:t})}function u(t){return Object(a.a)({url:"/api/v1/common/admin/system/clusters",method:"post",data:t})}}}]);