<template>
  <div class="container">
    <div v-for="tweet in tweets" :key="tweet.id" class="tweet-card">
      <div class="tweet-card-img">
        <router-link :to="{ name: 'tweet', params: { id: tweet.User.id } }">
          <img :src="tweet.User.avatar | emptyImage" alt="avatar-img" />
        </router-link>
      </div>
      <div class="tweet-card-content">
        <div class="tweet-card-content-info">
          <span class="name">{{ tweet.User.name | nameLength}}</span>
          <span class="account"><span>@</span>{{ tweet.User.account | nameLength }}</span>
          <span class="created-at">{{ tweet.createdAt | fromNow }}</span>
        </div>
        <router-link :to="{ name: 'tweets-detail', params: { id: tweet.id } }">
          <div class="tweet-card-content-text">
            {{ tweet.description }}
          </div>
        </router-link>
        <div class="tweet-card-content-reply">
          <a href="#">
            <div
              class="content-reply"
              @click.stop.prevent="replyModalClick(tweet.id)"
            >
              <img
                class="content-reply-icon"
                src="./../assets/images/comment-icon.svg"
              />
              <span class="content-reply-number">{{
                tweet.commentCounts || 0
              }}</span>
            </div>
          </a>
          <a href="#">
            <div class="content-reply">
              <img
                v-if="tweet.isLiked"
                class="content-reply-icon"
                src="./../assets/images/liked-icon.svg"
                @click.stop.prevent="deleteLike(tweet.id)"
              />
              <img
                v-else
                class="content-reply-icon"
                src="./../assets/images/like-icon.svg"
                @click.stop.prevent="addLike(tweet.id)"
              />

              <span
                class="content-reply-number"
                :class="{ islike: tweet.isLiked }"
                >{{ tweet.likeCounts || 0 }}</span
              >
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/styles/_showpostslist.scss";
</style>

<script>
import tweetAPI from "../apis/tweet";
import { Toast } from "../utils/helpers";
import { emptyImageFilter, fromNowFilter,nameLengthFilter } from "../utils/mixins"

export default {
  name: "ShowPostsList",
  mixins: [emptyImageFilter, fromNowFilter,nameLengthFilter],
  props: {
    tweets: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      Like: true,
    };
  },
  methods: {
    async addLike(tweetId) {
      try {
        const { data } = await tweetAPI.addLike({ tweetId });
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        this.$emit("update-tweets", tweetId);
      } catch {
        Toast.fire({
          icon: "warning",
          title: "無法對此推文按讚，請稍後再試",
        });
      }
    },
    async deleteLike(tweetId) {
      try {
        const { data } = await tweetAPI.deleteLike({ tweetId });
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        //呼叫父層重新抓取畫面
        this.$emit("update-tweets", tweetId);
      } catch {
        Toast.fire({
          icon: "warning",
          title: "無法取消對此推文按讚，請稍後再試",
        });
      }
    },
    replyModalClick(tweetId) {
      this.$emit("after-reply-modal-click", tweetId);
    },
  },
};
</script>
