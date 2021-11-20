<template xmlns:x-transition="http://www.w3.org/1999/xhtml">
    <div class="lg:col-span-7 col-span-12">

        <!-- Infos -->
        <div class="flex-1 py-4 px-8 w-full rounded bg-white">

            <span class="text-2xl font-light mb-5">Mes infos</span>

            <hr class="w-full border-gray-300 my-5">

            <div :class="input_class.container">
            <span :class="input_class.label">
                Civilié
            </span>

                <select :class="input_class.input"
                        v-model="profile_form.title"
                >

                    <option value="mrs">Mme.</option>
                    <option value="miss">Mlle.</option>
                    <option value="mr">Mr.</option>

                </select>
            </div>

            <div :class="input_class.container">
                <span :class="input_class.label">
                    Nom
                </span>

                <input type="text" :class="input_class.input"
                       v-model="profile_form.name"/>
            </div>

            <div :class="input_class.container">
                <span :class="input_class.label">
                    Nom d'utilisateur
                </span>

                <input type="text" disabled :class="input_class.input" :value="profile_form.username" />
            </div>

            <div :class="input_class.container">
                <span :class="input_class.label">
                    Adresse e-mail
                </span>
                <input disabled type="email" :class="input_class.input" :value="profile_form.email" />

            </div>

            <div :class="input_class.container">
            <span :class="input_class.label">
                Téléphone
            </span>
                <input type="text" :class="input_class.input" v-model="profile_form.phone" />
            </div>

            <div :class="input_class.container">
            <span :class="input_class.label">
                Département
            </span>
                <div :class="focus_dep_class">

                    <input type="text" :class="select_class.input"
                           v-model="department.name"
                           @focus="selected_input = 'dep'"
                           @blur="selected_input = null"
                           @input="getDepartments"
                    />

                    <div v-if="departments.length"
                         class="absolute left-0 top-11 w-full mx-auto p-1.5 z-50 bg-white shadow-md rounded-md border border-gray-200">

                        <div class="w-full flex flex-col overflow-auto" :class=" departments.length < 4 ? `h-${ arr_length }`:'h-32'">
                        <span class="py-1 px-1.5 mx-1.5 select-none cursor-pointer rounded transition-colors duration-100 ease-in-out hover:text-white hover:bg-blue-500"
                              v-for="(department,index) in departments" :key="index"
                              @click="getDepartment(department)"
                        >
                            {{ department.name }}
                        </span>
                        </div>
                    </div>

                </div>
            </div>

            <div :class="input_class.container">
            <span :class="input_class.label">
                Ville
            </span>
                <div :class="focus_city_class">

                    <input type="text" :class="select_class.input"
                           v-model="city_name"
                           @focus="selected_input = 'city'"
                           @blur="selected_input = null"
                           @input="getCities"
                    />

                    <div v-if="cities.length"
                         class="absolute left-0 top-11 w-full mx-auto p-1.5 z-50 bg-white shadow-md rounded-md border border-gray-200">

                        <div class="w-full flex flex-col overflow-auto" :class=" cities.length < 4 ? `h-${ arr_length }`:'h-32'">
                        <span class="py-1 px-1.5 mx-1.5 select-none cursor-pointer rounded transition-colors duration-100 ease-in-out hover:text-white hover:bg-blue-500"
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

            <div :class="input_class.container">
                <span :class="input_class.label">
                    Nouveau mot de passe
                </span>

                <input type="password" :class="input_class.input"
                       v-model="profile_form.new_password"
                />
            </div>

            <div :class="input_class.container">
                <span :class="input_class.label">
                    Confirmation
                </span>

                <input type="password" :class="input_class.input"
                       v-model="profile_form.new_pass_confirmation"
                />
            </div>
        </div>


        <!-- Preferences -->
        <div class="flex-1 w-full py-4 px-8 mt-6 rounded bg-white">

            <span class="text-2xl font-light mb-5">Préferences</span>

            <hr class="w-full border-gray-300 my-5">

            <div class="flex flex-col justify-center gap-2 mb-4">

                <label class="inline-flex items-center">
                    <input type="checkbox"
                           class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300
                           focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                    <span class="ml-2">Recevoir les nouveautés et les offres speciales</span>
                </label>

                <label class="inline-flex items-center">
                    <input type="checkbox"
                           class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300
                           focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                    <span class="ml-2">Autoriser les commentaires sur mes annonces</span>
                </label>

            </div>
        </div>
        <!-- Submit Button -->
        <div :class="input_class.container">
            <button class="p-2.5 lg:col-span-2 text-white rounded-md bg-green-600 hover:bg-green-700 focus:bg-green-800">
                Enregistrer
            </button>
        </div>

    </div>
</template>

<script>
export default {
    name: "ProfileComponent",
    props: ['user_username', 'user_email'],

    data() {
        return {

            input_class: {
                container: "items-center lg:grid lg:grid-cols-7 grid-cols-none lg:flex-none my-10",
                label: "lg:col-span-2 lg:mr-10 lg:ml-0 ml-2",
                input: "px-3 py-2 lg:col-span-5 block w-full rounded-md placeholder-gray-400 border-gray-300 border focus:border-blue-400 focus:ring-1 focus:ring-blue-300 focus-visible:outline-none"
            },
            select_class: {
                focused: " border-blue-400 ring-1 ring-blue-300",
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

                new_password: null,
                new_pass_confirmation: null,
            },

        }
    },

    mounted() {
        this.getUserInfos()
    },

    computed: {
        arr_length() {
            return this.departments.length * 8
        },

        focus_dep_class(){

            const clss = this.selected_input === 'dep' ? this.select_class.focused : this.select_class.unfocused
            return this.select_class.container + clss
        },

        focus_city_class(){
            const clss = this.selected_input === 'city' ? this.select_class.focused : this.select_class.unfocused
            return this.select_class.container +  clss
        }
    },

    methods: {
        async getUserInfos(){
            await axios.post(`/api/profile/${ this.user_username }`)
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
                        email: user.email,
                        city_id: city.id,
                    }
                }
                else {

                }

            })
        },


        async getDepartments($event){
            const value = $event.target.value.trim()

            if (value === ""){
                this.departments = []
            }
            else {
                await axios.post(`/api/departments`, {
                    name: value
                })
                .then( response => {
                    this.departments = response.data
                })

            }
        },

        async getDepartment(department){
            this.department.name = department.name
            this.department.code = department.code
            this.departments = []
            this.cities = []
            this.city_name = null
        },

        async getCities($event){
            const value = $event.target.value.trim()

             if (value === ""){
                this.cities = []
            }

            else {
                 await axios.post(`/api/cities/${ this.department.code }`, {
                     name: value
                 })
                     .then( response => {
                         const cities = response.data
                         this.cities = cities
                     })
             }
        },


        async getCity(city){
            this.profile_form.city_id = city.id
            this.city_name = city.name
            this.cities = []
        },
    },
}
</script>

<style scoped>

</style>
