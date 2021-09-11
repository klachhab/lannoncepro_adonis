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
  // const categs = await Category.query()
  //     .whereDoesntHave('parent', () => {})
  //     .preload('subs', sub => {
  //       sub.withCount('posts')
  //     })
  //
  // const categories = []
  //
  // categs.forEach(categ => {
  //   var posts_count = 0;
  //   categ.subs.forEach(sub => {
  //     posts_count += sub.$extras.posts_count
  //   })
  //   categories.push({
  //     name: categ.name,
  //     posts_count
  //   })
  // })

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
    // categories: categories.sort((a,b) => {
    //   return b.posts_count - a.posts_count
    // })
  }
  return view.render('home', {
      categories: sub_categs,
      cities: top_cities,
      featured: featured_categs,
  })
})
    .as('home')




// API Routes
Route.group( () => {

    Route.resource('cities', 'CitiesController')
    Route.resource('departments', 'DepartmentsController')
    Route.resource('users', 'UsersController')

    Route.resource('posts', 'Post/PostsController')
    Route.resource('post_galleries', 'Post/PostGalleriesController')
        .only(['store', 'destroy'])
        .as('store_gallery')

    Route.resource('post_reviews', 'Post/PostReviewsController')
        .only(['store', 'update', 'destroy'])
        .as('store_review')

}).prefix('/api')
