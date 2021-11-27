<script>
import {mapGetters, mapMutations, mapState} from "vuex";

import {
    email, maxLength, minLength, numeric, required, requiredIf, sameAs
} from "vuelidate/lib/validators";


const is_title = value => {
    const titles = ['miss', 'mrs', 'mr']
    return titles.includes(value)
}
const accepted = value => {
    return value === true
}

export default {
    components: {
    },

    data() {
        return {
            container: "max-w-xs lg:max-w-lg md:max-w-lg sm:max-w-xl",

            // Form ------------------------------------------
            form: {
                title: "",
                name: "",
                username: "",
                phone: "",
                email: "",
                city_id: "",
                city_name: "",
                password: "",
                password_confirmation: "",

                department_code: "",
                department_name: "",
                conditions: false,
            },

            hide: {
                password: true,
                password_confirmation: true,
            },
            // Form ------------------------------------------


            departments: [],
            cities: [],

            errors: {},
            errorFields: [],

            field_class: {
                has_err: "border-red-300 focus:border-red-300 ring-red-200 ring ring-opacity-50 focus:ring-red-200 focus:ring focus:ring-opacity-50",
                normal: "border-gray-300 focus:border-blue-400 focus:ring-blue-300",
            },

            show_errors: false,
            saving: false,

            selected_select: "",
        }
    },

    validations: {
        form: {
            conditions: {
                accepted,
            }
        },
    },

    computed: {
        ...mapState([
            'input_class', 'password_match', 'select_class'
        ]),

        ...mapGetters([
            "getPasswordMatchClass",
            "getInputClass"
        ]),

        accepted: () => {
            return true
        },

        focus_password_class() {
            const clss = this.selected_select === 'pass' ? " border-blue-400 ring-1 ring-blue-300" : " border-gray-300"
            return this.select_class.container + clss
        },

        focus_pass_conf_class() {
            const clss = this.selected_select === 'pass_conf' ? " border-blue-400 ring-1 ring-blue-300" : " border-gray-300"
            return this.select_class.container + clss
        },
    },

    methods: {

        ...mapMutations([
            'setErrorFields'
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

        showAlert(){
            this.$swal({
                icon: 'success',
                title: "Votre compte a bien été créé.",
                html: "<p class='mb-3'>Merci de vérifier votre boite e-mail afin de confirmer votre compte</p>",
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                showConfirmButton: false,

            });
        },

        async newUser(){

            this.saving = true

            const form = new FormData()

            form.append('title', this.form.title)

            form.append('name', this.form.name)
            form.append('username', this.form.username)
            form.append('email', this.form.email)
            form.append('password', this.form.password)
            form.append('password_confirmation', this.form.password_confirmation)
            form.append('phone', this.form.phone)
            form.append('city_id', this.form.city_id)

            await axios.post('/api/profile/profile', form)
                .then(async response => {
                    const success = response.data.success
                    const data = response.data

                    this.saving = false
                    this.errors = {}

                    if (success) {
                        this.showAlert()
                    }
                    else {
                        const errors = data.error.errors
                        this.errorFields = errors.map(err => err.field)
                        console.log(this.errorFields)

                        for (let errorKey in errors) {
                            const error = errors[errorKey]
                            this.errors[error.field] = error.message
                        }
                    }

                })
                .catch(err => {
                    console.log(err)
                })

        },


        async getDepartments($event) {
            const element = $event.target
            const defaultClasses = this.getInputClass('default').split(" ")
            const errorClasses = this.getInputClass('error').split(" ")

            element.classList.remove(...errorClasses)
            element.classList.add(...defaultClasses)

            if (element.value.trim() === "") {

                this.form.department_code = ""
                this.departments = []

            } else {
                await axios.post(`/api/departments`, {
                    name: element.value.trim()
                })
                    .then(response => {
                        this.departments = response.data
                    })

            }
        },

        async getDepartment(department) {

            this.getInputClass(false)
            this.form.department_name = department.name
            this.form.department_code = department.code

            this.form.city_name = ""
            this.form.city_id = ""
            this.departments = []
            this.cities = []
        },

        async getCities($event) {
            const element = $event.target
            const defaultClasses = this.getInputClass('default').split(" ")
            const errorClasses = this.getInputClass('error').split(" ")

            element.classList.remove(...errorClasses)
            element.classList.add(...defaultClasses)

            if (element.value.trim() === "") {
                this.cities = []
            }
            else {
                await axios.post(`/api/cities/${this.form.department_code}`, {
                    name: element.value.trim()
                })
                    .then(response => {
                        this.cities = response.data
                    })
            }
        },

        async getCity(city) {
            console.log(city)
            this.form.city_id = city.id
            this.form.city_name = city.name
            this.cities = []
        },

    },
}
</script>
