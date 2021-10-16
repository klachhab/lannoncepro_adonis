<template>
    <nav class="bg-white dark:bg-gray-800 shadow">

        <div class="max-w-7xl mx-auto md:px-8 px-4">

            <div class="flex items-center md:justify-between h-16">

                <a class="flex items-center space-x-1.5" href="#">
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
                                <span class="mr-4 text-gray-800 dark:hover:text-white py-2">
                                    {{ user }}
                                </span>
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

                                    <a href="#"
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
                                            <div class="text-xs text-white p-1 bg-red-500 rounded-full">{{ messages > 99 ? 99+"+" : messages }}</div>
                                        </div>
                                    </a>
                                    <a href="#"
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

                                    <a href="#"
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

                                    <a href="#"
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

                    <a href="/annonces/create" class="invisible md:visible flex py-2 px-3 cursor-pointer bg-blue-500 text-white rounded-md
                                transition delay-75 ease-in-out hover:bg-transparent hover:text-blue-500
                                border-2 hover:border-blue-500"
                    >
                        <PlusSmIcon class="mr-1"/>
                        <span>Déposer une annonce</span>
                    </a>

                </div>

                <button
                    class="text-gray-800 dark:text-white mr-2 md:hidden rounded-md focus:outline-none"
                >
                    <MenuIcon />
                </button>

            </div>
        </div>

    </nav>
</template>

<script>
import {ChevronDownIcon, MenuIcon, ChatIcon, CogIcon, HeartIcon,
    LogoutIcon, NewspaperIcon, PlusSmIcon
} from "@vue-hero-icons/outline"

export default {
    props: ['check', 'user'],
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
        // console.log(this.user)
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
