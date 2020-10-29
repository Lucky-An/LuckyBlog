<template>
  <div class="toolDetail_box">
    <!--返回按钮-->
    <div class="goback" @click="goback">
      {{ $t('task.returnView') }}
    </div>
    <!--工具详情-->
    <div class="detail">
      <!--左侧详情-->
      <div class="left">
        <img :src="tool.logo" alt="">
        <div class="info">
          <p class="title">{{ tool.name }}</p>
          <p class="ellipsis">{{ $t('ad5.tools.platform') }}：{{ tool.label_name }}</p>
          <p class="ellipsis">{{ $t('ad5.tools.type') }}：{{ tool.edition }}</p>
          <p class="ellipsis">{{ $t('ad5.tools.version') }}：{{ tool.edition }}</p>
          <p class="ellipsis">{{ $t('ad5.tools.size') }}：{{ tool.tool_size }}</p>
          <p class="ellipsis">{{ $t('ad5.tools.upload_time') }}：{{ tool.upload_time }}</p>
        </div>
      </div>
      <!--右侧简介-->
      <div class="right">
        <p>{{ $t('ad5.tools.description') }}：</p>
        <div class="ql-container ql-snow">
          <div class="ql-editor" v-html="tool.describe" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDetails } from '@/api/match'

export default {
  name: 'Index',
  data() {
    return {
      tool: {}
    }
  },
  created() {
    this.getDetails()
  },
  methods: {
    goback() {
      history.back()
    },
    getDetails() {
      getDetails(this.$route.query.id).then(res => {
        this.tool = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.toolDetail_box{
  padding: 56px 200px 0;
  color: #fff;
  font-size: 16px;
  .goback{
    width: 150px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: #3073fc;
    border-radius: 4px;
    cursor: pointer;
  }
  .detail{
    margin-top: 20px;
    width: 100%;
    border: solid 1px #3073fc;
    min-height: calc(100vh - 250px);
    padding: 3px;
    display: flex;
    .left{
      width: 310px;
      height: 100%;
      img{
        width: 100%;
        height: 180px;
      }
      .info{
        width: 100%;
        padding: 25px;
        height: 100%;
        position: relative;
        .title{
          font-size: 21px;
          margin-bottom: 21px;
        }
        p{
          margin-bottom: 12px;
        }
      }
    }
    .right{
      flex: 1;
      margin: 20px;
      padding: 10px 20px;
      border-left: solid 1px #3073fc;
    }
  }
}
</style>
