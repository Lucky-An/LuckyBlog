(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-b062"],{"Jpd/":function(t,e,n){"use strict";var r=n("Klbr");n.n(r).a},Klbr:function(t,e,n){},aFx9:function(t,e,n){"use strict";n.d(e,"i",function(){return o}),n.d(e,"a",function(){return i}),n.d(e,"l",function(){return a}),n.d(e,"d",function(){return u}),n.d(e,"e",function(){return c}),n.d(e,"j",function(){return m}),n.d(e,"n",function(){return d}),n.d(e,"c",function(){return l}),n.d(e,"h",function(){return s}),n.d(e,"g",function(){return f}),n.d(e,"k",function(){return p}),n.d(e,"b",function(){return h}),n.d(e,"f",function(){return b}),n.d(e,"m",function(){return v});var r=n("t3Un");function o(t){return Object(r.a)({url:"/api/v1/common/admin/compose_file",method:"get",params:t})}function i(t){return Object(r.a)({url:"/api/v1/common/admin/compose_file",method:"post",data:t})}function a(t){return Object(r.a)({url:"/api/v1/common/admin/compose_file",method:"delete",data:t})}function u(t){return Object(r.a)({url:"/api/v1/common/admin/compose_file/"+t,method:"get"})}function c(t,e){return Object(r.a)({url:"/api/v1/common/admin/compose_file/"+t,method:"patch",data:e})}function m(t){return Object(r.a)({url:"/api/v1/common/admin/entity/group",method:"get",params:t})}function d(t){return Object(r.a)({url:"/api/v1/common/admin/entity/group",method:"delete",data:t})}function l(t){return Object(r.a)({url:"/api/v1/common/admin/entity/group",method:"post",data:t})}function s(t){return Object(r.a)({url:"/api/v1/common/admin/entity/group/"+t,method:"get"})}function f(t,e){return Object(r.a)({url:"/api/v1/common/admin/entity/group/"+t,method:"patch",data:e})}function p(t){return Object(r.a)({url:"/api/v1/common/admin/entity",method:"get",params:t})}function h(t){return Object(r.a)({url:"/api/v1/common/admin/entity",method:"post",data:t})}function b(t,e){return Object(r.a)({url:"/api/v1/common/admin/entity/"+t,method:"patch",data:e})}function v(t){return Object(r.a)({url:"/api/v1/common/admin/entity",method:"delete",data:t})}},dYV3:function(t,e,n){"use strict";n.r(e);var r=n("aFx9"),o={data:function(){return{id:this.$route.query.id,ruleForm:{name:"",content:""},rules:{name:[{required:!0,message:"请输入设备组名称",trigger:"blur"},{min:1,max:64,message:"长度在 1 到 64个字符",trigger:"blur"}],content:[{required:!0,message:"请输入设备组描述",trigger:"blur"},{min:1,max:256,message:"长度在 2 到 256个字符",trigger:"blur"}]}}},created:function(){this.id&&this.entityInfo()},methods:{entityInfo:function(){var t=this;Object(r.h)(this.id).then(function(e){var n=e.data.data;for(var r in t.ruleForm)t.ruleForm[r]=n[r]})},goBack:function(){history.back()},submitForm:function(t){var e=this;this.$refs.ruleForm.validate(function(t){if(!t)return!1;e.id?Object(r.g)(e.id,e.ruleForm).then(function(t){t.data.success&&e.$router.push("/image/entity")}):Object(r.c)(e.ruleForm).then(function(t){t.data.success&&e.$router.push("/image/entity")})})}}},i=(n("Jpd/"),n("ZrdR")),a=Object(i.a)(o,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"app-container addEntity"},[n("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:t.ruleForm,rules:t.rules,"label-width":"200px"}},[n("el-form-item",{attrs:{label:"设备组名称",prop:"name"}},[n("el-input",{attrs:{placeholder:"请输入设备组名称"},model:{value:t.ruleForm.name,callback:function(e){t.$set(t.ruleForm,"name","string"==typeof e?e.trim():e)},expression:"ruleForm.name"}})],1),t._v(" "),n("el-form-item",{attrs:{label:"设备组描述",prop:"content"}},[n("el-input",{attrs:{rows:8,type:"textarea",placeholder:"请输入设备组描述"},model:{value:t.ruleForm.content,callback:function(e){t.$set(t.ruleForm,"content",e)},expression:"ruleForm.content"}})],1),t._v(" "),n("el-form-item",[n("el-button",{attrs:{type:"primary"},on:{click:t.submitForm}},[t._v("保存")]),t._v(" "),n("el-button",{attrs:{type:"warning"},on:{click:t.goBack}},[t._v("返回")])],1)],1)],1)},[],!1,null,null,null);a.options.__file="index.vue";e.default=a.exports}}]);