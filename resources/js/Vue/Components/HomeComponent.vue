<script>

import {TInput, TModal} from "vue-tailwind/dist/components"

import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import {France} from "../../france";
import {mapState} from "vuex";

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
                posts_count: 0,
                selected: false,
            },

            selectedDep: null,

            isMobile: false,

            categories: [],
            sub_categories: [],

            show_category_name: false,

            cities: [],
            department_posts_count: null,
            search_department: null,

            show_menu: false,
            show_sub_menu: false,

            selected_category: {
                slug: null,
                name: null,
            },

            search_form: {
                q: '',
                category: {
                    slug: null,
                    name: null,
                },
                parent_category: {
                    slug: null,
                    name: null,
                },
                cty: null,
                dpt: null,
            },
            filtered_count: null,
            queries: [],
            queryUrl: "/annonces",
        }
    },

    created() {
        setInterval( () => {
            this.isMobile = screen.width < 768
        }, 100)
    },

    methods: {
    //    Top cities
        getDepName(id, depName){
            this.department_name = depName
            this.department.code = id
        },

        async getCities(dep_code){
            this.selectedDep = dep_code

            await axios.post(`/api/departments/${dep_code}/cts`)
                .then( response => {
                    const department = response.data.department
                    this.cities = response.data.cities

                    this.department = {
                        name: department.name,
                        code: department.code,
                        posts_count: response.data.department_posts_count,
                        selected: true,
                    }

                    this.search_department = null
                })
        },


        async searchDpartment($event){
            $event.target.value = $event.target.value.charAt(0).toUpperCase()

            if (this.search_department) {
                this.search_department.charAt(0).toUpperCase()

                return await axios.get(`/api/departments/${this.search_department}/cts`)
                    .then( response => {
                        const success = response.data.success

                        if (success) {
                            const department = response.data.department

                            this.department.name = department.name;
                            this.department.code = department.code;
                            this.department.posts_count = response.data.department_posts_count;

                        }
                        else {
                            this.department.name = null
                            this.department.code = null
                        }

                    })
            }

            else {
                this.department.name = null
                this.department.code = null
            }
        },


        selectDpartment($event){
            if (this.department.code) {
                this.department.selected = true
                this.search_department = null
                this.getCities(this.department.code)
            } else {
                alert("Aucune ville n'a été trouvée. Merci de réessayer.")
            }
        },


        async getCategories(){
            if (!this.show_menu) {
                this.search_form.category = {
                    slug: null,
                    name: null
                }
                await axios.get('/api/categories')
                    .then(response => {
                        this.categories = response.data
                        this.show_menu = true
                    })
            }
            else this.show_menu = false
        },


        showSubCategories(index){
            this.sub_categories = this.categories[index].subs
            this.selected_category.name = this.categories[index].name
            this.selected_category.slug = this.categories[index].slug
            this.show_sub_menu = true
        },

        hideCategories(){
            this.search_form.category.slug = null;
            this.search_form.parent_category.slug = null;
            this.search_form.category.name = null;
            this.search_form.parent_category.name = null;
            this.show_menu = false;
            this.show_sub_menu = false;
            this.selected_category.slug = false;

            delete this.queries['ctg']
            delete this.queries['pctg']
        },

        selectCategory(category, parent){
            if (parent) {
                this.search_form.parent_category = {
                    slug: category.slug,
                    name: category.name,
                };

                this.search_form.category = {
                    slug: null,
                    name: null,
                };

            } else {
                this.search_form.category = {
                    slug: category.slug,
                    name: category.name,
                }

                this.search_form.parent_category = {
                    slug: null,
                    name: null,
                };
            }
            this.show_menu = false
        },


        async filterPosts(key, val){

            this.queries[key] = val

            if (this.search_form.q === ''){
                delete this.queries['q']
            }

            const arrUrl = []
            for (const k in this.queries) {
                arrUrl.push(`${k}=${this.queries[k]}`)
            }

            const queryFilter = arrUrl.length? `/api/filter-home?${arrUrl.join('&')}` : '/api/filter-home'
            this.queryUrl = arrUrl.length? `/annonces?${arrUrl.join('&')}` : '/annonces'

            // axios.get(queryFilter)
            //     .then( response => {
            //         console.log(response)
            //         this.filtered_count = response.data
            //     })
        },
    },
}
</script>

<style lang="scss">

</style>
