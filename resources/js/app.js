import Vue from "vue";
require('./bootstrap');

window.Vue = require('vue');

import router from "./router"
import store from "./store"


Vue.component('home', require('./components/HomeComponent.vue').default);
const app = new Vue({
    router,
    store,
    el: '#app',
});
