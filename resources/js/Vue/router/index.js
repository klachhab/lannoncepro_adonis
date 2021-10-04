import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [

];

const router = new VueRouter({
    mode: "history",
    linkActiveClass: "active",
    linkExactActiveClass: "exact-active",
    routes
})

export default router;
