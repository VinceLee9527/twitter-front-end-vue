<template>
  <div id="side-bar">
    <div class="container">
      <ul>
        <li>
          <router-link to="/home"
            ><img class="nav-logo" src="../assets/images/logo.svg" alt="logo"
          /></router-link>
        </li>
        <li class="nav-list" :class="{ active: currentRouteName === 'home' }">
          <router-link to="/home" class="nav-link">
            <img
              class="nav-icon"
              src="../assets/images/home-icon.svg"
              alt="home-page"
            />
            <span class="nav-title">首頁</span>
          </router-link>
        </li>
        <li
          class="nav-list"
          :class="{
            active: currentRouteName === 'tweet' || 'comment' || 'liked',
          }"
        >
          <!-- link user tweet -->
          <router-link
            :to="{ name: 'tweet', params: { id: currentUser.id } }"
            class="nav-link"
          >
            <img
              class="nav-icon"
              src="../assets/images/person-icon.svg"
              alt="personal-info"
            />
            <span class="nav-title">個人資料</span>
          </router-link>
        </li>
        <li
          class="nav-list"
          :class="{ active: currentRouteName === 'user-edit' }"
        >
          <router-link to="/user/edit" class="nav-link">
            <img
              class="nav-icon"
              src="../assets/images/setting-icon.svg"
              alt="setting"
            />
            <span class="nav-title">設定</span>
          </router-link>
        </li>
        <li class="nav-list">
          <a href="#">
            <button
              class="nav-button"
              @click.stop.prevent="opencreateNewTweetModal"
            >
              推文
            </button>
          </a>
        </li>
        <li class="nav-list nav-list-logout">
          <router-link to="/signin" class="nav-link ">
            <img
              class="nav-icon"
              src="../assets/images/logout-icon.svg"
              alt="logout"
            />
            <span class="nav-title" @click="logout">登出</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@import "./../assets/styles/_navbar.scss";
</style>

<script>
import { mapState } from "vuex";

export default {
  name: "NavBar",
  data() {
    return {};
  },
  methods: {
    showPage(page) {
      this.currentpage = page;
    },
    opencreateNewTweetModal() {
      this.$store.commit("toggleCreateNewTweetModal");
    },
    logout() {
      this.$store.commit("revokeAuthentication");
      this.$router.push("/signin");
    },
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    ...mapState(["currentUser"]),
  },
};
</script>