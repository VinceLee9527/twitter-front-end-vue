<template>
  <div id="admin-main">
    <AdminNavBar />
    <div id="tweet-list">
      <AdminTopNav />
      <div class="container">
        <AdminTweet
          v-for="tweet in tweets"
          :key="tweet.id"
          :initial-tweet="tweet"
          @after-delete-tweet="afterDeleteTweet"
          :isProcessing="isProcessing"
        />
      </div>
    </div>
  </div>
</template>



<script>
import AdminNavBar from "./../components/AdminNavBar";
import AdminTopNav from "./../components/AdminTopNav";
import AdminTweet from "./../components/AdminTweet";
import adminAPI from "./../apis/admin";
import { Toast } from "./../utils/helpers";

export default {
  name: "Admin",
  components: {
    AdminNavBar,
    AdminTopNav,
    AdminTweet,
  },
  data() {
    return {
      tweets: [],
      isProcessing: false,
    };
  },
  created() {
    this.fetchTweets();
  },
  methods: {
    async fetchTweets() {
      try {
        const { data } = await adminAPI.adminTweets();
        this.tweets = data;
      } catch (error) {
        this.isProcessing = false;
        const { data } = error.response;
        Toast.fire({
          icon: "warning",
          title: data.message,
        });
      }
    },
    async afterDeleteTweet(tweetId) {
      try {
        this.isProcessing = true;
        const { data } = await adminAPI.deleteTweet({
          tweetId,
        });
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        this.fetchTweets();
        this.isProcessing = false;
      } catch (err) {
        this.isProcessing = false;
        Toast.fire({
          icon: "warning",
          title: err.message,
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import "./../assets/styles/_adminTweet.scss";
</style>