import Vue from "vue";
import VueRouter from "vue-router";
import ProfileComponent from "../Components/profile/SubComponents/ProfileComponent"
import PostsComponent from "../Components/profile/SubComponents/PostsComponent"

Vue.use(VueRouter);

const routes = [

    {
        path: '/',
        name: 'ads',
        component: PostsComponent
    },

    {
        path: '/infos',
        name: 'profile_infos',
        component: ProfileComponent
    },


];

const router = new VueRouter({
    mode: "hash",
    linkActiveClass: "text-blue-700",
    linkExactActiveClass: "text-blue-700",
    routes
})

export default router;
