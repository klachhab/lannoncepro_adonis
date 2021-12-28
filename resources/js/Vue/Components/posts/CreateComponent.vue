<template>

</template>

<script>
import {mapState} from "vuex";

export default {
    name: "Create",
    data(){
        return {
            // container: "max-w-xs xl:max-w-6xl lg:max-w-4xl md:max-w-lg sm:max-w-xl",
            category: null,

            sub_categories: [],
            sub_category: null,
        }
    },

    computed: {
        ...mapState([
            'container'
        ]),

    },

    methods: {
        async getSubs(slug){
            this.category = slug
            this.sub_category = null

            await axios.post('/api/category', { slug } )
                .then( response => {
                    this.sub_categories = response.data
                })
                .catch(err => {
                    console.log(err)
                })
        },

        async submit() {
            this.$refs.cpt.submit()
        },
    }
}
</script>
