module.exports = {
    mode: 'jit',
    purge: [
        './resources/**/*.edge',
        './resources/**/*.js',
        './resources/**/*.vue',
    ],
    darkMode: false, // or 'media' or 'class'

    daisyui: {
        styled: false,
        themes: false,
        rtl: false,
    },
    theme: {
        extend: {
            textColor: {
                'map': "#0072bc",
                'map-hover': "#00a651",
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
        // require('@tailwindcss/forms'),
        require('daisyui')
    ],
}
