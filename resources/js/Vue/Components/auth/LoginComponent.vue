<script>
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
    components: {
    },

    data() {
        return {
            container: "max-w-xs lg:max-w-lg md:max-w-lg sm:max-w-xl",

            password_variants: {
                container: {
                    default: " border-gray-300 bg-white placeholder-gray-400",
                    focused: " border-blue-400 ring-1 ring-blue-300",
                    danger: " border-red-300 bg-red-50 focus:border-red-400 focus:ring-1 focus:ring-red-300",
                    danger_focused: " border-red-400 ring-1 ring-red-300",
                },
                input: {
                    default: " text-red-900 placeholder-gray-400",
                    danger: " placeholder-red-400 text-red-900",
                },
                eye_icon: {
                    default: " text-red-900 placeholder-gray-400",
                    danger: " placeholder-red-400 text-red-900",
                }
            },

            password_has_error: false,


            form: {
                auth_field: "",
                password: "",
            },

            error_field: "",

            hide_password: true,
            select_pass: false,

            errorFields: [],

            reset: false,
            reset_email: "",

            request_sent: false,


            default_btn_class: 'cursor-pointer bg-blue-500 transition delay-75 ease-in-out hover:bg-transparent hover:bg-blue-700 focus:bg-blue-700'
        }
    },

    computed: {
        ...mapState([
            'input_class', 'select_class'
        ]),

        ...mapGetters([
            "getInputClass"
        ]),

        password_class() {
            const clss = this.select_pass ? " border-blue-400 ring-1 ring-blue-300" : "border-gray-300"
            const danger = this.select_pass ? " border-red-400 ring-1 ring-red-300" : " border-red-300"

            return this.password_has_error ? `bg-red-50 ${danger}` : clss
        },

    },

    methods: {
        ...mapMutations([
            'setPassMatch', 'setUserExists'
        ]),

        blurInput($event, field){

            const element = $event.target
            const defaultClasses = this.getInputClass('default').split(" ")
            const errorClasses = this.getInputClass('error').split(" ")

            if (this.errorFields.includes(field)) {
                element.classList.remove(...errorClasses)
                element.classList.add(...defaultClasses)

                const fieldIndex = this.errorFields.indexOf(field)
                this.errorFields.slice(fieldIndex, 1)
            }
        },


        login(){
            this.request_sent = true

            axios.post('/auth/login', this.form)
                .then( result => {
                    const success = result.data.success
                    const reason = result.data.reason
                    const response = result.data.response

                    if ( !success ) {
                        this.request_sent = false

                        if ( reason === 'auth') {
                            this.error_field = response
                        }

                        else {
                            this.$swal( {
                                icon: 'error',
                                text: "Une erreur est survenue lors de la création de votre compte. Merci de contacter notre support",
                            } );
                        }

                    }

                    else {
                        this.error_field = ""
                        window.location.replace('/mon-profil')
                    }

                })
                .catch( err => {
                    console.log(err)
                })
        },


        switch_reset_form(){
            this.reset = !this.reset
            this.error_field = ""

            this.form = {
                auth_field: "",
                password: "",
            }
            this.reset_email = ""

        },

        reset_password(){

            this.request_sent = true

            const form = new FormData

            form.append('email', this.reset_email)
            form.append('guest', true)

            axios.post('/auth/reset-password', form)
                .then(result => {
                    const success = result.data.success
                    const reason = result.data.reason
                    const response = result.data.response

                    this.request_sent = false

                    if ( !success ) {
                        if ( reason === 'auth') {
                            this.error_field = response
                        }
                        else console.log(response)
                    }

                    else {
                        this.$swal({
                            icon: 'success',
                            title: "Succès",
                            text: "Merci de vérifier votre boite e-mail afin de valider le changement de votre mot de passe"
                        })
                            .then( () => {
                                window.location.replace('/')
                            })
                    }
                })

        },

    },
}
</script>
