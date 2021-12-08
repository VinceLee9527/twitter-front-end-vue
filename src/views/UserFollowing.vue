<template>
  <div class="container">
    <Navbar />
    <div class="main-container">
      <Spinner v-if="isLoading" />
      <UserFollowingFeed
        v-if="!isLoading"
        :followings="followings"
        :userTweetsCount="userTweetsCount"
        :user="user"
        @update-following="updateFollowing"
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
import UserFollowingFeed from "../components/UserFollowingFeed.vue";
import CreateNewTweetModal from "../components/CreateNewTweetModal.vue"
import Spinner from "../components/Spinner.vue";
import usersAPI from "../apis/users";
import { mapState } from "vuex";
import { Toast } from "../utils/helpers";

export default {
  name: "UserFollowing",
  components: {
    Navbar,
    UserFollowingFeed,
    PopularBar,
    CreateNewTweetModal,
    Spinner,
  },
  data() {
    return {
      user: "",
      followings: [],
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
    async fetchFollowings(userId) {
      try {
        this.isLoading = true;
        const response = await usersAPI.getFollowings({ userId });
        this.followings = response.data;
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
        this.isLoading = true;
      } catch (error) {
        Toast.fire({
          icon: "warning",
          title: "無法取得所有推文資料，請稍後再試",
        });
      }
    },
    //子層觸發渲染畫面
    updateFollowing() {
      const { id } = this.$route.params;
      this.fetchFollowings(id);
    },
    afterFollowClick() {
      this.fetchFollowings(this.user.id);
    },
    afterAddTweet() {
      this.$store.commit("toggleCreateNewTweetModal");
      this.$router.push("/");
    },
  },
  created() {
    const { id } = this.$route.params;
    this.fetchFollowings(id);
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
  display: flex;
  .main-container {
    flex: 1;
  }
  .modal {
    position: fixed;
  }
}
</style>