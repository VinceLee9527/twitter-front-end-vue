<template>
  <div class="container">
    <Navbar />
    <div class="notification-area">
			努力施工中 ─=≡Σ((( つ•̀ω•́)つ
      <!-- <NotificationList /> -->
    </div>
    <!-- <PopularBar
      :initial-followed-users="followings"
      @after-follow-click="afterFollowClick"
    /> -->
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
// import NotificationList from "../components/NotificationList.vue";
// import PopularBar from "../components/PopularBar.vue";
// import { mapState } from "vuex";
// import { Toast } from "../utils/helpers";
// import usersAPI from "../apis/users";

export default {
  name: "Notification",
  components: {
    Navbar,
    // PopularBar,
    // NotificationList,
  },
  data() {
    return {
      followings: "",
    };
  },
};

</script>

<style lang="scss" scoped>

.container {
  display: flex;
  .notification-area {
    flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
  }
}
</style>