(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2e6e"],{Vllx:function(e,t,r){"use strict";r.r(t);var o=r("was3"),l=r("tBjE"),a={components:{QuillEditor:r("uTCP").a,UploadFile:l.a},data:function(){return{id:this.$route.query.id,tagList:[],system:[],ruleForm:{name:"",edition:"",language:"",system_type:0,charge:"",label:"",status:0,logo:"",describe:"",describe_html:"",route:""},rules:{name:[{required:!0,message:"请输入工具名称",trigger:"blur"}],edition:[{required:!0,message:"请输入版本号",trigger:"blur"}],describe_html:[{required:!0,message:"请输入工具描述",trigger:"blur"}],language:[{required:!0,message:"请选择支持平台",trigger:"change"}],charge:[{required:!0,message:"请选择收费模式",trigger:"change"}],label:[{required:!0,message:"请选择软件分类，如果没有软件分类，请先在列表页创建",trigger:"change"}],status:[{required:!0,message:"是否公开",trigger:"change"}]}}},created:function(){this.getToolTag(),this.getSystem(),this.id&&this.getInfo()},methods:{goBack:function(){history.back()},getToolTag:function(){var e=this;Object(o.g)().then(function(t){e.tagList=t.data.rows})},getSystem:function(){var e=this;Object(o.f)().then(function(t){e.system=t.data.platform})},getInfo:function(){var e=this,t={id:this.id};Object(o.e)(t).then(function(t){for(var r in e.ruleForm)e.ruleForm[r]=t.data[r]})},onSubmit:function(){var e=this,t=new FormData;if(this.ruleForm.route)if(this.ruleForm.logo){for(var r in this.ruleForm)t.append(r,this.ruleForm[r]);var l="/tool/tool";if(this.id){var a={id:this.id};Object(o.c)(a,t).then(function(t){t.data.success&&e.$router.push({path:l})}).catch(function(t){e.$message.error(t.response.data.message_zh)})}else Object(o.a)(t).then(function(t){t.data.success&&e.$router.push({path:l})})}else this.$message.error("请上传封面");else this.$message.error("请上传工具包")},submitForm:function(){var e=this;this.$refs.ruleForm.validate(function(t){if(!t)return e.$message.error("请核验所输入的信息"),!1;e.onSubmit()})},resetForm:function(){this.$refs.ruleForm.resetFields()}}},i=(r("nzjd"),r("ZrdR")),n=Object(i.a)(a,function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"app-container create_tool"},[r("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"200px"}},[r("el-form-item",{attrs:{label:"工具名称",prop:"name"}},[r("el-input",{attrs:{placeholder:"请输入工具名称"},model:{value:e.ruleForm.name,callback:function(t){e.$set(e.ruleForm,"name","string"==typeof t?t.trim():t)},expression:"ruleForm.name"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"版本号",prop:"edition"}},[r("el-input",{attrs:{placeholder:"请输入版本号"},model:{value:e.ruleForm.edition,callback:function(t){e.$set(e.ruleForm,"edition","string"==typeof t?t.trim():t)},expression:"ruleForm.edition"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"语言支持",prop:"language"}},[r("el-select",{staticClass:"filter-item",attrs:{size:"mini",placeholder:"请选择语言支持"},model:{value:e.ruleForm.language,callback:function(t){e.$set(e.ruleForm,"language","string"==typeof t?t.trim():t)},expression:"ruleForm.language"}},[r("el-option",{attrs:{value:0,label:"中文"}}),e._v(" "),r("el-option",{attrs:{value:1,label:"其他"}})],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"平台类型"}},[r("el-select",{staticClass:"filter-item",attrs:{size:"mini",placeholder:"请选择语言支持"},model:{value:e.ruleForm.system_type,callback:function(t){e.$set(e.ruleForm,"system_type","string"==typeof t?t.trim():t)},expression:"ruleForm.system_type"}},e._l(e.system,function(e,t){return r("el-option",{key:t,attrs:{label:e.label,value:e.id}})}))],1),e._v(" "),r("el-form-item",{attrs:{label:"收费模式",prop:"charge"}},[r("el-select",{staticClass:"filter-item",attrs:{size:"mini",placeholder:"请选择收费模式"},model:{value:e.ruleForm.charge,callback:function(t){e.$set(e.ruleForm,"charge",t)},expression:"ruleForm.charge"}},[r("el-option",{attrs:{value:0,label:"免费"}}),e._v(" "),r("el-option",{attrs:{value:1,label:"付费"}})],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"工具分类",prop:"label"}},[r("el-select",{staticClass:"filter-item",attrs:{size:"mini",placeholder:"请选择工具分类"},model:{value:e.ruleForm.label,callback:function(t){e.$set(e.ruleForm,"label",t)},expression:"ruleForm.label"}},e._l(e.tagList,function(e,t){return r("el-option",{key:t,attrs:{label:e.label,value:e.id}})}))],1),e._v(" "),r("el-form-item",{attrs:{label:"公开/隐藏",prop:"status"}},[r("el-select",{staticClass:"filter-item",attrs:{size:"mini"},model:{value:e.ruleForm.status,callback:function(t){e.$set(e.ruleForm,"status",t)},expression:"ruleForm.status"}},[r("el-option",{attrs:{value:0,label:"隐藏"}}),e._v(" "),r("el-option",{attrs:{value:1,label:"公开"}})],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"工具封面",required:""}},[r("UploadFile",{attrs:{file:e.ruleForm.logo,"file-type":["jpg","png"],"list-type":"picture-card","file-size":2097152},on:{"update:file":function(t){e.$set(e.ruleForm,"logo",t)}}}),e._v("\n      （请上传PNG、JPG格式文件，大小不超过2M,"),r("b",[e._v("推荐大小 240*140")]),e._v("）\n    ")],1),e._v(" "),r("el-form-item",{attrs:{label:"工具上传",required:""}},[r("UploadFile",{attrs:{file:e.ruleForm.route,"file-type":["zip"],"file-size":524288e3},on:{"update:file":function(t){e.$set(e.ruleForm,"route",t)}}}),e._v("\n      （请上传zip格式文件，大小不超过500M）\n    ")],1),e._v(" "),r("el-form-item",{attrs:{label:"工具描述",prop:"describe"}},[r("quill-editor",{attrs:{holder:"请输入工具描述"},model:{value:e.ruleForm.describe,callback:function(t){e.$set(e.ruleForm,"describe",t)},expression:"ruleForm.describe"}})],1),e._v(" "),r("el-form-item",[r("el-button",{attrs:{type:"primary"},on:{click:function(t){e.submitForm("ruleForm")}}},[e._v("保存")]),e._v(" "),r("el-button",{attrs:{type:"warning"},on:{click:e.goBack}},[e._v("返回")])],1)],1)],1)},[],!1,null,null,null);n.options.__file="index.vue";t.default=n.exports},baL4:function(e,t,r){},nzjd:function(e,t,r){"use strict";var o=r("baL4");r.n(o).a},was3:function(e,t,r){"use strict";r.d(t,"d",function(){return l}),r.d(t,"h",function(){return a}),r.d(t,"i",function(){return i}),r.d(t,"a",function(){return n}),r.d(t,"e",function(){return s}),r.d(t,"c",function(){return u}),r.d(t,"g",function(){return m}),r.d(t,"f",function(){return c}),r.d(t,"b",function(){return d}),r.d(t,"j",function(){return f});var o=r("t3Un");function l(e){return Object(o.a)({url:"/api/v1/common/admin/tool/",method:"get",params:e})}function a(e){return Object(o.a)({url:"/api/v1/common/admin/tool_show/",method:"post",data:e})}function i(e){return Object(o.a)({url:"/api/v1/common/admin/tool_delete/",method:"post",data:e})}function n(e){return Object(o.a)({url:"/api/v1/common/admin/tool/",method:"post",data:e})}function s(e){return Object(o.a)({url:"/api/v1/common/admin/tool/",method:"get",params:e})}function u(e,t){return Object(o.a)({url:"/api/v1/common/admin/tool/",method:"patch",params:e,data:t})}function m(){return Object(o.a)({url:"/api/v1/common/admin/tool/tag/",method:"get"})}function c(){return Object(o.a)({url:"/api/v1/common/admin/tool_tag/",method:"get"})}function d(e){return Object(o.a)({url:"/api/v1/common/admin/tool/tag/",method:"post",data:e})}function f(e){return Object(o.a)({url:"/api/v1/common/admin/tool/tag/",method:"delete",data:e})}}}]);