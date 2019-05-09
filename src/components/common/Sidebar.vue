<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu  v-if="(item.forAdmin && isAdmin) || (item.forUser && !isAdmin)"  :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item v-if="(item.forAdmin && isAdmin) || (item.forUser && !isAdmin)" :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-lx-home",
          index: "dashboard",
          title: "管理员首页",
          forUser: false,
          forAdmin: true
        },
          {
          icon: "el-icon-lx-home",
          index: "dashboardForuser",
          title: "用户首页",
          forUser: true,
          forAdmin: false
        },
        {
          icon: "el-icon-lx-cascades",
          index: "table",
          forUser: false,
          title: "用户管理",
          forAdmin: true
        },
        {
          icon: "el-icon-lx-copy",
          index: "uPloadAddDownload",
          forUser: true,
          title: "文件管理",
          forAdmin: true
        },
        {
          icon: "el-icon-lx-calendar",
          index: "3",
          forUser: false,
          title: "表单相关",
          forAdmin: false,
          subs: [
            {
              index: "form",
              title: "基本表单"
            },
            {
              index: "3-2",
              title: "三级菜单",
              subs: [
                {
                  index: "editor",
                  title: "富文本编辑器"
                },
                {
                  index: "markdown",
                  title: "markdown编辑器"
                }
              ]
            },
            {
              index: "upload",
              title: "文件上传"
            }
          ]
        },
        {
          icon: "el-icon-lx-emoji",
          index: "icon",
          forUser: false,
          title: "自定义图标",
          forAdmin: false
        },
        {
          icon: "el-icon-lx-favor",
          index: "charts",
          forUser: false,
          title: "schart图表",
          forAdmin: false
        },
        {
          icon: "el-icon-rank",
          index: "6",
          forUser: false,
          title: "拖拽组件",
          forAdmin: false,
          subs: [
            {
              index: "drag",
              title: "拖拽列表"
            },
            {
              index: "dialog",
              title: "拖拽弹框"
            }
          ]
        },
        {
          icon: "el-icon-lx-warn",
          index: "7",
          forUser: false,
          forAdmin: false,
          title: "错误处理",
          subs: [
            {
              index: "permission",
              title: "权限测试"
            },
            {
              index: "404",
              title: "404页面"
            }
          ]
        }
      ],
      isAdmin: true
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
    //
    this.isAdmin = localStorage.getItem("user_type") == 'admin';
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
