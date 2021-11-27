<template>

    <div class="lg:col-span-7 col-span-12">
        <div class="flex-1 py-4 px-8 w-full rounded bg-white">

            <span class="text-2xl font-light mb-5">Annonces</span>

            <hr class="w-full border-gray-300 my-5">

            <!-- component -->
            <div class="mb-5">

                <div class="flex mb-3 p-3 rounded-md shadow"
                     v-for="(post, index) in posts"
                >

                    <img :src="post.primary_image" alt="tailwind logo"
                         class="rounded-lg w-32 h-32 mr-5"
                    >

                    <div class="w-full md:w-2/3 bg-white flex flex-col">
                        <a :href="`/annonces/${ post.slug }`" target="_blank" class="font-bold text-gray-800 md:text-xl text-md">
                            {{ post.title }}
                        </a>
                        <p class="text-green-500 mt-2">
                            <span class="text-2xl font-semibold">
                                {{ post.prix }}
                            </span>
                            <small class="text-lg font-normal" v-if="post.negotiable">
                                (négociable)
                            </small>
                        </p>

                        <div class="flex items-stretch w-full mt-2">
                            <span class="text-sm text-gray-400 font-light mr-4">
                                <i class="far fa-clock"></i>
                                {{ post.creation_date }}
                            </span>
                            <span class="flex text-sm text-gray-400 font-light">
                                <i class="fas fa-map-marker-alt mr-2 mt-1"></i>
                                <a :href="`/annonces/?cty=${ post.city.code }`" class="hover:text-blue-600 transition-all duration-200 ease-in-out">
                                    {{ post.city.name }}
                                </a>
                            </span>
                        </div>

                        <div v-if="is_me === 'true'" class="flex items-center w-full mt-2 text-gray-500">
                            <a href="#" class="transition duration-300 ease-in-out hover:text-red-500"
                               @click.prevent="removePost(index)"
                            >
                                <i class="fas fa-trash text-red-500 mr-2"></i>
                                <span class="font-normal"
                                >
                                    Supprimer
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

            </div>

            <t-pagination v-if="posts.length && meta.last_page > 1"
                :total-items="meta.total"
                :per-page="meta.per_page"
                v-model="meta.current_page"
                @change="getPosts"
            />

        </div>
    </div>

</template>

<script>
import {mapState} from "vuex";
import {
    TPagination,
} from 'vue-tailwind/dist/components'

export default {
    name: "PostsComponent",
    props: ['is_me'],
    components: {
        TPagination
    },
    data(){
        return {
            meta: {
                current_page: 1,
                per_page: 5,
                last_page: 10,
                total: 20,
            },

            posts: []
        }
    },

    computed: {
        ...mapState([
            'username'
        ]),

    },

    mounted() {
        this.getPosts(this.meta.current_page)
    },

    methods: {
        async getPosts(page){
            await axios.post(`/api/profile/${ this.username }/posts`, {
                page,
                valid: 1
            })

                .then(response => {
                    const config = response.data.meta

                    this.meta = {
                        current_page: config.current_page,
                        per_page: config.per_page,
                        last_page: config.last_page,
                        total: config.total,
                    }
                    this.posts = response.data.data

                })

        },

        async removePost(index){

            const post = this.posts[index]

            await axios.delete(`/api/annonces/annonce/${post.slug}`)
                .then( response => {
                    const data = response.data

                    if (data.success){
                        this.posts.splice(index, 1)
                        this.getPosts(this.meta.current_page)
                    }
                    else {
                        console.log(data.result)
                    }
                })


        },
    }
}
</script>

<style scoped>

</style>
