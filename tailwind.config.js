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

            height: {
                '112': '28rem',
                '128': '32rem',
            }
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
