(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-cfc9"],{"3J15":function(e,t,r){},Ibrk:function(e,t,r){"use strict";r.d(t,"e",function(){return a}),r.d(t,"g",function(){return o}),r.d(t,"i",function(){return i}),r.d(t,"f",function(){return u}),r.d(t,"a",function(){return s}),r.d(t,"b",function(){return c}),r.d(t,"d",function(){return l}),r.d(t,"c",function(){return m}),r.d(t,"h",function(){return d});var n=r("t3Un");function a(e){return Object(n.a)({url:"/api/v1/common/admin/challenge/tags/",method:"get",params:e})}function o(){return Object(n.a)({url:"/api/v1/common/admin/flavors",method:"get",params:{per_page:9999}})}function i(){return Object(n.a)({url:"/api/v1/common/admin/images",method:"get"})}function u(e){return Object(n.a)({url:"/api/v1/common/admin/challenge/categorys/",method:"get",params:e})}function s(e){return Object(n.a)({url:"/api/v1/common/admin/challenge/tags/",method:"post",data:e})}function c(e){return Object(n.a)({url:"/api/v1/common/admin/challenge/categorys/",method:"post",data:e})}function l(e){return Object(n.a)({url:"/api/v1/common/admin/challenge/categorys/",method:"delete",data:e})}function m(e){return Object(n.a)({url:"/api/v1/common/admin/challenge/tags/",method:"delete",data:e})}function d(e){return Object(n.a)({url:"/api/v1/common/admin/flavors",method:"get",params:e})}},VEZC:function(e,t,r){"use strict";r.d(t,"e",function(){return a}),r.d(t,"g",function(){return o}),r.d(t,"b",function(){return i}),r.d(t,"a",function(){return u}),r.d(t,"c",function(){return s}),r.d(t,"f",function(){return c}),r.d(t,"d",function(){return l});var n=r("t3Un");function a(e){return Object(n.a)({url:"/api/v1/rw/admin/tasks/",method:"get",params:e})}function o(e){return Object(n.a)({url:"/api/v1/rw/admin/tasks/batch_public/",method:"patch",data:e})}function i(e){return Object(n.a)({url:"/api/v1/rw/admin/tasks/batch_destroy/",method:"delete",data:e})}function u(e){return Object(n.a)({url:"/api/v1/rw/admin/tasks/",method:"post",data:e})}function s(e,t){return Object(n.a)({url:"/api/v1/rw/admin/tasks/"+e,method:"patch",data:t})}function c(e){return Object(n.a)({url:"/api/v1/rw/admin/tasks/"+e,method:"get"})}function l(e){return Object(n.a)({url:"/api/v1/rw/admin/tasks/nodes",method:"get"})}},kRtn:function(e,t,r){"use strict";var n=r("3J15");r.n(n).a},m7RC:function(e,t,r){"use strict";r.r(t);var n=r("uTCP"),a=r("tBjE"),o=r("VEZC"),i=r("Ibrk"),u={components:{QuillEditor:n.a,UploadFile:a.a},data:function(){return{task_id:this.$route.query.task_id,nodeAry:[],subType:[{cn_name:"XCTF",id:1}],ruleForm:{title:"",category_id:1,score:1e3,content_html:"",content:"",content_en:"",content_en_html:"",file:""},rules:{title:[{required:!0,message:"请输入题目名称",trigger:"blur"},{min:1,max:50,message:"长度在 1 到 50 个字",trigger:"blur"}],title_en:[{required:!0,message:"请输入题目名称英文",trigger:"blur"},{min:1,max:50,message:"长度在 1 到 50 个字",trigger:"blur"}],devicename:[{required:!0,message:"请输入设备名",trigger:"blur"},{min:1,max:30,message:"长度在 1 到 30 个字",trigger:"blur"}],score:[{required:!0,message:"请输入题目分值",trigger:"blur"}],content:[{required:!0,message:"请输入题目描述",trigger:"blur"}],protocol:[{type:"number",required:!0,message:"请选择",trigger:"change"}],category_id:[{type:"number",required:!0,message:"请选择题目类型",trigger:"change"}]}}},created:function(){this.task_id&&this.subInfo()},methods:{goback:function(){history.back()},getNode:function(){var e=this;Object(o.d)().then(function(t){e.nodeAry=t.data})},getSubType:function(){var e=this;Object(i.f)({type:4}).then(function(t){e.subType=t.data})},subInfo:function(){var e=this;Object(o.f)(this.task_id).then(function(t){for(var r in e.ruleForm)e.ruleForm[r]=t.data[r]})},onSubmit:function(){var e=this;this.ruleForm.content_en_html=this.ruleForm.content_en;var t=new FormData,r=this.ruleForm;for(var n in r)t.append(n,r[n]);this.task_id&&t.append("event_id",this.task_id),this.task_id?Object(o.c)(this.task_id,t).then(function(t){t.data.success&&(e.$message.success("操作成功"),e.$router.push({path:"/itemBank/rw"}))}).catch(function(t){e.$message.error(t.response.data.message_zh)}):Object(o.a)(t).then(function(t){t.data.success&&(e.$message.success("操作成功"),e.$router.push({path:"/itemBank/rw"}))}).catch(function(t){e.$message.error(t.response.data.message_zh)})},addEnc:function(){this.enclosureAry.push(1),this.flagAry.push({flag:""})},removeEnc:function(e){this.enclosureAry=[1]},submitForm:function(){var e=this;this.$refs.ruleForm.validate(function(t){if(!t)return e.$message.error("请核验所输入的信息"),!1;e.onSubmit()})},resetForm:function(){this.$refs.ruleForm.resetFields()}}},s=(r("kRtn"),r("ZrdR")),c=Object(s.a)(u,function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"app-container create_topic"},[r("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"200px"}},[r("el-form-item",{attrs:{label:"题目名称",prop:"title"}},[r("el-input",{attrs:{placeholder:"请输入题目名称"},model:{value:e.ruleForm.title,callback:function(t){e.$set(e.ruleForm,"title","string"==typeof t?t.trim():t)},expression:"ruleForm.title"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"题目类型",prop:"category_id"}},[r("el-select",{staticClass:"filter-item",attrs:{placeholder:"请选择题目类型",disabled:""},model:{value:e.ruleForm.category_id,callback:function(t){e.$set(e.ruleForm,"category_id",t)},expression:"ruleForm.category_id"}},e._l(e.subType,function(e,t){return r("el-option",{key:t,attrs:{label:e.cn_name,value:e.id}})}))],1),e._v(" "),r("el-form-item",{attrs:{label:"题目分值",prop:"score"}},[r("el-input-number",{attrs:{min:0,max:1e6,disabled:"",label:"描述文字"},model:{value:e.ruleForm.score,callback:function(t){e.$set(e.ruleForm,"score",t)},expression:"ruleForm.score"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"题目描述"}},[r("quill-editor",{attrs:{holder:"请输入题目描述"},model:{value:e.ruleForm.content_html,callback:function(t){e.$set(e.ruleForm,"content_html",t)},expression:"ruleForm.content_html"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"题目描述英文"}},[r("quill-editor",{attrs:{holder:"请输入题目题目描述英文"},model:{value:e.ruleForm.content_en,callback:function(t){e.$set(e.ruleForm,"content_en",t)},expression:"ruleForm.content_en"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"题目附件"}},[r("UploadFile",{attrs:{file:e.ruleForm.file,"file-type":["zip"],"file-size":20971520},on:{"update:file":function(t){e.$set(e.ruleForm,"file",t)}}}),e._v("\n      （请上传zip格式文件，大小不超过20M）\n    ")],1),e._v(" "),r("el-form-item",[r("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("保存")]),e._v(" "),r("el-button",{attrs:{type:"warning"},on:{click:e.goback}},[e._v("返回")])],1)],1)],1)},[],!1,null,null,null);c.options.__file="index.vue";t.default=c.exports}}]);