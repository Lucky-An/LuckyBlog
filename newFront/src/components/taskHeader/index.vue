<template>
  <header class="myHeader">
    <!--watch 代表是否是从观摩页直接来的排行榜，如果是，则不展示导航-->
    <div
      v-if="watch!=='true'"
      class="route_box"
    >
      <!--指南  公告  赛题-->
      <div style="float: right;">
        <router-link
          v-for="(item,index) in left"
          :key="index"
          :to="{path:item.path,query:{id,hash,type}}"
        >
          <div class="route">{{ item.name }}</div>
        </router-link>
      </div>
    </div>
    <!--中间logo-->
    <div class="logo_box">
      <img
        :src="match.logo"
        alt
      >
    </div>
    <!--中间图片-->

    <!--watch 代表是否是从观摩页直接来的排行榜，如果是，则不展示导航-->
    <div
      v-if="watch!=='true'"
      class="route_box"
    >
      <!--排行  趋势  WP-->
      <router-link
        v-for="(item,index) in right"
        :key="index"
        :to="{path:item.path,query:{id,hash,type}}"
      >
        <div class="route">{{ item.name }}</div>
      </router-link>

      <div class="fr system">
        <switchLanguage />

        <!--用户信息-->
        <el-dropdown class="user_info">
          <span class="el-dropdown-link">
            <span class="avatar">
              <img
                :src="user.logo"
                alt
              >
            </span>
            <span class="username ellipsis">{{ user.nickname }}</span>
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/match/taskList">
                <div style="width:150px;line-height:40px;text-align:center">
                  <!--返回竞赛-->
                  {{ $t('dialog_list.comebackMatch') }}
                </div>
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <div
                style="width:150px;line-height:40px;text-align:center"
                @click="logout"
              >
                <!--退出系统-->
                {{ $t('header.logout') }}
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import switchLanguage from '@/components/switchLanguage'

export default {
  name: 'MyHeader',
  components: {
    switchLanguage
  },
  props: {
    nav: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      id: this.$route.query.id,
      hash: this.$route.query.hash,
      watch: this.$route.query.watch,
      type: this.$route.query.type,
      left: [], // 左侧的导航
      right: [] // 右侧的导航
    }
  },
  computed: {
    ...mapGetters(['match', 'user'])
  },
  watch: {
    // 在生成导航之前，先判断竞赛是否展示wp，如果不展示，则隐藏wp导航。
    'match.can_submit_writeup': {
      immediate: true,
      handler: function(val, oldVal) {
        let nav = this.nav
        if (!val) {
          nav = this.nav.filter(item => {
            return item.type.toLowerCase() != 'wp'
          })
        }

        this.splitNav(nav)
      }
    }
  },
  methods: {
    // 切割数组
    splitNav(nav) {
      // 获取导航数组的长度
      const l = nav.length
      // 获取数组的中间值
      const c = Math.ceil(l / 2)
      this.left = nav.slice(0, c)
      this.right = nav.slice(c, l)
    },
    logout() {
      this.$store.dispatch('user/logout')
    }
  }
}
</script>

<style lang="scss" scoped>
.myHeader {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  background: url("~@/assets/common/tou.png");
  background-position: bottom;
  position: relative;
  z-index: 999;
  .logo_box {
    width: 495px;
    height: 100px;
    text-align: center;
    img {
      max-width: 380px;
      max-height: 100%;
    }
  }

  .route_box {
    height: 60px;
    line-height: 60px;
    flex: 1;
    color: #d1d3d6;
    .route {
      height: 60px;
      font-size: 16px;
      padding: 0 15px;
      float: left;
    }
    .router-link-active .route {
      font-weight: bold;
      color: #0080ff;
      border-bottom: 4px solid #0080ff;
    }
  }

  .system {
    height: 60px;
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
  /*用户信息*/
  .user_info {
    margin-left: 10px;

    .avatar {
      display: inline-block;
      width: 40px;
      height: 40px;
      border-radius: 50px;
      border: 2px solid #3173fd;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50px;
      }
    }
    .username {
      display: inline-block;
      width: 60px;
    }
    .el-dropdown-link {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
