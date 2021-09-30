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
Route.get('/', async ({ view }) => {
  const sub_categs = await Category.query()
      .whereHas('parent', () => {})
      .whereHas('posts', (post) => {
        post.where('is_valid', true)
      })
      .withCount('posts', (post) => {
        post.as('posts_count')
      })
      .limit(10)
      .orderBy('posts_count', 'desc')

  const top_cities = await City.query()
      .whereHas('posts', () => {})
      .withCount('posts', (post) => {
        post.as('posts_count')
      })
      .orderBy('posts_count', 'desc')
      .limit(14)

  const featured_categs = await Category.query()
      .whereHas('posts', (post) => {
        post.where('is_valid', true)
            .andWhere('featured', true)
      })
      .limit(10)

  return {
      categories: sub_categs,
      cities: top_cities,
      featured: featured_categs,
  }

  return view.render('home', {
      categories: sub_categs,
      cities: top_cities,
      featured: featured_categs,
  })

}).as('home')




// API Routes
Route.group( () => {

    Route.resource('cities', 'CitiesController').apiOnly()
    Route.resource('departments', 'DepartmentsController').apiOnly()
        // .only(['show', 'index'])

    // Profile -------------------------------------
    Route.group( () => {
        Route.resource('profile', 'UsersController').apiOnly()
        Route.post('profile/:username/restore', 'UsersController.restore')
            .as('profile.restore')
        Route.delete('profile/:username/force-delete', 'UsersController.forceDelete')
            .as('profile.forceDelete')
    }).as("users_actions")

    // Posts -------------------------------------
    Route.group( () => {
        Route.resource('posts', 'Post/PostsController').apiOnly()

        Route.post('posts/:slug/restore', 'Post/PostsController.restore')
            .as('posts.restore')

        Route.delete('posts/:slug/force-delete', 'Post/PostsController.forceDelete')
            .as('posts.forceDelete')

        Route.post('posts/:slug/favourite', 'Post/PostsController.addToFavourite')
            .as('posts.addToFavourite')

        Route.post('posts/:slug/add_review', 'Post/PostsController.addReview')
            .as('posts.attachReview')

    }).as("posts_actions")


    // Route.resource('post_galleries', 'Post/PostGalleriesController')
    //     .only(['destroy'])
    //
    // Route.resource('post_reviews', 'Post/PostReviewsController')
    //     .apiOnly()
    //     .except(['show'])
    //
    // Route.resource('post_reports', 'Post/PostReportsController')
    //     .apiOnly()
    //     .except(['show'])

}).prefix('/api')
