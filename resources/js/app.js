import Vue from "vue";
require('./bootstrap');
window.Vue = require('vue');

// import VueTailwind from 'vue-tailwind'
//
// Vue.use(VueTailwind)

import router from "./Vue/router"
import store from "./Vue/store"

// Layouts
Vue.component('vue-nav', require('./Vue/Components/Layouts/HeaderComponent').default);

// Content
Vue.component('home', require('./Vue/Components/HomeComponent.vue').default);

// Auth
Vue.component('login', require('./Vue/Components/auth/LoginComponent').default);
Vue.component('register', require('./Vue/Components/auth/RegisterComponent').default);
const app = new Vue({
    router,
    store,
    el: '#app',
});
