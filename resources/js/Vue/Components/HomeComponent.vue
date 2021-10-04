<template>
    <div>

        <div class="w-full flex justify-content-center h-72 bg-gray-100 overflow-hidden">

            <img class="absolute object-cover object-top h-72 w-full z-0" src="/images/bg/home.jpg" alt="">

            <div class=" absolute w-full bg-gradient-to-r from-blue-300 to-blue-900 z-10 h-72 opacity-90"></div>

            <div class="flex justify-content-center mx-auto max-w-sm self-center w-full bg-white z-20
                h-12 rounded ring-8 ring-blue-800 ring-opacity-20"
                 :class="maxWidth.search_input"
            >

            </div>
        </div>

        <div class="flex justify-content-center h-full w-full mt-10">

            <div class="px-8 py-4 mx-auto bg-white rounded shadow-md dark:bg-gray-800" :class="maxWidth.container">
                <div class="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span class="text-md md:text-lg font-semibold text-gray-600 dark:text-gray-400">Top 15 catégories</span>
                </div>

                <div class="mt-2">
                    <p class="text-2xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline">
                        Accessibility tools for designers and developers
                    </p>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!</p>
                </div>

                <div class="flex items-center justify-between mt-4">
                    <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">Read more</a>

                    <div class="flex items-center">
                        <img class="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block" src="https://images.unsplash.com/photo-1502980426475-b83966705988?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=40&q=80" alt="avatar">
                        <a class="font-bold text-gray-700 cursor-pointer dark:text-gray-200">Khatab wedaa</a>
                    </div>
                </div>
            </div>

        </div>


    </div>
</template>

<script>

import {TInput, TModal} from "vue-tailwind/dist/components"
export default {
    name: "HomeComponent",
    props: ['categories'],

    components: {
        TInput, TModal,
    },

    data() {
        return {
            message: this.categories,
            showModal: false,
            maxWidth: {
                search_input: "max-w-sm xl:max-w-3xl lg:max-w-xl md:max-w-lg xs:max-w-xs",
                container: "max-w-sm xl:max-w-7xl lg:max-w-4xl md:max-w-2xl",
            },
        }
    },

    computed: {
    },

    methods: {

    },
}
</script>

<style lang="scss" scoped>

</style>
