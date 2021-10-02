import Vue from "vue";
require('./bootstrap');

window.Vue = require('vue');

import router from "./router"
import store from "./store"

const app = new Vue({
    router,
    store,
    el: '#app',
});
