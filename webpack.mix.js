const mix = require( 'laravel-mix' )
const path = require( 'path' )

/**
 * By default, AdonisJS public path for static assets is on the `./public` directory.
 *
 * If you want to change Laravel Mix public path, change the AdonisJS public path config first!
 * See: https://docs.adonisjs.com/guides/static-assets#the-default-directory
 */
mix.setPublicPath( 'public' )

mix.js( 'resources/js/app.js', path.resolve( __dirname, 'public/js' ) )
        .webpackConfig( {
            context: __dirname,
            node: {
                __filename: true,
                __dirname: true,
            },
            resolve: {
                alias: {
                    '@': path.resolve( __dirname, 'resources/js' ),
                    '~': path.resolve( __dirname, 'resources/js' ),
                    '@css': path.resolve( __dirname, 'resources/css' ),
                },
            },
        } )
        .css( 'resources/css/app.css', 'public/css', [
            require( "tailwindcss" ),
        ] )
        .options( {
            processCssUrls: false,
        } )
        .vue()
        .sourceMaps()
        .disableNotifications()
// Add your assets here
