<script>
import StarRating from 'vue-star-rating'
import ModalBox from '../Layouts/ModalBox'
import {mapMutations} from "vuex";
import 'video.js/dist/video-js.css'

import { videoPlayer } from 'vue-video-player'

export default {
    name: "Create",
    components : {
        StarRating,
        ModalBox,
        videoPlayer
    },
    props: ['favourite', 'add_review', 'add_report', 'post_slug', 'user_name', 'user_email', 'local_video_src'],

    data(){
        return {

            container: "max-w-xs xl:max-w-6xl lg:max-w-4xl md:max-w-lg sm:max-w-xl",
            grid_cols: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",

            field_class: {
                has_err: "border-red-300 focus:border-red-300 ring-red-200 ring ring-opacity-50 focus:ring-red-200 focus:ring focus:ring-opacity-50",
                normal: `border-gray-300 focus:border-blue-400 focus:ring-blue-300`,
            },

            show_phone: false,

            isMyFavourite: this.favourite === "true",
            can_add_review: this.add_review === "false",
            can_add_report: this.add_report=== "false",

            selected_tab: 'desc',
            show_add_review: false,
            show_add_report: false,

            review_form: {
                rate: 0,
                comment: null
            },

            report_form: {
                report_ref: null,
                comment: null
            },

            message_form: {
                from_name: this.user_name === 'null' ? null : this.user_name,
                from_email: this.user_email === 'null' ? null : this.user_email,
                message: null,
            },

            // --------------------------

            reviews: [],
            reviews_avg: 0,

            activeModal: false,

            // --------------------------
            videoOptions: {
                autoplay: false,
                controls: true,
                language: 'en',
                fluid: true,
                sources: [{
                    type: "video/mp4",
                    src: this.local_video_src
                }],

            }

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

        if (this.user_name !== 'null') {
            this.disableInput(this.$refs.name_input)
        }

        if (this.user_email !== 'null') {
            this.disableInput(this.$refs.email_input)
        }

    },

    methods: {
        ...mapMutations([
            'showModal'
        ]),

        modal(type){

            if (type === "report" && !this.can_add_report) {

                this.$swal({
                    icon: "error",
                    title: "Demande non prise en compte",
                    text: 'Vous avez déjà signalé cette annonce.'
                })

            }

            else this.showModal({ modal_type: type, show: true})
        },

        hideModal(){

            this.review_form.rate = 0
            this.review_form.comment = null

            this.report_form.report_ref = null
            this.report_form.comment = null

            this.showModal({ modal_type: '', show: false})
        },


        reviewComment2html($event){
            this.review_form.comment = $event.target.value.replace(/\n/g, '<br/>')
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
            this.$swal({
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: "Oui",
                cancelButtonText: "Annuler",
                text: 'Vous en êtes sûr ?'
            })
            .then(async status => {
                if(status.isConfirmed) {
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
                }
            })

            return



        },


        reportComment2html($event){
            this.report_form.comment = $event.target.value.replace(/\n/g, '<br/>')
        },

        async save_report(){
            // console.log(this.report_form)
            // return

            const form = new FormData
            form.append('comment', this.report_form.comment)
            form.append('ref', this.report_form.report_ref)

            await axios.post(`/api/annonces/${ this.post_slug }/add_report`, form)
                .then(result => {

                    // console.log(result.data)
                    // return

                    if (result.data.success) {
                        this.$swal({
                            icon: "success",
                            title: "Rapport envoyé",
                            text: 'Votre rapport a été envoyé avec succès pour étude'
                        }).then(() => {

                            this.can_add_report   = false
                            this.hideModal()
                        })

                    }
                    else {
                        this.$swal({
                            icon: "error",
                            title: "Erreur",
                            text: 'Une erreur est survenue lors de l\'envoi de votre rapport.\n' +
                                `Merci de contacter notre support.`
                            // + `${result.data}`
                        })
                    }

                })
                .catch( err => {
                    console.log(err)
                })
        },


        message2html($event){
            this.message_form.message = $event.target.value.replace(/\n/g, '<br/>')
        },


        disableInput(...inputs) {
            inputs.forEach(input => {
                input.classList.add('bg-gray-100', 'text-gray-400')
                input.disabled = true
            })
        },

        async send_message() {

            const form = new FormData
            form.append('message', this.message_form.message)
            form.append('from_name', this.message_form.from_name)
            form.append('from_email', this.message_form.from_email)


            await axios.post(`/api/annonces/${ this.post_slug }/send_message`, form)
                .then(result => {

                    if (result.data.success) {

                        this.$swal({
                            icon: "success",
                            title: "Message envoyé",
                            text: 'Votre message a été envoyé avec succès pour étude'
                        }).then(() => {
                            const conversation = result.data.conversation

                            this.message_form.message = null
                            this.message_form.from_name = conversation.from_name
                            this.message_form.from_email = conversation.from_email

                            this.hideModal()
                        })

                    }

                    else {
                        this.$swal({
                            icon: "error",
                            title: "Erreur",
                            text: 'Une erreur est survenue lors de l\'envoi de votre message.\n' +
                                `Merci de contacter notre support.`
                            // + `${result.data}`
                        })
                    }


                })
        },
    }
}
</script>
