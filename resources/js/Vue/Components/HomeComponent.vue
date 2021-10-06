<template>
    <div>

        <div class="w-full flex justify-content-center h-72 overflow-hidden">

            <img class="absolute object-cover object-top h-72 w-full z-0" src="/images/bg/home.jpg" alt="">

            <div class=" absolute w-full bg-gradient-to-r from-blue-300 to-blue-900 z-10 h-72 opacity-90"></div>

            <div class="flex justify-content-center mx-auto max-w-sm self-center w-full bg-white z-20
                h-12 rounded ring-8 ring-blue-800 ring-opacity-20"
                 :class="maxWidth.search_input"
            >

            </div>
        </div>

        <div class="px-8 py-4 mx-auto bg-white rounded shadow-md dark:bg-gray-800 mt-10 w-full"
             :class="maxWidth.carousel_container"
        >
            <div class="flex items-center justify-between border-b border-gray-200 pb-2">
                <span class="text-md md:text-lg font-semibold text-gray-600 dark:text-gray-400">
                    Top 15 catégories
                </span>
            </div>

            <swiper class="swiper mt-8" :options="swiperOption" >
                <swiper-slide
                    v-for="(data, i) in slider_data" :key="i"
                    class="bg-blue-500 mt-2 p-3 rounded-md shadow"
                >
                    {{ data.name }} - {{ data.age }} ans
                </swiper-slide>
            </swiper>

        </div>

    </div>
</template>

<script>

import {TInput, TModal} from "vue-tailwind/dist/components"

import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
    name: "HomeComponent",
    props: [],

    components: {
        TInput, TModal,
        Swiper, SwiperSlide,
    },

    data() {
        return {
            message: "",

            maxWidth: {
                search_input: "max-w-xs xl:max-w-3xl lg:max-w-xl md:max-w-lg sm:max-w-sm",
                carousel_container: "max-w-xs xl:max-w-7xl lg:max-w-4xl md:max-w-2xl sm:mas-w-xl",
            },

            slider_data: [
                {name: 'khalid', age: 29},
                {name: 'youssef', age: 30},
                {name: 'annas', age: 24},
                {name: 'ali', age: 29},
                {name: 'issam', age: 29},
                {name: 'simo', age: 28},
            ],

            swiperOption: {
                slidesPerView: 3,
                spaceBetween: 30,
                autoplay: true,
                loop: true,
                breakpoints: {
                    1440: {
                        slidesPerView: 5,
                        spaceBetween: 50
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 40
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 10
                    }
                }
            },

            glide_slider_options: {
                autoplay: true,
                perView: 6,
                animationDuration: 2000,

                breakpoints: {
                    425: {
                        perView: 1
                    },
                    768: {
                        perView: 3
                    },
                    1024: {
                        perView: 5
                    },
                    1440: {
                        perView: 6
                    },
                }
            },

        }
    },

    mounted() {

    },

    computed: {
    },

    methods: {
        onSwiper(swiper){
            console.log(swiper);
        },
        onSlideChange(){
            console.log('slide change');
        },
    },
}
</script>

<style lang="scss">

</style>
