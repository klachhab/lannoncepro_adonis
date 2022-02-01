
<script>
import {mapMutations, mapState} from "vuex";

export default {
    name: "MainComponent",

    props: [ 'username', 'my_username', 'is_online'],

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
                    label: "Paramètres",
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

            open: false,
        }
    },

    created() {
        this.setUserName(this.username)

        this.setIsMyProfile(this.username === this.my_username)

        if (this.isMyProfile && !window.location.pathname.includes('mon-profil')){
            this.$router.push({
                name: "ads",
            })
            .catch( () => {})
        }
    },

    computed: {
        ...mapState([
            'container', 'messages_count', 'isMyProfile', 'user_name'
        ]),

    },

    methods: {
        ...mapMutations([
            'setIsMyProfile', 'update_message_count', 'setUserName'
        ]),

        async resend_verification_email() {
            await axios.post( '/auth/verify' )
                .then( response => {
                    const success = response.data.success

                    if (success) {
                        this.$swal({
                            icon: 'success',
                            html: "<p class='mb-3'>Merci de vérifier votre boite e-mail afin de valider votre compte</p>",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: false,

                        })
                    }
                    this.$swal( {
                        icon: 'error',
                        text: "Une erreur est survenue lors de la création de votre compte. Merci de contacter notre support",
                    } );
                })
                .catch( e => {
                    this.$swal( {
                        icon: 'error',
                        text: "Une erreur est survenue lors de la création de votre compte. Merci de contacter notre support",
                    } );
                } )
        },

        deleteAccount(){

            this.$swal({
                icon: "warning",
                title: "Supprimer votre compte",
                text: 'Êtes-vous sûr de vouloir supprimer votre compte.',
                showCancelButton: true,
                confirmButtonText: 'Confirmer',
                cancelButtonText: `Annuler`,
            }).then( async result => {

                if ( result.isConfirmed ){
                    await axios.delete(`/api/profile/p/${ this.username }`)
                        .then(() => {

                            this.$swal('Votre compte a été supprimé', '', 'success')
                                .then( () => {
                                    window.location.replace('/')
                                })
                        })
                        .catch(err => {
                            this.$swal( {
                                icon: 'error',
                                text: "Une erreur est survenue lors de la création de votre compte. Merci de contacter notre support",
                            } );
                        })
                }
            })

        }
    }


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
