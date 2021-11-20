
<script>
import {mapState} from "vuex";

export default {
    name: "MainComponent",

    props: ['unread_messages_count'],

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
                    route_name: 'favourites'
                },
                {
                    label: "En cours de validation",
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

    mounted() {
        this.$store.commit('update_message_count', Number.parseInt(this.unread_messages_count))
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
    transition: opacity .25s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

</style>
