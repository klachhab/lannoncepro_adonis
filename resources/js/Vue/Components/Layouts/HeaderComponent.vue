<template>
    <div>

        <nav class="bg-white dark:bg-gray-800 shadow ">

            <div class="max-w-7xl mx-auto px-8">

                <div class="flex items-center justify-between h-16">

                    <div class=" flex items-center">
                        <a class="flex items-center space-x-1.5" href="#">
                            <img class="h-10 w-auto md:h-9" src="/logo_icon.png" alt="">
                            <p class="font-bold base text-gray-800 dark:text-white
                            hover:text-gray-700 dark:hover:text-gray-300 invisible md:visible"
                            >
                                LannoncePro
                            </p>
                        </a>

                    </div>

                    <div class="block">
                        <div class="invisible md:visible flex items-center">

                            <div class="flex items-center cursor-pointer mr-4" @click="show_profile_menu = !show_profile_menu"
                                 v-if="authenticated"
                            >
                                <div class="flex items-baseline space-x-4">
                                        <span class="text-gray-800 dark:hover:text-white py-2 rounded-md text-md font-medium">
                                            John Doe
                                        </span>

                                </div>


                                <!-- Profile menu -->
                                <div class="ml-1 relativex">
                                    <div class="relative inline-block text-left">
                                        <button class=" flex items-center justify-center w-full rounded-md pr-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500"
                                                id="options-menu"
                                        >
                                            <ChevronDownIcon size="20" />

                                        </button>

                                        <div class="origin-top-right absolute right-0 mt-2 w-56 rounded shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50
                                                transition duration-300 ease-in-out"
                                             :class="show_profile_menu ? '' : 'opacity-0 invisible'">

                                            <div class="py-1" role="menu" aria-orientation="vertical"
                                                 aria-labelledby="options-menu">
                                                <a href="#"
                                                   class="block block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                                                   role="menuitem"
                                                >
                                                        <span class="flex flex-col">
                                                            <span>
                                                                Mes message
                                                            </span>
                                                        </span>
                                                </a>
                                                <a href="#"
                                                   class="block block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                                                   role="menuitem"
                                                >
                                                        <span class="flex flex-col">
                                                            <span>
                                                                Mes annonces
                                                            </span>
                                                        </span>
                                                </a>

                                                <a href="#"
                                                   class="block block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                                                   role="menuitem"
                                                >
                                                        <span class="flex flex-col">
                                                            <span>
                                                                Mes favoris
                                                            </span>
                                                        </span>
                                                </a>

                                                <a href="#"
                                                   class="block block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                                                   role="menuitem"
                                                >
                                                        <span class="flex flex-col">
                                                            <span>
                                                                Paramètres
                                                            </span>
                                                        </span>
                                                </a>

                                                <hr class="border-0 bg-gray-200 h-px">
                                                <a href="#"
                                                   class="block block px-4 py-2 text-md text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                   role="menuitem"
                                                >
                                                        <span class="flex flex-col">
                                                            <span>
                                                                Se déconnecter
                                                            </span>
                                                        </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div class="flex items-center mr-4" v-else>
                                <div class="flex items-baseline space-x-4">
                                        <span class="text-gray-800 dark:hover:text-white py-2 rounded-md text-md font-medium">
                                            Register
                                        </span>

                                    <span class="text-gray-800 dark:hover:text-white py-2 rounded-md text-md font-medium">
                                            Login
                                        </span>

                                </div>
                            </div>


                            <div class="invisible md:visible flex py-2 px-3 cursor-pointer bg-blue-500 text-white rounded-md
                                transition delay-75 ease-in-out hover:bg-transparent hover:text-blue-500 hover:text-gray-800
                                border-2 hover:border-blue-500"
                            >
                                <span>Ajouter une annonce</span>
                            </div>

                        </div>


                    </div>

                    <div class="-mr-2 flex md:hidden">
                        <button class="text-gray-800 dark:text-white hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
                            <MenuIcon />
                        </button>
                    </div>

                </div>
            </div>

        </nav>

    </div>
</template>

<script>
import {ChevronDownIcon, MenuIcon} from "@vue-hero-icons/outline"

export default {
    name: "HeaderComponent",
    components: {
        ChevronDownIcon, MenuIcon
    },
    data() {
        return {
            transition: "transition duration-200 ease-in-out",
            show_profile_menu: false,
            authenticated: true
        }
    }
}
</script>

<style scoped>

</style>
