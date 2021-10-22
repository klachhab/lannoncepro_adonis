<script>
export default {
    name: "Create",
    props: ['favourite', 'post_slug'],
    data(){
        return {
            container: "max-w-xs xl:max-w-6xl lg:max-w-4xl md:max-w-lg sm:max-w-xl",
            show_phone: false,

            isMyFavourite: this.favourite === "true",
        }
    },

    mounted() {

    },

    methods: {
        async addToFav(){

            await axios.post(`/api/annonces/${this.post_slug}/favourite`)
                .then(response => {
                    const data = response.data

                    if (data.success){
                        this.isMyFavourite = data.result
                    }
                    else {
                        console.log(data.result)
                    }
                })
                .catch( err => {
                    return {
                        error: err
                    }
                })

        }
    }
}
</script>
