<template>
  <div>
    <div v-if="guide" class="ql-container ql-snow">
      <div class="ql-editor" v-html="guide" />
    </div>
    <div v-else style="margin-top:100px;text-align: center">
      <img src="@/assets/common/kong.png" alt="">
    </div>
  </div>
</template>

<script>

export default {
  name: 'CompetitionIntroduce',
  props: ['guide']
}
</script>

<style lang="scss" scoped>
  .ql-editor {
    background: rgba(27,31,59,.8);
    padding: 40px;
  }
</style>

