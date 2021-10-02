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
import Category from "App/Models/Category";
import City from "App/Models/City";

// WEB Routes
Route.get('/', async ({view}) => {
    const categories = await Category.query()
        .has('parent')
        .preload('parent', parent => {
            parent.select('name', 'id')
        })
        .withCount('posts', posts => {
            posts.where('is_valid', 1)
        })
        .select('id', 'name', 'slug')
        .limit(15)
        // .pojo()

    const cities = await City.query()
        .withCount('posts', posts => {
            posts.where('is_valid', 1)
        })
        .select('id', 'name', 'code')
        .limit(14)
        .pojo()

    // return {
    //     categories,
    //     // @ts-ignore
    //     cities: cities.sort( (a,b) => b.posts_count - a.posts_count),
    // }

    return view.render('home',{
        categories: categories.sort( (a,b) => b.$extras.posts_count - a.$extras.posts_count),
        // @ts-ignore
        cities: cities.sort( (a,b) => b.posts_count - a.posts_count),
    })

}).as('home')

// Web
Route.group(() => {

    // Auth
    Route.group(() => {

        Route.route('/login', ['GET', 'POST'], 'AuthController.login')
            .as('login')

        Route.post('/logout', 'AuthController.logout')
            .as('logout')
            .middleware('auth')

        Route.get('/register', 'UsersController.create')
            .as('register')

    }).prefix('auth').as('auth')

    Route.resource('profile', 'UsersController')
        .except(['create'])
        .middleware({
            edit: 'auth:web,api',
            show: 'auth:web',
        })

}).as("web")


// API Routes
Route.group(() => {

    Route.resource('cities', 'CitiesController').apiOnly()
    Route.resource('departments', 'DepartmentsController').apiOnly()
        .only(['show', 'index'])

    // Profile -------------------------------------
    Route.group(() => {
        Route.resource('profile', 'UsersController')
            .apiOnly()
            .middleware({
                show: 'auth:api',
                update: 'auth:api',
                destroy: 'auth:api',
            })

        Route.post('profile/:username/restore', 'UsersController.restore')
            .as('profile.restore')
            .middleware('auth:api')

        Route.delete('profile/:username/force-delete', 'UsersController.forceDelete')
            .as('profile.forceDelete')
            .middleware('auth:api')

    }).as("users_actions")

    // Posts -------------------------------------
    Route.group(() => {
        Route.resource('posts', 'Post/PostsController').apiOnly()

        Route.post('posts/:slug/restore', 'Post/PostsController.restore')
            .as('posts.restore')

        Route.delete('posts/:slug/force-delete', 'Post/PostsController.forceDelete')
            .as('posts.forceDelete')

        Route.post('posts/:slug/favourite', 'Post/PostsController.addToFavourite')
            .as('posts.addToFavourite')

        Route.post('posts/:slug/add_review', 'Post/PostsController.addReview')
            .as('posts.attachReview')

        Route.post('posts/:slug/add_report', 'Post/PostsController.addReport')
            .as('posts.addReport')

    }).as("posts_actions")

}).prefix('/api').as("api")
