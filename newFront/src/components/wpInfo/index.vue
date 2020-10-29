<template>
  <div>
    <el-table
      :data="list"
      border
      style="width: 100%"
    >
      <!--序号-->
      <el-table-column
        :label="$t('public.sort')"
        type="index"
        align="center"
        width="60"
      />
      <!--WriteUp名称-->
      <el-table-column
        prop="wp_name"
        :label="$t('writeup.wp_name')"
        align="center"
      />
      <!--上传时间-->
      <el-table-column
        prop="create_time"
        :label="$t('writeup.upload_time')"
        align="center"
      />
      <!--上传者-->
      <el-table-column
        prop="name"
        :label="$t('writeup.Uploader')"
        align="center"
      />
      <!--操作-->
      <el-table-column
        prop="address"
        :label="$t('public.operation')"
        align="center"
      >
        <template slot-scope="scope">
          <a :href="scope.row.path" download style="display:inline-block;margin-right: 15px;">
            <!--下载-->
            <el-button size="mini" type="primary">{{ $t('public.download') }}</el-button>
          </a>
          <!--删除-->
          <el-button size="mini" type="primary" @click="removeWp">{{ $t('public.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    removeWp() {
      this.$emit('removeWp')
    }
  },
  computed: {
    ...mapGetters(['config', 'match'])

  }

}
</script>

<style lang="scss" scoped>
</style>
