<template>
  <div class="container">
    <Navbar />
    <div class="main-container">
      <Spinner v-if="isLoading" />
      <UserFollowedFeed
        v-if="!isLoading"
        :followers="followers"
        :userTweetsCount="userTweetsCount"
        :user="user"
        @update-followed="updateFollowed"
      />
    </div>
    <PopularBar @after-follow-click="afterFollowClick" />
    <div class="modal">
      <CreateNewTweetModal
        v-show="openCreateNewTweetModal"
        @after-add-tweet="afterAddTweet"
      />
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import PopularBar from "../components/PopularBar.vue";
import UserFollowedFeed from "../components/UserFollowedFeed.vue";
import CreateNewTweetModal from "../components/CreateNewTweetModal.vue"
import Spinner from "../components/Spinner.vue";
import usersAPI from "../apis/users";
import { mapState } from "vuex";
import { Toast } from "../utils/helpers";

export default {
  name: "UserFollowed",
  components: {
    Navbar,
    UserFollowedFeed,
    PopularBar,
		CreateNewTweetModal,
    Spinner,
  },
  data() {
    return {
      user: "",
      followers: [],
      userTweetsCount: "",
      isLoading: true,
    };
  },
  methods: {
    async getUser(userId) {
      try {
        const response = await usersAPI.getUser({ userId });
        this.user = response.data;
      } catch (error) {
        Toast.fire({ icon: "warning", title: "無法取得使用者資料請後再試" });
      }
    },
    async fetchFollowers(userId) {
      try {
        this.isLoading = true;
        const { data } = await usersAPI.getFollowers({ userId });
        this.followers = data;
        this.isLoading = false;
      } catch (error) {
        Toast.fire({
          icon: "warning",
          title: "無法取得跟隨者資料，請稍後再試",
        });
      }
    },
    async fetchTotaltweets(userId) {
      try {
        this.isLoading = true;
        const { data } = await usersAPI.getTotalTweets({ userId });
        this.userTweetsCount = data.length;
        this.isLoading = false;
      } catch (error) {
        Toast.fire({
          icon: "warning",
          title: "無法取得所有推文資料，請稍後再試",
        });
      }
    },
    //子層觸發渲染畫面
    updateFollowed() {
      const { id } = this.$route.params;
      this.fetchFollowers(id);
    },
    afterFollowClick() {
      this.fetchFollowers(this.user.id);
    },
    afterAddTweet() {
      this.$store.commit("toggleCreateNewTweetModal");
      this.$router.push("/");
    },
  },
  created() {
    const { id } = this.$route.params;
    this.fetchFollowers(id);
    this.getUser(id);
    this.fetchTotaltweets(id);
    console.log(id);
  },
  computed: {
    ...mapState(["openCreateNewTweetModal"]),
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  display: flex;
  .main-container {
    flex: 1;
  }
  .modal {
    position: fixed;
  }
}
</style>
