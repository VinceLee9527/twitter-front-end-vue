<template>
  <div class="container">
    <div class="page-title">帳戶設定</div>
    <div class="page-content">
      <form class="page-content-form" @submit.stop.prevent="handleSubmit">
        <div class="form-group">
          <label for="account">帳號</label>
					<span class="symbol">@</span>
          <input
            type="text"
            id="account"
            name="account"
            v-model.trim="user.account"
          />
        </div>
        <div class="form-group" :class="{ 'input-error': nameLengthError }">
          <label for="name">名稱</label>
          <input type="text" id="name" name="name" v-model.trim="user.name" />
          <div class="error-message" v-show="nameLengthError">字數超出上限</div>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            v-model.trim="user.email"
          />
        </div>
        <div class="form-group">
          <label for="password">密碼</label>
          <input
            type="password"
            id="password"
            name="password"
            v-model.trim="user.password"
          />
        </div>
        <div class="form-group">
          <label for="checkPassword">密碼確認</label>
          <input
            type="password"
            id="checkPassword"
            name="checkPassword"
            v-model.trim="user.checkPassword"
          />
        </div>
        <div class="button-wrapper">
          <button
            type="submit"
            class="form-button"
            :disabled="isProcessing || nameLengthError"
          >
            {{ isProcessing ? "處理中" : "儲存" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { Toast } from "./../utils/helpers";
import usersAPI from "../apis/users";

export default {
  name: "UserForm",
  data() {
    return {
      user: {
        id: -1,
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
    fetchUser() {
      const { id, account, name, email } = this.currentUser;
      this.user = {
        ...this.user,
        id,
        name,
        email,
        account,
      };
    },
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
            title: "名稱字數超出上限",
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
            title: "請填寫密碼",
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
          return;
        }

        this.isProcessing = true;
        const formData = {
          account: this.user.account,
          name: this.user.name,
          email: this.user.email,
          password: this.user.password,
          checkPassword: this.user.checkPassword,
        };

        const { data } = await usersAPI.update({
          userId: this.user.id,
          formData,
        });
        //後端回傳錯誤提示資訊
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        this.isProcessing = false;

        Toast.fire({
          icon: "success",
          title: "資料修改成功",
        });

        this.user.password = "";
        this.user.checkPassword = "";
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
  created() {
    this.fetchUser();
  },
  computed: {
    ...mapState(["currentUser"]),
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
@import "../assets/styles/_userform.scss";
</style>