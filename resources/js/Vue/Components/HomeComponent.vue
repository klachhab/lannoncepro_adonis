<template>
    <div class="min-h-screen bg-gray-100">

        <div class="static w-full flex h-72 overflow-hidden shadow-md ">

            <div class="flex flex-wrap content-center w-full bg-gradient-to-r from-blue-300 to-blue-900 z-10 opacity-90">

            </div>

            <img class="absolute object-none object-top h-72 w-full z-0" src="/images/bg/2.jpg" alt="">

        </div>

        <div class="w-full flex h-auto bg-gray-300 overflow-hidden shadow-md z-20">

        </div>


    </div>
</template>

<script>

import {TInput, TModal} from "vue-tailwind/dist/components"
export default {
    name: "HomeComponent",
    props: ['categories'],

    components: {
        TInput,TModal,
    },

    data() {
        return {
            message: this.categories,
            showModal: false,
        }
    },

    methods: {

    },
}
</script>

<style lang="scss">

</style>
