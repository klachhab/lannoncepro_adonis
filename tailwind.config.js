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
