import Vue from "vue";
import VueRouter from "vue-router";

import {
    ProfileComponent,
    PostsComponent,
    ConversationComponent,
    PendingPostsComponent,
    FavouritePostsComponent,
} from "../Components/profile/SubComponents"
// import ProfileComponent from "../Components/profile/SubComponents/ProfileComponent"
// import PostsComponent from "../Components/profile/SubComponents/PostsComponent"
// import ConversationComponent from "../Components/profile/SubComponents/ConversationComponent"
// import PendingPostsComponent from "../Components/profile/SubComponents/PendingPostsComponent"
// import FavouritePostsComponent from "../Components/profile/SubComponents/PendingPostsComponent"

Vue.use(VueRouter);

const routes = [

    {
        path: '/',
        name: 'ads',
        component: PostsComponent
    },

    {
        path: '/messages',
        name: 'messages',
        component: ConversationComponent
    },

    {
        path: '/favoris',
        name: 'favourite_ads',
        component: FavouritePostsComponent
    },

    {
        path: '/en-attente',
        name: 'pending_ads',
        component: PendingPostsComponent
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
