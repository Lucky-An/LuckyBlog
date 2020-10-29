<template>
  <div class="subject_box">
    <template v-if="competition==='dev'">
      <div  v-if="matchInfo.can_submit_writeup" class="devlop_wp submitWriteupDev">
        <p id="submitWriteup-text">
          <!-- <span v-else>{{$t('question.writeup_hurry')}}</span> -->
          <el-button
            type="primary"
            class="uploadWpBtnInQb btn"
            @click="showSubmitWriteUp"
          >{{$t('question.upload_writeup')}}</el-button>
        </p>
      </div>
      <!--上传writeUp 弹窗 begin-->
      <el-dialog
        class="my-dialog"
        :title="$t('question.upload_writeup2')"
        width="650px"
        :visible.sync="writeUpVisible"
        @closed="clearFile"
      >
        <div class="fcenter" style="padding-bottom:20px;border:none;">
          <input type="file" ref="writeup" />
          <span
            class="btn submitWriteupButton"
            @click="submitFileDev"
            type="primary"
          >{{$t('question.submit')}}</span>
        </div>
        <div v-if="isCN" style="padding-left:110px;color:#a4a8b3 ">
          只能上传
          <span >{{matchInfo.file_type.join('，')}}</span>
          格式文件，且不超过{{matchInfo.file_size}}M
        </div>

        <div v-else style="padding-left:110px;color:#a4a8b3 ">
          Only upload
          <span >{{matchInfo.file_type.join('，')}}</span>
          files, and no more than {{matchInfo.file_size}}M
        </div>
      </el-dialog>
      <!--上传writeUp 弹窗 end-->
    </template>
    <template v-if="competition==='jad'">
      <!--上传wreteUp-->
      <div id="submitWriteup" v-if="matchInfo.can_submit_writeup" class="submitWriteup">
        <p id="submitWriteup-text">
          <span v-if="hasWriteup">{{$t('question.uploadWriteup')}}</span>
          <span v-else>{{$t('question.writeup_hurry')}}</span>
          <span class="btn" @click="showSubmitWriteUp">{{$t('question.clickMe')}}</span>
          <span v-if="hasWriteup">{{$t('question.ReUpload')}}</span>
          <span v-else>{{$t('question.upload_writeup')}}</span>
        </p>
      </div>
      <!--&lt;!&ndash;显示token&ndash;&gt;-->
      <!--<div class="token"  v-if="matchInfo.is_international&&token">Team token:{{token}} </div>-->
      <!--<div class="token" v-else-if="!matchInfo.is_international&&token">token:{{token}} </div>-->

      <slot></slot>
      <!--上传writeUp 弹窗 begin-->
      <el-dialog
        class="my-dialog"
        :title="$t('question.upload_writeup2')"
        width="650px"
        :visible.sync="writeUpVisible"
        @closed="clearFile"
      >
        <div class="fcenter" style="padding-bottom:20px;border:none;">
          <input type="file" ref="writeup" />
          <span class="btn" @click="submitFileJad">{{$t('question.submit')}}</span>
        </div>
        <div v-if="isCN" style="padding-left:110px;color:#a4a8b3 ">
          只能上传
          <span >{{matchInfo.file_type.join('，')}}</span>
          格式文件，且不超过{{matchInfo.file_size}}M
        </div>

        <div v-else style="padding-left:110px;color:#a4a8b3 ">
          Only upload
          <span >{{matchInfo.file_type.join('，')}}</span>
          files, and no more than {{matchInfo.file_size}}M
        </div>
      </el-dialog>
      <!--上传writeUp 弹窗 end-->
    </template>
    <template v-if="competition==='lay'">
      <!--&lt;!&ndash;上传wreteUp&ndash;&gt;-->
      <div id="submitWriteup" v-if="matchInfo.can_submit_writeup" class="submitWriteup">
        <p id="submitWriteup-text">
          <span v-if="hasWriteup">{{$t('question.uploadWriteup')}}</span>
          <span v-else>{{$t('question.writeup_hurry')}}</span>
          <span class="btn" @click="showSubmitWriteUp">{{$t('question.clickMe')}}</span>
          <span v-if="hasWriteup">{{$t('question.ReUpload')}}</span>
          <span v-else>{{$t('question.upload_writeup')}}</span>
        </p>
      </div>
      <!--&lt;!&ndash;wreteUp end&ndash;&gt;-->
      <slot></slot>
      <!--上传writeUp 弹窗 begin-->
      <el-dialog
        class="my-dialog"
        :title="$t('question.upload_writeup2')"
        width="650px"
        :visible.sync="writeUpVisible"
        @closed="clearFile"
      >
        <div class="fcenter" style="padding-bottom:20px;border:none;">
          <input type="file" ref="writeup" />
          <span class="btn" @click="submitFileLay">{{$t('question.submit')}}</span>
        </div>
        <div v-if="isCN" style="padding-left:110px;color:#a4a8b3 ">
          只能上传
          <span >{{matchInfo.file_type.join('，')}}</span>
          格式文件，且不超过{{matchInfo.file_size}}M
        </div>
        <div v-else style="padding-left:110px;color:#a4a8b3 ">
          Only upload
          <span >{{matchInfo.file_type.join('，')}}</span>
          files, and no more than {{matchInfo.file_size}}M
        </div>
      </el-dialog>
      <!--上传writeUp 弹窗 end-->
    </template>
    <template v-if="competition==='rw'">
      <!--上传wreteUp-->
      <div id="submitWriteup" v-if="matchInfo.can_submit_writeup" class="submitWriteup">
        <p id="submitWriteup-text">
          <span v-if="hasWriteup">{{$t('question.uploadWriteup')}}</span>
          <span v-else>{{$t('question.writeup_hurry')}}</span>
          <span class="btn" @click="showSubmitWriteUp">{{$t('question.clickMe')}}</span>
          <span v-if="hasWriteup">{{$t('question.ReUpload')}}</span>
          <span v-else>{{$t('question.upload_writeup')}}</span>
        </p>
      </div>
      <slot></slot>
      <!--上传writeUp 弹窗 begin-->
      <el-dialog
        class="my-dialog"
        :title="$t('question.upload_writeup2')"
        width="650px"
        :visible.sync="writeUpVisible"
        @closed="clearFile"
      >
        <div class="fcenter" style="padding-bottom:20px;border:none;">
          <input type="file" ref="writeup" />
          <span class="btn" @click="submitFileRw">{{$t('question.submit')}}</span>
        </div>
        <div v-if="isCN" style="padding-left:110px;color:#a4a8b3 ">
          只能上传
          <span >{{matchInfo.file_type.join('，')}}</span>
          格式文件，且不超过{{matchInfo.file_size}}M
        </div>

        <div v-else style="padding-left:110px;color:#a4a8b3 ">
          Only upload
          <span >{{matchInfo.file_type.join('，')}}</span>
          files, and no more than {{matchInfo.file_size}}M
        </div>
      </el-dialog>
      <!--上传writeUp 弹窗 end-->
    </template>
  </div>
</template>

<script>
import { uploadWriteups } from "@/api/competitionMode/devopsMode";
import { uploadWriteup } from "@/api/competitionMode/solvingMode";
import { uploadWriteupLay } from "@/api/competitionMode/layeredMode";
import { uploadWriteupRw } from "@/api/competitionMode/rwMode";

export default {
  name: "UploadWriteup",
  data() {
    return {
      isCN: this.$i18n.locale=='CN',
      writeUpVisible: false
    };
  },
  props: {
    matchInfo: Object,
    competition: String,
    hasWriteup: Boolean
  },
  created(){
  },
  methods: {
    clearFile(){
      //
      let files = this.$refs.writeup.files;
      let isJPG = false;
      this.matchInfo.file_type.forEach(item => {
        if (files[0].name.endsWith(item)) isJPG = true;
      });
      if (!isJPG) {
        this.$refs.writeup.value = '';
      }
    },
    showSubmitWriteUp() {
      //点击展示writeUp
      this.writeUpVisible = true;
    },
    submitFileDev() {
      //上传文件
      // 创建一个form表单
      let formData = new FormData();
      let files = this.$refs.writeup.files;
      if (files.length == 0) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateform.file")
        });
        return;
      }
      let isJPG = false;

      this.matchInfo.file_type.forEach(item => {
        if (files[0].name.endsWith(item)) isJPG = true;
      });
      if (!isJPG) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateImg.file_err")
        });
        return false;
      }
      if (files[0].size / 1024 / 1024 > this.matchInfo.file_size) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateImg.big_size")
        });
        return;
      }
      formData.append("writeup", files[0]);
      formData.append("evt", this.$route.query.event);

      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
      uploadWriteups(formData, { evt: this.$route.query.event })
        .then(res => {
          loading.close();
          if(res.data.writeup){
            this.$refs.writeup.value = "";
            this.$emit("hasWriteupChange");
            this.$notify.success({
              title: this.$t("dialog_list.tips"),
              message: this.$t("task.writeup.upload_success")
            });
            this.writeUpVisible = false;
          }
        })
        .catch(error => {});
    },
    submitFileJad() {
      let formData = new FormData();
      let files = this.$refs.writeup.files;
      if (files.length == 0) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateform.file")
        });
        return;
      }
      let isJPG = false;

      this.matchInfo.file_type.forEach(item => {
        if (files[0].name.endsWith(item)) isJPG = true;
      });
      if (!isJPG) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateImg.file_err")
        });
        return false;
      }
      if (files[0].size / 1024 / 1024 > this.matchInfo.file_size) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateImg.big_size")
        });
        return;
      }
      formData.append("writeup", files[0]);
      formData.append("evt", this.$route.query.event);
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
      uploadWriteup(formData)
        .then(res => {
          loading.close();
          this.$refs.writeup.value = "";
          // this.hasWriteup = true;
          this.$emit("hasWriteupChange");

          this.$notify.success({
            title: this.$t("dialog_list.tips"),
            message: this.$t("task.writeup.upload_success")
          });
          this.writeUpVisible = false;
        })
        .catch(error => {});
    },
    submitFileLay() {
      //上传文件

      // 创建一个form表单
      let formData = new FormData();
      let files = this.$refs.writeup.files;
      if (files.length == 0) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateform.file")
        });
        // this.$message.error(this.$t('validateform.file'))
        return;
      }
      let isJPG = false;

      this.matchInfo.file_type.forEach(item => {
        if (files[0].name.endsWith(item)) isJPG = true;
      });

      // if (files[0].type === 'image/png' || files[0].type === 'application/pdf') {
      //   isJPG = true
      // } else if (files[0].name.endsWith('.md')) {
      //   isJPG = true
      // } else {
      //   isJPG = false
      // }
      if (!isJPG) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateImg.file_err")
        });
        return false;
      }
      if (files[0].size / 1024 / 1024 > this.matchInfo.file_size) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateImg.big_size")
        });
        // this.$message.error(this.$t('validateImg.md_size'))
        return;
      }
      formData.append("writeup", files[0]);
      formData.append("evt", this.$route.query.event);
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
      uploadWriteupLay(formData)
        .then(res => {
          loading.close();
          this.$refs.writeup.value = "";
          // this.hasWriteup = true;
          this.$emit("hasWriteupChange");
          this.$notify.success({
            title: this.$t("dialog_list.tips"),
            message: this.$t("task.writeup.upload_success")
          });
          // this.$message.success(this.$t('task.writeup.upload_success'))
          this.writeUpVisible = false;
        })
        .catch(error => {});
    },
    submitFileRw() {
      //上传文件
      // 创建一个form表单
      let formData = new FormData();
      let files = this.$refs.writeup.files;
      if (files.length == 0) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateform.file")
        });
        return;
      }
      let isJPG = false;

      this.matchInfo.file_type.forEach(item => {
        if (files[0].name.endsWith(item)) isJPG = true;
      });
      if (!isJPG) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateImg.file_err")
        });
        return false;
      }
      if (files[0].size / 1024 / 1024 > this.matchInfo.file_size) {
        this.$notify.error({
          customClass: "error_notify",
          title: this.$t("public.error"),
          message: this.$t("validateImg.big_size")
        });
        return;
      }
      formData.append("writeup", files[0]);
      formData.append("evt", this.$route.query.event);
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      setTimeout(() => {
        loading.close();
      }, 2000);

      uploadWriteupRw(formData)
        .then(res => {
          loading.close();
          this.$refs.writeup.value = "";
          // this.hasWriteup = true;
          this.$emit("hasWriteupChange");
          this.$notify.success({
            title: this.$t("dialog_list.tips"),
            message: this.$t("task.writeup.upload_success")
          });
          this.writeUpVisible = false;
        })
        .catch(error => {});
    }
  }
};
</script>
<style>
  .devlop_wp .btn{
    margin:0!important;
    padding-left:20px!important;
    padding-right:20px!important;
  }
.submitWriteupDev {
  position: absolute;
  z-index: 1867;
}
.submitWriteupButton {
  text-align: center;
  text-decoration: none !important;
  font-style: normal;
  color: #fff !important;
  margin: 0 10px;
  cursor: pointer;
  padding: 10px 40px;
  display: inline-block;
}
</style>
<style lang="stylus" scoped>
@import '~@/common/stylus/mixin.styl';

.subject_box {
  position: relative;

  .submitWriteup {
    color: fontColor-f;
    position: absolute;
    background: tableBg;
    border: 1px solid tableBorer;
    line-height: 24px;
    max-width: 440px;
    padding: 10px 20px;
    z-index: 1867;

    .btn {
      padding: 2px 10px;
    }
  }
}
</style>
<style lang="stylus" rel="stylesheet/stylus">
@media (max-width: 1300px) {
  .submitWriteup{
    top: -138px;
  }
  .submitWriteupDev{
    top: -130px;
  }
}

@media (min-width: 1300px) and (max-width: 1600px) {
  .submitWriteup {
    top: -118px;
  }
  .submitWriteupDev{
    top: -110px;
  }
}

@media (min-width: 1600px) {
  .submitWriteup{
    top: -144px;
  }
  .submitWriteupDev{
    top: -136px;
  }
}
</style>
