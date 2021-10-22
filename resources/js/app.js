import Vue from "vue";
require('./bootstrap');
window.Vue = require('vue');
import Vuelidate from 'vuelidate'
import router from "./Vue/router"
import store from "./Vue/store"
import VueSweetalert2 from 'vue-sweetalert2';

import 'sweetalert2/dist/sweetalert2.min.css';
import 'animate.css';


Vue.use(Vuelidate)
Vue.use(VueSweetalert2, {
    confirmButtonColor: '#3B82F6',
    cancelButtonColor: '#EF4444',
});



// Layouts
Vue.component('vue-nav', require('./Vue/Components/Layouts/HeaderComponent').default);

// Content
Vue.component('home', require('./Vue/Components/HomeComponent.vue').default);
Vue.component('createPost', require('./Vue/Components/posts/CreateComponent').default);
Vue.component('createPostDetails', require('./Vue/Components/posts/CreateDetailsComponent').default);
Vue.component('showPost', require('./Vue/Components/posts/ShowComponent').default);

// Auth
Vue.component('login', require('./Vue/Components/auth/LoginComponent').default);
Vue.component('register', require('./Vue/Components/auth/RegisterComponent').default);

const app = new Vue({
    router,
    store,
    el: '#app',
});
