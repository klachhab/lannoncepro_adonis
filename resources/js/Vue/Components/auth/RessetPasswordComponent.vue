<script>
import {mapGetters} from "vuex";

export default {
    props: ['code'],

    data() {
        return {
            container: "max-w-xs lg:max-w-lg md:max-w-lg sm:max-w-xl",

            form: {
                password: "",
                password_confirmation: "",
            },

            errors: {},

            hide: {
                password: true,
                password_confirmation: true,
            },

            request_sent: false,


            default_btn_class: 'cursor-pointer bg-blue-500 transition delay-75 ease-in-out hover:bg-blue-700 focus:bg-blue-700'
        }
    },

    computed: {
        ...mapGetters([
            "getInputClass"
        ]),
    },

    methods: {

        reset_password(){
            this.request_sent = true

            const form = new FormData

            form.append('verification_code', this.code)
            form.append('password', this.form.password)
            form.append('password_confirmation', this.form.password_confirmation)

            axios.put('/auth/update-password', form)
                .then(result => {

                    this.request_sent = false

                    const success = result.data.success
                    const reason = result.data.reason
                    const response = result.data.response

                    if ( !success ) {
                        if ( reason === 'validation' ){
                            this.errors = response
                        }

                        else this.$swal( {
                            icon: "error",
                            text: 'Une erreur est survenue lors de la modification de votre mot de passe.\nMerci de contacter notre support.'
                        } )
                    }

                    else this.$swal( {
                        icon: "success",
                        text: 'Mot de passe changé avec succès.'
                    } )
                    .then( () => {
                        window.location.replace('/mon-profil')
                    })

                })
                .catch(err => {
                    console.log(err.message)
                })
            this.request_sent = false

        },

    },
}
</script>
