import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/basic.scss'
import SocketIO from 'socket.io-client';
import VueSocketIO from 'vue-socket.io'

const token = localStorage.getItem('token')


Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO('https://twitterapichatroom20211212.herokuapp.com', { auth: { token }, autoConnect: false }),
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
}))



Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')