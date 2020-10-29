<template>
  <header class="myHeader">
    <!--左侧图片-->
    <div class="logo_box">
      <img :src="config.home_page_logo" alt="">
    </div>
    <!--左侧图片-->

    <!--右侧导航-->
    <div class="route_box">
      <router-link to="/match/taskList">
        <div class="route">
          <!--竞赛-->
          {{ $t("header.competition.competition") }}
        </div>
      </router-link>

      <template v-if="user.role !== 'Referee'">
        <router-link v-if="config.is_tool" to="/match/tools">
          <div class="route">
            <!--工具库-->
            {{ $t("header.tools") }}
          </div>
        </router-link>

        <router-link v-if="config.is_leak" to="/match/leaks">
          <div class="route">
            <!--漏洞库-->
            {{ $t("header.leak") }}
          </div>
        </router-link>

        <router-link v-if="config.is_personal" to="/match/personal">
          <div class="route">
            <!--个人中心-->
            {{ $t("header.personal.home") }}
          </div>
        </router-link>
      </template>

      <div class="fr">
        <switchLanguage />

        <!--用户信息-->
        <el-dropdown class="user_info">
          <span class="el-dropdown-link">
            <span class="avatar">
              <img :src="user.logo" alt="">
            </span>
            <span class="username ellipsis">{{ user.nickname }}</span>
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div
                style="width: 150px; line-height: 40px; text-align: center"
                @click="logout"
              >
                <!--退出系统-->{{ $t("header.logout") }}
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!--右侧导航-->
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import { constantRoutes } from '@/router'
import switchLanguage from '@/components/switchLanguage'

export default {
  name: 'MyHeader',
  components: {
    switchLanguage
  },
  computed: {
    ...mapGetters(['config', 'user'])
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    },

    openLeak() {
      const { protocol: p, hostname: h } = location
      window.open(`${p}//${h}:8082`, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.myHeader {
  width: 100%;
  height: 82px;
  display: flex;

  .logo_box {
    width: 488px;
    height: 83px;
    background: url("~@/assets/match/jst1.png");
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  /*路由盒子*/
  .route_box {
    padding: 0 60px;
    height: 60px;
    line-height: 60px;
    flex: 1;
    background: url("~@/assets/match/jst2.png") repeat-x;
    color: #d1d3d6;
    .route {
      height: 60px;
      font-size: 16px;
      padding: 0 20px;
      margin: 0 10px;
      float: left;
    }
    .router-link-active .route {
      font-weight: bold;
      color: #0080ff;
      border-bottom: 4px solid #0080ff;
      transition: 0.1s;
    }
  }

  /*用户信息*/
  .user_info {
    margin-left: 40px;
    .avatar {
      display: inline-block;
      width: 40px;
      height: 40px;
      border-radius: 50px;
      border: 2px solid #3173fd;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50px;
      }
    }
    .username {
      display: inline-block;
      width: 70px;
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
