<script>
import StarRating from 'vue-star-rating'

export default {
    name: "Create",
    components : {
        StarRating,
    },
    props: ['favourite', 'add_review', 'post_slug'],
    data(){
        return {

            container: "max-w-xs xl:max-w-6xl lg:max-w-4xl md:max-w-lg sm:max-w-xl",

            show_phone: false,

            isMyFavourite: this.favourite === "true",
            can_add_review: this.add_review === "false",

            selected_tab: 'desc',
            show_add_review: false,

            review_form: {
                rate: 0,
                comment: null
            },

            reviews: [],

        }
    },

    computed: {
        all_reviews(){
            return this.reviews
        },
    },

    mounted() {
        this.get_reviews()
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

        },

        async get_reviews(){
            await axios.get(`/api/annonces/${ this.post_slug }/get_reviews`)
            .then(result => {
                if (result.data.success) {
                    const reviews = result.data.reviews

                    for (let i = 0; i < reviews.length; i++) {
                        this.reviews.push(reviews[i])
                    }

                }
                else console.log(result.data)

            })
            .catch(err => {
                console.log(err)
            })
        },

        async save_review(){
            this.$swal({
                // icon: "success",
                // title: "Félicitation",
                // text: 'Votre avis a été ajouté avec succès'
                template: "#review_form"
            })
            return

            const form = new FormData
            form.append('comment', this.review_form.comment)
            form.append('rating', this.review_form.rate)

            await axios.post(`/api/annonces/${ this.post_slug }/add_review`, form)
                .then(result => {

                    if (result.data.success) {
                        this.$swal({
                            icon: "success",
                            title: "Félicitation",
                            text: 'Votre avis a été ajouté avec succès'
                        }).then(status => {
                            // if (status.isConfirmed) {
                            //     this.can_add_review = false
                            // }
                            this.reviews.unshift(result.data.review) // Add to the beginning of the array
                        })

                    }
                    else {
                        this.$swal({
                            icon: "error",
                            title: "Erreur",
                            text: 'Une erreur est survenue lors de l\'ajout de votre avis.\n' +
                                'Merci de contacter notre support'
                        }).then(result => {

                        })
                    }

                })
                .catch( err => {
                    console.log(err)
                })
        },

        comment2html($event){
            this.review_form.comment = $event.target.value.replace(/\n/g, '<br/>')
        }
    }
}
</script>
