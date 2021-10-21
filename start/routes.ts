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

    })
        .prefix('auth')
        .as('auth')

    // Profile -------------------------------------
    Route.resource('profile', 'UsersController')
        .except(['create'])
        .middleware({
            edit: 'auth:web,api',
            show: 'auth:web',
        })
        .as('profile')

    Route.get('/verify', 'UsersController.verify')
        .as('verify')

    // Posts -------------------------------------
    Route.resource('annonces', 'Post/PostsController')
        .only(['index', 'show','create'])
        .middleware({
            create: 'auth:web',
        })
    Route.post('/annonces/create/details', 'Post/PostsController.details')
        .as('post.create.details')
        .middleware('auth:web')

}).as("web")


// API Routes
Route.group(() => {

    Route.resource('cities', 'CitiesController').apiOnly()
        .only(['index'])
    Route.post('cities/:id', 'CitiesController.show').as('cities.show')

    // departments ----------------------------------------------------------------
    Route.group( () => {

        Route.get('/', 'DepartmentsController.index')
            .as('departments.index')

        Route.post('/:code', 'DepartmentsController.show')
            .as('departments.show')

    }).prefix('/departments').as('departments')

    // Profile ---------------------------------------------------------------------
    Route.group(() => {
        Route.resource('', 'UsersController')
            .apiOnly()
            .middleware({
                show: 'auth:api',
                update: 'auth:api',
                destroy: 'auth:api',
            })

        Route.post('/:username/restore', 'UsersController.restore')
            .as('profile.restore')
            .middleware('auth:api')

        Route.delete('/:username/force-delete', 'UsersController.forceDelete')
            .as('profile.forceDelete')
            .middleware('auth:api')

        Route.post('/is_unique', 'UsersController.is_unique')
            .as('profile.is_unique')

    }).as("users_is_unique").prefix('/profile')

    // Posts ----------------------------------------------------------------------
    Route.group(() => {
        Route.resource('', 'Post/PostsController')
            .except(['index', 'show'])
            .apiOnly()
            // .middleware({
            //     edit: 'auth:web,api',
            //     show: 'auth:web',
            // })

        Route.post(':slug/restore', 'Post/PostsController.restore')
            .as('annonces.restore')

        Route.delete(':slug/force-delete', 'Post/PostsController.forceDelete')
            .as('annonces.forceDelete')

        Route.post(':slug/favourite', 'Post/PostsController.addToFavourite')
            .as('annonces.addToFavourite')

        Route.post(':slug/add_review', 'Post/PostsController.addReview')
            .as('annonces.attachReview')

        Route.post(':slug/add_report', 'Post/PostsController.addReport')
            .as('annonces.addReport')

    }).prefix('annonces').as("posts_actions")

    // Category -------------------------------------------------------------------
    Route.post('/category', 'CategoriesController.show')
        .as('category.show')

}).prefix('/api').as("api")
