<template>
  <div class="container">
    <div class="page-title">
      <router-link :to="{ name: 'tweet', params: { id: user.id } }">
        <img
          class="profile-topnav-icon"
          src="./../assets/images/exit-icon.svg"
        />
      </router-link>
      <div class="page-title-name">
        <div class="name">{{ user.name | nameLength}}</div>
        <div class="tweets">{{ userTweetsCount }}推文</div>
      </div>
    </div>
    <div class="page-banner">
      <router-link :to="{ name: 'user-followed', params: { id: user.id } }">
        <div class="page-banner-followed active">跟隨者</div>
      </router-link>
      <router-link :to="{ name: 'user-following', params: { id: user.id } }">
        <div class="page-banner-following">正在跟隨</div>
      </router-link>
    </div>
    <div class="page-list">
      <li v-for="follower in followers" :key="follower.id" class="list-card">
        <div class="list-card-avatar">
          <router-link
            :to="{ name: 'tweet', params: { id: follower.followerId } }"
          >
            <img :src="follower.avatar | emptyImage" alt="user-avatar" />
          </router-link>
        </div>
        <div class="list-card-content">
          <div class="list-card-content-header">
            <div class="name">{{ follower.name | nameLength}}</div>
            <div class="account"><span>@</span>	 {{ follower.account | nameLength}}</div>
            <button
              v-if="follower.isFollowed"
              class="list-card-button following"
              @click.stop.prevent="deleteFollow(follower.followerId)"
            >
              正在跟隨
            </button>
            <button
              v-else
              class="list-card-button follow"
              @click.stop.prevent="addFollow(follower.followerId)"
            >
              跟隨
            </button>
          </div>
          <div class="list-card-content-description">
            {{ follower.introduction }}
          </div>
        </div>
      </li>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./../assets/styles/_userFollowingFeed.scss";
</style>

<script>
import usersAPI from "../apis/users";
import { Toast } from "../utils/helpers";
import { emptyImageFilter,nameLengthFilter } from "../utils/mixins";

export default {
  name: "UserFollowingFeed",
  props: ["followers", "userTweetsCount", "user"],
	mixins: [emptyImageFilter,nameLengthFilter],
  data() {
    return {
      currentRouteName: "followed",
    };
  },
  methods: {
    async addFollow(userId) {
      try {
        const { data } = await usersAPI.addFollow({ userId });
        if (data.status !== "success") {
          throw new Error(data.message);
        }

        Toast.fire({
          icon: "success",
          title: "成功追蹤此使用者",
        });
				this.$emit("update-followed");
      } catch (error) {
        Toast.fire({
          icon: "warning",
          title: "無法追蹤此使用者，請稍後再試",
        });
      }
    },
    async deleteFollow(userId) {
      try {
        const { data } = await usersAPI.deleteFollow({ userId });
        if (data.status !== "success") {
          throw new Error(data.message);
        }

        Toast.fire({
          icon: "success",
          title: "成功取消追蹤此使用者",
        });
				this.$emit("update-followed");
      } catch (error) {
        Toast.fire({
          icon: "warning",
          title: "無法取消追蹤此使用者，請稍後再試",
        });
      }
    },
  },
  toggleTab(value) {
    this.currentRouteName = value;
  },
};
</script>