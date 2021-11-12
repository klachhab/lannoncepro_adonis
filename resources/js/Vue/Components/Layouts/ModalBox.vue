<template>
    <div class="flex justify-center items-center bg-black bg-opacity-50 absolute inset-0 w-screen h-screen
            transition-opacity duration-100 ease-in-out"
         :class="show_modal.modal_type === name? '': 'hidden'"
         @click.self="showModal({ modal_type: '', show: false})"
    >
        <div class="bg-white py-2 rounded-md shadow-xl xl:w-1/3 md:w-2/3">
            <div class="flex justify-between items-center border-b-0.5 border-gray-200 mt-2 pb-2 px-8">

                <slot name="header">Header</slot>

                <svg class="h-6 w-6 cursor-pointer p-1 hover:bg-gray-300 rounded-full transition-all duration-100 ease-in-out" viewBox="0 0 20 20"
                     @click.prevent="showModal({ modal_type: '', show: false})"
                >
                    <path fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"></path>
                </svg>
            </div>
            <hr class="w-full border-0.5 border-gray-200 mb-6 mt-3">

            <div class="mt-2 text-sm px-8">

                <slot name="body">
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores, sunt.</p>
                </slot>

            </div>

            <div class="mt-3 flex justify-end space-x-3 px-8 mb-4">
                <slot name="footer">
                    <button class="px-3 py-1 bg-blue-800 text-gray-200 hover:bg-blue-600 rounded">OK</button>
                    <button class="px-3 py-1 bg-red-800 text-gray-200 hover:bg-red-600 rounded"
                            @click="showModal(false)"
                    >
                        Delete
                    </button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
    name: "ModalBox",
    props: ['name'],

    computed: {

        ...mapState([
            'show_modal',
        ]),

    },

    methods: {
        ...mapMutations([
            'showModal'
        ]),

        hideModal(){
            document.documentElement.style.overflow = 'auto'
            this.modal_shown = true
        }
    }

}
</script>

<style scoped>

</style>
