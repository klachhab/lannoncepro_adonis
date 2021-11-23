import Vue from "vue";
import VueRouter from "vue-router";

import * as Subs from "../Components/profile/SubComponents"

Vue.use(VueRouter);

const routes = [

    {
        path: '/',
        name: 'ads',
        component: Subs.PostsComponent
    },

    {
        path: '/messages',
        name: 'messages',
        component: Subs.ConversationComponent
    },

    {
        path: '/favoris',
        name: 'favourite_ads',
        component: Subs.FavouritePostsComponent
    },

    {
        path: '/en-attente',
        name: 'pending_ads',
        component: Subs.PendingPostsComponent
    },

    {
        path: '/infos',
        name: 'profile_infos',
        component: Subs.ProfileComponent
    },


];

const router = new VueRouter({
    mode: "history",
    base: "/mon-profil",
    linkActiveClass: "text-blue-700",
    linkExactActiveClass: "text-blue-700",
    routes
})

export default router;
