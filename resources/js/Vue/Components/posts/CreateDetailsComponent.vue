<template>

</template>

<script>
export default {
    name: "CreateDetailsComponent",
    props: ['category_id', 'user_city'],

    data(){
        return {
            container: "max-w-xs xl:max-w-6xl lg:max-w-4xl md:max-w-lg sm:max-w-xl",

            form: {
                reason: 'sell',
                title: null,
                description: null,
                condition: 'new',
                price: 0,
                negotiable: false,
                delivery_mode: null,

                city_id: Number.parseInt(this.user_city),

                video_type: null,
                video_link: null,

                photos: [],
                photos_urls: [],
            },

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

        }
    },

    computed: {
        videoLink() {
            return this.form.video_link.includes('youtube') ?
                this.form.video_link.replace('/watch?v=', '/embed/') :
                this.form.video_link.includes('dailymotion') ?
                    this.form.video_link.replace('com/video/', 'com/embed/video/') :
                    this.form.video_link.includes('vimeo') ? this.form.video_link.replace('//vimeo.com/',
                        '//player.vimeo.com/video/') + '?title=0&portrait=0' : null;
        },

        description(){
            const description = this.form.description.replace(/\n/g, '<br/>')

            if (this.form.description){
                return description.replace(/\n/g, '<br/>')
            }
            return null
        }
    },

    methods: {

        isSameCity(value){
            if (value === 'not_same'){
                this.form.city_id = null
                this.selectedDep = null
            }
        },

        async getCities(){

            this.form.city_id = null

            await axios.post(`/api/departments/${ this.selectedDep}`)
                .then( resp => {
                    if (!resp.data.success){
                        alert('Une erreur est survenu lors de la récupération de la liste des villes')
                    }
                    this.cities = resp.data.cities
                    return resp.data.cities
                })
                .catch( err => {
                    return err
                })
        },


        async save(){

            this.saving = true
            const form = new FormData

            form.append('title', this.form.title)
            form.append('description', this.description)
            form.append('condition', this.form.condition)
            form.append('price', this.form.price)
            form.append('negotiable', this.form.negotiable)
            form.append('delivery_mode_id', this.form.delivery_mode)
            form.append('category_id', Number.parseInt(this.category_id))

            form.append('same_city', this.same_city)

            form.append('video_type', this.form.video_type)

            if (this.form.video_link){
                form.append('video_link',this.videoLink)
            }

            if (this.same_city === 'not_same'){
                form.append("city_id", this.form.city_id)
            }

            if (this.form.photos.length){
                this.form.photos.forEach( photo => {
                    form.append('images[]', photo)
                })
            }

            await axios.post('/api/annonces', form, {
                onUploadProgress: (progressEvent => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    console.log(`${percentCompleted}%`)
                }),
            })
                .then( response => {
                    this.saving = false

                    if (response.data.success){
                        window.location.replace(`/annonces/${response.data.post.slug}`)
                    }

                    else  {
                        alert(
                            `Une erreur est survenu lors de la création de votre annonce.
                            ${response.data}
                            `
                        )
                        this.saving = false
                    }
                })
                .catch( error => {
                    this.saving = false
                    alert(`Une erreur est survenu lors de la création de votre annonce. ${error}`)
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

    },
}
</script>

<style scoped>

</style>
