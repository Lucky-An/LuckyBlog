(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-300d"],{"4tVt":function(t,e,s){"use strict";var a=s("QswK");s.n(a).a},GJqC:function(t,e,s){"use strict";s.r(e);var a=s("omC7"),i=s.n(a),r=s("Mz3J"),o=s("ZySA"),n=s("VyMG"),l=s("jJIE"),u=s.n(l),c=s("7Qib"),d={name:"UserCneter",directives:{waves:o.a},components:{Pagination:r.a},data:function(){var t=this,e=/^[a-z0-9]+$/i;return{indexMethod:c.c,passwordDia:!1,uploadDia:!1,groupDig:!1,userId:"",ruleForm:{password1:"",password2:""},fileList:[],roleList:[],matchList:[],ids:[],listTotal:0,listPage:1,listQuery:{offset:0,limit:this.$store.state.config.row,status:"",usergroup_id:"",search:""},headers:{"X-CSRF-Token":u.a.get("X-CSRF-Token")},rules:{password1:[{required:!0,validator:function(s,a,i){""===a?i(new Error("请输入密码")):e.test(a)?(""!==t.ruleForm.password2&&t.$refs.ruleForm.validateField("password2"),i()):i(new Error("密码只能包含大小写字母和数字"))},trigger:"blur"},{min:6,max:20,message:"长度在 6 到 10 个字，支持大小写英文字母、数字、符号",trigger:"blur"}],password2:[{required:!0,validator:function(s,a,i){""===a?i(new Error("请再次输入密码")):e.test(a)?a!==t.ruleForm.password1?i(new Error("两次输入密码不一致!")):i():i(new Error("密码只能包含大小写字母和数字"))},trigger:"blur"},{min:6,max:20,message:"长度在 6 到 10 个字，支持大小写英文字母、数字、符号",trigger:"blur"}]},errList:[],isAllPassword:!1}},created:function(){this.getList(),this.getGroups()},methods:{clearPassword:function(){this.ruleForm.password1="",this.ruleForm.password2="",this.$refs.ruleForm.clearValidate()},allPassword:function(){0!==this.ids.length&&(this.isAllPassword=!0)},uploadSectionFile:function(t){var e=this,s=t.file,a=new FormData;a.append("file",s),this.axios({url:"/api/v1/common/admin/users/uploads",method:"post",data:a,headers:this.headers}).then(function(t){t.data.success?(e.$message.success("上传成功"),e.uploadDia=!1,e.getList()):e.errList=t.data.message_zh})},editPassword:function(t){this.userId=t.id,this.passwordDia=!0},submitPassword:function(){var t=this;Object(n.h)(this.userId,this.ruleForm).then(function(e){e.data.success&&(t.getList(),t.passwordDia=!1,t.$message.success("操作成功"))})},submitAllPassword:function(){var t=this,e=JSON.parse(i()(this.ruleForm));e.user_ids=this.ids,Object(n.g)(e).then(function(e){e.data.success&&(t.getList(),t.isAllPassword=!1,t.$message.success("操作成功"))})},closeUpload:function(){this.fileList=[],this.errList=[]},beforeAvatarUpload:function(t){var e=t.name.substr(t.name.lastIndexOf(".")).includes("xls"),s=t.size/1024/1024<2;return e||this.$message.error("文件只能是excel格式"),s||this.$message.error("文件大小不能超过 2MB!"),e&&s},showTalking:function(t){this.talkDia=!0,this.introduction=t},getGroups:function(){var t=this;Object(n.m)().then(function(e){t.roleList=e.data})},removeSub:function(){var t=this,e={};e.ids=this.ids,this.ids.length<=0||this.$confirm("确定要删除吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(n.e)(e).then(function(e){e.data.success&&(t.$message.success("操作成功"),t.getList(1))})}).catch(function(){t.$message({type:"info",message:"已取消删除"})})},blackUser:function(t){var e=this,s={};s.ids=this.ids,s.status=t,Object(n.c)(s).then(function(t){t.data.success&&(e.$message.success("操作成功"),e.getList())})},addTopic:function(){this.$router.push({path:"/account/user/addUser"})},editTopic:function(t){this.$router.push({path:"/account/user/editUser",query:{user_id:t}})},getList:function(t){var e=this;1===t&&(this.listPage=t),this.listQuery.offset=this.listPage,Object(n.l)(this.listQuery).then(function(t){var s=t.data;e.matchList=s.rows,e.listTotal=s.total})},checkTable:function(t){this.ids=t.map(function(t){return t.id})}}},m=(s("4tVt"),s("Xqzx"),s("ZrdR")),p=Object(m.a)(d,function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"app-container"},[s("div",{staticClass:"filter-container"},[s("el-select",{staticClass:"filter-item",attrs:{clearable:"",size:"mini",placeholder:"请选择账户状态"},model:{value:t.listQuery.status,callback:function(e){t.$set(t.listQuery,"status",e)},expression:"listQuery.status"}},[s("el-option",{attrs:{value:2,label:"禁用"}}),t._v(" "),s("el-option",{attrs:{value:1,label:"正常"}})],1),t._v(" "),s("el-input",{staticClass:"filter-item",staticStyle:{width:"200px"},attrs:{placeholder:"请输入账号或名称",size:"mini"},model:{value:t.listQuery.search,callback:function(e){t.$set(t.listQuery,"search","string"==typeof e?e.trim():e)},expression:"listQuery.search"}}),t._v(" "),s("el-button",{directives:[{name:"waves",rawName:"v-waves"}],staticClass:"filter-item",attrs:{type:"primary",size:"mini"},on:{click:function(e){t.getList(1)}}},[t._v("搜索\n    ")])],1),t._v(" "),s("div",{staticClass:"filter-container"},[s("el-button",{attrs:{type:"success",size:"mini"},on:{click:t.addTopic}},[t._v(" 新增")]),t._v(" "),s("el-button",{attrs:{type:"danger",size:"mini"},on:{click:t.removeSub}},[t._v(" 删除")]),t._v(" "),s("el-button",{attrs:{type:"success",size:"mini"},on:{click:function(e){t.blackUser(1)}}},[t._v(" 恢复")]),t._v(" "),s("el-button",{attrs:{type:"danger",size:"mini"},on:{click:function(e){t.blackUser(2)}}},[t._v(" 禁用")]),t._v(" "),s("div",{staticClass:"fr"},[s("el-button",{attrs:{type:"danger",size:"mini"},on:{click:t.allPassword}},[t._v(" 批量重置密码")]),t._v(" "),s("el-button",{attrs:{type:"success",size:"mini"},on:{click:function(e){t.uploadDia=!0}}},[t._v(" 批量导入")]),t._v("\n       \n      "),s("a",{attrs:{href:"/api/v1/common/admin/users/uploads",download:""}},[s("el-button",{attrs:{type:"warning",size:"mini"}},[t._v(" 下载模板")])],1)],1)],1),t._v(" "),s("div",{staticClass:"filter-container"},[s("el-table",{attrs:{data:t.matchList,border:""},on:{"selection-change":t.checkTable}},[s("el-table-column",{attrs:{align:"center",type:"selection"}}),t._v(" "),s("el-table-column",{attrs:{align:"center",prop:"name",label:"序号",width:"50"},scopedSlots:t._u([{key:"default",fn:function(e){return[s("span",[t._v(t._s(t.indexMethod(t.listQuery.offset,t.listQuery.limit,e.$index)))])]}}])}),t._v(" "),s("el-table-column",{attrs:{align:"center",prop:"username",label:"账号"}}),t._v(" "),s("el-table-column",{attrs:{align:"center",prop:"nickname",label:"昵称"}}),t._v(" "),s("el-table-column",{attrs:{align:"center",prop:"role_name",label:"角色"}}),t._v(" "),s("el-table-column",{attrs:{align:"center",prop:"sex",label:"账号状态"},scopedSlots:t._u([{key:"default",fn:function(e){return[1==e.row.status?s("span",[t._v("正常")]):t._e(),t._v(" "),2==e.row.status?s("span",[t._v("禁用")]):t._e()]}}])}),t._v(" "),s("el-table-column",{attrs:{align:"center",width:"180px",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[s("el-button",{attrs:{size:"mini",type:"success"},on:{click:function(s){t.editTopic(e.row.id)}}},[t._v("编辑\n          ")]),t._v(" "),s("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(s){t.editPassword(e.row)}}},[t._v("重置密码\n          ")])]}}])})],1)],1),t._v(" "),s("pagination",{directives:[{name:"show",rawName:"v-show",value:t.listTotal>0,expression:"listTotal>0"}],attrs:{total:t.listTotal,page:t.listPage,limit:t.listQuery.limit},on:{"update:page":function(e){t.listPage=e},"update:limit":function(e){t.$set(t.listQuery,"limit",e)},pagination:t.getList}}),t._v(" "),s("el-dialog",{staticClass:"addsub",attrs:{visible:t.passwordDia,title:"重置密码",width:"900px"},on:{"update:visible":function(e){t.passwordDia=e},close:t.clearPassword}},[s("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:t.ruleForm,rules:t.rules,"label-width":"100px"}},[s("el-form-item",{attrs:{label:"密码",prop:"password1"}},[s("el-input",{attrs:{type:"password"},model:{value:t.ruleForm.password1,callback:function(e){t.$set(t.ruleForm,"password1","string"==typeof e?e.trim():e)},expression:"ruleForm.password1"}})],1),t._v(" "),s("el-form-item",{attrs:{label:"确认密码",prop:"password2"}},[s("el-input",{attrs:{type:"password"},model:{value:t.ruleForm.password2,callback:function(e){t.$set(t.ruleForm,"password2","string"==typeof e?e.trim():e)},expression:"ruleForm.password2"}})],1)],1),t._v(" "),s("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[s("el-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{type:"primary"},on:{click:t.submitPassword}},[t._v("保存")]),t._v(" "),s("el-button",{directives:[{name:"waves",rawName:"v-waves"}],on:{click:function(e){t.passwordDia=!1}}},[t._v("取消")])],1)],1),t._v(" "),s("el-dialog",{staticClass:"addsub",attrs:{visible:t.isAllPassword,title:"批量重置密码",width:"900px"},on:{"update:visible":function(e){t.isAllPassword=e},close:t.clearPassword}},[s("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:t.ruleForm,rules:t.rules,"label-width":"100px"}},[s("el-form-item",{attrs:{label:"密码",prop:"password1"}},[s("el-input",{attrs:{type:"password"},model:{value:t.ruleForm.password1,callback:function(e){t.$set(t.ruleForm,"password1","string"==typeof e?e.trim():e)},expression:"ruleForm.password1"}})],1),t._v(" "),s("el-form-item",{attrs:{label:"确认密码",prop:"password2"}},[s("el-input",{attrs:{type:"password"},model:{value:t.ruleForm.password2,callback:function(e){t.$set(t.ruleForm,"password2","string"==typeof e?e.trim():e)},expression:"ruleForm.password2"}})],1)],1),t._v(" "),s("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[s("el-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{type:"primary"},on:{click:t.submitAllPassword}},[t._v("保存")]),t._v(" "),s("el-button",{directives:[{name:"waves",rawName:"v-waves"}],on:{click:function(e){t.isAllPassword=!1}}},[t._v("取消")])],1)],1),t._v(" "),s("el-dialog",{staticClass:"addsub",attrs:{visible:t.uploadDia,title:"批量导入",width:"400px"},on:{"update:visible":function(e){t.uploadDia=e},close:t.closeUpload}},[s("div",[s("el-upload",{ref:"upload",staticClass:"upload-demo",attrs:{"before-upload":t.beforeAvatarUpload,"http-request":t.uploadSectionFile,"file-list":t.fileList,action:""}},[s("el-button",{attrs:{slot:"trigger",size:"small",type:"primary"},slot:"trigger"},[t._v("选取文件")]),t._v(" "),s("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[t._v("只能上传excel文件，且不超过2MB")])],1),t._v(" "),s("div",t._l(t.errList,function(e){return s("p",{staticStyle:{color:"red",margin:"5px"}},[t._v(t._s(e))])}))],1)])],1)},[],!1,null,"24e872fa",null);p.options.__file="index.vue";e.default=p.exports},QswK:function(t,e,s){},VyMG:function(t,e,s){"use strict";s.d(e,"m",function(){return i}),s.d(e,"l",function(){return r}),s.d(e,"e",function(){return o}),s.d(e,"f",function(){return n}),s.d(e,"b",function(){return l}),s.d(e,"o",function(){return u}),s.d(e,"c",function(){return c}),s.d(e,"j",function(){return d}),s.d(e,"h",function(){return m}),s.d(e,"g",function(){return p}),s.d(e,"k",function(){return f}),s.d(e,"d",function(){return v}),s.d(e,"n",function(){return h}),s.d(e,"a",function(){return w}),s.d(e,"p",function(){return b}),s.d(e,"i",function(){return g});var a=s("t3Un");function i(){return Object(a.a)({url:"/api/v1/common/admin/users/roles",method:"get"})}function r(t){return Object(a.a)({url:"/api/v1/common/admin/users",method:"get",params:t})}function o(t){return Object(a.a)({url:"/api/v1/common/admin/users/batch_destroy",method:"delete",data:t})}function n(t){return Object(a.a)({url:"/api/v1/common/admin/delete_user_logo/",method:"post",data:t})}function l(t){return Object(a.a)({url:"/api/v1/common/admin/users",method:"post",data:t})}function u(t){return Object(a.a)({url:"/api/v1/common/admin/users/"+t,method:"get"})}function c(t){return Object(a.a)({url:"/api/v1/common/admin/users/operating",method:"patch",data:t})}function d(t,e){return Object(a.a)({url:"/api/v1/common/admin/users/"+t,method:"patch",data:e})}function m(t,e){return Object(a.a)({url:"/api/v1/common/admin/users/reset_password/"+t,method:"patch",data:e})}function p(t){return Object(a.a)({url:"/api/v1/common/admin/users/reset_password",method:"patch",data:t})}function f(t){return Object(a.a)({url:"/api/v1/common/admin/teams",method:"get",params:t})}function v(t){return Object(a.a)({url:"/api/v1/common/admin/teams/batch_destroy",method:"delete",data:t})}function h(t){return Object(a.a)({url:"/api/v1/common/admin/teams/"+t+"/users",method:"get"})}function w(t){return Object(a.a)({url:"/api/v1/common/admin/teams",method:"post",data:t})}function b(t){return Object(a.a)({url:"/api/v1/common/admin/teams/"+t,method:"get"})}function g(t,e){return Object(a.a)({url:"/api/v1/common/admin/teams/"+t,method:"patch",data:e})}},Xqzx:function(t,e,s){"use strict";var a=s("hqWi");s.n(a).a},Y5bG:function(t,e,s){"use strict";s.d(e,"a",function(){return i}),Math.easeInOutQuad=function(t,e,s,a){return(t/=a/2)<1?s/2*t*t+e:-s/2*(--t*(t-2)-1)+e};var a=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)};function i(t,e,s){var i=document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop,r=t-i,o=0;e=void 0===e?500:e;!function t(){o+=20,function(t){document.documentElement.scrollTop=t,document.body.parentNode.scrollTop=t,document.body.scrollTop=t}(Math.easeInOutQuad(o,i,r,e)),o<e?a(t):s&&"function"==typeof s&&s()}()}},ZySA:function(t,e,s){"use strict";var a=s("6ZY3"),i=s.n(a),r=(s("jUE0"),{bind:function(t,e){t.addEventListener("click",function(s){var a=i()({},e.value),r=i()({ele:t,type:"hit",color:"rgba(0, 0, 0, 0.15)"},a),o=r.ele;if(o){o.style.position="relative",o.style.overflow="hidden";var n=o.getBoundingClientRect(),l=o.querySelector(".waves-ripple");switch(l?l.className="waves-ripple":((l=document.createElement("span")).className="waves-ripple",l.style.height=l.style.width=Math.max(n.width,n.height)+"px",o.appendChild(l)),r.type){case"center":l.style.top=n.height/2-l.offsetHeight/2+"px",l.style.left=n.width/2-l.offsetWidth/2+"px";break;default:l.style.top=(s.pageY-n.top-l.offsetHeight/2-document.documentElement.scrollTop||document.body.scrollTop)+"px",l.style.left=(s.pageX-n.left-l.offsetWidth/2-document.documentElement.scrollLeft||document.body.scrollLeft)+"px"}return l.style.backgroundColor=r.color,l.className="waves-ripple z-active",!1}},!1)}}),o=function(t){t.directive("waves",r)};window.Vue&&(window.waves=r,Vue.use(o)),r.install=o;e.a=r},aFNf:function(t,e,s){var a=s("c01Q"),i=a.JSON||(a.JSON={stringify:JSON.stringify});t.exports=function(t){return i.stringify.apply(i,arguments)}},hqWi:function(t,e,s){},jUE0:function(t,e,s){},omC7:function(t,e,s){t.exports={default:s("aFNf"),__esModule:!0}}}]);