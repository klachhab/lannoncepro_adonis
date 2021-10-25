import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        show_modal: false
    },

    mutations: {
        showModal(state, value){
            document.documentElement.style.overflow = value ? 'hidden' : 'auto'
            state.show_modal = value
        },
    },
    getters: {
        getModalState(state){
            return state.show_modal
        }
    }
})


export default store;
