import Vue from 'vue'
import VueRouter from 'vue-router'
import SignIn from '../views/SignIn.vue'

import UserMain from '../views/UserMain.vue'
import NotFound from '../views/NotFound.vue'
import AdminSignIn from '../views/AdminSignIn.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'root',
        redirect: '/signin'
    },
    {
        path: '/signin',
        name: 'SignIn',
        component: SignIn
    }, {
        path: '/signup',
        name: 'sign-up',
        component: () =>
            import ('../views/SignUp.vue')
    }, {
        path: '/home',
        name: 'home',
        component: UserMain
    }, {
        path: '/notification',
        name: 'notification',
        component: () =>
            import ('../views/Notification.vue')
    }, {
        path: '/chatroom',
        name: 'chat-room',
        component: () =>
            import ('../views/ChatRoom.vue')
    }, {
        path: '/privatechat',
        name: 'private-chat',
        component: () =>
            import ('../views//PrivateChat.vue')
    }, {
        path: '/user/edit',
        name: 'user-edit',
        component: () =>
            import ('../views/UserEdit.vue')
    }, {
        path: '/tweets/:id',
        name: 'tweets-detail',
        component: () =>
            import ('../views/Tweet.vue')
    }, {
        path: '/user/:id/followed',
        name: 'user-followed',
        component: () =>
            import ('../views/UserFollowed.vue'),
    }, {
        path: '/user/:id/following',
        name: 'user-following',
        component: () =>
            import ('../views/UserFollowing.vue'),
    }, {
        path: '/profile/:id',
        component: () =>
            import ('../views/User.vue'),
        children: [{
                path: '/',
                name: 'tweet',
                component: () =>
                    import ('../views/UserTweets.vue')
            },
            {
                path: 'comment',
                name: 'comment',
                component: () =>
                    import ('../views/UserComments.vue')
            },
            {
                path: 'liked',
                name: 'liked',
                component: () =>
                    import ('../views/UserLikes.vue')
            },
        ]
    },
    {
        path: '/admin/signin',
        name: 'AdminSignIn',
        component: AdminSignIn
    }, {
        path: '/admin/main',
        name: 'AdminMain',
        component: () =>
            import ('../views/AdminMain.vue')
    }, {
        path: '/admin/users',
        name: 'AdminUsers',
        component: () =>
            import ('../views/AdminUsers.vue')
    }, {
        path: '*',
        name: 'not-found',
        component: NotFound
    }
]


const router = new VueRouter({
    routes
})

//切換路由
router.beforeEach(async(to, from, next) => {
    // 從 localStorage 取出 token
    const token = localStorage.getItem('token')
    const admin = localStorage.getItem('admin')
    const tokenInStore = store.state.token

    let isAuthenticated = store.state.isAuthenticated
    let isAdmin = store.state.isAdmin

    // 有 token 的情況下，才向後端驗證
    if (token && token !== tokenInStore && !admin) {
        isAuthenticated = await store.dispatch('fetchCurrentUser')
    } else if (token && token !== tokenInStore && admin) {
        isAuthenticated = await store.dispatch('fetchAdminUser')
    }

    const pathsWithoutAuthentication = ['SignIn', 'sign-up', 'AdminSignIn']
    const adminPath = ['AdminUsers', 'AdminMain']

    // 如果 token 無效，且要去除了登入和註冊以外的其他頁面，且不是admin，則轉址到user登入頁
    if (!isAuthenticated && !isAdmin && !pathsWithoutAuthentication.includes(to.name)) {
        next('/signin')
        return
    }

    // 如果 token 無效，且要去除了admin登入以外的其他頁面，是admin，則轉址到admin登入頁
    if (!isAuthenticated && isAdmin && !pathsWithoutAuthentication.includes(to.name)) {
        next('/admin/signin')
        return
    }

    // 如果 token 有效，且是admin，且要去user頁面，則轉址到admin首頁
    if (isAuthenticated && isAdmin && !adminPath.includes(to.name)) {
        console.log(to.name)

        next('/admin/main')
        return
    }

    // 如果 token 有效，且不是admin，且要去admin頁面，則轉址到user首頁
    if (isAuthenticated && !isAdmin && adminPath.includes(to.name)) {
        next('/home')
        return
    }

    // 如果 token 有效，且不是admin，且要去登入和註冊頁，則轉址到首頁
    if (isAuthenticated && !isAdmin && pathsWithoutAuthentication.includes(to.name)) {
        next('/home')
        return
    }

    // 如果 token 有效，是admin，且要去登入和註冊頁，則轉址到admin首頁
    if (isAuthenticated && isAdmin && pathsWithoutAuthentication.includes(to.name)) {
        next('/admin/main')
        return
    }


    next()
})

export default router