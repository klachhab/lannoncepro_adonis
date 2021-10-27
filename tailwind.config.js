module.exports = {
    mode: 'jit',
    purge: [
        './resources/**/*.edge',
        './resources/**/*.js',
        './resources/**/*.vue',
    ],
    darkMode: false, // or 'media' or 'class'

    daisyui: {
        // styled: false,
        themes: false,
        // rtl: false,
    },
    theme: {
        extend: {
            textColor: {
                'map': "#0072bc",
            },
        },
    },
    variants: {
        extend: {
            opacity: ['disabled'],
            cursor: ['disabled'],
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/aspect-ratio'),
        require('daisyui')
    ],
}
