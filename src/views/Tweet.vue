<template>
  <div class="container">
    <NavBar />
    <div class="main-container">
      <Spinner v-show="isLoading" />
      <PostDetailCard
        :initial-tweet="tweet"
        :replies="replies"
        v-show="!isLoading"
      />
    </div>
    <div class="popularbar-container">
      <PopularBar />
    </div>
    <div class="modal">
      <CreateNewTweetModal
        v-show="openCreateNewTweetModal"
        @after-add-tweet="afterAddTweet"
      />
      <ReplyPostModal
        v-show="openReplyPostModal"
        :tweet="tweet"
        @after-submit="handleAfterSubmit"
      />
    </div>
  </div>
</template>

<script>
import NavBar from "./../components/NavBar.vue";
import PopularBar from "./../components/PopularBar.vue";
import PostDetailCard from "./../components/PostDetailCard.vue";
import ReplyPostModal from "./../components/ReplyPostModal.vue";
import CreateNewTweetModal from "./../components/CreateNewTweetModal.vue";
import Spinner from "../components/Spinner.vue";
import tweetAPI from "../apis/tweet";
import { mapState } from "vuex";
import { Toast } from "../utils/helpers";

export default {
  name: "UserMain",
  components: {
    NavBar,
    PopularBar,
    PostDetailCard,
    ReplyPostModal,
    CreateNewTweetModal,
    Spinner,
  },
  data() {
    return {
      tweet: "",
      replies: [],
      isLoading: true,
    };
  },
  methods: {
    async fetchTweet(tweetId) {
      try {
        this.isLoading = true;
        const response = await tweetAPI.getTweet({ tweetId });
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        this.tweet = response.data;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        Toast.fire({
          icon: "warning",
          title: "無法取得推文資料請稍後再試",
        });
      }
    },
    async fetchReplies(tweetId) {
      try {
        this.isLoading = true;
        const response = await tweetAPI.getTweetReplies({ tweetId });
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        this.replies = response.data;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        Toast.fire({
          icon: "warning",
          title: "無法取得推文回覆資料請稍後再試",
        });
      }
    },
    async handleAfterSubmit(id, inputData) {
      try {
        this.isProcessing = true;
        const { data } = await tweetAPI.addTweetReply({
          tweetId: id,
          comment: inputData,
        });

        if (data.status !== "success") {
          throw new Error(data.message);
        }
        Toast.fire({
          icon: "success",
          title: "新增回覆成功",
        });
        this.$store.commit("toggleReplyPostModal");
        this.$router.go(); //跳頁
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "warning",
          title: "無法新增回覆，請稍後再試",
        });
      }
    },
    afterAddTweet() {
      this.$store.commit("toggleCreateNewTweetModal");
      this.$router.push("/");
    },
  },
  computed: {
    ...mapState(["openReplyPostModal", "openCreateNewTweetModal"]),
  },
  created() {
    const { id } = this.$route.params;
    this.fetchTweet(id);
    this.fetchReplies(id);
    console.log(id);
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/styles/_tweet.scss";
</style>
