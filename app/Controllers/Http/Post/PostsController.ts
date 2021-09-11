import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from "App/Models/Post/Post";

export default class PostsController {

    public async index ({request}: HttpContextContract) {
      const posts = await Post.query()
          .preload('user', builder => {
              builder.select('is_pro')
            })
          .preload('city',builder => {
              builder
                  .select('name', 'department_id')
                  .preload('department', builder => {
                      builder.select('name')
                  })
          })
          .preload('category', builder => {
              builder.select('name', 'category_id')
                  .preload('parent', builder => {
                      builder.select('name')
                  })
          })
          .select('id', 'user_id', 'category_id', 'city_id',
              'title', 'price', 'negotiable'
          )
          .paginate(request.qs().page, 10)

    return { posts }
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
  }

  public async show ({params}: HttpContextContract) {
      const post = await Post.query()
          .where('slug', params.id)
          .first()

      await post?.load('images', image => {
          image.select('path')
      })
      await post?.load('reviews', review => {
          review
              .preload('user', user => {
                  user.select('name', 'picture')
              })
      })
      await post?.load('user', user => {
          user.select('name', 'is_pro')
      })

      return {
          post,
      }
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
