<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 用户管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <div style="float:right;margin-right:20px">
          <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        :height="height"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="编号" sortable width="150"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="userId" label="邮箱"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row)"
            >删除</el-button>
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
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="50px">
        <el-form-item label="编号">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="form.userType" label="admin">管理员</el-radio>
          <el-radio v-model="form.userType" label="user">普通用户</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "basetable",
  data() {
    return {
      tableData: [],
      select_word: "",
      is_search: false,
      editVisible: false,
      delVisible: false,
      form: {
        name: "",
        id: "",
        email: "",
        userType: ""
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
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      // if (process.env.NODE_ENV === 'development') {
      //     this.url = '/ms/table/list';
      // };
      // this.$axios.post(this.url, {
      //     page: this.cur_page
      // }).then((res) => {
      //     this.tableData = res.data.list;
      // })
      const url =
        "http://localhost:9100/register/getList?name=" +
        this.select_word +
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
    },

    search() {
      this.pageSize = 10;
      this.currentPage = 1;
      this.getData();
    },
    handleEdit(row) {
      this.form = {
        name: row.name,
        id: row.id,
        email: row.userId,
        userType: row.userType
      };
      this.editVisible = true;
      if (this.form.name === localStorage.getItem("ms_username")) {
        this.editVisible = false;
        this.$message.error({
          message: "不可修改当前账号",
          center: true
        });
      }
    },
    handleDelete(row) {
      this.ids = row.id;
      this.delVisible = true;
      if (row.name === localStorage.getItem("ms_username")) {
        this.delVisible = false;
        this.$message.error({
          message: "不可删除当前账号",
          center: true
        });
      }
    },
    delAll() {
      const length = this.multipleSelection.length;
      const del_list = [];
      for (let i = 0; i < length; i++) {
        del_list[i] = this.multipleSelection[i].id;
      }
      const url = "http://localhost:9100/register/delete?ids=" + del_list;
      console.log(del_list);
      this.$axios.get(url).then(res => {
        if (res.data.code === 0) {
          this.$message.success({
            message: res.data.msg,
            center: true
          });
          this.getData();
          this.delVisible = false;
        } else {
          this.$message.error({
            message: res.data.msg,
            center: true
          });
        }
      });
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存编辑
    saveEdit() {
      if (this.form.name !== "" && this.form.email !== "") {
        const url = "http://localhost:9100/register/update";
        const par = {
          id: this.form.id,
          userId: this.form.email,
          name: this.form.name,
          userType: this.form.userType
        };
        console.log(par);
        this.$axios.post(url, par).then(res => {
          if (res.data.code === 0) {
            this.$message.success({
              message: res.data.msg,
              center: true
            });
            this.getData();
            this.editVisible = false;
          } else {
            this.$message.error({
              message: res.data.msg,
              center: true
            });
          }
        });
      } else {
        this.$message.error({
          message: "请输入完整信息",
          center: true
        });
      }
    },
    // 确定删除
    deleteRow() {
      const idList = [];
      idList[0] = this.ids;
      const url = "http://localhost:9100/register/delete?ids=" + idList;
      this.$axios.get(url).then(res => {
        if (res.data.code === 0) {
          this.$message.success({
            message: res.data.msg,
            center: true
          });
          this.getData();
          this.delVisible = false;
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
