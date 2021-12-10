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
            department: {
                name: null,
                code: null,
                posts_count: 0
            },
            selectedDep: null,

            isMobile: false,

            categories: [],
            cities: [],
            department_posts_count: null,
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
            this.department_name = depName
            this.selectedDep = id
        },

        async getCities(dep_code){
            this.selectedDep = dep_code

            await axios.post(`/api/departments/${dep_code}/cts`)
            .then( response => {
                const department = response.data.department
                this.cities = response.data.cities

                this.department.name = department.name
                this.department.code = department.code
                this.department.posts_count = response.data.department_posts_count

            })
        },

        async getCategories(){
            return axios.post('/api/categories')
                .then( response => {
                    const categories = response.data
                })
        }
    },
}
</script>

<style lang="scss">

</style>
