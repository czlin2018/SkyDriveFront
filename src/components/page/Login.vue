<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">陈泽林的分布式网盘管理系统</div>
      <div v-if="!showReg">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="0px"
          class="ms-content"
        >
          <el-form-item prop="name">
            <el-input v-model="ruleForm.name" placeholder="账户(邮箱或用户名)">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="密码"
              v-model="ruleForm.password"
              @keyup.enter.native="submitForm(ruleForm)"
            >
              <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
            </el-input>
          </el-form-item>
          <div class="login-btn">
            <el-button type="primary" @click="submitForm(ruleForm)">登录</el-button>
          </div>
          <p class="login-tips">
            Tips : 缺少账号的用请
            <el-button type="text" size="medium" @click="openReg">注册</el-button>
          </p>
        </el-form>
      </div>
      <div v-if="showReg">
        <el-form
          v-if="showReg"
          :model="regForm"
          :rules="regRules"
          ref="regForm"
          label-width="0px"
          class="ms-content"
        >
          <el-form-item prop="names">
            <el-input v-model="regForm.names" placeholder="请输入用户名">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="regForm.email" placeholder="请输入邮箱地址">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="passwords">
            <el-input type="password" placeholder="请输入密码" v-model="regForm.passwords">
              <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input type="password" placeholder="请再次输入密码" v-model="regForm.checkPass">
              <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
            </el-input>
          </el-form-item>

          <el-form-item prop="code">
            <el-input
              placeholder="请输入邮箱验证码"
              v-model="regForm.code"
              style="width:60%;margin-right:10px"
            >
              <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
            </el-input>
            <el-button
              type="primary"
              size="mini"
              @click="acceptCode"
              :disabled="disabled"
            >{{codeStauts}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-radio disabled v-model="regForm.userType" label="admin">管理员</el-radio>
            <el-radio checked v-model="regForm.userType" label="user">普通用户</el-radio>
          </el-form-item>
          <div class="login-btn">
            <el-button type="primary" @click="reg(regForm)">注册</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { connect } from "net";
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.regForm.passwords) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: "",
        password: ""
      },
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      regForm: {
        names: "",
        passwords: "",
        checkPass: "",
        email: "",
        code: "",
        userType: "user"
      },
      regRules: {
        names: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        passwords: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      showReg: false, //控制注册页面
      disabled: false,
      codeStauts: "获取验证码"
    };
  },
  methods: {
    submitForm(formName) {
      const par = {
        name: formName.name,
        password: formName.password
      };
      this.$axios
        .post("http://localhost:9100/register/joinIn", par)
        .then(res => {
          console.log("res", res);
          if (res.data.code === 0) {
            this.$message.success({
              message: res.data.msg,
              center: true
            });
            localStorage.setItem("ms_username", res.data.data.name);
            localStorage.setItem("ms_id", res.data.data.userId);
            localStorage.setItem("user_type", res.data.data.userType);
            this.$router.push("/dashboard");
          } else {
            this.$message.error({
              message: res.data.msg,
              center: true
            });
          }
        });
    },
    openReg() {
      this.showReg = true;
    },
    reg(regName) {
      const par = {
        verificationCode: regName.code,
        userId: regName.email,
        password: regName.passwords,
        name: regName.names,
        userType: regName.userType
      };
      this.$axios
        .post("http://localhost:9100/register/insert", par)
        .then(res => {
          console.log("res", res);
          if (res.data.code === 0) {
            this.$message.success({
              message: res.data.msg,
              center: true
            });

            this.showReg = false;
            this.ruleForm.name = regName.email;
            this.ruleForm.password = regName.passwords;
          } else {
            this.$message.error({
              message: res.data.msg,
              center: true
            });
          }
        });
    },
    acceptCode() {
      this.$axios
        .get(
          "http://localhost:9100/register/getVerificationCode?userId=" +
            this.regForm.email
        )
        .then(res => {
          if (res.data.code === 0) {
            this.disabled = true;
            this.codeStauts = "获取成功";
          } else {
            this.disabled = false;
            this.codeStauts = "重新获取";
          }
        });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: black;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 75%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 15px;
  line-height: 30px;
  color: #fff;
}
</style>
