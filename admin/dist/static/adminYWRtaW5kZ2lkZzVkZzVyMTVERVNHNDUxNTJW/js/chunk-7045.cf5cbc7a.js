(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-7045"],{EjZP:function(e,t,r){},LNYj:function(e,t,r){"use strict";var n=r("EjZP");r.n(n).a},SArH:function(e,t,r){"use strict";r.d(t,"E",function(){return a}),r.d(t,"o",function(){return i}),r.d(t,"H",function(){return o}),r.d(t,"c",function(){return u}),r.d(t,"G",function(){return s}),r.d(t,"b",function(){return c}),r.d(t,"F",function(){return l}),r.d(t,"q",function(){return d}),r.d(t,"u",function(){return m}),r.d(t,"C",function(){return p}),r.d(t,"p",function(){return f}),r.d(t,"s",function(){return v}),r.d(t,"x",function(){return h}),r.d(t,"f",function(){return b}),r.d(t,"t",function(){return g}),r.d(t,"k",function(){return w}),r.d(t,"A",function(){return _}),r.d(t,"y",function(){return j}),r.d(t,"l",function(){return O}),r.d(t,"h",function(){return F}),r.d(t,"e",function(){return y}),r.d(t,"r",function(){return k}),r.d(t,"I",function(){return x}),r.d(t,"w",function(){return $}),r.d(t,"M",function(){return E}),r.d(t,"d",function(){return L}),r.d(t,"v",function(){return U}),r.d(t,"j",function(){return q}),r.d(t,"J",function(){return C}),r.d(t,"n",function(){return I}),r.d(t,"z",function(){return B}),r.d(t,"g",function(){return M}),r.d(t,"D",function(){return A}),r.d(t,"i",function(){return N}),r.d(t,"m",function(){return Z}),r.d(t,"a",function(){return z}),r.d(t,"L",function(){return G}),r.d(t,"B",function(){return H}),r.d(t,"K",function(){return S});var n=r("t3Un");function a(e,t){return Object(n.a)({method:"get",url:"/api/v1/rw/admin/evts/"+e+"/challenges/verification",params:t})}function i(e,t){return Object(n.a)({method:"get",url:"/api/v1/rw/admin/evts/"+e+"/challenges/prompt",params:t})}function o(e,t){return Object(n.a)({method:"post",url:"/api/v1/rw/admin/evts/"+e+"/challenges/verification",data:t})}function u(e,t){return Object(n.a)({method:"patch",url:"/api/v1/rw/admin/evts/"+e+"/submit_validation/"+t})}function s(e,t){return Object(n.a)({method:"get",url:"/api/v1/rw/admin/evts/"+e+"/challenge_logs",params:t})}function c(e,t){return Object(n.a)({method:"get",url:"/api/v1/rw/admin/evts/"+e+"/challenges/verification/logs",params:t})}function l(e,t,r){return Object(n.a)({method:"get",url:"/api/v1/rw/admin/evts/"+e+"/submit_manage/"+t,params:r})}function d(e,t){return Object(n.a)({method:"get",url:"/api/v1/rw/admin/evts/"+e+"/scores/teams",params:t})}function m(e,t){return Object(n.a)({method:"get",url:"/api/v1/rw/admin/evts/"+e+"/challenges/verification/teams",params:t})}function p(e,t){return Object(n.a)({method:"post",url:"/api/v1/rw/admin/evts/"+e+"/scores/reward",data:t})}function f(e,t){return Object(n.a)({method:"get",url:"/api/web/evts/"+e+"/scoreboard/tasks",params:t})}function v(e,t){return Object(n.a)({method:"get",url:"/api/v1/rw/admin/evts/"+e+"/answers",params:t})}function h(e){return Object(n.a)({method:"post",url:"/api/env/"+e,data:{task_hash:e}})}function b(e){return Object(n.a)({url:"/api/env/"+e,method:"delete"})}function g(e){return Object(n.a)({method:"get",url:"/api/env/"+e})}function w(e){return Object(n.a)({url:"/api/v1/rw/admin/evts",method:"get",params:e})}function _(e){return Object(n.a)({url:"/api/v1/rw/admin/evts/batch_destroy",method:"delete",data:e})}function j(e){return Object(n.a)({url:"/api/v1/rw/admin/evts/batch_public",method:"patch",data:e})}function O(e){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e,method:"get"})}function F(e,t){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e,method:"patch",data:t})}function y(e){return Object(n.a)({url:"/api/v1/rw/admin/evts",method:"post",data:e})}function k(e){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/teams",method:"get"})}function x(e,t){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/teams",method:"post",data:t})}function $(e){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/state",method:"get"})}function E(e,t){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/state",method:"patch",data:t})}function L(e){return Object(n.a)({url:"/api/v1/rw/admin/evts/clear_event/"+e,method:"post"})}function U(e,t){return Object(n.a)({url:"/api/v1/rw/admin/evts/event/"+e+"/init_scene",method:"patch"})}function q(e,t){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+t+"/tasks/imports",method:"get",params:e})}function C(e,t){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/tasks",method:"post",data:t})}function I(e,t){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/tasks",method:"get",params:t})}function B(e,t){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/tasks/batch_public",method:"patch",data:t})}function M(e,t){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/tasks/batch_destroy",method:"delete",data:t})}function A(e,t){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/tasks/"+t,method:"get"})}function N(e,t,r){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/tasks/"+t,method:"patch",data:r})}function Z(e,t){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/notices",method:"get",params:t})}function z(e,t){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/notices",method:"post",data:t})}function G(e,t,r){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/notices/"+t,method:"patch",data:r})}function H(e,t){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/notices/batch_destroy",method:"delete",data:t})}function S(e,t){return Object(n.a)({url:"/api/v1/rw/admin/evts/"+e+"/notices/batch_top",method:"patch",data:t})}},VyMG:function(e,t,r){"use strict";r.d(t,"m",function(){return a}),r.d(t,"l",function(){return i}),r.d(t,"e",function(){return o}),r.d(t,"f",function(){return u}),r.d(t,"b",function(){return s}),r.d(t,"o",function(){return c}),r.d(t,"c",function(){return l}),r.d(t,"j",function(){return d}),r.d(t,"h",function(){return m}),r.d(t,"g",function(){return p}),r.d(t,"k",function(){return f}),r.d(t,"d",function(){return v}),r.d(t,"n",function(){return h}),r.d(t,"a",function(){return b}),r.d(t,"p",function(){return g}),r.d(t,"i",function(){return w});var n=r("t3Un");function a(){return Object(n.a)({url:"/api/v1/common/admin/users/roles",method:"get"})}function i(e){return Object(n.a)({url:"/api/v1/common/admin/users",method:"get",params:e})}function o(e){return Object(n.a)({url:"/api/v1/common/admin/users/batch_destroy",method:"delete",data:e})}function u(e){return Object(n.a)({url:"/api/v1/common/admin/delete_user_logo/",method:"post",data:e})}function s(e){return Object(n.a)({url:"/api/v1/common/admin/users",method:"post",data:e})}function c(e){return Object(n.a)({url:"/api/v1/common/admin/users/"+e,method:"get"})}function l(e){return Object(n.a)({url:"/api/v1/common/admin/users/operating",method:"patch",data:e})}function d(e,t){return Object(n.a)({url:"/api/v1/common/admin/users/"+e,method:"patch",data:t})}function m(e,t){return Object(n.a)({url:"/api/v1/common/admin/users/reset_password/"+e,method:"patch",data:t})}function p(e){return Object(n.a)({url:"/api/v1/common/admin/users/reset_password",method:"patch",data:e})}function f(e){return Object(n.a)({url:"/api/v1/common/admin/teams",method:"get",params:e})}function v(e){return Object(n.a)({url:"/api/v1/common/admin/teams/batch_destroy",method:"delete",data:e})}function h(e){return Object(n.a)({url:"/api/v1/common/admin/teams/"+e+"/users",method:"get"})}function b(e){return Object(n.a)({url:"/api/v1/common/admin/teams",method:"post",data:e})}function g(e){return Object(n.a)({url:"/api/v1/common/admin/teams/"+e,method:"get"})}function w(e,t){return Object(n.a)({url:"/api/v1/common/admin/teams/"+e,method:"patch",data:t})}},ZySA:function(e,t,r){"use strict";var n=r("6ZY3"),a=r.n(n),i=(r("jUE0"),{bind:function(e,t){e.addEventListener("click",function(r){var n=a()({},t.value),i=a()({ele:e,type:"hit",color:"rgba(0, 0, 0, 0.15)"},n),o=i.ele;if(o){o.style.position="relative",o.style.overflow="hidden";var u=o.getBoundingClientRect(),s=o.querySelector(".waves-ripple");switch(s?s.className="waves-ripple":((s=document.createElement("span")).className="waves-ripple",s.style.height=s.style.width=Math.max(u.width,u.height)+"px",o.appendChild(s)),i.type){case"center":s.style.top=u.height/2-s.offsetHeight/2+"px",s.style.left=u.width/2-s.offsetWidth/2+"px";break;default:s.style.top=(r.pageY-u.top-s.offsetHeight/2-document.documentElement.scrollTop||document.body.scrollTop)+"px",s.style.left=(r.pageX-u.left-s.offsetWidth/2-document.documentElement.scrollLeft||document.body.scrollLeft)+"px"}return s.style.backgroundColor=i.color,s.className="waves-ripple z-active",!1}},!1)}}),o=function(e){e.directive("waves",i)};window.Vue&&(window.waves=i,Vue.use(o)),i.install=o;t.a=i},jUE0:function(e,t,r){},"q/ps":function(e,t,r){"use strict";r.r(t);var n=r("ZySA"),a=r("VyMG"),i=r("SArH"),o=r("tBjE"),u={name:"Index",directives:{waves:n.a},components:{UploadFile:o.a},data:function(){var e=this,t=/^[a-z0-9]+$/i;return{matchList:[],roleList:[],teamList:[],user_id:this.$route.query.user_id,ruleForm:{username:"",password1:"",password2:"",nickname:"",role:"",event_id:"",team_id:"",phone:"",identity_number:"",email:"",expire_time:"",logo:""},rules:{role:[{required:!0,message:"请选择角色",trigger:"change"}],usergroup_id:[{required:!0,message:"请选择用户分组",trigger:"change"}],username:[{required:!0,message:"请输入用户名",trigger:"blur"},{min:1,max:20,message:"长度在 1 到 20 个字",trigger:"blur"}],password1:[{required:!0,validator:function(r,n,a){""===n?a(new Error("请输入密码")):t.test(n)?(""!==e.ruleForm.password2&&e.$refs.ruleForm.validateField("password2"),a()):a(new Error("密码只能包含大小写字母和数字"))},trigger:"blur"},{min:6,max:20,message:"长度在 6 到 10 个字，支持大小写英文字母、数字",trigger:"blur"}],password2:[{required:!0,validator:function(r,n,a){""===n?a(new Error("请再次输入密码")):t.test(n)?n!==e.ruleForm.password1?a(new Error("两次输入密码不一致!")):a():a(new Error("密码只能包含大小写字母和数字"))},trigger:"blur"},{min:6,max:20,message:"长度在 6 到 10 个字，支持大小写英文字母、数字",trigger:"blur"}],nickname:[{required:!0,message:"请输入昵称",trigger:"blur"},{min:1,max:20,message:"长度在 1 到 20 个字",trigger:"blur"}]},imgUrl:{logo:""}}},created:function(){this.getInfo(),this.getMatch(),this.user_id&&this.getUserInfo()},methods:{deleteImg:function(e){var t=this;this.$confirm("此操作会删除服务器中的图片，确定要删除吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(a.f)({field:e,user_id:t.user_id}).then(function(r){r.data.success&&(t.$message.success("删除成功"),t.ruleForm[e]="")})}).catch(function(){t.$message({type:"info",message:"已取消删除"})})},clearImg:function(e){this.imgUrl[e]="",this.$refs[e].value=""},handleImage:function(e){var t=this,r=this.$refs[e].files[0];if(r){var n=new FileReader;n.readAsDataURL(r),n.onload=function(r){t.imgUrl[e]=n.result}}else this.imgUrl[e]=""},getMatch:function(){var e=this;Object(i.k)().then(function(t){e.matchList=t.data.rows})},getUserInfo:function(){var e=this;Object(a.o)(this.user_id).then(function(t){for(var r in e.ruleForm)e.ruleForm[r]=t.data[r]})},goBack:function(){this.$router.push("/account/user/index")},getInfo:function(){var e=this;Object(a.m)().then(function(t){e.roleList=t.data}),Object(a.k)().then(function(t){e.teamList=t.data.rows})},submitForm:function(){var e=this,t=new FormData,r=this.ruleForm;for(var n in this.user_id&&(delete r.password1,delete r.password2),r)t.append(n,r[n]);this.$refs.ruleForm.validate(function(r){if(!r)return!1;e.user_id?Object(a.j)(e.user_id,t).then(function(t){t.data.success&&e.$router.push("/account/user/index")}):Object(a.b)(t).then(function(t){t.data.success&&e.$router.push("/account/user/index")})})}}},s=(r("LNYj"),r("ZrdR")),c=Object(s.a)(u,function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"app-container create_match"},[r("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"100px"}},[r("el-form-item",{attrs:{label:"账号",prop:"username"}},[r("el-input",{attrs:{disabled:Boolean(e.user_id),placeholder:"请输入账号"},model:{value:e.ruleForm.username,callback:function(t){e.$set(e.ruleForm,"username","string"==typeof t?t.trim():t)},expression:"ruleForm.username"}})],1),e._v(" "),e.user_id?e._e():r("el-form-item",{attrs:{label:"密码",prop:"password1"}},[r("el-input",{attrs:{type:"password",placeholder:"请输入密码"},model:{value:e.ruleForm.password1,callback:function(t){e.$set(e.ruleForm,"password1","string"==typeof t?t.trim():t)},expression:"ruleForm.password1"}})],1),e._v(" "),e.user_id?e._e():r("el-form-item",{attrs:{label:"确认密码",prop:"password2"}},[r("el-input",{attrs:{type:"password",placeholder:"请再次输入密码"},model:{value:e.ruleForm.password2,callback:function(t){e.$set(e.ruleForm,"password2","string"==typeof t?t.trim():t)},expression:"ruleForm.password2"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"昵称",prop:"nickname"}},[r("el-input",{attrs:{placeholder:"请输入昵称"},model:{value:e.ruleForm.nickname,callback:function(t){e.$set(e.ruleForm,"nickname","string"==typeof t?t.trim():t)},expression:"ruleForm.nickname"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"角色",prop:"role"}},[r("el-select",{staticClass:"filter-item",attrs:{disabled:1===e.ruleForm.role,placeholder:"请选择角色"},model:{value:e.ruleForm.role,callback:function(t){e.$set(e.ruleForm,"role",t)},expression:"ruleForm.role"}},[e.user_id&&1==e.ruleForm.role?r("el-option",{attrs:{value:1,label:"admin"}}):e._e(),e._v(" "),e._l(e.roleList,function(t,n){return 1!==t.id?r("el-option",{key:n,attrs:{label:t.name,value:t.id}}):e._e()})],2)],1),e._v(" "),3==e.ruleForm.role?r("el-form-item",{attrs:{label:"关联赛事"}},[r("el-select",{staticClass:"filter-item",attrs:{placeholder:"请选择赛事名称"},model:{value:e.ruleForm.event_id,callback:function(t){e.$set(e.ruleForm,"event_id",t)},expression:"ruleForm.event_id"}},e._l(e.matchList,function(e,t){return r("el-option",{key:t,attrs:{label:e.name_zh,value:e.id}})}))],1):e._e(),e._v(" "),r("el-form-item",{attrs:{label:"战队"}},[r("el-select",{staticClass:"filter-item",attrs:{placeholder:"请选择战队"},model:{value:e.ruleForm.team_id,callback:function(t){e.$set(e.ruleForm,"team_id",t)},expression:"ruleForm.team_id"}},e._l(e.teamList,function(e,t){return r("el-option",{key:t,attrs:{label:e.name,value:e.id}})}))],1),e._v(" "),r("el-form-item",{attrs:{label:"手机号"}},[r("el-input",{attrs:{placeholder:"请输入手机号"},model:{value:e.ruleForm.phone,callback:function(t){e.$set(e.ruleForm,"phone","string"==typeof t?t.trim():t)},expression:"ruleForm.phone"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"身份证"}},[r("el-input",{attrs:{placeholder:"请输入身份证"},model:{value:e.ruleForm.identity_number,callback:function(t){e.$set(e.ruleForm,"identity_number","string"==typeof t?t.trim():t)},expression:"ruleForm.identity_number"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"邮箱"}},[r("el-input",{attrs:{placeholder:"请输入邮箱"},model:{value:e.ruleForm.email,callback:function(t){e.$set(e.ruleForm,"email","string"==typeof t?t.trim():t)},expression:"ruleForm.email"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"用户头像"}},[r("UploadFile",{attrs:{file:e.ruleForm.logo,"list-type":"picture-card","file-size":2097152,"file-type":["png","jpg"]},on:{"update:file":function(t){e.$set(e.ruleForm,"logo",t)}}}),e._v("\n      （请上传PNG、JPG格式文件，大小不超过2M）\n    ")],1),e._v(" "),r("el-form-item",[r("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("保存")]),e._v(" "),r("el-button",{attrs:{type:"warning"},on:{click:e.goBack}},[e._v("返回")])],1)],1)],1)},[],!1,null,"6bd49c22",null);c.options.__file="index.vue";t.default=c.exports}}]);