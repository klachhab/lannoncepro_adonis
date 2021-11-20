import Vue from "vue";
import VueRouter from "vue-router";
import ProfileComponent from "../Components/profile/SubComponents/ProfileComponent"

Vue.use(VueRouter);

const routes = [
    {
        path: '/mes-infos',
        name: 'profile_infos',
        component: ProfileComponent
    }

];

const router = new VueRouter({
    mode: "history",
    linkActiveClass: "active",
    linkExactActiveClass: "exact-active",
    routes
})

export default router;
