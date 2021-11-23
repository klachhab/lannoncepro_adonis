<template>
    <nav class="bg-white dark:bg-gray-800 shadow">

        <div class="max-w-7xl mx-auto md:px-8 px-4">

            <div class="flex items-center md:justify-between h-16">

                <a class="flex items-center space-x-1.5" href="/">
                    <img class="h-10 w-auto md:h-9" src="/logo_icon.png" alt="">
                    <p class="font-bold base text-gray-800 dark:text-white
                                hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        LannoncePro
                    </p>
                </a>

                <div class="invisible md:visible flex items-center">

                    <div class="flex items-center cursor-pointer mr-4"
                         @mouseover="show_profile_menu = true"
                         @mouseout="show_profile_menu = false"
                         v-if="authenticated"
                    >

                        <!-- Profile menu -->
                        <div class="relative inline-block text-left">
                            <button class=" flex items-center justify-center w-full rounded-md pr-4 py-2 text-normal font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500">
                                <a href="#" class="mr-4 text-gray-800 dark:hover:text-white py-2">
                                    {{ user }}
                                </a>
                                <ChevronDownIcon size="20" />
                            </button>


                            <div class="origin-top-right absolute right-0 w-56 rounded shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50
                                                transition duration-300 ease-in-out"
                                 :class="show_profile_menu ? '' : 'opacity-0 invisible'"
                            >
                                <!-- Menu List -->
                                <div class="py-1" role="menu" aria-orientation="vertical"
                                     aria-labelledby="options-menu"
                                >

                                    <a href="/mon-profil"
                                       class="block block px-3 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                                       role="menuitem"
                                    >
                                        <div class="flex items-center">
                                            <NewspaperIcon size="20" class="mr-4"></NewspaperIcon>
                                            <span>
                                                Mes annonces
                                            </span>
                                        </div>
                                    </a>
                                    <a href="/mon-profil/messages"
                                       class="block block px-3 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                                       role="menuitem"
                                    >
                                        <div class="flex items-center justify-between">
                                            <div class="flex">
                                                <ChatIcon size="20" class="mr-4"></ChatIcon>
                                                <span>
                                                    Mes message
                                                </span>
                                            </div>
                                            <span class="badge border-0 bg-red-500 text-white" v-if="messages_count">
                                                {{ messages_count > 99 ? 99 + "+" : messages_count }}
                                            </span>
                                        </div>
                                    </a>

                                    <a href="/mon-profil/favoris"
                                       class="block block px-3 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                                       role="menuitem"
                                    >
                                        <div class="flex items-center">
                                            <HeartIcon size="20" class="mr-4"></HeartIcon>
                                            <span>
                                                Mes favoris
                                            </span>
                                        </div>
                                    </a>

                                    <a href="/mon-profil/infos"
                                       class="block block px-3 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                                       role="menuitem"
                                    >
                                        <div class="flex items-center">
                                            <CogIcon size="20" class="mr-4"></CogIcon>
                                            <span>
                                                Paramètres
                                            </span>
                                        </div>
                                    </a>

                                    <hr class="border-0 bg-gray-200 h-px">
                                    <a href="#"
                                       class="block block px-3 py-2 text-md text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                                       role="menuitem"
                                    >
                                        <div class="flex items-center">
                                            <LogoutIcon size="20" class="mr-4"></LogoutIcon>
                                            <a href="#" @click.prevent="logout">
                                                Se déconnecter
                                            </a>
                                        </div>
                                    </a>
                                </div>
                                <!-- !Menu List -->

                            </div>
                        </div>

                    </div>

                    <div class="flex items-center mr-8" v-else>
                        <div class="flex items-baseline space-x-4">
                            <a href="/auth/register" class="text-gray-800 dark:hover:text-white py-2 rounded-md text-md font-medium">
                                Register
                            </a>

                            <a href="/auth/login" class="text-gray-800 dark:hover:text-white py-2 rounded-md text-md font-medium">
                                Login
                            </a>

                        </div>
                    </div>

                    <a href="/annonces/create" class="invisible md:visible flex py-2 px-3 cursor-pointer bg-blue-500
                                text-white rounded-md
                                transition delay-75 ease-in-out
                                hover:bg-transparent hover:text-blue-500
                                border border-transparent hover:border-blue-500"
                    >
<!--                        <PlusSmIcon class="mr-1"/>-->
                        <span>Déposer une annonce</span>
                    </a>

                </div>

                <button
                    class="text-gray-800 dark:text-white mr-2 md:hidden rounded-md focus:outline-none"
                >
                    <svg class="fill-current transition-colors duration-200 ease-in-out hover:text-blue-700" width="23px" height="16px" viewBox="0 0 23 16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path d="M1.6,3.2 L20.8,3.2 C21.6832,3.2 22.4,2.4832 22.4,1.6 C22.4,0.7168 21.6832,0 20.8,0 L1.6,0 C0.7168,0 0,0.7168 0,1.6 C0,2.4832 0.7168,3.2 1.6,3.2 Z M20.8,6.4 L1.6,6.4 C0.7168,6.4 0,7.1168 0,8 C0,8.8832 0.7168,9.6 1.6,9.6 L20.8,9.6 C21.6832,9.6 22.4,8.8832 22.4,8 C22.4,7.1168 21.6832,6.4 20.8,6.4 Z M20.8,12.8 L1.6,12.8 C0.7168,12.8 0,13.5168 0,14.4 C0,15.2832 0.7168,16 1.6,16 L20.8,16 C21.6832,16 22.4,15.2832 22.4,14.4 C22.4,13.5168 21.6832,12.8 20.8,12.8 Z" id="Shape">
                        </path>
                    </svg>
                </button>

            </div>
        </div>

    </nav>
</template>

<script>
import {ChevronDownIcon, MenuIcon, ChatIcon, CogIcon, HeartIcon,
    LogoutIcon, NewspaperIcon, PlusSmIcon
} from "@vue-hero-icons/outline"
import {mapState} from "vuex";

export default {
    props: ['check', 'user', 'unread_messages_count'],
    name: "HeaderComponent",
    components: {
        ChevronDownIcon, MenuIcon, ChatIcon,
        CogIcon, HeartIcon, LogoutIcon,
        NewspaperIcon, PlusSmIcon
    },
    data() {
        return {
            transition: "transition duration-200 ease-in-out",
            show_profile_menu: false,
            authenticated: this.check === "true",
            messages: 30,
        }
    },

    mounted() {
        this.$store.commit('update_message_count', Number.parseInt(this.unread_messages_count))
    },

    computed: {
        ...mapState([
            'messages_count'
        ]),


    },

    methods: {
        async logout() {
            const logout = await axios.post('/auth/logout')
            .then(() => {
                window.location.replace("/");
            })
            .catch(e => {
                return {
                    error: e.code
                }
            })

            console.log(logout)
        }
    },
}
</script>

<style scoped>

</style>
