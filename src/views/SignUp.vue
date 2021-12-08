<template>
  <div class="container">
    <div>
      <img class="logo" src="../assets/images/logo.svg" alt="logo" />
    </div>
    <div class="signup-title">建立你的帳號</div>
    <div class="page-content">
      <form action="post">
        <div class="form-group">
          <label for="account">帳號</label>
					<span class="symbol">@</span>
          <input
            type="text"
            id="account"
            name="account"
            v-model.trim="user.account"
            required
          />
        </div>
        <div class="form-group" :class="{ 'input-error': nameLengthError }">
          <label for="name">名稱</label>
          <input
            type="text"
            id="name"
            name="name"
            v-model.trim="user.name"
            required
          />
          <div class="error-message" v-show="nameLengthError">字數超出上限</div>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            v-model.trim="user.email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">密碼</label>
          <input
            type="password"
            id="password"
            name="password"
            v-model.trim="user.password"
            required
          />
        </div>
        <div class="form-group">
          <label for="checkPassword">密碼確認</label>
          <input
            type="password"
            id="checkPassword"
            name="checkPassword"
            v-model.trim="user.checkPassword"
            required
          />
        </div>
      </form>
      <div class="button-wrapper">
        <button
          class="form-button"
          @click.stop.prevent="handleSubmit"
          :disabled="isProcessing || nameLengthError"
        >
          {{ isProcessing ? "發送中" : "註冊" }}
        </button>
        <router-link to="/signin">
          <div class="cancel-button">取消</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import authorizationAPI from "../apis/authorization";
import { Toast } from "../utils/helpers";
export default {
  name: "UserForm",
  data() {
    return {
      user: {
        name: "",
        account: "",
        email: "",
        password: "",
        checkPassword: "",
      },
      isProcessing: false,
      nameLengthError: false,
    };
  },
  methods: {
    async handleSubmit() {
      try {
        //前端錯誤驗證
        if (!this.user.account) {
          Toast.fire({
            icon: "warning",
            title: "請填寫註冊帳號",
          });
          return;
        } else if (!this.user.name) {
          Toast.fire({
            icon: "warning",
            title: "請填寫註冊名稱",
          });
          return;
        } else if (this.user.name.length > 50) {
          Toast.fire({
            icon: "warning",
            title: "名稱超過字數上限",
          });
          return;
        } else if (!this.user.email) {
          Toast.fire({
            icon: "warning",
            title: "請填寫註冊信箱",
          });
          return;
        } else if (!this.user.email) {
          Toast.fire({
            icon: "warning",
            title: "請填寫註冊信箱",
          });
          return;
        } else if (!this.user.password || !this.user.checkPassword) {
          Toast.fire({
            icon: "warning",
            title: "請填寫註冊密碼",
          });
          return;
        } else if (this.user.password !== this.user.checkPassword) {
          Toast.fire({
            icon: "warning",
            title: "密碼與密碼確認不同，請重新輸入",
          });
          this.user.password = "";
          this.user.checkPassword = "";
          return;
        }
        //email驗證
        let emailRegxp = /[\w-]+@([\w-]+\.)+[\w-]+/;
        if (emailRegxp.test(this.user.email) != true) {
          Toast.fire({
            icon: "warning",
            title: "email格式錯誤",
          });
					return
        }

        const formData = {
          name: this.user.name,
          account: this.user.account,
          email: this.user.email,
          password: this.user.password,
          checkPassword: this.user.checkPassword,
        };

        this.isProcessing = true;

        const { data } = await authorizationAPI.signup({ formData });
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        this.isProcessing = false;

        //註冊成功
        Toast.fire({
          icon: "success",
          title: "註冊成功",
        });

        this.$router.push({ name: "SignIn" });
      } catch (error) {
        this.isProcessing = false;
        const { data } = error.response;
        Toast.fire({
          icon: "error",
          title: data.message,
        });
      }
    },
  },
  watch: {
    "user.name": function () {
      if (this.user.name.length > 50) {
        this.nameLengthError = true;
      } else {
        this.nameLengthError = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/_signup.scss";
</style>