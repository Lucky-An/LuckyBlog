<template>
  <div
    id="DragTopo"
    class="topo_box"
  >
    <!--左侧拖拽栏 begin-->
    <div
      v-if="show_bar"
      class="bar"
    >
      <el-menu
        :default-openeds="['0','1']"
        class="el-menu-vertical-demo"
      >
        <el-submenu v-for="(type,index) in bar_list.bar" :key="index+type.name" :index="index+''">
          <template slot="title">
            <span>{{ type.name }}</span>
          </template>
          <el-menu-item
            v-for="(item,ind) in type.list"
            :key="index+'-'+ind"
            :index="index+'-'+ind"
            :title="item.name"
          >
            <div
              draggable
              @dragstart="drag($event,item.type)"
            >
              <img
                :src="bar_list.img[item.type]"
                class="topo_icon"
              >
              <br>
              <span>{{ item.name }}</span>
            </div>

          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <div
      v-show="isRemove"
      class="remove"
      @drop="dropRemove($event)"
      @dragover.prevent
    >
      <i class="el-icon-delete-solid" />
    </div>
    <!--左侧拖拽栏 end-->

    <!--画布 begin-->
    <div
      ref="canvas_box"
      class="canvas_box"
    >
      <div
        :class="'topo'+scene_type"
        class="canvas"
      >
        <!--外网盒子 begin-->
        <div
          v-for="(val,k,i) in container"
          v-if="i <= scene_type"
          :class="k"
          :key="i"
        >
          <div class="title">
            {{ val.network[0].name }}
          </div>
          <div
            :class="{showBorder:val.showBorder}"
            :type="k"
            class="node_box"
            @dragenter="enter"
            @dragleave="leave"
            @drop="drop($event,val)"
            @dragover.prevent
          >
            <div
              :class="{pon_evt}"
              class="node_content"
            >
              <div
                v-for="(item,i) in val.instance"
                :key="i"
                class="img_box"
              >
                <el-tooltip
                  :content="item.name"
                  placement="top"
                  effect="light"
                >
                  <img
                    :src="bar_list.img[item.type]"
                    :draggable="show_bar"
                    @dragstart="dragRemove($event,i,k,item)"
                    @dragend="dragendRemoce($event,i)"
                    @click="showTask(item,val.network[0])"
                  >
                </el-tooltip>
              </div>
              <div
                v-for="(item,i) in val.entity"
                :key="item.uuid"
                class="img_box"
              >
                <el-tooltip
                  :content="item.name"
                  placement="top"
                  effect="light"
                >
                  <img
                    :src="bar_list.img[item.type]"
                    :draggable="show_bar"
                    @dragstart="dragRemove($event,i,k,item)"
                    @dragend="dragendRemoce($event,i)"
                    @click="showTask(item,val.network[0])"
                  >
                </el-tooltip>
              </div>
            </div>
          </div>
          <!--点击的网络盒子-->
          <div
            v-if="show_bar"
            class="net"
            @click="handleNet(val.network[0],k)"
          />
        </div>
      </div>
    </div>
    <!--画布 end-->
  </div>
</template>

<script>

export default {
  name: 'Index',
  props: {
    show_bar: {
      // 是否展示左侧拖拽
      type: Boolean,
      default: false
    },
    scene_type: {
      // 1二层  2三层  3四层 4自由
      type: Number,
      default: 3
    },
    container: {
      // 拓扑的基本数据
      type: Object,
      default: () => {
        return {
          dmz: {
            // 外网
            entity: [],
            network: [
              {
                mask: '255.255.0.0',
                name: '外网（DMZ）',
                gateway: '10.10.20.1',
                last_ip: '10.10.20.100',
                first_ip: '10.10.20.10'
              }
            ],
            instance: [],
            showBorder: false // 拖拽进入展示边框
          },
          internal_network: {
            // 内网
            entity: [],
            network: [
              {
                mask: '255.255.255.0',
                name: '内网（服务器区）',
                gateway: '192.168.10.1',
                last_ip: '192.168.10.200',
                first_ip: '192.168.10.10'
              }
            ],
            instance: [],
            showBorder: false // 拖拽进入展示边框
          },
          core_network: {
            // 核心内网
            entity: [],
            network: [
              {
                mask: '255.255.255.0',
                name: '核心内网（核心数据）',
                gateway: '192.168.99.1',
                last_ip: '192.168.99.200',
                first_ip: '192.168.99.10'
              }
            ],
            instance: [],
            showBorder: false // 拖拽进入展示边框
          },
          office_network: {
            // 办公网
            entity: [],
            network: [
              {
                mask: '255.255.255.0',
                name: '办公网',
                gateway: '10.10.4.1',
                last_ip: '10.10.4.100',
                first_ip: '10.10.4.10'
              }
            ],
            instance: [],
            showBorder: false // 拖拽进入展示边框
          }
        }
      }
    },
    bar_list: {
      // 拓扑的基本数据
      type: Object,
      default: () => {
        return {// 左侧拖拽栏列表
          bar: [{
            name: '虚拟设备',
            list: [
              {
                name: '虚拟机',
                type: 'kvm'
              }
            ]
          }],
          img: {
            kvm: require('@/assets/dragTopo/answered.png')
          }
        }
      }
    }
  },
  data() {
    return {
      pon_evt: false, // css知否置于最底层
      isNode: false, // 拖拽的是左侧导航还是已选的题目 true 左侧 false题目
      isRemove: false // 是否展示删除弹框
    }
  },
  methods: {
    // 展示网络信息
    handleNet(net, k) {
      this.$emit('handleNet', net, k)
    },
    // 展示题目信息
    showTask(node, container) {
      this.$emit('handleTask', node, container)
    },
    // 拖拽开始
    drag(e, type) {
      this.isNode = true
      e.dataTransfer.setData('type', type)
    },
    // 拖拽进入
    enter(e) {
      if (this.isNode) {
        this.pon_evt = true
        this.container[e.target.getAttribute('type')].showBorder = true
      }
    },
    // 拖拽离开
    leave(e) {
      this.clearAll(e)
    },
    // 在目标元素拖拽完成
    drop(e, val) {
      const type = e.dataTransfer.getData('type')
      if (this.isNode) {
        this.clearAll(e)
        this.$emit('handleDrag', e, val, type)
      }
    },
    // 清空所有拖拽带来的数据
    clearAll(e) {
      this.pon_evt = false
      const type = e.target.getAttribute('type')
      if (type) this.container[type].showBorder = false
    },
    // 拖拽删除已选择的题目
    dragRemove(e, i, type, node) {
      this.isNode = false
      this.isRemove = true
      // 存储删除的索引
      e.dataTransfer.setData('index', '' + i)
      // 存储删除的题目所属的组
      e.dataTransfer.setData('type', type)
      // 存储删除题目的题目类型
      e.dataTransfer.setData('challenge_type', node.type)
    },
    // 拖拽松开删除
    dragendRemoce(e) {
      this.isRemove = false
    },
    dropRemove(e) {
      const index = e.dataTransfer.getData('index')
      const type = e.dataTransfer.getData('type')
      const challenge_type = e.dataTransfer.getData('challenge_type')
      this.$confirm('确定要删除吗？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('handleRemove', type, index, challenge_type)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
.bar {
  border: 1px solid #dddddd;
  width: 120px;
}

.topo_box {
  width: 100%;
  height: 100%;
  display: flex;
}

.canvas_box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.canvas {
  width: 1129px;
  height: 668px;
  position: relative;
}
.topo1 {
  background: url("~@/assets/dragTopo/bg2.png") no-repeat;
}
.topo2 {
  background: url("~@/assets/dragTopo/bg3.png") no-repeat;
}
.topo3 {
  background: url("~@/assets/dragTopo/bg4.png") no-repeat;
}

.net {
  width: 66px;
  height: 24px;
  transform: skew(57deg) rotate(-15deg);
  cursor: pointer;
}

.net:hover {
  width: 66px;
  height: 24px;
  background: rgba(0, 0, 0, 0.1);
  transform: skew(57deg) rotate(-15deg);
  cursor: pointer;
}

/*外网盒子*/
.dmz {
  position: absolute;
  left: 614px;
  top: 21px;
}

.dmz .net {
  position: absolute;
  top: 126px;
  left: -46px;
}

/*办公网盒子*/
.office_network {
  position: absolute;
  left: 863px;
  top: 319px;
}

.office_network .net {
  position: absolute;
  top: 42px;
  left: -194px;
}

/*内网盒子*/
.internal_network {
  position: absolute;
  left: 567px;
  top: 486px;
}
.internal_network .net {
  position: absolute;
  top: -105px;
  left: 66px;
}

/*核心内网*/
.core_network {
  position: absolute;
  left: 218px;
  top: 420px;
}
.core_network .net {
  position: absolute;
  top: -19px;
  left: 220px;
}

/*盒子里面的公用样式 begin*/
.title {
  position: absolute;
  bottom: 108px;
  width: 100px;
  line-height: 29px;
  background-color: rgba(78, 163, 255, 0.1);
  text-align: center;
  transform: rotate(-27deg) skew(-19deg);
}

.node_box {
  width: 212px;
  min-height: 154px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.node_content {
  max-width: 60%;
  /*transform: rotate(-49deg);*/
  transform: rotateX(58deg) rotate(-42deg);
}

.img_box {
  float: right;
  width: 42px;
  height: 45px;
  position: relative;
  /*border: 1px solid red;*/
}

.node_content img {
  transform: rotate(44deg);
  position: absolute;
  top: -60px;
  left: 23px;
  width: 39px;
  height: 122px;
  cursor: pointer;
}

.node_content img:hover {
  z-index: 9;
}

.node_box:before {
  content: ""; /* To generate the box */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: #1b3481;
  transform: rotateX(56deg) rotate(-43deg);
  border-radius: 10px;
}

.node_box:after {
  content: ""; /* To generate the box */
  position: absolute;
  top: 15%;
  left: 15%;
  right: 0;
  bottom: 0;
  z-index: -1;
  width: 70%;
  height: 70%;
  background: #6779aa;
  transform: rotateX(56deg) rotate(-43deg);
  border-radius: 10px;
}

.showBorder:after {
  background: #fff3b5;
}

/*将元素放置在最底层，从而阻止多次触发leave事件*/
.pon_evt {
  pointer-events: none;
}

/*盒子里面的公用样式 end*/

/*删除的公共样式*/
.remove {
  position: absolute;
  left: 0;
  top: 0;
  width: 118px;
  height: 100%;
  background: #f15656;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 30px;
}
</style>

<style lang="scss">
#DragTopo {
  width: 100%;
  height: 100%;
  color: #000;
  position: relative;

  .header {
    width: 100%;
    height: 50px;
    border-bottom: 1px solid saddlebrown;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content {
    height: calc(100vh - 110px);
    display: flex;
  }

  .menu {
    width: 180px;
  }

  .el-menu {
    height: 100%;
  }

  .el-menu .el-menu-item {
    min-width: auto;
    line-height: 30px;
    min-height: 65px;
    height: auto;
    text-align: center;
    padding: 0 !important;
  }

  .el-menu .topo_icon {
    pointer-events: none;
    height: 32px;
  }

  .topo_box {
    border: 1px solid #000;
    flex: 1;
    position: relative;
  }

  .right-click-menu {
    position: absolute;
    width: 180px;
    display: none;
    background-color: #ffffff;
    border: 1px solid #b7c8f6;
    z-index: 9;
    cursor: pointer;

    div {
      padding: 5px;
    }
  }

  .add_line {
    position: absolute;
    display: none;
    z-index: 9;
    height: 17px;
    cursor: pointer;
  }

  .line {
    width: 15px;
    height: 15px;
  }

  .info_box {
    width: 250px;
    height: 100%;
    padding: 10px;
    overflow: auto;
  }
}
</style>
