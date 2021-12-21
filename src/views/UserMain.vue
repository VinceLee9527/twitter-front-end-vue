<template>
  <div class="container">
    <NavBar />
    <div class="main-container">
      <NewPostForm @update-tweets="updateTweets" />
      <hr />
      <div class="showpostform-container">
        <Spinner v-show="isLoading" />
        <ShowPostsList
          v-show="!isLoading"
          :tweets="tweets"
          @update-tweets="updateTweets"
          @after-reply-modal-click="afterReplyModalClick"
        />
      </div>
    </div>
    <div class="popularbar-container">
      <PopularBar
        :initial-top-users="topUsers"
        @after-follow-click="afterFollowClick"
      />
    </div>
    <div class="modal">
      <ReplyPostModal
        v-show="openReplyPostModal"
        :tweet="modaltweet"
        @after-submit="afterReplySubmit"
      />
      <CreateNewTweetModal
        v-show="openCreateNewTweetModal"
        @after-add-tweet="afterAddTweet"
      />
    </div>
  </div>
</template>

<script>
import NavBar from "./../components/NavBar.vue";
import PopularBar from "./../components/PopularBar.vue";
import NewPostForm from "./../components/NewPostForm.vue";
import ShowPostsList from "./../components/ShowPostsList.vue";
import CreateNewTweetModal from "../components/CreateNewTweetModal.vue";
import ReplyPostModal from "../components/ReplyPostModal.vue";
import Spinner from "../components/Spinner.vue";
import { mapState } from "vuex";
import { Toast } from "../utils/helpers";
import tweetAPI from "../apis/tweet";
import usersAPI from "../apis/users";

export default {
  name: "UserMain",
  components: {
    NavBar,
    PopularBar,
    NewPostForm,
    ShowPostsList,
    CreateNewTweetModal,
    ReplyPostModal,
    Spinner,
  },
  data() {
    return {
      tweets: [],
      topUsers: [],
      modaltweet: "",
      isLoading: true,
    };
  },
  methods: {
    async fetchTopUsers() {
      try {
        const { data } = await usersAPI.getTopUsers();
        this.topUsers = data;
      } catch (error) {
        Toast.fire({
          icon: "warning",
          title: "無法取得資料請稍後再試",
        });
      }
    },
    afterAddTweet() {
      this.$store.commit("toggleCreateNewTweetModal");
      this.getAllTweets();
    },
    afterFollowClick() {
      this.fetchTopUsers();
    },
    async getAllTweets() {
      try {
        const response = await tweetAPI.getAllTweets();
        this.tweets = response.data;
        this.isLoading = false;
      } catch {
        this.isLoading = false;
        Toast.fire({
          icon: "warning",
          title: "無法取得推文資料，請稍後再試",
        });
      }
    },
    //子層改變時重新抓取資料
    updateTweets() {
      this.getAllTweets();
    },
    //監聽showpostlist裡面按鈕
    async afterReplyModalClick(tweetId) {
      try {
        this.$store.commit("toggleReplyPostModal");
        const { data } = await tweetAPI.getTweet({ tweetId });
        this.modaltweet = data;
      } catch {
        Toast.fire({
          icon: "warning",
          title: "無法取得推文資料，請稍後再試",
        });
      }
    },
    async afterReplySubmit(id, comment) {
      try {
        const { data } = await tweetAPI.addTweetReply({
          tweetId: id,
          comment: comment,
        });
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        Toast.fire({
          icon: "success",
          title: "回覆推文成功",
        });
        this.$store.commit("toggleReplyPostModal");
        this.getAllTweets();
      } catch {
        Toast.fire({
          icon: "warning",
          title: "無法回覆留言，請稍後再試",
        });
      }
    },
  },
  computed: {
    ...mapState(["openCreateNewTweetModal", "openReplyPostModal", "notReadMessages","updateReadMessage"]),
  },
  created() {
    this.getAllTweets();
    this.fetchTopUsers();
  },
  mounted() {
    this.$socket.open();
  },
  sockets: {
    connect() {
      console.log("socket connected");
      this.$socket.emit("login");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/styles/_userMain.scss";
</style>
