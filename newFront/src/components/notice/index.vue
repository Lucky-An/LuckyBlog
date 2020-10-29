<template>
  <div>
    <div v-if="list && list.length">
      <countDown class="countDown" />
      <div
        class="guide_wrap"
        style="padding:0;"
      >
        <ul
          class="i_am_notice"
          style="padding:0;"
        >
          <li v-for="item in list">
            <div v-if="item.task">
              <div class="notice_title">hint for {{ item.task.title }}</div>
              <div
                class="notice_content"
                v-text="$i18n.locale=='EN' ? item.notice : item.notice"
              />
            </div>
            <div
              v-else
              class="notice_content"
              v-text="$i18n.locale=='EN' ? item.notice : item.notice"
            />
            <div class="notice_time">
              {{ item.create_time }}
              <i
                v-if="item.is_topped"
                class="be_toped"
              >{{ $t('message.toped') }}</i>
            </div>
          </li>
        </ul>

      </div>
    </div>
    <div
      v-else
      class="tcenter"
      style="margin-top: 100px;"
    >
      <img
        src="@/assets/common/kong.png"
        alt
      >
    </div>
  </div>
</template>

<script>
// import {getStorage} from '@/utils/storage'
import countDown from '@/components/countDown'

export default {
  name: 'Notice',
  components: { countDown },
  props: ['list'],
  created() {}
}
</script>

<style lang="scss" scoped>
.guide_wrap {
  ul li {
    background: #1b1f3c;
    width: 100%;
    padding: 10px 20px;
    margin-bottom: 20px;
    position: relative;
    .notice_time {
      color: #626584;
      line-height: 30px;
      font-size: 16px;
      text-align: left;
      .be_toped {
        background: #0080ff;
        color: white;
        border-radius: 3px;
        width: 40px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        display: inline-block;
        margin-left: 15px;
        vertical-align: 3px;
      }
    }
    .notice_title {
      margin: 10px 0;
      color: white;
      text-align: left;
      font-size: 16px;
    }
    .notice_content {
      padding: 10px 0 6px;
      text-align: left;
      color: white;
      font-size: 16px;
      line-height: 26px;
      word-wrap: break-word;
      word-break: normal;
      white-space: pre;
    }
  }
}
.countDown {
  float: right;
  margin-bottom: 20px;
}
.tcenter {
  clear: both;
}
</style>
