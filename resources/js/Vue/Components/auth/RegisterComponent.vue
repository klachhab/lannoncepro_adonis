<script>

import TInput from "vue-tailwind/dist/t-input";

export default {
    components: {
        TInput
    },

    data() {
        return {
            container: "max-w-xs lg:max-w-lg md:max-w-lg sm:max-w-xl",

            form: {
                title: "",
                name: "",
                username: "",
                phone: "",
                email: "",
                city_id: null,
                password: "",
                password_confirmation: "",
                conditions_accepted: false,
            },

            selectedDep: null,
            cities: [],

            errors: [],
            error_field: "",
            field_class: {
                has_err: "border-red-300 focus:border-red-300 ring-red-200 ring ring-opacity-50 focus:ring-red-200 focus:ring focus:ring-opacity-50",
                normal: "border-gray-300 focus:border-blue-400 focus:ring-blue-300 placeholder-gray-400",
            },
        }
    },

    created() {
    },

    computed: {
    },

    methods: {

        async newUser(){

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

                        for (let i = 0; i < data.errors.length; i++) {
                            var err = data.errors[i]
                            console.log(err.field)
                            this.errors[err.field] = err.message
                        }
                        // this.errors = data.errors

                        console.log(this.errors)
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
