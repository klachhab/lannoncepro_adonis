
<script>

import { TInput, TModal } from "vue-tailwind/dist/components"

import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import { France } from "../../france";

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
            found_departments:[],


            show_menu: false,
            show_sub_menu: false,

            selected_category: {
                slug: null,
                name: null,
            },

            search_form: {
                keyword: '',
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
            else {
                this.show_menu = false
                this.show_sub_menu = false
                this.selected_category = {
                    slug: null,
                    name: null
                }
            }
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
            this.show_menu = !this.show_menu
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
        },


        async filterPosts(key, val){

            this.queries[key] = val

            if (this.search_form.keyword === ''){
                delete this.queries['keyword']
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

        // ==========================================

        getDepName(id, depName){
            this.department_name = depName
            this.department.code = id
        },

        async getCities(dep_code){
            this.selectedDep = dep_code

            await axios.post(`/api/departments/${dep_code}/cts`)
                .then( response => {

                    const department = response.data.departments[0]
                    const cities = department.cities
                    const posts_count = cities
                        .map(city => city.meta.posts_count)
                        .reduce( (a,b) => a + b, 0)

                    this.cities = cities.sort((a,b) => {
                        return b.meta.posts_count - a.meta.posts_count
                    }).slice(0, 14)

                    this.department = {
                        name: department.name,
                        code: department.code,
                        posts_count: posts_count,
                        selected: true,
                    }

                    this.search_department = null
                    this.found_departments = []
                })
        },


        async searchDepartment(){

            if (this.search_department === '') {
                this.found_departments = []
                return
            }

            if (this.search_department) {
                return await axios.get(`/api/departments/${this.search_department}/cts`)
                    .then( response => {
                        const success = response.data.success

                        if (success) {
                            this.found_departments = []
                            const departments = response.data.departments

                            for ( const departmentKey in departments ) {
                                this.found_departments.push({
                                    name: departments[departmentKey].name,
                                    code: departments[departmentKey].code
                                })
                            }
                            // if ( this.found_departments.length === 1 ) {
                            //     // this.search_department = this.found_departments[0].name
                            //     this.getCities(this.found_departments[0].code)
                            // }
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

        selectDepartment(){
            if (this.found_departments.length === 1) {
                this.department.selected = true
                this.search_department = null
                this.getCities(this.found_departments[0].code)
            }
        },

    },
}
</script>

<style lang="scss">

</style>
