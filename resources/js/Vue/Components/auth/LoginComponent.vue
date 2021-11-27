<script>
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
    components: {
    },

    data() {
        return {
            container: "max-w-xs lg:max-w-lg md:max-w-lg sm:max-w-xl",

            input_variants: {
                default: " border-gray-300 bg-white placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-300",
                danger: " border-red-300 bg-red-50 placeholder-red-400 text-red-900 focus:border-red-400 focus:ring-1 focus:ring-red-300",
            },

            form: {
                auth_field: "",
                password: "",
            },
            error_field: "",

            hide_password: true,
            select_pass: false,

            errorFields: [],
        }
    },

    computed: {
        ...mapState([
            'input_class', 'password_match', 'user_exists', 'select_class'
        ]),

        ...mapGetters([
            "getPasswordMatchClass", "getUserExistsClass",
            "getInputClass"
        ]),

        focus_password_class() {
            const clss = this.select_pass ? " border-blue-400 ring-1 ring-blue-300" : " border-gray-300"
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

        login(){
            axios.post('/auth/login', this.form)
                .then( result => {

                    if (!result.data.success) {

                        if (result.data.error == "E_ROW_NOT_FOUND") {
                            this.setUserExists(result.data.success)
                        }
                        else {
                            this.setPassMatch(result.data.success)
                            this.setUserExists(true)
                        }

                        this.error_field = result.data.error
                    }
                    else {
                        this.error_field = ""
                        window.replace('/mon-profil')
                    }

                    console.log(result.data)
                })
                .catch( err => {
                    console.log(err)
                })
        }

    },
}
</script>
