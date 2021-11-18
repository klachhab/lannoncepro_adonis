
<script>
import {mapState} from "vuex";

export default {
    name: "MainComponent",

    props: ['unread_messages_count'],

    data() {
        return {
            side_menu: [
                {
                    label: "Mon profil",
                    color: "hover:text-blue-700",
                    mobile_color: "hover:bg-blue-500",
                    link: "#",
                    route_name: 'profile'
                },
                {
                    label: "Mes annonces",
                    color: "hover:text-blue-700",
                    mobile_color: "hover:bg-blue-500",
                    link: "#",
                    route_name: 'ads'
                },
                {
                    label: "Mes messages",
                    color: "hover:text-blue-700",
                    mobile_color: "hover:bg-blue-500",
                    link: "#",
                    route_name: 'messages',
                    count: 0
                },
                {
                    label: "Mes favoris",
                    color: "hover:text-blue-700",
                    mobile_color: "hover:bg-blue-500",
                    link: "#",
                    route_name: 'favourites'
                },
                {
                    label: "En cours de validation",
                    color: "hover:text-blue-700",
                    mobile_color: "hover:bg-blue-500",
                    link: "#",
                    route_name: 'pending_ads'
                },
                {
                    label: "Supprimer mon compte",
                    color: "hover:text-red-700",
                    mobile_color: "hover:bg-red-500",
                    link: "#",
                    route_name: 'delete_acccount'
                },
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

</style>
