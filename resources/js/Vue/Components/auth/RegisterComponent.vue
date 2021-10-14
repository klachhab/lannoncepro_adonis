<script>

import TInput from "vue-tailwind/dist/t-input";
import {
    email, maxLength, minLength, numeric, required, requiredIf, sameAs
} from "vuelidate/lib/validators";
import {validationMixin} from "vuelidate";

const is_title = value => {
    const titles = ['miss', 'mrs', 'mr']
    return titles.includes(value)
}
const accepted = value => {
    return value === true
}

export default {
    components: {
        TInput
    },
    data() {
        return {
            container: "max-w-xs lg:max-w-lg md:max-w-lg sm:max-w-xl",

            // Form ------------------------------------------
            form: {
                title: null,
                name: "",
                username: "",
                phone: "",
                email: "",
                city_id: "",
                password: "",
                password_confirmation: "",

                conditions: false,
            },
            // Form ------------------------------------------

            selectedDep: null,
            cities: [],

            errors: [],
            error_field: "",
            field_class: {
                has_err: "border-red-300 focus:border-red-300 ring-red-200 ring ring-opacity-50 focus:ring-red-200 focus:ring focus:ring-opacity-50",
                normal: "border-gray-300 focus:border-blue-400 focus:ring-blue-300",
            },

            show_errors: false,
        }

    },

    // mixins: [validationMixin],
    validations: {

        form: {

            title: {
                required,
                is_title
            },
            name: {
                required,
            },
            username: {
                required,
                unique: async value => {
                    return await axios.post(`/api/profile/is_unique`, {
                        value
                    })
                        .then( resp => {
                            return Boolean(resp.data)
                        })
                        .catch( (err) => {
                            console.log(err)
                            return err
                        })
                },
            },
            email: {
                required,
                email,
                unique: async value => {
                    return await axios.post(`/api/profile/is_unique`, {
                        value
                    })
                        .then( resp => {
                            return Boolean(resp.data)
                        })
                        .catch( () => {
                            return false
                        })
                },
            },
            phone: {
                required,
                numeric,
                minLength: minLength(10),
                maxLength: maxLength(10),
            },
            password: {
                required,
                minLength: minLength(8)
            },
            password_confirmation: {
                sameAsPassword: sameAs('password')
            },
            city_id: {
                required,
                numeric,
                isCity: async value => {
                    return await axios.post(`/api/cities/${value}`)
                        .then( resp => {
                            return resp.data.success
                        })
                        .catch( err => {
                            console.log(err)
                        })
                }
            },
            conditions: {
                accepted,
            }
        },

    },

    computed: {
        accepted: () => {
            return true
        },
    },

    methods: {

        async newUser(){

            if (this.$v.form.$invalid){
                this.show_errors = true
                return
            }

            const form = new FormData()

            form.append('title', this.form.title)
            form.append('name', this.form.name)
            form.append('username', this.form.username)
            form.append('email', this.form.email)
            form.append('password', this.form.password)
            form.append('password_confirmation', this.form.password_confirmation)
            form.append('phone', this.form.phone)
            form.append('city_id', this.form.city_id)


            await axios.post('/api/profile', form)
                .then(response => {
                    const success = response.data.success
                    const data = response.data.response

                    if (success) {
                        console.log(data)
                    }
                    else {

                    }

                })
                .catch(err => {
                    console.log(err)
                })

        },

        async getCities(){

            this.form.city_id = null

            await axios.get(`/api/departments/${ this.selectedDep}`)
            .then( resp => {
                if (!resp.data.success){
                    alert('Une erreur est survenu lors de la récupération de la liste des villes')
                }
                this.cities = resp.data.cities
                return resp.data.cities
            })
            .catch( err => {
                return err
            })
        }
    },
}
</script>
