/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

// WEB Routes
Route.get('/', 'HomeController.index').as('home')

// Web
Route.group(() => {

    // Auth -------------------------------------
    Route.group(() => {

        Route.route('/login', ['GET', 'POST'], 'AuthController.login')
            .as('login')

        Route.get('/register', 'UsersController.create')
            .as('register')

        Route.post('/logout', 'AuthController.logout')
            .as('logout')
            .middleware('auth')

        Route.route('/reset-password', ['GET', 'POST'], 'AuthController.reset_password')
            .as('reset_password')

        Route.put('/update-password',  'AuthController.update_password')
            .as('update_password')

        Route.get('/verify', 'AuthController.verify')
            .as('verify')

    })
        .prefix('auth')
        .as('auth')

    // Profile -------------------------------------
    Route.resource('profil', 'UsersController')
        .only(['store','show'])
        .as('profile')

    Route.get('/mon-profil/:any?', 'UsersController.show')
        .middleware('auth:web,api')
        .where('any', '.*')
        .as('my_profile')

    // Posts -------------------------------------
    Route.resource('annonces', 'Post/PostsController')
        .only(['index', 'show','create'])
        .middleware({
            create: 'auth:web',
        })
    Route.post('/annonces/create/details', 'Post/PostsController.details')
        .as('post.create.details')
        .middleware('auth:web')

    // Conversations -------------------------------------
    Route.get('chatroom/:room_id', 'ConversationsController.show')
        .as('chatroom')
        .middleware('guest')

}).as("web")


// API Routes
Route.group(() => {

    Route.post('/messages-count', 'HomeController.messagesCount')
        .as('messagesCount')

    Route.get('/filter-home', 'HomeController.filterHome')
        .as('filterHome')

    // cities ----------------------------------------------------------------

    Route.post('cities/:dep_code', 'CitiesController.index')
        .as('cities.index')

    // Route.get('cities/:code', 'CitiesController.show')
    //     .as('cities.show')
    //     .middleware('auth:web,api')

    // departments ----------------------------------------------------------------
    Route.group( () => {

        Route.post('/', 'DepartmentsController.index')
            .as('departments.index')
            // .middleware('auth:web,api')

        Route.post('/:code', 'DepartmentsController.show')
            .as('departments.show')
            // .middleware('auth:web,api')

        // Route.get('/search/:query', 'DepartmentsController.search')
        //     .as('departments.search')
            // .middleware('auth:web,api')

        Route.route('/:query/cts', ['GET', 'POST'],'DepartmentsController.home_cities')
            .as('departments.home_cities')
            // .middleware('auth:web,api')

    }).prefix('departments')
        .as('departments')

    // Profile ---------------------------------------------------------------------
    Route.group(() => {
        Route.resource('p', 'UsersController')
            .apiOnly()
            .except(['show'])
            .middleware({
                update: 'auth:api,web',
                destroy: 'auth:api,web',
            })


        Route.get('my_profile/chatroom', 'ConversationsController.index')
            .as('profile_conversation')
            .middleware('auth:web,api')


        Route.get('my_profile/chatroom_messages/:room_id', 'ConversationsController.show')
            .as('profile_conversation_messages')
            .middleware('auth:web,api')

        Route.post('my_profile/favourites', 'UsersController.user_favourites')
            .as('profile_favourites')
            .middleware('auth:web,api')

        Route.post('/:username', 'UsersController.show')
            .as('profile.show.api')
            // .middleware('admin')

        Route.post('/:username/posts', 'UsersController.user_posts')
            .as('profile.posts')

        Route.post('/:username/restore', 'UsersController.restore')
            .as('profile.restore')
            .middleware('admin')

        Route.delete('/:username/force-delete', 'UsersController.forceDelete')
            .as('profile.forceDelete')
            .middleware('admin')

        Route.post('/is_unique', 'UsersController.is_unique')
            .as('profile.is_unique')


    }).as("profile")
        .prefix('/profile')

    // Posts ----------------------------------------------------------------------
    Route.group(() => {

        Route.resource('annonce', 'Post/PostsController')
            .except(['index', 'show'])
            .apiOnly()
            .middleware({
                store: 'auth:web,api',
                destroy: 'admin_owner',
            })
            .as('annonces')

        Route.post(':id/restore', 'Post/PostsController.restore')
            .as('annonces.restore')
            .middleware('auth:web,api')

        Route.delete(':slug/force-delete', 'Post/PostsController.forceDelete')
            .as('annonces.forceDelete')
            .middleware('auth:web,api')

        Route.post(':slug/favourite', 'Post/PostsController.addToFavourite')
            .as('annonces.addToFavourite')
            .middleware('auth:web,api')

        Route.post(':slug/add_review', 'Post/PostsController.getAddReview')
            .as('annonces.attachReview')
            .middleware('auth:web,api')

        Route.get(':slug/get_reviews', 'Post/PostsController.getAddReview')
            .as('annonces.getPostReviews')

        // Route.post(':slug/detach_review', 'Post/PostsController.detachReview')
        //     .as('annonces.detachReview')
        //     .middleware('auth:web,api')

        Route.post(':slug/add_report', 'Post/PostsController.addReport')
            .as('annonces.addReport')
            // .middleware('auth:web,api')

        Route.post(':slug/send_message', 'Post/PostsController.sendMessage')
            .as('annonces.sendMessage')
            // .middleware('auth:web,api')

    }).prefix('annonces').as("posts_actions")

    // Category -------------------------------------------------------------------
    Route.post('category', 'CategoriesController.show')
        .as('category.show')
        // .middleware('auth:api,web')

    Route.route('categories', ['GET', 'POST'],'CategoriesController.index')
        .as('categories')
        // .middleware('auth:api,web')
})
    .prefix('api')
    .as("api")
