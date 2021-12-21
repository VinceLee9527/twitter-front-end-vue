import Vue from "vue";
import Vuex from "vuex";
import usersAPI from "./../apis/users";
import adminAPI from "./../apis/admin";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentUser: {
            id: -1,
            account: "",
            name: "",
            avatar: "",
            cover: "",
            introduction: "",
        },
        isAuthenticated: false,
        isAdmin: false,
        token: "",
        openCreateNewTweetModal: false,
        openReplyPostModal: false,
        profileEditModal: false,
        tweetCreated: false,
        replyCreated: false,
        chatUserId: -1,
        notReadMessages: ""
    },
    getters: {
        getCurrentUser: (state) => {
            return state.currentUser;
        },
        getTweetCreated: (state) => {
            return state.tweetCreated;
        },
        getReplyCreated: (state) => {
            return state.replyCreated;
        },
        getOpenReplyPostModal: (state) => {
            return state.openReplyPostModal
        },
    },
    //用來修改state的的方法
    mutations: {
        setCurrentUser(state, currentUser) {
            state.currentUser = {
                ...state.currentUser,
                // 透過 API 取得的 currentUser
                ...currentUser,
            };
            state.isAuthenticated = true;
            state.token = localStorage.getItem("token");
        },
        setChatUser(state, chatUserId) {
            state.chatUserId = chatUserId
        },
        //log out
        revokeAuthentication(state) {
            state.currentUser = {};
            state.isAuthenticated = false;
            state.isAdmin = false;
            state.token = "";
            localStorage.removeItem("token");
            localStorage.removeItem("admin");
        },
        toggleCreateNewTweetModal(state) {
            state.openCreateNewTweetModal = !state.openCreateNewTweetModal;
        },
        toggleReplyPostModal(state) {
            state.openReplyPostModal = !state.openReplyPostModal;
        },
        toggleProfileEditModal(state) {
            state.profileEditModal = !state.profileEditModal;
        },
        setAdmin(state) {
            state.isAdmin = true;
            state.token = localStorage.getItem("token");
        },
        toggleTweetCreated(state) {
            state.tweetCreated = !state.tweetCreated;
        },
        toggleReplyCreated(state) {
            state.replyCreated = !state.replyCreated;
        },
        updateReadMessage(state, number) {
            state.notReadMessages = number
        }
    },
    //透過API請求資料
    actions: {
        async fetchCurrentUser({ commit }) {
            try {
                const { data } = await usersAPI.getCurrentUser();
                const { id, name, account, avatar, cover, introduction, email } = data;
                commit("setCurrentUser", {
                    id,
                    account,
                    name,
                    avatar,
                    cover,
                    introduction,
                    email,
                });
                return true;
            } catch (error) {
                console.error(error.message);
                commit("revokeAuthentication");
                return false;
            }
        },
        async fetchAdminUser({ commit }) {
            try {
                const { data } = await adminAPI.getAdminCurrentUser();
                const { id, name, account, avatar, cover, introduction, email } = data;
                commit("setAdmin");
                commit("setCurrentUser", {
                    id,
                    account,
                    name,
                    avatar,
                    cover,
                    introduction,
                    email,
                });
                return true;
            } catch (error) {
                console.error(error.message);
                commit("revokeAuthentication");
                return false;
            }
        },
    },

    modules: {},
});