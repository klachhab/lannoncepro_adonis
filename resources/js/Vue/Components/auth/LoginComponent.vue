<script>

import TInput from 'vue-tailwind/dist/t-input'
export default {
    components: {
        TInput
    },

    data() {
        return {
            container: "max-w-xs lg:max-w-lg md:max-w-lg sm:max-w-xl",

            form: {
                auth_field: "",
                password: "",
            },
            error_field: "",
            field_class: {
                has_err: "border-red-300 focus:border-red-300 ring-red-200 ring ring-opacity-50 focus:ring-red-200 focus:ring focus:ring-opacity-50",
                normal: "border-gray-300 focus:border-blue-400 focus:ring-blue-300 placeholder-gray-400",
            },
        }
    },

    methods: {

        login(){
            axios.post('/auth/login', this.form)
                .then( result => {

                    if (!result.data.success) {
                        this.error_field = result.data.error
                    }
                    else {
                        this.error_field = ""
                        window.location.replace("/");
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
