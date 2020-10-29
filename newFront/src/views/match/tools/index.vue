<template>
  <div class="tools_box">
    <header>
      <!--分类-->
      <div class="sort_box">
        <div class="title">
          {{ $t('ad5.tools.type') }}:
        </div>

        <div class="sort_content clearfix">
          <el-radio-group v-model="params.label" size="medium" @change="getList(1)">
            <el-radio-button label="">全部</el-radio-button>

            <el-radio-button v-for="item in sort" :label="item.id">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </div>

      </div>
      <!--平台-->
      <div class="sort_box">
        <div class="title">
          {{ $t('ad5.tools.platform') }}:
        </div>

        <div class="sort_content clearfix">
          <el-radio-group v-model="params.platform" size="medium" @change="getList(1)">
            <el-radio-button label="">全部</el-radio-button>

            <el-radio-button v-for="item in platform" :key="item" :label="item">
              {{ item }}
            </el-radio-button>
            <el-input
              v-model="params.name"
              size="medium"
              class="fr"
              style="width: 200px;"
              :placeholder="$t('selfHelp_competition.search_keyword')"
            >
              <i slot="suffix" class="el-input__icon el-icon-search" @click="getList(1)" />
            </el-input>
          </el-radio-group>

        </div>

      </div>
    </header>

    <div class="tools_content clearfix">
      <router-link
        v-for="item in tools"
        :key="item.id"
        :to="{
          path:'/match/toolDetail',
          query:{id:item.id },
        }"
      >
        <div class="tool_item fl">
          <img :src="item.logo" alt="">
          <div class="title ellipsis">
            {{ item.name }}
          </div>
          <div class="tag ellipsis">
            {{ item.label_name }}
          </div>
        </div>
      </router-link>
    </div>
    <!--分页 begin-->
    <pagination
      v-show="total>params.limit"
      :total="total"
      :page.sync="page"
      :limit.sync="params.limit"
      @pagination="getList"
    />
    <!--分页 end-->
  </div>
</template>

<script>
import { getToolsSort, getTools } from '@/api/match'
import pagination from '@/components/pagination'

export default {
  name: 'Index',
  components: {
    pagination
  },
  data() {
    return {
      sort: [], // 分类
      platform: [], // 平台
      params: {
        label: '',
        platform: '',
        name: '',
        offset: 0,
        limit: 12
      },
      page: 1,
      total: 0,
      tools: []// 工具列表
    }
  },
  created() {
    this.getToolsSort()
    this.getList()
  },
  methods: {
    // 获取工具分类和平台
    getToolsSort() {
      getToolsSort().then(res => {
        const { data } = res
        this.sort = data.label
        this.platform = data.platform
      })
    },
    // 获取工具列表
    getList(page) {
      if (page === 1) this.params.offset = 0
      if (page && page.page) this.params.offset = this.params.limit * (page.page - 1)
      getTools(this.params).then(res => {
        const { data } = res
        this.total = data.total
        this.tools = data.rows
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  .tools_box{
    padding: 56px 200px;
    color: #abaeba;

    /*头部样式*/
    .sort_box{
      padding: 22px 20px;
      background: rgb(29,34,82,.5);
      border-radius: 2px;
      font-size: 14px;
      display: flex;
      border-bottom:1px solid rgba(255,255,255,.1);
      .title{
        color: #fff;
        line-height: 34px;
        font-size: 16px;
        margin-right: 10px;
      }

      .sort_content{
        flex: 1;
      }
      .sort{
        cursor: pointer;
        padding: 9px 26px ;
      }
    }
    .sort_box+.sort_box{
      border-bottom: none;
    }

    /*工具库图标样式*/
    .tools_content{
      width: 100%;
      margin-top: 20px;
      .tool_item:hover {
        z-index: 2;
        box-shadow: 0 15px 30px rgba(0,0,0,.1);
        transform: translate3d(0,-2px,0);
      }
      .tool_item{
        cursor: pointer;
        width: 236px;
        height: 135px;
        position: relative;
        margin:0 50px 20px 0;
        font-size: 16px;
        transition: all .2s linear;
        img{
          width: 100%;
          height: 100%;
        }
        .title{
          width: 100%;
          position: absolute;
          top: 50%;
          text-align: center;
          color: #fff;
          margin-top: -9px;
        }
        .tag{
          width: 100%;
          position: absolute;
          padding: 4px;
          bottom: 0;
          background: rgba(2,11,24,.7);
        }
      }
    }
  }
</style>

<style lang="scss">
  .sort_content{
    .el-radio-group{
      width: 100%;
    }
    .el-radio-button{
      margin:0 10px 10px 0;
    }
    .el-radio-button__inner{
      background: none;
      border: none;
      color:#abaeba ;
    }
    .el-radio-button:first-child .el-radio-button__inner{
      border-left: none;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner{
      background: #3073fc;
      border-radius: 4px;
      box-shadow: none;
    }
    .el-input__icon{
      cursor: pointer;
    }
  }
</style>
