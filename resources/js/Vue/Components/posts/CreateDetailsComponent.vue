<script>

import { mapGetters, mapState } from "vuex";
import Swal from "sweetalert2";


export default {
    name: "CreateDetailsComponent",
    props: ['category_id'],

    components: {
    },
    data(){
        return {
            container: "max-w-xs xl:max-w-6xl lg:max-w-4xl md:max-w-lg sm:max-w-xl",
            selected: null,

            // Form ------------------------------------------
            form: {
                reason: 'sell',
                title: "",
                description: "",
                condition: 'new',
                price: "",
                negotiable: false,
                delivery_mode: "",


                video_type: "",
                video_link: "",

                photos: [],
                photos_urls: [],

                city: {
                    same: true,
                    name: "",
                    code: "",
                    // lon < lat
                    geo_coordinates: {
                        longitude: "",
                        latitude: "",
                    },
                    department: {
                        name: "",
                        code: "",
                    },
                }
            },
            errors: {},
            // Form ------------------------------------------

            same_city: 'same',
            cities: [],
            selectedDep: null,

            conditions_accepted: false,
            saving: false,

            videoPlayerOptions: {
                fluid: true,
                muted: false,
                language: 'fr',
                controls: true,
                controlBar: {
                    remainingTimeDisplay: true,
                },
                sources: [{
                    type: 'video/mp4',
                    src: null
                }],
            },

            foundAddresses: {
                list: [],
                show_list: false,
                loading: false,
            },

            selected_address: null

        }
    },

    computed: {
        ...mapState([
            'username', 'input_class', 'password_match', 'select_class'
        ]),

        ...mapGetters([
            "getPasswordMatchClass",
            "getInputClass",
        ]),

        videoLink() {
            if ( !this.form.video_link) {
                return
            }
            return this.form.video_link.includes('youtube') ?
                this.form.video_link.replace('/watch?v=', '/embed/') :
                this.form.video_link.includes('dailymotion') ?
                    this.form.video_link.replace('com/video/', 'com/embed/video/') :
                    this.form.video_link.includes('vimeo') ? this.form.video_link.replace('//vimeo.com/',
                        '//player.vimeo.com/video/') + '?title=0&portrait=0' : '';
        },

        description(){
            const description = this.form.description

            if (this.form.description){
                return description.replace(/\n/g, '<br/>')
            }
            return ""
        },

        focus_price_class() {
            return this.selected === 'price' ? this.select_class.focused : this.select_class.unfocused
        },
    },

    methods: {

        isSameCity($event){
            delete this.errors.city_id
            const value = $event.target.value

            this.selected_address = null

            this.form.city = {
                same: JSON.parse(value),
                name: "",
                code: "",
                department: {
                    name: "",
                    code: "",
                },
                geo_coordinates: {
                    longitude: "",
                    latitude: "",
                }
            }
            // this.form.city.name = ""
            // this.form.city.code = ""
            //
            // this.form.city.department = {
            //     name: "",
            //     code: "",
            // }
        },

        async getCities(){

            this.form.city_id = null

            await axios.post(`/api/departments/${ this.selectedDep}`)
                .then( resp => {
                    if (!resp.data.success){
                        alert('Une erreur est survenu lors de la récupération de la liste des villes')
                        return
                    }
                    this.cities = resp.data.department.cities
                })
                .catch( err => {
                    return err
                })
        },


        // Media -------------------------------------------
        addPics(event) {
            let files = event.target.files;
            var hasError = false


            if (files.length) {
                for (let i = 0; i < files.length; i++) {

                    if (files[i].size > 2097152) {
                        hasError = true
                    } else {
                        var hasPhoto = this.form.photos.some(photo => photo.name === files[i].name);
                        if (!hasPhoto) {

                            this.form.photos.push(files[i])
                            this.form.photos_urls.push(URL.createObjectURL(files[i]))

                        }
                    }
                }

                if (hasError) {
                    alert('La taille d\'une ou plusieurs image(s) selectionné(s) dépasse les 2Mo')
                }
            }
        },

        removePic(index) {

            this.form.photos.splice(index, 1);
            this.form.photos_urls.splice(index, 1);
            this.$refs.localPics.reset();

            console.log(this.form.photos)
        },

        addVideo(event) {
            delete this.errors.video_link
            let video = event.target.files[0];

            this.videoPlayerOptions.sources[0].src = URL.createObjectURL(video)
            this.form.video_link = video

        },

        resetVideo(){
            const video = this.$refs.localVideo

            if (video){
                this.$refs.localVideo.reset();
                this.$refs.localVideo = null
            }

            this.form.video_link = null
        },


        // Search address -------------------------------
        async searchAddress($event){

            const value = $event.target.value

            if ( value === '' ){
                this.foundAddresses.list = []
                this.foundAddresses.show_list = false
                return
            }

            this.foundAddresses.show_list = true
            this.foundAddresses.loading = true

            // type=street | locality | municipality | housenumber
            await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${ value }&type=municipality&limit=10`)
                .then( resp => {
                    this.foundAddresses.list = resp.data.features
                })
                .catch( () => {
                    this.foundAddresses.list = []
                    this.foundAddresses.show_list = false
                })

            this.foundAddresses.loading = false
        },


        selectAddress(address) {
            delete this.errors.city_id
            const contextArr = address.properties.context.split(', ')

            this.selected_address = address.properties.label
            this.foundAddresses.show_list = false
            this.foundAddresses.list = []


            this.form.city.name = address.properties.city
            this.form.city.code = address.properties.citycode

            this.form.city.geo_coordinates = {
                longitude: address.geometry.coordinates[0],
                latitude: address.geometry.coordinates[1],
            }

            this.form.city.department = {
                code: contextArr[0],
                name: contextArr[1],
            }
        },

        // Submit -------------------------------------------

        async save(){

            this.saving = true
            const form = new FormData
            const city = this.form.city
            const geometry = this.form.city.geo_coordinates

            form.append('same_city', city.same)
            form.append('city_code', city.code)
            form.append('city_name', city.name)
            form.append('longitude', geometry.longitude)
            form.append('latitude', geometry.latitude)
            form.append('department_code', city.department.code)

            form.append('title', this.form.title)
            form.append('reason', this.form.reason)
            form.append('description', this.description)
            form.append('condition', this.form.condition)
            form.append('price', this.form.price)
            form.append('negotiable', this.form.negotiable)
            form.append('delivery_mode_id', this.form.delivery_mode)
            form.append('category_id', this.category_id)

            form.append('video_type', this.form.video_type)
            form.append('video_link',this.form.video_type === "iframe" ? this.videoLink : this.form.video_link)

            this.form.photos.forEach( photo => {
                form.append('photos[]', photo)
            })



            await axios.post('/api/annonces/annonce', form, {
                // onUploadProgress: (progressEvent => {
                //     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                //     console.log(`${percentCompleted}%`)
                // }),
            })
                .then( response => {

                    const success = response.data.success
                    const data = response.data


                    if (!success) {
                        if ( response.data.error === "validation" ) {
                            this.errors = data.result
                            // console.log(data.result)
                        }

                        else {
                            Swal.fire( {
                                icon: 'error',
                                html: "Une erreur est survenue lors de la création de votre compte.<br/>Merci de contacter notre support",
                            } );
                        }

                    }
                    else {
                        Swal.fire( {
                            icon: 'success',
                            html: "Votre annonce a bien été ajouter.<br/>Vous receverai un e-mail après la verification",
                        } )
                        .then( () => {
                            window.location.replace(`/mon-profil/en-attente`)
                        });
                    }

                })
                .catch( () => {

                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        html: 'Une erreur est survenue lors de l\'ajout de votre annonce.<br/>' +
                            `Merci de contacter notre support.`
                    })
                        .then( () => {
                            // window.location.replace('/')
                        })
                })

            this.saving = false

        },

    },
}
</script>

<style scoped>

</style>
