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
import Department from 'App/Models/Department';
import axios from 'axios';

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


Route.get('/tests', async ({}) => {
    
    const departments = await Department.query()
        .withCount('cities')

    // return { deps}

    // departments.forEach(department => {
        
    //     if (!department.$extras.cities_count) {
    //         axios.get('https://geo.api.gouv.fr/departements/' + department.code + '/communes')

    //             .then(async (result) => {
    //                 await result.data.forEach(async city => {
    //                     await department.related('cities').create({
    //                         name: city.nom,
    //                         code: city.code,
    //                         departmentId: department.id
    //                     })
    //                 });
    //             })
    //             .catch((err) => {
    //                 return 
    //             });
    //     }

    return { departments}

    });
    
    

    
})

// API Routes
Route.group( () => {

    Route.resource('cities', 'CitiesController').apiOnly()
    Route.resource('departments', 'DepartmentsController')
        // .only(['show', 'index'])

    Route.resource('profile', 'UsersController')
    Route.post('profile/:username/restore', 'UsersController.restore')
        .as('profile.restore')
    Route.delete('profile/:username/force-delete', 'UsersController.forceDelete')
        .as('profile.forceDelete')


    Route.resource('posts', 'Post/PostsController')
    Route.post('posts/:slug/restore', 'Post/PostsController.restore')
        .as('posts.restore')
    Route.delete('posts/:slug/force-delete', 'Post/PostsController.forceDelete')
        .as('posts.forceDelete')


    Route.resource('post_galleries', 'Post/PostGalleriesController')
        .only(['destroy'])

    Route.resource('post_reviews', 'Post/PostReviewsController')
        .apiOnly()
        .except(['show'])

    Route.resource('post_reports', 'Post/PostReportsController')
        .apiOnly()
        .except(['show'])

}).prefix('/api')
