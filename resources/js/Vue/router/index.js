import Vue from "vue";
import VueRouter from "vue-router";
import * as Subs from "../Components/profile/SubComponents"
import IndexComponent from "../Components/posts/IndexComponent";

Vue.use(VueRouter);

const routes = [

    // My Profile ====================================================
    {
        path: '/mon-profil',
        name: 'ads',
        component: Subs.PostsComponent,
        props: {
            default: true,
            is_me: true
        },
    },

    {
        path: '/mon-profil/messages',
        name: 'messages',
        component: Subs.ConversationComponent
    },

    {
        path: '/mon-profil/favoris',
        name: 'favourite_ads',
        component: Subs.FavouritePostsComponent
    },

    {
        path: '/mon-profil/en-attente',
        name: 'pending_ads',
        component: Subs.PendingPostsComponent
    },

    {
        path: '/mon-profil/infos',
        name: 'profile_infos',
        component: Subs.ProfileComponent,
    },


    // Posts ====================================================

    // {
        // path: '/annonces',
        // name: 'posts',
        // component: IndexComponent,
    // },
];

const router = new VueRouter({
    mode: "history",
    linkActiveClass: "text-blue-700",
    linkExactActiveClass: "text-blue-700",
    routes
})

export default router;
