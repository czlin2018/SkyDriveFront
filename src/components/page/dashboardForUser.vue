<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <div class="user-info">
            <img src="../../assets/img/img.jpg" class="user-avator" alt>
            <div class="user-info-cont">
              ·
              <div class="user-info-name">{{name}}</div>
              <div>{{role}}</div>
            </div>
          </div>
          <div class="user-info-list">
            当前系统时间：
            <span>{{ curretTime }}</span>
          </div>
        </el-card>
        <el-card shadow="hover" style="height:252px;">
          <div slot="header" class="clearfix">
            <span>网盘容量</span>
          </div>
          <div style="text-align: center">
            <el-progress type="circle" :percentage="scale" color="#8e71c7"></el-progress>
          </div>
          <dev style="text-align: center">
            网盘容量:{{size}}MB,已使用{{sizeHadUsred}}Mb,点击
            <el-button type="text" size="medium" @click="openApply">申请容量</el-button>
          </dev>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-lx-people grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{userNum}}</div>
                  <div>用户数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-lx-notice grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{sourceNum}}</div>
                  <div>系统文件量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-lx-goods grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{chickNum}}</div>
                  <div>网站点击量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover" style="height:403px;">
          <div slot="header" class="clearfix">
            <span>待办事项</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="openAddEvent">添加</el-button>
          </div>
          <el-table
            :data="todoList"
            :show-header="false"
            height="304"
            style="width: 100%;font-size:14px;"
          >
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.status"
                  @change="updateEvent(scope.row.id,scope.row.status)"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <div
                  class="todo-item"
                  :class="{'todo-item-del': scope.row.status}"
                >{{scope.row.title}}</div>
              </template>
            </el-table-column>
            <el-table-column width="60">
              <template slot-scope="scope">
                <!-- <el-button type="primary" icon="el-icon-delete" @click="del"></el-button> -->
                <i class="el-icon-delete" @click="del(scope.row.id)"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <schart
            ref="bar"
            class="schart"
            canvasId="bar"
            :data="data"
            type="bar"
            :options="options"
          ></schart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <schart
            ref="line"
            class="schart"
            canvasId="line"
            :data="data"
            type="line"
            :options="options2"
          ></schart>
        </el-card>
      </el-col>
    </el-row>-->
    <el-dialog title="申请容量" :visible.sync="apply">
      <el-form>
        <el-form-item label="申请容量大小(MB)">
          <el-input v-model="applySize" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="申请容量理由">
          <el-input v-model="applyRes" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="apply = false;applySize='';applyRes=''">取 消</el-button>
        <el-button type="primary" @click="SentApply">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加事件" :visible.sync="addEvent">
      <el-form>
        <el-form-item label="事件内容">
          <el-input v-model="event" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addEvent = false;event=''">取 消</el-button>
        <el-button type="primary" @click="SentEvent">确 定</el-button>
      </div>
    </el-dialog>
    <template>
      <el-carousel :interval="2000" type="card" height="200px">
        <el-carousel-item v-for="item in imagesbox" :key="item.id">
          <img :src="item.idView" class="image" style="width:100%; height: 100%">
        </el-carousel-item>
      </el-carousel>
    </template>
  </div>
</template>
  </div>
  
</template>

<script>
import Schart from "vue-schart";
import bus from "../common/bus";
export default {
  name: "dashboardForUser",
  data() {
    return {
      name: localStorage.getItem("ms_username"),
      size: "",
      sizeHadUsred: "",
      scale: 0,
      apply: false,
      addEvent: false,
      applyRes: "",
      applySize: "",
      event: "",
      chickNum: "",
      imagesbox: [
        {
          id: 0,
          idView: require("../../assets/img/1.jpg")
        },
        {
          id: 1,
          idView: require("../../assets/img/2.jpg")
        },
        {
          id: 2,
          idView: require("../../assets/img/3.jpg")
        },
        {
          id: 3,
          idView: require("../../assets/img/4.jpeg")
        }
      ],

      todoList: [
        {
          title: "今天要研究下框架",
          status: false
        },
        {
          title: "明天要写好登陆",
          status: false
        }
      ],
      data: [
        {
          name: "2018/09/04",
          value: 1083
        },
        {
          name: "2018/09/05",
          value: 941
        },
        {
          name: "2018/09/06",
          value: 1139
        },
        {
          name: "2018/09/07",
          value: 816
        },
        {
          name: "2018/09/08",
          value: 327
        },
        {
          name: "2018/09/09",
          value: 228
        },
        {
          name: "2018/09/10",
          value: 1065
        }
      ],
      options: {
        title: "最近七天每天的用户访问量",
        showValue: false,
        fillColor: "rgb(45, 140, 240)",
        bottomPadding: 30,
        topPadding: 30
      },
      options2: {
        title: "最近七天用户访问趋势",
        fillColor: "#FC6FA1",
        axisColor: "#008ACD",
        contentColor: "#EEEEEE",
        bgColor: "#F5F8FD",
        bottomPadding: 30,
        topPadding: 30
      },
      curretTime: "",
      userNum: "",
      sourceNum: ""
    };
  },
  components: {
    Schart
  },
  computed: {
    role() {
      this.name =
        localStorage.getItem("user_type") === "admin"
          ? "超级管理员"
          : "普通用户";
    }
  },
  created() {
    this.handleListener();
    this.changeDate();
    this.getSize();
    this.timeOut();
    this.getUserNum();
    this.getSourceNum();
    this.getEvent();
    this.getChickNum();
  },
  activated() {
    this.handleListener();
  },
  deactivated() {
    window.removeEventListener("resize", this.renderChart);
    bus.$off("collapse", this.handleBus);
  },
  methods: {
    changeDate() {
      const now = new Date().getTime();
      this.data.forEach((item, index) => {
        const date = new Date(now - (6 - index) * 86400000);
        item.name = `${date.getFullYear()}/${date.getMonth() +
          1}/${date.getDate()}`;
      });
    },
    handleListener() {
      bus.$on("collapse", this.handleBus);
      // 调用renderChart方法对图表进行重新渲染
      window.addEventListener("resize", this.renderChart);
    },
    handleBus(msg) {
      setTimeout(() => {
        this.renderChart();
      }, 300);
    },
    renderChart() {
      if (this.$refs.bar) {
        console.log(this.$refs.bar);
        this.$refs.bar.renderChart();
        this.$refs.line.renderChart();
      }
    },
    openApply() {
      this.apply = true;
    },
    openAddEvent() {
      this.addEvent = true;
    },
    timeOut() {
      setInterval(() => {
        this.curretTime = new Date().toLocaleString();
      }, 1000);
    },
    getChickNum() {
      this.$axios
        .get("http://localhost:9100/register/getChickNum")
        .then(res => {
          if (res.data.code === 0) {
            this.chickNum = res.data.data;
          } else {
            this.$message.error({
              message: res.data.msg,
              center: true
            });
          }
        });
    },
    del(id) {
      const par = {
        id: id
      };
      this.$axios.get("http://localhost:9200/delEvent", par).then(res => {
        if (res.data.code === 0) {
          this.$message.success({
            message: res.data.msg,
            center: true
          });

          this.getEvent();
        } else {
          this.$message.error({
            message: res.data.msg,
            center: true
          });
        }
      });
    },
    updateEvent(id, status) {
      const par = {
        id: id,
        status: status === true ? true : false
      };
      this.$axios.get("http://localhost:9200/updateEvent", par).then(res => {
        if (res.data.code === 0) {
          this.$message.success({
            message: res.data.msg,
            center: true
          });
          this.getEvent();
          this.addEvent = false;
        } else {
          this.$message.error({
            message: res.data.msg,
            center: true
          });
        }
      });
    },
    SentEvent() {
      console.log("添加事件");
      const par = {
        userId: localStorage.getItem("ms_id"),
        toAdmin: 0,
        event: this.event
      };
      this.$axios.post("http://localhost:9200/setEvent", par).then(res => {
        if (res.data.code === 0) {
          this.$message.success({
            message: res.data.msg,
            center: true
          });
          this.addEvent = false;
          this.getEvent();
        } else {
          this.$message.error({
            message: res.data.msg,
            center: true
          });
        }
      });
    },
    SentApply() {
      console.log("发送申请");
      const par = {
        userId: localStorage.getItem("ms_id"),
        toAdmin: 1,
        event:
          localStorage.getItem("ms_id") +
          "申请容量" +
          this.applySize +
          "MB,理由:" +
          this.applyRes
      };
      this.$axios.post("http://localhost:9200/setEvent", par).then(res => {
        if (res.data.code === 0) {
          this.$message.success({
            message: res.data.msg,
            center: true
          });
          this.apply = false;
          this.getEvent();
        } else {
          this.$message.error({
            message: res.data.msg,
            center: true
          });
        }
      });
    },
    getEvent() {
      console.log("获得事件");
      const par = {
        userId: localStorage.getItem("ms_id"),
        userType: localStorage.getItem("user_type")
      };
      this.$axios.get("http://localhost:9200/getEvent", par).then(res => {
        if (res.data.code === 0) {
          this.todoList = res.data.data.pageData;
        } else {
        }
      });
    },
    getSize() {
      console.log("获得大小");
      this.$axios
        .get(
          "http://localhost:9200/getSize?userId=" +
            localStorage.getItem("ms_id")
        )
        .then(res => {
          console.log("res", res);
          if (res.data.code === 0) {
            this.size = res.data.data.size;
            this.sizeHadUsred = res.data.data.sizeHadUsred;
            this.scale = res.data.data.scale;
          }
        });
    },
    getUserNum() {
      this.$axios.get("http://localhost:9100/register/getUserNum").then(res => {
        if (res.data.code === 0) {
          this.userNum = res.data.data;
        } else {
          this.$message.error({
            message: res.data.msg,
            center: true
          });
        }
      });
    },
    getSourceNum() {
      this.$axios.get("http://localhost:9200/getSourceNum").then(res => {
        if (res.data.code === 0) {
          this.sourceNum = res.data.data;
        } else {
          this.$message.error({
            message: res.data.msg,
            center: true
          });
        }
      });
    }
  }
};
</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}

.el-carousel__item h3 {
  color: #4a8fe9;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
