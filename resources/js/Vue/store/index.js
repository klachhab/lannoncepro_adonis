import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        container: "max-w-xs xl:max-w-6xl lg:max-w-4xl md:max-w-lg sm:max-w-xl",
        show_modal: {
            modal_type: '',
            show: false
        },
        messages_count: 0,

        username: "",

        input_class: {
            container: "items-center grid-cols-none lg:flex-none my-10",
            label: "lg:col-span-2 lg:mr-10 lg:ml-0 ml-2",
            base: "block w-full px-3 py-2 transition duration-100 ease-in-out border rounded-md border focus-visible:outline-none " +
                "disabled:bg-gray-100 disabled:text-gray-600 ",
            variants: {
                default: "border-gray-300 bg-white placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-300",
                danger: "border-red-300 bg-red-50 placeholder-red-400 text-red-900 focus:border-red-400 focus:ring-1 focus:ring-red-300",
            }
        },
        select_class: {
            focused: "border-blue-400 ring-1 ring-blue-300 ",
            unfocused: "border-gray-300 ",
            container: "relative lg:col-span-5 block w-full rounded-md border ",
            input: "w-full px-3 py-2 rounded-md focus-visible:outline-none focus-visible:outline-none "
        },

        user_exists: true,
        password_match: true,

        show_error: false,

        error_fields: {}
    },

    getters: {
        getModalState(state){
            return state.show_modal
        },

        getInputClass: (state) => (status) => {
            const varient = status === 'error' ? state.input_class.variants.danger : state.input_class.variants.default
            return state.input_class.base + varient
        },

        getPasswordMatchClass(state) {
            const password_match_class = state.password_match ? state.input_class.variants.default :
                state.input_class.variants.danger

            return state.input_class.base + password_match_class
        },

        getUserExistsClass(state) {
            const user_exists = state.user_exists ? state.input_class.variants.default :
                state.input_class.variants.danger

            return state.input_class.base + user_exists
        },
    },

    mutations: {
        showModal: (state, value) => {
            state.show_modal = value
            document.documentElement.style.overflow = state.show_modal.show ? 'hidden' : 'auto'
        },

        update_message_count: (state, value) => {
            state.messages_count = value
        },


        setUserName: (state, value) => {
            state.username = value
        },

        setPassMatch: (state, value) => {
            state.password_match = value
        },

        setErrorFields: (state, value) => {
            state.error_fields = value
        },


    },
})


export default store;
