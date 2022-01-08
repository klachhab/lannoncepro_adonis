<template>

    <div class="lg:col-span-7 col-span-12">
        <div class="flex-1 py-4 px-8 w-full rounded bg-white">

            <span class="text-2xl font-light mb-5">Mes messages</span>

            <hr class="w-full border-gray-300 my-5">

            <!-- component -->

            <div v-if="conversations.length" class="w-full flex flex-col relative overflow-hidden shadow rounded border border-gray-300">

                <div class="w-full md:w-2/4 lg:w-2/5 z-20 flex flex-col absolute inset-y-0 left-0 bg-white transform transition duration-200 ease-in-out"
                     :class="showMessages ? '-translate-x-full' :''"
                >

                    <!-- Close button -->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                         class="absolute place-self-end h-6 w-6 p-1 mr-2 mt-2 cursor-pointer rounded-full bg-gray-200"
                         v-if="conversation !== null"
                         @click="showMessages = true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    <!-- ! Close button ! -->

                    <!-- conversations -->

                    <div class="w-full overflow-auto">


                        <div class="flex flex-col py-2 px-4 cursor-pointer hover:bg-blue-200"
                             :class="conversation !== null && conv.conversation_key === conversation.conversation_key ? 'bg-blue-200' : ''"
                             v-for="(conv, index) in conversations" :key="index"
                             @click="getMessages(index)"
                        >
                                <span class="text-lg"
                                      :class="conv.read ? '' : 'font-bold'"
                                >{{ conv.from_name }}</span>

                            <p class="text-sm" v-html="conv.last_message"
                               :class="conv.read ? '' : 'font-bold'"
                            >
                            </p>

                            <span class="text-sm text-gray-500 font-light mt-1">
                                {{ conv.creation_date }}
                            </span>
                        </div>

                    </div>

                    <!-- ! conversations ! -->


                </div>

                <div class="flex flex-col w-full rounded ring-1 ring-gray-200">
                    <!-- Messages -->
                    <div class="flex flex-col w-full bg-blue-50 h-128" >

                        <div class="flex w-full items-center bg-white py-1">
                            <!-- Show conversations -->
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                 class="h-6 w-6 ml-4 my-4 cursor-pointer"
                                 @click="showMessages = false"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                            <!-- ! Show conversations ! -->


                            <div class="flex flex-col ml-4 leading-4">

                                <a :href="conversation ? `/annonces/${ conversation.post.slug }` : '#'"
                                   target="_blank" class="lg:text-xl md:text-lg font-medium"
                                >
                                    {{conversation ? conversation.post.title : ''}}
                                </a>

                                <span class="text-sm text-gray-500 font-light -mt-1">
                                    {{ conversation ? conversation.post.creation_date : ''}}
                                </span>
                            </div>
                        </div>

                        <div ref="chatbox" class="p-4 overflow-auto shadow-inner" @click="showMessages = conversation !== null" v-if="conversation">

                            <div class="flex items-end" v-for="(message, index) in conversation.messages" :key="index"
                                 :class="message.direction === 'from_seller' ? 'justify-end' : ''"
                            >
                                <div class="flex flex-col w-1/2 mb-4 rounded-t-lg p-3"
                                     :class="message.direction === 'from_seller' ? 'rounded-bl-lg bg-blue-500' : 'rounded-br-lg bg-gray-500'"
                                >

                                    <p class="text-white text-sm" v-html="message.message" ></p>

                                    <hr class="w-full border-white border-opacity-25 mb-1 mt-4" v-if="message.creation_date"/>

                                    <span class="text-opacity-60 text-white text-xs mt-1" v-if="message.creation_date">
                                        {{ message.creation_date }}
                                    </span>

                                </div>
                            </div>



                        </div>

                    </div>

                    <div class="flex">
                        <textarea ref="msg_input" rows="2" placeholder="Tapez quelques lignes décrivant votre bien" style="resize: none"
                                  class="m-2 block w-full rounded-md placeholder-gray-400 border-gray-300 focus:border-blue-400 focus:ring-blue-300"
                                  :class="getInputClass('default')"
                                  @input="is_typing"
                                  :disabled="!showMessages"
                                  @click="showMessages = conversation !== null"
                        >

                        </textarea>

                        <a href="#" :class="!typing ? 'btn-disabled bg-blue-300':'bg-blue-500'"
                           class="mr-2 mt-2 flex items-center place-self-start py-2 px-7
                                   text-white rounded-md transition delay-100 ease-in-out
                                   hover:bg-transparent hover:bg-blue-700 focus:bg-blue-700"
                           disabled="!typing"
                           @click.prevent="send_message"
                        >
                            Envoyer
                        </a>
                    </div>
                </div>

            </div>


            <div v-else class="flex justify-center items-center mt-7 mb-4">
                <span class="text-2xl text-gray-400 text-center select-none">
                    Vous n'avez aucun messages
                </span>
            </div>



        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
    name: "ConversationComponent",

    data(){
        return {
            conversations: [],
            conversation: null,

            showMessages: false,

            message_form: null,
            typing: false,
        }
    },

    computed: {
        ...mapState([
            'input_class'
        ]),

        ...mapGetters([
            "getInputClass"
        ]),
    },

    mounted() {
        this.getConversations()
    },

    methods: {
        scrollToBottom(){
            setTimeout(() => {
                const chatbox = this.$refs.chatbox
                chatbox.scrollTop = chatbox.scrollHeight
            }, 50)
        },

        async getConversations() {

            await axios.get( '/api/profile/my_profile/chatroom' )
                .then( response => {
                    const data = response.data
                    const unread_conversations = data.filter( conversation => conversation.read === 0 ).length

                    this.$store.commit( 'update_message_count', unread_conversations )

                    data.forEach( conversation => {
                        const message = conversation.messages[0].message
                        const dots = message.length > 20 ? " ..." : ""

                        this.conversations.push( {
                            conversation_key: conversation.conversation_key,
                            from_name: conversation.from_name,
                            last_message: message.substr( 0, 20 ) + dots,
                            creation_date: conversation.creation_date,
                            read: conversation.read,
                        } )

                    } )

                } )
                .catch(err => {
                    console.log(err.message)
                })

        },


        async getMessages(index){
            const conversation = this.conversations[index]
            const url = `/api/profile/my_profile/chatroom_messages/${conversation.conversation_key}?api=1`

            await axios.get(url)
                .then(response => {
                    
                    this.scrollToBottom()

                    this.conversation = response.data
                    this.$refs.msg_input.value = ""

                    conversation.read = 1

                    this.showMessages = true

                    const unread_conversations = this.conversations.filter(conversation => conversation.read === 0).length

                    this.$store.commit('update_message_count', unread_conversations)
                })
                .catch(err => {
                    console.log(err.message)
                })

        },


        async send_message(){
            const form = new FormData
            form.append('message', this.message_form)
            form.append('from_email', this.conversation.from_email)
            form.append('direction', 'from_seller')

            await axios.post(`/api/annonces/${ this.conversation.post.slug }/send_message`, form)
                .then( response => {

                    if (response.data.success) {
                        this.typing = false
                        this.$refs.msg_input.value = ""
                        this.conversation.messages.push(response.data.message)

                        this.scrollToBottom()

                    }
                    else {
                        this.$swal({
                            icon: "error",
                            title: "Erreur",
                            text: 'Une erreur est survenue lors de l\'envoi de votre message.\n' +
                                `Merci de contacter notre support.`
                            // + `${result.data}`
                        })
                    }
                })
                .catch(err => {
                    console.log(err.message)
                })
        },

        is_typing($event){
            this.message_form = $event.target.value.replace(/\n/g, '<br/>')

            this.typing = $event.target.value !== ""
            if ($event.target.value !== "") {
                this.scrollToBottom()
            }

        },
    },
}
</script>

<style scoped>

</style>
