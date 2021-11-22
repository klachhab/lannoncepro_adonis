
<script>
import {mapState} from "vuex";

export default {
    name: "MainComponent",

    props: ['unread_messages_count', 'username'],

    data() {
        return {
            side_menu: [
                {
                    label: "Mes annonces",
                    color: "hover:text-blue-700",
                    mobile_color: "hover:bg-blue-500",
                    route_name: 'ads'
                },
                {
                    label: "Mes messages",
                    color: "hover:text-blue-700",
                    mobile_color: "hover:bg-blue-500",
                    route_name: 'messages',
                    count: 0
                },
                {
                    label: "Mes favoris",
                    color: "hover:text-blue-700",
                    mobile_color: "hover:bg-blue-500",
                    route_name: 'favourite_ads'
                },
                {
                    label: "En attente de validation",
                    color: "hover:text-blue-700",
                    mobile_color: "hover:bg-blue-500",
                    route_name: 'pending_ads'
                },
                {
                    label: "Mes infos",
                    color: "hover:text-blue-700",
                    mobile_color: "hover:bg-blue-500",
                    route_name: 'profile_infos'
                },
                // {
                //     label: "Supprimer mon compte",
                //     color: "hover:text-red-700",
                //     mobile_color: "hover:bg-red-500",
                //     route_name: 'delete_acccount'
                // },
            ],
        }
    },

    created() {
        this.$store.commit('update_message_count', Number.parseInt(this.unread_messages_count))
        this.$store.commit('setUserName', this.username)
    },

    computed: {
        ...mapState([
            'container', 'messages_count'
        ]),

    },



}
</script>

<style scoped>

#container {
    background-image: url('/images/bg/login_bg.png');
    background-size: cover;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

</style>
