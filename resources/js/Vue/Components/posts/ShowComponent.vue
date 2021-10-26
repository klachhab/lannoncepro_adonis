<script>
import StarRating from 'vue-star-rating'
import ModalBox from '../Layouts/ModalBox'
import {mapMutations} from "vuex";

export default {
    name: "Create",
    components : {
        StarRating,
        ModalBox,
    },
    props: ['favourite', 'add_review', 'post_slug', 'user_name'],
    data(){
        return {

            container: "max-w-xs xl:max-w-6xl lg:max-w-4xl md:max-w-lg sm:max-w-xl",
            grid_cols: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",

            show_phone: false,

            isMyFavourite: this.favourite === "true",
            can_add_review: this.add_review === "false",

            selected_tab: 'desc',
            show_add_review: false,

            review_form: {
                rate: 0,
                comment: ''
            },

            report_form: {
                report_type: 0,
                comment: ''
            },

            reviews: [],
            reviews_avg: 0,

            activeModal: false,

        }
    },

    computed: {
        all_reviews(){
            return this.reviews
        },

        local_reviews_avg(){
            return this.reviews_avg.toLocaleString('fr', {
                maximumFractionDigits: 1,
            })
        },
    },

    mounted() {
        this.get_reviews()
    },

    methods: {
        ...mapMutations([
            'showModal'
        ]),

        hideModal(){
            this.review_form.rate = 0
            this.review_form.comment = ""
            this.report_form.report_type = null
            this.report_form.comment = ""

            this.showModal(false)
        },

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
                    this.reviews_avg = result.data.reviews_avg

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
                        }).then(() => {

                            this.can_add_review = false

                            this.reviews.unshift(result.data.review) // Add to the beginning of the array
                            this.reviews_avg = result.data.reviews_avg

                            this.hideModal()
                        })

                    }
                    else {
                        this.$swal({
                            icon: "error",
                            title: "Erreur",
                            text: 'Une erreur est survenue lors de l\'ajout de votre avis.\n' +
                                `Merci de contacter notre support.`
                                // + `${result.data.error}`
                        })
                    }

                })
                .catch( err => {
                    console.log(err)
                })
        },

        async detach_review(index){
            await axios.post(`/api/annonces/${ this.post_slug }/detach_review`)
                .then(response => {
                    if (response.data.success) {
                        this.reviews.splice(index, 1)
                        this.can_add_review = true

                        console.log(response.data)
                    }
                    else {
                        this.$swal({
                            icon: "error",
                            title: "Erreur",
                            text: 'Une erreur est survenue lors de l\'ajout de votre avis.\n' +
                                `Merci de contacter notre support.`
                            // + `${result.data.error}`
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
