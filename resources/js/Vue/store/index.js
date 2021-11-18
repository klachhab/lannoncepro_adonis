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
        messages_count: 0
    },

    mutations: {
        showModal: (state, value) => {
            state.show_modal = value
            document.documentElement.style.overflow = state.show_modal.show ? 'hidden' : 'auto'
        },

        update_message_count: (state, value) => {
            state.messages_count = value
        }
    },
    getters: {
        getModalState(state){
            return state.show_modal
        }
    }
})


export default store;
