<template xmlns:x-transition="http://www.w3.org/1999/xhtml">
    <div class="lg:col-span-7 col-span-12">

        <!-- Infos -->
        <div class="flex-1 py-4 px-8 w-full rounded bg-white">

            <span class="text-2xl font-light mb-5">Mes infos</span>

            <hr class="w-full border-gray-300 my-5">


            <div class="lg:grid lg:grid-cols-7 " :class="input_class.container">
            <span :class="input_class.label">
                Civilié
            </span>

                <select class="lg:col-span-5 ":class="getInputClass"
                        v-model="profile_form.title"
                >

                    <option value="mrs">Mme.</option>
                    <option value="miss">Mlle.</option>
                    <option value="mr">Mr.</option>

                </select>
            </div>

            <div class="lg:grid lg:grid-cols-7 " :class="input_class.container">
                <span :class="input_class.label">
                    Nom
                </span>

                <input type="text" class="lg:col-span-5 ":class="getInputClass"
                       v-model="profile_form.name"
                />
            </div>

            <div class="lg:grid lg:grid-cols-7 " :class="input_class.container">
                <span :class="input_class.label">
                    Nom d'utilisateur
                </span>

                <input type="text" disabled class="lg:col-span-5 ":class="getInputClass" :value="profile_form.username" />
            </div>

            <div class="lg:grid lg:grid-cols-7 " :class="input_class.container">
                <span :class="input_class.label">
                    Adresse e-mail
                </span>
                <input disabled type="email" class="lg:col-span-5 ":class="getInputClass" :value="profile_form.email" />

            </div>

            <div class="lg:grid lg:grid-cols-7 " :class="input_class.container">
            <span :class="input_class.label">
                Téléphone
            </span>
                <input type="text" class="lg:col-span-5 ":class="getInputClass" v-model="profile_form.phone" />
            </div>

            <div class="lg:grid lg:grid-cols-7 " :class="input_class.container">
                <span :class="input_class.label">
                Département
            </span>
                <div :class="focus_dep_class">

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

            <div class="lg:grid lg:grid-cols-7 " :class="input_class.container">
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

        </div>

        <!-- Update password -->
        <div class="flex-1 w-full py-4 px-8 mt-6 rounded bg-white">

            <span class="text-2xl font-light mb-5">Changer le mot de passe</span>

            <hr class="w-full border-gray-300 my-5">

            <div class="lg:grid lg:grid-cols-7 " :class="input_class.container">
                <span :class="input_class.label">
                    Nouveau mot de passe
                </span>

                <input type="password" class="lg:col-span-5 ":class="getInputClass"
                       v-model="profile_form.new_password"
                />
            </div>

            <div class="lg:grid lg:grid-cols-7 " :class="input_class.container">
                <span :class="input_class.label">
                    Confirmation
                </span>

                <div class="lg:col-span-5 flex flex-col">
                    <input type="password" :class="profile_form.new_pass_confirmation ? getPasswordMatchClass : getInputClass"
                           v-model="profile_form.new_pass_confirmation"
                           @input="isPassMatch(profile_form.new_pass_confirmation === profile_form.new_password)"
                    />

                    <span class="text-sm text-red-500" v-if="profile_form.new_pass_confirmation && !password_match">
                        Les deux mots de passe ne correspondent pas
                    </span>
                </div>
            </div>

            <div class="lg:grid lg:grid-cols-7 " :class="input_class.container">
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


        <!-- Preferences -->
        <div class="flex-1 w-full py-4 px-8 mt-6 rounded bg-white">

            <span class="text-2xl font-light mb-5">Préferences</span>

            <hr class="w-full border-gray-300 my-5">

            <div class="flex flex-col justify-center gap-2 mb-4">

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

        <!-- Submit Button -->
        <div class="lg:grid lg:grid-cols-7 " :class="input_class.container">
            <a href="#"
               class="p-2.5 text-center lg:col-span-2 text-white rounded-md bg-green-500 hover:bg-green-600"
               @click.prevent="updateUserInfos"
            >

                <span>Enregistrer</span>
            </a>
        </div>

    </div>
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
    name: "ProfileComponent",

    data() {
        return {

            select_class: {
                focused: "border-blue-400 ring-1 ring-blue-300",
                unfocused: " border-gray-300",
                container: "relative lg:col-span-5 block w-full rounded-md border",
                input: "w-full px-3 py-2 rounded-md focus-visible:outline-none focus-visible:outline-none"
            },

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

            updating_infos: false,
            updating_pass: false
        }
    },

    mounted() {
        this.getUserInfos()
    },

    computed: {
        ...mapState([
            'username', 'input_class', 'password_match'
        ]),

        ...mapGetters([
            "getPasswordMatchClass",
            "getInputClass"
        ]),

        focus_dep_class() {

            const clss = this.selected_input === 'dep' ? this.select_class.focused : this.select_class.unfocused
            return this.select_class.container + clss
        },

        focus_city_class() {
            const clss = this.selected_input === 'city' ? this.select_class.focused : this.select_class.unfocused
            return this.select_class.container + clss
        }
    },

    methods: {
        ...mapMutations([
            'isPassMatch'
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
                        const cities = response.data
                        this.cities = cities
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
            const url = `/api/profile/profile/${this.profile_form.username}`
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
                            title: "Félicitation",
                            text: 'Vos informations ont été mises à jour avec succès'
                        }).then(() => {
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            })
                            this.updating_infos = false
                        })

                    } else {
                        this.$swal({
                            icon: "error",
                            title: "Erreur",
                            text: 'Une erreur est survenue lors de la modification de vos information.\n' +
                                `Merci de contacter notre support.`
                            // + `\n${response.data.error}`
                        })
                    }

                })
                .catch(() => {
                    this.$swal({
                        icon: "error",
                        title: "Erreur",
                        text: 'Une erreur est survenue lors de la modification de vos information.\n' +
                            `Merci de contacter notre support.`
                        // + `\n${error.message}`
                    })
                })

        },


        async updatePassword() {
            const form = new FormData

            form.append('password', this.profile_form.new_password)

            this.updating_pass = true

            this.profile_form.new_password = null
            this.profile_form.new_pass_confirmation = null

            await axios.post(`/auth/reset-password`, form)
                .then(response => {

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
                        this.$swal({
                            icon: "error",
                            title: "Erreur",
                            text: 'Une erreur est survenue lors de la modification de votre mot de passe.\n' +
                                `Merci de contacter notre support.`
                            + `\n${response.data.error}`
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
                })

        },
    },
}
</script>

<style scoped>

</style>
