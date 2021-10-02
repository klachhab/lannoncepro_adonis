<template>

    <h1 class="center">
        {{ message }}
    </h1>

</template>

<script>

export default {
    name: "HomeComponent",
    props: ['categories'],

    components: {
    },

    data() {
        return {
            message: this.categories
        }
    },

    methods: {

    },
}
</script>

<style lang="scss">

</style>
