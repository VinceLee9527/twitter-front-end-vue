<template>
<<<<<<< HEAD
  <transition name="fade" appear>
    <div class="modal-container" v-show="openReplyPostModal">
      <div class="modal">
        <div class="modal-header">
          <img
            src="../assets/images/close-icon.svg"
            alt=""
            @click.stop.prevent="closeModal"
          />
        </div>
        <div class="modal-content">
          <div class="modal-content-tweet">
            <div class="modal-content-tweet-img">
              <img :src="tweet.User.avatar | emptyImage" alt="" />
              <span class="line"></span>
=======
  <div class="modal-container">
    <div class="modal">
      <div class="modal-header">
        <img
          src="../assets/images/close-icon.svg"
          alt=""
          @click.stop.prevent="closeModal"
        />
      </div>
      <div class="modal-content">
        <div class="modal-content-tweet">
          <div class="modal-content-tweet-img">
            <img :src="tweet.User.avatar | emptyImage" alt="" />
            <span class="line"></span>
          </div>
          <div class="modal-content-info">
            <div class="modal-content-info-name">
              <span class="name">{{ tweet.User.name }}</span>
							<span>@</span>
              <span>{{ tweet.User.account }}</span>
              <span> • {{ tweet.createdAt | fromNow }}</span>
>>>>>>> main
            </div>
            <div class="modal-content-info">
              <div class="modal-content-info-name">
                <span class="name">{{ tweet.User.name }}</span>
                <span>@{{ tweet.User.account }}</span>
                <span> • {{ tweet.createdAt | fromNow }}</span>
              </div>
              <div class="modal-content-info-text">
                {{ tweet.description }}
              </div>
              <div class="modal-content-info-creater">
                <span>回覆給</span>
                <span class="account">@{{ tweet.User.account }}</span>
              </div>
            </div>
          </div>
          <div class="modal-content-reply">
            <div class="modal-content-reply-img">
              <img
                class="page-content-img"
                :src="currentUser.avatar | emptyImage"
              />
            </div>
            <textarea
              class="modal-content-reply-input"
              placeholder="有什麼新鮮事？"
              v-model="inputText"
            >
            </textarea>
            <span v-show="inputLengthError">字數不可超過140字</span>
          </div>
          <div class="modal-content-button">
            <button
              :disabled="inputLengthError || !inputText || isProcessing"
              @click.stop.prevent="handleSubmit"
            >
              回覆
            </button>
          </div>
<<<<<<< HEAD
=======
          <textarea
            class="modal-content-reply-input"
            placeholder="推你的回覆"
            v-model="inputText"
          >
          </textarea>
          <span v-show="inputLengthError">字數不可超過140字</span>
        </div>
        <div class="modal-content-button">
          <button
            :disabled="inputLengthError || !inputText || isProcessing"
            @click.stop.prevent="handleSubmit"
          >
            回覆
          </button>
>>>>>>> main
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Toast } from "../utils/helpers";
import { mapState } from "vuex";
import { emptyImageFilter, fromNowFilter } from "../utils/mixins";

export default {
  name: "ReplyPostModal",
  mixins: [emptyImageFilter, fromNowFilter],
  props: {
    tweet: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      inputText: "",
      inputLengthError: false,
      isProcessing: false,
    };
  },
  methods: {
    closeModal() {
      this.$store.commit("toggleReplyPostModal");
    },
    handleSubmit() {
      if (!this.inputText) {
        Toast.fire({
          icon: "warning",
          title: "無法送出回覆，請稍後再試",
        });
        return;
      }
      this.$emit("after-submit", this.tweet.id, this.inputText);
      this.inputText = "";
    },
  },
  computed: { ...mapState(["currentUser", "openReplyPostModal"]) },
  watch: {
    inputText: function () {
      if (this.inputText.length > 140) {
        this.inputLengthError = true;
      } else {
        this.inputLengthError = false;
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "../assets/styles/_replyPostModal.scss";
</style>