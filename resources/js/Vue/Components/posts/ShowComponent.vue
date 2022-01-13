<script>
import StarRating from 'vue-star-rating'
import ModalBox from '../Layouts/ModalBox'
import { mapGetters, mapMutations } from "vuex";
import 'video.js/dist/video-js.css'
import {mapState} from "vuex";

import { videoPlayer } from 'vue-video-player'
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import 'swiper/css/swiper.css'

export default {
    name: "Create",
    components : {
        StarRating,
        ModalBox, videoPlayer,
        Swiper, SwiperSlide,
    },
    props: ['favourite', 'add_review', 'add_report', 'post_slug', 'user_name', 'user_email', 'local_video_src'],

    data(){
        return {

            // container: "max-w-xs xl:max-w-6xl lg:max-w-4xl md:max-w-lg sm:max-w-xl",
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

            // --------------------------

            swiperOption: {
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
            },

            thumbSwiperOption: {
                spaceBetween: 10,
                // centeredSlides: true,
                slidesPerView: 'auto',
                touchRatio: 0.2,
                slideToClickedSlide: true,
                breakpoints: {
                    1024: {
                        slidesPerView: 5,
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

            selectedSlide: 0,
            slider_pics: [],
            // --------------------------

            report_form: {
                name: '',
                email: '',
                report_type: null,
                comment: ''
            },

            report_errors: {},
            // --------------------------
            message_form: {
                from_name: this.user_name === 'null' ? null : this.user_name,
                from_email: this.user_email === 'null' ? null : this.user_email,
                message: null,
            },

            // --------------------------
            review_form: {
                rate: 0,
                comment: null
            },

            reviews: [],
            reviews_avg: 0,

            activeModal: false,

            // --------------------------
            videoOptions: {
                autoplay: false,
                controls: true,
                language: 'fr',
                fluid: true,
                sources: [{
                    type: "video/mp4",
                    src: this.local_video_src
                }],

            }

        }
    },

    computed: {
        ...mapState([
            'container'
        ]),

        ...mapGetters([
            "getInputClass",
        ]),

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
        this.get_pics()

        if ( this.slider_pics.length) {
            const swiperTop = this.$refs.swiperTop.$swiper
            const swiperThumbs = this.$refs.swiperThumbs.$swiper

            swiperTop.on( 'slideChange', () => {
                this.selectedSlide = swiperTop.activeIndex
                swiperThumbs.slideTo( swiperTop.activeIndex )
            } )
        }

    },

    methods: {

        ...mapMutations([
            'showModal'
        ]),

        async get_pics(){
            await axios.get('?pictures=1')
                .then(response => {
                    this.slider_pics = response.data.map(pic => pic.path)
                    // console.log(pictures)

                    // this.slider_pictures

                })
        },

        swipePicture(index){
            this.selectedSlide = index
            const swiperTop = this.$refs.swiperTop.$swiper
            swiperTop.slideTo(index)
        },
        // ------------------------------------------------------

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

            this.review_form = {
                rate: 0,
                comment: null
            }

            this.report_errors = {}
            this.report_form = {
                name: '',
                email: '',
                report_type: null,
                comment: ''
            }


            this.message_form.message = null
            this.$refs.text_message.value = null

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
                    else if ( data.result === 'not_verified' ) {
                        this.$swal({
                            icon: "warning",
                            title: "Votre compte n'est pas encore validé",
                            text: `Merci de consulter votre boite e-mail afin de confirmer votre compte.`
                            // + `${result.data.error}`
                        })
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

        async send_report(){

            const form = new FormData
            form.append('comment', this.report_form.comment)
            form.append('report_type', this.report_form.report_type)
            form.append('name', this.report_form.name)
            form.append('email', this.report_form.email)


            await axios.post(`/api/annonces/${ this.post_slug }/add_report`, form)
                .then(result => {

                    // console.log(result.data)

                    if ( !result.data.success ) {

                        if ( result.data.error === 'validation' ) {
                            this.report_errors = result.data.result
                        }

                        else this.$swal( {
                            icon: "error",
                            title: "Erreur",
                            text: 'Une erreur est survenue lors de l\'envoi de votre message.\n' +
                                `Merci de contacter notre support.`
                            // + `${result.data}`
                        } )
                    }
                    else {

                        this.$swal({
                            icon: "success",
                            title: "Rapport envoyé",
                            text: 'Votre rapport a été envoyé avec succès pour étude'
                        }).then(() => {

                            window.localStorage.setItem('report', result.data.report)

                            this.report_errors = {}
                            this.hideModal()
                        })
                    }

                    return

                    if ( !result.data.success && result.data.error === 'validation' ) {
                        this.report_errors = result.data.result
                    }

                    if (result.data.success) {
                        this.$swal({
                            icon: "success",
                            title: "Rapport envoyé",
                            text: 'Votre rapport a été envoyé avec succès pour étude'
                        }).then(() => {

                            this.can_add_report = false
                            this.hideModal()
                        })

                    }
                    else {
                        this.report_errors = result.data.result
                    }

                })
                .catch( err => {
                    console.log(err)
                })
        },


        message2html($event){
            this.message_form.message = $event.target.value.replace(/\n/g, '<br/>')
        },

        async send_message() {

            const form = new FormData
            form.append('message', this.message_form.message)
            form.append('direction', 'from_user')
            form.append('from_name', this.message_form.from_name)
            form.append('from_email', this.message_form.from_email)


            await axios.post(`/api/annonces/${ this.post_slug }/send_message`, form)
                .then(result => {

                    const conversation = result.data.conversation
                    const success = result.data.success

                    if (success) {

                        this.$swal({
                            icon: "success",
                            title: "Message envoyé",
                            text: 'Votre message a été envoyé avec succès pour étude'
                        }).then(() => {

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

                .catch( err => {
                    return {
                        error: err.message
                    }
                } )
        },
    }
}
</script>
