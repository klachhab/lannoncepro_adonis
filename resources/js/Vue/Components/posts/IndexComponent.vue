<template>
    
    <div class=" max-h-full flex flex-col pb-20">

        <div class="h-full w-full mx-auto mt-14" :class="container">
            <span class="text-white"><a href="/">Accueil</a> / annonces</span>
            <br>
            <span class="text-white text-3xl font-semibold">Liste des annonces</span>
        </div>

        <!-- Search section -->
        <div class="w-full flex justify-center mt-14">

            <div class="flex self-center items-center rounded mx-auto max-w-sm z-20 w-full h-12 ring-4 ring-blue-800 ring-opacity-20" :class="maxWidth.search_input">

                <div class="flex items-center w-full bg-white h-full rounded"

                >

                    <!-- Search Input-->
                    <div class="h-full flex flex-1 items-center border-r border-gray-200 pl-4"
                    >

                        <input v-model="filters.keyword" type="text"
                               placeholder="Que cherchez vous ?"
                               class="w-full focus-visible:outline-none py-3 bg-transparent text-md text-gray-600"
                        >

                    </div>
                </div>


                <span class="inline align-middle text-white h-full px-12 py-3 rounded-r bg-blue-500">
                    {{ meta.total }} Annonces
                </span>
            </div>

        </div>
        <!-- ! Search section ! -->

        <div class="flex justify-center grid grid-cols-5 gap-4 w-full mt-14 px-48">

            <!-- Filters section -->
            <div class="flex flex-col w-full self-start rounded">

                <!-- Category -->
                <div class="w-full flex flex-col rounded mb-3">

                    <div class="flex w-full items-center bg-gray-200 rounded-t py-2 px-4 cursor-pointer"
                         @click="show.categories = !show.categories"
                    >
                        <span class="flex-1 w-full">Catégories</span>

                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                        </svg>
                    </div>

                    <div class="w-full rounded-b bg-white overflow-auto transition duration-200"
                         :class="show.categories ? 'py-2' : 'h-0'"
                    >
                        <div v-if="sub_categories.length" class="flex flex-col w-full py-2">

                            <span class="w-full ml-4 my-1 cursor-pointer text-blue-600"
                                  @click="sub_categories = []; filters.ctg = null; filters.pctg = null"
                            >
                                {{ selected_categ_name }}
                            </span>

                            <span class="w-full ml-6 my-1 cursor-pointer transition duration-100"
                                  v-for="(category, index) in sub_categories" :key="index"
                                  :class="filters.ctg === category.slug ? 'text-blue-600' : 'hover:text-blue-600'"
                                  @click="filters.ctg = category.slug"
                            >
                                {{ category.name }}
                            </span>

                        </div>

                        <div v-else class="flex flex-col w-full rounded-b py-2">

                            <span class="w-full ml-4 my-1 cursor-pointer transition duration-100"
                                  v-for="(category, index) in categories" :key="index"
                                  :class="filters.pctg === category.slug ? 'text-blue-600 translate-x-3' : 'hover:text-blue-600 hover:translate-x-3'"
                                  @click="getSubCategories(index)"
                            >
                                {{ category.name }}
                            </span>

                        </div>
                    </div>
                </div>

                <!-- Type of User -->
                <div class="w-full flex flex-col rounded mb-3">
                    <div class="flex w-full items-center bg-gray-200 rounded-t py-2 px-4 cursor-pointer"
                         @click="show.user_type = !show.user_type"
                    >
                        <span class="flex-1 w-full">Publié par</span>

                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                        </svg>
                    </div>

                    <div class="w-full rounded-b bg-white overflow-auto"
                         :class="show.user_type ? 'py-2' : 'h-0'"
                    >
                        <div class="mt-2">
                            <label class="w-full ml-4 my-1 inline-flex items-center cursor-pointer select-none">
                                <input v-model="filters.type" type="radio" class="form-radio" value="ind">
                                <span class="ml-2">Individuel</span>
                            </label>

                            <label class="w-full ml-4 my-1 inline-flex items-center cursor-pointer select-none">
                                <input v-model="filters.type" type="radio" class="form-radio" value="pro">
                                <span class="ml-2">Professionnel</span>
                            </label>

                            <label class="w-full ml-4 my-1 inline-flex items-center cursor-pointer select-none">
                                <input v-model="filters.type" type="radio" class="form-radio" value="" checked>
                                <span class="ml-2">Tous</span>
                            </label>

                        </div>
                    </div>

                </div>

                <!-- Price -->
                <div class="w-full flex flex-col rounded mb-3">
                    <div class="flex w-full items-center bg-gray-200 rounded-t py-2 px-4 cursor-pointer"
                         @click="show.price = !show.price"
                    >
                        <span class="flex-1 w-full">Prix</span>

                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                        </svg>
                    </div>

                    <div class="w-full rounded-b bg-white overflow-auto"
                         :class="show.price ? 'py-2' : 'h-0'"
                    >
                        <div class="mt-2 px-2">
                            <label class="relative block my-1">

                                <input type="text" v-model="filters.minprx"
                                       class="block bg-white w-full border border-gray-300 rounded-md py-2 pr-9 pl-3
                                       placeholder:text-gray-400 focus:outline-none
                                       focus:border-blue-400 focus:ring-1 focus:ring-blue-300 sm:text-sm"
                                       placeholder="Prix minimal"
                                >

                                <span class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-text text-gray-300">
                                    €
                                </span>
                            </label>

                            <label class="relative block mb-1 mt-4">

                                <input type="text" v-model="filters.maxprx"
                                       class="block bg-white w-full border border-gray-300 rounded-md py-2 pr-9 pl-3
                                       placeholder:text-gray-400 focus:outline-none
                                       focus:border-blue-400 focus:ring-1 focus:ring-blue-300 sm:text-sm"
                                       placeholder="Prix maximal"
                                >

                                <span class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-text text-gray-300">
                                    €
                                </span>
                            </label>

                        </div>
                    </div>

                </div>

                <!-- Condition -->
                <div class="w-full flex flex-col rounded mb-3">
                    <div class="flex w-full items-center bg-gray-200 rounded-t py-2 px-4 cursor-pointer"
                         @click="show.condition = !show.condition"
                    >
                        <span class="flex-1 w-full">Condition</span>

                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                        </svg>
                    </div>

                    <div class="w-full rounded-b bg-white overflow-auto"
                         :class="show.condition ? 'py-2' : 'h-0'"
                    >
                        <div class="mt-2">

                            <label class="w-full ml-4 my-1 inline-flex items-center cursor-pointer select-none">
                                <input v-model="filters.cndt" type="radio" class="form-radio" value="new">
                                <span class="ml-2">Neuf</span>
                            </label>

                            <label class="w-full ml-4 my-1 inline-flex items-center cursor-pointer select-none">
                                <input v-model="filters.cndt" type="radio" class="form-radio" value="used">
                                <span class="ml-2">Utilisé</span>
                            </label>

                            <label class="w-full ml-4 my-1 inline-flex items-center cursor-pointer select-none">
                                <input v-model="filters.cndt" type="radio" class="form-radio" value="" checked>
                                <span class="ml-2">Toutes</span>
                            </label>

                        </div>
                    </div>

                </div>


            </div>


            <!-- Posts section -->
            <div class="flex flex-col items-center col-span-3 w-full bg-white rounded p-8">

                <span class="self-start text-2xl">List des annonces</span>

                <hr class="w-full border-gray-200 my-5">

                <!-- Posts -->
                <span v-if="!posts.length" class="w-full lg:text-4xl md:text-3xl text-xl text-gray-500 select-none text-center">
                    Aucune annonce n'a été trouvé
                </span>


                <div v-for="(post, index) in posts" :key="index"
                     class="flex flex-col md:flex-row mb-3 p-3 rounded w-full">

                    <img alt="tailwind logo" src="http://via.placeholder.com/640x360"
                         class="rounded-lg rounded-lg h-48 w-full object-cover md:h-full md:w-48 mr-5 mr-5"
                    >

                    <div class="flex-1 w-full bg-white flex flex-col">

                        <a :href="`/annonces/${post.slug}`"
                           class="font-bold text-gray-800 md:text-xl text-md"
                        >
                            {{ post.title }}
                        </a>

                        <p class="text-green-500 mt-2">
                            <span
                                class="text-2xl font-semibold">
                                {{ post.prix }}
                            </span>
                        </p>

                        <div class="flex items-center w-full h-full mt-2 bg-gray-100 px-4 rounded">

                            <span class="text-sm text-gray-400 font-light mr-4">
                                <i class="far fa-clock"></i>
                                {{ post.creation_date }}
                            </span>

                            <span class="flex flex-1 items-center text-sm text-gray-400 font-light hover:text-blue-400 transition-all duration-200">
                                <svg class="h-4 w-4 mr-1"
                                     xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>

                                {{ post.condition === 'new' ? "Neuf" : "Utilisé"}}
                            </span>

                            <span class="tooltip flex text-sm text-gray-400 font-light hover:text-blue-400 transition-all duration-200"
                               :data-tip="post.city.name"
                            >
                                <svg class="h-4 w-4 mr-4"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </span>


                            <span class="tooltip flex text-sm text-gray-400 font-light hover:text-blue-400 transition-all duration-200"
                               :data-tip="post.user.is_pro ? 'Professionnel' : 'Individuel'"
                            >
                                <svg v-if="post.user.is_pro" class="h-4 w-4 mr-4"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>

                                <svg v-else class="h-4 w-4 mr-4"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>

                            </span>

                        </div>

                    </div>
                </div>

                <!-- ! Posts ! -->

                <t-pagination v-if="meta.last_page > 1"
                    :total-items="meta.total"
                    :per-page="meta.per_page"
                    v-model="filters.page"
                />

            </div>

            <!-- ! Posts section ! -->

            <div class="flex w-full h-24 bg-white rounded"></div>

        </div>
    </div>
    
</template>


<script>
import { mapState } from "vuex";
import { TPagination } from "vue-tailwind/dist/components";

export default {
    name: "IndexComponent",
    components: {
        TPagination
    },
    props: [],

    data(){
        return {
            // Search section =========================
            maxWidth: {
                search_input: "max-w-xs xl:max-w-3xl lg:max-w-xl md:max-w-lg sm:max-w-sm",
                container: "max-w-xs xl:max-w-7xl lg:max-w-4xl md:max-w-2xl sm:mas-w-xl",
            },

            // Filter section =========================

            show: {
                categories: true,
                user_type: true,
                price: true,
                condition: true,

            },
            selected_categ_name: null,

            categories: [],
            sub_categories: [],

            // Posts section =========================

            queryUrl: "/annonces",
            meta: {},
            filters: {
                keyword: null,
                cndt: "",
                cty: null,
                dpt: null,
                ctg: null,
                pctg: null,
                prx: null,
                minprx: null,
                maxprx: null,
                negotiable: null,
                featured: null,
                type: '',
                page: 1,
                orderBy: '',
            },

            posts: [],

            prix: {
                from: 0,
                to: 0
            }
        }
    },

    watch: {
        filters: {
            handler(filters) {
                this.filterPosts(filters)
            },
            deep: true
        }
    },

    computed: {
        ...mapState([
            'container'
        ]),
    },

    mounted() {
        // this.filters = this.$route.query
        this.filterPosts(this.filters)
        this.getCategories()

        if ( this.$router.currentRoute.fullPath !== '/annonces') {
            this.$router.replace( '/annonces' )
        }
    },

    methods: {
        // Search Section =========================
        async getCategories(){

            await axios.get('/api/categories')
                .then(response => {
                    this.categories = response.data
                })
                .catch( err => {
                    console.log(err.message)
                })
        },


        getSubCategories(index){
            this.selected_categ_name = this.categories[index].name

            this.sub_categories = this.categories[index].subs
            this.filters.pctg = this.categories[index].slug
            this.filters.ctg = null

        },


        hideCategories(){
            this.sub_categories = []
            this.filters.pctg = null
            this.filters.ctg = null
        },

        // Get Posts Section =========================
        changePage(val){
            this.filters.page = val
        },

        filterQuery(key, val){
            this.filters[key] = val
        },

        async filterPosts(filters){
            const arrUrl = []
            for (const k in filters) {
                if ( filters[k]) {
                    arrUrl.push(`${k}=${filters[k]}`)
                }
            }

            const uri = `/annonces?api=1${ arrUrl.length ? `&${arrUrl.join('&')}` : '' }`

            axios.get(uri)
                .then( response => {

                    this.meta = response.data.meta
                    this.posts = response.data.data

                })
        },


    },
}
</script>
