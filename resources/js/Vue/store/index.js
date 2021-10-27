import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        show_modal: {
            modal_type: '',
            show: false
        }
    },

    mutations: {
        showModal(state, value){
            state.show_modal = value
            document.documentElement.style.overflow = state.show_modal.show ? 'hidden' : 'auto'
        },
    },
    getters: {
        getModalState(state){
            return state.show_modal
        }
    }
})


export default store;
