(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-45d71d0e"],{9501:function(e,t,o){},"9e95":function(e,t,o){"use strict";o.r(t);var s=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"personal_box"},[e.to_personal_edit?o("div",{staticClass:"content"},[o("div",{staticClass:"left"},[o("div",{staticClass:"img_box fcenter ",on:{click:function(t){e.logoVisible=!0}}},[o("img",{attrs:{src:e.personform.logo,alt:""}}),o("span",[e._v(e._s(e.$t("ad5.personal.changeLogo")))])]),o("el-button",{staticStyle:{margin:"10px auto"},attrs:{type:"primary"},on:{click:function(t){e.passWordVisible=!0}}},[e._v(e._s(e.$t("personal.changePassword"))+" ")])],1),o("div",{staticClass:"right"},[o("el-form",{ref:"ruleForm",attrs:{rules:e.rules,model:e.edit_personform,"label-width":"180px"}},[o("el-form-item",{attrs:{label:e.$t("ad5.personal.account")+"："}},[o("el-input",{attrs:{disabled:!0},model:{value:e.edit_personform.username,callback:function(t){e.$set(e.edit_personform,"username",t)},expression:"edit_personform.username"}})],1),o("el-form-item",{attrs:{label:e.$t("ad5.personal.role")+"："}},[o("el-input",{attrs:{disabled:!0},model:{value:e.edit_personform.role,callback:function(t){e.$set(e.edit_personform,"role",t)},expression:"edit_personform.role"}})],1),o("el-form-item",{attrs:{label:e.$t("ad5.personal.nikeName")+"："}},[o("el-input",{model:{value:e.edit_personform.nickname,callback:function(t){e.$set(e.edit_personform,"nickname",t)},expression:"edit_personform.nickname"}})],1),o("el-form-item",{attrs:{label:e.$t("ad5.personal.phone")+"："}},[o("el-input",{model:{value:e.edit_personform.phone,callback:function(t){e.$set(e.edit_personform,"phone",t)},expression:"edit_personform.phone"}})],1),o("el-form-item",{attrs:{label:e.$t("ad5.personal.idNumber")+"："}},[o("el-input",{model:{value:e.edit_personform.identity_number,callback:function(t){e.$set(e.edit_personform,"identity_number",t)},expression:"edit_personform.identity_number"}})],1),o("el-form-item",{attrs:{label:e.$t("ad5.personal.email")+"："}},[o("el-input",{model:{value:e.edit_personform.email,callback:function(t){e.$set(e.edit_personform,"email",t)},expression:"edit_personform.email"}})],1),o("el-form-item",{attrs:{label:e.$t("ad5.personal.short_introduce")+"："}},[o("el-input",{attrs:{type:"textarea"},model:{value:e.edit_personform.introduction,callback:function(t){e.$set(e.edit_personform,"introduction",t)},expression:"edit_personform.introduction"}})],1),o("el-form-item",[o("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.submitForm("ruleForm")}}},[e._v(e._s(e.$t("modal.submit")))]),o("el-button",{staticClass:"cancel_btn",on:{click:function(t){return e.cancel_edit()}}},[e._v(e._s(e.$t("modal.cancel")))])],1)],1)],1)]):o("div",[o("div",{staticClass:"look clearfix"},["Admin"!==e.personform.role?o("el-button",{staticClass:"fr",attrs:{type:"primary"},on:{click:function(t){e.to_personal_edit=!0}}},[e._v("编辑")]):e._e()],1),o("div",{staticClass:"content"},[o("div",{staticClass:"left"},[o("div",{staticClass:"img_box"},[o("img",{attrs:{src:e.personform.logo,alt:""}})])]),o("div",{staticClass:"right"},[o("p",[o("span",{staticClass:"label_left"},[e._v(e._s(e.$t("ad5.personal.account"))+"：")]),o("span",[e._v(e._s(e.personform.username?e.personform.username:e.$t("task.none")))])]),o("p",[o("span",{staticClass:"label_left"},[e._v(e._s(e.$t("ad5.personal.role"))+"：")]),o("span",[e._v(e._s(e.personform.role?e.personform.role:e.$t("task.none")))])]),o("p",[o("span",{staticClass:"label_left"},[e._v(e._s(e.$t("ad5.personal.nikeName"))+"：")]),o("span",[e._v(e._s(e.personform.nickname?e.personform.nickname:e.$t("task.none")))])]),o("p",[o("span",{staticClass:"label_left"},[e._v(e._s(e.$t("ad5.personal.phone"))+"：")]),o("span",[e._v(e._s(e.personform.phone?e.personform.phone:e.$t("task.none")))])]),o("p",[o("span",{staticClass:"label_left"},[e._v(e._s(e.$t("ad5.personal.idNumber"))+"：")]),o("span",[e._v(e._s(e.personform.identity_number?e.personform.identity_number:e.$t("task.none")))])]),o("p",[o("span",{staticClass:"label_left"},[e._v(e._s(e.$t("ad5.personal.email"))+"：")]),o("span",[e._v(e._s(e.personform.email?e.personform.email:e.$t("task.none")))])]),o("p",[o("span",{staticClass:"label_left"},[e._v(e._s(e.$t("ad5.personal.short_introduce"))+"：")]),o("span",[e._v(e._s(e.personform.introduction?e.personform.introduction:e.$t("task.none")))])])])])]),o("el-dialog",{staticClass:"my-dialog",attrs:{title:e.$t("ad5.personal.changeLogo"),width:"650px",visible:e.logoVisible},on:{"update:visible":function(t){e.logoVisible=t}}},[o("el-upload",{ref:"upload",staticClass:"avatar-uploader",attrs:{action:"customize","http-request":e.uploadLogo,"on-change":e.changefile,accept:"image/jpeg,image/png",multiple:!1,"file-list":e.fileList,"auto-upload":!1,"show-file-list":!1,"before-upload":e.beforeAvatarUpload}},[e.imageUrl?o("img",{staticClass:"avatar",attrs:{src:e.imageUrl}}):o("i",{staticClass:"el-icon-plus avatar-uploader-icon"})]),o("div",{staticStyle:{"text-align":"center",color:"#a4a8b3"}},[e._v(" "+e._s(e.$t("ad5.personal.logo_accept"))+"，"+e._s(e.$t("validateImg.md_size"))+" ")]),o("div",{staticClass:"submit_handle"}),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.submitUpload()}}},[e._v(e._s(e.$t("question.submit")))]),o("el-button",{staticClass:"cancel_btn",on:{click:function(t){return e.cancel_change_logo()}}},[e._v(e._s(e.$t("modal.cancel")))])],1)],1),o("el-dialog",{staticClass:"my-dialog changePass",attrs:{title:e.$t("ad5.personal.changePass"),width:"650px",visible:e.passWordVisible},on:{"update:visible":function(t){e.passWordVisible=t}}},[o("el-form",{ref:"passWordForm",staticClass:"demo-ruleForm",attrs:{model:e.passWordForm,"status-icon":"",rules:e.passWordrules,"label-width":"190px"}},[o("el-form-item",{attrs:{label:e.$t("ad5.personal.oldPass")+"：",prop:"password"}},[o("el-input",{attrs:{type:"password"},model:{value:e.passWordForm.password,callback:function(t){e.$set(e.passWordForm,"password",t)},expression:"passWordForm.password"}})],1),o("el-form-item",{attrs:{label:e.$t("ad5.personal.newPass")+"：",prop:"password1"}},[o("el-input",{attrs:{type:"password",autocomplete:"off"},model:{value:e.passWordForm.password1,callback:function(t){e.$set(e.passWordForm,"password1",t)},expression:"passWordForm.password1"}})],1),o("el-form-item",{attrs:{label:e.$t("ad5.personal.againPass")+"：",prop:"password2"}},[o("el-input",{attrs:{type:"password",autocomplete:"off"},model:{value:e.passWordForm.password2,callback:function(t){e.$set(e.passWordForm,"password2",t)},expression:"passWordForm.password2"}})],1),o("span",{staticStyle:{"margin-left":"180px",color:"#fff"}},[e._v(e._s(e.$t("ad5.personal.pass_info")))])],1),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.submitPassWordForm("passWordForm")}}},[e._v(e._s(e.$t("question.submit")))]),o("el-button",{staticClass:"cancel_btn",on:{click:function(t){e.passWordVisible=!1}}},[e._v(e._s(e.$t("modal.cancel")))])],1)],1)],1)},r=[],a=(o("e18c"),o("96db"),o("af86"),o("f1a9"),o("c5c2")),n={name:"Index",inject:["reload"],data:function(){var e=this,t=function(e,t,o){if(!t)return o(new Error("旧密码不能为空"));setTimeout((function(){o()}),1e3)},o=function(t,o,s){""===o?s(new Error("请输入密码")):e.passWordForm.password1.length<6||e.passWordForm.password1.length>20?s(new Error("密码长度在6-20之间")):(""!==e.passWordForm.password2&&e.$refs.passWordForm.validateField("password2"),s())},s=function(t,o,s){""===o?s(new Error("请再次输入密码")):e.passWordForm.password2.length<6||e.passWordForm.password2.length>20?s(new Error("密码长度在6-20之间")):o!==e.passWordForm.password1?s(new Error("两次输入密码不一致!")):s()};return{passWordForm:{password1:"",password2:"",password:""},passWordrules:{password1:[{validator:o,trigger:"blur"}],password2:[{validator:s,trigger:"blur"}],password:[{validator:t,trigger:"blur"}]},personform:{email:null,expire_time:"",identity_number:"",introduction:"",logo:"",nickname:"",phone:"",role:"",usergroup_id:"",usergroup_name:"",username:""},edit_personform:{},rules:{nickname:[{required:!0,message:this.$t("selfHelp_competition.enter_cont"),trigger:"blur"}],email:[{required:!0,message:this.$t("selfHelp_competition.enter_cont"),trigger:"blur"}],phone:[{required:!0,message:this.$t("selfHelp_competition.enter_cont"),trigger:"blur"}],short_introduce:[{required:!0,message:this.$t("selfHelp_competition.enter_cont"),trigger:"blur"}]},fileList:[],to_personal_edit:!1,logoVisible:!1,passWordVisible:!1,imageUrl:""}},created:function(){this.personalCenter()},methods:{cancel_change_logo:function(){this.logoVisible=!1,this.fileList=[]},changefile:function(e,t){this.$refs.upload.uploadFiles=[this.$refs.upload.uploadFiles[this.$refs.upload.uploadFiles.length-1]];var o=this,s=s||window.event,r=(e=s.target.files[0],new FileReader);r.onload=function(e){o.imageUrl=e.target.result},r.readAsDataURL(e)},submitUpload:function(){this.$refs.upload.submit()},uploadLogo:function(e){var t=this,o=e.file,s=new FormData;s.append("logo",o),Object(a["a"])(s).then((function(e){e.data.success&&(t.$notify.success({title:t.$t("dialog_list.tips"),message:t.$t("select_address.success")}),t.logoVisible=!1,t.fileList=[],t.personform.logo=e.data.logo,t.imageUrl=e.data.logo)}))},handleAvatarSuccess:function(e,t){this.imageUrl=URL.createObjectURL(t.raw)},beforeAvatarUpload:function(e){var t=!1;"image/jpeg"!==e.type&&"image/png"!==e.type||(t=!0);var o=e.size/1024/1024<2;return t||this.$notify.error({customClass:"error_notify",title:this.$t("public.error"),message:this.$t("ad5.personal.logo_accept")}),o||this.$notify.error({customClass:"error_notify",title:this.$t("public.error"),message:this.$t("validateImg.size")}),t&&o},cancel_edit:function(){this.to_personal_edit=!1,this.edit_personform=JSON.parse(JSON.stringify(this.personform))},diffDevinfo:function(){var e={};for(var t in this.personform)this.personform[t]!=this.edit_personform[t]&&(e[t]=this.edit_personform[t]);return e},submitForm:function(e){var t=this;this.$refs[e].validate((function(e){if(!e)return!1;var o=t.diffDevinfo(),s=new FormData;for(var r in o)s.append(r,o[r]);Object(a["e"])(s).then((function(e){e.data.success&&(t.to_personal_edit=!0,t.personform=JSON.parse(JSON.stringify(t.edit_personform)),t.$notify.success({title:t.$t("dialog_list.tips"),message:t.$t("select_address.success")}),t.reload())}))}))},submitPassWordForm:function(e){var t=this;this.$refs[e].validate((function(e){if(!e)return console.log("error submit!!"),!1;Object(a["b"])(t.passWordForm).then((function(e){e.data.success&&(t.$notify.success({title:t.$t("dialog_list.tips"),message:t.$t("select_address.success")}),t.passWordVisible=!1,t.$router.push({path:"/login"}))}))}))},personalCenter:function(){var e=this;Object(a["l"])().then((function(t){for(var o in e.personform)e.personform[o]=t.data[o];e.edit_personform=JSON.parse(JSON.stringify(t.data))}))}}},i=n,l=(o("e9eb"),o("b399"),o("9ca4")),p=Object(l["a"])(i,s,r,!1,null,"63223f5b",null);t["default"]=p.exports},b399:function(e,t,o){"use strict";var s=o("e724"),r=o.n(s);r.a},c5c2:function(e,t,o){"use strict";o.d(t,"h",(function(){return r})),o.d(t,"d",(function(){return a})),o.d(t,"j",(function(){return n})),o.d(t,"i",(function(){return i})),o.d(t,"f",(function(){return l})),o.d(t,"g",(function(){return p})),o.d(t,"k",(function(){return c})),o.d(t,"l",(function(){return d})),o.d(t,"e",(function(){return u})),o.d(t,"a",(function(){return m})),o.d(t,"b",(function(){return f})),o.d(t,"c",(function(){return _}));var s=o("b775");function r(e){return Object(s["a"])({url:"/api/v1/common/web/evts/list",method:"get",params:e})}function a(e,t,o,r){return Object(s["a"])({url:e,method:t,params:o,data:r})}function n(e){return Object(s["a"])({url:"/api/v1/common/web/tool_tag/",method:"get"})}function i(e){return Object(s["a"])({url:"/api/v1/common/web/tools/",method:"get",params:e})}function l(e){return Object(s["a"])({url:"/api/v1/common/web/tools/"+e,method:"get"})}function p(e){return Object(s["a"])({url:"/api/v1/common/web/evts/ranks",method:"get"})}function c(e){return Object(s["a"])({url:"/api/v1/common/web/onlook/look_match/look/",method:"get"})}function d(){return Object(s["a"])({url:"/api/v1/common/web/personal/center",method:"get"})}function u(e){return Object(s["a"])({url:"/api/v1/common/web/personal/info",method:"post",data:e})}function m(e){return Object(s["a"])({url:"/api/v1/common/web/personal/logo",method:"patch",data:e})}function f(e){return Object(s["a"])({url:"/api/v1/common/web/personal/paword",method:"patch",data:e})}function _(e){return Object(s["a"])({url:"/api/v1/jeopardy/web/sfzb",method:"get",params:e})}},e724:function(e,t,o){},e9eb:function(e,t,o){"use strict";var s=o("9501"),r=o.n(s);r.a}}]);