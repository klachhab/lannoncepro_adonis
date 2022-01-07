<script>
import {mapGetters, mapMutations, mapState} from "vuex";

import {
    email, maxLength, minLength, numeric, required, requiredIf, sameAs
} from "vuelidate/lib/validators";


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

                password: "",
                password_confirmation: "",

                department_code: "",
                department_name: "",
                conditions: false,

                city: {
                    name: null,
                    code: null,
                    // lon < lat
                    geo_coordinates: {
                        longitude: null,
                        latitude: null,
                    },
                    department: {
                        code: null,
                        name: null,
                    },
                }
            },

            errors: {},
            errorFields: [],
            // Form ------------------------------------------

            hide: {
                password: true,
                password_confirmation: true,
            },
            // Form ------------------------------------------


            departments: [],
            cities: [],

            foundCities: {
                list: [],
                show_list: false,
                loading: false,
            },

            field_class: {
                has_err: "border-red-300 focus:border-red-300 ring-red-200 ring ring-opacity-50 focus:ring-red-200 focus:ring focus:ring-opacity-50",
                normal: "border-gray-300 focus:border-blue-400 focus:ring-blue-300",
            },

            show_errors: false,
            saving: false,

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
    },

    methods: {

        ...mapMutations([
            'setErrorFields'
        ]),

        
        // Save user ======================
        async newUser(){

            this.saving = true

            const form = new FormData()
            const city = this.form.city
            const geometry = this.form.city.geo_coordinates

            form.append('title', this.form.title)

            form.append('name', this.form.name)
            form.append('username', this.form.username)
            form.append('email', this.form.email)
            form.append('password', this.form.password)
            form.append('password_confirmation', this.form.password_confirmation)
            form.append('phone', this.form.phone)

            form.append('city_code', city.code)
            form.append('city_name', city.name)
            form.append('longitude', geometry.longitude)
            form.append('latitude', geometry.latitude)
            form.append('department_code', city.department.code)
            form.append('department_name', city.department.name)

            await axios.post('/profil', form)
                .then(async response => {

                    this.saving = false
                    this.errors = {}
                    this.errorFields = []

                    const success = response.data.success
                    const data = response.data

                    // return

                    if (success) {
                        this.$swal({
                            icon: 'success',
                            title: "Votre compte a bien été créé.",
                            html: "<p class='mb-3'>Merci de vérifier votre boite e-mail afin de confirmer votre compte</p>",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: false,

                        })
                            .then( () => {
                                // window.location.replace('/mon-profil')
                            });
                    }
                    else {

                        if ( data.error === "validation" ) {
                            this.errors = data.result
                        }

                        else {
                            this.$swal( {
                                icon: 'error',
                                text: "Une erreur est survenue lors de la création de votre compte. Merci de contacter notre support",
                            } );
                        }
                    }
                    this.saving = false

                })
                .catch(err => {
                    console.log(err.message)
                })

        },

        // Search address -------------------------------
        async searchCity($event){

            const value = $event.target.value

            if ( value === '' ){
                this.foundCities.list = []
                this.foundCities.show_list = false
                return
            }
            this.errors.city_id = null
            this.errors.department_code = null

            // this.form.city.name = null
            this.form.city.code = null
            this.form.city.geo_coordinates = {
                longitude: null,
                latitude: null,
            }
            this.form.city.department = {
                code: null,
                name: null,
            }

            this.foundCities.show_list = true
            this.foundCities.loading = true

            // type=street | locality | municipality | housenumber
            await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${ value }&type=municipality&limit=10`)
                .then( resp => {
                    this.foundCities.list = resp.data.features
                })
                .catch( (err) => {
                    this.foundCities.list = []
                    console.log(err.message)
                })

            this.foundCities.loading = false
        },

        selectCity(city) {

            const contextArr = city.properties.context.split(', ')

            this.selected_address = city.properties.label
            this.foundCities.show_list = false
            this.foundCities.list = []


            this.form.city.name = city.properties.city
            this.form.city.code = city.properties.citycode

            this.form.city.geo_coordinates = {
                longitude: city.geometry.coordinates[0],
                latitude: city.geometry.coordinates[1],
            }

            this.form.city.department = {
                code: contextArr[0],
                name: contextArr[1],
            }
        },
    },
}
</script>
