<template>
  <div class="container">
    <Navbar />
    <div class="user-list">
      <div class="title-contianer">
        <div class="title">訊息</div>
        <img src="../assets/images/mail-icon.svg" alt="" />
      </div>
      <div class="user-list-content">
        <PrivateUserListCard
          v-for="latestMessage in latestMessages"
          :key="latestMessage.userId"
          :latestMessage="latestMessage"
          @after-chat-click="afterChatClick"
        />
      </div>
    </div>
    <div class="message-content">
      <div class="title">{{ userChatting || "聊天對象" }}</div>
      <div class="content">
        <ChatRoomMessage
          :contents="contents"
          :logged="logged"
          @after-send-message="afterSendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import PrivateUserListCard from "../components/PrivateUserListCard.vue";
import ChatRoomMessage from "../components/ChatRoomMessage.vue";
import { mapState } from "vuex";
import chatAPI from "./../apis/chat";

export default {
  name: "PrivateChat",
  components: {
    Navbar,
    PrivateUserListCard,
    ChatRoomMessage,
  },
  data() {
    return {
      roomName: "1",
      loginUser: [],
      contents: [],
      content: {},
      logged: {},
      latestMessages: [],
      userChatting: "",
    };
  },
  mounted() {
    this.$socket.open();
  },
  sockets: {
    connect() {
      console.log("socket connected");
      this.$socket.emit("login");
    },
    message(data) {
      this.content = data;
      this.contents.push(this.content);
      this.joinRoom();
    },
    messageNotRead(data) {
      this.$store.commit("updateReadMessage", data);
      console.log("not read", data);
    },
    //有人發送private msg時，除了自己以外收到廣播
    privateMessage() {
      this.fetchLatest();
    },
  },
  methods: {
    afterChatClick(id, userChatting) {
      this.$store.commit("setChatUser", id);
      this.joinRoom();
      this.fetchChatHistory(id);
      this.userChatting = userChatting;
    },
    afterSendMessage(text) {
      this.$socket.emit("sendMessage", {
        text: text,
        id: this.chatUserId,
      });
      this.fetchLatest();
    },
    async fetchLatest() {
      const data = await chatAPI.getLatest();
      this.latestMessages = data.data;
    },
    async fetchChatHistory(userId) {
      const data = await chatAPI.privateHistory({ userId });
      this.contents = data.data;
    },
    joinRoom() {
      this.$socket.emit("joinRoom", { id: this.chatUserId });
      console.log("joined");
    },
    leaveRoom() {
      this.$socket.emit("leaveRoom", { id: this.chatUserId });
      console.log("left");
    },
    messageNotReadInit() {
      this.$socket.emit("messageNotReadInit");
    },
  },
  computed: {
    ...mapState(["currentUser", "chatUserId", "updateReadMessage"]),
  },
  created() {
    const id = this.chatUserId;
    this.fetchChatHistory(id);
    this.joinRoom();
    this.fetchLatest();
  },
  watch: {
    contents: {
      handler: function () {
        this.fetchLatest();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/_privateChat.scss";
</style>
