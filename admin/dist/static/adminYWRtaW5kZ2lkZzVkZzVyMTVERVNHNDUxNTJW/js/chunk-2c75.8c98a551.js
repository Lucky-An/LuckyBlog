(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2c75"],{"6tn2":function(t,e,i){},"A1/j":function(t,e,i){"use strict";var n=i("ZhNK");i.n(n).a},CXmP:function(t,e,i){},Er5H:function(t,e,i){"use strict";var n=i("CXmP");i.n(n).a},ZhNK:function(t,e,i){},c11S:function(t,e,i){"use strict";var n=i("fN6i");i.n(n).a},fN6i:function(t,e,i){},nJPA:function(t,e,i){"use strict";var n=i("6tn2");i.n(n).a},ntYl:function(t,e,i){"use strict";i.r(e);var n=i("ETGp"),s={name:"ImgCode",props:[],data:function(){return{uidImg:"",uuid:""}},created:function(){this.initUUid()},mounted:function(){},methods:{S4:function(){return(65536*(1+Math.random())|0).toString(16).substring(1)},guid:function(){return this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4()},initUUid:function(){var t=this;this.axios.get("/api/v1/common/web/auth/image_code?image_code_id="+this.guid()).then(function(e){t.uidImg="/api/v1/common/web/auth/image_code?image_code_id="+t.guid(),t.$emit("changeCode",{img_auth_code:t.uidImg.split("image_code_id=")[1]})}).catch(function(t){})},getImgCode:function(){this.$emit("sendImgCode",{img_code:this.uuid,img_auth_code:this.uidImg.split("image_code_id=")[1]})}}},a=(i("rQyL"),i("ZrdR")),o=Object(a.a)(s,function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticStyle:{"text-align":"left",cursor:"pointer"}},[i("img",{staticClass:"mrg10L",attrs:{src:t.uidImg,alt:"",height:"40"},on:{click:function(e){t.initUUid()}}})])},[],!1,null,null,null);o.options.__file="index.vue";var r=o.exports,c={name:"SocialSignin",methods:{wechatHandleClick:function(t){alert("ok")},tencentHandleClick:function(t){alert("ok")}}},l=(i("nJPA"),Object(a.a)(c,function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"social-signup-container"},[i("div",{staticClass:"sign-btn",on:{click:function(e){t.wechatHandleClick("wechat")}}},[i("span",{staticClass:"wx-svg-container"},[i("svg-icon",{staticClass:"icon",attrs:{"icon-class":"wechat"}})],1),t._v(" 微信\n  ")]),t._v(" "),i("div",{staticClass:"sign-btn",on:{click:function(e){t.tencentHandleClick("tencent")}}},[i("span",{staticClass:"qq-svg-container"},[i("svg-icon",{staticClass:"icon",attrs:{"icon-class":"qq"}})],1),t._v(" QQ\n  ")])])},[],!1,null,"c60bf9a6",null));l.options.__file="socialsignin.vue";var u=l.exports,d=i("fe1z"),m=(i("X4fA"),{name:"Login",components:{LangSelect:n.a,SocialSign:u,imgCode:r},data:function(){return{loginForm:{username:"",password:"",image_code_id:"",image_code:""},loginRules:{username:[{required:!0,trigger:"blur",validator:function(t,e,i){e.length<1?i(new Error("请输入账号")):i()}}],password:[{required:!0,trigger:"blur",validator:function(t,e,i){e.length<1?i(new Error("请输入密码")):i()}}],image_code:[{required:!0,trigger:"blur",validator:function(t,e,i){0==e.length?i(new Error("请输入验证码")):i()}}]},passwordType:"password",loading:!1,showDialog:!1,redirect:void 0,isPermit:null,params:{auth_secret_key:""},filename:""}},watch:{$route:{handler:function(t){this.redirect=t.query&&t.query.redirect},immediate:!0}},created:function(){var t=this;Object(d.a)(),document.onkeydown=function(e){13==window.event.keyCode&&t.handleLogin()},this.getPermit()},destroyed:function(){},methods:{closePermit:function(){this.$refs.permit.value="",this.filename=""},changeFile:function(){var t=this.$refs.permit.files;t.length>0?this.filename=t[0].name:this.filename=""},getPermit:function(){var t=this;Object(d.c)().then(function(e){var i=e.data;t.isPermit=i.success,t.params.auth_secret_key=i.auth_secret_key})},uploadPermit:function(){var t=this,e=this.$refs.permit.files;if(0!==e.length)if(e[0].size>10485760)this.$message.error("许可文件大小不能超过10M");else{var i=new FormData;i.append("authed_license_zip",e[0]),Object(d.h)(i,this.params).then(function(e){e.data.success&&t.updatePermit()})}else this.$message.error("请选择文件")},updatePermit:function(){var t=this;Object(d.g)(this.params).then(function(e){e.data.success&&(t.isPermit=!0,t.showDialog=!1,t.$message.success("授权成功"))})},changeCode:function(t){this.loginForm.image_code_id=t.img_auth_code},showPwd:function(){"password"===this.passwordType?this.passwordType="":this.passwordType="password"},handleLogin:function(){var t=this;this.$refs.imgCode.initUUid(),this.$refs.loginForm.validate(function(e){if(!e)return!1;t.loading=!0,t.$store.dispatch("LoginByUsername",t.loginForm).then(function(){t.loading=!1,t.$router.push({path:"/"})}).catch(function(e){t.loading=!1})})},afterQRScan:function(){}}}),g=(i("c11S"),i("Er5H"),i("A1/j"),Object(a.a)(m,function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"login-container"},[t.isPermit?i("div",{staticClass:"login_box"},[i("el-form",{ref:"loginForm",staticClass:"login-form",attrs:{model:t.loginForm,rules:t.loginRules,"auto-complete":"on","label-position":"left"}},[i("div",{staticClass:"title-container"},[i("h3",{staticClass:"title"},[t._v("后台管理登录")])]),t._v(" "),i("el-form-item",{attrs:{prop:"username"}},[i("span",{staticClass:"svg-container"},[i("svg-icon",{attrs:{"icon-class":"user"}})],1),t._v(" "),i("el-input",{attrs:{placeholder:t.$t("login.username"),name:"username",type:"text","auto-complete":"on"},model:{value:t.loginForm.username,callback:function(e){t.$set(t.loginForm,"username","string"==typeof e?e.trim():e)},expression:"loginForm.username"}})],1),t._v(" "),i("el-form-item",{attrs:{prop:"password"}},[i("span",{staticClass:"svg-container"},[i("svg-icon",{attrs:{"icon-class":"password"}})],1),t._v(" "),i("el-input",{attrs:{type:t.passwordType,placeholder:t.$t("login.password"),name:"password","auto-complete":"on"},nativeOn:{keyup:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?t.handleLogin(e):null}},model:{value:t.loginForm.password,callback:function(e){t.$set(t.loginForm,"password","string"==typeof e?e.trim():e)},expression:"loginForm.password"}}),t._v(" "),i("span",{staticClass:"show-pwd",on:{click:t.showPwd}},[i("svg-icon",{attrs:{"icon-class":"eye"}})],1)],1),t._v(" "),i("el-form-item",{staticClass:"code",attrs:{prop:"image_code"}},[i("span",{staticClass:"svg-container"},[i("svg-icon",{attrs:{"icon-class":"icon"}})],1),t._v(" "),i("el-input",{attrs:{placeholder:"验证码",name:"username",type:"text","auto-complete":"on"},model:{value:t.loginForm.image_code,callback:function(e){t.$set(t.loginForm,"image_code","string"==typeof e?e.trim():e)},expression:"loginForm.image_code"}})],1),t._v(" "),i("imgCode",{ref:"imgCode",staticClass:"code_box",on:{changeCode:t.changeCode}}),t._v(" "),i("el-button",{staticStyle:{width:"100%",margin:"50px 0 30px 0"},attrs:{loading:t.loading,type:"primary"},nativeOn:{click:function(e){return e.preventDefault(),t.handleLogin(e)}}},[t._v("立即登录\n      ")])],1)],1):t._e(),t._v(" "),!1===t.isPermit?i("div",{staticClass:"permit"},[i("h3",{staticClass:"per_title"},[t._v("\n      产品许可导入\n    ")]),t._v(" "),i("p",[t._v("\n      检测到当前许可为不可用状态，请使用下列申请码申请许可，获取平台使用权限\n    ")]),t._v(" "),i("p",[t._v("\n      产品名称：赛宁网络安全攻防实战平台\n    ")]),t._v(" "),i("div",{staticClass:"btn_box"},[i("a",{staticStyle:{"margin-right":"20px"},attrs:{href:"/api/v1/download/license/?auth_secret_key="+t.params.auth_secret_key,download:""}},[i("el-button",{attrs:{type:"primary"}},[t._v("下载申请码")])],1),t._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:function(e){t.showDialog=!0}}},[t._v("上传许可")])],1)]):t._e(),t._v(" "),i("el-dialog",{staticClass:"upladPermit",attrs:{"close-on-click-modal":!1,visible:t.showDialog,title:"上传许可",center:""},on:{"update:visible":function(e){t.showDialog=e},close:t.closePermit}},[t.filename?i("p",{staticClass:"filename"},[t._v("已选文件名称："+t._s(t.filename))]):t._e(),t._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("span",{staticClass:"upload_box"},[i("input",{ref:"permit",attrs:{type:"file"},on:{change:t.changeFile}}),t._v(" "),i("el-button",{attrs:{type:"primary"}},[t._v("选择许可文件")])],1),t._v(" "),i("el-button",{attrs:{type:"success"},on:{click:t.uploadPermit}},[t._v("上传到服务器")])],1)])],1)},[],!1,null,"755edb85",null));g.options.__file="index.vue";e.default=g.exports},rQyL:function(t,e,i){"use strict";var n=i("sQnT");i.n(n).a},sQnT:function(t,e,i){}}]);