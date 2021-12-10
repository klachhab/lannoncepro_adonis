<script>
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
    props: ['code'],

    data() {
        return {
            container: "max-w-xs lg:max-w-lg md:max-w-lg sm:max-w-xl",

            input_variants: {
                default: " border-gray-300 bg-white placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-300",
                danger: " border-red-300 bg-red-50 placeholder-red-400 text-red-900 focus:border-red-400 focus:ring-1 focus:ring-red-300",
            },

            form: {
                password: "",
                password_confirmation: "",
            },

            selected: null,

            error_field: "",

            hide_password: true,
            hide_password_confirmation: true,

            errorFields: [],

            reset: false,
            reset_email: "",

            request_sent: false,


            default_btn_class: 'cursor-pointer bg-blue-500 transition delay-75 ease-in-out hover:bg-transparent hover:bg-blue-700 focus:bg-blue-700'
        }
    },

    computed: {
        ...mapState([
            'input_class', 'password_match', 'select_class'
        ]),

        ...mapGetters([
            "getPasswordMatchClass", "getUserExistsClass",
            "getInputClass"
        ]),

        focus_password_class() {
            const clss = this.selected === "password" ? " border-blue-400 ring-1 ring-blue-300" : " border-gray-300"
            return this.select_class.container + clss
        },

        focus_password_conf_class() {
            const clss = this.selected === "password_confirmation" ? " border-blue-400 ring-1 ring-blue-300" : " border-gray-300"
            return this.select_class.container + clss
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

        reset_password(){
            this.request_sent = true

            const form = new FormData

            form.append('verification_code', this.code)
            form.append('password', this.form.password)
            form.append('password_confirmation', this.form.password_confirmation)

            axios.put('/auth/update-password', form)
                .then(response => {

                    const data = response.data

                    var message = ""
                    switch (data.message) {
                        case "length_ko" : message = "Le mot de passe doit contenir au minimum 8 caractères (espace non inclu)"; break;
                        case "no_match" : message = "Les 2 mots de passe ne sont pas identiques"; break;
                        case "pass_null" : message = "Merci de saisir un mot de passe"; break;
                        default : message = "Mot de passe mis à jour avec succès"
                    }

                    this.$swal({
                        icon: data.success ? "success" : "error",
                        title: data.success ? null :"Erreur",
                        text: message,
                    })
                    .then( () => {
                        this.request_sent = false
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
