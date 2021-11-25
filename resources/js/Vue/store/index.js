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
            base: " block w-full px-3 py-2 transition duration-100 ease-in-out border rounded-md border focus-visible:outline-none",
            variants: {
                default: " border-gray-300 bg-white placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-300",
                danger: " border-red-300 bg-red-50 placeholder-red-400 text-red-900 focus:border-red-400 focus:ring-1 focus:ring-red-300",
            }
        },

        password_match: true,
        show_error: false,
    },

    getters: {
        getModalState(state){
            return state.show_modal
        },

        getInputClass(state) {
            return state.input_class.base + state.input_class.variants.default
        },

        getPasswordMatchClass(state) {
            const password_match_class = state.password_match ? state.input_class.variants.default :
                state.input_class.variants.danger

            return state.input_class.base + password_match_class
        }
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

        isPassMatch: (state, value) => {
            state.password_match = value
        }
    },
})


export default store;
