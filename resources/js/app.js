import Vue from "vue";
require('./bootstrap');
window.Vue = require('vue');
import Vuelidate from 'vuelidate'
import router from "./Vue/router"
import store from "./Vue/store"

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import 'animate.css';

import VueTailwind from 'vue-tailwind'
import settings from "./Vue/config/tailwind-vue"

import VueTippy from "vue-tippy";
Vue.use(VueTippy, {
    directive: "tippy",
    flipDuration: 0,
});


Vue.use(VueTailwind, settings)
Vue.use(Vuelidate)


Vue.use(VueSweetalert2, {
    confirmButtonColor: '#3B82F6',
    cancelButtonColor: '#EF4444',
});

import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

Vue.use(VueVideoPlayer)


// Layouts
Vue.component('vue-nav', require('./Vue/Components/Layouts/HeaderComponent').default);
// Vue.component('modal-box', require('./Vue/Components/Layouts/ModalBox').default);

// Content
Vue.component('home', require('./Vue/Components/HomeComponent.vue').default);

// Posts
Vue.component('indexPost', require('./Vue/Components/posts/IndexComponent').default);
Vue.component('createPost', require('./Vue/Components/posts/CreateComponent').default);
Vue.component('createPostDetails', require('./Vue/Components/posts/CreateDetailsComponent').default);
Vue.component('showPost', require('./Vue/Components/posts/ShowComponent').default);

Vue.component('chatroom', require('./Vue/Components/ChatroomComponent').default);

// Auth
Vue.component('login', require('./Vue/Components/auth/LoginComponent').default);
Vue.component('register', require('./Vue/Components/auth/RegisterComponent').default);
Vue.component('resetPassword', require('./Vue/Components/auth/RessetPasswordComponent').default);

// Profile
Vue.component('userProfile', require('./Vue/Components/profile/MainComponent').default)
Vue.component('userPost', require('./Vue/Components/profile/SubComponents/PostsComponent').default)

const app = new Vue({
    router,
    store,
    el: '#app',
});
