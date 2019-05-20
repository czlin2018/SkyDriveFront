<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 文件上传中心
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-table
        :data="tableData"
        border
        class="table"
        :height="height"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="编号" sortable width="150"></el-table-column>
        <el-table-column prop="resourceName" label="文件名" width="200"></el-table-column>
        <el-table-column prop="status" label="状态" align="center">上传中...</el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180" align="center"></el-table-column>
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
    </div>
  </div>
</template>

<script>
export default {
  name: "ResourceUploading",
  data() {
    return {
      spell: 0,
      tableData: [],
      select_word: "",
      is_search: false,
      editVisible: false,
      delVisible: false,
      form: {
        id: "",
        resourceName: "",
        updateTime: ""
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      ids: 0,
      height: document.documentElement.clientHeight - 345,
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 分页导航
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    getData() {
      const url =
        "http://localhost:9200/getUploadingSource?userId=" +
        localStorage.getItem("ms_id") +
        "&pageSize=" +
        this.pageSize +
        "&pageNo=" +
        this.currentPage;
      this.$axios.get(url).then(res => {
        if (res.data.code === 0) {
          this.total = res.data.data.totalCount;
          this.tableData = res.data.data.pageData;
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
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
</style>
