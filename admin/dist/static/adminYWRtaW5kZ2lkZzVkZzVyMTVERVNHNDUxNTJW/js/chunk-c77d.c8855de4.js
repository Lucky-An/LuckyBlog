(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-c77d"],{"7fdr":function(t,e,a){"use strict";var n=a("fdOG");a.n(n).a},TEjo:function(t,e,a){"use strict";a.d(e,"f",function(){return i}),a.d(e,"b",function(){return o}),a.d(e,"a",function(){return r}),a.d(e,"c",function(){return d}),a.d(e,"d",function(){return s}),a.d(e,"e",function(){return c}),a.d(e,"j",function(){return l}),a.d(e,"g",function(){return u}),a.d(e,"h",function(){return m}),a.d(e,"i",function(){return f});var n=a("t3Un");function i(t){return Object(n.a)({url:"/api/v1/common/admin/images",method:"get",params:t})}function o(t){return Object(n.a)({url:"/api/v1/common/admin/images",method:"delete",data:t})}function r(t){return Object(n.a)({url:"/api/v1/common/admin/images",method:"post",data:t})}function d(t,e){return Object(n.a)({url:"/api/v1/common/admin/images/"+t,method:"patch",data:e})}function s(t){return Object(n.a)({url:"/api/v1/common/admin/images/"+t,method:"get"})}function c(){return Object(n.a)({url:"/api/v1/common/admin/images/tags",method:"get"})}function l(t){return Object(n.a)({url:"/api/v1/common/admin/images/tags",method:"post",data:t})}function u(t,e){return Object(n.a)({url:"/api/v1/common/admin/images/tags/"+t,method:"put",data:e})}function m(t){return Object(n.a)({url:"/api/v1/common/admin/images/tags/"+t,method:"delete"})}function f(t,e,a){return Object(n.a)({url:"/api/v1/common/admin/images/"+t+"/instance",method:"post",data:{operation:e,save:a}})}},XINx:function(t,e,a){"use strict";var n={bind:function(t,e,a){var n=t.querySelector(".el-dialog__header"),i=t.querySelector(".el-dialog");n.style.cssText+=";cursor:move;",i.style.cssText+=";top:0px;";var o=window.document.currentStyle?function(t,e){return t.currentStyle[e]}:function(t,e){return getComputedStyle(t,!1)[e]};n.onmousedown=function(t){var e=t.clientX-n.offsetLeft,r=t.clientY-n.offsetTop,d=i.offsetWidth,s=i.offsetHeight,c=document.body.clientWidth,l=document.body.clientHeight,u=i.offsetLeft,m=c-i.offsetLeft-d,f=i.offsetTop,p=l-i.offsetTop-s,g=o(i,"left"),h=o(i,"top");g.includes("%")?(g=+document.body.clientWidth*(+g.replace(/\%/g,"")/100),h=+document.body.clientHeight*(+h.replace(/\%/g,"")/100)):(g=+g.replace(/\px/g,""),h=+h.replace(/\px/g,"")),document.onmousemove=function(t){var n=t.clientX-e,o=t.clientY-r;-n>u?n=-u:n>m&&(n=m),-o>f?o=-f:o>p&&(o=p),i.style.cssText+=";left:"+(n+g)+"px;top:"+(o+h)+"px;",a.child.$emit("dragDialog")},document.onmouseup=function(t){document.onmousemove=null,document.onmouseup=null}}}},i=function(t){t.directive("el-drag-dialog",n)};window.Vue&&(window["el-drag-dialog"]=n,Vue.use(i)),n.install=i;e.a=n},buED:function(t,e,a){"use strict";a.r(e);var n=a("rerW"),i=a.n(n),o=a("TEjo"),r={name:"TagsManage",directives:{elDragDialog:a("XINx").a},data:function(){return{addDig:!1,addData:{},tagTree:[],form:{name:"",parent_id:0,description:""},tag_id:"",rules:{name:[{required:!0,message:"请输入镜像标签名称",trigger:"blur"},{pattern:/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,message:"镜像标签名称只能包含汉字、数字、字母、下划线"}]},defaultProps:{children:"children",label:"name"}}},created:function(){this.getTagList()},methods:{closeDia:function(){this.form={name:"",parent_id:0,description:""},this.addData={},this.tag_id=""},removeTag:function(t,e){var a=this;Object(o.h)(e.id).then(function(t){t.data.success&&(a.$message.success("删除成功"),a.getTagList())})},addTag:function(t,e){t.level>10?this.$message.error("不建议树形结构等级超过十级~"):(this.addDig=!0,this.addData=t,this.addData.parentName=t.name)},editTag:function(t,e){this.addDig=!0,this.addData=t,this.addData.parentName=e.parent.data.name?e.parent.data.name:"顶层节点",this.form.name=t.name,this.form.description=t.description,this.tag_id=t.id},submitTag:function(t){var e=this;this.$refs[t].validate(function(t){t&&(e.tag_id?(delete e.form.parent_id,Object(o.g)(e.tag_id,e.form).then(function(t){t.data.success&&(e.addDig=!1,e.getTagList())})):Object(o.j)(e.form).then(function(t){t.data.success&&(e.addDig=!1,e.getTagList())}))})},getTagList:function(){var t=this;Object(o.e)().then(function(e){t.tagTree=t.initData(e.data.data),t.tagTree.unshift({id:0,name:"顶层节点"})})},handleNodeClick:function(t,e,a){this.form.parent_id=t.id+""},initData:function(t){var e={},a=[],n=!0,o=!1,r=void 0;try{for(var d,s=i()(t);!(n=(d=s.next()).done);n=!0){var c=d.value;c.id=String(c.id),e[c.id]=c}}catch(t){o=!0,r=t}finally{try{!n&&s.return&&s.return()}finally{if(o)throw r}}for(var l in e)e[l].parent_id?(e[e[l].parent_id].children||(e[e[l].parent_id].children=[]),e[e[l].parent_id].children.push(e[l])):a.push(e[l]);return a}}},d=(a("7fdr"),a("ZrdR")),s=Object(d.a)(r,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"app-container competition_box tag_manage_wrapper"},[a("div",{staticClass:"container_bg"},[a("el-tree",{staticStyle:{margin:"0 auto"},attrs:{data:t.tagTree,props:t.defaultProps,"default-expand-all":""},on:{"node-click":t.handleNodeClick},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.node,i=e.data;return a("span",{staticClass:"custom-tree-node"},[a("span",{staticClass:"nodeName",class:{dingCeng:"顶层节点"==n.label},attrs:{title:n.label}},[t._v(t._s(n.label))]),t._v(" "),a("span",{class:{no_delete:i.children}},[a("span",{staticClass:"fang_button_link",class:{firstTag:0==i.id},staticStyle:{"margin-right":"20px"},on:{click:function(e){t.addTag(i,n)}}},[t._v("增加节点")]),t._v(" "),0==!i.id?a("span",{staticClass:"fang_button_link",on:{click:function(e){t.editTag(i,n)}}},[t._v("编辑节点")]):t._e(),t._v(" "),i.children||0!=!i.id?t._e():a("span",{staticClass:"fang_button_link",staticStyle:{color:"#F56C6C","margin-left":"20px"},attrs:{type:"text",size:"mini"},on:{click:function(){return t.removeTag(n,i)}}},[t._v("删除节点")])])])}}])}),t._v(" "),a("el-dialog",{directives:[{name:"el-drag-dialog",rawName:"v-el-drag-dialog"}],attrs:{visible:t.addDig,width:"680px",title:"标签管理","append-to-body":""},on:{"update:visible":function(e){t.addDig=e},close:t.closeDia}},[a("el-form",{ref:"form",staticStyle:{padding:"0 25px"},attrs:{rules:t.rules,model:t.form,"label-width":"120px"}},[a("el-form-item",{attrs:{label:"镜像标签",prop:"name"}},[a("el-input",{attrs:{maxlength:"12","show-word-limit":"",placeholder:"请输入镜像标签名称，只能包含汉字、数字、字母、下划线"},model:{value:t.form.name,callback:function(e){t.$set(t.form,"name","string"==typeof e?e.trim():e)},expression:"form.name"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"镜像标签描述"}},[a("el-input",{attrs:{maxlength:"256","show-word-limit":"",placeholder:"请输入镜像标签描述"},model:{value:t.form.description,callback:function(e){t.$set(t.form,"description","string"==typeof e?e.trim():e)},expression:"form.description"}})],1),t._v(" "),"顶层节点"!==t.addData.name?a("el-form-item",{attrs:{label:"父节点名称"}},[a("span",{staticStyle:{color:"#0090fc"}},[t._v(t._s(t.addData.parentName))])]):t._e(),t._v(" "),a("el-form-item",{staticClass:"from_submit_btn",staticStyle:{"margin-left":"-90px"}},[a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.submitTag("form")}}},[t._v("确定")]),t._v(" "),a("el-button",{on:{click:function(e){t.addDig=!1}}},[t._v("取消")])],1)],1)],1)],1)])},[],!1,null,null,null);s.options.__file="index.vue";e.default=s.exports},fdOG:function(t,e,a){}}]);