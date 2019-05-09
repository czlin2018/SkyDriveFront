<template>
  <div style="margin:15px;">
    <div style="margin-bottom:15px;">
      <el-button type="primary" size="mini" @click="openFile">
        创建文件夹
        <i class="el-icon-edit el-icon--right"></i>
      </el-button>
      <el-upload
        class="upload-demo"
        :data="uploadData"
        :show-file-list="false"
        action="http://localhost:9200/createFile"
        :on-success="upload_success"
        :before-upload="before_upload"
        :limit="1"
        style="display:inline-block;margin: 0 5px;"
      >
        <el-button type="primary" size="mini" @click="upload">
          上传
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
      </el-upload>
      <el-button type="primary" size="mini" @click="openGetCode">
        获得分享
        <i class="el-icon-edit el-icon--right"></i>
      </el-button>
    </div>
    <div style="margin-bottom:15px;">
      <el-button type="text" size="mini" @click="backAll" :disabled="showBtn">全部文件</el-button>
      <span style="display:inline-block;margin: 0 5px;">|</span>
      <el-button type="text" size="mini" :disabled="showBtn" @click="backPrev">返回上一级</el-button>
      <span v-if="this.path !== '/'" style="display:inline-block;margin: 0 5px;">- {{showPath}}</span>
    </div>
    <el-table :data="tableData" :height="height" style="width: 100%">
      <el-table-column label="文件夹名称">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.directory"
            type="text"
            size="mini"
            @click="changePath(scope.row.name)"
          >{{scope.row.name}}</el-button>
          <span v-if="!scope.row.directory">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="deletefile(scope.row)">删除</el-button>
          <span v-if="!scope.row.directory" style="display:inline-block;margin: 0 5px;">|</span>
          <el-button
            v-if="!scope.row.directory"
            type="text"
            size="mini"
            @click="downLoad(scope.row.fullPath)"
          >下载</el-button>
          <span v-if="!scope.row.directory" style="display:inline-block;margin: 0 5px;">|</span>
          <el-button
            v-if="!scope.row.directory"
            type="text"
            size="mini"
            @click="createCode(scope.row.fullPath)"
          >生成分享码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="创建文件夹" :visible.sync="fileVisible" width="450px" top="30vh">
      <el-input
        size="mini"
        v-model="directoryName"
        style="display:inline-block;width:340px;margin-right:10px;"
      ></el-input>
      <el-button type="primary" size="mini" @click="saveFile">保存</el-button>
    </el-dialog>
    <el-dialog title="获取分享码" :visible.sync="getCreatCodeFlag" width="30%">
      <span>获取成功：{{fileCode}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="getCreatCodeFlag = false">取 消</el-button>
        <el-button type="primary" @click="getCreatCodeFlag = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="得到分享码" :visible.sync="getGetCodeFlag">
      <el-form>
        <el-form-item label="请输入分享码">
          <el-input v-model="fileCodeFromOter" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="getGetCodeFlag = false;fileCodeFromOter=''">取 消</el-button>
        <el-button type="primary" @click="getCode">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { constants } from "crypto";
export default {
  name: "uPloadAddDownload",
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      height: document.documentElement.clientHeight - 295,
      tableData: [],
      path: "/", //请求路径
      fileVisible: false, //创建文件夹弹窗
      fileName: "", //新建文件名
      userId: "", //当前账户
      curruntFile: "", //当前选择文件夹
      fileList: [],
      uploadData: {},
      delPath: "",
      getCreatCodeFlag: false,
      fileCode: "",
      getGetCodeFlag: false,
      fileCodeFromOter: "",
      directoryName:""
    };
  },
  computed: {
    showBtn() {
      if (this.path !== "/") {
        return false;
      } else {
        return true;
      }
    },
    showPath() {
      return this.path.slice(1);
    }
  },
  // 页面创建的时候
  created() {
    this.funData();
  },
  methods: {
    // 分页导航
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableList();
    },
    funData() {
      this.userType= localStorage.getItem("user_type"),
      this.userId =  localStorage.getItem("ms_id");
      this.getTableList();
    },
    // 获取table数据
    getTableList() {
      const url = "http://localhost:9200/readPathInfo";
      const params = {
        path: this.path,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        userId: this.userId,
        userType: this.userType
      };

      this.$axios.get(url, params).then(res => {
        if (res.data.code === 0) {
          this.$message.success({
            message: res.data.msg,
            center: true
          });
          const tempData = res.data.data.pageData;
          this.tableData = tempData;
          this.total = res.data.data.totalCount;
        } else {
          this.$message.error({
            message: res.data.msg,
            center: true
          });
        }
      });
    },
    // 进入文件夹获取新文件数组
    changePath(name) {
      this.curruntFile = name;
      this.path = this.path === "/" ? this.path + name : this.path + "/" + name;
      this.funData();
    },
    // 打开创建文件夹弹窗
    openFile() {
      this.fileVisible = true;
    },
    // 保存新增文件夹
    saveFile() {
      const par = {
        path: this.path ,
        directoryName:this.directoryName,
        userId:this.userId,
        userType:this.userType
      };

      this.$axios.post("http://localhost:9200/mkdir", par).then(res => {
        if (res.data.code === 0) {
          this.$message.success({
            message: res.data.msg,
            center: true
          });
          this.funData();
          this.fileVisible = false;
          this.fileName = "";
        } else {
          this.$message.error({
            message: res.data.msg,
            center: true
          });
        }
      });
    },
    // 返回全部文件
    backAll() {
      this.path = "/";
      this.funData();
    },
    // 返回上一级
    backPrev() {
      const path = this.path.split("/");
      const length = path[path.length - 1].length;
      const end = this.path.length - length - 1;
      this.path = this.path.slice(0, end);
      if (this.path === "") {
        this.path = "/";
      }
      console.log(this.path);
      this.funData();
    },
    upload() {
      const par = {
        path: this.path
      };
      this.uploadData.path = par.path;
      this.uploadData.userId = this.userId;
      this.uploadData.userType = this.userType;
    },
    upload_success(response, file, fileList) {
      this.funData();
    },
     before_upload(file) {
      console.log(file.size)
    },

    createCode(fullPath) {
      const url = "http://localhost:9200/createCode";
      const params = {
        fullPath: fullPath
      };
      this.$axios.post(url, params).then(res => {
        if (res.data.code === 0) {
          (this.fileCode = res.data.data), (this.getCreatCodeFlag = true);
        } else {
          this.$message.error({
            message: res.data.msg,
            center: true
          });
        }
      });
    },
    openGetCode() {
      this.getGetCodeFlag = true;
    },
    getCode() {
      const url = "http://localhost:9200/getCode";
      const params = {
        path: this.path,
        fileCodeFromOter: this.fileCodeFromOter,
        userId: this.userId,
        userType:this.userType
      };
      this.$axios.post(url, params).then(res => {
        if (res.data.code === 0) {
          (this.fileCode = res.data.data),
            (this.fileCodeFromOter = ""),
            (this.getCreatCodeFlag = true);
        } else {
          this.$message.error({
            message: res.data.msg,
            center: true
          });
        }
        this.getCreatCodeFlag = false;
        this.getGetCodeFlag = false;

        this.funData();
      });
    },

    downLoad(fullPath) {
      const par = {
        path: fullPath
      };
      this.$axios.post("http://localhost:9200/downloadFile", par).then(res => {
        if (res.data.code === 0) {
          this.$message.success({
            message: res.data.msg,
            center: true
          });
        } else {
          this.$message.error({
            message: res.data.msg,
            center: true
          });
        }
        this.funData();
      });
    },
    deletefile(row) {

      const url = "http://localhost:9200/deleteFile";
      const params = {
        fullPath: row.fullPath,
        id:row.id,
        isShare:row.isShare
      };
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            this.$axios.get(url, params)
            .then(res => {
              if (res.data.code === 0) {
                this.$message.success({
                  message: res.data.msg,
                  center: true
                });
                this.funData();
              } else {
                this.$message.error({
                  message: res.data.msg,
                  center: true
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

