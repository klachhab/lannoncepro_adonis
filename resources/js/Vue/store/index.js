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
            container: "items-center lg:grid lg:grid-cols-7 grid-cols-none lg:flex-none my-10",
            label: "lg:col-span-2 lg:mr-10 lg:ml-0 ml-2",
            variants: {
                default: "px-3 py-2 block w-full rounded-md placeholder-gray-400 border-gray-300 border focus:border-blue-400 focus:ring-1 focus:ring-blue-300 focus-visible:outline-none",
                base: "block w-full px-3 py-2 transition duration-100 ease-in-out placeholder-gray-400 rounded-md border border-gray-300",
                danger: "border-red-300 bg-red-50 placeholder-red-200 text-red-900",
            }
        },

        password_match_class: ""

    },

    getters: {
        getModalState(state){
            return state.show_modal
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
            state.password_match_class = value ?
                "text-black placeholder-gray-400 border-gray-300" :
                "border-red-300 bg-red-50 placeholder-red-200 text-red-900"
        }
    },
})


export default store;
