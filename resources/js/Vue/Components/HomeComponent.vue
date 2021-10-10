<script>

import {TInput, TModal} from "vue-tailwind/dist/components"

import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import {France} from "../../france";

export default {
    components: {
        TInput, TModal,
        Swiper, SwiperSlide,
    },

    data() {
        return {

            maxWidth: {
                search_input: "max-w-xs xl:max-w-3xl lg:max-w-xl md:max-w-lg sm:max-w-sm",
                container: "max-w-xs xl:max-w-7xl lg:max-w-4xl md:max-w-2xl sm:mas-w-xl",
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
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false
                },
                loop: false,
                breakpoints: {
                    1440: {
                        slidesPerView: 5,
                        // spaceBetween: 50
                    },
                    1024: {
                        slidesPerView: 4,
                        // spaceBetween: 40
                    },
                    768: {
                        slidesPerView: 3,
                        // spaceBetween: 30
                    },
                    640: {
                        slidesPerView: 2,
                        // spaceBetween: 20
                    },
                    320: {
                        slidesPerView: 1,
                        // spaceBetween: 10
                    }
                },
            },

            top_cities:  'Top 15 cities',

            mapFrance: {
                ...France
            },
            selectedDep: null,

            isMobile: false,
        }
    },

    created() {
        setInterval( () => {
            this.isMobile = screen.width < 768
        }, 100)
    },

    computed: {
    },

    methods: {
    //    Top cities
        getDepName(id, depName){
            // axios.get('https://geo.api.gouv.fr/departements', {})
            // .then(respo => {
            //     console.log(respo.data)
            // })
            this.selectedDep = depName
        }
    },
}
</script>

<style lang="scss">

</style>
