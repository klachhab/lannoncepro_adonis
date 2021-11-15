<script>
import {mapState} from "vuex";

export default {
    name: "ChatroomComponent",
    props: ['conversation_key', 'post_slug', 'from_name', 'from_email'],

    data() {
        return {
            messages: [],

            message_form: "",
            typing: false,
        }
    },

    computed: {
        ...mapState([
            'container'
        ]),

    },

    mounted() {
        this.getMessages()
        this.scrollToBottom()
    },

    methods: {

        scrollToBottom(){
            setTimeout(() => {
                var chatbox = this.$refs.chatbox
                chatbox.scrollTop = chatbox.scrollHeight
            }, 50)
        },

        async getMessages(){

            await axios.get(`/chatroom?room_id=${ this.conversation_key }&api=1`)
                .then(response => {
                    this.messages = response.data.messages

                    this.scrollToBottom()

                    return response.data.messages
                })

        },


        async send_message() {

            const form = new FormData
            form.append('message', this.message_form)
            form.append('from_email', this.from_email)
            form.append('direction', 'from_user')

            await axios.post(`/api/annonces/${ this.post_slug }/send_message`, form)
                .then( response => {

                    if (response.data.success) {
                        this.typing = false
                        this.$refs.msg_input.value = ""
                        this.messages.push(response.data.message)

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

        },

        is_typing($event){
            this.message_form = $event.target.value.replace(/\n/g, '<br/>')

            this.typing = $event.target.value !== ""
            if ($event.target.value !== "") {
                this.scrollToBottom()
            }

        }

    },
}
</script>

<style scoped>

</style>
