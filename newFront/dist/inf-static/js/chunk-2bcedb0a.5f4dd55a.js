(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2bcedb0a"],{"0d7a":function(t,e,i){"use strict";var s=i("b2a2"),n=i("8a1c"),o=i("857c"),a=i("2732"),r=i("ef4c"),l=i("38eb"),c=i("d88d"),u=i("59da"),d=i("5139"),g=i("efe2"),m=[].push,f=Math.min,p=4294967295,_=!g((function(){return!RegExp(p,"y")}));s("split",2,(function(t,e,i){var s;return s="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(t,i){var s=String(a(this)),o=void 0===i?p:i>>>0;if(0===o)return[];if(void 0===t)return[s];if(!n(t))return e.call(s,t,o);var r,l,c,u=[],g=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),f=0,_=new RegExp(t.source,g+"g");while(r=d.call(_,s)){if(l=_.lastIndex,l>f&&(u.push(s.slice(f,r.index)),r.length>1&&r.index<s.length&&m.apply(u,r.slice(1)),c=r[0].length,f=l,u.length>=o))break;_.lastIndex===r.index&&_.lastIndex++}return f===s.length?!c&&_.test("")||u.push(""):u.push(s.slice(f)),u.length>o?u.slice(0,o):u}:"0".split(void 0,0).length?function(t,i){return void 0===t&&0===i?[]:e.call(this,t,i)}:e,[function(e,i){var n=a(this),o=void 0==e?void 0:e[t];return void 0!==o?o.call(e,n,i):s.call(String(n),e,i)},function(t,n){var a=i(s,t,this,n,s!==e);if(a.done)return a.value;var d=o(t),g=String(this),m=r(d,RegExp),h=d.unicode,v=(d.ignoreCase?"i":"")+(d.multiline?"m":"")+(d.unicode?"u":"")+(_?"y":"g"),b=new m(_?d:"^(?:"+d.source+")",v),x=void 0===n?p:n>>>0;if(0===x)return[];if(0===g.length)return null===u(b,g)?[g]:[];var y=0,w=0,C=[];while(w<g.length){b.lastIndex=_?w:0;var S,F=u(b,_?g:g.slice(w));if(null===F||(S=f(c(b.lastIndex+(_?0:w)),g.length))===y)w=l(g,w,h);else{if(C.push(g.slice(y,w)),C.length===x)return C;for(var k=1;k<=F.length-1;k++)if(C.push(F[k]),C.length===x)return C;w=y=S}}return C.push(g.slice(y)),C}]}),!_)},"1c2e":function(t,e,i){"use strict";var s=i("1944"),n=i("857c"),o=i("efe2"),a=i("99ad"),r="toString",l=RegExp.prototype,c=l[r],u=o((function(){return"/a/b"!=c.call({source:"a",flags:"b"})})),d=c.name!=r;(u||d)&&s(RegExp.prototype,r,(function(){var t=n(this),e=String(t.source),i=t.flags,s=String(void 0===i&&t instanceof RegExp&&!("flags"in l)?a.call(t):i);return"/"+e+"/"+s}),{unsafe:!0})},"3e6b":function(t,e,i){},4887:function(t,e,i){},5752:function(t,e,i){"use strict";var s=i("4887"),n=i.n(s);n.a},"6a0b":function(t,e,i){t.exports=i.p+"inf-static/media/59.e5c26b58.mp4"},"9ed6":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"ad_login"}},[s("div",{staticStyle:{position:"fixed",top:"20px",right:"30px","z-index":"1882"}},[s("switchLanguage")],1),t.system_config.background_logo?s("div",{staticClass:"sys_bg",style:{backgroundImage:"url("+t.system_config.background_logo+")"}}):t._e(),t.system_config.background_logo?t._e():s("span",[t.isIe?s("span",{staticClass:"sys_bg png_bg"}):s("span",[s("video",{staticStyle:{width:"100%",height:"100%","object-fit":"fill",position:"absolute",left:"0",top:"0","z-index":"0"},attrs:{autoplay:"",muted:"",loop:"loop"},domProps:{muted:!0}},[s("source",{attrs:{src:i("6a0b")}})]),t.system_config.background_logo?t._e():s("span",{staticClass:"video_bg"})])]),s("div",{staticClass:"ad5_head",staticStyle:{position:"relative","z-index":"1"}},[s("span",{staticClass:"center_logo"},[t.system_config.login_logo?s("img",{staticStyle:{"max-width":"410px","max-height":"90px"},attrs:{src:t.system_config.login_logo,alt:""}}):t._e()])]),s("div",{staticClass:"login_main"},[s("div",{staticClass:"clearfix",class:{middleY:!t.system_config.banner_logo},staticStyle:{"text-align":"center"}},[t.system_config.banner_logo?s("img",{staticClass:"banner_logo",attrs:{src:t.system_config.banner_logo,alt:""}}):t._e(),s("div",{staticClass:"main_box is_ad_main"},[s("div",{staticClass:"from_group"},[s("el-form",{ref:"ruleForm",staticClass:"loginForm",attrs:{model:t.ruleForm,rules:t.rules}},[s("el-form-item",{attrs:{prop:"username"}},[s("el-input",{attrs:{placeholder:t.$t("login.userName")},model:{value:t.ruleForm.username,callback:function(e){t.$set(t.ruleForm,"username",e)},expression:"ruleForm.username"}},[s("span",{staticClass:"el-input__icon icon_box",attrs:{slot:"prefix"},slot:"prefix"},[s("i",{staticClass:"login_user"})])])],1),s("el-form-item",{attrs:{prop:"password"}},[s("el-input",{attrs:{placeholder:t.$t("login.passPlace"),type:"password",autocomplete:"off"},model:{value:t.ruleForm.password,callback:function(e){t.$set(t.ruleForm,"password",e)},expression:"ruleForm.password"}},[s("span",{staticClass:"el-input__icon icon_box",attrs:{slot:"prefix"},slot:"prefix"},[s("i",{staticClass:"login_lock"})])])],1),s("el-form-item",{attrs:{prop:"image_code"}},[s("el-input",{staticClass:"change_width",staticStyle:{float:"left"},attrs:{placeholder:t.$t("login.codePlace")},model:{value:t.ruleForm.image_code,callback:function(e){t.$set(t.ruleForm,"image_code",e)},expression:"ruleForm.image_code"}},[s("span",{staticClass:"el-input__icon icon_box",attrs:{slot:"prefix"},slot:"prefix"},[s("i",{staticClass:"login_code"})])]),s("div",{staticClass:"code_box"},[s("imgCode",{ref:"imgCode",model:{value:t.ruleForm.image_code_id,callback:function(e){t.$set(t.ruleForm,"image_code_id",e)},expression:"ruleForm.image_code_id"}})],1)],1),s("el-form-item",[s("div",{staticClass:"submitBtn fs18 tcenter",on:{click:t.submitForm}},[t._v(" "+t._s(t.$t("login.now"))+" ")])])],1)],1),t.system_config.download_file?s("div",{staticClass:"download fr ellipsis",staticStyle:{color:"#3074fd"}},[s("a",{attrs:{href:t.system_config.download_file,title:t.system_config.link_description,download:""}},[t._v(" "+t._s(t.system_config.link_description||"建议下载最新版谷歌浏览器登录本系统")+" ")])]):t._e()])])]),t.system_config.support_company_logo?s("img",{staticClass:"gongsi_wei",attrs:{src:t.system_config.support_company_logo,alt:""}}):t._e(),t.isIe?s("span",{staticStyle:{position:"absolute",right:"15px",bottom:"15px",color:"gray"}},[t._v("温馨提示：为了您有更好的体验，请使用非IE内核浏览器")]):t._e(),s("div",{staticClass:"ad5_foot"},[s("span",{staticClass:"banben"},[t._v(t._s(t.system_config.login_description))])])])},n=[],o=(i("ecb4"),i("7ded"),function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticStyle:{width:"100%",height:"100%",cursor:"pointer"}},[i("img",{staticStyle:{width:"100%",height:"100%"},attrs:{src:t.uidImg,alt:""},on:{click:function(e){return t.initUUid()}}})])}),a=[],r=(i("e18c"),i("e35a"),i("1c2e"),i("0d7a"),{name:"ImgCode",model:{prop:"image_code_id",event:"update"},props:{image_code_id:{type:String,default:""}},data:function(){return{uidImg:"",uuid:""}},created:function(){this.initUUid()},mounted:function(){},methods:{clearUUid:function(){this.uuid=""},S4:function(){return(65536*(1+Math.random())|0).toString(16).substring(1)},guid:function(){return this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4()},initUUid:function(){this.uidImg="/api/v1/common/web/auth/image_code?image_code_id="+this.guid(),this.$emit("update",this.uidImg.split("image_code_id=")[1])}}}),l=r,c=i("9ca4"),u=Object(c["a"])(l,o,a,!1,null,null,null),d=u.exports,g=i("fd8a"),m=i("8c92"),f=i.n(m),p={name:"Login",components:{imgCode:d,switchLanguage:g["a"]},data:function(){return{bannerUrl:"/static/img/g2.jpg",ruleForm:{username:"",password:"",image_code:"",image_code_id:""},rules:{username:[{required:!0,message:this.$t("login.userName"),trigger:"blur"}],password:[{required:!0,message:this.$t("login.passPlace"),trigger:"blur"}],image_code:[{required:!0,message:this.$t("login.codePlace"),trigger:"blur"}]},system_config:{},isIe:!1}},created:function(){var t=this;this.getLogin(),this.isIE(),document.onkeydown=function(e){var i=window.event.keyCode;13==i&&t.submitForm()}},methods:{getLogin:function(){var t=this;this.$store.dispatch("config/getLogin").then((function(e){t.system_config=e}))},submitForm:function(t){var e=this;this.$refs["ruleForm"].validate((function(t){if(!t)return!1;e.$store.dispatch("user/login",e.ruleForm).then((function(t){if(t.data.success){var i=t.data.user_data.user.username;console.log("username: ",i),f.a.set("xid",i,{expires:365}),e.$router.push({path:"/"})}e.$refs.imgCode.initUUid()}))}))},isIE:function(){var t=this,e=function(){var t=window.navigator.userAgent,e=function(e){return t.indexOf(e)>=0},i=function(){return"ActiveXObject"in window}();return e("MSIE")||i?"ie":e("Firefox")&&!i?"Firefox":e("Chrome")&&!i?t.indexOf("Edge")>-1?"Edge":"Chrome":e("Opera")&&!i?"Opera":e("Safari")&&!i?"Safari":void 0}();"ie"==e&&(t.isIe=!0),"Edge"==e&&(t.isIe=!0)}}},_=p,h=(i("5752"),i("dd37"),i("b0f3"),Object(c["a"])(_,s,n,!1,null,"66ced1a7",null));e["default"]=h.exports},b0f3:function(t,e,i){"use strict";var s=i("3e6b"),n=i.n(s);n.a},d6c9:function(t,e,i){},dd37:function(t,e,i){"use strict";var s=i("d6c9"),n=i.n(s);n.a}}]);