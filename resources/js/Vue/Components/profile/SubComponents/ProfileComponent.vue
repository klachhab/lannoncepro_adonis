<template>
    <div class="lg:col-span-7 col-span-12">

        <!-- Infos -->
        <div class="flex-1 py-4 px-8 w-full rounded bg-white">

            <div class="flex justify-between items-center"
                 :class="show_infos ? 'mb-5' : '' "
            >
                <span class="text-2xl font-light">Mes infos</span>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     class="h-6 w-6 cursor-pointer transition-all duration-100 ease-in-out"
                     :class="show_infos ? 'rotate-90' : '' "
                     @click="show_infos = !show_infos"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </div>


            <div v-if="show_infos">
                <hr class="w-full border-gray-300 my-5">


                <!-- Civilié -->
                <div class="lg:grid lg:grid-cols-7" :class="input_class.container" >
                    <span :class="input_class.label">
                        Civilié
                    </span>

                    <select class="lg:col-span-5"
                            :class="getInputClass('default')"
                            v-model="profile_form.title"
                    >

                        <option value="mrs">Mme.</option>
                        <option value="miss">Mlle.</option>
                        <option value="mr">Mr.</option>

                    </select>
                </div>

                <!-- Nom -->
                <div class="lg:grid lg:grid-cols-7" :class="input_class.container">
                    <span :class="input_class.label">
                        Nom
                    </span>

                    <input type="text" class="lg:col-span-5"
                           :class="getInputClass('default')"
                           v-model="profile_form.name"
                    />
                </div>

                <!-- Nom d'utilisateur -->
                <div class="lg:grid lg:grid-cols-7" :class="input_class.container">
                    <span :class="input_class.label">
                        Nom d'utilisateur
                    </span>

                    <input type="text" disabled class="lg:col-span-5 " :class="getInputClass('default')"
                           :value="profile_form.username"/>
                </div>

                <!-- Adresse e-mail -->
                <div class="lg:grid lg:grid-cols-7" :class="input_class.container">
                    <span :class="input_class.label">
                        Adresse e-mail
                    </span>
                    <input disabled type="email" class="lg:col-span-5 " :class="getInputClass('default')"
                           :value="profile_form.email"/>

                </div>

                <!-- Téléphone -->
                <div class="lg:grid lg:grid-cols-7" :class="input_class.container">

                    <span :class="input_class.label">
                        Téléphone
                    </span>
                    <input type="text" class="lg:col-span-5 "
                           :class="getInputClass('default')" v-model="profile_form.phone"/>
                </div>

                <!-- Département -->
                <div class="lg:grid lg:grid-cols-7" :class="input_class.container">
                    <span :class="input_class.label">
                        Département
                    </span>
                    <div :class="focus_dep_class" @blur.self="departments = []" tabindex="-1">

                        <input type="text" :class="select_class.input"
                               v-model="department.name"
                               @focus="selected_input = 'dep'"
                               @blur="blur_element('departments')"
                               @input="getDepartments"
                        />

                        <div v-if="departments.length" @blur="departments = []" tabindex="0"
                             class="absolute left-0 top-11 w-full mx-auto p-1.5 z-50 bg-white shadow-md rounded-md border border-gray-200">

                            <div class="w-full flex flex-col overflow-auto"
                                 :class=" departments.length < 4 ? `h-${ departments.length * 8 }`:'h-32'">
                        <span
                            class="py-1 px-1.5 mx-1.5 select-none cursor-pointer rounded transition-colors duration-100 ease-in-out hover:text-white hover:bg-blue-500"
                            v-for="(department,index) in departments" :key="index"
                            @click="getDepartment(department)"
                        >
                            {{ department.name }}
                        </span>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Ville -->
                <div class="lg:grid lg:grid-cols-7" :class="input_class.container">
                    <span :class="input_class.label">
                        Ville
                    </span>
                    <div :class="focus_city_class">

                        <input type="text" :class="select_class.input"
                               v-model="city_name"
                               @focus="selected_input = 'city'"
                               @blur="blur_element('cities')"
                               @input="getCities"
                        />

                        <div v-if="cities.length" @blur="cities = []" tabindex="1"
                             class="absolute left-0 top-11 w-full mx-auto p-1.5 z-50 bg-white shadow-md rounded-md border border-gray-200">

                            <div class="w-full flex flex-col overflow-auto"
                                 :class="cities.length < 4 ? `h-${ cities.length * 8 }`:'h-32'">
                            <span
                                class="py-1 px-1.5 mx-1.5 select-none cursor-pointer rounded transition-colors duration-100 ease-in-out hover:text-white hover:bg-blue-500"
                                v-for="(city,index) in cities" :key="index"
                                @click="getCity(city)"
                            >
                                {{ city.name }}
                            </span>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Preferences -->
                <div class="lg:grid lg:grid-cols-7 grid-cols-none lg:flex-none my-10">
                    <span :class="input_class.label" class="mt-1">
                        Préferences
                    </span>

                    <div class="flex flex-col justify-center gap-2 mb-4 col-span-5">

                        <label class="inline-flex items-center">
                            <input type="checkbox"
                                   v-model="profile_form.can_receive_news"
                                   class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300
                           focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                            <span class="ml-2">Recevoir les nouveautés et les offres speciales</span>
                        </label>

                        <label class="inline-flex items-center">
                            <input type="checkbox"
                                   v-model="profile_form.allow_reviews"
                                   class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300
                           focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                            <span class="ml-2">Autoriser les commentaires sur mes annonces</span>
                        </label>

                    </div>

                </div>
                <!-- ! Preferences ! -->

                <div class="lg:grid lg:grid-cols-7" :class="input_class.container">
                    <a href="#"
                       class="p-2.5 text-center lg:col-span-2 text-white rounded-md bg-green-500 hover:bg-green-600"
                       @click.prevent="updateUserInfos"
                    >

                        <span>Enregistrer</span>
                    </a>
                </div>
            </div>

        </div>

        <!-- Update password -->
        <div class="flex-1 w-full py-4 px-8 mt-6 rounded bg-white">

            <span class="text-2xl font-light mb-5">Changer le mot de passe</span>

            <hr class="w-full border-gray-300 my-5">


            <div class="lg:grid lg:grid-cols-7" :class="input_class.container">
                <span :class="input_class.label">
                    Nouveau mot de passe
                </span>

                <div :class="focus_password_class" class="flex flex-between items-center">

                    <input :type="hide.password ? 'password' : 'text'"
                           :class="select_class.input"
                           v-model="profile_form.new_password"
                           placeholder="Mot de passe"
                           @focus="selected_input = 'pass'"
                           @blur="selected_input = null"
                    />

                    <svg v-if="hide.password" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         class="h-5 w-5 stroke-current text-gray-400 mr-3 cursor-pointer"
                         @click="hide.password = false"
                         stroke="currentColor">

                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round"
                              stroke-linejoin="round" stroke-width="2"></path>

                        <path
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>

                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         class="h-5 w-5 stroke-current text-gray-400 mr-3 cursor-pointer"
                         @click="hide.password = true"
                         stroke="currentColor"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        ></path>
                    </svg>
                </div>


            </div>


            <div class="lg:grid lg:grid-cols-7" :class="input_class.container">
                <span :class="input_class.label">
                    Confirmation
                </span>

                <div :class="focus_pass_conf_class" class="flex flex-between items-center">

                    <input :type="hide.password_confirmation ? 'password' : 'text'"
                           :class="select_class.input"
                           v-model="profile_form.new_pass_confirmation"
                           placeholder="Confirmation du mote de passe"
                           @focus="selected_input = 'pass_conf'"
                           @blur="selected_input = null"
                    />

                    <svg v-if="hide.password_confirmation" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24"
                         class="h-5 w-5 stroke-current text-gray-400 mr-3 cursor-pointer"
                         @click="hide.password_confirmation = false"
                         stroke="currentColor">

                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round"
                              stroke-linejoin="round" stroke-width="2"></path>

                        <path
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>

                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         class="h-5 w-5 stroke-current text-gray-400 mr-3 cursor-pointer"
                         @click="hide.password_confirmation = true"
                         stroke="currentColor"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        ></path>
                    </svg>
                </div>

            </div>


            <div class="lg:grid lg:grid-cols-7" :class="input_class.container">
                <button :disabled="!profile_form.new_pass_confirmation || !password_match"
                        class="p-2.5 text-center lg:col-span-2 text-white rounded-md
                    bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:hover:bg-green-300
                    disabled:cursor-default"
                        @click="updatePassword"
                >
                    <span v-if="updating_pass">
                        <i class="fas fa-spinner fa-pulse"></i>
                    </span>

                    <span v-else>Enregistrer</span>
                </button>
            </div>

        </div>


    </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
    name: "ProfileComponent",

    data() {
        return {

            selected_input: null,

            department: {
                name: null,
                code: null,
            },

            city_name: null,
            departments: [],
            cities: [],

            profile_form: {
                title: null,
                name: null,
                phone: null,
                username: null,
                email: null,
                city_id: null,

                can_receive_news: false,

                allow_reviews: false,

                new_password: null,
                new_pass_confirmation: null,
            },

            hide: {
                password: true,
                password_confirmation: true,
            },

            updating_infos: false,
            updating_pass: false,

            show_infos: true,
        }
    },

    mounted() {
        this.getUserInfos()
    },

    computed: {
        ...mapState([
            'username', 'input_class', 'password_match', 'select_class'
        ]),

        ...mapGetters([
            "getPasswordMatchClass",
            "getInputClass",
        ]),

        focus_dep_class() {

            const clss = this.selected_input === 'dep' ? this.select_class.focused : this.select_class.unfocused
            return this.select_class.container + clss
        },

        focus_city_class() {
            const clss = this.selected_input === 'city' ? this.select_class.focused : this.select_class.unfocused
            return this.select_class.container + clss
        },

        focus_password_class() {
            const clss = this.selected_input === 'pass' ? this.select_class.focused : this.select_class.unfocused
            return this.select_class.container + clss
        },

        focus_pass_conf_class() {
            const clss = this.selected_input === 'pass_conf' ? this.select_class.focused : this.select_class.unfocused
            return this.select_class.container + clss
        },
    },

    methods: {
        ...mapMutations([
            'setPassMatch'
        ]),

        blur_element(element) {
            // if (element === 'departments') {
            //     this.departments = []
            // }
            // else if (element === 'cities') {
            //     this.cities = []
            // }
            this.selected_input = null
        },


        async getUserInfos() {
            await axios.post(`/api/profile/${this.username}`)
                .then(response => {

                    if (response.data.success) {
                        const user = response.data.user
                        const city = user.city

                        this.city_name = city.name
                        this.department = {
                            name: city.department.name,
                            code: city.department.code,
                        }

                        this.profile_form = {
                            title: user.title,
                            name: user.name,
                            phone: "0" + user.phone,
                            username: user.username,
                            can_receive_news: user.can_receive_news === 1,
                            allow_reviews: user.allow_reviews === 1,
                            email: user.email,
                            city_id: city.id,
                        }
                    } else {
                        this.$swal({
                            icon: "error",
                            title: "Erreur",
                            text: 'Une erreur est survenue lors de la récupération de vos innformations.\n' +
                                `Merci de contacter notre support.`
                            // + `\n${response.data.error}`
                        })
                    }

                })
        },


        async getDepartments($event) {
            const value = $event.target.value.trim()

            if (value === "") {
                this.departments = []
            } else {
                await axios.post(`/api/departments`, {
                    name: value
                })
                    .then(response => {
                        this.departments = response.data
                    })

            }
        },


        async getDepartment(department) {
            this.department.name = department.name
            this.department.code = department.code
            this.profile_form.city_id = null

            this.departments = []
            this.cities = []
            this.city_name = null
        },


        async getCities($event) {
            const value = $event.target.value.trim()

            if (value === "") {
                this.cities = []
            } else {
                await axios.post(`/api/cities/${this.department.code}`, {
                    name: value
                })
                    .then(response => {
                        this.cities = response.data
                    })
            }
        },


        async getCity(city) {
            this.profile_form.city_id = city.id
            this.city_name = city.name
            this.cities = []
        },


        async updateUserInfos() {

            this.updating_infos = true
            const url = `/api/profile/p/${this.profile_form.username}`
            const form = new FormData

            form.append('title', this.profile_form.title)
            form.append('name', this.profile_form.name)
            form.append('phone', this.profile_form.phone)
            form.append('city_id', this.profile_form.city_id)

            form.append('can_receive_news', this.profile_form.can_receive_news)
            form.append('allow_reviews', this.profile_form.allow_reviews)

            await axios.put(url, form)
                .then(response => {
                    if (response.data.success) {
                        this.$swal({
                            icon: "success",
                            text: 'Vos informations ont été mises à jour avec succès'
                        })

                    } else {
                        this.$swal({
                            icon: "error",
                            title: "Erreur",
                            text: 'Une erreur est survenue lors de la modification de vos information.\n' +
                                `Merci de contacter notre support.`
                        })
                    }

                })
                .catch(() => {
                    this.$swal({
                        icon: "error",
                        title: "Erreur",
                        text: 'Une erreur est survenue lors de la modification de vos information.\n' +
                            `Merci de contacter notre support.`
                    })
                })

            this.updating_infos = false

        },


        async updatePassword() {
            const form = new FormData

            form.append('password', this.profile_form.new_password)
            form.append('password_confirmation', this.profile_form.new_pass_confirmation)

            this.updating_pass = true

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
                    }).then( () => {

                        this.profile_form.new_password = null
                        this.profile_form.new_pass_confirmation = null
                        this.updating_pass = false
                    })


                })
                .catch(err => {
                    console.log(err.message)
                })


            /*await axios.post(`/auth/reset-password`, form)
                .then(response => {

                    console.log(response.data)
                    if (response.data.success) {
                        this.$swal({
                            icon: "success",
                            title: "Mot de passe modifié",
                            text: 'Merci de verifier votre boite mail afin de confirmer votre nouveau mot de passe'
                        }).then(() => {
                            this.profile_form.new_password = null
                            this.profile_form.new_pass_confirmation = null
                            this.updating_pass = false
                        })

                    } else {
                        const error_message = response.data.message === "pass_not_match" ? "Les 2 mots de passe ne sont pas identiques" :
                            'Une erreur est survenue lors de la modification de votre mot de passe.\nMerci de contacter notre support.'
                            + `\n${response.data.message}`

                        this.$swal({
                            icon: "error",
                            title: "Erreur",
                            text: error_message

                        }).then( () => {
                            this.updating_pass = false
                        })
                    }


                })
                .catch(error => {
                    this.$swal({
                        icon: "error",
                        title: "Erreur",
                        text: 'Une erreur est survenue lors de la modification de votre mot de passe.\n' +
                            `Merci de contacter notre support.`
                        + `\n${error.message}`
                    }).then( () => {
                        this.updating_pass = false
                    })
                })*/

        },
    },
}
</script>

<style scoped>

</style>
